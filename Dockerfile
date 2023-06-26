FROM node:18-alpine as build
WORKDIR /usr/app
RUN apk update && apk add --no-cache bash git g++ make python3 && rm -rf /var/cache/apk/*

ARG VERSION=latest
ENV VERSION=$VERSION
RUN npm install @ethereumjs/client@$VERSION

FROM node:18-alpine
WORKDIR /usr/app
COPY --from=build /usr/app .

# Sanity check
RUN node /usr/app/node_modules/.bin/ethereumjs --help

# NodeJS applications have a default memory limit of 2.5GB.
# This limit is bit tight, it is recommended to raise the limit
# since memory may spike during certain network conditions.
ENV NODE_OPTIONS=--max_old_space_size=6144

ENTRYPOINT ["node", "/usr/app/node_modules/.bin/ethereumjs"]