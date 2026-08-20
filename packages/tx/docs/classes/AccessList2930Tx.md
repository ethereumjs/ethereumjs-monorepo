[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / AccessList2930Tx

# Class: AccessList2930Tx

Defined in: [2930/tx.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L43)

Typed transaction with optional access lists

- TransactionType: 1
- EIP: [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930)

## Implements

- [`TransactionInterface`](../interfaces/TransactionInterface.md)\<*typeof* [`AccessListEIP2930`](../variables/TransactionType.md#accesslisteip2930)\>

## Constructors

### Constructor

> **new AccessList2930Tx**(`txData`, `opts?`): `AccessList2930Tx`

Defined in: [2930/tx.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L85)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the module-level factory functions such as [createAccessList2930Tx](../functions/createAccessList2930Tx.md),
[createAccessList2930TxFromRLP](../functions/createAccessList2930TxFromRLP.md), and [createAccessList2930TxFromBytesArray](../functions/createAccessList2930TxFromBytesArray.md).

#### Parameters

##### txData

[`AccessList2930TxData`](../interfaces/AccessList2930TxData.md)

##### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

#### Returns

`AccessList2930Tx`

## Properties

### accessList

> `readonly` **accessList**: [`AccessListBytes`](../type-aliases/AccessListBytes.md)

Defined in: [2930/tx.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L55)

***

### cache

> `readonly` **cache**: [`TransactionCache`](../interfaces/TransactionCache.md) = `{}`

Defined in: [2930/tx.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L69)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`cache`](../interfaces/TransactionInterface.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: [2930/tx.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L56)

***

### common

> `readonly` **common**: [`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md)

Defined in: [2930/tx.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L65)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`common`](../interfaces/TransactionInterface.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: [2930/tx.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L53)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`data`](../interfaces/TransactionInterface.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [2930/tx.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L51)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`gasLimit`](../interfaces/TransactionInterface.md#gaslimit)

***

### gasPrice

> `readonly` **gasPrice**: `bigint`

Defined in: [2930/tx.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L49)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: [2930/tx.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L50)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`nonce`](../interfaces/TransactionInterface.md#nonce)

***

### r?

> `readonly` `optional` **r?**: `bigint`

Defined in: [2930/tx.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L60)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`r`](../interfaces/TransactionInterface.md#r)

***

### s?

> `readonly` `optional` **s?**: `bigint`

Defined in: [2930/tx.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L61)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`s`](../interfaces/TransactionInterface.md#s)

***

### to?

> `readonly` `optional` **to?**: [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [2930/tx.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L54)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`to`](../interfaces/TransactionInterface.md#to)

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

Defined in: [2930/tx.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L67)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`txOptions`](../interfaces/TransactionInterface.md#txoptions)

***

### type

> **type**: `1` = `TransactionType.AccessListEIP2930`

Defined in: [2930/tx.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L46)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`type`](../interfaces/TransactionInterface.md#type)

***

### v?

> `readonly` `optional` **v?**: `bigint`

Defined in: [2930/tx.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L59)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`v`](../interfaces/TransactionInterface.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: [2930/tx.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L52)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`value`](../interfaces/TransactionInterface.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`): `AccessList2930Tx`

Defined in: [2930/tx.ts:295](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L295)

Adds the provided signature values and returns a new transaction instance.

#### Parameters

##### v

`bigint`

Recovery parameter (y-parity)

##### r

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

`r` component of the signature

##### s

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

`s` component of the signature

#### Returns

`AccessList2930Tx`

New `AccessList2930Tx` with the supplied signature

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`addSignature`](../interfaces/TransactionInterface.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: [2930/tx.ts:386](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L386)

Return a compact error string representation of the object

#### Returns

`string`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`errorStr`](../interfaces/TransactionInterface.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: [2930/tx.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L153)

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getDataGas`](../interfaces/TransactionInterface.md#getdatagas)

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee?`): `bigint`

Defined in: [2930/tx.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L146)

#### Parameters

##### baseFee?

`bigint`

#### Returns

`bigint`

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: [2930/tx.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L257)

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

#### Returns

`Uint8Array`

Keccak hash of the unsigned transaction payload

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getHashedMessageToSign`](../interfaces/TransactionInterface.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: [2930/tx.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L170)

The minimum gas limit which the tx to have to be valid.
This covers costs as the standard fee (21000 gas), the data fee (paid for each calldata byte),
the optional creation fee (if the transaction creates a contract), and if relevant the gas
to be paid for access lists (EIP-2930) and authority lists (EIP-7702).

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getIntrinsicGas`](../interfaces/TransactionInterface.md#getintrinsicgas)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: [2930/tx.ts:245](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L245)

Returns the raw serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

```javascript
const serializedMessage = tx.getMessageToSign() // use this for the HW wallet input
```

#### Returns

`Uint8Array`

Serialized unsigned transaction payload

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMessageToSign`](../interfaces/TransactionInterface.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: [2930/tx.ts:276](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L276)

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

Hash used when verifying the signature

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMessageToVerifySignature`](../interfaces/TransactionInterface.md#getmessagetoverifysignature)

***

### getMinimumGasLimit()

> **getMinimumGasLimit**(): `bigint`

Defined in: [2930/tx.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L178)

`max(getIntrinsicGas(), calldata floor)` when EIP-7623 is active, otherwise intrinsic.
Does not include EIP-8037 first-touch state gas.

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getMinimumGasLimit`](../interfaces/TransactionInterface.md#getminimumgaslimit)

***

### getSenderAddress()

> **getSenderAddress**(): [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [2930/tx.ts:361](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L361)

Returns the signer's address recovered from the signature.

#### Returns

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Sender [Address](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderAddress`](../interfaces/TransactionInterface.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: [2930/tx.ts:284](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L284)

Returns the public key of the sender

#### Returns

`Uint8Array`

Sender public key

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getSenderPublicKey`](../interfaces/TransactionInterface.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: [2930/tx.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L160)

The up front amount that an account must have for this transaction to be valid

#### Returns

`bigint`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getUpfrontCost`](../interfaces/TransactionInterface.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: [2930/tx.ts:338](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L338)

Runs transaction validation and returns any discovered errors.

#### Returns

`string`[]

Array of validation error messages

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`getValidationErrors`](../interfaces/TransactionInterface.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [2930/tx.ts:268](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L268)

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [AccessList2930Tx.getMessageToSign](#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

Hash of the serialized signed transaction

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`hash`](../interfaces/TransactionInterface.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: [2930/tx.ts:379](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L379)

Reports whether the transaction already contains signature values.

#### Returns

`boolean`

true if signature parts are present

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isSigned`](../interfaces/TransactionInterface.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: [2930/tx.ts:345](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L345)

#### Returns

`boolean`

true if the transaction has no validation errors

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`isValid`](../interfaces/TransactionInterface.md#isvalid)

***

### raw()

> **raw**(): `AccessList2930TxValuesArray`

Defined in: [2930/tx.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L203)

Returns a Uint8Array Array of the raw Bytes of the EIP-2930 transaction, in order.

Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)]`

Use [AccessList2930Tx.serialize](#serialize) to add a transaction to a block
with [@ethereumjs/block!createBlockFromBytesArray](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/docs/functions/createBlockFromBytesArray.md).

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [AccessList2930Tx.getMessageToSign](#getmessagetosign).

#### Returns

`AccessList2930TxValuesArray`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`raw`](../interfaces/TransactionInterface.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [2930/tx.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L229)

Returns the serialized encoding of the EIP-2930 transaction.

Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)])`

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Uint8Array`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`serialize`](../interfaces/TransactionInterface.md#serialize)

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): `AccessList2930Tx`

