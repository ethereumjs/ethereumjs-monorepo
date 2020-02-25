[ethereumjs-tx](../README.md) > [FakeTxData](../interfaces/faketxdata.md)

# Interface: FakeTxData

The data of a fake (self-signing) transaction.

## Hierarchy

[TxData](txdata.md)

**↳ FakeTxData**

## Index

### Properties

- [data](faketxdata.md#data)
- [from](faketxdata.md#from)
- [gasLimit](faketxdata.md#gaslimit)
- [gasPrice](faketxdata.md#gasprice)
- [nonce](faketxdata.md#nonce)
- [r](faketxdata.md#r)
- [s](faketxdata.md#s)
- [to](faketxdata.md#to)
- [v](faketxdata.md#v)
- [value](faketxdata.md#value)

---

## Properties

<a id="data"></a>

### `<Optional>` data

**● data**: _[BufferLike](../#bufferlike)_

_Inherited from [TxData](txdata.md).[data](txdata.md#data)_

_Defined in [types.ts:48](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/types.ts#L48)_

This will contain the data of the message or the init of a contract

---

<a id="from"></a>

### `<Optional>` from

**● from**: _[BufferLike](../#bufferlike)_

_Defined in [types.ts:78](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/types.ts#L78)_

The sender of the Tx.

---

<a id="gaslimit"></a>

### `<Optional>` gasLimit

**● gasLimit**: _[BufferLike](../#bufferlike)_

_Inherited from [TxData](txdata.md).[gasLimit](txdata.md#gaslimit)_

_Defined in [types.ts:28](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/types.ts#L28)_

The transaction's gas limit.

---

<a id="gasprice"></a>

### `<Optional>` gasPrice

**● gasPrice**: _[BufferLike](../#bufferlike)_

_Inherited from [TxData](txdata.md).[gasPrice](txdata.md#gasprice)_

_Defined in [types.ts:33](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/types.ts#L33)_

The transaction's gas price.

---

<a id="nonce"></a>

### `<Optional>` nonce

**● nonce**: _[BufferLike](../#bufferlike)_

_Inherited from [TxData](txdata.md).[nonce](txdata.md#nonce)_

_Defined in [types.ts:43](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/types.ts#L43)_

The transaction's nonce.

---

<a id="r"></a>

### `<Optional>` r

**● r**: _[BufferLike](../#bufferlike)_

_Inherited from [TxData](txdata.md).[r](txdata.md#r)_

_Defined in [types.ts:58](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/types.ts#L58)_

EC signature parameter.

---

<a id="s"></a>

### `<Optional>` s

**● s**: _[BufferLike](../#bufferlike)_

_Inherited from [TxData](txdata.md).[s](txdata.md#s)_

_Defined in [types.ts:63](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/types.ts#L63)_

EC signature parameter.

---

<a id="to"></a>

### `<Optional>` to

**● to**: _[BufferLike](../#bufferlike)_

_Inherited from [TxData](txdata.md).[to](txdata.md#to)_

_Defined in [types.ts:38](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/types.ts#L38)_

The transaction's the address is sent to.

---

<a id="v"></a>

### `<Optional>` v

**● v**: _[BufferLike](../#bufferlike)_

_Inherited from [TxData](txdata.md).[v](txdata.md#v)_

_Defined in [types.ts:53](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/types.ts#L53)_

EC recovery ID.

---

<a id="value"></a>

### `<Optional>` value

**● value**: _[BufferLike](../#bufferlike)_

_Inherited from [TxData](txdata.md).[value](txdata.md#value)_

_Defined in [types.ts:68](https://github.com/ethereumjs/ethereumjs-tx/blob/5c81b38/src/types.ts#L68)_

The amount of Ether sent.

---
