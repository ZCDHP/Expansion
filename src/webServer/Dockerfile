FROM node:lts-alpine

WORKDIR /root

# Dependencies 
COPY package.json yarn.lock tsconfig.json ./
COPY src/webServer/package.json src/webServer/package.json
RUN yarn install

# Source code
COPY src/config/ src/config/
COPY src/webServer/ src/webServer/

# Build
ENV NODE_ENV production
RUN node_modules/.bin/tsc -p src/webServer/tsconfig.json


FROM node:lts-alpine

ENV NODE_ENV production
WORKDIR /home/node

COPY --from=0 /root/package.json /root/yarn.lock ./
COPY --from=0 /root/src/webServer/package.json src/webServer/package.json
RUN yarn install --production

# Code
COPY --from=0 /root/dist/ ./
COPY src/config/production/. config

USER node
CMD ["node", "webServer/server.js"]
