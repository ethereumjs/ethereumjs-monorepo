[ethereumjs-tx](../README.md) > [Transaction](../classes/transaction.md)

# Class: Transaction

An Ethereum transaction.

## Hierarchy

**Transaction**

↳ [FakeTransaction](faketransaction.md)

## Index

### Constructors

- [constructor](transaction.md#constructor)

### Properties

- [\_common](transaction.md#_common)
- [\_from](transaction.md#_from)
- [\_senderPubKey](transaction.md#_senderpubkey)
- [data](transaction.md#data)
- [gasLimit](transaction.md#gaslimit)
- [gasPrice](transaction.md#gasprice)
- [nonce](transaction.md#nonce)
- [r](transaction.md#r)
- [raw](transaction.md#raw)
- [s](transaction.md#s)
- [to](transaction.md#to)
- [v](transaction.md#v)
- [value](transaction.md#value)

### Methods

- [\_implementsEIP155](transaction.md#_implementseip155)
- [\_isSigned](transaction.md#_issigned)
- [\_overrideVSetterWithValidation](transaction.md#_overridevsetterwithvalidation)
- [\_validateV](transaction.md#_validatev)
- [getBaseFee](transaction.md#getbasefee)
- [getChainId](transaction.md#getchainid)
- [getDataFee](transaction.md#getdatafee)
- [getSenderAddress](transaction.md#getsenderaddress)
- [getSenderPublicKey](transaction.md#getsenderpublickey)
- [getUpfrontCost](transaction.md#getupfrontcost)
- [hash](transaction.md#hash)
- [serialize](transaction.md#serialize)
- [sign](transaction.md#sign)
- [toCreationAddress](transaction.md#tocreationaddress)
- [toJSON](transaction.md#tojson)
- [validate](transaction.md#validate)
- [verifySignature](transaction.md#verifysignature)

---

## Constructors

<a id="constructor"></a>

### constructor

⊕ **new Transaction**(data?: _`Buffer` \| [PrefixedHexString](../#prefixedhexstring) \| [BufferLike](../#bufferlike)[] \| [TxData](../interfaces/txdata.md)_, opts?: _[TransactionOptions](../interfaces/transactionoptions.md)_): [Transaction](transaction.md)

_Defined in [transaction.ts:37](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L37)_

Creates a new transaction from an object with its fields' values.

_**note**_: Transaction objects implement EIP155 by default. To disable it, use the constructor's second parameter to set a chain and hardfork before EIP155 activation (i.e. before Spurious Dragon.)

_**example**_:

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

| Name                 | Type                                                                                                                          | Default value | Description                                                                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Default value` data | `Buffer` \| [PrefixedHexString](../#prefixedhexstring) \| [BufferLike](../#bufferlike)[] \| [TxData](../interfaces/txdata.md) | {}            | A transaction can be initialized with its rlp representation, an array containing the value of its fields in order, or an object containing them by name. |
| `Default value` opts | [TransactionOptions](../interfaces/transactionoptions.md)                                                                     | {}            | The transaction's options, used to indicate the chain and hardfork the transactions belongs to.                                                           |

**Returns:** [Transaction](transaction.md)

---

## Properties

<a id="_common"></a>

### `<Private>` \_common

**● \_common**: _`Common`_

_Defined in [transaction.ts:35](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L35)_

---

<a id="_from"></a>

### ` <Protected>``<Optional> ` \_from

**● \_from**: _`Buffer`_

_Defined in [transaction.ts:37](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L37)_

---

<a id="_senderpubkey"></a>

### ` <Private>``<Optional> ` \_senderPubKey

**● \_senderPubKey**: _`Buffer`_

_Defined in [transaction.ts:36](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L36)_

---

<a id="data"></a>

### data

**● data**: _`Buffer`_

_Defined in [transaction.ts:30](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L30)_

---

<a id="gaslimit"></a>

### gasLimit

**● gasLimit**: _`Buffer`_

_Defined in [transaction.ts:26](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L26)_

---

<a id="gasprice"></a>

### gasPrice

**● gasPrice**: _`Buffer`_

_Defined in [transaction.ts:27](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L27)_

---

<a id="nonce"></a>

### nonce

**● nonce**: _`Buffer`_

_Defined in [transaction.ts:25](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L25)_

---

<a id="r"></a>

### r

**● r**: _`Buffer`_

_Defined in [transaction.ts:32](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L32)_

---

<a id="raw"></a>

### raw

**● raw**: _`Buffer`[]_

_Defined in [transaction.ts:24](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L24)_

---

<a id="s"></a>

### s

**● s**: _`Buffer`_

_Defined in [transaction.ts:33](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L33)_

---

<a id="to"></a>

### to

**● to**: _`Buffer`_

_Defined in [transaction.ts:28](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L28)_

---

<a id="v"></a>

### v

**● v**: _`Buffer`_

_Defined in [transaction.ts:31](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L31)_

---

<a id="value"></a>

### value

**● value**: _`Buffer`_

_Defined in [transaction.ts:29](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L29)_

---

## Methods

<a id="_implementseip155"></a>

### `<Private>` \_implementsEIP155

▸ **\_implementsEIP155**(): `boolean`

_Defined in [transaction.ts:395](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L395)_

**Returns:** `boolean`

---

<a id="_issigned"></a>

### `<Private>` \_isSigned

▸ **\_isSigned**(): `boolean`

_Defined in [transaction.ts:376](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L376)_

**Returns:** `boolean`

---

<a id="_overridevsetterwithvalidation"></a>

### `<Private>` \_overrideVSetterWithValidation

▸ **\_overrideVSetterWithValidation**(): `void`

_Defined in [transaction.ts:380](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L380)_

**Returns:** `void`

---

<a id="_validatev"></a>

### `<Private>` \_validateV

▸ **\_validateV**(v?: _`Buffer`_): `void`

_Defined in [transaction.ts:351](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L351)_

**Parameters:**

| Name         | Type     |
| ------------ | -------- |
| `Optional` v | `Buffer` |

**Returns:** `void`

---

<a id="getbasefee"></a>

### getBaseFee

▸ **getBaseFee**(): `BN`

_Defined in [transaction.ts:296](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L296)_

the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** `BN`

---

<a id="getchainid"></a>

### getChainId

▸ **getChainId**(): `number`

_Defined in [transaction.ts:202](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L202)_

returns chain ID

**Returns:** `number`

---

<a id="getdatafee"></a>

### getDataFee

▸ **getDataFee**(): `BN`

_Defined in [transaction.ts:282](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L282)_

The amount of gas paid for the data in this tx

**Returns:** `BN`

---

<a id="getsenderaddress"></a>

### getSenderAddress

▸ **getSenderAddress**(): `Buffer`

_Defined in [transaction.ts:209](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L209)_

returns the sender's address

**Returns:** `Buffer`

---

<a id="getsenderpublickey"></a>

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Buffer`

_Defined in [transaction.ts:221](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L221)_

returns the public key of the sender

**Returns:** `Buffer`

---

<a id="getupfrontcost"></a>

### getUpfrontCost

▸ **getUpfrontCost**(): `BN`

_Defined in [transaction.ts:307](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L307)_

the up front amount that an account must have for this transaction to be valid

**Returns:** `BN`

---

<a id="hash"></a>

### hash

▸ **hash**(includeSignature?: _`boolean`_): `Buffer`

_Defined in [transaction.ts:177](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L177)_

Computes a sha3-256 hash of the serialized tx

**Parameters:**

| Name                             | Type      | Default value | Description                             |
| -------------------------------- | --------- | ------------- | --------------------------------------- |
| `Default value` includeSignature | `boolean` | true          | Whether or not to include the signature |

**Returns:** `Buffer`

---

<a id="serialize"></a>

### serialize

▸ **serialize**(): `Buffer`

_Defined in [transaction.ts:337](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L337)_

Returns the rlp encoding of the transaction

**Returns:** `Buffer`

---

<a id="sign"></a>

### sign

▸ **sign**(privateKey: _`Buffer`_): `void`

_Defined in [transaction.ts:262](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L262)_

sign a transaction with a given private key

**Parameters:**

| Name       | Type     | Description                |
| ---------- | -------- | -------------------------- |
| privateKey | `Buffer` | Must be 32 bytes in length |

**Returns:** `void`

---

<a id="tocreationaddress"></a>

### toCreationAddress

▸ **toCreationAddress**(): `boolean`

_Defined in [transaction.ts:169](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L169)_

If the tx's `to` is to the creation address

**Returns:** `boolean`

---

<a id="tojson"></a>

### toJSON

▸ **toJSON**(labels?: _`boolean`_): `object` \| `string`[]

_Defined in [transaction.ts:346](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L346)_

Returns the transaction in JSON format

_**see**_: [ethereumjs-util](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties)

**Parameters:**

| Name                   | Type      | Default value |
| ---------------------- | --------- | ------------- |
| `Default value` labels | `boolean` | false         |

**Returns:** `object` \| `string`[]

---

<a id="validate"></a>

### validate

▸ **validate**(): `boolean`

▸ **validate**(stringError: _`false`_): `boolean`

▸ **validate**(stringError: _`true`_): `string`

_Defined in [transaction.ts:314](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L314)_

Validates the signature and checks to see if it has enough gas.

**Returns:** `boolean`

_Defined in [transaction.ts:315](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L315)_

**Parameters:**

| Name        | Type    |
| ----------- | ------- |
| stringError | `false` |

**Returns:** `boolean`

_Defined in [transaction.ts:316](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L316)_

**Parameters:**

| Name        | Type   |
| ----------- | ------ |
| stringError | `true` |

**Returns:** `string`

---

<a id="verifysignature"></a>

### verifySignature

▸ **verifySignature**(): `boolean`

_Defined in [transaction.ts:233](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/transaction.ts#L233)_

Determines if the signature is valid

**Returns:** `boolean`

---
