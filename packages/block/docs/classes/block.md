[ethereumjs-block](../README.md) > [Block](../classes/block.md)

# Class: Block

An object that represents the block

## Hierarchy

**Block**

## Index

### Constructors

- [constructor](block.md#constructor)

### Properties

- [\_common](block.md#_common)
- [header](block.md#header)
- [transactions](block.md#transactions)
- [txTrie](block.md#txtrie)
- [uncleHeaders](block.md#uncleheaders)

### Accessors

- [raw](block.md#raw)

### Methods

- [\_putTxInTrie](block.md#_puttxintrie)
- [\_validateUncleHeader](block.md#_validateuncleheader)
- [genTxTrie](block.md#gentxtrie)
- [hash](block.md#hash)
- [isGenesis](block.md#isgenesis)
- [serialize](block.md#serialize)
- [setGenesisParams](block.md#setgenesisparams)
- [toJSON](block.md#tojson)
- [validate](block.md#validate)
- [validateTransactions](block.md#validatetransactions)
- [validateTransactionsTrie](block.md#validatetransactionstrie)
- [validateUncles](block.md#validateuncles)
- [validateUnclesHash](block.md#validateuncleshash)

---

## Constructors

<a id="constructor"></a>

### constructor

⊕ **new Block**(data?: _`Buffer` \| [`Buffer`[], `Buffer`[], `Buffer`[]] \| [BlockData](../interfaces/blockdata.md)_, opts?: _[ChainOptions](../interfaces/chainoptions.md)_): [Block](block.md)

_Defined in [block.ts:20](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L20)_

Creates a new block object

**Parameters:**

| Name                 | Type                                                                                        | Default value | Description                                                                |
| -------------------- | ------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------- |
| `Default value` data | `Buffer` \| [`Buffer`[], `Buffer`[], `Buffer`[]] \| [BlockData](../interfaces/blockdata.md) | {}            | The block's data.                                                          |
| `Default value` opts | [ChainOptions](../interfaces/chainoptions.md)                                               | {}            | The network options for this block, and its header, uncle headers and txs. |

**Returns:** [Block](block.md)

---

## Properties

<a id="_common"></a>

### `<Private>` \_common

**● \_common**: _`Common`_

_Defined in [block.ts:20](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L20)_

---

<a id="header"></a>

### header

**● header**: _[BlockHeader](blockheader.md)_

_Defined in [block.ts:15](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L15)_

---

<a id="transactions"></a>

### transactions

**● transactions**: _`Transaction`[]_ = []

_Defined in [block.ts:16](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L16)_

---

<a id="txtrie"></a>

### txTrie

**● txTrie**: _`any`_ = new Trie()

_Defined in [block.ts:18](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L18)_

---

<a id="uncleheaders"></a>

### uncleHeaders

**● uncleHeaders**: _[BlockHeader](blockheader.md)[]_ = []

_Defined in [block.ts:17](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L17)_

---

## Accessors

<a id="raw"></a>

### raw

**get raw**(): [`Buffer`[], `Buffer`[], `Buffer`[]]

_Defined in [block.ts:82](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L82)_

**Returns:** [`Buffer`[], `Buffer`[], `Buffer`[]]

---

## Methods

<a id="_puttxintrie"></a>

### `<Private>` \_putTxInTrie

▸ **\_putTxInTrie**(txIndex: _`number`_, tx: _`Transaction`_): `Promise`<`void`>

_Defined in [block.ts:250](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L250)_

**Parameters:**

| Name    | Type          |
| ------- | ------------- |
| txIndex | `number`      |
| tx      | `Transaction` |

**Returns:** `Promise`<`void`>

---

<a id="_validateuncleheader"></a>

### `<Private>` \_validateUncleHeader

▸ **\_validateUncleHeader**(uncleHeader: _[BlockHeader](blockheader.md)_, blockchain: _[Blockchain](../interfaces/blockchain.md)_): `Promise`<`void`>

_Defined in [block.ts:262](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L262)_

**Parameters:**

| Name        | Type                                      |
| ----------- | ----------------------------------------- |
| uncleHeader | [BlockHeader](blockheader.md)             |
| blockchain  | [Blockchain](../interfaces/blockchain.md) |

**Returns:** `Promise`<`void`>

---

<a id="gentxtrie"></a>

### genTxTrie

▸ **genTxTrie**(): `Promise`<`void`>

_Defined in [block.ts:131](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L131)_

Generate transaction trie. The tx trie must be generated before the transaction trie can be validated with `validateTransactionTrie`

**Returns:** `Promise`<`void`>

---

<a id="hash"></a>

### hash

▸ **hash**(): `Buffer`

_Defined in [block.ts:89](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L89)_

Produces a hash the RLP of the block

**Returns:** `Buffer`

---

<a id="isgenesis"></a>

### isGenesis

▸ **isGenesis**(): `boolean`

_Defined in [block.ts:96](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L96)_

Determines if this block is the genesis block

**Returns:** `boolean`

---

<a id="serialize"></a>

### serialize

▸ **serialize**(): `Buffer`

▸ **serialize**(rlpEncode: _`true`_): `Buffer`

▸ **serialize**(rlpEncode: _`false`_): [`Buffer`[], `Buffer`[], `Buffer`[]]

_Defined in [block.ts:114](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L114)_

Produces a serialization of the block.

**Returns:** `Buffer`

_Defined in [block.ts:115](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L115)_

**Parameters:**

| Name      | Type   |
| --------- | ------ |
| rlpEncode | `true` |

**Returns:** `Buffer`

_Defined in [block.ts:116](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L116)_

**Parameters:**

| Name      | Type    |
| --------- | ------- |
| rlpEncode | `false` |

**Returns:** [`Buffer`[], `Buffer`[], `Buffer`[]]

---

<a id="setgenesisparams"></a>

### setGenesisParams

▸ **setGenesisParams**(): `void`

_Defined in [block.ts:103](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L103)_

Turns the block into the canonical genesis block

**Returns:** `void`

---

<a id="tojson"></a>

### toJSON

▸ **toJSON**(labeled?: _`boolean`_): `undefined` \| `string` \| `any`[] \| `object`

_Defined in [block.ts:238](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L238)_

Returns the block in JSON format

_**see**_: [ethereumjs-util](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties)

**Parameters:**

| Name                    | Type      | Default value |
| ----------------------- | --------- | ------------- |
| `Default value` labeled | `boolean` | false         |

**Returns:** `undefined` \| `string` \| `any`[] \| `object`

---

<a id="validate"></a>

### validate

▸ **validate**(blockChain: _[Blockchain](../interfaces/blockchain.md)_): `Promise`<`void`>

_Defined in [block.ts:180](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L180)_

Validates the entire block, throwing if invalid.

**Parameters:**

| Name       | Type                                      | Description                                        |
| ---------- | ----------------------------------------- | -------------------------------------------------- |
| blockChain | [Blockchain](../interfaces/blockchain.md) | the blockchain that this block wants to be part of |

**Returns:** `Promise`<`void`>

---

<a id="validatetransactions"></a>

### validateTransactions

▸ **validateTransactions**(): `boolean`

▸ **validateTransactions**(stringError: _`false`_): `boolean`

▸ **validateTransactions**(stringError: _`true`_): `string`

_Defined in [block.ts:155](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L155)_

Validates the transactions

**Returns:** `boolean`

_Defined in [block.ts:156](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L156)_

**Parameters:**

| Name        | Type    |
| ----------- | ------- |
| stringError | `false` |

**Returns:** `boolean`

_Defined in [block.ts:157](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L157)_

**Parameters:**

| Name        | Type   |
| ----------- | ------ |
| stringError | `true` |

**Returns:** `string`

---

<a id="validatetransactionstrie"></a>

### validateTransactionsTrie

▸ **validateTransactionsTrie**(): `boolean`

_Defined in [block.ts:141](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L141)_

Validates the transaction trie

**Returns:** `boolean`

---

<a id="validateuncles"></a>

### validateUncles

▸ **validateUncles**(blockchain: _[Blockchain](../interfaces/blockchain.md)_): `Promise`<`void`>

_Defined in [block.ts:215](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L215)_

Validates the uncles that are in the block, if any. This method throws if they are invalid.

**Parameters:**

| Name       | Type                                      |
| ---------- | ----------------------------------------- |
| blockchain | [Blockchain](../interfaces/blockchain.md) |

**Returns:** `Promise`<`void`>

---

<a id="validateuncleshash"></a>

### validateUnclesHash

▸ **validateUnclesHash**(): `boolean`

_Defined in [block.ts:204](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/block.ts#L204)_

Validates the uncle's hash

**Returns:** `boolean`

---
