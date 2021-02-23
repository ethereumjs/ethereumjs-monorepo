[@ethereumjs/block](../README.md) › ["header"](../modules/_header_.md) › [BlockHeader](_header_.blockheader.md)

# Class: BlockHeader

An object that represents the block header.

## Hierarchy

* **BlockHeader**

## Index

### Constructors

* [constructor](_header_.blockheader.md#constructor)

### Properties

* [_common](_header_.blockheader.md#_common)
* [_errorPostfix](_header_.blockheader.md#_errorpostfix)
* [bloom](_header_.blockheader.md#bloom)
* [coinbase](_header_.blockheader.md#coinbase)
* [difficulty](_header_.blockheader.md#difficulty)
* [extraData](_header_.blockheader.md#extradata)
* [gasLimit](_header_.blockheader.md#gaslimit)
* [gasUsed](_header_.blockheader.md#gasused)
* [mixHash](_header_.blockheader.md#mixhash)
* [nonce](_header_.blockheader.md#nonce)
* [number](_header_.blockheader.md#number)
* [parentHash](_header_.blockheader.md#parenthash)
* [receiptTrie](_header_.blockheader.md#receipttrie)
* [stateRoot](_header_.blockheader.md#stateroot)
* [timestamp](_header_.blockheader.md#timestamp)
* [transactionsTrie](_header_.blockheader.md#transactionstrie)
* [uncleHash](_header_.blockheader.md#unclehash)

### Methods

* [_validateHeaderFields](_header_.blockheader.md#_validateheaderfields)
* [canonicalDifficulty](_header_.blockheader.md#canonicaldifficulty)
* [cliqueEpochTransitionSigners](_header_.blockheader.md#cliqueepochtransitionsigners)
* [cliqueExtraSeal](_header_.blockheader.md#cliqueextraseal)
* [cliqueExtraVanity](_header_.blockheader.md#cliqueextravanity)
* [cliqueIsEpochTransition](_header_.blockheader.md#cliqueisepochtransition)
* [cliqueSigHash](_header_.blockheader.md#cliquesighash)
* [cliqueSigner](_header_.blockheader.md#cliquesigner)
* [cliqueVerifySignature](_header_.blockheader.md#cliqueverifysignature)
* [hash](_header_.blockheader.md#hash)
* [isGenesis](_header_.blockheader.md#isgenesis)
* [raw](_header_.blockheader.md#raw)
* [serialize](_header_.blockheader.md#serialize)
* [toJSON](_header_.blockheader.md#tojson)
* [validate](_header_.blockheader.md#validate)
* [validateCliqueDifficulty](_header_.blockheader.md#validatecliquedifficulty)
* [validateDifficulty](_header_.blockheader.md#validatedifficulty)
* [validateGasLimit](_header_.blockheader.md#validategaslimit)
* [fromHeaderData](_header_.blockheader.md#static-fromheaderdata)
* [fromRLPSerializedHeader](_header_.blockheader.md#static-fromrlpserializedheader)
* [fromValuesArray](_header_.blockheader.md#static-fromvaluesarray)
* [genesis](_header_.blockheader.md#static-genesis)

## Constructors

###  constructor

\+ **new BlockHeader**(`parentHash`: Buffer, `uncleHash`: Buffer, `coinbase`: Address, `stateRoot`: Buffer, `transactionsTrie`: Buffer, `receiptTrie`: Buffer, `bloom`: Buffer, `difficulty`: BN, `number`: BN, `gasLimit`: BN, `gasUsed`: BN, `timestamp`: BN, `extraData`: Buffer, `mixHash`: Buffer, `nonce`: Buffer, `options`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[BlockHeader](_header_.blockheader.md)*

*Defined in [header.ts:149](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L149)*

This constructor takes the values, validates them, assigns them and freezes the object.
Use the public static factory methods to assist in creating a Header object from
varying data types.
For a default empty header, use `BlockHeader.fromHeaderData()`.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`parentHash` | Buffer | - |
`uncleHash` | Buffer | - |
`coinbase` | Address | - |
`stateRoot` | Buffer | - |
`transactionsTrie` | Buffer | - |
`receiptTrie` | Buffer | - |
`bloom` | Buffer | - |
`difficulty` | BN | - |
`number` | BN | - |
`gasLimit` | BN | - |
`gasUsed` | BN | - |
`timestamp` | BN | - |
`extraData` | Buffer | - |
`mixHash` | Buffer | - |
`nonce` | Buffer | - |
`options` | [BlockOptions](../interfaces/_index_.blockoptions.md) | {} |

**Returns:** *[BlockHeader](_header_.blockheader.md)*

## Properties

###  _common

• **_common**: *Common*

*Defined in [header.ts:48](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L48)*

___

###  _errorPostfix

• **_errorPostfix**: *string* = ""

*Defined in [header.ts:49](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L49)*

___

###  bloom

• **bloom**: *Buffer*

*Defined in [header.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L38)*

___

###  coinbase

• **coinbase**: *Address*

*Defined in [header.ts:34](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L34)*

___

###  difficulty

• **difficulty**: *BN*

*Defined in [header.ts:39](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L39)*

___

###  extraData

• **extraData**: *Buffer*

*Defined in [header.ts:44](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L44)*

___

###  gasLimit

• **gasLimit**: *BN*

*Defined in [header.ts:41](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L41)*

___

###  gasUsed

• **gasUsed**: *BN*

*Defined in [header.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L42)*

___

###  mixHash

• **mixHash**: *Buffer*

*Defined in [header.ts:45](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L45)*

___

###  nonce

• **nonce**: *Buffer*

*Defined in [header.ts:46](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L46)*

___

###  number

• **number**: *BN*

*Defined in [header.ts:40](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L40)*

___

###  parentHash

• **parentHash**: *Buffer*

*Defined in [header.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L32)*

___

###  receiptTrie

• **receiptTrie**: *Buffer*

*Defined in [header.ts:37](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L37)*

___

###  stateRoot

• **stateRoot**: *Buffer*

*Defined in [header.ts:35](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L35)*

___

###  timestamp

• **timestamp**: *BN*

*Defined in [header.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L43)*

___

###  transactionsTrie

• **transactionsTrie**: *Buffer*

*Defined in [header.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L36)*

___

###  uncleHash

• **uncleHash**: *Buffer*

*Defined in [header.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L33)*

## Methods

###  _validateHeaderFields

▸ **_validateHeaderFields**(): *void*

*Defined in [header.ts:265](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L265)*

Validates correct buffer lengths, throws if invalid.

**Returns:** *void*

___

###  canonicalDifficulty

▸ **canonicalDifficulty**(`parentBlockHeader`: [BlockHeader](_header_.blockheader.md)): *BN*

*Defined in [header.ts:295](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L295)*

Returns the canonical difficulty for this block.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlockHeader` | [BlockHeader](_header_.blockheader.md) | the header from the parent `Block` of this header  |

**Returns:** *BN*

___

###  cliqueEpochTransitionSigners

▸ **cliqueEpochTransitionSigners**(): *Address[]*

*Defined in [header.ts:656](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L656)*

Returns a list of signers
(only clique PoA, throws otherwise)

This function throws if not called on an epoch
transition block and should therefore be used
in conjunction with `cliqueIsEpochTransition()`

**Returns:** *Address[]*

___

###  cliqueExtraSeal

▸ **cliqueExtraSeal**(): *Buffer*

*Defined in [header.ts:622](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L622)*

Returns extra seal data
(only clique PoA, throws otherwise)

**Returns:** *Buffer*

___

###  cliqueExtraVanity

▸ **cliqueExtraVanity**(): *Buffer*

*Defined in [header.ts:613](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L613)*

Returns extra vanity data
(only clique PoA, throws otherwise)

**Returns:** *Buffer*

___

###  cliqueIsEpochTransition

▸ **cliqueIsEpochTransition**(): *boolean*

*Defined in [header.ts:601](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L601)*

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

**Returns:** *boolean*

___

###  cliqueSigHash

▸ **cliqueSigHash**(): *Buffer‹›*

*Defined in [header.ts:590](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L590)*

PoA clique signature hash without the seal.

**Returns:** *Buffer‹›*

___

###  cliqueSigner

▸ **cliqueSigner**(): *Address*

*Defined in [header.ts:692](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L692)*

Returns the signer address

**Returns:** *Address*

___

###  cliqueVerifySignature

▸ **cliqueVerifySignature**(`signerList`: Address[]): *boolean*

*Defined in [header.ts:680](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L680)*

Verifies the signature of the block (last 65 bytes of extraData field)
(only clique PoA, throws otherwise)

 Method throws if signature is invalid

**Parameters:**

Name | Type |
------ | ------ |
`signerList` | Address[] |

**Returns:** *boolean*

___

###  hash

▸ **hash**(): *Buffer*

*Defined in [header.ts:570](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L570)*

Returns the hash of the block header.

**Returns:** *Buffer*

___

###  isGenesis

▸ **isGenesis**(): *boolean*

*Defined in [header.ts:577](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L577)*

Checks if the block header is a genesis header.

**Returns:** *boolean*

___

###  raw

▸ **raw**(): *[BlockHeaderBuffer](../modules/_index_.md#blockheaderbuffer)*

*Defined in [header.ts:547](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L547)*

Returns a Buffer Array of the raw Buffers in this header, in order.

**Returns:** *[BlockHeaderBuffer](../modules/_index_.md#blockheaderbuffer)*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [header.ts:709](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L709)*

Returns the rlp encoding of the block header.

**Returns:** *Buffer*

___

###  toJSON

▸ **toJSON**(): *[JsonHeader](../interfaces/_index_.jsonheader.md)*

*Defined in [header.ts:716](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L716)*

Returns the block header in JSON format.

**Returns:** *[JsonHeader](../interfaces/_index_.jsonheader.md)*

___

###  validate

▸ **validate**(`blockchain`: [Blockchain](../interfaces/_index_.blockchain.md), `height?`: BN): *Promise‹void›*

*Defined in [header.ts:460](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L460)*

Validates the block header, throwing if invalid. It is being validated against the reported `parentHash`.
It verifies the current block against the `parentHash`:
- The `parentHash` is part of the blockchain (it is a valid header)
- Current block number is parent block number + 1
- Current block has a strictly higher timestamp
- Additional PoW checks ->
  - Current block has valid difficulty and gas limit
  - In case that the header is an uncle header, it should not be too old or young in the chain.
- Additional PoA clique checks ->
  - Various extraData checks
  - Checks on coinbase and mixHash
  - Current block has a timestamp diff greater or equal to PERIOD
  - Current block has difficulty correctly marked as INTURN or NOTURN

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockchain` | [Blockchain](../interfaces/_index_.blockchain.md) | validate against an @ethereumjs/blockchain |
`height?` | BN | If this is an uncle header, this is the height of the block that is including it  |

**Returns:** *Promise‹void›*

___

###  validateCliqueDifficulty

▸ **validateCliqueDifficulty**(`blockchain`: [Blockchain](../interfaces/_index_.blockchain.md)): *boolean*

*Defined in [header.ts:391](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L391)*

For poa, validates `difficulty` is correctly identified as INTURN or NOTURN.
Returns false if invalid.

**Parameters:**

Name | Type |
------ | ------ |
`blockchain` | [Blockchain](../interfaces/_index_.blockchain.md) |

**Returns:** *boolean*

___

###  validateDifficulty

▸ **validateDifficulty**(`parentBlockHeader`: [BlockHeader](_header_.blockheader.md)): *boolean*

*Defined in [header.ts:383](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L383)*

Checks that the block's `difficulty` matches the canonical difficulty.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlockHeader` | [BlockHeader](_header_.blockheader.md) | the header from the parent `Block` of this header  |

**Returns:** *boolean*

___

###  validateGasLimit

▸ **validateGasLimit**(`parentBlockHeader`: [BlockHeader](_header_.blockheader.md)): *boolean*

*Defined in [header.ts:425](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L425)*

Validates if the block gasLimit remains in the
boundaries set by the protocol.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentBlockHeader` | [BlockHeader](_header_.blockheader.md) | the header from the parent `Block` of this header  |

**Returns:** *boolean*

___

### `Static` fromHeaderData

▸ **fromHeaderData**(`headerData`: [HeaderData](../interfaces/_index_.headerdata.md), `opts?`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[BlockHeader](_header_.blockheader.md)‹›*

*Defined in [header.ts:51](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L51)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`headerData` | [HeaderData](../interfaces/_index_.headerdata.md) | {} |
`opts?` | [BlockOptions](../interfaces/_index_.blockoptions.md) | - |

**Returns:** *[BlockHeader](_header_.blockheader.md)‹›*

___

### `Static` fromRLPSerializedHeader

▸ **fromRLPSerializedHeader**(`serialized`: Buffer, `opts?`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[BlockHeader](_header_.blockheader.md)‹›*

*Defined in [header.ts:90](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L90)*

**Parameters:**

Name | Type |
------ | ------ |
`serialized` | Buffer |
`opts?` | [BlockOptions](../interfaces/_index_.blockoptions.md) |

**Returns:** *[BlockHeader](_header_.blockheader.md)‹›*

___

### `Static` fromValuesArray

▸ **fromValuesArray**(`values`: [BlockHeaderBuffer](../modules/_index_.md#blockheaderbuffer), `opts?`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[BlockHeader](_header_.blockheader.md)‹›*

*Defined in [header.ts:100](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L100)*

**Parameters:**

Name | Type |
------ | ------ |
`values` | [BlockHeaderBuffer](../modules/_index_.md#blockheaderbuffer) |
`opts?` | [BlockOptions](../interfaces/_index_.blockoptions.md) |

**Returns:** *[BlockHeader](_header_.blockheader.md)‹›*

___

### `Static` genesis

▸ **genesis**(`headerData`: [HeaderData](../interfaces/_index_.headerdata.md), `opts?`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[BlockHeader](_header_.blockheader.md)‹›*

*Defined in [header.ts:146](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header.ts#L146)*

Alias for Header.fromHeaderData() with initWithGenesisHeader set to true.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`headerData` | [HeaderData](../interfaces/_index_.headerdata.md) | {} |
`opts?` | [BlockOptions](../interfaces/_index_.blockoptions.md) | - |

**Returns:** *[BlockHeader](_header_.blockheader.md)‹›*
