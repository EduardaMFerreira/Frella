CREATE TABLE IF NOT EXISTS propostas_read_model (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  status TEXT NOT NULL,
  cliente_id TEXT NOT NULL,
  prestador_id TEXT NOT NULL,
  criada_em TIMESTAMP,
  atualizada_em TIMESTAMP
);