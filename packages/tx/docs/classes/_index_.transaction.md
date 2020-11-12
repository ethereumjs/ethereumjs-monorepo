[@ethereumjs/tx](../README.md) › ["index"](../modules/_index_.md) › [Transaction](_index_.transaction.md)

# Class: Transaction

An Ethereum transaction.

## Hierarchy

* **Transaction**

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

### Methods

* [getBaseFee](_index_.transaction.md#getbasefee)
* [getChainId](_index_.transaction.md#getchainid)
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
* [fromTxData](_index_.transaction.md#static-fromtxdata)
* [fromValuesArray](_index_.transaction.md#static-fromvaluesarray)

## Constructors

###  constructor

\+ **new Transaction**(`txData`: [TxData](../interfaces/_index_.txdata.md), `opts?`: [TxOptions](../interfaces/_index_.txoptions.md)): *[Transaction](_index_.transaction.md)*

*Defined in [transaction.ts:76](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L76)*

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Transaction object from varying data types.

**`note`** Transaction objects implement EIP155 by default. To disable it, pass in an `@ethereumjs/common` object set before EIP155 activation (i.e. before Spurious Dragon).

**Parameters:**

Name | Type |
------ | ------ |
`txData` | [TxData](../interfaces/_index_.txdata.md) |
`opts?` | [TxOptions](../interfaces/_index_.txoptions.md) |

**Returns:** *[Transaction](_index_.transaction.md)*

## Properties

###  common

• **common**: *Common*

*Defined in [transaction.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L28)*

___

###  data

• **data**: *Buffer*

*Defined in [transaction.ts:34](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L34)*

___

###  gasLimit

• **gasLimit**: *BN*

*Defined in [transaction.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L30)*

___

###  gasPrice

• **gasPrice**: *BN*

*Defined in [transaction.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L31)*

___

###  nonce

• **nonce**: *BN*

*Defined in [transaction.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L29)*

___

### `Optional` r

• **r**? : *BN*

*Defined in [transaction.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L36)*

___

### `Optional` s

• **s**? : *BN*

*Defined in [transaction.ts:37](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L37)*

___

### `Optional` to

• **to**? : *Address*

*Defined in [transaction.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L32)*

___

### `Optional` v

• **v**? : *BN*

*Defined in [transaction.ts:35](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L35)*

___

###  value

• **value**: *BN*

*Defined in [transaction.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L33)*

## Methods

###  getBaseFee

▸ **getBaseFee**(): *BN*

*Defined in [transaction.ts:279](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L279)*

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** *BN*

___

###  getChainId

▸ **getChainId**(): *number*

*Defined in [transaction.ts:162](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L162)*

Returns chain ID

**Returns:** *number*

___

###  getDataFee

▸ **getDataFee**(): *BN*

*Defined in [transaction.ts:265](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L265)*

The amount of gas paid for the data in this tx

**Returns:** *BN*

___

###  getMessageToSign

▸ **getMessageToSign**(): *Buffer‹›*

*Defined in [transaction.ts:151](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L151)*

**Returns:** *Buffer‹›*

___

###  getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): *Buffer‹›*

*Defined in [transaction.ts:155](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L155)*

**Returns:** *Buffer‹›*

___

###  getSenderAddress

▸ **getSenderAddress**(): *Address*

*Defined in [transaction.ts:169](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L169)*

Returns the sender's address

**Returns:** *Address*

___

###  getSenderPublicKey

▸ **getSenderPublicKey**(): *Buffer*

*Defined in [transaction.ts:176](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L176)*

Returns the public key of the sender

**Returns:** *Buffer*

___

###  getUpfrontCost

▸ **getUpfrontCost**(): *BN*

*Defined in [transaction.ts:290](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L290)*

The up front amount that an account must have for this transaction to be valid

**Returns:** *BN*

___

###  hash

▸ **hash**(): *Buffer*

*Defined in [transaction.ts:135](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L135)*

Computes a sha3-256 hash of the serialized tx

**Returns:** *Buffer*

___

###  isSigned

▸ **isSigned**(): *boolean*

*Defined in [transaction.ts:357](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L357)*

**Returns:** *boolean*

___

###  raw

▸ **raw**(): *Buffer[]*

*Defined in [transaction.ts:319](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L319)*

Returns a Buffer Array of the raw Buffers of this transaction, in order.

**Returns:** *Buffer[]*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [transaction.ts:336](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L336)*

Returns the rlp encoding of the transaction.

**Returns:** *Buffer*

___

###  sign

▸ **sign**(`privateKey`: Buffer): *[Transaction](_index_.transaction.md)‹›*

*Defined in [transaction.ts:227](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L227)*

Sign a transaction with a given private key.
Returns a new Transaction object (the original tx will not be modified).
Example:
```typescript
const unsignedTx = Transaction.fromTxData(txData)
const signedTx = unsignedTx.sign(privKey)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | Buffer | Must be 32 bytes in length.  |

**Returns:** *[Transaction](_index_.transaction.md)‹›*

___

###  toCreationAddress

▸ **toCreationAddress**(): *boolean*

*Defined in [transaction.ts:128](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L128)*

If the tx's `to` is to the creation address

**Returns:** *boolean*

___

###  toJSON

▸ **toJSON**(): *[JsonTx](../interfaces/_index_.jsontx.md)*

*Defined in [transaction.ts:343](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L343)*

Returns an object with the JSON representation of the transaction

**Returns:** *[JsonTx](../interfaces/_index_.jsontx.md)*

___

###  validate

▸ **validate**(): *boolean*

*Defined in [transaction.ts:299](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L299)*

Validates the signature and checks if
the transaction has the minimum amount of gas required
(DataFee + TxFee + Creation Fee).

**Returns:** *boolean*

▸ **validate**(`stringError`: false): *boolean*

*Defined in [transaction.ts:300](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L300)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | false |

**Returns:** *boolean*

▸ **validate**(`stringError`: true): *string[]*

*Defined in [transaction.ts:301](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L301)*

**Parameters:**

Name | Type |
------ | ------ |
`stringError` | true |

**Returns:** *string[]*

___

###  verifySignature

▸ **verifySignature**(): *boolean*

*Defined in [transaction.ts:207](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L207)*

Determines if the signature is valid

**Returns:** *boolean*

___

### `Static` fromRlpSerializedTx

▸ **fromRlpSerializedTx**(`serialized`: Buffer, `opts?`: [TxOptions](../interfaces/_index_.txoptions.md)): *[Transaction](_index_.transaction.md)‹›*

*Defined in [transaction.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`serialized` | Buffer |
`opts?` | [TxOptions](../interfaces/_index_.txoptions.md) |

**Returns:** *[Transaction](_index_.transaction.md)‹›*

___

### `Static` fromTxData

▸ **fromTxData**(`txData`: [TxData](../interfaces/_index_.txdata.md), `opts?`: [TxOptions](../interfaces/_index_.txoptions.md)): *[Transaction](_index_.transaction.md)‹›*

*Defined in [transaction.ts:39](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L39)*

**Parameters:**

Name | Type |
------ | ------ |
`txData` | [TxData](../interfaces/_index_.txdata.md) |
`opts?` | [TxOptions](../interfaces/_index_.txoptions.md) |

**Returns:** *[Transaction](_index_.transaction.md)‹›*

___

### `Static` fromValuesArray

▸ **fromValuesArray**(`values`: Buffer[], `opts?`: [TxOptions](../interfaces/_index_.txoptions.md)): *[Transaction](_index_.transaction.md)‹›*

*Defined in [transaction.ts:53](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L53)*

**Parameters:**

Name | Type |
------ | ------ |
`values` | Buffer[] |
`opts?` | [TxOptions](../interfaces/_index_.txoptions.md) |

**Returns:** *[Transaction](_index_.transaction.md)‹›*
