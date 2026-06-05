FROM node:20
WORKDIR /app

COPY backend/packages/shared/ ./packages/shared/
RUN cd packages/shared && npm install && npx tsc && npm pack

COPY backend/services/prestadores-service/package*.json ./prestadores-service/
RUN cd prestadores-service && npm install \
    && npm install /app/packages/shared/frella-shared-1.0.0.tgz

COPY backend/services/prestadores-service/ ./prestadores-service/

EXPOSE 3003
WORKDIR /app/prestadores-service
CMD ["npm", "run", "dev"]
