FROM node:lts-alpine
ARG REACT_APP_ENVIRONMENT
ARG REACT_APP_ORGANISATION
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn run build
