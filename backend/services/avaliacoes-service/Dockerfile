FROM node:20
WORKDIR /app

COPY backend/packages/shared/ ./packages/shared/
RUN cd packages/shared && npm install && npx tsc && npm pack

COPY backend/services/avaliacoes-service/package*.json ./avaliacoes-service/
RUN cd avaliacoes-service && npm install \
    && npm install /app/packages/shared/frella-shared-1.0.0.tgz

COPY backend/services/avaliacoes-service/ ./avaliacoes-service/

EXPOSE 3005
WORKDIR /app/avaliacoes-service
CMD ["npm", "run", "dev"]
