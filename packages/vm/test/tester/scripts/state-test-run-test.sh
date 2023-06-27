#!/bin/sh -x
#############################################################
# Manual test file for state test runner option sanity checks
#
# Evoke from repository root with
# ./test/tester/scripts/state-test-run-test.sh
#############################################################


 TEST='stackOverflow' npx vitest run ./test/tester/state/index.spec.ts
 TEST='stackOverflow' FORK='istanbul' npx vitest run ./test/tester/state/index.spec.ts
 TEST='CreateCollisionToEmpty' DATA=0 GAS=1 VALUE=0 npx vitest run ./test/tester/state/index.spec.ts
# Test should be executed

TEST='stackOverflow' SKIP=BROKEN,PERMANENT npx vitest run ./test/tester/state/index.spec.ts

# Test should be executed
TEST='stackOverflow' SKIP=SLOW npx vitest run ./test/tester/state/index.spec.ts

# Test should not be executed (test in skip list)
TEST='UncleFromSideChain' SKIP=BROKEN,PERMANENT npx vitest run ./test/tester/state/index.spec.ts
CUSTOMSTATETEST='./node_modules/ethereumjs-testing/tests/GeneralStateTests/stCreate2/create2InitCodes.json' npx vitest run ./test/tester/state/index.spec.ts
TEST='CreateCollisionToEmpty' JSONTRACE=true npx vitest run ./test/tester/state/index.spec.ts
 
