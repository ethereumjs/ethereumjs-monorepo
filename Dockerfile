FROM node:22.4-slim
RUN apt-get update && apt-get install -y git g++ make python3 python3-setuptools && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /ethereumjs-monorepo

COPY .git .git
COPY node_modules node_modules

# copy dist folders
COPY packages/binarytree/dist packages/binarytree/dist
COPY packages/block/dist packages/block/dist
COPY packages/blockchain/dist packages/blockchain/dist
COPY packages/client/dist packages/client/dist
COPY packages/common/dist packages/common/dist
COPY packages/devp2p/dist packages/devp2p/dist
COPY packages/e2store/dist packages/e2store/dist
COPY packages/ethash/dist packages/ethash/dist
COPY packages/evm/dist packages/evm/dist
COPY packages/genesis/dist packages/genesis/dist
COPY packages/mpt/dist packages/mpt/dist
COPY packages/rlp/dist packages/rlp/dist
COPY packages/statemanager/dist packages/statemanager/dist
COPY packages/tx/dist packages/tx/dist
COPY packages/util/dist packages/util/dist
COPY packages/verkle/dist packages/verkle/dist
COPY packages/vm/dist packages/vm/dist
COPY packages/wallet/dist packages/wallet/dist

# copy package.json files
COPY packages/binarytree/package.json packages/binarytree/package.json
COPY packages/block/package.json packages/block/package.json
COPY packages/blockchain/package.json packages/blockchain/package.json
COPY packages/client/package.json packages/client/package.json
COPY packages/common/package.json packages/common/package.json
COPY packages/devp2p/package.json packages/devp2p/package.json
COPY packages/e2store/package.json packages/e2store/package.json
COPY packages/ethash/package.json packages/ethash/package.json
COPY packages/evm/package.json packages/evm/package.json
COPY packages/genesis/package.json packages/genesis/package.json
COPY packages/mpt/package.json packages/mpt/package.json
COPY packages/rlp/package.json packages/rlp/package.json
COPY packages/statemanager/package.json packages/statemanager/package.json
COPY packages/tx/package.json packages/tx/package.json
COPY packages/util/package.json packages/util/package.json
COPY packages/verkle/package.json packages/verkle/package.json
COPY packages/vm/package.json packages/vm/package.json
COPY packages/wallet/package.json packages/wallet/package.json


# Sanity check
RUN node /ethereumjs-monorepo/packages/client/dist/esm/bin/cli.js --help

# NodeJS applications have a default memory limit of 2.5GB.
# This limit is bit tight, it is recommended to raise the limit
# since memory may spike during certain network conditions.
ENV NODE_OPTIONS=--max_old_space_size=6144

ENTRYPOINT ["node", "/ethereumjs-monorepo/packages/client/dist/esm/bin/cli.js"]
