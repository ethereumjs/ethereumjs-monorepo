#!/bin/sh -x
#############################################################
# Manual test file for state test runner option sanity checks
#
# Evoke from repository root with
# ./test/tester/scripts/state-test-run-test.sh
#############################################################

npm run test:state -- --test='stackOverflow'
npm run test:state -- --test='stackOverflow' --fork='Istanbul'
npm run test:state -- --test='CreateCollisionToEmpty' --data=0 --gas=1 --value=0
# Test should be executed
npm run test:state -- --test='stackOverflow' --skip=BROKEN,PERMANENT
# Test should be executed
npm run test:state -- --test='stackOverflow' --skip=SLOW
# Test should not be executed (test in skip list)
npm run test:state -- --test='UncleFromSideChain' --skip=BROKEN,PERMANENT
npm run test:state -- --customStateTest='./node_modules/ethereumjs-testing/tests/GeneralStateTests/stCreate2/create2InitCodes.json'
npm run test:state -- --test='CreateCollisionToEmpty' --jsontrace
 
