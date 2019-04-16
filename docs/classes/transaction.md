[ethereumjs-tx](../README.md) > [Transaction](../classes/transaction.md)

# Class: Transaction

An Ethereum transaction.

## Hierarchy

**Transaction**

↳  [FakeTransaction](faketransaction.md)

## Index

### Constructors

* [constructor](transaction.md#constructor)

### Properties

* [_chainId](transaction.md#_chainid)
* [_common](transaction.md#_common)
* [_from](transaction.md#_from)
* [_senderPubKey](transaction.md#_senderpubkey)
* [data](transaction.md#data)
* [gasLimit](transaction.md#gaslimit)
* [gasPrice](transaction.md#gasprice)
* [nonce](transaction.md#nonce)
* [r](transaction.md#r)
* [raw](transaction.md#raw)
* [s](transaction.md#s)
* [to](transaction.md#to)
* [v](transaction.md#v)
* [value](transaction.md#value)

### Methods

* [getBaseFee](transaction.md#getbasefee)
* [getChainId](transaction.md#getchainid)
* [getDataFee](transaction.md#getdatafee)
* [getSenderAddress](transaction.md#getsenderaddress)
* [getSenderPublicKey](transaction.md#getsenderpublickey)
* [getUpfrontCost](transaction.md#getupfrontcost)
* [hash](transaction.md#hash)
* [serialize](transaction.md#serialize)
* [sign](transaction.md#sign)
* [toCreationAddress](transaction.md#tocreationaddress)
* [validate](transaction.md#validate)
* [verifySignature](transaction.md#verifysignature)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Transaction**(data?: *`Buffer` \| [PrefixedHexString](../#prefixedhexstring) \| [BufferLike](../#bufferlike)[] \| [TxData](../interfaces/txdata.md)*, opts?: *[TransactionOptions](../interfaces/transactionoptions.md)*): [Transaction](transaction.md)

*Defined in [index.ts:37](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L37)*

Creates a new transaction from an object with its fields' values.

*__example__*:
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

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` data | `Buffer` \| [PrefixedHexString](../#prefixedhexstring) \| [BufferLike](../#bufferlike)[] \| [TxData](../interfaces/txdata.md) |  {} |  A transaction can be initialized with its rlp representation, an array containing the value of its fields in order, or an object containing them by name. If the latter is used, a \`chainId\` can also be provided. |
| `Default value` opts | [TransactionOptions](../interfaces/transactionoptions.md) |  {} |  The transaction's options, used to indicate the chain and hardfork the transactions belongs to. |

**Returns:** [Transaction](transaction.md)

___

## Properties

<a id="_chainid"></a>

### `<Private>` _chainId

**● _chainId**: *`number`*

*Defined in [index.ts:35](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L35)*

___
<a id="_common"></a>

### `<Private>` _common

**● _common**: *`Common`*

*Defined in [index.ts:34](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L34)*

___
<a id="_from"></a>

### `<Protected>``<Optional>` _from

**● _from**: *`Buffer`*

*Defined in [index.ts:37](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L37)*

___
<a id="_senderpubkey"></a>

### `<Private>``<Optional>` _senderPubKey

**● _senderPubKey**: *`Buffer`*

*Defined in [index.ts:36](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L36)*

___
<a id="data"></a>

###  data

**● data**: *`Buffer`*

*Defined in [index.ts:29](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L29)*

___
<a id="gaslimit"></a>

###  gasLimit

**● gasLimit**: *`Buffer`*

*Defined in [index.ts:25](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L25)*

___
<a id="gasprice"></a>

###  gasPrice

**● gasPrice**: *`Buffer`*

*Defined in [index.ts:26](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L26)*

___
<a id="nonce"></a>

###  nonce

**● nonce**: *`Buffer`*

*Defined in [index.ts:24](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L24)*

___
<a id="r"></a>

###  r

**● r**: *`Buffer`*

*Defined in [index.ts:31](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L31)*

___
<a id="raw"></a>

###  raw

**● raw**: *`Buffer`[]*

*Defined in [index.ts:23](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L23)*

___
<a id="s"></a>

###  s

**● s**: *`Buffer`*

*Defined in [index.ts:32](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L32)*

___
<a id="to"></a>

###  to

**● to**: *`Buffer`*

*Defined in [index.ts:27](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L27)*

___
<a id="v"></a>

###  v

**● v**: *`Buffer`*

*Defined in [index.ts:30](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L30)*

___
<a id="value"></a>

###  value

**● value**: *`Buffer`*

*Defined in [index.ts:28](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L28)*

___

## Methods

<a id="getbasefee"></a>

###  getBaseFee

▸ **getBaseFee**(): `BN`

*Defined in [index.ts:314](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L314)*

the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** `BN`

___
<a id="getchainid"></a>

###  getChainId

▸ **getChainId**(): `number`

*Defined in [index.ts:228](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L228)*

returns chain ID

**Returns:** `number`

___
<a id="getdatafee"></a>

###  getDataFee

▸ **getDataFee**(): `BN`

*Defined in [index.ts:300](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L300)*

The amount of gas paid for the data in this tx

**Returns:** `BN`

___
<a id="getsenderaddress"></a>

###  getSenderAddress

▸ **getSenderAddress**(): `Buffer`

*Defined in [index.ts:235](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L235)*

returns the sender's address

**Returns:** `Buffer`

___
<a id="getsenderpublickey"></a>

###  getSenderPublicKey

▸ **getSenderPublicKey**(): `Buffer`

*Defined in [index.ts:247](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L247)*

returns the public key of the sender

**Returns:** `Buffer`

___
<a id="getupfrontcost"></a>

###  getUpfrontCost

▸ **getUpfrontCost**(): `BN`

*Defined in [index.ts:325](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L325)*

the up front amount that an account must have for this transaction to be valid

**Returns:** `BN`

___
<a id="hash"></a>

###  hash

▸ **hash**(includeSignature?: *`boolean`*): `Buffer`

*Defined in [index.ts:189](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L189)*

Computes a sha3-256 hash of the serialized tx

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` includeSignature | `boolean` | true |  Whether or not to include the signature |

**Returns:** `Buffer`

___
<a id="serialize"></a>

###  serialize

▸ **serialize**(): `Buffer`

*Defined in [index.ts:355](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L355)*

Returns the rlp encoding of the transaction

**Returns:** `Buffer`

___
<a id="sign"></a>

###  sign

▸ **sign**(privateKey: *`Buffer`*): `void`

*Defined in [index.ts:288](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L288)*

sign a transaction with a given private key

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| privateKey | `Buffer` |  Must be 32 bytes in length |

**Returns:** `void`

___
<a id="tocreationaddress"></a>

###  toCreationAddress

▸ **toCreationAddress**(): `boolean`

*Defined in [index.ts:181](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L181)*

If the tx's `to` is to the creation address

**Returns:** `boolean`

___
<a id="validate"></a>

###  validate

▸ **validate**(): `boolean`

▸ **validate**(stringError: *`false`*): `boolean`

▸ **validate**(stringError: *`true`*): `string`

*Defined in [index.ts:332](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L332)*

Validates the signature and checks to see if it has enough gas.

**Returns:** `boolean`

*Defined in [index.ts:333](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L333)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| stringError | `false` |

**Returns:** `boolean`

*Defined in [index.ts:334](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L334)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| stringError | `true` |

**Returns:** `string`

___
<a id="verifysignature"></a>

###  verifySignature

▸ **verifySignature**(): `boolean`

*Defined in [index.ts:259](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L259)*

Determines if the signature is valid

**Returns:** `boolean`

___

