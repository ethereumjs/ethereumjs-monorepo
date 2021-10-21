FROM node:14-alpine as build
WORKDIR /usr/app
RUN apk update && apk add --no-cache g++ make python bash git && rm -rf /var/cache/apk/*

WORKDIR /usr/app
RUN git clone --depth 1 --branch merge-pithos https://github.com/ethereumjs/ethereumjs-monorepo.git
WORKDIR /usr/app/ethereumjs-monorepo
RUN npm i -g npm@7
RUN npm i

FROM node:14-alpine
WORKDIR /usr/app
COPY --from=build /usr/app .

# Sanity check
RUN node /usr/app/ethereumjs-monorepo/packages/client/dist/bin/cli.js --help

# NodeJS applications have a default memory limit of 2.5GB.
# This limit is bit tight, it is recommended to raise the limit
# since memory may spike during certain network conditions.
ENV NODE_OPTIONS=--max_old_space_size=6144

ENTRYPOINT ["node", "/usr/app/ethereumjs-monorepo/packages/client/dist/bin/cli.js"]