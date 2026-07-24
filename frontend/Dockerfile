FROM node:26-slim

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY packages/schemas/package*.json ./packages/schemas/

RUN npm install --include=optional

WORKDIR /app/frontend

CMD ["sh", "-c", "npm install --include=optional && npm run dev"]
