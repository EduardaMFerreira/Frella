FROM node:20
WORKDIR /app

# instala e builda o shared
COPY backend/packages/shared/ ./packages/shared/
RUN cd packages/shared && npm install && npx tsc && npm pack

# instala o clientes-service com o shared local
COPY backend/services/clientes-service/package*.json ./clientes-service/
RUN cd clientes-service && npm install \
    && npm install /app/packages/shared/frella-shared-1.0.0.tgz

COPY backend/services/clientes-service/ ./clientes-service/

EXPOSE 3001
WORKDIR /app/clientes-service
CMD ["npm", "run", "dev"]