[@ethereumjs/tx](../README.md) › ["index"](../modules/_index_.md) › [Transaction](_index_.transaction.md)

# Class: Transaction

An Ethereum non-typed (legacy) transaction

## Hierarchy

* [BaseTransaction](_basetransaction_.basetransaction.md)‹[Transaction](_index_.transaction.md)›

  ↳ **Transaction**

## Index

### Constructors

* [constructor](_index_.transaction.md#constructor)

### Properties

* [common](_index_.transaction.md#common)
* [data](_index_.transaction.md#data)
* [gasLimit](_index_.transaction.md#gaslimit)
* [gasPrice](_index_.transaction.md#gasprice)
* [nonce](_index_.transaction.md#nonce)
* [r](_index_.transaction.md#optional-r)
* [s](_index_.transaction.md#optional-s)
* [to](_index_.transaction.md#optional-to)
* [v](_index_.transaction.md#optional-v)
* [value](_index_.transaction.md#value)

### Accessors

* [transactionType](_index_.transaction.md#transactiontype)

### Methods

* [getBaseFee](_index_.transaction.md#getbasefee)
* [getDataFee](_index_.transaction.md#getdatafee)
* [getMessageToSign](_index_.transaction.md#getmessagetosign)
* [getMessageToVerifySignature](_index_.transaction.md#getmessagetoverifysignature)
* [getSenderAddress](_index_.transaction.md#getsenderaddress)
* [getSenderPublicKey](_index_.transaction.md#getsenderpublickey)
* [getUpfrontCost](_index_.transaction.md#getupfrontcost)
* [hash](_index_.transaction.md#hash)
* [isSigned](_index_.transaction.md#issigned)
* [raw](_index_.transaction.md#raw)
* [serialize](_index_.transaction.md#serialize)
* [sign](_index_.transaction.md#sign)
* [toCreationAddress](_index_.transaction.md#tocreationaddress)
* [toJSON](_index_.transaction.md#tojson)
* [validate](_index_.transaction.md#validate)
* [verifySignature](_index_.transaction.md#verifysignature)
* [fromRlpSerializedTx](_index_.transaction.md#static-fromrlpserializedtx)
* [fromSerializedTx](_index_.transaction.md#static-fromserializedtx)
* [fromTxData](_index_.transaction.md#static-fromtxdata)
* [fromValuesArray](_index_.transaction.md#static-fromvaluesarray)

## Constructors

###  constructor

\+ **new Transaction**(`txData`: [TxData](../modules/_index_.md#txdata), `opts`: [TxOptions](../interfaces/_index_.txoptions.md)): *[Transaction](_index_.transaction.md)*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[constructor](_basetransaction_.basetransaction.md#constructor)*

*Defined in [legacyTransaction.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L87)*

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`txData` | [TxData](../modules/_index_.md#txdata) | - |
`opts` | [TxOptions](../interfaces/_index_.txoptions.md) | {} |

**Returns:** *[Transaction](_index_.transaction.md)*

## Properties

###  common

• **common**: *Common*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[common](_basetransaction_.basetransaction.md#common)*

*Defined in [baseTransaction.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L27)*

___

###  data

• **data**: *Buffer*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[data](_basetransaction_.basetransaction.md#data)*

*Defined in [baseTransaction.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L26)*

___

###  gasLimit

• **gasLimit**: *BN*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[gasLimit](_basetransaction_.basetransaction.md#gaslimit)*

*Defined in [baseTransaction.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L22)*

___

###  gasPrice

• **gasPrice**: *BN*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[gasPrice](_basetransaction_.basetransaction.md#gasprice)*

*Defined in [baseTransaction.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L23)*

___

###  nonce

• **nonce**: *BN*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[nonce](_basetransaction_.basetransaction.md#nonce)*

*Defined in [baseTransaction.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L21)*

___

### `Optional` r

• **r**? : *BN*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[r](_basetransaction_.basetransaction.md#optional-r)*

*Defined in [baseTransaction.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L30)*

___

### `Optional` s

• **s**? : *BN*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[s](_basetransaction_.basetransaction.md#optional-s)*

*Defined in [baseTransaction.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L31)*

___

### `Optional` to

• **to**? : *Address*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[to](_basetransaction_.basetransaction.md#optional-to)*

*Defined in [baseTransaction.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L24)*

___

### `Optional` v

• **v**? : *BN*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[v](_basetransaction_.basetransaction.md#optional-v)*

*Defined in [baseTransaction.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L29)*

___

###  value

• **value**: *BN*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[value](_basetransaction_.basetransaction.md#value)*

*Defined in [baseTransaction.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L25)*

## Accessors

###  transactionType

• **get transactionType**(): *number*

*Defined in [legacyTransaction.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L19)*

**Returns:** *number*

## Methods

###  getBaseFee

▸ **getBaseFee**(): *BN*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[getBaseFee](_basetransaction_.basetransaction.md#getbasefee)*

*Defined in [baseTransaction.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L85)*

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** *BN*

___

###  getDataFee

▸ **getDataFee**(): *BN*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[getDataFee](_basetransaction_.basetransaction.md#getdatafee)*

*Defined in [baseTransaction.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L96)*

The amount of gas paid for the data in this tx

**Returns:** *BN*

___

###  getMessageToSign

▸ **getMessageToSign**(): *Buffer‹›*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[getMessageToSign](_basetransaction_.basetransaction.md#abstract-getmessagetosign)*

*Defined in [legacyTransaction.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L159)*

Computes a sha3-256 hash of the serialized unsigned tx, which is used to sign the transaction.

**Returns:** *Buffer‹›*

___

###  getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): *Buffer‹›*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[getMessageToVerifySignature](_basetransaction_.basetransaction.md#abstract-getmessagetoverifysignature)*

*Defined in [legacyTransaction.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L173)*

Computes a sha3-256 hash which can be used to verify the signature

**Returns:** *Buffer‹›*

___

###  getSenderAddress

▸ **getSenderAddress**(): *Address*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[getSenderAddress](_basetransaction_.basetransaction.md#getsenderaddress)*

*Defined in [baseTransaction.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L161)*

Returns the sender's address

**Returns:** *Address*

___

###  getSenderPublicKey

▸ **getSenderPublicKey**(): *Buffer*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[getSenderPublicKey](_basetransaction_.basetransaction.md#abstract-getsenderpublickey)*

*Defined in [legacyTransaction.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L181)*

Returns the public key of the sender

**Returns:** *Buffer*

___

###  getUpfrontCost

▸ **getUpfrontCost**(): *BN*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[getUpfrontCost](_basetransaction_.basetransaction.md#getupfrontcost)*

*Defined in [baseTransaction.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L110)*

The up front amount that an account must have for this transaction to be valid

**Returns:** *BN*

___

###  hash

▸ **hash**(): *Buffer*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[hash](_basetransaction_.basetransaction.md#abstract-hash)*

*Defined in [legacyTransaction.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L166)*

Computes a sha3-256 hash of the serialized tx

**Returns:** *Buffer*

___

###  isSigned

▸ **isSigned**(): *boolean*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[isSigned](_basetransaction_.basetransaction.md#issigned)*

*Defined in [baseTransaction.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L140)*

**Returns:** *boolean*

___

###  raw

▸ **raw**(): *Buffer[]*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[raw](_basetransaction_.basetransaction.md#abstract-raw)*

*Defined in [legacyTransaction.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L112)*

Returns a Buffer Array of the raw Buffers of this transaction, in order.

**Returns:** *Buffer[]*

___

###  serialize

▸ **serialize**(): *Buffer*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[serialize](_basetransaction_.basetransaction.md#abstract-serialize)*

*Defined in [legacyTransaction.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L129)*

Returns the rlp encoding of the transaction.

**Returns:** *Buffer*

___

###  sign

▸ **sign**(`privateKey`: Buffer): *[Transaction](_index_.transaction.md)*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[sign](_basetransaction_.basetransaction.md#sign)*

*Defined in [baseTransaction.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L173)*

Signs a tx and returns a new signed tx object

**Parameters:**

Name | Type |
------ | ------ |
`privateKey` | Buffer |

**Returns:** *[Transaction](_index_.transaction.md)*

___

###  toCreationAddress

▸ **toCreationAddress**(): *boolean*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[toCreationAddress](_basetransaction_.basetransaction.md#tocreationaddress)*

*Defined in [baseTransaction.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L117)*

If the tx's `to` is to the creation address

**Returns:** *boolean*

___

###  toJSON

▸ **toJSON**(): *[JsonTx](../interfaces/_index_.jsontx.md)*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[toJSON](_basetransaction_.basetransaction.md#abstract-tojson)*

*Defined in [legacyTransaction.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L241)*

Returns an object with the JSON representation of the transaction

**Returns:** *[JsonTx](../interfaces/_index_.jsontx.md)*

___

###  validate

▸ **validate**(): *boolean*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[validate](_basetransaction_.basetransaction.md#validate)*

*Defined in [baseTransaction.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L65)*

Checks if the transaction has the minimum amount of gas required
(DataFee + TxFee + Creation Fee).

**Returns:** *boolean*

▸ **validate**(`stringError`: false): *boolean*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[validate](_basetransaction_.basetransaction.md#validate)*

*Defined in [baseTransaction.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L66)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | false |

**Returns:** *boolean*

▸ **validate**(`stringError`: true): *string[]*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[validate](_basetransaction_.basetransaction.md#validate)*

*Defined in [baseTransaction.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L67)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | true |

**Returns:** *string[]*

___

###  verifySignature

▸ **verifySignature**(): *boolean*

*Inherited from [BaseTransaction](_basetransaction_.basetransaction.md).[verifySignature](_basetransaction_.basetransaction.md#verifysignature)*

*Defined in [baseTransaction.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L148)*

Determines if the signature is valid

**Returns:** *boolean*

___

### `Static` fromRlpSerializedTx

▸ **fromRlpSerializedTx**(`serialized`: Buffer, `opts`: [TxOptions](../interfaces/_index_.txoptions.md)): *[Transaction](_index_.transaction.md)‹›*

*Defined in [legacyTransaction.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L50)*

Instantiate a transaction from the serialized tx.
(alias of `fromSerializedTx()`)

**`deprecated`** this constructor alias is deprecated and will be removed
in favor of the `fromSerializedTx()` constructor

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`serialized` | Buffer | - |
`opts` | [TxOptions](../interfaces/_index_.txoptions.md) | {} |

**Returns:** *[Transaction](_index_.transaction.md)‹›*

___

### `Static` fromSerializedTx

▸ **fromSerializedTx**(`serialized`: Buffer, `opts`: [TxOptions](../interfaces/_index_.txoptions.md)): *[Transaction](_index_.transaction.md)‹›*

*Defined in [legacyTransaction.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L33)*

Instantiate a transaction from the serialized tx.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`serialized` | Buffer | - |
`opts` | [TxOptions](../interfaces/_index_.txoptions.md) | {} |

**Returns:** *[Transaction](_index_.transaction.md)‹›*

___

### `Static` fromTxData

▸ **fromTxData**(`txData`: [TxData](../modules/_index_.md#txdata), `opts`: [TxOptions](../interfaces/_index_.txoptions.md)): *[Transaction](_index_.transaction.md)‹›*

*Defined in [legacyTransaction.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L26)*

Instantiate a transaction from a data dictionary

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`txData` | [TxData](../modules/_index_.md#txdata) | - |
`opts` | [TxOptions](../interfaces/_index_.txoptions.md) | {} |

**Returns:** *[Transaction](_index_.transaction.md)‹›*

___

### `Static` fromValuesArray

▸ **fromValuesArray**(`values`: Buffer[], `opts`: [TxOptions](../interfaces/_index_.txoptions.md)): *[Transaction](_index_.transaction.md)‹›*

*Defined in [legacyTransaction.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/legacyTransaction.ts#L60)*

Create a transaction from a values array.

The format is:
nonce, gasPrice, gasLimit, to, value, data, v, r, s

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`values` | Buffer[] | - |
`opts` | [TxOptions](../interfaces/_index_.txoptions.md) | {} |

**Returns:** *[Transaction](_index_.transaction.md)‹›*
