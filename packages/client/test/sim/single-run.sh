#!/bin/bash
# set -e

currentDir=$(pwd)
scriptDir=$(dirname $0)
scriptDir="$currentDir/$scriptDir"

if [ ! -n "$DATADIR" ]
then
  DATADIR="$scriptDir/data"
fi;
mkdir $DATADIR
origDataDir=$DATADIR

# Check if network arg is provided as the name of the geth genesis json file to use to start
# the custom network
if [ ! -n "$NETWORK" ]
then
  echo "network not provide via NETWORK env variable, exiting..."
  exit;
fi;

if [ ! -n "$JWT_SECRET" ]
then
  JWT_SECRET="0xdc6457099f127cf0bac78de8b297df04951281909db4f58b43def7c7151e765d"
fi;

if [ -n "$ELCLIENT" ]
then
  if [ ! -n "$ELCLIENT_IMAGE" ]
  then
    case $ELCLIENT in 
      ethereumjs)
        echo "ELCLIENT=$ELCLIENT using local ethereumjs binary from packages/client"
        ;;
      geth)
        if [ ! -n "$NETWORKID" ]
        then
          echo "geth requires NETWORKID to be passed in env, exiting..."
          exit;
        fi;
        ELCLIENT_IMAGE="ethereum/client-go:stable"
        echo "ELCLIENT=$ELCLIENT using ELCLIENT_IMAGE=$ELCLIENT_IMAGE NETWORKID=$NETWORKID"
        ;;
      *)
        echo "ELCLIENT=$ELCLIENT not implemented"
    esac
  fi
else
  ELCLIENT="ethereumjs"
  echo "ELCLIENT=$ELCLIENT using local ethereumjs binary from packages/client"
fi;

case $MULTIPEER in
  syncpeer)
    echo "setting up to run as a sync only peer to peer1 (bootnode)..."
    DATADIR="$DATADIR/syncpeer"

    case $ELCLIENT in 
      ethereumjs)
        EL_PORT_ARGS="--port 30305 --rpcEnginePort 8553 --rpcPort 8947 --multiaddrs /ip4/127.0.0.1/tcp/50582/ws --logLevel debug"
        ;;
      geth)
        echo "syncpeer args not yet implemented for geth, exiting..."
        exit;
        ;;
      *)
        echo "ELCLIENT=$ELCLIENT not implemented"
    esac
    
    CL_PORT_ARGS="--genesisValidators 8 --enr.tcp 9002 --port 9002 --execution.urls http://localhost:8553  --rest.port 9598 --server http://localhost:9598 --network.connectToDiscv5Bootnodes true --logLevel debug"
    ;;

  peer2)
    echo "setting up peer2 to run with peer1 (bootnode)..."
    DATADIR="$DATADIR/peer2"

    case $ELCLIENT in 
      ethereumjs)
        EL_PORT_ARGS="--port 30304 --rpcEnginePort 8552 --rpcPort 8946 --multiaddrs /ip4/127.0.0.1/tcp/50581/ws --bootnodes $elBootnode --logLevel debug"
        ;;
      geth)
        echo "peer2 args not yet implemented for geth, exiting..."
        exit;
        ;;
      *)
        echo "ELCLIENT=$ELCLIENT not implemented"
    esac

    CL_PORT_ARGS="--genesisValidators 8 --startValidators 4..7 --enr.tcp 9001 --port 9001 --execution.urls http://localhost:8552  --rest.port 9597 --server http://127.0.0.1:9597 --network.connectToDiscv5Bootnodes true --bootnodes $bootEnrs"
    ;;

  * )
    DATADIR="$DATADIR/peer1"

    case $ELCLIENT in 
      ethereumjs)
        EL_PORT_ARGS="--isSingleNode --extIP 127.0.0.1 --logLevel debug"
        ;;
      geth)
        # geth will be mounted in docker with DATADIR to /data
        EL_PORT_ARGS="--datadir /data/geth --authrpc.jwtsecret /data/jwtsecret --http --http.api engine,net,eth,web3,debug,admin --http.corsdomain \"*\" --http.port 8545 --http.addr 0.0.0.0 --http.vhosts \"*\" --authrpc.addr 0.0.0.0 --authrpc.vhosts \"*\" --authrpc.port=8551 --syncmode full --networkid $NETWORKID --nodiscover"
        ;;
      *)
        echo "ELCLIENT=$ELCLIENT not implemented"
    esac

    CL_PORT_ARGS="--sync.isSingleNode --enr.ip 127.0.0.1 --enr.tcp 9000 --enr.udp 9000"
    if [ ! -n "$MULTIPEER" ]
    then
      echo "setting up to run as a solo node..."
      CL_PORT_ARGS="$CL_PORT_ARGS --genesisValidators 8 --startValidators 0..7"
    else
      echo "setting up to run as peer1 (bootnode)..."
      CL_PORT_ARGS="$CL_PORT_ARGS --genesisValidators 8 --startValidators 0..3"
    fi;
    MULTIPEER="peer1"
