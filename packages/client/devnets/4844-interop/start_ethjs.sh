#!/bin/bash
CONFIGDIR=$(pwd)

# Nuke data dir
rm -rf $CONFIGDIR/ELData
mkdir $CONFIGDIR/ELData

npm run client:start -- --datadir $CONFIGDIR/ELData --gethGenesis $CONFIGDIR/genesis.json --rpc --rpcEngine --jwt-secret=$CONFIGDIR/jwtsecret.txt --rpcDebug --loglevel=debug --mine --unlock=$CONFIGDIR/minerKey.txt