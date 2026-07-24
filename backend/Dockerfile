FROM node:26-slim

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY packages/schemas/package*.json ./packages/schemas/

RUN npm install

WORKDIR /app/backend

CMD ["sh", "-c", "npm install && npm run dev"]
