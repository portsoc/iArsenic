# docker build . -t iarsenic && docker run --rm -ti -p 3005:3005 iarsenic
FROM node:20-alpine AS build-server
WORKDIR /app

COPY client/package*.json ./client/
COPY client/ ./client/

RUN npm --prefix client install

COPY server/package*.json ./server/
COPY server/ ./server

RUN npm --prefix server install
RUN npm --prefix server run build

FROM node:20-alpine AS production
WORKDIR /app

COPY --from=build-server /app/server/dist ./dist

COPY server/package*.json ./
RUN npm install --only=production

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
