[ethereumjs-vm](../README.md) > [VM](../classes/vm.md)

# Class: VM

Execution engine which can be used to run a blockchain, individual blocks, individual transactions, or snippets of EVM bytecode.

This class is an AsyncEventEmitter, which means that event handlers are run to completion before continuing. If an error is thrown in an event handler, it will bubble up to the VM and thrown from the method call that triggered the event.

## Hierarchy

 `any`

**↳ VM**

## Index

### Constructors

* [constructor](vm.md#constructor)

### Properties

* [_common](vm.md#_common)
* [_opcodes](vm.md#_opcodes)
* [allowUnlimitedContractSize](vm.md#allowunlimitedcontractsize)
* [blockchain](vm.md#blockchain)
* [opts](vm.md#opts)
* [stateManager](vm.md#statemanager)

### Methods

* [_emit](vm.md#_emit)
* [copy](vm.md#copy)
* [runBlock](vm.md#runblock)
* [runBlockchain](vm.md#runblockchain)
* [runCall](vm.md#runcall)
* [runCode](vm.md#runcode)
* [runTx](vm.md#runtx)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new VM**(opts?: *[VMOpts](../interfaces/vmopts.md)*): [VM](vm.md)

*Defined in [index.ts:74](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L74)*

Instantiates a new [VM](vm.md) Object.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` opts | [VMOpts](../interfaces/vmopts.md) |  {} |  Default values for the options are:*   \`chain\`: 'mainnet'*   \`hardfork\`: 'petersburg' \[supported: 'byzantium', 'constantinople', 'petersburg', 'istanbul' (DRAFT) (will throw on unsupported)\]*   \`activatePrecompiles\`: false*   \`allowUnlimitedContractSize\`: false \[ONLY set to \`true\` during debugging\] |

**Returns:** [VM](vm.md)

___

## Properties

<a id="_common"></a>

###  _common

**● _common**: *`Common`*

*Defined in [index.ts:70](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L70)*

___
<a id="_opcodes"></a>

###  _opcodes

**● _opcodes**: *`OpcodeList`*

*Defined in [index.ts:74](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L74)*

___
<a id="allowunlimitedcontractsize"></a>

###  allowUnlimitedContractSize

**● allowUnlimitedContractSize**: *`boolean`*

*Defined in [index.ts:73](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L73)*

___
<a id="blockchain"></a>

###  blockchain

**● blockchain**: *`Blockchain`*

*Defined in [index.ts:72](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L72)*

___
<a id="opts"></a>

###  opts

**● opts**: *[VMOpts](../interfaces/vmopts.md)*

*Defined in [index.ts:69](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L69)*

___
<a id="statemanager"></a>

###  stateManager

**● stateManager**: *[StateManager](statemanager.md)*

*Defined in [index.ts:71](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L71)*

___

## Methods

<a id="_emit"></a>

###  _emit

▸ **_emit**(topic: *`string`*, data: *`any`*): `Promise`<`any`>

*Defined in [index.ts:192](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L192)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| topic | `string` |
| data | `any` |

**Returns:** `Promise`<`any`>

___
<a id="copy"></a>

###  copy

▸ **copy**(): [VM](vm.md)

*Defined in [index.ts:184](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L184)*

Returns a copy of the [VM](vm.md) instance.

**Returns:** [VM](vm.md)

___
<a id="runblock"></a>

###  runBlock

▸ **runBlock**(opts: *[RunBlockOpts](../interfaces/runblockopts.md)*): `Promise`<[RunBlockResult](../interfaces/runblockresult.md)>

*Defined in [index.ts:148](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L148)*

Processes the `block` running all of the transactions it contains and updating the miner's account

This method modifies the state. If `generate` is `true`, the state modifications will be reverted if an exception is raised. If it's `false`, it won't revert if the block's header is invalid. If an error is thrown from an event handler, the state may or may not be reverted.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| opts | [RunBlockOpts](../interfaces/runblockopts.md) |  Default values for options:*   \`generate\`: false |

**Returns:** `Promise`<[RunBlockResult](../interfaces/runblockresult.md)>

___
<a id="runblockchain"></a>

###  runBlockchain

▸ **runBlockchain**(blockchain: *`any`*): `Promise`<`void`>

*Defined in [index.ts:134](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L134)*

Processes blocks and adds them to the blockchain.

This method modifies the state.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| blockchain | `any` |  A [blockchain](https://github.com/ethereum/ethereumjs-blockchain) object to process |

**Returns:** `Promise`<`void`>

___
<a id="runcall"></a>

###  runCall

▸ **runCall**(opts: *[RunCallOpts](../interfaces/runcallopts.md)*): `Promise`<[EVMResult](../interfaces/evmresult.md)>

*Defined in [index.ts:168](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L168)*

runs a call (or create) operation.

This method modifies the state.

**Parameters:**

| Name | Type |
| ------ | ------ |
| opts | [RunCallOpts](../interfaces/runcallopts.md) |

**Returns:** `Promise`<[EVMResult](../interfaces/evmresult.md)>

___
<a id="runcode"></a>

###  runCode

▸ **runCode**(opts: *[RunCodeOpts](../interfaces/runcodeopts.md)*): `Promise`<[ExecResult](../interfaces/execresult.md)>

*Defined in [index.ts:177](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L177)*

Runs EVM code.

This method modifies the state.

**Parameters:**

| Name | Type |
| ------ | ------ |
| opts | [RunCodeOpts](../interfaces/runcodeopts.md) |

**Returns:** `Promise`<[ExecResult](../interfaces/execresult.md)>

___
<a id="runtx"></a>

###  runTx

▸ **runTx**(opts: *[RunTxOpts](../interfaces/runtxopts.md)*): `Promise`<[RunTxResult](../interfaces/runtxresult.md)>

*Defined in [index.ts:159](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L159)*

Process a transaction. Run the vm. Transfers eth. Checks balances.

This method modifies the state. If an error is thrown, the modifications are reverted, except when the error is thrown from an event handler. In the latter case the state may or may not be reverted.

**Parameters:**

| Name | Type |
| ------ | ------ |
| opts | [RunTxOpts](../interfaces/runtxopts.md) |

**Returns:** `Promise`<[RunTxResult](../interfaces/runtxresult.md)>

___

