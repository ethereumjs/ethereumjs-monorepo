SYNOPSIS [![Build Status](https://travis-ci.org/ethereum/ethereumjs-vm.svg?branch=master)](https://travis-ci.org/ethereum/ethereumjs-vm)
===========
Implements Ethereum's VM in JS

# CONTACT
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/ethereumjs-lib?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) or #ethereumjs on freenode

# INSTALL
`npm install ethereumjs-vm`

# USAGE
```javascript
var VM = require('ethereumjs-vm')

//create a new VM instance
var vm = new VM()
var code = '7f4e616d65526567000000000000000000000000000000000000000000000000003055307f4e616d6552656700000000000000000000000000000000000000000000000000557f436f6e666967000000000000000000000000000000000000000000000000000073661005d2720d855f1d9976f88bb10c1a3398c77f5573661005d2720d855f1d9976f88bb10c1a3398c77f7f436f6e6669670000000000000000000000000000000000000000000000000000553360455560df806100c56000396000f3007f726567697374657200000000000000000000000000000000000000000000000060003514156053576020355415603257005b335415603e5760003354555b6020353360006000a233602035556020353355005b60007f756e72656769737465720000000000000000000000000000000000000000000060003514156082575033545b1560995733335460006000a2600033545560003355005b60007f6b696c6c00000000000000000000000000000000000000000000000000000000600035141560cb575060455433145b1560d25733ff5b6000355460005260206000f3'
//code needs tobe a buffer
code = new Buffer(code, 'hex')

vm.runCode({
  code: code,
  gasLimit: new Buffer('ffffffff', 'hex') 
}, function(err, results){
  console.log('returned: ' + results.return.toString('hex'));
})
```
Also more exmaples can be found here  
- [examples](./examples)
- [old blog post](https://wanderer.github.io/ethereum/nodejs/code/2014/08/12/running-contracts-with-vm/)

# BOWSER  
To build for standalone use in the browser install `browserify` and run `npm run build`. This will give you a gobal varible `EthVM` to use. The standalone file will be at `./dist/ethereumjs-vm.js`

# API
  - [`new VM([StateTrie], [blockchain])`](#new-vmstatetrie-blockchain)  
  - [`VM` methods](#vm-methods)  
    - [`vm.runBlockchain([blockchain], [cb])`](#vmrunblockchainblockchain-cb)
    - [`vm.runBlock(opts, cb)`](#vmrunblockopts-cb)
    - [`vm.runTx(opts, cb)`](#vmruntxopts-cb)
    - [`vm.runCode(opts, cb)`](#vmruncodeopts-cb)
    - [`vm.generateCanonicalGenesis(cb)`](#vmgeneratecanonicalgenesiscb)
    - [`vm.generateGenesis(cb)`](#vmgenerategenesiscb)
    - [`vm.createTraceReadStream()`](#vmcreatetracereadstream)
    - [`vm.loadCompiled(address, src, cb)`](#vmloadcompiledaddress-src-cb)
  - [`VM` debugging hooks](#vm-debugging-hooks)
    - [`vm.onStep`](#vmonstep)

### `new VM([StateTrie], [blockchain])`
Creates a new VM object
- `StateTrie` - The [Patricia Merkle Tree](https://github.com/wanderer/merkle-patricia-tree) that contains the state if no trie is given the `VM` will create an in memory trie
- `blockchain` - an instance of the [`Blockchain`](https://github.com/ethereum/ethereumjs-lib/blob/master/docs/blockchain.md) If no blockchain is given a fake blockchain will be used.

### `VM` methods


#### `vm.runBlockchain(blockchain, cb)`
Process a transaction.
- `blockchain` - A [blockchain](https://github.com/ethereum/ethereumjs-blockchain) that to process
- `cb` - The callback. Its is given an err parameter if it fails

--------------------------------------------------------

#### `vm.runBlock(opts, cb)`
Processes the `block` running all of the transaction it contains and updating the miner's account.
- `opts.block` - The [`Block`](./block.md) to process
- `opts.generate` - a `Boolean`; whether to generate the stateRoot. If false  `runBlock` will check the stateRoot of the block against the Trie
- `cb` - The callback

--------------------------------------------------------


#### `vm.runTx(opts, cb)`
Process a transaction.
- `opts.tx` - A [`Transaction`](https://github.com/ethereum/ethereumjs-tx) to run.
- `opts.block` - The block to which the `tx` belongs. If omited a blank block will be used.
- `cb` - The callback. It is given two arguments, an `error` string containing an error that may have happened or `null`, and a `results` object with the following propieties:
  - `amountSpent` - the amount of ether used by this transaction as a `bignum`
  - `vm` - contains the results from running the code, if any, as described in [`vm.runCode(params, cb)`](#vmruncodeopts-cb)

--------------------------------------------------------

#### `vm.runCode(opts, cb)`
Runs EVM code
- `opts.code` - The EVM code to run given as a `Buffer`
- `opts.data` - The input data given as a `Buffer`
- `opts.value` - The value in ether that is being sent to `opt.address`. Defaults to `0`
- `opts.block` - The [`Block`](./block.md) the `tx` belongs to. If omited a blank block will be used.
- `opts.gasLimit` - The gas limit for the code given as an `Buffer`
- `opts.account` - The [`Account`](./account.md) that the executing code belongs to. If omited an empty account will be used
- `opts.address` - The address of the account that is executing this code. The address should be a `Buffer` of bytes. Defaults to `0`
- `opts.origin` - The address where the call originated from. The address should be a `Buffer` of 20bits. Defaults to `0`
- `opts.caller` - The address that ran this code. The address should be a `Buffer` of 20bits. Defaults to `0`
- `cb` - The callback. It is given two arguments, a `error` string containing an error that may have happen or `null` and a `results` object with the following propieties
  - `gasUsed` - the amount of gas as a `bignum` the code used to run. 
  - `gasRefund` - a `Bignum` containting the amount of gas to refund from deleting storage values
  - `suicide` - a `boolean`, whether the contract commited suicide
  - `account` - account of the code that ran
  - `expcetion` - a `boolean`, whethere or not the contract encoutered an exception
  - `exceptionError` - a `String` describing the exception if there was one.
  - `return` - a `Buffer` containing the value that was returned by the contract


--------------------------------------------------------

#### `vm.generateCanonicalGenesis(cb)`
Generates the Canonical genesis state.

--------------------------------------------------------

#### `vm.generateGenesis(genesisData, cb)`
Generate the genesis state.
- `genesisData` - an `Object` whose keys are addresses and values are a `string`s representing initail allocation of ether.
- `cb` - The callback
```javascript
var genesisData = {
  "51ba59315b3a95761d0863b05ccc7a7f54703d99": "1606938044258990275541962092341162602522202993782792835301376",
  "e4157b34ea9615cfbde6b4fda419828124b70c78": "1606938044258990275541962092341162602522202993782792835301376"
}

vm.generateGenesis(genesisData, function(){
  conosle.log('generation done');
})
```
#### `vm.createTraceStream()`
Creates a vm trace stream. The steam is an `Object` stream. The object contains
- `step` - how many steps the current VM has taken
- `pc` - a `Number` repersenting the program counter
- `depth` - the current number of calls deep the contract is
- `opcode` - the next opcode to be ran
- `gas` - a `bignum` standing for the amount of gasLeft
- `memory` - the memory of the VM as a `buffer`
- `storage` - an map of key/values that are in storages 
- `address` - the address of the `account`
- `stack` - an `Array` of `Buffers` containing the stack

NOTE: using this function defines the `onStep` hook. So you can't use both at the same time.
 
--------------------------------------------------------

#### `vm.loadCompiled(address, src, cb)`
Loads a contract defined as a stingified JS function
- `address` - a `Buffer` containing the address of the contract
- `src` - a `String` of a function to be run when the `address` is called

### `VM` debugging hook

#### `vm.onStep` 
When `onStep` is assigned a function the VM will run that function at the begining of each opcode. The `onStep` function is give an `Object` and `done`. `done` must be called before the VM contunies. The `Object` has the following propieties.
- `pc` - a `Number` repersenting the program counter
- `opcode` - the next opcode to be ran
- `gas` - a `bignum` standing for the amount of gasLeft
- `stack` - an `Array` of `Buffers` containing the stack. 
- `storageTrie` - the storage [trie](https://github.com/wanderer/merkle-patricia-tree) for the account
- `account` - the [`Account`](https://github.com/ethereum/ethereumjs-account) which owns the code running.
- `address` - the address of the `account`
- `depth` - the current number of calls deep the contract is
- `memory` - the memory of the VM as a `buffer`

# TESTING
`npm test`  
if you want to just run the VM tests run
`./bin/tester -v`
if you want to just run the State tests run
`./bin/tester -s`

# Internal Structure
The VM processes state changes at many levels.

* runBlockchain
  * for every block, runBlock
* runBlock
  * for every tx, runTx
  * pay miner and uncles
* runTx
  * checkpoint state
  * runCall
  * revert or commit checkpoint
* runCall
  * transfer value
  * load code
  * runCode
  * materialize created contracts
* runCode
  * iterrate over code
  * run op codes
  * track gas usage
* OpFns
  * run individual op code
  * modify stack
  * modify memory
  * calculate fee

The opFns for `CREATE`, `CALL`, and `CALLCODE` call back up to `runCall`.


# LICENSE
[MPL-2.0](https://www.mozilla.org/MPL/2.0/)
