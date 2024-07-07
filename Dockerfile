ARG NODE_VERSION=20.3.1
FROM node:${NODE_VERSION}-alpine as base

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm","run","dev"]