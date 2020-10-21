[@ethereumjs/vm](../README.md) › ["lib/index"](../modules/_lib_index_.md) › [VM](_lib_index_.vm.md)

# Class: VM

Execution engine which can be used to run a blockchain, individual
blocks, individual transactions, or snippets of EVM bytecode.

This class is an AsyncEventEmitter, please consult the README to learn how to use it.

## Hierarchy

* any

  ↳ **VM**

## Index

### Constructors

* [constructor](_lib_index_.vm.md#constructor)

### Properties

* [_common](_lib_index_.vm.md#_common)
* [_emit](_lib_index_.vm.md#_emit)
* [_mcl](_lib_index_.vm.md#_mcl)
* [_opcodes](_lib_index_.vm.md#_opcodes)
* [allowUnlimitedContractSize](_lib_index_.vm.md#allowunlimitedcontractsize)
* [blockchain](_lib_index_.vm.md#blockchain)
* [opts](_lib_index_.vm.md#opts)
* [stateManager](_lib_index_.vm.md#statemanager)

### Methods

* [_updateOpcodes](_lib_index_.vm.md#_updateopcodes)
* [copy](_lib_index_.vm.md#copy)
* [init](_lib_index_.vm.md#init)
* [runBlock](_lib_index_.vm.md#runblock)
* [runBlockchain](_lib_index_.vm.md#runblockchain)
* [runCall](_lib_index_.vm.md#runcall)
* [runCode](_lib_index_.vm.md#runcode)
* [runTx](_lib_index_.vm.md#runtx)
* [create](_lib_index_.vm.md#static-create)

## Constructors

###  constructor

\+ **new VM**(`opts`: [VMOpts](../interfaces/_lib_index_.vmopts.md)): *[VM](_lib_index_.vm.md)*

*Defined in [lib/index.ts:119](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L119)*

Instantiates a new [VM](_lib_index_.vm.md) Object.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`opts` | [VMOpts](../interfaces/_lib_index_.vmopts.md) | {} |   |

**Returns:** *[VM](_lib_index_.vm.md)*

## Properties

###  _common

• **_common**: *Common*

*Defined in [lib/index.ts:101](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L101)*

___

###  _emit

• **_emit**: *function*

*Defined in [lib/index.ts:106](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L106)*

#### Type declaration:

▸ (`topic`: string, `data`: any): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`topic` | string |
`data` | any |

___

###  _mcl

• **_mcl**: *any*

*Defined in [lib/index.ts:108](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L108)*

___

###  _opcodes

• **_opcodes**: *[OpcodeList](../modules/_lib_evm_opcodes_codes_.md#opcodelist)*

*Defined in [lib/index.ts:105](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L105)*

___

###  allowUnlimitedContractSize

• **allowUnlimitedContractSize**: *boolean*

*Defined in [lib/index.ts:104](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L104)*

___

###  blockchain

• **blockchain**: *Blockchain*

*Defined in [lib/index.ts:103](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L103)*

___

###  opts

• **opts**: *[VMOpts](../interfaces/_lib_index_.vmopts.md)*

*Defined in [lib/index.ts:100](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L100)*

___

###  stateManager

• **stateManager**: *[StateManager](../interfaces/_lib_state_index_.statemanager.md)*

*Defined in [lib/index.ts:102](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L102)*

## Methods

###  _updateOpcodes

▸ **_updateOpcodes**(): *void*

*Defined in [lib/index.ts:200](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L200)*

**Returns:** *void*

___

###  copy

▸ **copy**(): *[VM](_lib_index_.vm.md)*

*Defined in [lib/index.ts:307](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L307)*

Returns a copy of the [VM](_lib_index_.vm.md) instance.

**Returns:** *[VM](_lib_index_.vm.md)*

___

###  init

▸ **init**(): *Promise‹void›*

*Defined in [lib/index.ts:204](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L204)*

**Returns:** *Promise‹void›*

___

###  runBlock

▸ **runBlock**(`opts`: [RunBlockOpts](../interfaces/_lib_runblock_.runblockopts.md)): *Promise‹[RunBlockResult](../interfaces/_lib_runblock_.runblockresult.md)›*

*Defined in [lib/index.ts:261](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L261)*

Processes the `block` running all of the transactions it contains and updating the miner's account

This method modifies the state. If `generate` is `true`, the state modifications will be
reverted if an exception is raised. If it's `false`, it won't revert if the block's header is
invalid. If an error is thrown from an event handler, the state may or may not be reverted.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`opts` | [RunBlockOpts](../interfaces/_lib_runblock_.runblockopts.md) | Default values for options:  - `generate`: false  |

**Returns:** *Promise‹[RunBlockResult](../interfaces/_lib_runblock_.runblockresult.md)›*

___

###  runBlockchain

▸ **runBlockchain**(`blockchain?`: Blockchain): *Promise‹void›*

*Defined in [lib/index.ts:246](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L246)*

Processes blocks and adds them to the blockchain.

This method modifies the state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockchain?` | Blockchain | An [@ethereumjs/blockchain](https://github.com/ethereumjs/ethereumjs-vm/tree/master/packages/blockchain) object to process  |

**Returns:** *Promise‹void›*

___

###  runCall

▸ **runCall**(`opts`: [RunCallOpts](../interfaces/_lib_runcall_.runcallopts.md)): *Promise‹[EVMResult](../interfaces/_lib_evm_evm_.evmresult.md)›*

*Defined in [lib/index.ts:287](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L287)*

runs a call (or create) operation.

This method modifies the state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`opts` | [RunCallOpts](../interfaces/_lib_runcall_.runcallopts.md) |   |

**Returns:** *Promise‹[EVMResult](../interfaces/_lib_evm_evm_.evmresult.md)›*

___

###  runCode

▸ **runCode**(`opts`: [RunCodeOpts](../interfaces/_lib_runcode_.runcodeopts.md)): *Promise‹[ExecResult](../interfaces/_lib_evm_evm_.execresult.md)›*

*Defined in [lib/index.ts:299](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L299)*

Runs EVM code.

This method modifies the state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`opts` | [RunCodeOpts](../interfaces/_lib_runcode_.runcodeopts.md) |   |

**Returns:** *Promise‹[ExecResult](../interfaces/_lib_evm_evm_.execresult.md)›*

___

###  runTx

▸ **runTx**(`opts`: [RunTxOpts](../interfaces/_lib_runtx_.runtxopts.md)): *Promise‹[RunTxResult](../interfaces/_lib_runtx_.runtxresult.md)›*

*Defined in [lib/index.ts:275](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L275)*

Process a transaction. Run the vm. Transfers eth. Checks balances.

This method modifies the state. If an error is thrown, the modifications are reverted, except
when the error is thrown from an event handler. In the latter case the state may or may not be
reverted.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`opts` | [RunTxOpts](../interfaces/_lib_runtx_.runtxopts.md) |   |

**Returns:** *Promise‹[RunTxResult](../interfaces/_lib_runtx_.runtxresult.md)›*

___

### `Static` create

▸ **create**(`opts`: [VMOpts](../interfaces/_lib_index_.vmopts.md)): *Promise‹[VM](_lib_index_.vm.md)›*

*Defined in [lib/index.ts:115](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L115)*

VM async constructor. Creates engine instance and initializes it.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`opts` | [VMOpts](../interfaces/_lib_index_.vmopts.md) | {} | VM engine constructor options  |

**Returns:** *Promise‹[VM](_lib_index_.vm.md)›*
