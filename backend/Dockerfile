FROM node:26-slim AS frontend-build

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY packages/schemas/package*.json ./packages/schemas/

RUN npm install --include=optional

COPY packages/schemas ./packages/schemas
COPY frontend ./frontend

WORKDIR /app/frontend

RUN npm run build

FROM node:26-slim

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY packages/schemas/package*.json ./packages/schemas/

RUN npm install

COPY packages/schemas ./packages/schemas
COPY backend ./backend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

RUN npx prisma generate

CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed:bootstrap-admin && npx tsx src/index.ts"]
