#!/bin/sh

# Performs a diff between current type definition files and the latest published on npm. 
# This is useful as a helper to detect interface and API changes, without having to look
# at source files or performing git diffs.
# 
# Usage: ./scripts/ts-interface-diff.sh ethereumjs-vm packages/vm/
# Run from repository root
# 
# To send stdout to VS Code to leverage better tools to visualize diff, you can run:
# ./scripts/ts-interface-diff.sh ethereumjs-blockchain packages/blockchain/ | code-
# 

NPM_PACKAGE=$1
DIST_PATH=$2

# setting up workspace
rm -rf .tmp/$NPM_PACKAGE
mkdir -p .tmp/$NPM_PACKAGE

# Downloads latest published pacakge from npm. Stores tarball file name in variable TGZ
TGZ=`npm pack $NPM_PACKAGE`

# unpacks to .tmp/ethereumjs-vm
tar -xzf $TGZ --strip-components=1 -C .tmp/$NPM_PACKAGE
rm $TGZ

cd .tmp/$NPM_PACKAGE
RELATIVE_PATHS=`find . -iname "*.d.ts"`
cd -

echo "TypeScript definition files found in published npm package:"
echo $RELATIVE_PATHS | tr ' ' '\n'

# echoes the file diffs.
for FILE in $RELATIVE_PATHS
do
    echo "====================================="
    echo $FILE
    echo "====================================="
    diff ".tmp/$NPM_PACKAGE/$FILE" "$DIST_PATH/$FILE"
done
