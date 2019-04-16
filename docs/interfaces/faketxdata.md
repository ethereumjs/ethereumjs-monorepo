[ethereumjs-tx](../README.md) > [FakeTxData](../interfaces/faketxdata.md)

# Interface: FakeTxData

The data of a fake (self-signing) transaction.

## Hierarchy

 [TxData](txdata.md)

**↳ FakeTxData**

## Index

### Properties

* [chainId](faketxdata.md#chainid)
* [data](faketxdata.md#data)
* [from](faketxdata.md#from)
* [gasLimit](faketxdata.md#gaslimit)
* [gasPrice](faketxdata.md#gasprice)
* [nonce](faketxdata.md#nonce)
* [r](faketxdata.md#r)
* [s](faketxdata.md#s)
* [to](faketxdata.md#to)
* [v](faketxdata.md#v)
* [value](faketxdata.md#value)

---

## Properties

<a id="chainid"></a>

### `<Optional>` chainId

**● chainId**: *`undefined` \| `number`*

*Inherited from [TxData](txdata.md).[chainId](txdata.md#chainid)*

*Defined in [types.ts:28](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L28)*

EIP 155 chainId - mainnet: 1, ropsten: 3

___
<a id="data"></a>

### `<Optional>` data

**● data**: *[BufferLike](../#bufferlike)*

*Inherited from [TxData](txdata.md).[data](txdata.md#data)*

*Defined in [types.ts:53](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L53)*

This will contain the data of the message or the init of a contract

___
<a id="from"></a>

### `<Optional>` from

**● from**: *[BufferLike](../#bufferlike)*

*Defined in [types.ts:83](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L83)*

The sender of the Tx.

___
<a id="gaslimit"></a>

### `<Optional>` gasLimit

**● gasLimit**: *[BufferLike](../#bufferlike)*

*Inherited from [TxData](txdata.md).[gasLimit](txdata.md#gaslimit)*

*Defined in [types.ts:33](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L33)*

The transaction's gas limit.

___
<a id="gasprice"></a>

### `<Optional>` gasPrice

**● gasPrice**: *[BufferLike](../#bufferlike)*

*Inherited from [TxData](txdata.md).[gasPrice](txdata.md#gasprice)*

*Defined in [types.ts:38](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L38)*

The transaction's gas price.

___
<a id="nonce"></a>

### `<Optional>` nonce

**● nonce**: *[BufferLike](../#bufferlike)*

*Inherited from [TxData](txdata.md).[nonce](txdata.md#nonce)*

*Defined in [types.ts:48](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L48)*

The transaction's nonce.

___
<a id="r"></a>

### `<Optional>` r

**● r**: *[BufferLike](../#bufferlike)*

*Inherited from [TxData](txdata.md).[r](txdata.md#r)*

*Defined in [types.ts:63](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L63)*

EC signature parameter.

___
<a id="s"></a>

### `<Optional>` s

**● s**: *[BufferLike](../#bufferlike)*

*Inherited from [TxData](txdata.md).[s](txdata.md#s)*

*Defined in [types.ts:68](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L68)*

EC signature parameter.

___
<a id="to"></a>

### `<Optional>` to

**● to**: *[BufferLike](../#bufferlike)*

*Inherited from [TxData](txdata.md).[to](txdata.md#to)*

*Defined in [types.ts:43](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L43)*

The transaction's the address is sent to.

___
<a id="v"></a>

### `<Optional>` v

**● v**: *[BufferLike](../#bufferlike)*

*Inherited from [TxData](txdata.md).[v](txdata.md#v)*

*Defined in [types.ts:58](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L58)*

EC recovery ID.

___
<a id="value"></a>

### `<Optional>` value

**● value**: *[BufferLike](../#bufferlike)*

*Inherited from [TxData](txdata.md).[value](txdata.md#value)*

*Defined in [types.ts:73](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L73)*

The amount of Ether sent.

___

