CREATE TABLE IF NOT EXISTS prestadores (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome            VARCHAR(255)   NOT NULL,
  email           VARCHAR(255)   NOT NULL UNIQUE,
  telefone        VARCHAR(20),
  especialidades  TEXT[]         NOT NULL DEFAULT '{}',
  descricao       TEXT,
  valor_hora      NUMERIC(10,2),
  endereco        JSONB,
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prestadores_email ON prestadores (email);
CREATE INDEX IF NOT EXISTS idx_prestadores_especialidades ON prestadores USING GIN (especialidades);