[ethereumjs-tx](../README.md) › ["transaction"](../modules/_transaction_.md) › [Transaction](_transaction_.transaction.md)

# Class: Transaction

An Ethereum transaction.

## Hierarchy

- **Transaction**

## Index

### Constructors

- [constructor](_transaction_.transaction.md#constructor)

### Properties

- [data](_transaction_.transaction.md#data)
- [gasLimit](_transaction_.transaction.md#gaslimit)
- [gasPrice](_transaction_.transaction.md#gasprice)
- [nonce](_transaction_.transaction.md#nonce)
- [r](_transaction_.transaction.md#r)
- [raw](_transaction_.transaction.md#raw)
- [s](_transaction_.transaction.md#s)
- [to](_transaction_.transaction.md#to)
- [v](_transaction_.transaction.md#v)
- [value](_transaction_.transaction.md#value)

### Methods

- [getBaseFee](_transaction_.transaction.md#getbasefee)
- [getChainId](_transaction_.transaction.md#getchainid)
- [getDataFee](_transaction_.transaction.md#getdatafee)
- [getSenderAddress](_transaction_.transaction.md#getsenderaddress)
- [getSenderPublicKey](_transaction_.transaction.md#getsenderpublickey)
- [getUpfrontCost](_transaction_.transaction.md#getupfrontcost)
- [hash](_transaction_.transaction.md#hash)
- [serialize](_transaction_.transaction.md#serialize)
- [sign](_transaction_.transaction.md#sign)
- [toCreationAddress](_transaction_.transaction.md#tocreationaddress)
- [toJSON](_transaction_.transaction.md#tojson)
- [validate](_transaction_.transaction.md#validate)
- [verifySignature](_transaction_.transaction.md#verifysignature)

## Constructors

### constructor

\+ **new Transaction**(`data`: Buffer | [PrefixedHexString](../modules/_index_.md#prefixedhexstring) | [BufferLike](../modules/_index_.md#bufferlike)[] | [TxData](../interfaces/_index_.txdata.md), `opts`: [TransactionOptions](../interfaces/_index_.transactionoptions.md)): _[Transaction](_transaction_.transaction.md)_

_Defined in [transaction.ts:37](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L37)_

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
  s: '0x5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13',
}
const tx = new Transaction(txData)
```

**Parameters:**

| Name   | Type                                                                                                                                                                                | Default | Description                                                                                                                                               |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data` | Buffer &#124; [PrefixedHexString](../modules/_index_.md#prefixedhexstring) &#124; [BufferLike](../modules/_index_.md#bufferlike)[] &#124; [TxData](../interfaces/_index_.txdata.md) | {}      | A transaction can be initialized with its rlp representation, an array containing the value of its fields in order, or an object containing them by name. |
| `opts` | [TransactionOptions](../interfaces/_index_.transactionoptions.md)                                                                                                                   | {}      | The transaction's options, used to indicate the chain and hardfork the transactions belongs to.                                                           |

**Returns:** _[Transaction](_transaction_.transaction.md)_

## Properties

### data

• **data**: _Buffer_

_Defined in [transaction.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L30)_

---

### gasLimit

• **gasLimit**: _Buffer_

_Defined in [transaction.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L26)_

---

### gasPrice

• **gasPrice**: _Buffer_

_Defined in [transaction.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L27)_

---

### nonce

• **nonce**: _Buffer_

_Defined in [transaction.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L25)_

---

### r

• **r**: _Buffer_

_Defined in [transaction.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L32)_

---

### raw

• **raw**: _Buffer[]_

_Defined in [transaction.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L24)_

---

### s

• **s**: _Buffer_

_Defined in [transaction.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L33)_

---

### to

• **to**: _Buffer_

_Defined in [transaction.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L28)_

---

### v

• **v**: _Buffer_

_Defined in [transaction.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L31)_

---

### value

• **value**: _Buffer_

_Defined in [transaction.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L29)_

## Methods

### getBaseFee

▸ **getBaseFee**(): _BN_

_Defined in [transaction.ts:296](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L296)_

the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** _BN_

---

### getChainId

▸ **getChainId**(): _number_

_Defined in [transaction.ts:202](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L202)_

returns chain ID

**Returns:** _number_

---

### getDataFee

▸ **getDataFee**(): _BN_

_Defined in [transaction.ts:282](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L282)_

The amount of gas paid for the data in this tx

**Returns:** _BN_

---

### getSenderAddress

▸ **getSenderAddress**(): _Buffer_

_Defined in [transaction.ts:209](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L209)_

returns the sender's address

**Returns:** _Buffer_

---

### getSenderPublicKey

▸ **getSenderPublicKey**(): _Buffer_

_Defined in [transaction.ts:221](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L221)_

returns the public key of the sender

**Returns:** _Buffer_

---

### getUpfrontCost

▸ **getUpfrontCost**(): _BN_

_Defined in [transaction.ts:307](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L307)_

the up front amount that an account must have for this transaction to be valid

**Returns:** _BN_

---

### hash

▸ **hash**(`includeSignature`: boolean): _Buffer_

_Defined in [transaction.ts:177](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L177)_

Computes a sha3-256 hash of the serialized tx

**Parameters:**

| Name               | Type    | Default | Description                             |
| ------------------ | ------- | ------- | --------------------------------------- |
| `includeSignature` | boolean | true    | Whether or not to include the signature |

**Returns:** _Buffer_

---

### serialize

▸ **serialize**(): _Buffer_

_Defined in [transaction.ts:337](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L337)_

Returns the rlp encoding of the transaction

**Returns:** _Buffer_

---

### sign

▸ **sign**(`privateKey`: Buffer): _void_

_Defined in [transaction.ts:262](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L262)_

sign a transaction with a given private key

**Parameters:**

| Name         | Type   | Description                |
| ------------ | ------ | -------------------------- |
| `privateKey` | Buffer | Must be 32 bytes in length |

**Returns:** _void_

---

### toCreationAddress

▸ **toCreationAddress**(): _boolean_

_Defined in [transaction.ts:169](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L169)_

If the tx's `to` is to the creation address

**Returns:** _boolean_

---

### toJSON

▸ **toJSON**(`labels`: boolean): _object | string[]_

_Defined in [transaction.ts:346](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L346)_

Returns the transaction in JSON format

**`see`** [ethereumjs-util](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties)

**Parameters:**

| Name     | Type    | Default |
| -------- | ------- | ------- |
| `labels` | boolean | false   |

**Returns:** _object | string[]_

---

### validate

▸ **validate**(): _boolean_

_Defined in [transaction.ts:314](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L314)_

Validates the signature and checks to see if it has enough gas.

**Returns:** _boolean_

▸ **validate**(`stringError`: false): _boolean_

_Defined in [transaction.ts:315](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L315)_

**Parameters:**

| Name          | Type  |
| ------------- | ----- |
| `stringError` | false |

**Returns:** _boolean_

▸ **validate**(`stringError`: true): _string_

_Defined in [transaction.ts:316](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L316)_

**Parameters:**

| Name          | Type |
| ------------- | ---- |
| `stringError` | true |

**Returns:** _string_

---

### verifySignature

▸ **verifySignature**(): _boolean_

_Defined in [transaction.ts:233](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L233)_

Determines if the signature is valid

**Returns:** _boolean_
