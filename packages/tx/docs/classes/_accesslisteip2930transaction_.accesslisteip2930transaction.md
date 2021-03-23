[@ethereumjs/tx](../README.md) › ["accessListEIP2930Transaction"](../modules/_accesslisteip2930transaction_.md) › [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)

# Class: AccessListEIP2930Transaction

Typed transaction with optional access lists

- TransactionType: 1
- EIP: [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930)

## Hierarchy

* [BaseTransaction](_basetransaction_.basetransaction.md)‹[AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)›

  ↳ **AccessListEIP2930Transaction**

## Index

### Constructors

* [constructor](_accesslisteip2930transaction_.accesslisteip2930transaction.md#constructor)

### Properties

* [AccessListJSON](_accesslisteip2930transaction_.accesslisteip2930transaction.md#accesslistjson)
* [accessList](_accesslisteip2930transaction_.accesslisteip2930transaction.md#accesslist)
* [chainId](_accesslisteip2930transaction_.accesslisteip2930transaction.md#chainid)
* [common](_accesslisteip2930transaction_.accesslisteip2930transaction.md#common)
* [data](_accesslisteip2930transaction_.accesslisteip2930transaction.md#data)
* [gasLimit](_accesslisteip2930transaction_.accesslisteip2930transaction.md#gaslimit)
* [gasPrice](_accesslisteip2930transaction_.accesslisteip2930transaction.md#gasprice)
* [nonce](_accesslisteip2930transaction_.accesslisteip2930transaction.md#nonce)
* [r](_accesslisteip2930transaction_.accesslisteip2930transaction.md#optional-r)
* [s](_accesslisteip2930transaction_.accesslisteip2930transaction.md#optional-s)
* [to](_accesslisteip2930transaction_.accesslisteip2930transaction.md#optional-to)
* [v](_accesslisteip2930transaction_.accesslisteip2930transaction.md#optional-v)
* [value](_accesslisteip2930transaction_.accesslisteip2930transaction.md#value)

### Accessors

* [senderR](_accesslisteip2930transaction_.accesslisteip2930transaction.md#senderr)
* [senderS](_accesslisteip2930transaction_.accesslisteip2930transaction.md#senders)
* [transactionType](_accesslisteip2930transaction_.accesslisteip2930transaction.md#transactiontype)
* [yParity](_accesslisteip2930transaction_.accesslisteip2930transaction.md#yparity)

### Methods

* [_processSignature](_accesslisteip2930transaction_.accesslisteip2930transaction.md#_processsignature)
* [getBaseFee](_accesslisteip2930transaction_.accesslisteip2930transaction.md#getbasefee)
* [getDataFee](_accesslisteip2930transaction_.accesslisteip2930transaction.md#getdatafee)
* [getMessageToSign](_accesslisteip2930transaction_.accesslisteip2930transaction.md#getmessagetosign)
* [getMessageToVerifySignature](_accesslisteip2930transaction_.accesslisteip2930transaction.md#getmessagetoverifysignature)
* [getSenderAddress](_accesslisteip2930transaction_.accesslisteip2930transaction.md#getsenderaddress)
* [getSenderPublicKey](_accesslisteip2930transaction_.accesslisteip2930transaction.md#getsenderpublickey)
* [getUpfrontCost](_accesslisteip2930transaction_.accesslisteip2930transaction.md#getupfrontcost)
* [hash](_accesslisteip2930transaction_.accesslisteip2930transaction.md#hash)
* [isSigned](_accesslisteip2930transaction_.accesslisteip2930transaction.md#issigned)
* [raw](_accesslisteip2930transaction_.accesslisteip2930transaction.md#raw)
* [serialize](_accesslisteip2930transaction_.accesslisteip2930transaction.md#serialize)
* [sign](_accesslisteip2930transaction_.accesslisteip2930transaction.md#sign)
* [toCreationAddress](_accesslisteip2930transaction_.accesslisteip2930transaction.md#tocreationaddress)
* [toJSON](_accesslisteip2930transaction_.accesslisteip2930transaction.md#tojson)
* [validate](_accesslisteip2930transaction_.accesslisteip2930transaction.md#validate)
* [verifySignature](_accesslisteip2930transaction_.accesslisteip2930transaction.md#verifysignature)
* [fromRlpSerializedTx](_accesslisteip2930transaction_.accesslisteip2930transaction.md#static-fromrlpserializedtx)
* [fromSerializedTx](_accesslisteip2930transaction_.accesslisteip2930transaction.md#static-fromserializedtx)
* [fromTxData](_accesslisteip2930transaction_.accesslisteip2930transaction.md#static-fromtxdata)
* [fromValuesArray](_accesslisteip2930transaction_.accesslisteip2930transaction.md#static-fromvaluesarray)

## Constructors

###  constructor

\+ **new AccessListEIP2930Transaction**(`txData`: [AccessListEIP2930TxData](../interfaces/_index_.accesslisteip2930txdata.md), `opts`: [TxOptions](../interfaces/_index_.txoptions.md)): *[AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[constructor](_basetransaction_.basetransaction.md#constructor)*

*Defined in [accessListEIP2930Transaction.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L130)*

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`txData` | [AccessListEIP2930TxData](../interfaces/_index_.accesslisteip2930txdata.md) | - |
`opts` | [TxOptions](../interfaces/_index_.txoptions.md) | {} |

**Returns:** *[AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)*

## Properties

###  AccessListJSON

• **AccessListJSON**: *[AccessList](../modules/_index_.md#accesslist)*

*Defined in [accessListEIP2930Transaction.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L35)*

___

###  accessList

• **accessList**: *[AccessListBuffer](../modules/_index_.md#accesslistbuffer)*

*Defined in [accessListEIP2930Transaction.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L34)*

___

###  chainId

• **chainId**: *BN*

*Defined in [accessListEIP2930Transaction.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L33)*

___

###  common

• **common**: *Common*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[common](_accesslisteip2930transaction_.accesslisteip2930transaction.md#common)*

*Defined in [baseTransaction.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L27)*

___

###  data

• **data**: *Buffer*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[data](_accesslisteip2930transaction_.accesslisteip2930transaction.md#data)*

*Defined in [baseTransaction.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L26)*

___

###  gasLimit

• **gasLimit**: *BN*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[gasLimit](_accesslisteip2930transaction_.accesslisteip2930transaction.md#gaslimit)*

*Defined in [baseTransaction.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L22)*

___

###  gasPrice

• **gasPrice**: *BN*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[gasPrice](_accesslisteip2930transaction_.accesslisteip2930transaction.md#gasprice)*

*Defined in [baseTransaction.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L23)*

___

###  nonce

• **nonce**: *BN*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[nonce](_accesslisteip2930transaction_.accesslisteip2930transaction.md#nonce)*

*Defined in [baseTransaction.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L21)*

___

### `Optional` r

• **r**? : *BN*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[r](_accesslisteip2930transaction_.accesslisteip2930transaction.md#optional-r)*

*Defined in [baseTransaction.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L30)*

___

### `Optional` s

• **s**? : *BN*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[s](_accesslisteip2930transaction_.accesslisteip2930transaction.md#optional-s)*

*Defined in [baseTransaction.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L31)*

___

### `Optional` to

• **to**? : *Address*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[to](_accesslisteip2930transaction_.accesslisteip2930transaction.md#optional-to)*

*Defined in [baseTransaction.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L24)*

___

### `Optional` v

• **v**? : *BN*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[v](_accesslisteip2930transaction_.accesslisteip2930transaction.md#optional-v)*

*Defined in [baseTransaction.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L29)*

___

###  value

• **value**: *BN*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[value](_accesslisteip2930transaction_.accesslisteip2930transaction.md#value)*

*Defined in [baseTransaction.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L25)*

## Accessors

###  senderR

• **get senderR**(): *undefined | BN‹›*

*Defined in [accessListEIP2930Transaction.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L47)*

**Returns:** *undefined | BN‹›*

___

###  senderS

• **get senderS**(): *undefined | BN‹›*

*Defined in [accessListEIP2930Transaction.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L42)*

**Returns:** *undefined | BN‹›*

___

###  transactionType

• **get transactionType**(): *number*

*Defined in [accessListEIP2930Transaction.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L37)*

**Returns:** *number*

___

###  yParity

• **get yParity**(): *undefined | BN‹›*

*Defined in [accessListEIP2930Transaction.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L52)*

**Returns:** *undefined | BN‹›*

## Methods

###  _processSignature

▸ **_processSignature**(`v`: number, `r`: Buffer, `s`: Buffer): *[AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)‹›*

*Defined in [accessListEIP2930Transaction.ts:338](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L338)*

**Parameters:**

Name | Type |
------ | ------ |
`v` | number |
`r` | Buffer |
`s` | Buffer |

**Returns:** *[AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)‹›*

___

###  getBaseFee

▸ **getBaseFee**(): *BN*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[getBaseFee](_accesslisteip2930transaction_.accesslisteip2930transaction.md#getbasefee)*

*Defined in [baseTransaction.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L85)*

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** *BN*

___

###  getDataFee

▸ **getDataFee**(): *BN*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[getDataFee](_basetransaction_.basetransaction.md#getdatafee)*

*Defined in [accessListEIP2930Transaction.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L231)*

The amount of gas paid for the data in this tx

**Returns:** *BN*

___

###  getMessageToSign

▸ **getMessageToSign**(): *Buffer‹›*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[getMessageToSign](_basetransaction_.basetransaction.md#abstract-getmessagetosign)*

*Defined in [accessListEIP2930Transaction.ts:280](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L280)*

Computes a sha3-256 hash of the serialized unsigned tx, which is used to sign the transaction.

**Returns:** *Buffer‹›*

___

###  getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): *Buffer*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[getMessageToVerifySignature](_basetransaction_.basetransaction.md#abstract-getmessagetoverifysignature)*

*Defined in [accessListEIP2930Transaction.ts:299](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L299)*

Computes a sha3-256 hash which can be used to verify the signature

**Returns:** *Buffer*

___

###  getSenderAddress

▸ **getSenderAddress**(): *Address*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[getSenderAddress](_accesslisteip2930transaction_.accesslisteip2930transaction.md#getsenderaddress)*

*Defined in [baseTransaction.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L161)*

Returns the sender's address

**Returns:** *Address*

___

###  getSenderPublicKey

▸ **getSenderPublicKey**(): *Buffer*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[getSenderPublicKey](_basetransaction_.basetransaction.md#abstract-getsenderpublickey)*

*Defined in [accessListEIP2930Transaction.ts:306](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L306)*

Returns the public key of the sender

**Returns:** *Buffer*

___

###  getUpfrontCost

▸ **getUpfrontCost**(): *BN*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[getUpfrontCost](_accesslisteip2930transaction_.accesslisteip2930transaction.md#getupfrontcost)*

*Defined in [baseTransaction.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L110)*

The up front amount that an account must have for this transaction to be valid

**Returns:** *BN*

___

###  hash

▸ **hash**(): *Buffer*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[hash](_basetransaction_.basetransaction.md#abstract-hash)*

*Defined in [accessListEIP2930Transaction.ts:288](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L288)*

Computes a sha3-256 hash of the serialized tx

**Returns:** *Buffer*

___

###  isSigned

▸ **isSigned**(): *boolean*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[isSigned](_accesslisteip2930transaction_.accesslisteip2930transaction.md#issigned)*

*Defined in [baseTransaction.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L140)*

**Returns:** *boolean*

___

###  raw

▸ **raw**(): *[AccessListEIP2930ValuesArray](../modules/_index_.md#accesslisteip2930valuesarray)*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[raw](_basetransaction_.basetransaction.md#abstract-raw)*

*Defined in [accessListEIP2930Transaction.ts:253](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L253)*

Returns a Buffer Array of the raw Buffers of this transaction, in order.

Use `serialize()` to add to block data for `Block.fromValuesArray()`.

**Returns:** *[AccessListEIP2930ValuesArray](../modules/_index_.md#accesslisteip2930valuesarray)*

___

###  serialize

▸ **serialize**(): *Buffer*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[serialize](_basetransaction_.basetransaction.md#abstract-serialize)*

*Defined in [accessListEIP2930Transaction.ts:272](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L272)*

Returns the serialized encoding of the transaction.

**Returns:** *Buffer*

___

###  sign

▸ **sign**(`privateKey`: Buffer): *[AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[sign](_accesslisteip2930transaction_.accesslisteip2930transaction.md#sign)*

*Defined in [baseTransaction.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L173)*

Signs a tx and returns a new signed tx object

**Parameters:**

Name | Type |
------ | ------ |
`privateKey` | Buffer |

**Returns:** *[AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)*

___

###  toCreationAddress

▸ **toCreationAddress**(): *boolean*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[toCreationAddress](_accesslisteip2930transaction_.accesslisteip2930transaction.md#tocreationaddress)*

*Defined in [baseTransaction.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L117)*

If the tx's `to` is to the creation address

**Returns:** *boolean*

___

###  toJSON

▸ **toJSON**(): *[JsonTx](../interfaces/_index_.jsontx.md)*

*Overrides [BaseTransaction](_basetransaction_.basetransaction.md).[toJSON](_basetransaction_.basetransaction.md#abstract-tojson)*

*Defined in [accessListEIP2930Transaction.ts:364](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L364)*

Returns an object with the JSON representation of the transaction

**Returns:** *[JsonTx](../interfaces/_index_.jsontx.md)*

___

###  validate

▸ **validate**(): *boolean*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[validate](_accesslisteip2930transaction_.accesslisteip2930transaction.md#validate)*

*Defined in [baseTransaction.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L65)*

Checks if the transaction has the minimum amount of gas required
(DataFee + TxFee + Creation Fee).

**Returns:** *boolean*

▸ **validate**(`stringError`: false): *boolean*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[validate](_accesslisteip2930transaction_.accesslisteip2930transaction.md#validate)*

*Defined in [baseTransaction.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L66)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | false |

**Returns:** *boolean*

▸ **validate**(`stringError`: true): *string[]*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[validate](_accesslisteip2930transaction_.accesslisteip2930transaction.md#validate)*

*Defined in [baseTransaction.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L67)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | true |

**Returns:** *string[]*

___

###  verifySignature

▸ **verifySignature**(): *boolean*

*Inherited from [AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md).[verifySignature](_accesslisteip2930transaction_.accesslisteip2930transaction.md#verifysignature)*

*Defined in [baseTransaction.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L148)*

Determines if the signature is valid

**Returns:** *boolean*

___

### `Static` fromRlpSerializedTx

▸ **fromRlpSerializedTx**(`serialized`: Buffer, `opts`: [TxOptions](../interfaces/_index_.txoptions.md)): *[AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)‹›*

*Defined in [accessListEIP2930Transaction.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L93)*

Instantiate a transaction from the serialized tx.
(alias of `fromSerializedTx()`)

Note: This means that the Buffer should start with 0x01.

**`deprecated`** this constructor alias is deprecated and will be removed
in favor of the `fromSerializedTx()` constructor

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`serialized` | Buffer | - |
`opts` | [TxOptions](../interfaces/_index_.txoptions.md) | {} |

**Returns:** *[AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)‹›*

___

### `Static` fromSerializedTx

▸ **fromSerializedTx**(`serialized`: Buffer, `opts`: [TxOptions](../interfaces/_index_.txoptions.md)): *[AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)‹›*

*Defined in [accessListEIP2930Transaction.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L68)*

Instantiate a transaction from the serialized tx.

Note: this means that the Buffer should start with 0x01.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`serialized` | Buffer | - |
`opts` | [TxOptions](../interfaces/_index_.txoptions.md) | {} |

**Returns:** *[AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)‹›*

___

### `Static` fromTxData

▸ **fromTxData**(`txData`: [AccessListEIP2930TxData](../interfaces/_index_.accesslisteip2930txdata.md), `opts`: [TxOptions](../interfaces/_index_.txoptions.md)): *[AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)‹›*

*Defined in [accessListEIP2930Transaction.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L59)*

Instantiate a transaction from a data dictionary

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`txData` | [AccessListEIP2930TxData](../interfaces/_index_.accesslisteip2930txdata.md) | - |
`opts` | [TxOptions](../interfaces/_index_.txoptions.md) | {} |

**Returns:** *[AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)‹›*

___

### `Static` fromValuesArray

▸ **fromValuesArray**(`values`: [AccessListEIP2930ValuesArray](../modules/_index_.md#accesslisteip2930valuesarray), `opts`: [TxOptions](../interfaces/_index_.txoptions.md)): *[AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)‹›*

*Defined in [accessListEIP2930Transaction.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/accessListEIP2930Transaction.ts#L103)*

Create a transaction from a values array.

The format is:
chainId, nonce, gasPrice, gasLimit, to, value, data, access_list, yParity (v), senderR (r), senderS (s)

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`values` | [AccessListEIP2930ValuesArray](../modules/_index_.md#accesslisteip2930valuesarray) | - |
`opts` | [TxOptions](../interfaces/_index_.txoptions.md) | {} |

**Returns:** *[AccessListEIP2930Transaction](_accesslisteip2930transaction_.accesslisteip2930transaction.md)‹›*
