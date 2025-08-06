# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ENV NEXT_PUBLIC_FRIGATE_URL=https://digefx.tail6573c6.ts.net/frigate
RUN npm run build

# Etapa de produção
FROM node:20-alpine

WORKDIR /app

ENV NEXT_PUBLIC_FRIGATE_URL=https://digefx.tail6573c6.ts.net/frigate

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