esac

mkdir $DATADIR
echo "EL_PORT_ARGS=$EL_PORT_ARGS"
echo "CL_PORT_ARGS=$CL_PORT_ARGS"

if [ ! -n "$DATADIR" ] || (touch $DATADIR/shandong.txt) && [ ! -n "$(ls -A $DATADIR)" ]
then
  echo "provide a valid DATADIR, currently DATADIR=$DATADIR, exiting ... "
  exit;
fi;

# clean these folders as old data can cause issues
sudo rm -rf $DATADIR/ethereumjs
sudo rm -rf $DATADIR/geth
sudo rm -rf $DATADIR/lodestar

# these two commands will harmlessly fail if folders exists
mkdir $DATADIR/ethereumjs
mkdir $DATADIR/geth
mkdir $DATADIR/lodestar
echo "$JWT_SECRET" > $DATADIR/jwtsecret

# additional step for setting geth genesis now that we have datadir
if [ "$ELCLIENT" == "geth" ]
then
  setupCmd="docker run --rm -v $scriptDir/configs:/config -v $DATADIR/geth:/data $ELCLIENT_IMAGE --datadir /data init /config/$NETWORK.json"
  echo "$setupCmd"
  $setupCmd
fi;

run_cmd(){
  execCmd=$1;
  if [ -n "$DETACHED" ]
  then
    echo "running detached: $execCmd"
    eval "$execCmd"
  else
    if [ -n "$WITH_TERMINAL" ]
    then
      execCmd="$WITH_TERMINAL $execCmd"
    fi;
    echo "running: $execCmd &"
    eval "$execCmd" &
  fi;
}

cleanup() {
  echo "cleaning up"
  if [ -n "$ejsPid" ] 
  then
    ejsPidBySearch=$(ps x | grep "ts-node bin/cli.ts --dataDir $DATADIR/ethereumjs" | grep -v grep | awk '{print $1}')
    echo "cleaning ethereumjs pid:${ejsPid} ejsPidBySearch:${ejsPidBySearch}..."
    if [ -n "$ELCLIENT_IMAGE" ]
    then
      docker rm execution${MULTIPEER} -f
    else
      kill $ejsPidBySearch
    fi;
  fi;
  if [ -n "$lodePid" ]
  then
    lodePidBySearch=$(ps x | grep "$DATADIR/lodestar" | grep -v grep | awk '{print $1}')
    echo "cleaning lodestar pid:${lodePid} lodePidBySearch:${lodePidBySearch}..."
    if [ ! -n "$LODE_BINARY" ]
    then
      docker rm beacon${MULTIPEER} -f
    else
      kill $lodePidBySearch
    fi;
  fi;

  ejsPid=""
  lodePid=""
}

if [ "$MULTIPEER" == "peer1" ]
then
  case $ELCLIENT in 
    ethereumjs)
      ejsCmd="npm run client:start:ts -- --dataDir $DATADIR/ethereumjs --gethGenesis $scriptDir/configs/$NETWORK.json --rpc --rpcEngine --rpcEngineAuth false $EL_PORT_ARGS"
      ;;
    geth)
      # geth will be mounted in docker with DATADIR to /data
      ejsCmd="docker run --rm --name execution${MULTIPEER} -v $DATADIR:/data --network host $ELCLIENT_IMAGE $EL_PORT_ARGS"
      ;;
    *)
      echo "ELCLIENT=$ELCLIENT not implemented"
  esac

  run_cmd "$ejsCmd"
  ejsPid=$!
  echo "ejsPid: $ejsPid"

  # generate the genesis hash and time
  ejsId=0
  if [ ! -n "$GENESIS_HASH" ]
  then
    # We should curl and get genesis hash, but for now lets assume it will be provided
    while [ ! -n "$GENESIS_HASH" ]
    do
      sleep 3
      echo "Fetching genesis hash from ethereumjs ..."
      ejsId=$(( ejsId +1 ))
      responseCmd="curl --location --request POST 'http://localhost:8545' --header 'Content-Type: application/json' --data-raw '{
        \"jsonrpc\": \"2.0\",
        \"method\": \"eth_getBlockByNumber\",
        \"params\": [
            \"0x0\",
            true
        ],
        \"id\": $ejsId
      }' 2>/dev/null | jq \".result.hash\""
      # echo "$responseCmd"
      GENESIS_HASH=$(eval "$responseCmd")
    done;
  fi

  genTime="$(date +%s)"
  genTime=$((genTime + 30))
  echo $genTime > "$origDataDir/genesisTime"
  echo $GENESIS_HASH > "$origDataDir/genesisHash"
