FROM node:lts-alpine

RUN mkdir -p /project
WORKDIR /project
COPY . /project/
RUN npm ci --no-warnings && \
    npm run build:host && \
    npm cache clean --force
ENTRYPOINT ["node","/project/packages/app/build/App.js"]
