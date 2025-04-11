#!/bin/bash

# Create a temporary file to capture output
tmpfile=$(mktemp)
trap 'rm -f $tmpfile' EXIT INT TERM

# File to signal when to exit
exitfile=$(mktemp)
trap 'rm -f $exitfile' EXIT INT TERM

# Run the command in background, redirecting all output to both stdout and the temp file
node --conditions=typescript --experimental-strip-types bin/cli.ts --dev=poa --executeBlocks=0 > >(tee $tmpfile) 2>&1 &
node_pid=$!

# Monitor output for error patterns in the background
tail -f $tmpfile | {
  while IFS= read -r line; do
    if [[ "$line" == *"Error starting client value"* ]]; then
      echo "Client started successfully."
      kill -INT $node_pid
      echo "1" > $exitfile
      exit
    fi
    
    if [[ "$line" == *"ERR_INVALID_TYPESCRIPT_SYNTAX"* ]]; then
      echo "Error detected: 'ERR_INVALID_TYPESCRIPT_SYNTAX'. Terminating process."
      kill -INT $node_pid
      echo "2" > $exitfile
      exit
    fi
  done
} &

# Wait for the node process to finish
wait $node_pid
node_exit=$?

# Check if we should exit with a specific error code
if [[ -s $exitfile ]]; then
  exit $(cat $exitfile)
else
  exit $node_exit
fi
