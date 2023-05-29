FROM node:17-alpine3.12
#FROM node:17

# Create app directory
WORKDIR /usr/src/app

# Install basic tools: Bash, Netcat, IP Utils (incl. Ping), curl, vim
RUN set -x && \
    apk update && apk upgrade && \
    apk add --update bash netcat-openbsd iputils curl vim

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm ci

# Bundle app source
COPY . .

# Compile TypeScript files
RUN npm run build

EXPOSE 8001
CMD [ "node", "-r", "tsconfig-paths/register", "build/index.js" ]
