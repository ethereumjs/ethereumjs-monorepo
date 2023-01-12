#!/bin/bash
CONFIGDIR=$(pwd)

PRYSMDIR=$1

cd $PRYSMDIR

bazel run //cmd/validator -- \
    --datadir=$CONFIGDIR/CLData \
	--accept-terms-of-use \
	--interop-num-validators=512 \
	--interop-start-index=0 \
	--chain-config-file=$CONFIGDIR/config.yml