else
  # We should curl and get genesis hash, but for now lets assume it will be provided
  while [ ! -n "$CL_GENESIS_HASH" ]
  do
    sleep 3
    echo "Fetching genesis block from peer1/bootnode ..."
    ejsId=$(( ejsId +1 ))
    responseCmd="curl --location --request GET 'http://localhost:9596/eth/v1/beacon/headers/genesis' --header 'Content-Type: application/json'  2>/dev/null | jq \".data.root\""
    CL_GENESIS_HASH=$(eval "$responseCmd")
  done;

  # We should curl and get boot enr
  while [ ! -n "$bootEnrs" ]
  do
    sleep 3
    echo "Fetching bootEnrs block from peer1/bootnode ..."
    ejsId=$(( ejsId +1 ))
    responseCmd="curl --location --request GET 'http://localhost:9596/eth/v1/node/identity' --header 'Content-Type: application/json'  2>/dev/null | jq \".data.enr\""
    bootEnrs=$(eval "$responseCmd")
  done;

  elBootnode=$(cat "$origDataDir/peer1/ethereumjs/$NETWORK/rlpx");
  EL_PORT_ARGS="$EL_PORT_ARGS --bootnodes $elBootnode"
  CL_PORT_ARGS="$CL_PORT_ARGS --bootnodes $bootEnrs"

  GENESIS_HASH=$(cat "$origDataDir/genesisHash")
  genTime=$(cat "$origDataDir/genesisTime")

  case $ELCLIENT in 
    ethereumjs)
      ejsCmd="npm run client:start -- --dataDir $DATADIR/ethereumjs --gethGenesis $scriptDir/configs/$NETWORK.json --rpc --rpcEngine --rpcEngineAuth false $EL_PORT_ARGS"
      ;;
    geth)
      echo "peer2/syncpeer args not yet implemented for geth, exiting..."
      exit;
      ;;
    *)
      echo "ELCLIENT=$ELCLIENT not implemented"
  esac

  run_cmd "$ejsCmd"
  ejsPid=$!
  echo "ejsPid: $ejsPid"
fi;

echo "genesisHash=${GENESIS_HASH}"
echo "genTime=${genTime}"

CL_PORT_ARGS="--genesisEth1Hash $GENESIS_HASH --params.ALTAIR_FORK_EPOCH 0 --params.BELLATRIX_FORK_EPOCH 0 $EXTRA_CL_PARAMS --params.TERMINAL_TOTAL_DIFFICULTY 0x01 --genesisTime $genTime ${CL_PORT_ARGS} --suggestedFeeRecipient 0xcccccccccccccccccccccccccccccccccccccccc --network.maxPeers 55 --targetPeers 50"
if [ ! -n "$LODE_BINARY" ]
then
  if [ ! -n "$LODE_IMAGE" ]
  then
    LODE_IMAGE="chainsafe/lodestar:latest"
  fi;
  lodeCmd="docker run --rm --name beacon${MULTIPEER} -v $DATADIR:/data --network host $LODE_IMAGE dev --dataDir /data/lodestar --jwt-secret /data/jwtsecret  $CL_PORT_ARGS"
else
  lodeCmd="$LODE_BINARY dev --dataDir $DATADIR/lodestar --jwt-secret $DATADIR/jwtsecret  $CL_PORT_ARGS"
fi;
run_cmd "$lodeCmd"
lodePid=$!
echo "lodePid: $lodePid"

trap "echo exit signal received;cleanup" SIGINT SIGTERM

if [ ! -n "$DETACHED" ] && [ -n "$ejsPid" ] && [ -n "$lodePid" ]
then
    echo "launched ejsPid=$ejsPid lodePid=$lodePid"
    echo "use ctl + c on any of these (including this) terminals to stop the process"
    wait -n $ejsPid $lodePid
fi

# if its not detached and is here, it means one of the processes exited/didn't launch
if [ ! -n "$DETACHED" ] && [ -n "$ejsPid$lodePid" ]
then
  echo "cleaning up ejsPid=$ejsPid lodePid=$lodePid "
  cleanup
fi;

echo "Script run finished, exiting ..."
