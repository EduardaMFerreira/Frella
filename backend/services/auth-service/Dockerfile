# ── Stage 1: build ────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# build do pacote shared
COPY backend/packages/shared/ ./packages/shared/
RUN cd packages/shared && npm install && npx tsc && npm pack

# instala dependências (incluindo dev para compilar)
COPY backend/services/auth-service/package*.json ./auth-service/
RUN cd auth-service \
    && npm install \
    && npm install /app/packages/shared/frella-shared-1.0.0.tgz

# copia fonte e compila
COPY backend/services/auth-service/ ./auth-service/
RUN cd auth-service && npx tsc

# ── Stage 2: produção ─────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app/packages/shared/ ./packages/shared/

COPY backend/services/auth-service/package*.json ./
RUN npm install --omit=dev \
    && npm install /app/packages/shared/frella-shared-1.0.0.tgz

COPY --from=builder /app/auth-service/dist ./dist

EXPOSE 3006
CMD ["node", "dist/src/server.js"]