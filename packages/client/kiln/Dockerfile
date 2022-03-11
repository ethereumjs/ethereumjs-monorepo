FROM node:16-alpine as build
WORKDIR /usr/app
RUN apk update && apk add --no-cache bash git && rm -rf /var/cache/apk/*

RUN git clone --depth 1 --branch master https://github.com/ethereumjs/ethereumjs-monorepo.git

WORKDIR /usr/app/ethereumjs-monorepo
RUN npm i

RUN cd packages/client/kiln && git init && git remote add -f origin https://github.com/eth-clients/merge-testnets.git && git config core.sparseCheckout true && echo "kiln/*" >> .git/info/sparse-checkout && git pull --depth=1 origin main && mv kiln config

FROM node:16-alpine
WORKDIR /usr/app
COPY --from=build /usr/app .

# Sanity check
RUN node /usr/app/ethereumjs-monorepo/packages/client/dist/bin/cli.js --help

# NodeJS applications have a default memory limit of 2.5GB.
# This limit is bit tight, it is recommended to raise the limit
# since memory may spike during certain network conditions.
ENV NODE_OPTIONS=--max_old_space_size=6144

ENTRYPOINT ["node", "/usr/app/ethereumjs-monorepo/packages/client/dist/bin/cli.js"]