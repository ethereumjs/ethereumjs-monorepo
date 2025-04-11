#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Create a temporary file to capture output
tmpfile=$(mktemp)
trap 'rm -f $tmpfile; kill -INT $node_pid 2>/dev/null || true' EXIT INT TERM

# File to signal when to exit
exitfile=$(mktemp)
trap 'rm -f $exitfile' EXIT INT TERM

echo "Starting node process..."

# Run the command in background with unbuffered output
PYTHONUNBUFFERED=1 node --conditions=typescript --experimental-strip-types bin/cli.ts --dev=poa --executeBlocks=0 > >(tee -a $tmpfile) 2>&1 &
node_pid=$!

echo "Node process started with PID $node_pid"
echo "Monitoring for error patterns..."

# Use grep to immediately find the patterns instead of tail
(
  # Use timeout to prevent hanging indefinitely
  timeout 300 grep -m 1 -E "Error starting client value|ERR_INVALID_TYPESCRIPT_SYNTAX" <(tail -f $tmpfile) || echo "Timeout reached without finding error patterns" > $tmpfile
  
  # Check which pattern was found
  if grep -q "Error starting client value" $tmpfile; then
    echo "Client start message detected. Terminating process."
    echo "1" > $exitfile
    kill -INT $node_pid 2>/dev/null || true
  elif grep -q "ERR_INVALID_TYPESCRIPT_SYNTAX" $tmpfile; then
    echo "Typescript syntax error detected. Terminating process."
    echo "2" > $exitfile
    kill -INT $node_pid 2>/dev/null || true
  fi
) &
grep_pid=$!

# Wait for either process to finish with a timeout
timeout_duration=300
start_time=$(date +%s)
while kill -0 $node_pid 2>/dev/null && kill -0 $grep_pid 2>/dev/null; do
  current_time=$(date +%s)
  elapsed=$((current_time - start_time))
  
  if [ $elapsed -gt $timeout_duration ]; then
    echo "Timeout reached. Killing processes."
    kill -INT $node_pid 2>/dev/null || true
    kill -INT $grep_pid 2>/dev/null || true
    exit 3
  fi
  
  # Check if exit file exists
  if [[ -s $exitfile ]]; then
    echo "Exit file detected with code $(cat $exitfile)"
    kill -INT $node_pid 2>/dev/null || true
    exit $(cat $exitfile)
  fi
  
  sleep 1
done

# Check if we should exit with a specific error code
if [[ -s $exitfile ]]; then
  echo "Exiting with code $(cat $exitfile)"
  exit $(cat $exitfile)
else
  wait $node_pid || true
  node_exit=$?
  echo "Node process exited with code $node_exit"
  exit $node_exit
fi
