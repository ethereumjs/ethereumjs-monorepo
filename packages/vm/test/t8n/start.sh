#!/bin/bash
if [[ "$1" == "--version" ]]; then
    echo "ethereumjs t8n v1"
    exit 0
fi
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
tsx "$SCRIPT_DIR/t8n.ts" "$@"