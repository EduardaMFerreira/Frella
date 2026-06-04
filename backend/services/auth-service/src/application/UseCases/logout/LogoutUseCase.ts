import { tokenBlacklistService } from '../../../infrastructure/cache/TokenBlacklistService';
import { logger } from '../../../infrastructure/logger';

export async function LogoutUseCase(token: string): Promise<void> {
  logger.info('[Logout] Invalidando token');
  await tokenBlacklistService.adicionar(token);
  logger.info('[Logout] Token invalidado com sucesso');
}