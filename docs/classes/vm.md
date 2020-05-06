[ethereumjs-vm](../README.md) > [VM](../classes/vm.md)

# Class: VM

## Hierarchy

 `any`

**↳ VM**

## Index

### Constructors

* [constructor](vm.md#constructor)

### Properties

* [_common](vm.md#_common)
* [_emit](vm.md#_emit)
* [_opcodes](vm.md#_opcodes)
* [allowUnlimitedContractSize](vm.md#allowunlimitedcontractsize)
* [blockchain](vm.md#blockchain)
* [opts](vm.md#opts)
* [pStateManager](vm.md#pstatemanager)
* [stateManager](vm.md#statemanager)

### Methods

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

*Defined in [index.ts:75](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/index.ts#L75)*

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

*Defined in [index.ts:69](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/index.ts#L69)*

___
<a id="_emit"></a>

###  _emit

**● _emit**: *`function`*

*Defined in [index.ts:74](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/index.ts#L74)*

#### Type declaration
▸(topic: *`string`*, data: *`any`*): `Promise`<`void`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| topic | `string` |
| data | `any` |

**Returns:** `Promise`<`void`>

___
<a id="_opcodes"></a>

###  _opcodes

**● _opcodes**: *`OpcodeList`*

*Defined in [index.ts:73](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/index.ts#L73)*

___
<a id="allowunlimitedcontractsize"></a>

###  allowUnlimitedContractSize

**● allowUnlimitedContractSize**: *`boolean`*

*Defined in [index.ts:72](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/index.ts#L72)*

___
<a id="blockchain"></a>

###  blockchain

**● blockchain**: *`Blockchain`*

*Defined in [index.ts:71](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/index.ts#L71)*

___
<a id="opts"></a>

###  opts

**● opts**: *[VMOpts](../interfaces/vmopts.md)*

*Defined in [index.ts:68](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/index.ts#L68)*

___
<a id="pstatemanager"></a>

###  pStateManager

**● pStateManager**: *`PStateManager`*

*Defined in [index.ts:75](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/index.ts#L75)*

___
<a id="statemanager"></a>

###  stateManager

**● stateManager**: *[StateManager](statemanager.md)*

*Defined in [index.ts:70](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/index.ts#L70)*

___

## Methods

<a id="copy"></a>

###  copy

▸ **copy**(): [VM](vm.md)

*Defined in [index.ts:196](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/index.ts#L196)*

**Returns:** [VM](vm.md)

___
<a id="runblock"></a>

###  runBlock

▸ **runBlock**(opts: *[RunBlockOpts](../interfaces/runblockopts.md)*): `Promise`<[RunBlockResult](../interfaces/runblockresult.md)>

*Defined in [index.ts:160](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/index.ts#L160)*

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| opts | [RunBlockOpts](../interfaces/runblockopts.md) |  Default values for options:*   \`generate\`: false |

**Returns:** `Promise`<[RunBlockResult](../interfaces/runblockresult.md)>

___
<a id="runblockchain"></a>

###  runBlockchain

▸ **runBlockchain**(blockchain: *`any`*): `Promise`<`void`>

*Defined in [index.ts:146](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/index.ts#L146)*

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| blockchain | `any` |  A [blockchain](https://github.com/ethereum/ethereumjs-blockchain) object to process |

**Returns:** `Promise`<`void`>

___
<a id="runcall"></a>

###  runCall

▸ **runCall**(opts: *[RunCallOpts](../interfaces/runcallopts.md)*): `Promise`<[EVMResult](../interfaces/evmresult.md)>

*Defined in [index.ts:180](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/index.ts#L180)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| opts | [RunCallOpts](../interfaces/runcallopts.md) |

**Returns:** `Promise`<[EVMResult](../interfaces/evmresult.md)>

___
<a id="runcode"></a>

###  runCode

▸ **runCode**(opts: *[RunCodeOpts](../interfaces/runcodeopts.md)*): `Promise`<[ExecResult](../interfaces/execresult.md)>

*Defined in [index.ts:189](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/index.ts#L189)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| opts | [RunCodeOpts](../interfaces/runcodeopts.md) |

**Returns:** `Promise`<[ExecResult](../interfaces/execresult.md)>

___
<a id="runtx"></a>

###  runTx

▸ **runTx**(opts: *[RunTxOpts](../interfaces/runtxopts.md)*): `Promise`<[RunTxResult](../interfaces/runtxresult.md)>

*Defined in [index.ts:171](https://github.com/ethereumjs/ethereumjs-vm/blob/c389bbb/lib/index.ts#L171)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| opts | [RunTxOpts](../interfaces/runtxopts.md) |

**Returns:** `Promise`<[RunTxResult](../interfaces/runtxresult.md)>

___

