FROM node:20
WORKDIR /app

COPY backend/packages/shared/ ./packages/shared/
RUN cd packages/shared && npm install && npx tsc && npm pack

COPY backend/services/propostas-service/package*.json ./propostas-service/
RUN cd propostas-service && npm install \
    && npm install /app/packages/shared/frella-shared-1.0.0.tgz

COPY backend/services/propostas-service/ ./propostas-service/

EXPOSE 3004
WORKDIR /app/propostas-service
CMD ["npm", "run", "dev"]
