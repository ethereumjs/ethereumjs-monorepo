#!/bin/bash
if [[ "$1" == "--version" ]]; then
    echo "ethereumjs t8n v1"
    exit 0
fi
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
export NODE_OPTIONS="--max-old-space-size=4096" 
npx tsx --conditions=typescript "$SCRIPT_DIR/launchT8N.ts" "$@"