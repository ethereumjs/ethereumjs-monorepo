#!/bin/sh
set -o xtrace
set -e

# Performs a diff between current type definition files and the latest published on npm. 
# This is useful as a helper to detect interface and API changes, without having to look
# at source files or performing git diffs. 
# 
# Note: this script assumes that the d.ts files live under ./dist directory.
# 
# Usage: ./scripts/ts-interface-diff.sh ethereumjs-vm packages/vm/
# Run from repository root
# 
# To send stdout to VS Code to leverage better tools to visualize diff, you can run:
# ./scripts/ts-interface-diff.sh ethereumjs-blockchain packages/blockchain/ | code-
# 

PACKAGE_NAME=$1
DIST_PATH=$2/dist
CACHE_PATH=.tmp/$PACKAGE_NAME/cache

# A and B are parts of the comparison
A_PATH=.tmp/$PACKAGE_NAME/A # definition files from npm
B_PATH=.tmp/$PACKAGE_NAME/B # definition files from repo

# setting up dir tree
rm -rf .tmp/$PACKAGE_NAME
mkdir -p $CACHE_PATH $A_PATH $B_PATH

A_FULL_PATH=`realpath $A_PATH`
B_FULL_PATH=`realpath $B_PATH`

# Downloads latest published package from npm. Stores tarball file name in variable TGZ
TGZ=`npm pack $PACKAGE_NAME`

# unpacks to $CACHE_PATH
tar -xzf $TGZ --strip-components=1 -C $CACHE_PATH

# # copies definition files recursively from unpacked package
cd $CACHE_PATH/dist
pwd -L
find . | grep -E "\.d\.ts$" | cpio -pvd $A_FULL_PATH
cd -

# copies definition files recursively to a tmp directory
cd $DIST_PATH
find . | grep -E "\.d\.ts$" | cpio -pvd $B_FULL_PATH
cd -

# cleanup
rm -rf $TGZ $CACHE_PATH

git diff --no-index -- $A_PATH $B_PATH

# fin.

###
# After running this script, you can just run the standalone command:
# git diff --no-index -- .tmp/ethereumjs-vm/A .tmp/ethereumjs-vm/B
# 
# or variations of it:
# git diff --word-diff=color --no-index -- .tmp/ethereumjs-vm/A .tmp/ethereumjs-vm/B
###
