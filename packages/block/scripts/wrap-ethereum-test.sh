#!/bin/sh

#
# It wraps the provided JSON file and adds some metadata to it (source, commit, date).
# Based on these instructions: https://github.com/ethereumjs/ethereumjs-block/issues/55
#
# Usage: 
# ./wrap-ethereum-test.sh "https://raw.githubusercontent.com/ethereum/tests/eea4bfbeec5524b2e2c0ff84c8a350fcb3edec23/BasicTests/difficultyEIP2384.json"
# The url must contain the commit hash and should point to a raw JSON file
#

URL=$1

DATE=`date +%Y-%m-%d`
COMMIT=$(echo "$URL" | sed -E 's/.+\/([a-f0-9]+)\/.+/\1/')
FILENAME=$(echo $URL | sed -E 's/.+\/([^\/]+)$/\1/')

echo "URL: $URL\nFILENAME: $FILENAME\nDATE: $DATE" 

curl $URL | jq -r --arg SOURCE "$URL" --arg COMMIT "$COMMIT" --arg DATE "$DATE" '{ source: $SOURCE, commit: $COMMIT, date: $DATE, tests: .}' > $FILENAME