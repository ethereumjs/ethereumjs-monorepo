[ethereumjs-tx](../README.md) › ["index"](../modules/_index_.md) › [FakeTxData](_index_.faketxdata.md)

# Interface: FakeTxData

The data of a fake (self-signing) transaction.

## Hierarchy

- [TxData](_index_.txdata.md)

  ↳ **FakeTxData**

## Index

### Properties

- [data](_index_.faketxdata.md#optional-data)
- [from](_index_.faketxdata.md#optional-from)
- [gasLimit](_index_.faketxdata.md#optional-gaslimit)
- [gasPrice](_index_.faketxdata.md#optional-gasprice)
- [nonce](_index_.faketxdata.md#optional-nonce)
- [r](_index_.faketxdata.md#optional-r)
- [s](_index_.faketxdata.md#optional-s)
- [to](_index_.faketxdata.md#optional-to)
- [v](_index_.faketxdata.md#optional-v)
- [value](_index_.faketxdata.md#optional-value)

## Properties

### `Optional` data

• **data**? : _[BufferLike](../modules/_index_.md#bufferlike)_

_Inherited from [TxData](_index_.txdata.md).[data](_index_.txdata.md#optional-data)_

_Defined in [types.ts:48](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L48)_

This will contain the data of the message or the init of a contract

---

### `Optional` from

• **from**? : _[BufferLike](../modules/_index_.md#bufferlike)_

_Defined in [types.ts:78](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L78)_

The sender of the Tx.

---

### `Optional` gasLimit

• **gasLimit**? : _[BufferLike](../modules/_index_.md#bufferlike)_

_Inherited from [TxData](_index_.txdata.md).[gasLimit](_index_.txdata.md#optional-gaslimit)_

_Defined in [types.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L28)_

The transaction's gas limit.

---

### `Optional` gasPrice

• **gasPrice**? : _[BufferLike](../modules/_index_.md#bufferlike)_

_Inherited from [TxData](_index_.txdata.md).[gasPrice](_index_.txdata.md#optional-gasprice)_

_Defined in [types.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L33)_

The transaction's gas price.

---

### `Optional` nonce

• **nonce**? : _[BufferLike](../modules/_index_.md#bufferlike)_

_Inherited from [TxData](_index_.txdata.md).[nonce](_index_.txdata.md#optional-nonce)_

_Defined in [types.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L43)_

The transaction's nonce.

---

### `Optional` r

• **r**? : _[BufferLike](../modules/_index_.md#bufferlike)_

_Inherited from [TxData](_index_.txdata.md).[r](_index_.txdata.md#optional-r)_

_Defined in [types.ts:58](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L58)_

EC signature parameter.

---

### `Optional` s

• **s**? : _[BufferLike](../modules/_index_.md#bufferlike)_

_Inherited from [TxData](_index_.txdata.md).[s](_index_.txdata.md#optional-s)_

_Defined in [types.ts:63](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L63)_

EC signature parameter.

---

### `Optional` to

• **to**? : _[BufferLike](../modules/_index_.md#bufferlike)_

_Inherited from [TxData](_index_.txdata.md).[to](_index_.txdata.md#optional-to)_

_Defined in [types.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L38)_

The transaction's the address is sent to.

---

### `Optional` v

• **v**? : _[BufferLike](../modules/_index_.md#bufferlike)_

_Inherited from [TxData](_index_.txdata.md).[v](_index_.txdata.md#optional-v)_

_Defined in [types.ts:53](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L53)_

EC recovery ID.

---

### `Optional` value

• **value**? : _[BufferLike](../modules/_index_.md#bufferlike)_

_Inherited from [TxData](_index_.txdata.md).[value](_index_.txdata.md#optional-value)_

_Defined in [types.ts:68](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L68)_

The amount of Ether sent.
