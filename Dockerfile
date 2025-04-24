FROM node:23-alpine3.20

WORKDIR /notificaciones-api
COPY . .
RUN yarn install --production

CMD ["node", "/notificaciones-api/src/index.js"]

