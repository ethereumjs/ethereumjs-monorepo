#!/usr/bin/env bash

# --------------------------------------------------------------------------------------------------
# A script to test the backwards compatibility of monorepo packages
# with previously published monorepo package sub dependencies.
#
# Substitutes a current package with another version of it installed from npm
# and runs the tests of a package which consumes it.
#
# The monorepo is restored to orignal state after script completes, so this script
# can be run repeatedly for different scenarios in CI
#
# # USAGE
# -t <test> the monorepo package whose tests we'd like to run (ex: vm)
# -d <dependency> the monorepo package dependency we want to swap out (ex: tx)
# -n <npm>    the npm package name to swap in (ex: @ethereumjs/tx)
# -v <version> the npm package version to swap in (ex: 3.0.2)
# -s <script> the script to "npm run" to execute the tests
# --------------------------------------------------------------------------------------------------

# Exit immediately on error
set -o errexit

if [ -z "$CI" ]; then

  echo "=================================================================="
  echo "This script temporarily alters your deps and might mess things up."
  echo "Only run in CI or locally with 'CI=true'                          "
  echo "=================================================================="

  exit 1

fi

# Collect command arguments
while getopts t:d:n:v:s: flag
do
    case "${flag}" in
        t) tst=${OPTARG};;
        d) dep=${OPTARG};;
        n) npm=${OPTARG};;
        v) ver=${OPTARG};;
        s) scr=${OPTARG};;
    esac
done

[ -z $tst ] && echo "Missing -t <test> argument" && exit 1
[ -z $dep ] && echo "Missing -d <dependency> argument" && exit 1
[ -z $npm ] && echo "Missing -n <npm> argument" && exit 1
[ -z $ver ] && echo "Missing -v <version> argument" && exit 1
[ -z $scr ] && echo "Missing -s <script> argument" && exit 1

echo ">> Stashing packages/${dep} in 'stash/'"

mkdir stash
mv packages/${dep} stash

echo ">> Installing and staging ${npm}@${ver}"

mkdir ${dep}
cd ${dep}
npm init --yes
npm install ${npm}@${ver}
mv node_modules/${npm}/* .

# Comment out by default: Injects a log line into the npm installed
# package to verify that the substitute package is *actually* swapped in
# for the targets tests (by looking at terminal output)
#
# echo ">> Injecting verification log line into line 21 of tx/dist/transaction.js"
#
# sed -i -e $'21 a\\\n'"console.log('>>>>> HELLO!!');"  ./dist/transaction.js

echo ">> Swapping packages/${dep} with ${npm}@${ver} and re-linking"

cd ..
mv ${dep} packages
lerna link

echo ">> Executing 'npm run ${scr}' in packages/${tst}"

cd packages/${tst}
npm run ${scr}
cd ../..

echo ">> Un-stashing and relinking packages/${dep}"

rm -rf packages/${dep}
mv stash/${dep} packages
rm -rf stash
rm -rf ${dep}
lerna link
