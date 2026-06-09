# ── Stage 1: build ────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY backend/packages/shared/ ./packages/shared/
RUN cd packages/shared && npm install && npx tsc && npm pack

COPY backend/services/avaliacoes-service/package*.json ./avaliacoes-service/
RUN cd avaliacoes-service \
    && npm install \
    && npm install /app/packages/shared/frella-shared-1.0.0.tgz

COPY backend/services/avaliacoes-service/ ./avaliacoes-service/
RUN cd avaliacoes-service && npx tsc

# ── Stage 2: produção ─────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app/packages/shared/ ./packages/shared/

COPY backend/services/avaliacoes-service/package*.json ./
RUN npm install --omit=dev \
    && npm install /app/packages/shared/frella-shared-1.0.0.tgz

COPY --from=builder /app/avaliacoes-service/dist ./dist

EXPOSE 3005
CMD ["node", "dist/server.js"]