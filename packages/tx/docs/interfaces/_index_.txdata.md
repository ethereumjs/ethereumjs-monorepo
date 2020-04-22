[ethereumjs-tx](../README.md) › ["index"](../modules/_index_.md) › [TxData](_index_.txdata.md)

# Interface: TxData

A transaction's data.

## Hierarchy

- **TxData**

  ↳ [FakeTxData](_index_.faketxdata.md)

  ↳ [FakeTxData](_types_.faketxdata.md)

## Index

### Properties

- [data](_index_.txdata.md#optional-data)
- [gasLimit](_index_.txdata.md#optional-gaslimit)
- [gasPrice](_index_.txdata.md#optional-gasprice)
- [nonce](_index_.txdata.md#optional-nonce)
- [r](_index_.txdata.md#optional-r)
- [s](_index_.txdata.md#optional-s)
- [to](_index_.txdata.md#optional-to)
- [v](_index_.txdata.md#optional-v)
- [value](_index_.txdata.md#optional-value)

## Properties

### `Optional` data

• **data**? : _[BufferLike](../modules/\_index_.md#bufferlike)\_

_Defined in [types.ts:48](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L48)_

This will contain the data of the message or the init of a contract

---

### `Optional` gasLimit

• **gasLimit**? : _[BufferLike](../modules/\_index_.md#bufferlike)\_

_Defined in [types.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L28)_

The transaction's gas limit.

---

### `Optional` gasPrice

• **gasPrice**? : _[BufferLike](../modules/\_index_.md#bufferlike)\_

_Defined in [types.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L33)_

The transaction's gas price.

---

### `Optional` nonce

• **nonce**? : _[BufferLike](../modules/\_index_.md#bufferlike)\_

_Defined in [types.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L43)_

The transaction's nonce.

---

### `Optional` r

• **r**? : _[BufferLike](../modules/\_index_.md#bufferlike)\_

_Defined in [types.ts:58](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L58)_

EC signature parameter.

---

### `Optional` s

• **s**? : _[BufferLike](../modules/\_index_.md#bufferlike)\_

_Defined in [types.ts:63](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L63)_

EC signature parameter.

---

### `Optional` to

• **to**? : _[BufferLike](../modules/\_index_.md#bufferlike)\_

_Defined in [types.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L38)_

The transaction's the address is sent to.

---

### `Optional` v

• **v**? : _[BufferLike](../modules/\_index_.md#bufferlike)\_

_Defined in [types.ts:53](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L53)_

EC recovery ID.

---

### `Optional` value

• **value**? : _[BufferLike](../modules/\_index_.md#bufferlike)\_

_Defined in [types.ts:68](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L68)_

The amount of Ether sent.
