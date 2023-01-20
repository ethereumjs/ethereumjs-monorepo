#!/bin/bash
CONFIGDIR=$(pwd)
PRYSMDIR=$1
GENESIS=$(($(date +%s) + 30)) # 120s until genesis, feel free to increase this to give you more time to everything

# The following are configureable too but you have to make sure they align.
# Take SECONDS_PER_SLOT * SLOTS_PER_EPOCH * CAPELLA_FORK_EPOCH for SHANGHAI
# Take SECONDS_PER_SLOT * SLOTS_PER_EPOCH * EIP4844_FORK_EPOCH for CANCUN
SHANGHAI=$(($GENESIS + 144))
CANCUN=$(($GENESIS + 180))
cp ./prysm.json ./genesis.json
sed -i -e 's/XXX/'$SHANGHAI'/' ./genesis.json
sed -i  -e 's/YYY/'$CANCUN'/' ./genesis.json

# Nuke data dir
rm -rf $CONFIGDIR/CLData
mkdir $CONFIGDIR/CLData

cd $PRYSMDIR

bazel run //cmd/prysmctl -- testnet generate-genesis --num-validators=512 --output-ssz=$CONFIGDIR/CLData/genesis.ssz --chain-config-file=$CONFIGDIR/config.yml --genesis-time=$GENESIS

bazel run //cmd/beacon-chain -- \
        --datadir=$CONFIGDIR/CLData \
	--min-sync-peers=0 \
        --force-clear-db \
	--interop-genesis-state=$CONFIGDIR/CLData/genesis.ssz \
	--interop-eth1data-votes \
	--bootstrap-node= \
	--chain-config-file=$CONFIGDIR/config.yml \
	--chain-id=32382 \
	--accept-terms-of-use \
	--jwt-secret=$CONFIGDIR/jwtsecret.txt \
	--suggested-fee-recipient=0x123463a4b065722e99115d6c222f267d9cabb524 \
	--verbosity debug