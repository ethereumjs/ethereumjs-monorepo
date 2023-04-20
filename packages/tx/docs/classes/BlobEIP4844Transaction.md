[@ethereumjs/tx](../README.md) / BlobEIP4844Transaction

# Class: BlobEIP4844Transaction

Typed transaction with a new gas fee market mechanism for transactions that include "blobs" of data

- TransactionType: 5
- EIP: [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844)

## Hierarchy

- `BaseTransaction`<[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)\>

  ↳ **`BlobEIP4844Transaction`**

## Table of contents

### Constructors

- [constructor](BlobEIP4844Transaction.md#constructor)

### Properties

- [AccessListJSON](BlobEIP4844Transaction.md#accesslistjson)
- [accessList](BlobEIP4844Transaction.md#accesslist)
- [aggregateKzgProof](BlobEIP4844Transaction.md#aggregatekzgproof)
- [blobs](BlobEIP4844Transaction.md#blobs)
- [chainId](BlobEIP4844Transaction.md#chainid)
- [common](BlobEIP4844Transaction.md#common)
- [data](BlobEIP4844Transaction.md#data)
- [gasLimit](BlobEIP4844Transaction.md#gaslimit)
- [kzgCommitments](BlobEIP4844Transaction.md#kzgcommitments)
- [maxFeePerDataGas](BlobEIP4844Transaction.md#maxfeeperdatagas)
- [maxFeePerGas](BlobEIP4844Transaction.md#maxfeepergas)
- [maxPriorityFeePerGas](BlobEIP4844Transaction.md#maxpriorityfeepergas)
- [nonce](BlobEIP4844Transaction.md#nonce)
- [r](BlobEIP4844Transaction.md#r)
- [s](BlobEIP4844Transaction.md#s)
- [to](BlobEIP4844Transaction.md#to)
- [v](BlobEIP4844Transaction.md#v)
- [value](BlobEIP4844Transaction.md#value)
- [versionedHashes](BlobEIP4844Transaction.md#versionedhashes)

### Accessors

- [type](BlobEIP4844Transaction.md#type)

### Methods

- [\_processSignature](BlobEIP4844Transaction.md#_processsignature)
- [errorStr](BlobEIP4844Transaction.md#errorstr)
- [getBaseFee](BlobEIP4844Transaction.md#getbasefee)
- [getDataFee](BlobEIP4844Transaction.md#getdatafee)
- [getMessageToSign](BlobEIP4844Transaction.md#getmessagetosign)
- [getMessageToVerifySignature](BlobEIP4844Transaction.md#getmessagetoverifysignature)
- [getSenderAddress](BlobEIP4844Transaction.md#getsenderaddress)
- [getSenderPublicKey](BlobEIP4844Transaction.md#getsenderpublickey)
- [getUpfrontCost](BlobEIP4844Transaction.md#getupfrontcost)
- [hash](BlobEIP4844Transaction.md#hash)
- [isSigned](BlobEIP4844Transaction.md#issigned)
- [numBlobs](BlobEIP4844Transaction.md#numblobs)
- [raw](BlobEIP4844Transaction.md#raw)
- [serialize](BlobEIP4844Transaction.md#serialize)
- [serializeNetworkWrapper](BlobEIP4844Transaction.md#serializenetworkwrapper)
- [sign](BlobEIP4844Transaction.md#sign)
- [supports](BlobEIP4844Transaction.md#supports)
- [toCreationAddress](BlobEIP4844Transaction.md#tocreationaddress)
- [toJSON](BlobEIP4844Transaction.md#tojson)
- [toValue](BlobEIP4844Transaction.md#tovalue)
- [unsignedHash](BlobEIP4844Transaction.md#unsignedhash)
- [validate](BlobEIP4844Transaction.md#validate)
- [verifySignature](BlobEIP4844Transaction.md#verifysignature)
- [fromSerializedBlobTxNetworkWrapper](BlobEIP4844Transaction.md#fromserializedblobtxnetworkwrapper)
- [fromSerializedTx](BlobEIP4844Transaction.md#fromserializedtx)
- [fromTxData](BlobEIP4844Transaction.md#fromtxdata)
- [minimalFromNetworkWrapper](BlobEIP4844Transaction.md#minimalfromnetworkwrapper)

## Constructors

### constructor

• **new BlobEIP4844Transaction**(`txData`, `opts?`)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static constructors or factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [`BlobEIP4844TxData`](../interfaces/BlobEIP4844TxData.md) |
| `opts` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Overrides

BaseTransaction&lt;BlobEIP4844Transaction\&gt;.constructor

#### Defined in

[eip4844Transaction.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L91)

## Properties

### AccessListJSON

• `Readonly` **AccessListJSON**: [`AccessList`](../README.md#accesslist)

#### Defined in

[eip4844Transaction.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L73)

___

### accessList

• `Readonly` **accessList**: [`AccessListBuffer`](../README.md#accesslistbuffer)

#### Defined in

[eip4844Transaction.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L72)

___

### aggregateKzgProof

• `Optional` **aggregateKzgProof**: `Buffer`

#### Defined in

[eip4844Transaction.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L82)

___

### blobs

• `Optional` **blobs**: `Buffer`[]

#### Defined in

[eip4844Transaction.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L80)

___

### chainId

• `Readonly` **chainId**: `bigint`

#### Defined in

[eip4844Transaction.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L71)

___

### common

• `Readonly` **common**: `Common`

#### Overrides

BaseTransaction.common

#### Defined in

[eip4844Transaction.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L78)

___

### data

• `Readonly` **data**: `Buffer`

#### Inherited from

BaseTransaction.data

#### Defined in

[baseTransaction.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L52)

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Inherited from

BaseTransaction.gasLimit

#### Defined in

[baseTransaction.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L49)

___

### kzgCommitments

• `Optional` **kzgCommitments**: `Buffer`[]

#### Defined in

[eip4844Transaction.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L81)

___

### maxFeePerDataGas

• `Readonly` **maxFeePerDataGas**: `bigint`

#### Defined in

[eip4844Transaction.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L76)

___

### maxFeePerGas

• `Readonly` **maxFeePerGas**: `bigint`

#### Defined in

[eip4844Transaction.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L75)

___

### maxPriorityFeePerGas

• `Readonly` **maxPriorityFeePerGas**: `bigint`

#### Defined in

[eip4844Transaction.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L74)

___

### nonce

• `Readonly` **nonce**: `bigint`

#### Inherited from

BaseTransaction.nonce

#### Defined in

[baseTransaction.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L48)

___

### r

• `Optional` `Readonly` **r**: `bigint`

#### Inherited from

BaseTransaction.r

#### Defined in

[baseTransaction.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L55)

___

### s

• `Optional` `Readonly` **s**: `bigint`

#### Inherited from

BaseTransaction.s

#### Defined in

[baseTransaction.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L56)

___

### to

• `Optional` `Readonly` **to**: `Address`

#### Inherited from

BaseTransaction.to

#### Defined in

[baseTransaction.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L50)

___

### v

• `Optional` `Readonly` **v**: `bigint`

#### Inherited from

BaseTransaction.v

#### Defined in

[baseTransaction.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L54)

___

### value

• `Readonly` **value**: `bigint`

#### Inherited from

BaseTransaction.value

#### Defined in

[baseTransaction.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L51)

___

### versionedHashes

• **versionedHashes**: `Buffer`[]

#### Defined in

[eip4844Transaction.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L79)

## Accessors

### type

• `get` **type**(): `number`

Returns the transaction type.

Note: legacy txs will return tx type `0`.

#### Returns

`number`

#### Inherited from

BaseTransaction.type

#### Defined in

[baseTransaction.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L134)

## Methods

### \_processSignature

▸ **_processSignature**(`v`, `r`, `s`): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `bigint` |
| `r` | `Buffer` |
| `s` | `Buffer` |

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Overrides

BaseTransaction.\_processSignature

#### Defined in

[eip4844Transaction.ts:446](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L446)

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Overrides

BaseTransaction.errorStr

#### Defined in

[eip4844Transaction.ts:475](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L475)

___

### getBaseFee

▸ **getBaseFee**(): `bigint`

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

#### Returns

`bigint`

#### Inherited from

BaseTransaction.getBaseFee

#### Defined in

[baseTransaction.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L204)

___

### getDataFee

▸ **getDataFee**(): `bigint`

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Inherited from

BaseTransaction.getDataFee

#### Defined in

[baseTransaction.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L218)

___

### getMessageToSign

▸ **getMessageToSign**(`hashMessage`): `Buffer` \| `Buffer`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `hashMessage` | ``false`` |

#### Returns

`Buffer` \| `Buffer`[]

#### Overrides

BaseTransaction.getMessageToSign

#### Defined in

[eip4844Transaction.ts:377](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L377)

▸ **getMessageToSign**(`hashMessage?`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `hashMessage?` | ``true`` |

#### Returns

`Buffer`

#### Overrides

BaseTransaction.getMessageToSign

#### Defined in

[eip4844Transaction.ts:378](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L378)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Buffer`

#### Returns

`Buffer`

#### Overrides

BaseTransaction.getMessageToVerifySignature

#### Defined in

[eip4844Transaction.ts:395](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L395)

___

### getSenderAddress

▸ **getSenderAddress**(): `Address`

Returns the sender's address

#### Returns

`Address`

#### Inherited from

BaseTransaction.getSenderAddress

#### Defined in

[baseTransaction.ts:301](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L301)

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Buffer`

Returns the public key of the sender

#### Returns

`Buffer`

#### Overrides

BaseTransaction.getSenderPublicKey

#### Defined in

[eip4844Transaction.ts:402](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L402)

___

### getUpfrontCost

▸ **getUpfrontCost**(`baseFee?`): `bigint`

The up front amount that an account must have for this transaction to be valid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseFee` | `bigint` | The base fee of the block (will be set to 0 if not provided) |

#### Returns

`bigint`

#### Overrides

BaseTransaction.getUpfrontCost

#### Defined in

[eip4844Transaction.ts:294](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L294)

___

### hash

▸ **hash**(): `Buffer`

#### Returns

`Buffer`

#### Overrides

BaseTransaction.hash

#### Defined in

[eip4844Transaction.ts:391](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L391)

___

### isSigned

▸ **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

BaseTransaction.isSigned

#### Defined in

[baseTransaction.ts:276](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L276)

___

### numBlobs

▸ **numBlobs**(): `number`

#### Returns

`number`

the number of blobs included with this transaction

#### Defined in

[eip4844Transaction.ts:494](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L494)

___

### raw

▸ **raw**(): [`TxValuesArray`](../README.md#txvaluesarray)

This method is not implemented for blob transactions as the `raw` method is used exclusively with
rlp encoding and these transactions use SSZ for serialization.

#### Returns

[`TxValuesArray`](../README.md#txvaluesarray)

#### Overrides

BaseTransaction.raw

#### Defined in

[eip4844Transaction.ts:306](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L306)

___

### serialize

▸ **serialize**(): `Buffer`

Serialize a blob transaction to the execution payload variant

#### Returns

`Buffer`

the minimum (execution payload) serialization of a signed transaction

#### Overrides

BaseTransaction.serialize

#### Defined in

[eip4844Transaction.ts:344](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L344)

___

### serializeNetworkWrapper

▸ **serializeNetworkWrapper**(): `Buffer`

#### Returns

`Buffer`

the serialized form of a blob transaction in the network wrapper format (used for gossipping mempool transactions over devp2p)

#### Defined in

[eip4844Transaction.ts:352](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L352)

___

### sign

▸ **sign**(`privateKey`): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Signs a transaction.

Note that the signed tx is returned as a new object,
use as follows:
```javascript
const signedTx = tx.sign(privateKey)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Buffer` |

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Inherited from

BaseTransaction.sign

#### Defined in

[baseTransaction.ts:319](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L319)

___

### supports

▸ **supports**(`capability`): `boolean`

Checks if a tx type defining capability is active
on a tx, for example the EIP-1559 fee market mechanism
or the EIP-2930 access list feature.

Note that this is different from the tx type itself,
so EIP-2930 access lists can very well be active
on an EIP-1559 tx for example.

This method can be useful for feature checks if the
tx type is unknown (e.g. when instantiated with
the tx factory).

See `Capabilites` in the `types` module for a reference
on all supported capabilities.

#### Parameters

| Name | Type |
| :------ | :------ |
| `capability` | [`Capability`](../enums/Capability.md) |

#### Returns

`boolean`

#### Inherited from

BaseTransaction.supports

#### Defined in

[baseTransaction.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L154)

___

### toCreationAddress

▸ **toCreationAddress**(): `boolean`

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

BaseTransaction.toCreationAddress

#### Defined in

[baseTransaction.ts:244](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L244)

___

### toJSON

▸ **toJSON**(): [`JsonTx`](../interfaces/JsonTx.md)

#### Returns

[`JsonTx`](../interfaces/JsonTx.md)

#### Overrides

BaseTransaction.toJSON

#### Defined in

[eip4844Transaction.ts:426](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L426)

___

### toValue

▸ **toValue**(): `ValueOfFields`<{ `message`: `ContainerType`<{ `accessList`: `ListCompositeType`<`ContainerType`<{ `address`: `ByteVectorType` = AddressType; `storageKeys`: `ListCompositeType`<`ByteVectorType`\>  }\>\> ; `blobVersionedHashes`: `ListCompositeType`<`ByteVectorType`\> ; `chainId`: `UintBigintType` = Uint256; `data`: `ByteListType` ; `gas`: `UintBigintType` = Uint64; `maxFeePerDataGas`: `UintBigintType` = Uint256; `maxFeePerGas`: `UintBigintType` = Uint256; `maxPriorityFeePerGas`: `UintBigintType` = Uint256; `nonce`: `UintBigintType` = Uint64; `to`: `UnionType`<(`ByteVectorType` \| `NoneType`)[]\> ; `value`: `UintBigintType` = Uint256 }\> = BlobTransactionType; `signature`: `ContainerType`<{ `r`: `UintBigintType` = Uint256; `s`: `UintBigintType` = Uint256; `yParity`: `BooleanType`  }\> = ECDSASignatureType }\>

#### Returns

`ValueOfFields`<{ `message`: `ContainerType`<{ `accessList`: `ListCompositeType`<`ContainerType`<{ `address`: `ByteVectorType` = AddressType; `storageKeys`: `ListCompositeType`<`ByteVectorType`\>  }\>\> ; `blobVersionedHashes`: `ListCompositeType`<`ByteVectorType`\> ; `chainId`: `UintBigintType` = Uint256; `data`: `ByteListType` ; `gas`: `UintBigintType` = Uint64; `maxFeePerDataGas`: `UintBigintType` = Uint256; `maxFeePerGas`: `UintBigintType` = Uint256; `maxPriorityFeePerGas`: `UintBigintType` = Uint256; `nonce`: `UintBigintType` = Uint64; `to`: `UnionType`<(`ByteVectorType` \| `NoneType`)[]\> ; `value`: `UintBigintType` = Uint256 }\> = BlobTransactionType; `signature`: `ContainerType`<{ `r`: `UintBigintType` = Uint256; `s`: `UintBigintType` = Uint256; `yParity`: `BooleanType`  }\> = ECDSASignatureType }\>

#### Defined in

[eip4844Transaction.ts:310](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L310)

___

### unsignedHash

▸ **unsignedHash**(): `Buffer`

Returns the hash of a blob transaction

#### Returns

`Buffer`

#### Defined in

[eip4844Transaction.ts:386](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L386)

___

### validate

▸ **validate**(): `boolean`

Checks if the transaction has the minimum amount of gas required
(DataFee + TxFee + Creation Fee).

#### Returns

`boolean`

#### Inherited from

BaseTransaction.validate

#### Defined in

[baseTransaction.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L162)

▸ **validate**(`stringError`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``false`` |

#### Returns

`boolean`

#### Inherited from

BaseTransaction.validate

#### Defined in

[baseTransaction.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L163)

▸ **validate**(`stringError`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``true`` |

#### Returns

`string`[]

#### Inherited from

BaseTransaction.validate

#### Defined in

[baseTransaction.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L164)

___

### verifySignature

▸ **verifySignature**(): `boolean`

Determines if the signature is valid

#### Returns

`boolean`

#### Inherited from

BaseTransaction.verifySignature

#### Defined in

[baseTransaction.ts:288](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L288)

___

### fromSerializedBlobTxNetworkWrapper

▸ `Static` **fromSerializedBlobTxNetworkWrapper**(`serialized`, `opts?`): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Creates a transaction from the network encoding of a blob transaction (with blobs/commitments/proof)

**`Throws`**

if no KZG library is loaded -- using the `initKzg` helper method -- or if `opts.common` not provided

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serialized` | `Buffer` | a buffer representing a serialized BlobTransactionNetworkWrapper |
| `opts?` | [`TxOptions`](../interfaces/TxOptions.md) | any TxOptions defined |

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

a BlobEIP4844Transaction

#### Defined in

[eip4844Transaction.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L201)

___

### fromSerializedTx

▸ `Static` **fromSerializedTx**(`serialized`, `opts?`): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Creates a transaction from the "minimal" encoding of a blob transaction (without blobs/commitments/kzg proof)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serialized` | `Buffer` | a buffer representing a serialized signed blob transaction |
| `opts?` | [`TxOptions`](../interfaces/TxOptions.md) | any TxOptions defined |

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

a BlobEIP4844Transaction

#### Defined in

[eip4844Transaction.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L262)

___

### fromTxData

▸ `Static` **fromTxData**(`txData`, `opts?`): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [`BlobEIP4844TxData`](../interfaces/BlobEIP4844TxData.md) |
| `opts?` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Defined in

[eip4844Transaction.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L172)

___

### minimalFromNetworkWrapper

▸ `Static` **minimalFromNetworkWrapper**(`txData`, `opts?`): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Creates the minimal representation of a blob transaction from the network wrapper version.
The minimal representation is used when adding transactions to an execution payload/block

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txData` | [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md) | a [BlobEIP4844Transaction](BlobEIP4844Transaction.md) containing optional blobs/kzg commitments |
| `opts?` | [`TxOptions`](../interfaces/TxOptions.md) | dictionary of [TxOptions](../interfaces/TxOptions.md) |

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

the "minimal" representation of a BlobEIP4844Transaction (i.e. transaction object minus blobs and kzg commitments)

#### Defined in

[eip4844Transaction.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip4844Transaction.ts#L183)
