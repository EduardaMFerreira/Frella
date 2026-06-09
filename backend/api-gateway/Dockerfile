# ── Stage 1: build ────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g typescript

# build do pacote shared
COPY packages/shared/ ./packages/shared/
RUN cd packages/shared && npm install && tsc && npm pack

# instala dependências (incluindo dev para compilar)
COPY api-gateway/package*.json ./api-gateway/
RUN cd api-gateway \
    && npm install --include=dev \
    && npm install /app/packages/shared/frella-shared-1.0.0.tgz

# copia fonte e compila
COPY api-gateway/ ./api-gateway/
RUN cd api-gateway && tsc

# ── Stage 2: produção ─────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app/packages/shared/ ./packages/shared/

COPY api-gateway/package*.json ./
RUN npm install --omit=dev \
    && npm install /app/packages/shared/frella-shared-1.0.0.tgz

COPY --from=builder /app/api-gateway/dist ./dist

EXPOSE 3000
CMD ["node", "dist/api-gateway/src/server.js"]