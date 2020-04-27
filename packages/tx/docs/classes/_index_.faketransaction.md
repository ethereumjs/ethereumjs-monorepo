[ethereumjs-tx](../README.md) › ["index"](../modules/_index_.md) › [FakeTransaction](_index_.faketransaction.md)

# Class: FakeTransaction

Creates a new transaction object that doesn't need to be signed.

**`param`** A transaction can be initialized with its rlp representation, an array containing
the value of its fields in order, or an object containing them by name.

**`param`** The transaction's options, used to indicate the chain and hardfork the
transactions belongs to.

**`see`** Transaction

## Hierarchy

- [Transaction](_index_.transaction.md)

  ↳ **FakeTransaction**

## Index

### Constructors

- [constructor](_index_.faketransaction.md#constructor)

### Properties

- [data](_index_.faketransaction.md#data)
- [from](_index_.faketransaction.md#from)
- [gasLimit](_index_.faketransaction.md#gaslimit)
- [gasPrice](_index_.faketransaction.md#gasprice)
- [nonce](_index_.faketransaction.md#nonce)
- [r](_index_.faketransaction.md#r)
- [raw](_index_.faketransaction.md#raw)
- [s](_index_.faketransaction.md#s)
- [to](_index_.faketransaction.md#to)
- [v](_index_.faketransaction.md#v)
- [value](_index_.faketransaction.md#value)

### Methods

- [getBaseFee](_index_.faketransaction.md#getbasefee)
- [getChainId](_index_.faketransaction.md#getchainid)
- [getDataFee](_index_.faketransaction.md#getdatafee)
- [getSenderAddress](_index_.faketransaction.md#getsenderaddress)
- [getSenderPublicKey](_index_.faketransaction.md#getsenderpublickey)
- [getUpfrontCost](_index_.faketransaction.md#getupfrontcost)
- [hash](_index_.faketransaction.md#hash)
- [serialize](_index_.faketransaction.md#serialize)
- [sign](_index_.faketransaction.md#sign)
- [toCreationAddress](_index_.faketransaction.md#tocreationaddress)
- [toJSON](_index_.faketransaction.md#tojson)
- [validate](_index_.faketransaction.md#validate)
- [verifySignature](_index_.faketransaction.md#verifysignature)

## Constructors

### constructor

\+ **new FakeTransaction**(`data`: Buffer | [PrefixedHexString](../modules/_index_.md#prefixedhexstring) | [BufferLike](../modules/_index_.md#bufferlike)[] | [FakeTxData](../interfaces/_index_.faketxdata.md), `opts`: [TransactionOptions](../interfaces/_index_.transactionoptions.md)): _[FakeTransaction](_index_.faketransaction.md)_

_Overrides [Transaction](_index_.transaction.md).[constructor](_index_.transaction.md#constructor)_

_Defined in [fake.ts:22](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/fake.ts#L22)_

**Parameters:**

| Name   | Type                                                                                                                                                                                        | Default |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `data` | Buffer &#124; [PrefixedHexString](../modules/_index_.md#prefixedhexstring) &#124; [BufferLike](../modules/_index_.md#bufferlike)[] &#124; [FakeTxData](../interfaces/_index_.faketxdata.md) | {}      |
| `opts` | [TransactionOptions](../interfaces/_index_.transactionoptions.md)                                                                                                                           | {}      |

**Returns:** _[FakeTransaction](_index_.faketransaction.md)_

## Properties

### data

• **data**: _Buffer_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[data](_fake_.faketransaction.md#data)_

_Defined in [transaction.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L30)_

---

### from

• **from**: _Buffer_

_Defined in [fake.ts:22](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/fake.ts#L22)_

Set from address to bypass transaction signing.
This is not an optional property, as its getter never returns undefined.

---

### gasLimit

• **gasLimit**: _Buffer_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[gasLimit](_fake_.faketransaction.md#gaslimit)_

_Defined in [transaction.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L26)_

---

### gasPrice

• **gasPrice**: _Buffer_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[gasPrice](_fake_.faketransaction.md#gasprice)_

_Defined in [transaction.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L27)_

---

### nonce

• **nonce**: _Buffer_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[nonce](_fake_.faketransaction.md#nonce)_

_Defined in [transaction.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L25)_

---

### r

• **r**: _Buffer_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[r](_fake_.faketransaction.md#r)_

_Defined in [transaction.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L32)_

---

### raw

• **raw**: _Buffer[]_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[raw](_fake_.faketransaction.md#raw)_

_Defined in [transaction.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L24)_

---

### s

• **s**: _Buffer_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[s](_fake_.faketransaction.md#s)_

_Defined in [transaction.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L33)_

---

### to

• **to**: _Buffer_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[to](_fake_.faketransaction.md#to)_

_Defined in [transaction.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L28)_

---

### v

• **v**: _Buffer_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[v](_fake_.faketransaction.md#v)_

_Defined in [transaction.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L31)_

---

### value

• **value**: _Buffer_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[value](_fake_.faketransaction.md#value)_

_Defined in [transaction.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L29)_

## Methods

### getBaseFee

▸ **getBaseFee**(): _BN_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[getBaseFee](_fake_.faketransaction.md#getbasefee)_

_Defined in [transaction.ts:296](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L296)_

the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** _BN_

---

### getChainId

▸ **getChainId**(): _number_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[getChainId](_fake_.faketransaction.md#getchainid)_

_Defined in [transaction.ts:202](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L202)_

returns chain ID

**Returns:** _number_

---

### getDataFee

▸ **getDataFee**(): _BN_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[getDataFee](_fake_.faketransaction.md#getdatafee)_

_Defined in [transaction.ts:282](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L282)_

The amount of gas paid for the data in this tx

**Returns:** _BN_

---

### getSenderAddress

▸ **getSenderAddress**(): _Buffer_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[getSenderAddress](_fake_.faketransaction.md#getsenderaddress)_

_Defined in [transaction.ts:209](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L209)_

returns the sender's address

**Returns:** _Buffer_

---

### getSenderPublicKey

▸ **getSenderPublicKey**(): _Buffer_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[getSenderPublicKey](_fake_.faketransaction.md#getsenderpublickey)_

_Defined in [transaction.ts:221](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L221)_

returns the public key of the sender

**Returns:** _Buffer_

---

### getUpfrontCost

▸ **getUpfrontCost**(): _BN_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[getUpfrontCost](_fake_.faketransaction.md#getupfrontcost)_

_Defined in [transaction.ts:307](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L307)_

the up front amount that an account must have for this transaction to be valid

**Returns:** _BN_

---

### hash

▸ **hash**(`includeSignature`: boolean): _Buffer_

_Overrides [Transaction](_index_.transaction.md).[hash](_index_.transaction.md#hash)_

_Defined in [fake.ts:53](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/fake.ts#L53)_

Computes a sha3-256 hash of the serialized tx, using the sender address to generate a fake
signature.

**Parameters:**

| Name               | Type    | Default | Description                             |
| ------------------ | ------- | ------- | --------------------------------------- |
| `includeSignature` | boolean | true    | Whether or not to include the signature |

**Returns:** _Buffer_

---

### serialize

▸ **serialize**(): _Buffer_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[serialize](_fake_.faketransaction.md#serialize)_

_Defined in [transaction.ts:337](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L337)_

Returns the rlp encoding of the transaction

**Returns:** _Buffer_

---

### sign

▸ **sign**(`privateKey`: Buffer): _void_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[sign](_fake_.faketransaction.md#sign)_

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

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[toCreationAddress](_fake_.faketransaction.md#tocreationaddress)_

_Defined in [transaction.ts:169](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L169)_

If the tx's `to` is to the creation address

**Returns:** _boolean_

---

### toJSON

▸ **toJSON**(`labels`: boolean): _object | string[]_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[toJSON](_fake_.faketransaction.md#tojson)_

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

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[validate](_fake_.faketransaction.md#validate)_

_Defined in [transaction.ts:314](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L314)_

Validates the signature and checks to see if it has enough gas.

**Returns:** _boolean_

▸ **validate**(`stringError`: false): _boolean_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[validate](_fake_.faketransaction.md#validate)_

_Defined in [transaction.ts:315](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L315)_

**Parameters:**

| Name          | Type  |
| ------------- | ----- |
| `stringError` | false |

**Returns:** _boolean_

▸ **validate**(`stringError`: true): _string_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[validate](_fake_.faketransaction.md#validate)_

_Defined in [transaction.ts:316](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L316)_

**Parameters:**

| Name          | Type |
| ------------- | ---- |
| `stringError` | true |

**Returns:** _string_

---

### verifySignature

▸ **verifySignature**(): _boolean_

_Inherited from [FakeTransaction](_fake_.faketransaction.md).[verifySignature](_fake_.faketransaction.md#verifysignature)_

_Defined in [transaction.ts:233](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/transaction.ts#L233)_

Determines if the signature is valid

**Returns:** _boolean_
