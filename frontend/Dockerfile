FROM node:26-slim

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY packages/schemas/package*.json ./packages/schemas/

RUN npm install

WORKDIR /app/frontend

CMD ["npm", "run", "dev"]
