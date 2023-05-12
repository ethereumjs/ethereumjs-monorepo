[@ethereumjs/tx](../README.md) / FeeMarketEIP1559Transaction

# Class: FeeMarketEIP1559Transaction

Typed transaction with a new gas fee market mechanism

- TransactionType: 2
- EIP: [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)

## Hierarchy

- `BaseTransaction`<[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)\>

  ↳ **`FeeMarketEIP1559Transaction`**

## Table of contents

### Constructors

- [constructor](FeeMarketEIP1559Transaction.md#constructor)

### Properties

- [AccessListJSON](FeeMarketEIP1559Transaction.md#accesslistjson)
- [accessList](FeeMarketEIP1559Transaction.md#accesslist)
- [chainId](FeeMarketEIP1559Transaction.md#chainid)
- [common](FeeMarketEIP1559Transaction.md#common)
- [data](FeeMarketEIP1559Transaction.md#data)
- [gasLimit](FeeMarketEIP1559Transaction.md#gaslimit)
- [maxFeePerGas](FeeMarketEIP1559Transaction.md#maxfeepergas)
- [maxPriorityFeePerGas](FeeMarketEIP1559Transaction.md#maxpriorityfeepergas)
- [nonce](FeeMarketEIP1559Transaction.md#nonce)
- [r](FeeMarketEIP1559Transaction.md#r)
- [s](FeeMarketEIP1559Transaction.md#s)
- [to](FeeMarketEIP1559Transaction.md#to)
- [v](FeeMarketEIP1559Transaction.md#v)
- [value](FeeMarketEIP1559Transaction.md#value)

### Accessors

- [type](FeeMarketEIP1559Transaction.md#type)

### Methods

- [\_processSignature](FeeMarketEIP1559Transaction.md#_processsignature)
- [errorStr](FeeMarketEIP1559Transaction.md#errorstr)
- [getBaseFee](FeeMarketEIP1559Transaction.md#getbasefee)
- [getDataFee](FeeMarketEIP1559Transaction.md#getdatafee)
- [getMessageToSign](FeeMarketEIP1559Transaction.md#getmessagetosign)
- [getMessageToVerifySignature](FeeMarketEIP1559Transaction.md#getmessagetoverifysignature)
- [getSenderAddress](FeeMarketEIP1559Transaction.md#getsenderaddress)
- [getSenderPublicKey](FeeMarketEIP1559Transaction.md#getsenderpublickey)
- [getUpfrontCost](FeeMarketEIP1559Transaction.md#getupfrontcost)
- [hash](FeeMarketEIP1559Transaction.md#hash)
- [isSigned](FeeMarketEIP1559Transaction.md#issigned)
- [raw](FeeMarketEIP1559Transaction.md#raw)
- [serialize](FeeMarketEIP1559Transaction.md#serialize)
- [sign](FeeMarketEIP1559Transaction.md#sign)
- [supports](FeeMarketEIP1559Transaction.md#supports)
- [toCreationAddress](FeeMarketEIP1559Transaction.md#tocreationaddress)
- [toJSON](FeeMarketEIP1559Transaction.md#tojson)
- [validate](FeeMarketEIP1559Transaction.md#validate)
- [verifySignature](FeeMarketEIP1559Transaction.md#verifysignature)
- [fromSerializedTx](FeeMarketEIP1559Transaction.md#fromserializedtx)
- [fromTxData](FeeMarketEIP1559Transaction.md#fromtxdata)
- [fromValuesArray](FeeMarketEIP1559Transaction.md#fromvaluesarray)

## Constructors

### constructor

• **new FeeMarketEIP1559Transaction**(`txData`, `opts?`)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [`FeeMarketEIP1559TxData`](../interfaces/FeeMarketEIP1559TxData.md) |
| `opts` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Overrides

BaseTransaction&lt;FeeMarketEIP1559Transaction\&gt;.constructor

#### Defined in

[eip1559Transaction.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L149)

## Properties

### AccessListJSON

• `Readonly` **AccessListJSON**: [`AccessList`](../README.md#accesslist)

#### Defined in

[eip1559Transaction.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L40)

___

### accessList

• `Readonly` **accessList**: [`AccessListBuffer`](../README.md#accesslistbuffer)

#### Defined in

[eip1559Transaction.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L39)

___

### chainId

• `Readonly` **chainId**: `bigint`

#### Defined in

[eip1559Transaction.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L38)

___

### common

• `Readonly` **common**: `Common`

#### Overrides

BaseTransaction.common

#### Defined in

[eip1559Transaction.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L44)

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

### maxFeePerGas

• `Readonly` **maxFeePerGas**: `bigint`

#### Defined in

[eip1559Transaction.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L42)

___

### maxPriorityFeePerGas

• `Readonly` **maxPriorityFeePerGas**: `bigint`

#### Defined in

[eip1559Transaction.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L41)

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

▸ **_processSignature**(`v`, `r`, `s`): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `bigint` |
| `r` | `Buffer` |
| `s` | `Buffer` |

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Overrides

BaseTransaction.\_processSignature

#### Defined in

[eip1559Transaction.ts:364](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L364)

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Overrides

BaseTransaction.errorStr

#### Defined in

[eip1559Transaction.ts:411](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L411)

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

#### Overrides

BaseTransaction.getDataFee

#### Defined in

[eip1559Transaction.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L204)

___

### getMessageToSign

▸ **getMessageToSign**(`hashMessage?`): `Buffer`

Returns the serialized unsigned tx (hashed or raw), which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

```javascript
const serializedMessage = tx.getMessageToSign(false) // use this for the HW wallet input
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `hashMessage` | `boolean` | `true` | Return hashed message if set to true (default: true) |

#### Returns

`Buffer`

#### Overrides

BaseTransaction.getMessageToSign

#### Defined in

[eip1559Transaction.ts:295](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L295)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Buffer`

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Buffer`

#### Overrides

BaseTransaction.getMessageToVerifySignature

#### Defined in

[eip1559Transaction.ts:333](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L333)

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

[eip1559Transaction.ts:340](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L340)

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

[eip1559Transaction.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L226)

___

### hash

▸ **hash**(): `Buffer`

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [getMessageToSign](FeeMarketEIP1559Transaction.md#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Buffer`

#### Overrides

BaseTransaction.hash

#### Defined in

[eip1559Transaction.ts:314](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L314)

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

### raw

▸ **raw**(): [`FeeMarketEIP1559ValuesArray`](../README.md#feemarketeip1559valuesarray)

Returns a Buffer Array of the raw Buffers of the EIP-1559 transaction, in order.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

Use [serialize](FeeMarketEIP1559Transaction.md#serialize) to add a transaction to a block
with Block.fromValuesArray.

For an unsigned tx this method uses the empty Buffer values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [getMessageToSign](FeeMarketEIP1559Transaction.md#getmessagetosign).

#### Returns

[`FeeMarketEIP1559ValuesArray`](../README.md#feemarketeip1559valuesarray)

#### Overrides

BaseTransaction.raw

#### Defined in

[eip1559Transaction.ts:247](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L247)

___

### serialize

▸ **serialize**(): `Buffer`

Returns the serialized encoding of the EIP-1559 transaction.

Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS])`

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Buffer`

#### Overrides

BaseTransaction.serialize

#### Defined in

[eip1559Transaction.ts:274](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L274)

___

### sign

▸ **sign**(`privateKey`): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

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

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

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

Returns an object with the JSON representation of the transaction

#### Returns

[`JsonTx`](../interfaces/JsonTx.md)

#### Overrides

BaseTransaction.toJSON

#### Defined in

[eip1559Transaction.ts:389](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L389)

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

### fromSerializedTx

▸ `Static` **fromSerializedTx**(`serialized`, `opts?`): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

Instantiate a transaction from the serialized tx.

Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS])`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Buffer` |
| `opts` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Defined in

[eip1559Transaction.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L74)

___

### fromTxData

▸ `Static` **fromTxData**(`txData`, `opts?`): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

Instantiate a transaction from a data dictionary.

Format: { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, v, r, s }

Notes:
- `chainId` will be set automatically if not provided
- All parameters are optional and have some basic default values

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [`FeeMarketEIP1559TxData`](../interfaces/FeeMarketEIP1559TxData.md) |
| `opts` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Defined in

[eip1559Transaction.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L64)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`values`, `opts?`): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

Create a transaction from a values array.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | [`FeeMarketEIP1559ValuesArray`](../README.md#feemarketeip1559valuesarray) |
| `opts` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Defined in

[eip1559Transaction.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts#L98)
