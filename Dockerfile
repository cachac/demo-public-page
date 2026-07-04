# Use official Bun image
FROM oven/bun:1
WORKDIR /app

COPY .env .env
COPY package.json .
COPY index.html .
COPY server.js .

RUN bun install --production
EXPOSE 3000

CMD ["bun", "run", "start"]
