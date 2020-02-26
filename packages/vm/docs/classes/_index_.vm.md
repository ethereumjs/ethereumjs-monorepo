[ethereumjs-vm](../README.md) › ["index"](../modules/_index_.md) › [VM](_index_.vm.md)

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
* [_emit](_index_.vm.md#_emit)
* [_opcodes](_index_.vm.md#_opcodes)
* [allowUnlimitedContractSize](_index_.vm.md#allowunlimitedcontractsize)
* [blockchain](_index_.vm.md#blockchain)
* [opts](_index_.vm.md#opts)
* [pStateManager](_index_.vm.md#pstatemanager)
* [stateManager](_index_.vm.md#statemanager)

### Methods

* [copy](_index_.vm.md#copy)
* [runBlock](_index_.vm.md#runblock)
* [runBlockchain](_index_.vm.md#runblockchain)
* [runCall](_index_.vm.md#runcall)
* [runCode](_index_.vm.md#runcode)
* [runTx](_index_.vm.md#runtx)

## Constructors

###  constructor

\+ **new VM**(`opts`: [VMOpts](../interfaces/_index_.vmopts.md)): *[VM](_index_.vm.md)*

*Defined in [index.ts:75](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L75)*

Instantiates a new [VM](_index_.vm.md) Object.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`opts` | [VMOpts](../interfaces/_index_.vmopts.md) | {} | Default values for the options are:  - `chain`: 'mainnet'  - `hardfork`: 'petersburg' [supported: 'byzantium', 'constantinople', 'petersburg', 'istanbul' (DRAFT) (will throw on unsupported)]  - `activatePrecompiles`: false  - `allowUnlimitedContractSize`: false [ONLY set to `true` during debugging]  |

**Returns:** *[VM](_index_.vm.md)*

## Properties

###  _common

• **_common**: *Common*

*Defined in [index.ts:69](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L69)*

___

###  _emit

• **_emit**: *function*

*Defined in [index.ts:74](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L74)*

#### Type declaration:

▸ (`topic`: string, `data`: any): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`topic` | string |
`data` | any |

___

###  _opcodes

• **_opcodes**: *OpcodeList*

*Defined in [index.ts:73](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L73)*

___

###  allowUnlimitedContractSize

• **allowUnlimitedContractSize**: *boolean*

*Defined in [index.ts:72](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L72)*

___

###  blockchain

• **blockchain**: *Blockchain*

*Defined in [index.ts:71](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L71)*

___

###  opts

• **opts**: *[VMOpts](../interfaces/_index_.vmopts.md)*

*Defined in [index.ts:68](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L68)*

___

###  pStateManager

• **pStateManager**: *PStateManager*

*Defined in [index.ts:75](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L75)*

___

###  stateManager

• **stateManager**: *[StateManager](_state_index_.statemanager.md)*

*Defined in [index.ts:70](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L70)*

## Methods

###  copy

▸ **copy**(): *[VM](_index_.vm.md)*

*Defined in [index.ts:196](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L196)*

Returns a copy of the [VM](_index_.vm.md) instance.

**Returns:** *[VM](_index_.vm.md)*

___

###  runBlock

▸ **runBlock**(`opts`: [RunBlockOpts](../interfaces/_runblock_.runblockopts.md)): *Promise‹[RunBlockResult](../interfaces/_runblock_.runblockresult.md)›*

*Defined in [index.ts:160](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L160)*

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

▸ **runBlockchain**(`blockchain`: any): *Promise‹void›*

*Defined in [index.ts:146](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L146)*

Processes blocks and adds them to the blockchain.

This method modifies the state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockchain` | any | A [blockchain](https://github.com/ethereum/ethereumjs-blockchain) object to process  |

**Returns:** *Promise‹void›*

___

###  runCall

▸ **runCall**(`opts`: [RunCallOpts](../interfaces/_runcall_.runcallopts.md)): *Promise‹[EVMResult](../interfaces/_evm_evm_.evmresult.md)›*

*Defined in [index.ts:180](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L180)*

runs a call (or create) operation.

This method modifies the state.

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [RunCallOpts](../interfaces/_runcall_.runcallopts.md) |

**Returns:** *Promise‹[EVMResult](../interfaces/_evm_evm_.evmresult.md)›*

___

###  runCode

▸ **runCode**(`opts`: [RunCodeOpts](../interfaces/_runcode_.runcodeopts.md)): *Promise‹[ExecResult](../interfaces/_evm_evm_.execresult.md)›*

*Defined in [index.ts:189](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L189)*

Runs EVM code.

This method modifies the state.

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [RunCodeOpts](../interfaces/_runcode_.runcodeopts.md) |

**Returns:** *Promise‹[ExecResult](../interfaces/_evm_evm_.execresult.md)›*

___

###  runTx

▸ **runTx**(`opts`: [RunTxOpts](../interfaces/_runtx_.runtxopts.md)): *Promise‹[RunTxResult](../interfaces/_runtx_.runtxresult.md)›*

*Defined in [index.ts:171](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L171)*

Process a transaction. Run the vm. Transfers eth. Checks balances.

This method modifies the state. If an error is thrown, the modifications are reverted, except
when the error is thrown from an event handler. In the latter case the state may or may not be
reverted.

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [RunTxOpts](../interfaces/_runtx_.runtxopts.md) |

**Returns:** *Promise‹[RunTxResult](../interfaces/_runtx_.runtxresult.md)›*
