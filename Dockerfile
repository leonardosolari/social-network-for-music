FROM node:lts-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json
RUN npm install
COPY ./ /usr/src/app
EXPOSE 4000
CMD ["npm", "start"]