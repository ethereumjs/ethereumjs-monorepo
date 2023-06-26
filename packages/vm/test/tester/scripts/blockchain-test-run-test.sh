#!/bin/sh -x
##################################################################
# Manual test file for blockchain test runner option sanity checks
#
# Evoke from repository root with
# ./test/tester/scripts/blockchain-test-run-test.sh
##################################################################

ts-node ./test/tester --blockchain --file='randomStatetest303'
# Test that uses the expectException properties in BlockchainTests test files
ts-node ./test/tester --blockchain --file='GasUsedHigherThanBlockGasLimitButNotWithRefundsSuicideLast'