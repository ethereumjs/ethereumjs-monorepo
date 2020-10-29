#!/bin/sh

#
# Yarn doesn't handle well git submodules inside package dependencies
# This postinstall script loads this specific submodule, found in ethereumjs-testing.
# The git clone is only executed if the directory is empty, to prevent bad experience.
#

TESTS_CONTENTS=$(ls node_modules/ethereumjs-testing/tests)

if [ ! "$TESTS_CONTENTS" ]
then
    cd node_modules/ethereumjs-testing || exit
    echo "Cloning ethereum/tests test files..."
    git clone https://github.com/ethereum/tests --branch develop --single-branch --depth=1 2>/dev/null
fi

