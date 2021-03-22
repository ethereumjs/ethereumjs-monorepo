[@ethereumjs/tx](../README.md) › ["baseTransaction"](../modules/_basetransaction_.md) › [BaseTransaction](_basetransaction_.basetransaction.md)

# Class: BaseTransaction ‹**TransactionObject**›

This base class will likely be subject to further
refactoring along the introduction of additional tx types
on the Ethereum network.

It is therefore not recommended to use directly.

## Type parameters

▪ **TransactionObject**

## Hierarchy

* **BaseTransaction**

  ↳ [AccessListEIP2930Transaction](_eip2930transaction_.accesslisteip2930transaction.md)

  ↳ [Transaction](_index_.transaction.md)

  ↳ [AccessListEIP2930Transaction](_index_.accesslisteip2930transaction.md)

  ↳ [Transaction](_legacytransaction_.transaction.md)

## Index

### Constructors

* [constructor](_basetransaction_.basetransaction.md#constructor)

### Properties

* [common](_basetransaction_.basetransaction.md#common)
* [data](_basetransaction_.basetransaction.md#data)
* [gasLimit](_basetransaction_.basetransaction.md#gaslimit)
* [gasPrice](_basetransaction_.basetransaction.md#gasprice)
* [nonce](_basetransaction_.basetransaction.md#nonce)
* [r](_basetransaction_.basetransaction.md#optional-r)
* [s](_basetransaction_.basetransaction.md#optional-s)
* [to](_basetransaction_.basetransaction.md#optional-to)
* [v](_basetransaction_.basetransaction.md#optional-v)
* [value](_basetransaction_.basetransaction.md#value)

### Methods

* [getBaseFee](_basetransaction_.basetransaction.md#getbasefee)
* [getDataFee](_basetransaction_.basetransaction.md#getdatafee)
* [getMessageToSign](_basetransaction_.basetransaction.md#abstract-getmessagetosign)
* [getMessageToVerifySignature](_basetransaction_.basetransaction.md#abstract-getmessagetoverifysignature)
* [getSenderAddress](_basetransaction_.basetransaction.md#getsenderaddress)
* [getSenderPublicKey](_basetransaction_.basetransaction.md#abstract-getsenderpublickey)
* [getUpfrontCost](_basetransaction_.basetransaction.md#getupfrontcost)
* [hash](_basetransaction_.basetransaction.md#abstract-hash)
* [isSigned](_basetransaction_.basetransaction.md#issigned)
* [raw](_basetransaction_.basetransaction.md#abstract-raw)
* [serialize](_basetransaction_.basetransaction.md#abstract-serialize)
* [sign](_basetransaction_.basetransaction.md#sign)
* [toCreationAddress](_basetransaction_.basetransaction.md#tocreationaddress)
* [toJSON](_basetransaction_.basetransaction.md#abstract-tojson)
* [validate](_basetransaction_.basetransaction.md#validate)
* [verifySignature](_basetransaction_.basetransaction.md#verifysignature)

## Constructors

###  constructor

\+ **new BaseTransaction**(`txData`: [TxData](../modules/_index_.md#txdata), `txOptions`: [TxOptions](../interfaces/_index_.txoptions.md)): *[BaseTransaction](_basetransaction_.basetransaction.md)*

*Defined in [baseTransaction.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L31)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`txData` | [TxData](../modules/_index_.md#txdata) | - |
`txOptions` | [TxOptions](../interfaces/_index_.txoptions.md) | {} |

**Returns:** *[BaseTransaction](_basetransaction_.basetransaction.md)*

## Properties

###  common

• **common**: *Common*

*Defined in [baseTransaction.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L27)*

___

###  data

• **data**: *Buffer*

*Defined in [baseTransaction.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L26)*

___

###  gasLimit

• **gasLimit**: *BN*

*Defined in [baseTransaction.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L22)*

___

###  gasPrice

• **gasPrice**: *BN*

*Defined in [baseTransaction.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L23)*

___

###  nonce

• **nonce**: *BN*

*Defined in [baseTransaction.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L21)*

___

### `Optional` r

• **r**? : *BN*

*Defined in [baseTransaction.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L30)*

___

### `Optional` s

• **s**? : *BN*

*Defined in [baseTransaction.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L31)*

___

### `Optional` to

• **to**? : *Address*

*Defined in [baseTransaction.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L24)*

___

### `Optional` v

• **v**? : *BN*

*Defined in [baseTransaction.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L29)*

___

###  value

• **value**: *BN*

*Defined in [baseTransaction.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L25)*

## Methods

###  getBaseFee

▸ **getBaseFee**(): *BN*

*Defined in [baseTransaction.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L85)*

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** *BN*

___

###  getDataFee

▸ **getDataFee**(): *BN*

*Defined in [baseTransaction.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L96)*

The amount of gas paid for the data in this tx

**Returns:** *BN*

___

### `Abstract` getMessageToSign

▸ **getMessageToSign**(): *Buffer*

*Defined in [baseTransaction.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L134)*

Computes a sha3-256 hash of the serialized unsigned tx, which is used to sign the transaction.

**Returns:** *Buffer*

___

### `Abstract` getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): *Buffer*

*Defined in [baseTransaction.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L138)*

**Returns:** *Buffer*

___

###  getSenderAddress

▸ **getSenderAddress**(): *Address*

*Defined in [baseTransaction.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L161)*

Returns the sender's address

**Returns:** *Address*

___

### `Abstract` getSenderPublicKey

▸ **getSenderPublicKey**(): *Buffer*

*Defined in [baseTransaction.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L168)*

Returns the public key of the sender

**Returns:** *Buffer*

___

###  getUpfrontCost

▸ **getUpfrontCost**(): *BN*

*Defined in [baseTransaction.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L110)*

The up front amount that an account must have for this transaction to be valid

**Returns:** *BN*

___

### `Abstract` hash

▸ **hash**(): *Buffer*

*Defined in [baseTransaction.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L136)*

**Returns:** *Buffer*

___

###  isSigned

▸ **isSigned**(): *boolean*

*Defined in [baseTransaction.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L140)*

**Returns:** *boolean*

___

### `Abstract` raw

▸ **raw**(): *Buffer[] | [AccessListEIP2930ValuesArray](../modules/_index_.md#accesslisteip2930valuesarray)*

*Defined in [baseTransaction.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L124)*

Returns a Buffer Array of the raw Buffers of this transaction, in order.

**Returns:** *Buffer[] | [AccessListEIP2930ValuesArray](../modules/_index_.md#accesslisteip2930valuesarray)*

___

### `Abstract` serialize

▸ **serialize**(): *Buffer*

*Defined in [baseTransaction.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L129)*

Returns the encoding of the transaction.

**Returns:** *Buffer*

___

###  sign

▸ **sign**(`privateKey`: Buffer): *TransactionObject*

*Defined in [baseTransaction.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L173)*

Signs a tx and returns a new signed tx object

**Parameters:**

Name | Type |
------ | ------ |
`privateKey` | Buffer |

**Returns:** *TransactionObject*

___

###  toCreationAddress

▸ **toCreationAddress**(): *boolean*

*Defined in [baseTransaction.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L117)*

If the tx's `to` is to the creation address

**Returns:** *boolean*

___

### `Abstract` toJSON

▸ **toJSON**(): *[JsonTx](../interfaces/_index_.jsontx.md)*

*Defined in [baseTransaction.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L185)*

Returns an object with the JSON representation of the transaction

**Returns:** *[JsonTx](../interfaces/_index_.jsontx.md)*

___

###  validate

▸ **validate**(): *boolean*

*Defined in [baseTransaction.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L65)*

Checks if the transaction has the minimum amount of gas required
(DataFee + TxFee + Creation Fee).

**Returns:** *boolean*

▸ **validate**(`stringError`: false): *boolean*

*Defined in [baseTransaction.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L66)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | false |

**Returns:** *boolean*

▸ **validate**(`stringError`: true): *string[]*

*Defined in [baseTransaction.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L67)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | true |

**Returns:** *string[]*

___

###  verifySignature

▸ **verifySignature**(): *boolean*

*Defined in [baseTransaction.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L148)*

Determines if the signature is valid

**Returns:** *boolean*
