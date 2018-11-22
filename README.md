# SYNOPSIS

[![NPM Package](https://img.shields.io/npm/v/ethereumjs-vm.svg?style=flat-square)](https://www.npmjs.org/package/ethereumjs-vm)
[![Build Status](
https://img.shields.io/circleci/project/github/ethereumjs/ethereumjs-vm/master.svg
)](https://circleci.com/gh/ethereumjs/ethereumjs-vm)
[![Coverage Status](https://img.shields.io/coveralls/ethereumjs/ethereumjs-vm.svg?style=flat-square)](https://coveralls.io/r/ethereumjs/ethereumjs-vm)
[![Gitter](https://img.shields.io/gitter/room/ethereum/ethereumjs-lib.svg?style=flat-square)](https://gitter.im/ethereum/ethereumjs-lib) or #ethereumjs on freenode

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Implements Ethereum's VM in Javascript.

#### Fork Support

Starting with the ``v2.5.0`` release we now support both ``Byzantium`` and ``Constantinople`` fork rules - with ``Byzantium`` currently being the default (this will change in the future). See [release notes](https://github.com/ethereumjs/ethereumjs-vm/releases/tag/v2.5.0) for further details and have a look at the [API docs](./docs/index.md) on instructions how to instantiate the VM with the respective fork rules.

If you are still looking for a [Spurious Dragon](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-607.md) compatible version of this library install the latest of the ``2.2.x`` series (see [Changelog](./CHANGELOG.md)).

# INSTALL
`npm install ethereumjs-vm`

# USAGE
```javascript
var VM = require('ethereumjs-vm')

//create a new VM instance
var vm = new VM()
var code = '7f4e616d65526567000000000000000000000000000000000000000000000000003055307f4e616d6552656700000000000000000000000000000000000000000000000000557f436f6e666967000000000000000000000000000000000000000000000000000073661005d2720d855f1d9976f88bb10c1a3398c77f5573661005d2720d855f1d9976f88bb10c1a3398c77f7f436f6e6669670000000000000000000000000000000000000000000000000000553360455560df806100c56000396000f3007f726567697374657200000000000000000000000000000000000000000000000060003514156053576020355415603257005b335415603e5760003354555b6020353360006000a233602035556020353355005b60007f756e72656769737465720000000000000000000000000000000000000000000060003514156082575033545b1560995733335460006000a2600033545560003355005b60007f6b696c6c00000000000000000000000000000000000000000000000000000000600035141560cb575060455433145b1560d25733ff5b6000355460005260206000f3'

vm.runCode({
  code: Buffer.from(code, 'hex'), // code needs to be a Buffer
  gasLimit: Buffer.from('ffffffff', 'hex')
}, function(err, results){
  console.log('returned: ' + results.return.toString('hex'));
})
```
Also more examples can be found here
- [examples](./examples)
- [old blog post](https://wanderer.github.io/ethereum/nodejs/code/2014/08/12/running-contracts-with-vm/)

# BROWSER

To build for standalone use in the browser, install `browserify` and check [run-transactions-simple example](https://github.com/ethereumjs/ethereumjs-vm/tree/master/examples/run-transactions-simple). This will give you a global variable `EthVM` to use. The generated file will be at `./examples/run-transactions-simple/build.js`.

# API

## VM

For documentation on ``VM`` instantiation, exposed API and emitted ``events`` see generated [API docs](./docs/index.md).

## StateManger

The API for the ``StateManager`` is currently in ``Beta``, separate documentation can be found [here](./docs/stateManager.md).

The ``StateManager`` API has been largely reworked recently and the ``StateManager`` will be removed from the VM and provided as a separate package in a future ``v3.0.0`` release, see [release notes](https://github.com/ethereumjs/ethereumjs-vm/releases/tag/v2.5.0) for the ``v2.5.0`` VM release for further details.

# Internal Structure
The VM processes state changes at many levels.

* **runBlockchain**
  * for every block, runBlock
* **runBlock**
  * for every tx, runTx
  * pay miner and uncles
* **runTx**
  * check sender balance
  * check sender nonce
  * runCall
  * transfer gas charges
* **runCall**
  * checkpoint state
  * transfer value
  * load code
  * runCode
  * materialize created contracts
  * revert or commit checkpoint
* **runCode**
  * iterate over code
  * run op codes
  * track gas usage
* **OpFns**
  * run individual op code
  * modify stack
  * modify memory
  * calculate fee

The opFns for `CREATE`, `CALL`, and `CALLCODE` call back up to `runCall`.


# TESTING

### Running Tests

Tests can be found in the ``tests`` directory, with ``FORK_CONFIG`` set in ``tests/tester.js``. There are test runners for [State tests](http://www.ethdocs.org/en/latest/contracts-and-transactions/ethereum-tests/state_tests/index.html) and [Blockchain tests](http://www.ethdocs.org/en/latest/contracts-and-transactions/ethereum-tests/blockchain_tests/index.html). VM tests are disabled since Frontier gas costs are not supported any more. Tests are then executed by the [ethereumjs-testing](https://github.com/ethereumjs/ethereumjs-testing) utility library using the official client-independent [Ethereum tests](https://github.com/ethereum/tests).

For a wider picture about how to use tests to implement EIPs you can have a look at this [reddit post](https://www.reddit.com/r/ethereum/comments/6kc5g3/ethereumjs_team_is_seeking_contributors/)
or the associated YouTube video introduction to [core development with Ethereumjs-vm](https://www.youtube.com/watch?v=L0BVDl6HZzk&feature=youtu.be).

#### Running different Test Types

Running all the tests:

`npm test`

Running the State tests:

`node ./tests/tester -s`

Running the Blockchain tests:

`node ./tests/tester -b`

State tests and Blockchain tests can also be run against the ``dist`` folder (default: ``lib``):
  
`node ./tests/tester -b --dist`

State tests run significantly faster than Blockchain tests, so it is often a good choice to start fixing State tests.

#### Running Specific Tests

Running all the blockchain tests in a file:

`node ./tests/tester -b --file='randomStatetest303'`

Running tests from a specific directory:

`node ./tests/tester -b --dir='bcBlockGasLimitTest'`

Running a specific state test case:

`node ./tests/tester -s --test='stackOverflow'`

Only run test cases with selected ``data``, ``gas`` and/or ``value`` values (see 
[attribute description](http://ethereum-tests.readthedocs.io/en/latest/test_types/state_tests.html) in 
test docs), provided by the index of the array element in the test ``transaction`` section:

`node tests/tester -s --test='CreateCollisionToEmpty' --data=0 --gas=1 --value=0`

Run a state test from a specified source file not under the ``tests`` directory:
`node ./tests/tester -s --customStateTest='{path_to_file}'`

#### Running tests with a reporter/formatter

`npm run formatTest -t [npm script name OR node command]` will pipe to `tap-spec` by default.

To pipe the results of the API tests through `tap-spec`:

`npm run formatTest -- -t testAPI`

To pipe the results of tests run with a node command through `tap-spec`:

`npm run formatTest -- -t "./tests/tester -b --dir='bcBlockGasLimitTest'"`

The `-with` flag allows the specification of a formatter of your choosing:

`npm install -g tap-mocha-reporter`
`npm run formatTest -- -t testAPI -with 'tap-mocha-reporter json'`

#### Skipping Tests

There are three types of skip lists (``BROKEN``, ``PERMANENT`` and ``SLOW``) which
can be found in ``tests/tester.js``. By default tests from all skip lists are omitted.

You can change this behaviour with:

`node tests/tester -s --skip=BROKEN,PERMANENT`

to skip only the ``BROKEN`` and ``PERMANENT`` tests and include the ``SLOW`` tests.
There are also the keywords ``NONE`` or ``ALL`` for convenience.

It is also possible to only run the tests from the skip lists:

`node tests/tester -s --runSkipped=SLOW`

### CI Test Integration

Tests are run on ``CircleCI`` on every PR, configuration can be found in ``.circleci/config.yml``.

### Debugging

#### Local Debugging

For state tests you can use the ``--jsontrace`` flag to output opcode trace information.

Blockchain tests support `--debug` to verify the postState:

`node ./tests/tester -b  --debug --test='ZeroValue_SELFDESTRUCT_ToOneStorageKey_OOGRevert_d0g0v0_EIP158'`

All/most State tests are replicated as Blockchain tests in a ``GeneralStateTests`` [sub directory](https://github.com/ethereum/tests/tree/develop/BlockchainTests/GeneralStateTests) in the Ethereum tests repo, so for debugging single test cases the Blockchain test version of the State test can be used.

#### Debugging Tools

For comparing ``EVM`` traces [here](https://gist.github.com/cdetrio/41172f374ae32047a6c9e97fa9d09ad0) are some instructions for setting up ``pyethereum`` to generate corresponding traces for state tests.

Compare TAP output from blockchain/state tests and produces concise diff of the differences between them (example):

```
curl https://gist.githubusercontent.com/jwasinger/6cef66711b5e0787667ceb3db6bea0dc/raw/0740f03b4ce90d0955d5aba1e0c30ce698c7145a/gistfile1.txt > output-wip-byzantium.txt
curl https://gist.githubusercontent.com/jwasinger/e7004e82426ff0a7137a88d273f11819/raw/66fbd58722747ebe4f7006cee59bbe22461df8eb/gistfile1.txt > output-master.txt
python utils/diffTestOutput.py output-wip-byzantium.txt output-master.txt
```

An extremely rich and powerful toolbox is the [evmlab](https://github.com/holiman/evmlab) from ``holiman``, both for debugging and creating new test cases or example data.


# LICENSE
[MPL-2.0](https://www.mozilla.org/MPL/2.0/)
