[ethereumjs-tx](../README.md) › ["types"](../modules/_types_.md) › [TxData](_types_.txdata.md)

# Interface: TxData

A transaction's data.

## Hierarchy

* **TxData**

## Index

### Properties

* [data](_types_.txdata.md#optional-data)
* [gasLimit](_types_.txdata.md#optional-gaslimit)
* [gasPrice](_types_.txdata.md#optional-gasprice)
* [nonce](_types_.txdata.md#optional-nonce)
* [r](_types_.txdata.md#optional-r)
* [s](_types_.txdata.md#optional-s)
* [to](_types_.txdata.md#optional-to)
* [v](_types_.txdata.md#optional-v)
* [value](_types_.txdata.md#optional-value)

## Properties

### `Optional` data

• **data**? : *[BufferLike](../modules/_types_.md#bufferlike)*

*Defined in [types.ts:47](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L47)*

This will contain the data of the message or the init of a contract

___

### `Optional` gasLimit

• **gasLimit**? : *[BufferLike](../modules/_types_.md#bufferlike)*

*Defined in [types.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L27)*

The transaction's gas limit.

___

### `Optional` gasPrice

• **gasPrice**? : *[BufferLike](../modules/_types_.md#bufferlike)*

*Defined in [types.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L32)*

The transaction's gas price.

___

### `Optional` nonce

• **nonce**? : *[BufferLike](../modules/_types_.md#bufferlike)*

*Defined in [types.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L42)*

The transaction's nonce.

___

### `Optional` r

• **r**? : *[BufferLike](../modules/_types_.md#bufferlike)*

*Defined in [types.ts:57](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L57)*

EC signature parameter.

___

### `Optional` s

• **s**? : *[BufferLike](../modules/_types_.md#bufferlike)*

*Defined in [types.ts:62](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L62)*

EC signature parameter.

___

### `Optional` to

• **to**? : *[BufferLike](../modules/_types_.md#bufferlike)*

*Defined in [types.ts:37](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L37)*

The transaction's the address is sent to.

___

### `Optional` v

• **v**? : *[BufferLike](../modules/_types_.md#bufferlike)*

*Defined in [types.ts:52](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L52)*

EC recovery ID.

___

### `Optional` value

• **value**? : *[BufferLike](../modules/_types_.md#bufferlike)*

*Defined in [types.ts:67](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L67)*

The amount of Ether sent.
