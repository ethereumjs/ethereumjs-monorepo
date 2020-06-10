[ethereumjs-tx](../README.md) › ["index"](../modules/_index_.md) › [FakeTransaction](_index_.faketransaction.md)

# Class: FakeTransaction

Creates a new transaction object that doesn't need to be signed.

**`param`** A transaction can be initialized with its rlp representation, an array containing
the value of its fields in order, or an object containing them by name.

**`param`** The transaction's options, used to indicate the chain and hardfork the
transactions belongs to.

**`see`** Transaction

## Hierarchy

* [Transaction](_index_.transaction.md)

  ↳ **FakeTransaction**

## Index

### Constructors

* [constructor](_index_.faketransaction.md#constructor)

### Properties

* [data](_index_.faketransaction.md#data)
* [from](_index_.faketransaction.md#from)
* [gasLimit](_index_.faketransaction.md#gaslimit)
* [gasPrice](_index_.faketransaction.md#gasprice)
* [nonce](_index_.faketransaction.md#nonce)
* [r](_index_.faketransaction.md#r)
* [raw](_index_.faketransaction.md#raw)
* [s](_index_.faketransaction.md#s)
* [to](_index_.faketransaction.md#to)
* [v](_index_.faketransaction.md#v)
* [value](_index_.faketransaction.md#value)

### Methods

* [getBaseFee](_index_.faketransaction.md#getbasefee)
* [getChainId](_index_.faketransaction.md#getchainid)
* [getDataFee](_index_.faketransaction.md#getdatafee)
* [getSenderAddress](_index_.faketransaction.md#getsenderaddress)
* [getSenderPublicKey](_index_.faketransaction.md#getsenderpublickey)
* [getUpfrontCost](_index_.faketransaction.md#getupfrontcost)
* [hash](_index_.faketransaction.md#hash)
* [serialize](_index_.faketransaction.md#serialize)
* [sign](_index_.faketransaction.md#sign)
* [toCreationAddress](_index_.faketransaction.md#tocreationaddress)
* [toJSON](_index_.faketransaction.md#tojson)
* [validate](_index_.faketransaction.md#validate)
* [verifySignature](_index_.faketransaction.md#verifysignature)

## Constructors

###  constructor

\+ **new FakeTransaction**(`data`: Buffer | [PrefixedHexString](../modules/_index_.md#prefixedhexstring) | [BufferLike](../modules/_index_.md#bufferlike)[] | [FakeTxData](../interfaces/_index_.faketxdata.md), `opts`: [TransactionOptions](../interfaces/_index_.transactionoptions.md)): *[FakeTransaction](_index_.faketransaction.md)*

*Overrides [Transaction](_index_.transaction.md).[constructor](_index_.transaction.md#constructor)*

*Defined in [fake.ts:22](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/fake.ts#L22)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`data` | Buffer &#124; [PrefixedHexString](../modules/_index_.md#prefixedhexstring) &#124; [BufferLike](../modules/_index_.md#bufferlike)[] &#124; [FakeTxData](../interfaces/_index_.faketxdata.md) | {} |
`opts` | [TransactionOptions](../interfaces/_index_.transactionoptions.md) | {} |

**Returns:** *[FakeTransaction](_index_.faketransaction.md)*

## Properties

###  data

• **data**: *Buffer*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[data](_fake_.faketransaction.md#data)*

*Defined in [transaction.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L30)*

___

###  from

• **from**: *Buffer*

*Defined in [fake.ts:22](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/fake.ts#L22)*

Set from address to bypass transaction signing.
This is not an optional property, as its getter never returns undefined.

___

###  gasLimit

• **gasLimit**: *Buffer*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[gasLimit](_fake_.faketransaction.md#gaslimit)*

*Defined in [transaction.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L26)*

___

###  gasPrice

• **gasPrice**: *Buffer*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[gasPrice](_fake_.faketransaction.md#gasprice)*

*Defined in [transaction.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L27)*

___

###  nonce

• **nonce**: *Buffer*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[nonce](_fake_.faketransaction.md#nonce)*

*Defined in [transaction.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L25)*

___

###  r

• **r**: *Buffer*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[r](_fake_.faketransaction.md#r)*

*Defined in [transaction.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L32)*

___

###  raw

• **raw**: *Buffer[]*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[raw](_fake_.faketransaction.md#raw)*

*Defined in [transaction.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L24)*

___

###  s

• **s**: *Buffer*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[s](_fake_.faketransaction.md#s)*

*Defined in [transaction.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L33)*

___

###  to

• **to**: *Buffer*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[to](_fake_.faketransaction.md#to)*

*Defined in [transaction.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L28)*

___

###  v

• **v**: *Buffer*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[v](_fake_.faketransaction.md#v)*

*Defined in [transaction.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L31)*

___

###  value

• **value**: *Buffer*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[value](_fake_.faketransaction.md#value)*

*Defined in [transaction.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L29)*

## Methods

###  getBaseFee

▸ **getBaseFee**(): *BN*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[getBaseFee](_fake_.faketransaction.md#getbasefee)*

*Defined in [transaction.ts:296](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L296)*

the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** *BN*

___

###  getChainId

▸ **getChainId**(): *number*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[getChainId](_fake_.faketransaction.md#getchainid)*

*Defined in [transaction.ts:202](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L202)*

returns chain ID

**Returns:** *number*

___

###  getDataFee

▸ **getDataFee**(): *BN*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[getDataFee](_fake_.faketransaction.md#getdatafee)*

*Defined in [transaction.ts:282](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L282)*

The amount of gas paid for the data in this tx

**Returns:** *BN*

___

###  getSenderAddress

▸ **getSenderAddress**(): *Buffer*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[getSenderAddress](_fake_.faketransaction.md#getsenderaddress)*

*Defined in [transaction.ts:209](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L209)*

returns the sender's address

**Returns:** *Buffer*

___

###  getSenderPublicKey

▸ **getSenderPublicKey**(): *Buffer*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[getSenderPublicKey](_fake_.faketransaction.md#getsenderpublickey)*

*Defined in [transaction.ts:221](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L221)*

returns the public key of the sender

**Returns:** *Buffer*

___

###  getUpfrontCost

▸ **getUpfrontCost**(): *BN*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[getUpfrontCost](_fake_.faketransaction.md#getupfrontcost)*

*Defined in [transaction.ts:307](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L307)*

the up front amount that an account must have for this transaction to be valid

**Returns:** *BN*

___

###  hash

▸ **hash**(`includeSignature`: boolean): *Buffer*

*Overrides [Transaction](_index_.transaction.md).[hash](_index_.transaction.md#hash)*

*Defined in [fake.ts:53](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/fake.ts#L53)*

Computes a sha3-256 hash of the serialized tx, using the sender address to generate a fake
signature.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`includeSignature` | boolean | true | Whether or not to include the signature  |

**Returns:** *Buffer*

___

###  serialize

▸ **serialize**(): *Buffer*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[serialize](_fake_.faketransaction.md#serialize)*

*Defined in [transaction.ts:337](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L337)*

Returns the rlp encoding of the transaction

**Returns:** *Buffer*

___

###  sign

▸ **sign**(`privateKey`: Buffer): *void*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[sign](_fake_.faketransaction.md#sign)*

*Defined in [transaction.ts:262](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L262)*

sign a transaction with a given private key

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | Buffer | Must be 32 bytes in length  |

**Returns:** *void*

___

###  toCreationAddress

▸ **toCreationAddress**(): *boolean*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[toCreationAddress](_fake_.faketransaction.md#tocreationaddress)*

*Defined in [transaction.ts:169](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L169)*

If the tx's `to` is to the creation address

**Returns:** *boolean*

___

###  toJSON

▸ **toJSON**(`labels`: boolean): *object | string[]*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[toJSON](_fake_.faketransaction.md#tojson)*

*Defined in [transaction.ts:346](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L346)*

Returns the transaction in JSON format

**`see`** [ethereumjs-util](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties)

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`labels` | boolean | false |

**Returns:** *object | string[]*

___

###  validate

▸ **validate**(): *boolean*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[validate](_fake_.faketransaction.md#validate)*

*Defined in [transaction.ts:314](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L314)*

Validates the signature and checks to see if it has enough gas.

**Returns:** *boolean*

▸ **validate**(`stringError`: false): *boolean*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[validate](_fake_.faketransaction.md#validate)*

*Defined in [transaction.ts:315](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L315)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | false |

**Returns:** *boolean*

▸ **validate**(`stringError`: true): *string*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[validate](_fake_.faketransaction.md#validate)*

*Defined in [transaction.ts:316](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L316)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | true |

**Returns:** *string*

___

###  verifySignature

▸ **verifySignature**(): *boolean*

*Inherited from [FakeTransaction](_fake_.faketransaction.md).[verifySignature](_fake_.faketransaction.md#verifysignature)*

*Defined in [transaction.ts:233](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L233)*

Determines if the signature is valid

**Returns:** *boolean*
