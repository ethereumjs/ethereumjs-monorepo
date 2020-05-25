#!/bin/sh -x
#############################################################
# Manual test file for state test runner option sanity checks
#
# Evoke from repository root with
# ./tests/state-test-run-test.sh
#############################################################

ts-node ./tests/tester --state --test='stackOverflow'
ts-node ./tests/tester --state --test='stackOverflow' --fork='Istanbul'
ts-node ./tests/tester --state --test='CreateCollisionToEmpty' --data=0 --gas=1 --value=0
# Test should be executed
ts-node ./tests/tester --state --test='stackOverflow' --skip=BROKEN,PERMANENT
# Test should be executed
ts-node ./tests/tester --state --test='stackOverflow' --skip=SLOW
# Test should not be executed (test in skip list)
ts-node ./tests/tester --state --test='UncleFromSideChain' --skip=BROKEN,PERMANENT
ts-node ./tests/tester --state --customStateTest='./node_modules/ethereumjs-testing/tests/GeneralStateTests/stCreate2/create2InitCodes.json'
ts-node ./tests/tester --state --test='CreateCollisionToEmpty' --jsontrace
 
