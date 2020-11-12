[@ethereumjs/vm](../README.md) › ["index"](../modules/_index_.md) › [VM](_index_.vm.md)

# Class: VM

Execution engine which can be used to run a blockchain, individual
blocks, individual transactions, or snippets of EVM bytecode.

This class is an AsyncEventEmitter, please consult the README to learn how to use it.

## Hierarchy

* any

  ↳ **VM**

## Index

### Constructors

* [constructor](_index_.vm.md#constructor)

### Properties

* [_common](_index_.vm.md#_common)
* [blockchain](_index_.vm.md#blockchain)
* [stateManager](_index_.vm.md#statemanager)

### Methods

* [_updateOpcodes](_index_.vm.md#_updateopcodes)
* [copy](_index_.vm.md#copy)
* [init](_index_.vm.md#init)
* [runBlock](_index_.vm.md#runblock)
* [runBlockchain](_index_.vm.md#runblockchain)
* [runCall](_index_.vm.md#runcall)
* [runCode](_index_.vm.md#runcode)
* [runTx](_index_.vm.md#runtx)
* [create](_index_.vm.md#static-create)

## Constructors

###  constructor

\+ **new VM**(`opts`: [VMOpts](../interfaces/_index_.vmopts.md)): *[VM](_index_.vm.md)*

*Defined in [index.ts:139](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L139)*

Instantiates a new [VM](_index_.vm.md) Object.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`opts` | [VMOpts](../interfaces/_index_.vmopts.md) | {} |   |

**Returns:** *[VM](_index_.vm.md)*

## Properties

###  _common

• **_common**: *Common*

*Defined in [index.ts:110](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L110)*

___

###  blockchain

• **blockchain**: *Blockchain*

*Defined in [index.ts:108](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L108)*

The blockchain the VM operates on

___

###  stateManager

• **stateManager**: *[StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [index.ts:104](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L104)*

The StateManager used by the VM

## Methods

###  _updateOpcodes

▸ **_updateOpcodes**(): *void*

*Defined in [index.ts:219](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L219)*

**Returns:** *void*

___

###  copy

▸ **copy**(): *[VM](_index_.vm.md)*

*Defined in [index.ts:326](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L326)*

Returns a copy of the [VM](_index_.vm.md) instance.

**Returns:** *[VM](_index_.vm.md)*

___

###  init

▸ **init**(): *Promise‹void›*

*Defined in [index.ts:223](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L223)*

**Returns:** *Promise‹void›*

___

###  runBlock

▸ **runBlock**(`opts`: [RunBlockOpts](../interfaces/_runblock_.runblockopts.md)): *Promise‹[RunBlockResult](../interfaces/_runblock_.runblockresult.md)›*

*Defined in [index.ts:280](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L280)*

Processes the `block` running all of the transactions it contains and updating the miner's account

This method modifies the state. If `generate` is `true`, the state modifications will be
reverted if an exception is raised. If it's `false`, it won't revert if the block's header is
invalid. If an error is thrown from an event handler, the state may or may not be reverted.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`opts` | [RunBlockOpts](../interfaces/_runblock_.runblockopts.md) | Default values for options:  - `generate`: false  |

**Returns:** *Promise‹[RunBlockResult](../interfaces/_runblock_.runblockresult.md)›*

___

###  runBlockchain

▸ **runBlockchain**(`blockchain?`: Blockchain): *Promise‹void›*

*Defined in [index.ts:265](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L265)*

Processes blocks and adds them to the blockchain.

This method modifies the state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockchain?` | Blockchain | An [@ethereumjs/blockchain](https://github.com/ethereumjs/ethereumjs-vm/tree/master/packages/blockchain) object to process  |

**Returns:** *Promise‹void›*

___

###  runCall

▸ **runCall**(`opts`: [RunCallOpts](../interfaces/_runcall_.runcallopts.md)): *Promise‹[EVMResult](../interfaces/_evm_evm_.evmresult.md)›*

*Defined in [index.ts:306](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L306)*

runs a call (or create) operation.

This method modifies the state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`opts` | [RunCallOpts](../interfaces/_runcall_.runcallopts.md) |   |

**Returns:** *Promise‹[EVMResult](../interfaces/_evm_evm_.evmresult.md)›*

___

###  runCode

▸ **runCode**(`opts`: [RunCodeOpts](../interfaces/_runcode_.runcodeopts.md)): *Promise‹[ExecResult](../interfaces/_evm_evm_.execresult.md)›*

*Defined in [index.ts:318](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L318)*

Runs EVM code.

This method modifies the state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`opts` | [RunCodeOpts](../interfaces/_runcode_.runcodeopts.md) |   |

**Returns:** *Promise‹[ExecResult](../interfaces/_evm_evm_.execresult.md)›*

___

###  runTx

▸ **runTx**(`opts`: [RunTxOpts](../interfaces/_runtx_.runtxopts.md)): *Promise‹[RunTxResult](../interfaces/_runtx_.runtxresult.md)›*

*Defined in [index.ts:294](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L294)*

Process a transaction. Run the vm. Transfers eth. Checks balances.

This method modifies the state. If an error is thrown, the modifications are reverted, except
when the error is thrown from an event handler. In the latter case the state may or may not be
reverted.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`opts` | [RunTxOpts](../interfaces/_runtx_.runtxopts.md) |   |

**Returns:** *Promise‹[RunTxResult](../interfaces/_runtx_.runtxresult.md)›*

___

### `Static` create

▸ **create**(`opts`: [VMOpts](../interfaces/_index_.vmopts.md)): *Promise‹[VM](_index_.vm.md)›*

*Defined in [index.ts:135](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L135)*

VM async constructor. Creates engine instance and initializes it.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`opts` | [VMOpts](../interfaces/_index_.vmopts.md) | {} | VM engine constructor options  |

**Returns:** *Promise‹[VM](_index_.vm.md)›*
