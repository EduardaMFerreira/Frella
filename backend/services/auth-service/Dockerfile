FROM node:20
WORKDIR /app

# instala e builda o shared
COPY backend/packages/shared/ ./packages/shared/
RUN cd packages/shared && npm install && npx tsc && npm pack

# instala o auth-service com o shared local
COPY backend/services/auth-service/package*.json ./auth-service/
RUN cd auth-service && npm install \
    && npm install /app/packages/shared/frella-shared-1.0.0.tgz

COPY backend/services/auth-service/ ./auth-service/

EXPOSE 3006
WORKDIR /app/auth-service
CMD ["npm", "run", "dev"]