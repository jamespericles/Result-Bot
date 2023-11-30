# Dockerfile

FROM node:18

WORKDIR /Result-Bot

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]