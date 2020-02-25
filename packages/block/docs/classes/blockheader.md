[ethereumjs-block](../README.md) > [BlockHeader](../classes/blockheader.md)

# Class: BlockHeader

An object that represents the block header

## Hierarchy

**BlockHeader**

## Index

### Constructors

- [constructor](blockheader.md#constructor)

### Properties

- [\_common](blockheader.md#_common)
- [bloom](blockheader.md#bloom)
- [coinbase](blockheader.md#coinbase)
- [difficulty](blockheader.md#difficulty)
- [extraData](blockheader.md#extradata)
- [gasLimit](blockheader.md#gaslimit)
- [gasUsed](blockheader.md#gasused)
- [mixHash](blockheader.md#mixhash)
- [nonce](blockheader.md#nonce)
- [number](blockheader.md#number)
- [parentHash](blockheader.md#parenthash)
- [raw](blockheader.md#raw)
- [receiptTrie](blockheader.md#receipttrie)
- [stateRoot](blockheader.md#stateroot)
- [timestamp](blockheader.md#timestamp)
- [transactionsTrie](blockheader.md#transactionstrie)
- [uncleHash](blockheader.md#unclehash)

### Methods

- [\_getBlockByHash](blockheader.md#_getblockbyhash)
- [\_getHardfork](blockheader.md#_gethardfork)
- [canonicalDifficulty](blockheader.md#canonicaldifficulty)
- [hash](blockheader.md#hash)
- [isGenesis](blockheader.md#isgenesis)
- [serialize](blockheader.md#serialize)
- [setGenesisParams](blockheader.md#setgenesisparams)
- [toJSON](blockheader.md#tojson)
- [validate](blockheader.md#validate)
- [validateDifficulty](blockheader.md#validatedifficulty)
- [validateGasLimit](blockheader.md#validategaslimit)

---

## Constructors

<a id="constructor"></a>

### constructor

⊕ **new BlockHeader**(data?: _`Buffer` \| [PrefixedHexString](../#prefixedhexstring) \| [BufferLike](../#bufferlike)[] \| [BlockHeaderData](../interfaces/blockheaderdata.md)_, opts?: _[ChainOptions](../interfaces/chainoptions.md)_): [BlockHeader](blockheader.md)

_Defined in [header.ts:29](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L29)_

Creates a new block header.

**Parameters:**

| Name                 | Type                                                                                                                                            | Default value | Description                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------- |
| `Default value` data | `Buffer` \| [PrefixedHexString](../#prefixedhexstring) \| [BufferLike](../#bufferlike)[] \| [BlockHeaderData](../interfaces/blockheaderdata.md) | {}            | The data of the block header.                                              |
| `Default value` opts | [ChainOptions](../interfaces/chainoptions.md)                                                                                                   | {}            | The network options for this block, and its header, uncle headers and txs. |

**Returns:** [BlockHeader](blockheader.md)

---

## Properties

<a id="_common"></a>

### `<Private>` \_common

**● \_common**: _`Common`_

_Defined in [header.ts:29](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L29)_

---

<a id="bloom"></a>

### bloom

**● bloom**: _`Buffer`_

_Defined in [header.ts:19](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L19)_

---

<a id="coinbase"></a>

### coinbase

**● coinbase**: _`Buffer`_

_Defined in [header.ts:15](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L15)_

---

<a id="difficulty"></a>

### difficulty

**● difficulty**: _`Buffer`_

_Defined in [header.ts:20](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L20)_

---

<a id="extradata"></a>

### extraData

**● extraData**: _`Buffer`_

_Defined in [header.ts:25](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L25)_

---

<a id="gaslimit"></a>

### gasLimit

**● gasLimit**: _`Buffer`_

_Defined in [header.ts:22](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L22)_

---

<a id="gasused"></a>

### gasUsed

**● gasUsed**: _`Buffer`_

_Defined in [header.ts:23](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L23)_

---

<a id="mixhash"></a>

### mixHash

**● mixHash**: _`Buffer`_

_Defined in [header.ts:26](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L26)_

---

<a id="nonce"></a>

### nonce

**● nonce**: _`Buffer`_

_Defined in [header.ts:27](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L27)_

---

<a id="number"></a>

### number

**● number**: _`Buffer`_

_Defined in [header.ts:21](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L21)_

---

<a id="parenthash"></a>

### parentHash

**● parentHash**: _`Buffer`_

_Defined in [header.ts:13](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L13)_

---

<a id="raw"></a>

### raw

**● raw**: _`Buffer`[]_

_Defined in [header.ts:12](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L12)_

---

<a id="receipttrie"></a>

### receiptTrie

**● receiptTrie**: _`Buffer`_

_Defined in [header.ts:18](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L18)_

---

<a id="stateroot"></a>

### stateRoot

**● stateRoot**: _`Buffer`_

_Defined in [header.ts:16](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L16)_

---

<a id="timestamp"></a>

### timestamp

**● timestamp**: _`Buffer`_

_Defined in [header.ts:24](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L24)_

---

<a id="transactionstrie"></a>

### transactionsTrie

**● transactionsTrie**: _`Buffer`_

_Defined in [header.ts:17](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L17)_

---

<a id="unclehash"></a>

### uncleHash

**● uncleHash**: _`Buffer`_

_Defined in [header.ts:14](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L14)_

---

## Methods

<a id="_getblockbyhash"></a>

### `<Private>` \_getBlockByHash

▸ **\_getBlockByHash**(blockchain: _[Blockchain](../interfaces/blockchain.md)_, hash: _`Buffer`_): `Promise`<[Block](block.md) \| `undefined`>

_Defined in [header.ts:347](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L347)_

**Parameters:**

| Name       | Type                                      |
| ---------- | ----------------------------------------- |
| blockchain | [Blockchain](../interfaces/blockchain.md) |
| hash       | `Buffer`                                  |

**Returns:** `Promise`<[Block](block.md) \| `undefined`>

---

<a id="_gethardfork"></a>

### `<Private>` \_getHardfork

▸ **\_getHardfork**(): `string`

_Defined in [header.ts:339](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L339)_

**Returns:** `string`

---

<a id="canonicaldifficulty"></a>

### canonicalDifficulty

▸ **canonicalDifficulty**(parentBlock: _[Block](block.md)_): `BN`

_Defined in [header.ts:134](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L134)_

Returns the canonical difficulty for this block.

**Parameters:**

| Name        | Type              | Description                             |
| ----------- | ----------------- | --------------------------------------- |
| parentBlock | [Block](block.md) | the parent \`Block\` of the this header |

**Returns:** `BN`

---

<a id="hash"></a>

### hash

▸ **hash**(): `Buffer`

_Defined in [header.ts:297](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L297)_

Returns the hash of the block header.

**Returns:** `Buffer`

---

<a id="isgenesis"></a>

### isGenesis

▸ **isGenesis**(): `boolean`

_Defined in [header.ts:304](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L304)_

Checks if the block header is a genesis header.

**Returns:** `boolean`

---

<a id="serialize"></a>

### serialize

▸ **serialize**(): `Buffer`

_Defined in [header.ts:324](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L324)_

Returns the rlp encoding of the block header

**Returns:** `Buffer`

---

<a id="setgenesisparams"></a>

### setGenesisParams

▸ **setGenesisParams**(): `void`

_Defined in [header.ts:311](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L311)_

Turns the header into the canonical genesis block header.

**Returns:** `void`

---

<a id="tojson"></a>

### toJSON

▸ **toJSON**(\_labels?: _`boolean`_): `object` \| `string`[]

_Defined in [header.ts:334](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L334)_

Returns the block header in JSON format

_**see**_: [ethereumjs-util](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties)

**Parameters:**

| Name                     | Type      | Default value |
| ------------------------ | --------- | ------------- |
| `Default value` \_labels | `boolean` | false         |

**Returns:** `object` \| `string`[]

---

<a id="validate"></a>

### validate

▸ **validate**(blockchain: _[Blockchain](../interfaces/blockchain.md)_, height?: _`BN`_): `Promise`<`void`>

_Defined in [header.ts:249](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L249)_

Validates the entire block header, throwing if invalid.

**Parameters:**

| Name              | Type                                      | Description                                                                      |
| ----------------- | ----------------------------------------- | -------------------------------------------------------------------------------- |
| blockchain        | [Blockchain](../interfaces/blockchain.md) | the blockchain that this block is validating against                             |
| `Optional` height | `BN`                                      | If this is an uncle header, this is the height of the block that is including it |

**Returns:** `Promise`<`void`>

---

<a id="validatedifficulty"></a>

### validateDifficulty

▸ **validateDifficulty**(parentBlock: _[Block](block.md)_): `boolean`

_Defined in [header.ts:215](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L215)_

Checks that the block's `difficulty` matches the canonical difficulty.

**Parameters:**

| Name        | Type              | Description         |
| ----------- | ----------------- | ------------------- |
| parentBlock | [Block](block.md) | this block's parent |

**Returns:** `boolean`

---

<a id="validategaslimit"></a>

### validateGasLimit

▸ **validateGasLimit**(parentBlock: _[Block](block.md)_): `boolean`

_Defined in [header.ts:225](https://github.com/ethereumjs/ethereumjs-block/blob/6adbfae/src/header.ts#L225)_

Validates the gasLimit.

**Parameters:**

| Name        | Type              | Description         |
| ----------- | ----------------- | ------------------- |
| parentBlock | [Block](block.md) | this block's parent |

**Returns:** `boolean`

---
