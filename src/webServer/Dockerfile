FROM node:lts-alpine

# development | production
ARG Env=development

WORKDIR /root

# Dependencies 
COPY package.json yarn.lock tsconfig.json .yarnclean ./
COPY src/webServer/package.json src/webServer/package.json
COPY src/client/package.json src/client/package.json
COPY src/building/ src/building/
RUN yarn install

# Source code
COPY src/config/ src/config/
COPY src/infrastructure/ src/infrastructure/
COPY src/webServer/ src/webServer/
COPY src/client/ src/client/

# Build
ENV NODE_ENV ${Env}
RUN node_modules/.bin/tsc -p src/building/tsconfig.json \
    && node_modules/.bin/webpack --config dist/building/webpack.config.js \
    && node_modules/.bin/tsc -p src/webServer/tsconfig.json


FROM node:lts-alpine

ENV NODE_ENV production
WORKDIR /home/node

COPY --from=0 /root/package.json /root/yarn.lock ./
COPY --from=0 /root/src/webServer/package.json src/webServer/package.json
COPY --from=0 /root/src/client/package.json src/client/package.json
RUN yarn install --production

# Code
COPY --from=0 /root/dist/ ./
COPY src/config/production/. config

USER node
CMD ["node", "webServer/server.js"]
