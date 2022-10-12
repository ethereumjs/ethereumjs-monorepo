#!/bin/sh -x
##################################################################
# Manual test file for blockchain test runner option sanity checks
#
# Evoke from repository root with
# ./tests/tester/scripts/blockchain-test-run-test.sh
##################################################################

ts-node ./tests/tester --blockchain --file='randomStatetest303'
# Test that uses the expectException properties in BlockchainTests test files
ts-node ./tests/tester --blockchain --file='GasUsedHigherThanBlockGasLimitButNotWithRefundsSuicideLast'