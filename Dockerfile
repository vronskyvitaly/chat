# Use the Node.js 20 base image
FROM node:20.13.1 AS base

# Set the working directory inside the container
WORKDIR /app

# Copy package.json и package-lock.json (если есть)
COPY package*.json ./

# Установить зависимости (используем npm ci для чистой установки по lockfile)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application (уточните команду, если не Next.js)
RUN npm run build

# Production image
FROM node:20.13.1

WORKDIR /app

# Копируем артефакты сборки и зависимости
COPY --from=base /src/.next /src/.next
COPY --from=base /src/public /src/public
COPY --from=base /src/node_modules /src/node_modules
COPY --from=base /src/package.json /src/package.json

# Установить переменные окружения для продакшна
ENV NODE_ENV=production

# Открываем порт
EXPOSE 3000

# Команда запуска
CMD ["npm", "start"]