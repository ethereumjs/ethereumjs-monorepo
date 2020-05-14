[ethereumjs-tx](../README.md) › ["index"](../modules/_index_.md) › [Transaction](_index_.transaction.md)

# Class: Transaction

An Ethereum transaction.

## Hierarchy

* **Transaction**

  ↳ [FakeTransaction](_fake_.faketransaction.md)

  ↳ [FakeTransaction](_index_.faketransaction.md)

## Index

### Constructors

* [constructor](_index_.transaction.md#constructor)

### Properties

* [data](_index_.transaction.md#data)
* [gasLimit](_index_.transaction.md#gaslimit)
* [gasPrice](_index_.transaction.md#gasprice)
* [nonce](_index_.transaction.md#nonce)
* [r](_index_.transaction.md#r)
* [raw](_index_.transaction.md#raw)
* [s](_index_.transaction.md#s)
* [to](_index_.transaction.md#to)
* [v](_index_.transaction.md#v)
* [value](_index_.transaction.md#value)

### Methods

* [getBaseFee](_index_.transaction.md#getbasefee)
* [getChainId](_index_.transaction.md#getchainid)
* [getDataFee](_index_.transaction.md#getdatafee)
* [getSenderAddress](_index_.transaction.md#getsenderaddress)
* [getSenderPublicKey](_index_.transaction.md#getsenderpublickey)
* [getUpfrontCost](_index_.transaction.md#getupfrontcost)
* [hash](_index_.transaction.md#hash)
* [serialize](_index_.transaction.md#serialize)
* [sign](_index_.transaction.md#sign)
* [toCreationAddress](_index_.transaction.md#tocreationaddress)
* [toJSON](_index_.transaction.md#tojson)
* [validate](_index_.transaction.md#validate)
* [verifySignature](_index_.transaction.md#verifysignature)

## Constructors

###  constructor

\+ **new Transaction**(`data`: Buffer | [PrefixedHexString](../modules/_index_.md#prefixedhexstring) | [BufferLike](../modules/_index_.md#bufferlike)[] | [TxData](../interfaces/_index_.txdata.md), `opts`: [TransactionOptions](../interfaces/_index_.transactionoptions.md)): *[Transaction](_index_.transaction.md)*

*Defined in [transaction.ts:37](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L37)*

Creates a new transaction from an object with its fields' values.

**`note`** Transaction objects implement EIP155 by default. To disable it, use the constructor's
second parameter to set a chain and hardfork before EIP155 activation (i.e. before Spurious
Dragon.)

**`example`** 
```js
const txData = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000',
  value: '0x00',
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
  v: '0x1c',
  r: '0x5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
  s: '0x5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
};
const tx = new Transaction(txData);
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`data` | Buffer &#124; [PrefixedHexString](../modules/_index_.md#prefixedhexstring) &#124; [BufferLike](../modules/_index_.md#bufferlike)[] &#124; [TxData](../interfaces/_index_.txdata.md) | {} | A transaction can be initialized with its rlp representation, an array containing the value of its fields in order, or an object containing them by name.  |
`opts` | [TransactionOptions](../interfaces/_index_.transactionoptions.md) | {} | The transaction's options, used to indicate the chain and hardfork the transactions belongs to.  |

**Returns:** *[Transaction](_index_.transaction.md)*

## Properties

###  data

• **data**: *Buffer*

*Defined in [transaction.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L30)*

___

###  gasLimit

• **gasLimit**: *Buffer*

*Defined in [transaction.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L26)*

___

###  gasPrice

• **gasPrice**: *Buffer*

*Defined in [transaction.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L27)*

___

###  nonce

• **nonce**: *Buffer*

*Defined in [transaction.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L25)*

___

###  r

• **r**: *Buffer*

*Defined in [transaction.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L32)*

___

###  raw

• **raw**: *Buffer[]*

*Defined in [transaction.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L24)*

___

###  s

• **s**: *Buffer*

*Defined in [transaction.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L33)*

___

###  to

• **to**: *Buffer*

*Defined in [transaction.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L28)*

___

###  v

• **v**: *Buffer*

*Defined in [transaction.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L31)*

___

###  value

• **value**: *Buffer*

*Defined in [transaction.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L29)*

## Methods

###  getBaseFee

▸ **getBaseFee**(): *BN*

*Defined in [transaction.ts:296](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L296)*

the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** *BN*

___

###  getChainId

▸ **getChainId**(): *number*

*Defined in [transaction.ts:202](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L202)*

returns chain ID

**Returns:** *number*

___

###  getDataFee

▸ **getDataFee**(): *BN*

*Defined in [transaction.ts:282](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L282)*

The amount of gas paid for the data in this tx

**Returns:** *BN*

___

###  getSenderAddress

▸ **getSenderAddress**(): *Buffer*

*Defined in [transaction.ts:209](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L209)*

returns the sender's address

**Returns:** *Buffer*

___

###  getSenderPublicKey

▸ **getSenderPublicKey**(): *Buffer*

*Defined in [transaction.ts:221](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L221)*

returns the public key of the sender

**Returns:** *Buffer*

___

###  getUpfrontCost

▸ **getUpfrontCost**(): *BN*

*Defined in [transaction.ts:307](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L307)*

the up front amount that an account must have for this transaction to be valid

**Returns:** *BN*

___

###  hash

▸ **hash**(`includeSignature`: boolean): *Buffer*

*Defined in [transaction.ts:177](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L177)*

Computes a sha3-256 hash of the serialized tx

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`includeSignature` | boolean | true | Whether or not to include the signature  |

**Returns:** *Buffer*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [transaction.ts:337](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L337)*

Returns the rlp encoding of the transaction

**Returns:** *Buffer*

___

###  sign

▸ **sign**(`privateKey`: Buffer): *void*

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

*Defined in [transaction.ts:169](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L169)*

If the tx's `to` is to the creation address

**Returns:** *boolean*

___

###  toJSON

▸ **toJSON**(`labels`: boolean): *object | string[]*

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

*Defined in [transaction.ts:314](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L314)*

Validates the signature and checks to see if it has enough gas.

**Returns:** *boolean*

▸ **validate**(`stringError`: false): *boolean*

*Defined in [transaction.ts:315](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L315)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | false |

**Returns:** *boolean*

▸ **validate**(`stringError`: true): *string*

*Defined in [transaction.ts:316](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L316)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | true |

**Returns:** *string*

___

###  verifySignature

▸ **verifySignature**(): *boolean*

*Defined in [transaction.ts:233](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L233)*

Determines if the signature is valid

**Returns:** *boolean*
