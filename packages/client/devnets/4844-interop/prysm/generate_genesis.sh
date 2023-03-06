#!/bin/bash
CONFIGDIR=$(pwd)
PRYSMDIR=$1
GENESIS=$(($(date +%s) + 30)) # 120s until genesis, feel free to increase this to give you more time to everything

# The following are configureable too but you have to make sure they align.
# Take SECONDS_PER_SLOT * SLOTS_PER_EPOCH * CAPELLA_FORK_EPOCH for SHANGHAI
# Take SECONDS_PER_SLOT * SLOTS_PER_EPOCH * EIP4844_FORK_EPOCH for CANCUN
SHANGHAI=$(($GENESIS + 144))
CANCUN=$(($GENESIS + 180))
cp ./prysm.json ./genesisGEN.json
sed -i -e 's/XXX/'$SHANGHAI'/' ./genesisGEN.json
sed -i  -e 's/YYY/'$CANCUN'/' ./genesisGEN.json

cd $PRYSMDIR

bazel run //cmd/prysmctl -- testnet generate-genesis --num-validators=512 --output-ssz=$CONFIGDIR/genesis.ssz --chain-config-file=$CONFIGDIR/config.yml --genesis-time=$GENESIS
