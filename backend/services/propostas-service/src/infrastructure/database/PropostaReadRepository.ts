import { pool } from './connection';
import { PropostaReadModel } from '../../application/readModel/PropostaReadModel';

export const PropostaReadRepository = {

  async upsert(proposta: PropostaReadModel): Promise<void> {
    await pool.query(
      `INSERT INTO propostas_read_model 
        (id, titulo, descricao, valor, status, cliente_id, prestador_id, criada_em, atualizada_em)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO UPDATE SET
        titulo = EXCLUDED.titulo,
        descricao = EXCLUDED.descricao,
        valor = EXCLUDED.valor,
        status = EXCLUDED.status,
        atualizada_em = EXCLUDED.atualizada_em`,
      [
        proposta.id,
        proposta.titulo,
        proposta.descricao,
        proposta.valor,
        proposta.status,
        proposta.cliente_id,
        proposta.prestador_id,
        proposta.criada_em,
        proposta.atualizada_em,
      ]
    );
  },

  async remover(id: string): Promise<void> {
    await pool.query(
      `DELETE FROM propostas_read_model WHERE id = $1`,
      [id]
    );
  },

  async buscarPorId(id: string): Promise<PropostaReadModel | null> {
    const result = await pool.query(
      `SELECT * FROM propostas_read_model WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  // ✅ Filtros direto no banco — mais eficiente que filtrar em memória
  async listarTodas(filtros?: {
    cliente_id?: string;
    prestador_id?: string;
  }): Promise<PropostaReadModel[]> {
    const condicoes: string[] = [];
    const valores: string[] = [];
    let indice = 1;

    if (filtros?.cliente_id) {
      condicoes.push(`cliente_id = $${indice++}`);
      valores.push(filtros.cliente_id);
    }

    if (filtros?.prestador_id) {
      condicoes.push(`prestador_id = $${indice++}`);
      valores.push(filtros.prestador_id);
    }

    const where = condicoes.length > 0
      ? `WHERE ${condicoes.join(' AND ')}`
      : '';

    const result = await pool.query(
      `SELECT * FROM propostas_read_model ${where} ORDER BY criada_em DESC`,
      valores
    );

    return result.rows;
  },
};