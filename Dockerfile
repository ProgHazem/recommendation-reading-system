FROM node:22.11-alpine3.20

RUN apk add --no-cache bash

WORKDIR /app

COPY .env.example ./.env

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm cache clean --force

EXPOSE 4000

CMD ["npm" , "run", "start:dev"]
