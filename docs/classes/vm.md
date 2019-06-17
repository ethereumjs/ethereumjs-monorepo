[ethereumjs-vm](../README.md) > [VM](../classes/vm.md)

# Class: VM

Execution engine which can be used to run a blockchain, individual blocks, individual transactions, or snippets of EVM bytecode.

## Hierarchy

 `any`

**↳ VM**

## Index

### Constructors

* [constructor](vm.md#constructor)

### Properties

* [_common](vm.md#_common)
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

*Defined in [index.ts:61](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/index.ts#L61)*

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

*Defined in [index.ts:58](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/index.ts#L58)*

___
<a id="allowunlimitedcontractsize"></a>

###  allowUnlimitedContractSize

**● allowUnlimitedContractSize**: *`boolean`*

*Defined in [index.ts:61](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/index.ts#L61)*

___
<a id="blockchain"></a>

###  blockchain

**● blockchain**: *`any`*

*Defined in [index.ts:60](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/index.ts#L60)*

___
<a id="opts"></a>

###  opts

**● opts**: *[VMOpts](../interfaces/vmopts.md)*

*Defined in [index.ts:57](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/index.ts#L57)*

___
<a id="statemanager"></a>

###  stateManager

**● stateManager**: *[StateManager](statemanager.md)*

*Defined in [index.ts:59](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/index.ts#L59)*

___

## Methods

<a id="_emit"></a>

###  _emit

▸ **_emit**(topic: *`string`*, data: *`any`*): `Promise`<`any`>

*Defined in [index.ts:160](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/index.ts#L160)*

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

*Defined in [index.ts:152](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/index.ts#L152)*

Returns a copy of the [VM](vm.md) instance.

**Returns:** [VM](vm.md)

___
<a id="runblock"></a>

###  runBlock

▸ **runBlock**(opts: *[RunBlockOpts](../interfaces/runblockopts.md)*): `Promise`<[RunBlockResult](../interfaces/runblockresult.md)>

*Defined in [index.ts:124](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/index.ts#L124)*

Processes the `block` running all of the transactions it contains and updating the miner's account

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| opts | [RunBlockOpts](../interfaces/runblockopts.md) |  Default values for options:*   \`generate\`: false |

**Returns:** `Promise`<[RunBlockResult](../interfaces/runblockresult.md)>

___
<a id="runblockchain"></a>

###  runBlockchain

▸ **runBlockchain**(blockchain: *`any`*): `Promise`<`void`>

*Defined in [index.ts:115](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/index.ts#L115)*

Processes blocks and adds them to the blockchain.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| blockchain | `any` |  A [blockchain](https://github.com/ethereum/ethereumjs-blockchain) object to process |

**Returns:** `Promise`<`void`>

___
<a id="runcall"></a>

###  runCall

▸ **runCall**(opts: *[RunCallOpts](../interfaces/runcallopts.md)*): `Promise`<[InterpreterResult](../interfaces/interpreterresult.md)>

*Defined in [index.ts:138](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/index.ts#L138)*

runs a call (or create) operation.

**Parameters:**

| Name | Type |
| ------ | ------ |
| opts | [RunCallOpts](../interfaces/runcallopts.md) |

**Returns:** `Promise`<[InterpreterResult](../interfaces/interpreterresult.md)>

___
<a id="runcode"></a>

###  runCode

▸ **runCode**(opts: *[RunCodeOpts](../interfaces/runcodeopts.md)*): `Promise`<[ExecResult](../interfaces/execresult.md)>

*Defined in [index.ts:145](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/index.ts#L145)*

Runs EVM code.

**Parameters:**

| Name | Type |
| ------ | ------ |
| opts | [RunCodeOpts](../interfaces/runcodeopts.md) |

**Returns:** `Promise`<[ExecResult](../interfaces/execresult.md)>

___
<a id="runtx"></a>

###  runTx

▸ **runTx**(opts: *[RunTxOpts](../interfaces/runtxopts.md)*): `Promise`<[RunTxResult](../interfaces/runtxresult.md)>

*Defined in [index.ts:131](https://github.com/ethereumjs/ethereumjs-vm/blob/4fbb5ef/lib/index.ts#L131)*

Process a transaction. Run the vm. Transfers eth. Checks balances.

**Parameters:**

| Name | Type |
| ------ | ------ |
| opts | [RunTxOpts](../interfaces/runtxopts.md) |

**Returns:** `Promise`<[RunTxResult](../interfaces/runtxresult.md)>

___

