FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN npm ci

CMD npm start