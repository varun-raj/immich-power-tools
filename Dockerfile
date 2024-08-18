# docker/dev.Dockerfile
FROM oven/bun:latest

WORKDIR /app/next-app

COPY package.json ./
COPY bun.lockb ./

RUN bun install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN bun next build

EXPOSE 3000

# Set the command to run the application
CMD ["bun", "run", "start"]