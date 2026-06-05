FROM node:20
WORKDIR /app

# instala e builda o shared
COPY packages/shared/ ./packages/shared/
RUN cd packages/shared && npm install && npx tsc && npm pack

# instala o api-gateway com o shared local
COPY api-gateway/package*.json ./api-gateway/
RUN cd api-gateway && npm install --include=dev \
    && npm install /app/packages/shared/frella-shared-1.0.0.tgz

COPY api-gateway/ ./api-gateway/

RUN npm install -g typescript
WORKDIR /app/api-gateway
RUN tsc
EXPOSE 3000
CMD ["node", "dist/api-gateway/src/server.js"]