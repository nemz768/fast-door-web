FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci 

COPY . .

ENV NEXT_PUBLIC_API_URL=http://localhost:8080/api

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

# Копируем статические файлы из папки public
COPY --from=builder /app/public ./public

# Копируем минимальный сервер сгенерированный Next.js в standalone режиме
COPY --from=builder /app/.next/standalone ./

# Копируем статические файлы Next.js (JS, CSS чанки)
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]

