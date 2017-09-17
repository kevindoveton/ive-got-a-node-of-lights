FROM node:6-alpine

# app directory
ENV APP_DIR /usr/src/app

# set config
ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

# install pm2 first
RUN npm i -g pm2

# install app dependencies
ADD package.json ./
RUN npm install

# add the rest of the files
ADD processes.json .
ADD src/ ./src/

EXPOSE 3000

CMD ["pm2", "start", "processes.json", "--no-daemon"]
