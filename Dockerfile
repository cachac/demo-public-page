# Use official Bun image
FROM jarredsumner/bun:latest
WORKDIR /app
COPY package.json .
COPY index.html .
COPY server.js .
# Install bun (already present) and install any dependencies (none)
RUN bun install --production
EXPOSE 3000
CMD ["bun", "run", "start"]
