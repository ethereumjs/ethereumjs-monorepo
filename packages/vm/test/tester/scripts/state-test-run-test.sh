#!/bin/sh -x
#############################################################
# Manual test file for state test runner option sanity checks
#
# Evoke from repository root with
# ./test/tester/scripts/state-test-run-test.sh
#############################################################

tsx ./test/tester --state --test='stackOverflow'
tsx ./test/tester --state --test='stackOverflow' --fork='Istanbul'
tsx ./test/tester --state --test='CreateCollisionToEmpty' --data=0 --gas=1 --value=0
# Test should be executed
tsx ./test/tester --state --test='stackOverflow' --skip=BROKEN,PERMANENT
# Test should be executed
tsx ./test/tester --state --test='stackOverflow' --skip=SLOW
# Test should not be executed (test in skip list)
tsx ./test/tester --state --test='UncleFromSideChain' --skip=BROKEN,PERMANENT
tsx ./test/tester --state --customStateTest='./node_modules/ethereumjs-testing/tests/GeneralStateTests/stCreate2/create2InitCodes.json'
tsx ./test/tester --state --test='CreateCollisionToEmpty' --jsontrace
 
