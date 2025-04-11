# Create a named pipe for output monitoring
tmpfile=$(mktemp)
trap 'rm -f $tmpfile' EXIT

# Run the command and capture its PID
node --conditions=typescript --experimental-strip-types bin/cli.ts --dev=poa --executeBlocks=0 2>&1 | { 
  pid=$PPID  # Parent process ID
  while IFS= read -r line; do
    echo "$line"
    if [[ "$line" == *"Error starting client value"* ]]; then
      kill -INT $pid
      exit 1
    fi
    if [[ "$line" == *"ERR_INVALID_TYPESCRIPT_SYNTAX"* ]]; then
      # For this error, also kill the process with SIGINT and exit with error code
      kill -INT $pid
      exit 2
    fi
  done
}
