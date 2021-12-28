FROM node:14.17.5 AS builder
WORKDIR /app
COPY package.json tsconfig.json . /app/
RUN yarn install --production
EXPOSE 8080
CMD ["yarn", "start"]