[ethereumjs-block](../README.md) › ["index"](../modules/_index_.md) › [Block](_index_.block.md)

# Class: Block

An object that represents the block

## Hierarchy

- **Block**

## Index

### Constructors

- [constructor](_index_.block.md#constructor)

### Properties

- [header](_index_.block.md#header)
- [transactions](_index_.block.md#transactions)
- [txTrie](_index_.block.md#txtrie)
- [uncleHeaders](_index_.block.md#uncleheaders)

### Accessors

- [raw](_index_.block.md#raw)

### Methods

- [genTxTrie](_index_.block.md#gentxtrie)
- [hash](_index_.block.md#hash)
- [isGenesis](_index_.block.md#isgenesis)
- [serialize](_index_.block.md#serialize)
- [setGenesisParams](_index_.block.md#setgenesisparams)
- [toJSON](_index_.block.md#tojson)
- [validate](_index_.block.md#validate)
- [validateTransactions](_index_.block.md#validatetransactions)
- [validateTransactionsTrie](_index_.block.md#validatetransactionstrie)
- [validateUncles](_index_.block.md#validateuncles)
- [validateUnclesHash](_index_.block.md#validateuncleshash)

## Constructors

### constructor

\+ **new Block**(`data`: Buffer | [Buffer[], Buffer[], Buffer[]] | [BlockData](../interfaces/_index_.blockdata.md), `opts`: [ChainOptions](../interfaces/_index_.chainoptions.md)): _[Block](\_index_.block.md)\_

_Defined in [block.ts:20](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L20)_

Creates a new block object

**Parameters:**

| Name   | Type                                                                                                | Default | Description                                                                |
| ------ | --------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------- |
| `data` | Buffer &#124; [Buffer[], Buffer[], Buffer[]] &#124; [BlockData](../interfaces/_index_.blockdata.md) | {}      | The block's data.                                                          |
| `opts` | [ChainOptions](../interfaces/_index_.chainoptions.md)                                               | {}      | The network options for this block, and its header, uncle headers and txs. |

**Returns:** _[Block](\_index_.block.md)\_

## Properties

### header

• **header**: _[BlockHeader](\_header_.blockheader.md)\_

_Defined in [block.ts:15](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L15)_

---

### transactions

• **transactions**: _Transaction[]_ = []

_Defined in [block.ts:16](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L16)_

---

### txTrie

• **txTrie**: _any_ = new Trie()

_Defined in [block.ts:18](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L18)_

---

### uncleHeaders

• **uncleHeaders**: _[BlockHeader](\_header_.blockheader.md)[]\_ = []

_Defined in [block.ts:17](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L17)_

## Accessors

### raw

• **get raw**(): _[Buffer[], Buffer[], Buffer[]]_

_Defined in [block.ts:82](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L82)_

**Returns:** _[Buffer[], Buffer[], Buffer[]]_

## Methods

### genTxTrie

▸ **genTxTrie**(): _Promise‹void›_

_Defined in [block.ts:131](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L131)_

Generate transaction trie. The tx trie must be generated before the transaction trie can
be validated with `validateTransactionTrie`

**Returns:** _Promise‹void›_

---

### hash

▸ **hash**(): _Buffer_

_Defined in [block.ts:89](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L89)_

Produces a hash the RLP of the block

**Returns:** _Buffer_

---

### isGenesis

▸ **isGenesis**(): _boolean_

_Defined in [block.ts:96](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L96)_

Determines if this block is the genesis block

**Returns:** _boolean_

---

### serialize

▸ **serialize**(): _Buffer_

_Defined in [block.ts:114](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L114)_

Produces a serialization of the block.

**Returns:** _Buffer_

▸ **serialize**(`rlpEncode`: true): _Buffer_

_Defined in [block.ts:115](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L115)_

**Parameters:**

| Name        | Type |
| ----------- | ---- |
| `rlpEncode` | true |

**Returns:** _Buffer_

▸ **serialize**(`rlpEncode`: false): _[Buffer[], Buffer[], Buffer[]]_

_Defined in [block.ts:116](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L116)_

**Parameters:**

| Name        | Type  |
| ----------- | ----- |
| `rlpEncode` | false |

**Returns:** _[Buffer[], Buffer[], Buffer[]]_

---

### setGenesisParams

▸ **setGenesisParams**(): _void_

_Defined in [block.ts:103](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L103)_

Turns the block into the canonical genesis block

**Returns:** _void_

---

### toJSON

▸ **toJSON**(`labeled`: boolean): _any_

_Defined in [block.ts:238](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L238)_

Returns the block in JSON format

**`see`** [ethereumjs-util](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties)

**Parameters:**

| Name      | Type    | Default |
| --------- | ------- | ------- |
| `labeled` | boolean | false   |

**Returns:** _any_

---

### validate

▸ **validate**(`blockChain`: [Blockchain](../interfaces/_index_.blockchain.md)): _Promise‹void›_

_Defined in [block.ts:180](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L180)_

Validates the entire block, throwing if invalid.

**Parameters:**

| Name         | Type                                              | Description                                        |
| ------------ | ------------------------------------------------- | -------------------------------------------------- |
| `blockChain` | [Blockchain](../interfaces/_index_.blockchain.md) | the blockchain that this block wants to be part of |

**Returns:** _Promise‹void›_

---

### validateTransactions

▸ **validateTransactions**(): _boolean_

_Defined in [block.ts:155](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L155)_

Validates the transactions

**Returns:** _boolean_

▸ **validateTransactions**(`stringError`: false): _boolean_

_Defined in [block.ts:156](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L156)_

**Parameters:**

| Name          | Type  |
| ------------- | ----- |
| `stringError` | false |

**Returns:** _boolean_

▸ **validateTransactions**(`stringError`: true): _string_

_Defined in [block.ts:157](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L157)_

**Parameters:**

| Name          | Type |
| ------------- | ---- |
| `stringError` | true |

**Returns:** _string_

---

### validateTransactionsTrie

▸ **validateTransactionsTrie**(): _boolean_

_Defined in [block.ts:141](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L141)_

Validates the transaction trie

**Returns:** _boolean_

---

### validateUncles

▸ **validateUncles**(`blockchain`: [Blockchain](../interfaces/_index_.blockchain.md)): _Promise‹void›_

_Defined in [block.ts:215](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L215)_

Validates the uncles that are in the block, if any. This method throws if they are invalid.

**Parameters:**

| Name         | Type                                              |
| ------------ | ------------------------------------------------- |
| `blockchain` | [Blockchain](../interfaces/_index_.blockchain.md) |

**Returns:** _Promise‹void›_

---

### validateUnclesHash

▸ **validateUnclesHash**(): _boolean_

_Defined in [block.ts:204](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/block.ts#L204)_

Validates the uncle's hash

**Returns:** _boolean_
