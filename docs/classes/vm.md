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

*Defined in [index.ts:59](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/index.ts#L59)*

Instantiates a new [VM](vm.md) Object.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` opts | [VMOpts](../interfaces/vmopts.md) |  {} |  Default values for the options are:*   \`chain\`: 'mainnet'*   \`hardfork\`: 'petersburg' \[supported: 'byzantium', 'constantinople', 'petersburg' (will throw on unsupported)\]*   \`activatePrecompiles\`: false*   \`allowUnlimitedContractSize\`: false \[ONLY set to \`true\` during debugging\] |

**Returns:** [VM](vm.md)

___

## Properties

<a id="_common"></a>

###  _common

**● _common**: *`Common`*

*Defined in [index.ts:56](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/index.ts#L56)*

___
<a id="allowunlimitedcontractsize"></a>

###  allowUnlimitedContractSize

**● allowUnlimitedContractSize**: *`boolean`*

*Defined in [index.ts:59](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/index.ts#L59)*

___
<a id="blockchain"></a>

###  blockchain

**● blockchain**: *`any`*

*Defined in [index.ts:58](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/index.ts#L58)*

___
<a id="opts"></a>

###  opts

**● opts**: *[VMOpts](../interfaces/vmopts.md)*

*Defined in [index.ts:55](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/index.ts#L55)*

___
<a id="statemanager"></a>

###  stateManager

**● stateManager**: *[StateManager](statemanager.md)*

*Defined in [index.ts:57](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/index.ts#L57)*

___

## Methods

<a id="_emit"></a>

###  _emit

▸ **_emit**(topic: *`string`*, data: *`any`*): `Promise`<`any`>

*Defined in [index.ts:147](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/index.ts#L147)*

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

*Defined in [index.ts:140](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/index.ts#L140)*

Returns a copy of the [VM](vm.md) instance.

**Returns:** [VM](vm.md)

___
<a id="runblock"></a>

###  runBlock

▸ **runBlock**(opts: *[RunBlockOpts](../interfaces/runblockopts.md)*, cb: *[RunBlockCb](../interfaces/runblockcb.md)*): `void`

*Defined in [index.ts:112](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/index.ts#L112)*

Processes the `block` running all of the transactions it contains and updating the miner's account

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| opts | [RunBlockOpts](../interfaces/runblockopts.md) |  Default values for options:*   \`generate\`: false @param cb - Callback function |
| cb | [RunBlockCb](../interfaces/runblockcb.md) |

**Returns:** `void`

___
<a id="runblockchain"></a>

###  runBlockchain

▸ **runBlockchain**(blockchain: *`any`*, cb: *`any`*): `void`

*Defined in [index.ts:102](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/index.ts#L102)*

Processes blocks and adds them to the blockchain.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| blockchain | `any` |  A [blockchain](https://github.com/ethereum/ethereumjs-blockchain) object to process |
| cb | `any` |  the callback function |

**Returns:** `void`

___
<a id="runcall"></a>

###  runCall

▸ **runCall**(opts: *[RunCallOpts](../interfaces/runcallopts.md)*, cb: *[RunCallCb](../interfaces/runcallcb.md)*): `void`

*Defined in [index.ts:126](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/index.ts#L126)*

runs a call (or create) operation.

**Parameters:**

| Name | Type |
| ------ | ------ |
| opts | [RunCallOpts](../interfaces/runcallopts.md) |
| cb | [RunCallCb](../interfaces/runcallcb.md) |

**Returns:** `void`

___
<a id="runcode"></a>

###  runCode

▸ **runCode**(opts: *[RunCodeOpts](../interfaces/runcodeopts.md)*, cb: *[RunCodeCb](../interfaces/runcodecb.md)*): `void`

*Defined in [index.ts:133](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/index.ts#L133)*

Runs EVM code.

**Parameters:**

| Name | Type |
| ------ | ------ |
| opts | [RunCodeOpts](../interfaces/runcodeopts.md) |
| cb | [RunCodeCb](../interfaces/runcodecb.md) |

**Returns:** `void`

___
<a id="runtx"></a>

###  runTx

▸ **runTx**(opts: *[RunTxOpts](../interfaces/runtxopts.md)*, cb: *[RunTxCb](../interfaces/runtxcb.md)*): `void`

*Defined in [index.ts:119](https://github.com/ethereumjs/ethereumjs-vm/blob/06d36f3/lib/index.ts#L119)*

Process a transaction. Run the vm. Transfers eth. Checks balances.

**Parameters:**

| Name | Type |
| ------ | ------ |
| opts | [RunTxOpts](../interfaces/runtxopts.md) |
| cb | [RunTxCb](../interfaces/runtxcb.md) |

**Returns:** `void`

___

