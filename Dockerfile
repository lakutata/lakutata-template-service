FROM node:lts-alpine

RUN mkdir -p /project
WORKDIR /project
COPY . /project/
RUN rm -rf /project/build
RUN npm ci --no-warnings
RUN npm run build:host
ENTRYPOINT ["node","/project/packages/app/build/App.js"]
