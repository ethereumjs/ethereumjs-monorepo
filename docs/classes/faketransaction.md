[ethereumjs-tx](../README.md) > [FakeTransaction](../classes/faketransaction.md)

# Class: FakeTransaction

Creates a new transaction object that doesn't need to be signed.

*__param__*: A transaction can be initialized with its rlp representation, an array containing the value of its fields in order, or an object containing them by name. If the latter is used, a `chainId` and `from` can also be provided.

*__param__*: The transaction's options, used to indicate the chain and hardfork the transactions belongs to.

*__see__*: Transaction

## Hierarchy

 [Transaction](transaction.md)

**↳ FakeTransaction**

## Index

### Constructors

* [constructor](faketransaction.md#constructor)

### Properties

* [_from](faketransaction.md#_from)
* [data](faketransaction.md#data)
* [from](faketransaction.md#from)
* [gasLimit](faketransaction.md#gaslimit)
* [gasPrice](faketransaction.md#gasprice)
* [nonce](faketransaction.md#nonce)
* [r](faketransaction.md#r)
* [raw](faketransaction.md#raw)
* [s](faketransaction.md#s)
* [to](faketransaction.md#to)
* [v](faketransaction.md#v)
* [value](faketransaction.md#value)

### Methods

* [getBaseFee](faketransaction.md#getbasefee)
* [getChainId](faketransaction.md#getchainid)
* [getDataFee](faketransaction.md#getdatafee)
* [getSenderAddress](faketransaction.md#getsenderaddress)
* [getSenderPublicKey](faketransaction.md#getsenderpublickey)
* [getUpfrontCost](faketransaction.md#getupfrontcost)
* [hash](faketransaction.md#hash)
* [serialize](faketransaction.md#serialize)
* [sign](faketransaction.md#sign)
* [toCreationAddress](faketransaction.md#tocreationaddress)
* [validate](faketransaction.md#validate)
* [verifySignature](faketransaction.md#verifysignature)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new FakeTransaction**(data?: *`Buffer` \| [PrefixedHexString](../#prefixedhexstring) \| [BufferLike](../#bufferlike)[] \| [FakeTxData](../interfaces/faketxdata.md)*, opts?: *[TransactionOptions](../interfaces/transactionoptions.md)*): [FakeTransaction](faketransaction.md)

*Overrides [Transaction](transaction.md).[constructor](transaction.md#constructor)*

*Defined in [fake.ts:23](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/fake.ts#L23)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` data | `Buffer` \| [PrefixedHexString](../#prefixedhexstring) \| [BufferLike](../#bufferlike)[] \| [FakeTxData](../interfaces/faketxdata.md) |  {} |
| `Default value` opts | [TransactionOptions](../interfaces/transactionoptions.md) |  {} |

**Returns:** [FakeTransaction](faketransaction.md)

___

## Properties

<a id="_from"></a>

### `<Protected>``<Optional>` _from

**● _from**: *`Buffer`*

*Inherited from [Transaction](transaction.md).[_from](transaction.md#_from)*

*Defined in [index.ts:37](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L37)*

___
<a id="data"></a>

###  data

**● data**: *`Buffer`*

*Inherited from [Transaction](transaction.md).[data](transaction.md#data)*

*Defined in [index.ts:29](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L29)*

___
<a id="from"></a>

###  from

**● from**: *`Buffer`*

*Defined in [fake.ts:23](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/fake.ts#L23)*

Set from address to bypass transaction signing. This is not an optional property, as its getter never returns undefined.

___
<a id="gaslimit"></a>

###  gasLimit

**● gasLimit**: *`Buffer`*

*Inherited from [Transaction](transaction.md).[gasLimit](transaction.md#gaslimit)*

*Defined in [index.ts:25](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L25)*

___
<a id="gasprice"></a>

###  gasPrice

**● gasPrice**: *`Buffer`*

*Inherited from [Transaction](transaction.md).[gasPrice](transaction.md#gasprice)*

*Defined in [index.ts:26](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L26)*

___
<a id="nonce"></a>

###  nonce

**● nonce**: *`Buffer`*

*Inherited from [Transaction](transaction.md).[nonce](transaction.md#nonce)*

*Defined in [index.ts:24](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L24)*

___
<a id="r"></a>

###  r

**● r**: *`Buffer`*

*Inherited from [Transaction](transaction.md).[r](transaction.md#r)*

*Defined in [index.ts:31](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L31)*

___
<a id="raw"></a>

###  raw

**● raw**: *`Buffer`[]*

*Inherited from [Transaction](transaction.md).[raw](transaction.md#raw)*

*Defined in [index.ts:23](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L23)*

___
<a id="s"></a>

###  s

**● s**: *`Buffer`*

*Inherited from [Transaction](transaction.md).[s](transaction.md#s)*

*Defined in [index.ts:32](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L32)*

___
<a id="to"></a>

###  to

**● to**: *`Buffer`*

*Inherited from [Transaction](transaction.md).[to](transaction.md#to)*

*Defined in [index.ts:27](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L27)*

___
<a id="v"></a>

###  v

**● v**: *`Buffer`*

*Inherited from [Transaction](transaction.md).[v](transaction.md#v)*

*Defined in [index.ts:30](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L30)*

___
<a id="value"></a>

###  value

**● value**: *`Buffer`*

*Inherited from [Transaction](transaction.md).[value](transaction.md#value)*

*Defined in [index.ts:28](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L28)*

___

## Methods

<a id="getbasefee"></a>

###  getBaseFee

▸ **getBaseFee**(): `BN`

*Inherited from [Transaction](transaction.md).[getBaseFee](transaction.md#getbasefee)*

*Defined in [index.ts:314](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L314)*

the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** `BN`

___
<a id="getchainid"></a>

###  getChainId

▸ **getChainId**(): `number`

*Inherited from [Transaction](transaction.md).[getChainId](transaction.md#getchainid)*

*Defined in [index.ts:228](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L228)*

returns chain ID

**Returns:** `number`

___
<a id="getdatafee"></a>

###  getDataFee

▸ **getDataFee**(): `BN`

*Inherited from [Transaction](transaction.md).[getDataFee](transaction.md#getdatafee)*

*Defined in [index.ts:300](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L300)*

The amount of gas paid for the data in this tx

**Returns:** `BN`

___
<a id="getsenderaddress"></a>

###  getSenderAddress

▸ **getSenderAddress**(): `Buffer`

*Inherited from [Transaction](transaction.md).[getSenderAddress](transaction.md#getsenderaddress)*

*Defined in [index.ts:235](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L235)*

returns the sender's address

**Returns:** `Buffer`

___
<a id="getsenderpublickey"></a>

###  getSenderPublicKey

▸ **getSenderPublicKey**(): `Buffer`

*Inherited from [Transaction](transaction.md).[getSenderPublicKey](transaction.md#getsenderpublickey)*

*Defined in [index.ts:247](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L247)*

returns the public key of the sender

**Returns:** `Buffer`

___
<a id="getupfrontcost"></a>

###  getUpfrontCost

▸ **getUpfrontCost**(): `BN`

*Inherited from [Transaction](transaction.md).[getUpfrontCost](transaction.md#getupfrontcost)*

*Defined in [index.ts:325](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L325)*

the up front amount that an account must have for this transaction to be valid

**Returns:** `BN`

___
<a id="hash"></a>

###  hash

▸ **hash**(includeSignature?: *`boolean`*): `Buffer`

*Overrides [Transaction](transaction.md).[hash](transaction.md#hash)*

*Defined in [fake.ts:54](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/fake.ts#L54)*

Computes a sha3-256 hash of the serialized tx, using the sender address to generate a fake signature.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` includeSignature | `boolean` | true |  Whether or not to include the signature |

**Returns:** `Buffer`

___
<a id="serialize"></a>

###  serialize

▸ **serialize**(): `Buffer`

*Inherited from [Transaction](transaction.md).[serialize](transaction.md#serialize)*

*Defined in [index.ts:355](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L355)*

Returns the rlp encoding of the transaction

**Returns:** `Buffer`

___
<a id="sign"></a>

###  sign

▸ **sign**(privateKey: *`Buffer`*): `void`

*Inherited from [Transaction](transaction.md).[sign](transaction.md#sign)*

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

*Inherited from [Transaction](transaction.md).[toCreationAddress](transaction.md#tocreationaddress)*

*Defined in [index.ts:181](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L181)*

If the tx's `to` is to the creation address

**Returns:** `boolean`

___
<a id="validate"></a>

###  validate

▸ **validate**(): `boolean`

▸ **validate**(stringError: *`false`*): `boolean`

▸ **validate**(stringError: *`true`*): `string`

*Inherited from [Transaction](transaction.md).[validate](transaction.md#validate)*

*Defined in [index.ts:332](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L332)*

Validates the signature and checks to see if it has enough gas.

**Returns:** `boolean`

*Inherited from [Transaction](transaction.md).[validate](transaction.md#validate)*

*Defined in [index.ts:333](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L333)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| stringError | `false` |

**Returns:** `boolean`

*Inherited from [Transaction](transaction.md).[validate](transaction.md#validate)*

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

*Inherited from [Transaction](transaction.md).[verifySignature](transaction.md#verifysignature)*

*Defined in [index.ts:259](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/index.ts#L259)*

Determines if the signature is valid

**Returns:** `boolean`

___

