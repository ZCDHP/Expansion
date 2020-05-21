FROM node:lts-alpine

WORKDIR /root

# Dependencies 
COPY package.json yarn.lock tsconfig.json ./
COPY src/gConnection.service/package.json src/gConnection.service/package.json
# RUN npm install -g yarn && yarn install
RUN yarn install

# Source code
COPY src/gConnection.service/ src/gConnection.service/
COPY src/gConnection.domain/ src/gConnection.domain/
COPY src/infrastructure/ src/infrastructure/
COPY src/config/ src/config/


# Build
ENV NODE_ENV production
RUN node_modules/.bin/tsc -p src/gConnection.service/tsconfig.json



FROM node:lts-alpine

ENV NODE_ENV production
WORKDIR /home/node

# Dependencies 
COPY --from=0 /root/package.json /root/yarn.lock ./
COPY --from=0 /root/src/gConnection.service/package.json src/gConnection.service/package.json
# RUN npm install -g yarn 
RUN yarn install --production

# Code
COPY --from=0 /root/dist/ ./
COPY src/config/production/. config

USER node
CMD ["node", "gConnection.service/main.js"]
