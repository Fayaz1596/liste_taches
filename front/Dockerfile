FROM node:14.15.1-alpine as node
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.19.6-alpine
COPY --from=node /usr/src/app/dist/frontend /usr/share/nginx/html