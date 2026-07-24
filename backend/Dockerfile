FROM node:26-slim

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY packages/schemas/package*.json ./packages/schemas/

RUN npm install

WORKDIR /app/backend

CMD ["npm", "run", "dev"]
