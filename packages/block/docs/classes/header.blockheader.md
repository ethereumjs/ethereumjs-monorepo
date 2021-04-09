[@ethereumjs/block](../README.md) / [header](../modules/header.md) / BlockHeader

# Class: BlockHeader

[header](../modules/header.md).BlockHeader

An object that represents the block header.

## Table of contents

### Constructors

- [constructor](header.blockheader.md#constructor)

### Properties

- [\_common](header.blockheader.md#_common)
- [\_errorPostfix](header.blockheader.md#_errorpostfix)
- [bloom](header.blockheader.md#bloom)
- [coinbase](header.blockheader.md#coinbase)
- [difficulty](header.blockheader.md#difficulty)
- [extraData](header.blockheader.md#extradata)
- [gasLimit](header.blockheader.md#gaslimit)
- [gasUsed](header.blockheader.md#gasused)
- [mixHash](header.blockheader.md#mixhash)
- [nonce](header.blockheader.md#nonce)
- [number](header.blockheader.md#number)
- [parentHash](header.blockheader.md#parenthash)
- [receiptTrie](header.blockheader.md#receipttrie)
- [stateRoot](header.blockheader.md#stateroot)
- [timestamp](header.blockheader.md#timestamp)
- [transactionsTrie](header.blockheader.md#transactionstrie)
- [uncleHash](header.blockheader.md#unclehash)

### Methods

- [\_validateHeaderFields](header.blockheader.md#_validateheaderfields)
- [canonicalDifficulty](header.blockheader.md#canonicaldifficulty)
- [cliqueEpochTransitionSigners](header.blockheader.md#cliqueepochtransitionsigners)
- [cliqueExtraSeal](header.blockheader.md#cliqueextraseal)
- [cliqueExtraVanity](header.blockheader.md#cliqueextravanity)
- [cliqueIsEpochTransition](header.blockheader.md#cliqueisepochtransition)
- [cliqueSigHash](header.blockheader.md#cliquesighash)
- [cliqueSigner](header.blockheader.md#cliquesigner)
- [cliqueVerifySignature](header.blockheader.md#cliqueverifysignature)
- [hash](header.blockheader.md#hash)
- [isGenesis](header.blockheader.md#isgenesis)
- [raw](header.blockheader.md#raw)
- [serialize](header.blockheader.md#serialize)
- [toJSON](header.blockheader.md#tojson)
- [validate](header.blockheader.md#validate)
- [validateCliqueDifficulty](header.blockheader.md#validatecliquedifficulty)
- [validateDifficulty](header.blockheader.md#validatedifficulty)
- [validateGasLimit](header.blockheader.md#validategaslimit)
- [fromHeaderData](header.blockheader.md#fromheaderdata)
- [fromRLPSerializedHeader](header.blockheader.md#fromrlpserializedheader)
- [fromValuesArray](header.blockheader.md#fromvaluesarray)
- [genesis](header.blockheader.md#genesis)

## Constructors

### constructor

\+ **new BlockHeader**(`parentHash`: *Buffer*, `uncleHash`: *Buffer*, `coinbase`: *Address*, `stateRoot`: *Buffer*, `transactionsTrie`: *Buffer*, `receiptTrie`: *Buffer*, `bloom`: *Buffer*, `difficulty`: *BN*, `number`: *BN*, `gasLimit`: *BN*, `gasUsed`: *BN*, `timestamp`: *BN*, `extraData`: *Buffer*, `mixHash`: *Buffer*, `nonce`: *Buffer*, `options?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*BlockHeader*](header.blockheader.md)

This constructor takes the values, validates them, assigns them and freezes the object.
Use the public static factory methods to assist in creating a Header object from
varying data types.
For a default empty header, use `BlockHeader.fromHeaderData()`.

#### Parameters:

Name | Type |
:------ | :------ |
`parentHash` | *Buffer* |
`uncleHash` | *Buffer* |
`coinbase` | *Address* |
`stateRoot` | *Buffer* |
`transactionsTrie` | *Buffer* |
`receiptTrie` | *Buffer* |
`bloom` | *Buffer* |
`difficulty` | *BN* |
`number` | *BN* |
`gasLimit` | *BN* |
`gasUsed` | *BN* |
`timestamp` | *BN* |
`extraData` | *Buffer* |
`mixHash` | *Buffer* |
`nonce` | *Buffer* |
`options` | [*BlockOptions*](../interfaces/types.blockoptions.md) |

**Returns:** [*BlockHeader*](header.blockheader.md)

Defined in: [header.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L166)

## Properties

### \_common

• `Readonly` **\_common**: *default*

Defined in: [header.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L47)

___

### \_errorPostfix

• **\_errorPostfix**: *string*= ''

Defined in: [header.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L48)

___

### bloom

• `Readonly` **bloom**: *Buffer*

Defined in: [header.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L37)

___

### coinbase

• `Readonly` **coinbase**: *Address*

Defined in: [header.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L33)

___

### difficulty

• `Readonly` **difficulty**: *BN*

Defined in: [header.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L38)

___

### extraData

• `Readonly` **extraData**: *Buffer*

Defined in: [header.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L43)

___

### gasLimit

• `Readonly` **gasLimit**: *BN*

Defined in: [header.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L40)

___

### gasUsed

• `Readonly` **gasUsed**: *BN*

Defined in: [header.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L41)

___

### mixHash

• `Readonly` **mixHash**: *Buffer*

Defined in: [header.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L44)

___

### nonce

• `Readonly` **nonce**: *Buffer*

Defined in: [header.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L45)

___

### number

• `Readonly` **number**: *BN*

Defined in: [header.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L39)

___

### parentHash

• `Readonly` **parentHash**: *Buffer*

Defined in: [header.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L31)

___

### receiptTrie

• `Readonly` **receiptTrie**: *Buffer*

Defined in: [header.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L36)

___

### stateRoot

• `Readonly` **stateRoot**: *Buffer*

Defined in: [header.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L34)

___

### timestamp

• `Readonly` **timestamp**: *BN*

Defined in: [header.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L42)

___

### transactionsTrie

• `Readonly` **transactionsTrie**: *Buffer*

Defined in: [header.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L35)

___

### uncleHash

• `Readonly` **uncleHash**: *Buffer*

Defined in: [header.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L32)

## Methods

### \_validateHeaderFields

▸ **_validateHeaderFields**(): *void*

Validates correct buffer lengths, throws if invalid.

**Returns:** *void*

Defined in: [header.ts:284](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L284)

___

### canonicalDifficulty

▸ **canonicalDifficulty**(`parentBlockHeader`: [*BlockHeader*](header.blockheader.md)): *BN*

Returns the canonical difficulty for this block.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`parentBlockHeader` | [*BlockHeader*](header.blockheader.md) | the header from the parent `Block` of this header    |

**Returns:** *BN*

Defined in: [header.ts:314](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L314)

___

### cliqueEpochTransitionSigners

▸ **cliqueEpochTransitionSigners**(): *Address*[]

Returns a list of signers
(only clique PoA, throws otherwise)

This function throws if not called on an epoch
transition block and should therefore be used
in conjunction with `cliqueIsEpochTransition()`

**Returns:** *Address*[]

Defined in: [header.ts:670](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L670)

___

### cliqueExtraSeal

▸ **cliqueExtraSeal**(): *Buffer*

Returns extra seal data
(only clique PoA, throws otherwise)

**Returns:** *Buffer*

Defined in: [header.ts:641](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L641)

___

### cliqueExtraVanity

▸ **cliqueExtraVanity**(): *Buffer*

Returns extra vanity data
(only clique PoA, throws otherwise)

**Returns:** *Buffer*

Defined in: [header.ts:632](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L632)

___

### cliqueIsEpochTransition

▸ **cliqueIsEpochTransition**(): *boolean*

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

**Returns:** *boolean*

Defined in: [header.ts:620](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L620)

___

### cliqueSigHash

▸ **cliqueSigHash**(): *Buffer*

PoA clique signature hash without the seal.

**Returns:** *Buffer*

Defined in: [header.ts:609](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L609)

___

### cliqueSigner

▸ **cliqueSigner**(): *Address*

Returns the signer address

**Returns:** *Address*

Defined in: [header.ts:706](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L706)

___

### cliqueVerifySignature

▸ **cliqueVerifySignature**(`signerList`: *Address*[]): *boolean*

Verifies the signature of the block (last 65 bytes of extraData field)
(only clique PoA, throws otherwise)

 Method throws if signature is invalid

#### Parameters:

Name | Type |
:------ | :------ |
`signerList` | *Address*[] |

**Returns:** *boolean*

Defined in: [header.ts:694](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L694)

___

### hash

▸ **hash**(): *Buffer*

Returns the hash of the block header.

**Returns:** *Buffer*

Defined in: [header.ts:589](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L589)

___

### isGenesis

▸ **isGenesis**(): *boolean*

Checks if the block header is a genesis header.

**Returns:** *boolean*

Defined in: [header.ts:596](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L596)

___

### raw

▸ **raw**(): [*BlockHeaderBuffer*](../modules/types.md#blockheaderbuffer)

Returns a Buffer Array of the raw Buffers in this header, in order.

**Returns:** [*BlockHeaderBuffer*](../modules/types.md#blockheaderbuffer)

Defined in: [header.ts:566](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L566)

___

### serialize

▸ **serialize**(): *Buffer*

Returns the rlp encoding of the block header.

**Returns:** *Buffer*

Defined in: [header.ts:723](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L723)

___

### toJSON

▸ **toJSON**(): [*JsonHeader*](../interfaces/types.jsonheader.md)

Returns the block header in JSON format.

**Returns:** [*JsonHeader*](../interfaces/types.jsonheader.md)

Defined in: [header.ts:730](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L730)

___

### validate

▸ **validate**(`blockchain`: [*Blockchain*](../interfaces/types.blockchain.md), `height?`: *BN*): *Promise*<void\>

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

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`blockchain` | [*Blockchain*](../interfaces/types.blockchain.md) | validate against an @ethereumjs/blockchain   |
`height?` | *BN* | If this is an uncle header, this is the height of the block that is including it    |

**Returns:** *Promise*<void\>

Defined in: [header.ts:479](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L479)

___

### validateCliqueDifficulty

▸ **validateCliqueDifficulty**(`blockchain`: [*Blockchain*](../interfaces/types.blockchain.md)): *boolean*

For poa, validates `difficulty` is correctly identified as INTURN or NOTURN.
Returns false if invalid.

#### Parameters:

Name | Type |
:------ | :------ |
`blockchain` | [*Blockchain*](../interfaces/types.blockchain.md) |

**Returns:** *boolean*

Defined in: [header.ts:410](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L410)

___

### validateDifficulty

▸ **validateDifficulty**(`parentBlockHeader`: [*BlockHeader*](header.blockheader.md)): *boolean*

Checks that the block's `difficulty` matches the canonical difficulty.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`parentBlockHeader` | [*BlockHeader*](header.blockheader.md) | the header from the parent `Block` of this header    |

**Returns:** *boolean*

Defined in: [header.ts:402](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L402)

___

### validateGasLimit

▸ **validateGasLimit**(`parentBlockHeader`: [*BlockHeader*](header.blockheader.md)): *boolean*

Validates if the block gasLimit remains in the
boundaries set by the protocol.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`parentBlockHeader` | [*BlockHeader*](header.blockheader.md) | the header from the parent `Block` of this header    |

**Returns:** *boolean*

Defined in: [header.ts:444](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L444)

___

### fromHeaderData

▸ `Static`**fromHeaderData**(`headerData?`: [*HeaderData*](../interfaces/types.headerdata.md), `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*BlockHeader*](header.blockheader.md)

Static constructor to create a block header from a header data dictionary

#### Parameters:

Name | Type |
:------ | :------ |
`headerData` | [*HeaderData*](../interfaces/types.headerdata.md) |
`opts?` | [*BlockOptions*](../interfaces/types.blockoptions.md) |

**Returns:** [*BlockHeader*](header.blockheader.md)

Defined in: [header.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L56)

___

### fromRLPSerializedHeader

▸ `Static`**fromRLPSerializedHeader**(`serialized`: *Buffer*, `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*BlockHeader*](header.blockheader.md)

Static constructor to create a block header from a RLP-serialized header

#### Parameters:

Name | Type |
:------ | :------ |
`serialized` | *Buffer* |
`opts?` | [*BlockOptions*](../interfaces/types.blockoptions.md) |

**Returns:** [*BlockHeader*](header.blockheader.md)

Defined in: [header.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L101)

___

### fromValuesArray

▸ `Static`**fromValuesArray**(`values`: [*BlockHeaderBuffer*](../modules/types.md#blockheaderbuffer), `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*BlockHeader*](header.blockheader.md)

Static constructor to create a block header from an array of Buffer values

#### Parameters:

Name | Type |
:------ | :------ |
`values` | [*BlockHeaderBuffer*](../modules/types.md#blockheaderbuffer) |
`opts?` | [*BlockOptions*](../interfaces/types.blockoptions.md) |

**Returns:** [*BlockHeader*](header.blockheader.md)

Defined in: [header.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L117)

___

### genesis

▸ `Static`**genesis**(`headerData?`: [*HeaderData*](../interfaces/types.headerdata.md), `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*BlockHeader*](header.blockheader.md)

Alias for Header.fromHeaderData() with initWithGenesisHeader set to true.

#### Parameters:

Name | Type |
:------ | :------ |
`headerData` | [*HeaderData*](../interfaces/types.headerdata.md) |
`opts?` | [*BlockOptions*](../interfaces/types.blockoptions.md) |

**Returns:** [*BlockHeader*](header.blockheader.md)

Defined in: [header.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L163)
