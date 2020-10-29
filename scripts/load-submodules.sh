#!/bin/sh

TESTS_CONTENTS=$(ls node_modules/ethereumjs-testing/tests)

if [[ ! $TESTS_CONTENTS ]]
then
    cd node_modules/ethereumjs-testing
    echo "Cloning ethereum/tests test files..."
    git clone https://github.com/ethereum/tests --branch develop --single-branch --depth=1 2>/dev/null
    cd -
fi

