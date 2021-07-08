[@ethereumjs/tx](../README.md) / [baseTransaction](../modules/basetransaction.md) / BaseTransaction

# Class: BaseTransaction<TransactionObject\>

[baseTransaction](../modules/basetransaction.md).BaseTransaction

This base class will likely be subject to further
refactoring along the introduction of additional tx types
on the Ethereum network.

It is therefore not recommended to use directly.

## Type parameters

| Name |
| :------ |
| `TransactionObject` |

## Hierarchy

- **BaseTransaction**

  ↳ [default](eip1559transaction.default.md)

  ↳ [default](eip2930transaction.default.md)

  ↳ [default](legacytransaction.default.md)

## Table of contents

### Constructors

- [constructor](basetransaction.basetransaction-1.md#constructor)

### Properties

- [common](basetransaction.basetransaction-1.md#common)
- [data](basetransaction.basetransaction-1.md#data)
- [gasLimit](basetransaction.basetransaction-1.md#gaslimit)
- [nonce](basetransaction.basetransaction-1.md#nonce)
- [r](basetransaction.basetransaction-1.md#r)
- [s](basetransaction.basetransaction-1.md#s)
- [to](basetransaction.basetransaction-1.md#to)
- [v](basetransaction.basetransaction-1.md#v)
- [value](basetransaction.basetransaction-1.md#value)

### Accessors

- [transactionType](basetransaction.basetransaction-1.md#transactiontype)
- [type](basetransaction.basetransaction-1.md#type)

### Methods

- [getBaseFee](basetransaction.basetransaction-1.md#getbasefee)
- [getDataFee](basetransaction.basetransaction-1.md#getdatafee)
- [getMessageToSign](basetransaction.basetransaction-1.md#getmessagetosign)
- [getMessageToVerifySignature](basetransaction.basetransaction-1.md#getmessagetoverifysignature)
- [getSenderAddress](basetransaction.basetransaction-1.md#getsenderaddress)
- [getSenderPublicKey](basetransaction.basetransaction-1.md#getsenderpublickey)
- [getUpfrontCost](basetransaction.basetransaction-1.md#getupfrontcost)
- [hash](basetransaction.basetransaction-1.md#hash)
- [isSigned](basetransaction.basetransaction-1.md#issigned)
- [raw](basetransaction.basetransaction-1.md#raw)
- [serialize](basetransaction.basetransaction-1.md#serialize)
- [sign](basetransaction.basetransaction-1.md#sign)
- [supports](basetransaction.basetransaction-1.md#supports)
- [toCreationAddress](basetransaction.basetransaction-1.md#tocreationaddress)
- [toJSON](basetransaction.basetransaction-1.md#tojson)
- [validate](basetransaction.basetransaction-1.md#validate)
- [verifySignature](basetransaction.basetransaction-1.md#verifysignature)

## Constructors

### constructor

• **new BaseTransaction**<TransactionObject\>(`txData`)

#### Type parameters

| Name |
| :------ |
| `TransactionObject` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | [TxData](../modules/types.md#txdata) \| [AccessListEIP2930TxData](../interfaces/types.accesslisteip2930txdata.md) \| [FeeMarketEIP1559TxData](../interfaces/types.feemarketeip1559txdata.md) |

#### Defined in

[baseTransaction.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L69)

## Properties

### common

• `Readonly` **common**: `default`

#### Defined in

[baseTransaction.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L44)

___

### data

• `Readonly` **data**: `Buffer`

#### Defined in

[baseTransaction.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L38)

___

### gasLimit

• `Readonly` **gasLimit**: `BN`

#### Defined in

[baseTransaction.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L35)

___

### nonce

• `Readonly` **nonce**: `BN`

#### Defined in

[baseTransaction.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L34)

___

### r

• `Optional` `Readonly` **r**: `BN`

#### Defined in

[baseTransaction.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L41)

___

### s

• `Optional` `Readonly` **s**: `BN`

#### Defined in

[baseTransaction.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L42)

___

### to

• `Optional` `Readonly` **to**: `Address`

#### Defined in

[baseTransaction.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L36)

___

### v

• `Optional` `Readonly` **v**: `BN`

#### Defined in

[baseTransaction.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L40)

___

### value

• `Readonly` **value**: `BN`

#### Defined in

[baseTransaction.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L37)

## Accessors

### transactionType

• `get` **transactionType**(): `number`

Alias for [BaseTransaction.type](basetransaction.basetransaction-1.md#type)

**`deprecated`** Use `type` instead

#### Returns

`number`

#### Defined in

[baseTransaction.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L104)

___

### type

• `get` **type**(): `number`

Returns the transaction type.

Note: legacy txs will return tx type `0`.

#### Returns

`number`

#### Defined in

[baseTransaction.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L113)

## Methods

### getBaseFee

▸ **getBaseFee**(): `BN`

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

#### Returns

`BN`

#### Defined in

[baseTransaction.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L161)

___

### getDataFee

▸ **getDataFee**(): `BN`

The amount of gas paid for the data in this tx

#### Returns

`BN`

#### Defined in

[baseTransaction.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L172)

___

### getMessageToSign

▸ `Abstract` **getMessageToSign**(`hashMessage`): `Buffer` \| `Buffer`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `hashMessage` | ``false`` |

#### Returns

`Buffer` \| `Buffer`[]

#### Defined in

[baseTransaction.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L209)

▸ `Abstract` **getMessageToSign**(`hashMessage?`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `hashMessage?` | ``true`` |

#### Returns

`Buffer`

#### Defined in

[baseTransaction.ts:210](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L210)

___

### getMessageToVerifySignature

▸ `Abstract` **getMessageToVerifySignature**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[baseTransaction.ts:214](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L214)

___

### getSenderAddress

▸ **getSenderAddress**(): `Address`

Returns the sender's address

#### Returns

`Address`

#### Defined in

[baseTransaction.ts:249](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L249)

___

### getSenderPublicKey

▸ `Abstract` **getSenderPublicKey**(): `Buffer`

Returns the public key of the sender

#### Returns

`Buffer`

#### Defined in

[baseTransaction.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L256)

___

### getUpfrontCost

▸ `Abstract` **getUpfrontCost**(): `BN`

The up front amount that an account must have for this transaction to be valid

#### Returns

`BN`

#### Defined in

[baseTransaction.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L186)

___

### hash

▸ `Abstract` **hash**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[baseTransaction.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L212)

___

### isSigned

▸ **isSigned**(): `boolean`

#### Returns

`boolean`

#### Defined in

[baseTransaction.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L216)

___

### raw

▸ `Abstract` **raw**(): [TxValuesArray](../modules/types.md#txvaluesarray) \| [AccessListEIP2930ValuesArray](../modules/types.md#accesslisteip2930valuesarray) \| [FeeMarketEIP1559ValuesArray](../modules/types.md#feemarketeip1559valuesarray)

Returns a Buffer Array of the raw Buffers of this transaction, in order.

#### Returns

[TxValuesArray](../modules/types.md#txvaluesarray) \| [AccessListEIP2930ValuesArray](../modules/types.md#accesslisteip2930valuesarray) \| [FeeMarketEIP1559ValuesArray](../modules/types.md#feemarketeip1559valuesarray)

#### Defined in

[baseTransaction.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L198)

___

### serialize

▸ `Abstract` **serialize**(): `Buffer`

Returns the encoding of the transaction.

#### Returns

`Buffer`

#### Defined in

[baseTransaction.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L203)

___

### sign

▸ **sign**(`privateKey`): `TransactionObject`

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

`TransactionObject`

#### Defined in

[baseTransaction.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L267)

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
| `capability` | [Capabilities](../enums/types.capabilities.md) |

#### Returns

`boolean`

#### Defined in

[baseTransaction.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L133)

___

### toCreationAddress

▸ **toCreationAddress**(): `boolean`

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Defined in

[baseTransaction.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L191)

___

### toJSON

▸ `Abstract` **toJSON**(): [JsonTx](../interfaces/types.jsontx.md)

Returns an object with the JSON representation of the transaction

#### Returns

[JsonTx](../interfaces/types.jsontx.md)

#### Defined in

[baseTransaction.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L304)

___

### validate

▸ **validate**(): `boolean`

Checks if the transaction has the minimum amount of gas required
(DataFee + TxFee + Creation Fee).

#### Returns

`boolean`

#### Defined in

[baseTransaction.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L141)

▸ **validate**(`stringError`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``false`` |

#### Returns

`boolean`

#### Defined in

[baseTransaction.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L142)

▸ **validate**(`stringError`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``true`` |

#### Returns

`string`[]

#### Defined in

[baseTransaction.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L143)

___

### verifySignature

▸ **verifySignature**(): `boolean`

Determines if the signature is valid

#### Returns

`boolean`

#### Defined in

[baseTransaction.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L236)
