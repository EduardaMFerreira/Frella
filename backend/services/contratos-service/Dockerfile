FROM node:20
WORKDIR /app

COPY backend/packages/shared/ ./packages/shared/
RUN cd packages/shared && npm install && npx tsc && npm pack

COPY backend/services/contratos-service/package*.json ./contratos-service/
RUN cd contratos-service && npm install \
    && npm install /app/packages/shared/frella-shared-1.0.0.tgz

COPY backend/services/contratos-service/ ./contratos-service/

EXPOSE 3002
WORKDIR /app/contratos-service
CMD ["npm", "run", "dev"]
