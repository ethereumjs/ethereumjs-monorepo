# Developer Documentation

## Table of Contents

- [TESTING](#testing)
  - [Introduction](#introduction)
  - [General Test Execution](#general-test-execution)
  - [Running Specific Tests on PRs](#running-specific-tests-on-prs)
- [COVERAGE](#coverage)
  - [Spec Tests Coverage](#spec-tests-coverage)
  - [Coverage Reporting](#coverage-reporting)
- [TEST GENERATION](#test-generation)
  - [`execution-spec-tests` Integration (T8NTool)](#execution-spec-tests-integration-t8ntool)
- [DEBUGGING](#debugging)
  - [Local Debugging](#local-debugging)
  - [Comparing Stack Traces](#comparing-stack-traces)
  - [Debugging Tools](#debugging-tools)
- [PERFORMANCE](#performance)
  - [Build-in Profiling](#build-in-profiling)
  - [Using External Tools](#using-external-tools)
  - [Git Branch Performance Testing](#git-branch-performance-testing)
  - [Benchmarks](#benchmarks)

## TESTING

### Introduction

Tests can be found in the `tests` directory.

We have new test runners for [State tests](./test/tester/executionSpecState.test.ts) and [Blockchain tests](./test/tester/executionSpecBlockchain.test.ts).
The old test runners for [State tests](./test/tester/runners/GeneralStateTestsRunner.ts) and [Blockchain tests](./test/tester/runners/BlockchainTestsRunner.ts) are deprecated and will be removed in the future, but can still be used for now and also still supports some functionality that is not yet available in the new runners.

IF YOU DISCOVER FUNCTIONALITY HERE WHICH IS STILL MISSING IN THE NEW RUNNER, PLEASE OPEN A PR AGAINST THE NEW RUNNER FILE(S).

Currently there is a hybrid situation where tests from old forks are still run against the now-deprecated [Ethereum tests](https://github.com/ethereum/tests) repository, while we started to run news tests (Osaka+) against the new [execution-spec-tests](https://github.com/ethereum/execution-spec-tests) repository (which now again transitioned to [execution-specs](https://github.com/ethereum/execution-specs)).

There are currently two submodules integrated along:

- [packages/ethereum-tests](./../ethereum-tests/) pointing towards a specific commit or tag from the `ethereum/tests` `develop` branch.
- [packages/execution-spec-tests](./../execution-spec-tests/) pointing to an own custom fixture "fork" for `execution-spec-tests` fixtures
located called [execution-spec-tests-fixtures](https://github.com/ethereumjs/execution-spec-tests-fixtures) (maintained by the EthereumJS team)

All this will evolve during the next few months, but for now we need to support both.

### General Test Execution

#### State Tests

State tests run on Vitest via an npm script. Recommended commands:

```bash
# Run with default fork (Prague)
npm run test:state

# Run with specific fork
npm run test:state -- --fork=Constantinople

# Run a specific test
npm run test:state -- --test=stackOverflow
```

You can also invoke Vitest directly:
```bash
// Old runner
VITE_FORK=Prague npx vitest test/tester/state.spec.ts

// New runner
npx vitest test/tester/executionSpecState.test.ts
```

This version (old runner) uses environment variables like `VITE_FORK`, `VITE_TEST`, `VITE_DIR`, etc.

Additional test scripts:

```bash
npm run test:state:newForks
npm run test:state:oldForks
npm run test:state:transitionForks
npm run test:state:allForks
npm run test:state:slow
```

#### Blockchain Tests

Blockchain tests run on Vitest (using a wrapper if you want to use CLI arguments):

```bash
# Direct command
// Old runner
VITE_FORK=Prague npx vitest test/tester/blockchain.spec.ts

// New runner
npx vitest test/tester/executionSpecBlockchain.test.ts

# Via npm script
npm run test:blockchain
```

#### Running with compiled code

Tests run against source by default. To run with compiled output:

```bash
# State tests
npm run build:dist && npm run test:state -- --dist

# Blockchain tests
npm run build:dist && npm run test:blockchain -- --dist
```

By default state tests use the latest hardfork (for the old runner: `DEFAULT_FORK_CONFIG` in `test/tester/config.ts`, currently `Prague`).

#### Running with specific forks and EIPs

NOT FULLY IMPLEMENTED IN NEW RUNNER YET.

The `--fork` parameter can also be used to activate EIPs. This is done by first entering the hardfork, and then add the EIPs separated with the `+` sign. For instance:

`npm run test:state -- --fork='London+3855'`

To activate multiple EIPs:

`npm run test:blockchain -- --fork='London+3855+3860'`

Note: most combinations will run 0 tests due to missing testdata.

#### Test Scope on PRs

On an ordinary PR, `vm-state-extended` and `vm-blockchain-extended` will be skipped
unless the special label `type: test all hardforks` is applied.
If the label is removed, the extended tests will not run anymore.

### Running Specific Tests on PRs

#### State Tests

Running a specific state test case:

```bash
# Using npm script
npm run test:state -- --test='stackOverflow'

# Direct command
// Old runner
VITE_TEST='stackOverflow' npx vitest test/tester/state.spec.ts

// New runner
NOT IMPLEMENTED YET.
```

Running all tests in a file:

```bash
npm run test:state -- --file='create2collisionCode2'
```

Running tests from a specific directory:

```bash
npm run test:state -- --dir='stCreate2'
```

Only run test cases with selected `data`, `gas` and/or `value` values (see
[attribute description](http://ethereum-tests.readthedocs.io/en/latest/test_types/state_tests.html) in
test docs), provided by the index of the array element in the test `transaction` section:

```bash
npm run test:state -- --test='CreateCollisionToEmpty' --data=0 --gas=1 --value=0
```

Recursively run all tests from a custom directory:

```bash
npm run test:state -- --fork='London' --customTestsPath=../../my_custom_test_folder
```

Run a test from a specified source file not under the `tests` directory:

```bash
npm run test:state -- --customStateTest='{path_to_file}'
```

#### Blockchain Tests

Running all the blockchain tests in a file:

```bash
npm run test:blockchain -- --file='randomStatetest303'
# Or
// Old runner
VITE_FILE='randomStatetest303' npx vitest test/tester/blockchain.spec.ts
```

Running tests from a specific directory:

```bash
npm run test:blockchain -- --dir='bcBlockGasLimitTest'
# Or
// Old runner
VITE_DIR='bcBlockGasLimitTest' npx vitest test/tester/blockchain.spec.ts
```

#### Skipping Tests

There are three types of skip lists (`BROKEN`, `PERMANENT` and `SLOW`) which
can be found in `test/tester/config.ts`. By default tests from all skip lists are omitted.

You can change this behaviour with:

`npm run test:state -- --skip=BROKEN,PERMANENT`

to skip only the `BROKEN` and `PERMANENT` tests and include the `SLOW` tests.
There are also the keywords `NONE` or `ALL` for convenience.

It is also possible to only run the tests from the skip lists:

`npm run test:state -- --runSkipped=SLOW`

## COVERAGE

### Spec Tests Coverage

The following command shows an example of how to get coverage for a set of the official spec test files:

```bash
DEBUG=ethjs,dummy:* VITE_CUSTOM_TESTS_PATH=../execution-spec-tests/fusaka-devnet-5/state_tests/osaka/eip7951_p256verify_precompiles  VITE_FORK=Osaka npx vitest watch --coverage --coverage.reporter=html --ui --coverage.allowExternal --coverage.include=evm/src/precompiles/0c-bls12-g1msm.ts [--coverage.include=evm/src/precompiles/index.ts] test/tester/state.spec.ts
```

This can be useful to identify gaps in the coverage of the official spec tests and see where additional tests are needed.

The specific command stays in "watch" mode and opens a specific UI to see coverage also for EVM files (this needs the `coverage.allowExternal` flag to be set). The `DEBUG` part can be helpful to not have coverage being distorted by non-debug calls artificially lowering the coverage.

### Coverage Reporting

Vitest has built-in reporters. Use Vitest's `--reporter` option for both suites:

```bash
# JSON reporter
npx vitest test/tester/state.spec.ts --reporter=json
npx vitest test/tester/blockchain.spec.ts --reporter=json

# Verbose reporter
npx vitest test/tester/state.spec.ts --reporter=verbose
npx vitest test/tester/blockchain.spec.ts --reporter=verbose

# See all options
npx vitest --help
```

If no reporter or formatter is provided, results are reported by Vitest's default reporter.

## TEST GENERATION

Ethereum's official test suite can be found in the [execution-specs](https://github.com/ethereum/execution-specs) repository.

### Test Generation with EELS

To use the built-in (so: on the test repo side) EELS EVM implementation, follow the installation instructions in the [execution-specs](https://github.com/ethereum/execution-specs) repository and e.g. fill tests with:

```bash
uv run fill -v tests/prague/eip2537_bls_12_381_precompiles/test_bls12_g1msm.py --fork Osaka --clean -m state_test
```

This will generate fixtures in the following directory:

```text
fixtures/state_tests/prague/eip2537_bls_12_381_precompiles/bls12_g1msm/
```

These tests can then be integrated e.g. to analyze test coverage by using the following (or similar) test path (from within the VM package):

```bash
VITE_CUSTOM_TESTS_PATH=../../../execution-specs/fixtures/state_tests/prague/eip2537_bls_12_381_precompiles/bls12_g1msm/
```

### Test Generation with EthereumJS/T8NTool

The VM has t8ntool (transition-tool) support, see: <https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/test/t8n/README.md>. This tool can be used to create fixtures from the `execution-spec-tests` repo. These fixtures can be consumed by other clients in their test runner (similar to running `npm run test:blockchain` or `npm run test:state` in the VM package). The t8ntool readme also links to a guide on how to write tests to contribute to `execution-spec-tests`.

## DEBUGGING

### Local Debugging

For state tests you can use the `--jsontrace` flag to output opcode trace information.

Blockchain tests support `--debug` to verify the postState:

`npm run test:blockchain -- --debug --test='ZeroValue_SELFDESTRUCT_ToOneStorageKey_OOGRevert_d0g0v0_EIP158'`

All/most State tests are replicated as Blockchain tests in a `GeneralStateTests` [sub directory](https://github.com/ethereum/tests/tree/develop/docs/test_types/TestStructures/GeneralStateTests) in the Ethereum tests repo, so for debugging single test cases the Blockchain test version of the State test can be used.

### Comparing Stack Traces

Other client implementations often also provide functionality for output trace information.

A convenient way is to use a local `geth` installation (can be the binary installation and doesn't has to be build from source or something) and then use the included `evm` tool like:

```shell
evm --json --nomemory statetest node_modules/ethereumjs-testing/tests/GeneralStateTests/stCreate2/create2collisionCode2.json
```

If you want to have only the output for a specific fork you can go into the referenced json test file and temporarily delete the `post` section for the non-desired fork outputs (or, more safe and also more convenient on triggering later: copy the test files you are interested in to your working directory and then modify without further worrying).

### Debugging Tools

For comparing `EVM` traces [here](https://gist.github.com/cdetrio/41172f374ae32047a6c9e97fa9d09ad0) are some instructions for setting up `pyethereum` to generate corresponding traces for state tests.

Compare TAP output from blockchain/state tests and produces concise diff of the differences between them (example):

```
curl https://gist.githubusercontent.com/jwasinger/6cef66711b5e0787667ceb3db6bea0dc/raw/0740f03b4ce90d0955d5aba1e0c30ce698c7145a/gistfile1.txt > output-wip-byzantium.txt
curl https://gist.githubusercontent.com/jwasinger/e7004e82426ff0a7137a88d273f11819/raw/66fbd58722747ebe4f7006cee59bbe22461df8eb/gistfile1.txt > output-master.txt
python utils/diffTestOutput.py output-wip-byzantium.txt output-master.txt
```

An extremely rich and powerful toolbox is the [evmlab](https://github.com/holiman/evmlab) from `holiman`, both for debugging and creating new test cases or example data.

## PERFORMANCE

### Build-in Profiling

Test runs can be profiled using the new EVM/VM profiling functionality by using the `--profile` option for test runs:

`npm run test:state -- --test='CreateCollisionToEmpty' --data=0 --gas=1 --value=0 --profile`

### Using External Tools

[Clinic](https://github.com/nearform/node-clinic) allows profiling the VM in the node environment. It supports various profiling methods, among them is [flame](https://github.com/nearform/node-clinic-flame) which can be used for generating flamegraphs to highlight bottlenecks and hot paths. As an example, to generate a flamegraph for the VM blockchain tests, you can run:

```sh
NODE_OPTIONS="--max-old-space-size=4096" clinic flame -- VITE_EXCLUDE_DIR='GeneralStateTests' npx vitest test/tester/blockchain.spec.ts
```

### Git Branch Performance Testing

The [`diffTester`](./scripts/diffTester.sh) script can be used to do simple comparative performance testing of changes made targeting the VM. This script allows you to run a single State test a specified number of times on two different branches and reports the average time of the test run for each branch. While not statistically rigorous, it gives you a quick sense of how a specific change (or set of changes) may impact VM performance on a given area that is covered by one specific test. Run this script from `[monorepo-root]/packages/vm` as below:

```sh
./scripts/diffTester.sh -b git-branch-you-want-to-test -t "path/to/my/favorite/state/test.json" -r [the number of times to run the test]
```

and it will produce output like for the `git-branch-you-want-to-test` and then whatever git branch you are currently on:

```sh
TAP version 13
# GeneralStateTests
# file: path/to/my/favorite/state/test.json test: test
ok 1 [ 3.785 secs ] the state roots should match (successful tx run)
ok 2 [ 1.228 secs ] the state roots should match (successful tx run)
ok 3 [ 1.212 secs ] the state roots should match (successful tx run)
ok 4 [ 1.306 secs ] the state roots should match (successful tx run)
ok 5 [ 1.472 secs ] the state roots should match (successful tx run)
# Average test run: 1.801 s
```

Note: this script runs by actually checking out the targeted branch, running the test, and then switching back to your current branch, running the test again, and then restoring any changes you had in the current branch. For best results, you should run this test while you currently have `master` checked out.

### Benchmarks

This helps us see how the VM performs when running mainnet blocks.

View the historical benchmark data for the master branch on the [github page](http://ethereumjs.github.io/ethereumjs-monorepo/dev/bench/vm).

We want to use the compiled JS so `tsx` does not show up in the profile. So run:

`npm run build:benchmarks`

Then:

`npm run benchmarks -- mainnetBlocks`

To define the number of samples to be run pass in a number like so: `npm run benchmarks -- mainnetBlocks:10`

If you want to get a more detailed look to find bottlenecks we can use [0x](https://github.com/davidmarkclements/0x):

```
npm run profiling -- mainnetBlocks:10
```

and open the link it generates.

For a high-level introduction on flame graphs see e.g. [this](https://blog.codecentric.de/en/2017/09/jvm-fire-using-flame-graphs-analyse-performance/) blog article (the non-Java part).

