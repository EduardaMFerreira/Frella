CREATE TABLE IF NOT EXISTS contratos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id    UUID          NOT NULL,
  prestador_id  UUID          NOT NULL,
  descricao     TEXT          NOT NULL,
  valor         NUMERIC(10,2) NOT NULL,
  data_inicio   TIMESTAMPTZ   NOT NULL,
  data_fim      TIMESTAMPTZ   NOT NULL,
  status        VARCHAR(20)   NOT NULL DEFAULT 'PENDENTE',
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contratos_cliente_id ON contratos (cliente_id);
CREATE INDEX IF NOT EXISTS idx_contratos_prestador_id ON contratos (prestador_id);
CREATE INDEX IF NOT EXISTS idx_contratos_status ON contratos (status);