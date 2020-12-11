FROM node:14.15.1
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm cache verify
RUN npm install
COPY . /usr/src/app
EXPOSE 4200
CMD ["npm", "start"]