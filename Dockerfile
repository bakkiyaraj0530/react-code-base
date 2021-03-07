FROM node:lts-alpine
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN yarn install
COPY . /app
RUN yarn build
