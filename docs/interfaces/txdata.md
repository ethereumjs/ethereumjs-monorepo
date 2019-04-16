[ethereumjs-tx](../README.md) > [TxData](../interfaces/txdata.md)

# Interface: TxData

A transaction's data.

## Hierarchy

**TxData**

↳  [FakeTxData](faketxdata.md)

## Index

### Properties

* [chainId](txdata.md#chainid)
* [data](txdata.md#data)
* [gasLimit](txdata.md#gaslimit)
* [gasPrice](txdata.md#gasprice)
* [nonce](txdata.md#nonce)
* [r](txdata.md#r)
* [s](txdata.md#s)
* [to](txdata.md#to)
* [v](txdata.md#v)
* [value](txdata.md#value)

---

## Properties

<a id="chainid"></a>

### `<Optional>` chainId

**● chainId**: *`undefined` \| `number`*

*Defined in [types.ts:28](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L28)*

EIP 155 chainId - mainnet: 1, ropsten: 3

___
<a id="data"></a>

### `<Optional>` data

**● data**: *[BufferLike](../#bufferlike)*

*Defined in [types.ts:53](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L53)*

This will contain the data of the message or the init of a contract

___
<a id="gaslimit"></a>

### `<Optional>` gasLimit

**● gasLimit**: *[BufferLike](../#bufferlike)*

*Defined in [types.ts:33](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L33)*

The transaction's gas limit.

___
<a id="gasprice"></a>

### `<Optional>` gasPrice

**● gasPrice**: *[BufferLike](../#bufferlike)*

*Defined in [types.ts:38](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L38)*

The transaction's gas price.

___
<a id="nonce"></a>

### `<Optional>` nonce

**● nonce**: *[BufferLike](../#bufferlike)*

*Defined in [types.ts:48](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L48)*

The transaction's nonce.

___
<a id="r"></a>

### `<Optional>` r

**● r**: *[BufferLike](../#bufferlike)*

*Defined in [types.ts:63](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L63)*

EC signature parameter.

___
<a id="s"></a>

### `<Optional>` s

**● s**: *[BufferLike](../#bufferlike)*

*Defined in [types.ts:68](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L68)*

EC signature parameter.

___
<a id="to"></a>

### `<Optional>` to

**● to**: *[BufferLike](../#bufferlike)*

*Defined in [types.ts:43](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L43)*

The transaction's the address is sent to.

___
<a id="v"></a>

### `<Optional>` v

**● v**: *[BufferLike](../#bufferlike)*

*Defined in [types.ts:58](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L58)*

EC recovery ID.

___
<a id="value"></a>

### `<Optional>` value

**● value**: *[BufferLike](../#bufferlike)*

*Defined in [types.ts:73](https://github.com/ethereumjs/ethereumjs-tx/blob/eece5af/src/types.ts#L73)*

The amount of Ether sent.

___

