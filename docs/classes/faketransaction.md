[ethereumjs-tx](../README.md) > [FakeTransaction](../classes/faketransaction.md)

# Class: FakeTransaction

Creates a new transaction object that doesn't need to be signed.

_**param**_: A transaction can be initialized with its rlp representation, an array containing the value of its fields in order, or an object containing them by name. If the latter is used, a `chainId` and `from` can also be provided.

_**param**_: The transaction's options, used to indicate the chain and hardfork the transactions belongs to.

_**see**_: Transaction

## Hierarchy

[Transaction](transaction.md)

**↳ FakeTransaction**

## Index

### Constructors

- [constructor](faketransaction.md#constructor)

### Properties

- [\_from](faketransaction.md#_from)
- [data](faketransaction.md#data)
- [from](faketransaction.md#from)
- [gasLimit](faketransaction.md#gaslimit)
- [gasPrice](faketransaction.md#gasprice)
- [nonce](faketransaction.md#nonce)
- [r](faketransaction.md#r)
- [raw](faketransaction.md#raw)
- [s](faketransaction.md#s)
- [to](faketransaction.md#to)
- [v](faketransaction.md#v)
- [value](faketransaction.md#value)

### Methods

- [getBaseFee](faketransaction.md#getbasefee)
- [getChainId](faketransaction.md#getchainid)
- [getDataFee](faketransaction.md#getdatafee)
- [getSenderAddress](faketransaction.md#getsenderaddress)
- [getSenderPublicKey](faketransaction.md#getsenderpublickey)
- [getUpfrontCost](faketransaction.md#getupfrontcost)
- [hash](faketransaction.md#hash)
- [serialize](faketransaction.md#serialize)
- [sign](faketransaction.md#sign)
- [toCreationAddress](faketransaction.md#tocreationaddress)
- [validate](faketransaction.md#validate)
- [verifySignature](faketransaction.md#verifysignature)

---

## Constructors

<a id="constructor"></a>

### constructor

⊕ **new FakeTransaction**(data?: _`Buffer` \| [PrefixedHexString](../#prefixedhexstring) \| [BufferLike](../#bufferlike)[] \| [FakeTxData](../interfaces/faketxdata.md)_, opts?: _[TransactionOptions](../interfaces/transactionoptions.md)_): [FakeTransaction](faketransaction.md)

_Overrides [Transaction](transaction.md).[constructor](transaction.md#constructor)_

_Defined in [fake.ts:23](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/fake.ts#L23)_

**Parameters:**

| Name                 | Type                                                                                                                                  | Default value |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `Default value` data | `Buffer` \| [PrefixedHexString](../#prefixedhexstring) \| [BufferLike](../#bufferlike)[] \| [FakeTxData](../interfaces/faketxdata.md) | {}            |
| `Default value` opts | [TransactionOptions](../interfaces/transactionoptions.md)                                                                             | {}            |

**Returns:** [FakeTransaction](faketransaction.md)

---

## Properties

<a id="_from"></a>

### ` <Protected>``<Optional> ` \_from

**● \_from**: _`Buffer`_

_Inherited from [Transaction](transaction.md).[\_from](transaction.md#_from)_

_Defined in [index.ts:37](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L37)_

---

<a id="data"></a>

### data

**● data**: _`Buffer`_

_Inherited from [Transaction](transaction.md).[data](transaction.md#data)_

_Defined in [index.ts:29](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L29)_

---

<a id="from"></a>

### from

**● from**: _`Buffer`_

_Defined in [fake.ts:23](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/fake.ts#L23)_

Set from address to bypass transaction signing. This is not an optional property, as its getter never returns undefined.

---

<a id="gaslimit"></a>

### gasLimit

**● gasLimit**: _`Buffer`_

_Inherited from [Transaction](transaction.md).[gasLimit](transaction.md#gaslimit)_

_Defined in [index.ts:25](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L25)_

---

<a id="gasprice"></a>

### gasPrice

**● gasPrice**: _`Buffer`_

_Inherited from [Transaction](transaction.md).[gasPrice](transaction.md#gasprice)_

_Defined in [index.ts:26](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L26)_

---

<a id="nonce"></a>

### nonce

**● nonce**: _`Buffer`_

_Inherited from [Transaction](transaction.md).[nonce](transaction.md#nonce)_

_Defined in [index.ts:24](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L24)_

---

<a id="r"></a>

### r

**● r**: _`Buffer`_

_Inherited from [Transaction](transaction.md).[r](transaction.md#r)_

_Defined in [index.ts:31](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L31)_

---

<a id="raw"></a>

### raw

**● raw**: _`Buffer`[]_

_Inherited from [Transaction](transaction.md).[raw](transaction.md#raw)_

_Defined in [index.ts:23](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L23)_

---

<a id="s"></a>

### s

**● s**: _`Buffer`_

_Inherited from [Transaction](transaction.md).[s](transaction.md#s)_

_Defined in [index.ts:32](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L32)_

---

<a id="to"></a>

### to

**● to**: _`Buffer`_

_Inherited from [Transaction](transaction.md).[to](transaction.md#to)_

_Defined in [index.ts:27](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L27)_

---

<a id="v"></a>

### v

**● v**: _`Buffer`_

_Inherited from [Transaction](transaction.md).[v](transaction.md#v)_

_Defined in [index.ts:30](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L30)_

---

<a id="value"></a>

### value

**● value**: _`Buffer`_

_Inherited from [Transaction](transaction.md).[value](transaction.md#value)_

_Defined in [index.ts:28](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L28)_

---

## Methods

<a id="getbasefee"></a>

### getBaseFee

▸ **getBaseFee**(): `BN`

_Inherited from [Transaction](transaction.md).[getBaseFee](transaction.md#getbasefee)_

_Defined in [index.ts:314](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L314)_

the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** `BN`

---

<a id="getchainid"></a>

### getChainId

▸ **getChainId**(): `number`

_Inherited from [Transaction](transaction.md).[getChainId](transaction.md#getchainid)_

_Defined in [index.ts:228](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L228)_

returns chain ID

**Returns:** `number`

---

<a id="getdatafee"></a>

### getDataFee

▸ **getDataFee**(): `BN`

_Inherited from [Transaction](transaction.md).[getDataFee](transaction.md#getdatafee)_

_Defined in [index.ts:300](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L300)_

The amount of gas paid for the data in this tx

**Returns:** `BN`

---

<a id="getsenderaddress"></a>

### getSenderAddress

▸ **getSenderAddress**(): `Buffer`

_Inherited from [Transaction](transaction.md).[getSenderAddress](transaction.md#getsenderaddress)_

_Defined in [index.ts:235](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L235)_

returns the sender's address

**Returns:** `Buffer`

---

<a id="getsenderpublickey"></a>

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Buffer`

_Inherited from [Transaction](transaction.md).[getSenderPublicKey](transaction.md#getsenderpublickey)_

_Defined in [index.ts:247](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L247)_

returns the public key of the sender

**Returns:** `Buffer`

---

<a id="getupfrontcost"></a>

### getUpfrontCost

▸ **getUpfrontCost**(): `BN`

_Inherited from [Transaction](transaction.md).[getUpfrontCost](transaction.md#getupfrontcost)_

_Defined in [index.ts:325](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L325)_

the up front amount that an account must have for this transaction to be valid

**Returns:** `BN`

---

<a id="hash"></a>

### hash

▸ **hash**(includeSignature?: _`boolean`_): `Buffer`

_Overrides [Transaction](transaction.md).[hash](transaction.md#hash)_

_Defined in [fake.ts:54](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/fake.ts#L54)_

Computes a sha3-256 hash of the serialized tx, using the sender address to generate a fake signature.

**Parameters:**

| Name                             | Type      | Default value | Description                             |
| -------------------------------- | --------- | ------------- | --------------------------------------- |
| `Default value` includeSignature | `boolean` | true          | Whether or not to include the signature |

**Returns:** `Buffer`

---

<a id="serialize"></a>

### serialize

▸ **serialize**(): `Buffer`

_Inherited from [Transaction](transaction.md).[serialize](transaction.md#serialize)_

_Defined in [index.ts:355](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L355)_

Returns the rlp encoding of the transaction

**Returns:** `Buffer`

---

<a id="sign"></a>

### sign

▸ **sign**(privateKey: _`Buffer`_): `void`

_Inherited from [Transaction](transaction.md).[sign](transaction.md#sign)_

_Defined in [index.ts:288](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L288)_

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

_Inherited from [Transaction](transaction.md).[toCreationAddress](transaction.md#tocreationaddress)_

_Defined in [index.ts:181](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L181)_

If the tx's `to` is to the creation address

**Returns:** `boolean`

---

<a id="validate"></a>

### validate

▸ **validate**(): `boolean`

▸ **validate**(stringError: _`false`_): `boolean`

▸ **validate**(stringError: _`true`_): `string`

_Inherited from [Transaction](transaction.md).[validate](transaction.md#validate)_

_Defined in [index.ts:332](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L332)_

Validates the signature and checks to see if it has enough gas.

**Returns:** `boolean`

_Inherited from [Transaction](transaction.md).[validate](transaction.md#validate)_

_Defined in [index.ts:333](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L333)_

**Parameters:**

| Name        | Type    |
| ----------- | ------- |
| stringError | `false` |

**Returns:** `boolean`

_Inherited from [Transaction](transaction.md).[validate](transaction.md#validate)_

_Defined in [index.ts:334](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L334)_

**Parameters:**

| Name        | Type   |
| ----------- | ------ |
| stringError | `true` |

**Returns:** `string`

---

<a id="verifysignature"></a>

### verifySignature

▸ **verifySignature**(): `boolean`

_Inherited from [Transaction](transaction.md).[verifySignature](transaction.md#verifysignature)_

_Defined in [index.ts:259](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L259)_

Determines if the signature is valid

**Returns:** `boolean`

---
