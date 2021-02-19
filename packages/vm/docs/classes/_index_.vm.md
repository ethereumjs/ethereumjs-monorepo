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

* [copy](_index_.vm.md#copy)
* [getActiveOpcodes](_index_.vm.md#getactiveopcodes)
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

*Defined in [index.ts:147](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L147)*

Instantiates a new [VM](_index_.vm.md) Object.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`opts` | [VMOpts](../interfaces/_index_.vmopts.md) | {} |   |

**Returns:** *[VM](_index_.vm.md)*

## Properties

###  _common

• **_common**: *Common*

*Defined in [index.ts:117](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L117)*

___

###  blockchain

• **blockchain**: *Blockchain*

*Defined in [index.ts:115](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L115)*

The blockchain the VM operates on

___

###  stateManager

• **stateManager**: *[StateManager](../interfaces/_state_index_.statemanager.md)*

*Defined in [index.ts:111](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L111)*

The StateManager used by the VM

## Methods

###  copy

▸ **copy**(): *[VM](_index_.vm.md)*

*Defined in [index.ts:343](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L343)*

Returns a copy of the [VM](_index_.vm.md) instance.

**Returns:** *[VM](_index_.vm.md)*

___

###  getActiveOpcodes

▸ **getActiveOpcodes**(): *OpcodeList*

*Defined in [index.ts:336](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L336)*

Returns a list with the currently activated opcodes
available for VM execution

**Returns:** *OpcodeList*

___

###  init

▸ **init**(): *Promise‹void›*

*Defined in [index.ts:232](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L232)*

**Returns:** *Promise‹void›*

___

###  runBlock

▸ **runBlock**(`opts`: [RunBlockOpts](../interfaces/_runblock_.runblockopts.md)): *Promise‹[RunBlockResult](../interfaces/_runblock_.runblockresult.md)›*

*Defined in [index.ts:289](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L289)*

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

▸ **runBlockchain**(`blockchain?`: Blockchain, `maxBlocks?`: undefined | number): *Promise‹void | number›*

*Defined in [index.ts:274](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L274)*

Processes blocks and adds them to the blockchain.

This method modifies the state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockchain?` | Blockchain | An [@ethereumjs/blockchain](https://github.com/ethereumjs/ethereumjs-vm/tree/master/packages/blockchain) object to process  |
`maxBlocks?` | undefined &#124; number | - |

**Returns:** *Promise‹void | number›*

___

###  runCall

▸ **runCall**(`opts`: [RunCallOpts](../interfaces/_runcall_.runcallopts.md)): *Promise‹EVMResult›*

*Defined in [index.ts:315](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L315)*

runs a call (or create) operation.

This method modifies the state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`opts` | [RunCallOpts](../interfaces/_runcall_.runcallopts.md) |   |

**Returns:** *Promise‹EVMResult›*

___

###  runCode

▸ **runCode**(`opts`: [RunCodeOpts](../interfaces/_runcode_.runcodeopts.md)): *Promise‹ExecResult›*

*Defined in [index.ts:327](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L327)*

Runs EVM code.

This method modifies the state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`opts` | [RunCodeOpts](../interfaces/_runcode_.runcodeopts.md) |   |

**Returns:** *Promise‹ExecResult›*

___

###  runTx

▸ **runTx**(`opts`: [RunTxOpts](../interfaces/_runtx_.runtxopts.md)): *Promise‹[RunTxResult](../interfaces/_runtx_.runtxresult.md)›*

*Defined in [index.ts:303](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L303)*

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

*Defined in [index.ts:143](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L143)*

VM async constructor. Creates engine instance and initializes it.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`opts` | [VMOpts](../interfaces/_index_.vmopts.md) | {} | VM engine constructor options  |

**Returns:** *Promise‹[VM](_index_.vm.md)›*
