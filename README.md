# SYNOPSIS

[![NPM Package](https://img.shields.io/npm/v/ethereumjs-vm.svg?style=flat-square)](https://www.npmjs.org/package/ethereumjs-vm)
[![Build Status](https://img.shields.io/circleci/project/github/ethereumjs/ethereumjs-vm/master.svg)](https://circleci.com/gh/ethereumjs/ethereumjs-vm)
[![Coverage Status](https://img.shields.io/coveralls/ethereumjs/ethereumjs-vm.svg?style=flat-square)](https://coveralls.io/r/ethereumjs/ethereumjs-vm)
[![Gitter](https://img.shields.io/gitter/room/ethereum/ethereumjs.svg?style=flat-square)](https://gitter.im/ethereum/ethereumjs)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Implements Ethereum's VM in Javascript.

#### Fork Support

The VM currently supports the following hardfork rules:

- `Byzantium`
- `Constantinople`
- `Petersburg` (default)
- `Istanbul` (`DRAFT`)

If you are still looking for a [Spurious Dragon](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-607.md) compatible version of this library install the latest of the `2.2.x` series (see [Changelog](./CHANGELOG.md)).

##### Istanbul Harfork Support

With the `v4.0.0` release we are starting to add implementations of EIPs being
candidates or accepted for inclusion within the `Istanbul` hardfork. You can
activate a preliminary `Istanbul` VM by using the `istanbul` `hardfork` option
flag.

Currently supported `Istanbul` EIPs:

- [EIP-1108](https://eips.ethereum.org/EIPS/eip-1803) (Candidate): `alt_bn128` Gas Cost Reductions, see PR [#540](https://github.com/ethereumjs/ethereumjs-vm/pull/540)

Note that this is highly experimental and solely meant for experimental purposes,
since `Istanbul` scope is not yet finalized and most EIPs are still in a `DRAFT`
state and likely subject to updates and changes.

A final `Istanbul` VM will be released along a major version bump to likely
`v5.0.0` or `v6.0.0`.

Have a look at the corresponding issue to follow the discussion and current state on
[Istanbul planning](https://github.com/ethereumjs/ethereumjs-vm/issues/501).

# INSTALL

`npm install ethereumjs-vm`

# USAGE

```javascript
const BN = require('bn.js')
var VM = require('ethereumjs-vm').default

// Create a new VM instance
// For explicity setting the HF use e.g. `new VM({ hardfork: 'petersburg' })`
const vm = new VM()

const STOP = '00'
const ADD = '01'
const PUSH1 = '60'

// Note that numbers added are hex values, so '20' would be '32' as decimal e.g.
const code = [PUSH1, '03', PUSH1, '05', ADD, STOP]

vm.on('step', function(data) {
  console.log(`Opcode: ${data.opcode.name}\tStack: ${data.stack}`)
})

vm.runCode({
  code: Buffer.from(code.join(''), 'hex'),
  gasLimit: new BN(0xffff),
})
  .then(results => {
    console.log('Returned : ' + results.return.toString('hex'))
    console.log('gasUsed  : ' + results.gasUsed.toString())
  })
  .catch(err => console.log('Error    : ' + err))
```

## Example

This projects contain the following examples:

1. [./examples/run-blockchain](./examples/run-blockchain): Loads tests data, including accounts and blocks, and runs all of them in the VM.
1. [./examples/run-code-browser](./examples/run-code-browser): Show how to use this library in a browser.
1. [./examples/run-solidity-contract](./examples/run-solidity-contract): Compiles a Solidity contract, and calls constant and non-constant functions.
1. [./examples/run-transactions-complete](./examples/run-transactions-complete): Runs a contract-deployment transaction and then calls one of its functions.
1. [./examples/decode-opcodes](./examples/decode-opcodes): Decodes a binary EVM program into its opcodes.

All of the examples have its own `README.md` explaining how to run them.

# BROWSER

To build for standalone use in the browser, install `browserify` and check [run-transactions-simple example](https://github.com/ethereumjs/ethereumjs-vm/tree/master/examples/run-transactions-simple). This will give you a global variable `EthVM` to use. The generated file will be at `./examples/run-transactions-simple/build.js`.

# API

## VM

For documentation on `VM` instantiation, exposed API and emitted `events` see generated [API docs](./docs/README.md).

## StateManger

The API for the `StateManager` is currently in `Beta`, separate documentation can be found [here](./docs/classes/statemanager.md), see also [release notes](https://github.com/ethereumjs/ethereumjs-vm/releases/tag/v2.5.0) from the `v2.5.0` VM release for details on the `StateManager` rewrite.

# Internal Structure

The VM processes state changes at many levels.

- **runBlockchain**
  - for every block, runBlock
- **runBlock**
  - for every tx, runTx
  - pay miner and uncles
- **runTx**
  - check sender balance
  - check sender nonce
  - runCall
  - transfer gas charges
- **runCall**
  - checkpoint state
  - transfer value
  - load code
  - runCode
  - materialize created contracts
  - revert or commit checkpoint
- **runCode**
  - iterate over code
  - run op codes
  - track gas usage
- **OpFns**
  - run individual op code
  - modify stack
  - modify memory
  - calculate fee

The opFns for `CREATE`, `CALL`, and `CALLCODE` call back up to `runCall`.

# DEVELOPMENT

Developer documentation - currently mainly with information on testing and debugging - can be found [here](./developer.md).

# EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).

# LICENSE

[MPL-2.0](https://www.mozilla.org/MPL/2.0/)
