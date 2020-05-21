FROM node:lts-alpine

WORKDIR /root

# Dependencies 
COPY package.json yarn.lock tsconfig.json ./
COPY src/scenarioTest.integrated/package.json src/scenarioTest.integrated/package.json
# RUN npm install -g yarn && yarn install
RUN yarn install

# Source code
COPY src/ src/


# Build
ENV NODE_ENV production
RUN node_modules/.bin/tsc -p src/scenarioTest.integrated/tsconfig.json


FROM node:lts-alpine

ENV NODE_ENV production
WORKDIR /home/node

# Dependencies 
COPY --from=0 /root/package.json /root/yarn.lock ./
COPY --from=0 /root/src/scenarioTest.integrated/package.json src/scenarioTest.integrated/package.json
# RUN npm install -g yarn 
RUN yarn install --production
RUN npm install -g http-server mochawesome

# Code
COPY --from=0 /root/dist/ ./
COPY src/config/production/. config

USER node
CMD  ["sh", "-c", "/home/node/node_modules/.bin/mocha --require source-map-support/register --reporter mochawesome --reporter-options reportFilename=index.html scenarioTest.integrated/ & http-server ./mochawesome-report"]
