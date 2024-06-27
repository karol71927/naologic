FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm i -g @nestjs/cli

RUN echo > ~/.npmrc

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js"]