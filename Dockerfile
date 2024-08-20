# docker/dev.Dockerfile
FROM node:latest

WORKDIR /app/next-app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn build

EXPOSE 3000

# Set the command to run the application
CMD ["yarn", "start", "-p", "3000", "-H", "0.0.0.0"]