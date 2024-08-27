#!/bin/bash
if [[ "$1" == "--version" ]]; then
    echo "ethereumjs t8n v1"
    exit 0
fi
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
NODE_OPTIONS="--max-old-space-size=4096" tsx "$SCRIPT_DIR/t8n.ts" "$@"