Defined in: [2930/tx.ts:371](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L371)

Signs the transaction with the provided private key and returns a new instance.

#### Parameters

##### privateKey

`Uint8Array`

32-byte private key

##### extraEntropy?

`boolean` \| `Uint8Array`\<`ArrayBufferLike`\>

Optional entropy fed into the signing algorithm

#### Returns

`AccessList2930Tx`

Newly signed transaction

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`sign`](../interfaces/TransactionInterface.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: [2930/tx.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L142)

Checks if a tx type defining capability is active
on a tx, for example the EIP-1559 fee market mechanism
or the EIP-2930 access list feature.

Note that this is different from the tx type itself,
so EIP-2930 access lists can very well be active
on an EIP-1559 tx for example.

This method can be useful for feature checks if the
tx type is unknown (e.g. when instantiated with
the tx factory).

See `Capabilities` in the `types` module for a reference
on all supported capabilities.

#### Parameters

##### capability

`number`

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`supports`](../interfaces/TransactionInterface.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: [2930/tx.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L186)

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toCreationAddress`](../interfaces/TransactionInterface.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](../interfaces/JSONTx.md)

Defined in: [2930/tx.ts:322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L322)

Returns an object with the JSON representation of the transaction

#### Returns

[`JSONTx`](../interfaces/JSONTx.md)

JSON encoding of the transaction

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`toJSON`](../interfaces/TransactionInterface.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: [2930/tx.ts:353](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/tx.ts#L353)

Checks whether the signature currently attached to the transaction is valid.

#### Returns

`boolean`

true if signature verification succeeds

#### Implementation of

[`TransactionInterface`](../interfaces/TransactionInterface.md).[`verifySignature`](../interfaces/TransactionInterface.md#verifysignature)
