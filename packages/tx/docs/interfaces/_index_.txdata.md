[ethereumjs-tx](../README.md) › ["index"](../modules/_index_.md) › [TxData](_index_.txdata.md)

# Interface: TxData

A transaction's data.

## Hierarchy

* **TxData**

  ↳ [FakeTxData](_index_.faketxdata.md)

  ↳ [FakeTxData](_types_.faketxdata.md)

## Index

### Properties

* [data](_index_.txdata.md#optional-data)
* [gasLimit](_index_.txdata.md#optional-gaslimit)
* [gasPrice](_index_.txdata.md#optional-gasprice)
* [nonce](_index_.txdata.md#optional-nonce)
* [r](_index_.txdata.md#optional-r)
* [s](_index_.txdata.md#optional-s)
* [to](_index_.txdata.md#optional-to)
* [v](_index_.txdata.md#optional-v)
* [value](_index_.txdata.md#optional-value)

## Properties

### `Optional` data

• **data**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Defined in [types.ts:48](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L48)*

This will contain the data of the message or the init of a contract

___

### `Optional` gasLimit

• **gasLimit**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Defined in [types.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L28)*

The transaction's gas limit.

___

### `Optional` gasPrice

• **gasPrice**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Defined in [types.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L33)*

The transaction's gas price.

___

### `Optional` nonce

• **nonce**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Defined in [types.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L43)*

The transaction's nonce.

___

### `Optional` r

• **r**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Defined in [types.ts:58](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L58)*

EC signature parameter.

___

### `Optional` s

• **s**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Defined in [types.ts:63](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L63)*

EC signature parameter.

___

### `Optional` to

• **to**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Defined in [types.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L38)*

The transaction's the address is sent to.

___

### `Optional` v

• **v**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Defined in [types.ts:53](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L53)*

EC recovery ID.

___

### `Optional` value

• **value**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Defined in [types.ts:68](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L68)*

The amount of Ether sent.
