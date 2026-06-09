import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../../infrastructure/database/UserRepository';
import { rateLimitService } from '../../../infrastructure/cache/RateLimitService';
import { logger } from '../../../infrastructure/logger';

export async function LoginUseCase(
  data: { email: string; password: string },
  ip: string
) {
  // 1. verifica bloqueio por IP antes de qualquer coisa
  const bloqueado = await rateLimitService.estaBloqueado(ip);
  if (bloqueado) {
    logger.warn('[Login] IP bloqueado por excesso de tentativas', { ip });
    throw new Error('Muitas tentativas. Tente novamente em 15 minutos');
  }

  logger.info('Tentativa de login', { email: data.email, ip });

  const user = await UserRepository.findByEmail(data.email);
  if (!user) {
    await rateLimitService.registrarTentativaFalhada(ip);
    logger.warn('Login falhou — usuário não encontrado', { email: data.email });
    throw new Error('Credenciais inválidas');
  }

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) {
    await rateLimitService.registrarTentativaFalhada(ip);
    logger.warn('Login falhou — senha incorreta', { email: data.email });
    throw new Error('Credenciais inválidas');
  }

  // login bem-sucedido — limpa o contador
  await rateLimitService.resetar(ip);

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'frella_secret_key',
    { expiresIn: '7d' }
  );

  logger.info('Login realizado com sucesso', { userId: user.id, role: user.role });
  return { token, user: { id: user.id, email: user.email, role: user.role } };
}