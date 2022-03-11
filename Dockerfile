FROM node:17.6-alpine3.14

WORKDIR /usr/src/app
COPY . .
RUN npm install && npm run build:dev

EXPOSE 3000
CMD [ "npm", "start"]