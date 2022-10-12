#!/bin/sh -x
#############################################################
# Manual test file for state test runner option sanity checks
#
# Evoke from repository root with
# ./test/tester/scripts/state-test-run-test.sh
#############################################################

ts-node ./test/tester --state --test='stackOverflow'
ts-node ./test/tester --state --test='stackOverflow' --fork='Istanbul'
ts-node ./test/tester --state --test='CreateCollisionToEmpty' --data=0 --gas=1 --value=0
# Test should be executed
ts-node ./test/tester --state --test='stackOverflow' --skip=BROKEN,PERMANENT
# Test should be executed
ts-node ./test/tester --state --test='stackOverflow' --skip=SLOW
# Test should not be executed (test in skip list)
ts-node ./test/tester --state --test='UncleFromSideChain' --skip=BROKEN,PERMANENT
ts-node ./test/tester --state --customStateTest='./node_modules/ethereumjs-testing/tests/GeneralStateTests/stCreate2/create2InitCodes.json'
ts-node ./test/tester --state --test='CreateCollisionToEmpty' --jsontrace
 
