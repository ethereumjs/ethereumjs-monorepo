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

- [\_chainId](transaction.md#_chainid)
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
- [validate](transaction.md#validate)
- [verifySignature](transaction.md#verifysignature)

---

## Constructors

<a id="constructor"></a>

### constructor

⊕ **new Transaction**(data?: _`Buffer` \| [PrefixedHexString](../#prefixedhexstring) \| [BufferLike](../#bufferlike)[] \| [TxData](../interfaces/txdata.md)_, opts?: _[TransactionOptions](../interfaces/transactionoptions.md)_): [Transaction](transaction.md)

_Defined in [transaction.ts:37](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L37)_

Creates a new transaction from an object with its fields' values.

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

| Name                 | Type                                                                                                                          | Default value | Description                                                                                                                                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Default value` data | `Buffer` \| [PrefixedHexString](../#prefixedhexstring) \| [BufferLike](../#bufferlike)[] \| [TxData](../interfaces/txdata.md) | {}            | A transaction can be initialized with its rlp representation, an array containing the value of its fields in order, or an object containing them by name. If the latter is used, a \`chainId\` can also be provided. |
| `Default value` opts | [TransactionOptions](../interfaces/transactionoptions.md)                                                                     | {}            | The transaction's options, used to indicate the chain and hardfork the transactions belongs to.                                                                                                                      |

**Returns:** [Transaction](transaction.md)

---

## Properties

<a id="_chainid"></a>

### `<Private>` \_chainId

**● \_chainId**: _`number`_

_Defined in [transaction.ts:35](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L35)_

---

<a id="_common"></a>

### `<Private>` \_common

**● \_common**: _`Common`_

_Defined in [transaction.ts:34](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L34)_

---

<a id="_from"></a>

### ` <Protected>``<Optional> ` \_from

**● \_from**: _`Buffer`_

_Defined in [transaction.ts:37](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L37)_

---

<a id="_senderpubkey"></a>

### ` <Private>``<Optional> ` \_senderPubKey

**● \_senderPubKey**: _`Buffer`_

_Defined in [transaction.ts:36](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L36)_

---

<a id="data"></a>

### data

**● data**: _`Buffer`_

_Defined in [transaction.ts:29](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L29)_

---

<a id="gaslimit"></a>

### gasLimit

**● gasLimit**: _`Buffer`_

_Defined in [transaction.ts:25](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L25)_

---

<a id="gasprice"></a>

### gasPrice

**● gasPrice**: _`Buffer`_

_Defined in [transaction.ts:26](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L26)_

---

<a id="nonce"></a>

### nonce

**● nonce**: _`Buffer`_

_Defined in [transaction.ts:24](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L24)_

---

<a id="r"></a>

### r

**● r**: _`Buffer`_

_Defined in [transaction.ts:31](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L31)_

---

<a id="raw"></a>

### raw

**● raw**: _`Buffer`[]_

_Defined in [transaction.ts:23](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L23)_

---

<a id="s"></a>

### s

**● s**: _`Buffer`_

_Defined in [transaction.ts:32](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L32)_

---

<a id="to"></a>

### to

**● to**: _`Buffer`_

_Defined in [transaction.ts:27](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L27)_

---

<a id="v"></a>

### v

**● v**: _`Buffer`_

_Defined in [transaction.ts:30](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L30)_

---

<a id="value"></a>

### value

**● value**: _`Buffer`_

_Defined in [transaction.ts:28](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L28)_

---

## Methods

<a id="getbasefee"></a>

### getBaseFee

▸ **getBaseFee**(): `BN`

_Defined in [transaction.ts:314](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L314)_

the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** `BN`

---

<a id="getchainid"></a>

### getChainId

▸ **getChainId**(): `number`

_Defined in [transaction.ts:228](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L228)_

returns chain ID

**Returns:** `number`

---

<a id="getdatafee"></a>

### getDataFee

▸ **getDataFee**(): `BN`

_Defined in [transaction.ts:300](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L300)_

The amount of gas paid for the data in this tx

**Returns:** `BN`

---

<a id="getsenderaddress"></a>

### getSenderAddress

▸ **getSenderAddress**(): `Buffer`

_Defined in [transaction.ts:235](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L235)_

returns the sender's address

**Returns:** `Buffer`

---

<a id="getsenderpublickey"></a>

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Buffer`

_Defined in [transaction.ts:247](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L247)_

returns the public key of the sender

**Returns:** `Buffer`

---

<a id="getupfrontcost"></a>

### getUpfrontCost

▸ **getUpfrontCost**(): `BN`

_Defined in [transaction.ts:325](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L325)_

the up front amount that an account must have for this transaction to be valid

**Returns:** `BN`

---

<a id="hash"></a>

### hash

▸ **hash**(includeSignature?: _`boolean`_): `Buffer`

_Defined in [transaction.ts:189](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L189)_

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

_Defined in [transaction.ts:355](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L355)_

Returns the rlp encoding of the transaction

**Returns:** `Buffer`

---

<a id="sign"></a>

### sign

▸ **sign**(privateKey: _`Buffer`_): `void`

_Defined in [transaction.ts:288](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L288)_

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

_Defined in [transaction.ts:181](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L181)_

If the tx's `to` is to the creation address

**Returns:** `boolean`

---

<a id="validate"></a>

### validate

▸ **validate**(): `boolean`

▸ **validate**(stringError: _`false`_): `boolean`

▸ **validate**(stringError: _`true`_): `string`

_Defined in [transaction.ts:332](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L332)_

Validates the signature and checks to see if it has enough gas.

**Returns:** `boolean`

_Defined in [transaction.ts:333](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L333)_

**Parameters:**

| Name        | Type    |
| ----------- | ------- |
| stringError | `false` |

**Returns:** `boolean`

_Defined in [transaction.ts:334](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L334)_

**Parameters:**

| Name        | Type   |
| ----------- | ------ |
| stringError | `true` |

**Returns:** `string`

---

<a id="verifysignature"></a>

### verifySignature

▸ **verifySignature**(): `boolean`

_Defined in [transaction.ts:259](https://github.com/alcuadrado/ethereumjs-tx/blob/84f5b82/src/transaction.ts#L259)_

Determines if the signature is valid

**Returns:** `boolean`

---
