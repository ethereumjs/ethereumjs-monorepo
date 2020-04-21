[ethereumjs-tx](../README.md) › ["index"](../modules/_index_.md) › [FakeTxData](_index_.faketxdata.md)

# Interface: FakeTxData

The data of a fake (self-signing) transaction.

## Hierarchy

* [TxData](_index_.txdata.md)

  ↳ **FakeTxData**

## Index

### Properties

* [data](_index_.faketxdata.md#optional-data)
* [from](_index_.faketxdata.md#optional-from)
* [gasLimit](_index_.faketxdata.md#optional-gaslimit)
* [gasPrice](_index_.faketxdata.md#optional-gasprice)
* [nonce](_index_.faketxdata.md#optional-nonce)
* [r](_index_.faketxdata.md#optional-r)
* [s](_index_.faketxdata.md#optional-s)
* [to](_index_.faketxdata.md#optional-to)
* [v](_index_.faketxdata.md#optional-v)
* [value](_index_.faketxdata.md#optional-value)

## Properties

### `Optional` data

• **data**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Inherited from [TxData](_index_.txdata.md).[data](_index_.txdata.md#optional-data)*

*Defined in [types.ts:48](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L48)*

This will contain the data of the message or the init of a contract

___

### `Optional` from

• **from**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Defined in [types.ts:78](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L78)*

The sender of the Tx.

___

### `Optional` gasLimit

• **gasLimit**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Inherited from [TxData](_index_.txdata.md).[gasLimit](_index_.txdata.md#optional-gaslimit)*

*Defined in [types.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L28)*

The transaction's gas limit.

___

### `Optional` gasPrice

• **gasPrice**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Inherited from [TxData](_index_.txdata.md).[gasPrice](_index_.txdata.md#optional-gasprice)*

*Defined in [types.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L33)*

The transaction's gas price.

___

### `Optional` nonce

• **nonce**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Inherited from [TxData](_index_.txdata.md).[nonce](_index_.txdata.md#optional-nonce)*

*Defined in [types.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L43)*

The transaction's nonce.

___

### `Optional` r

• **r**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Inherited from [TxData](_index_.txdata.md).[r](_index_.txdata.md#optional-r)*

*Defined in [types.ts:58](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L58)*

EC signature parameter.

___

### `Optional` s

• **s**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Inherited from [TxData](_index_.txdata.md).[s](_index_.txdata.md#optional-s)*

*Defined in [types.ts:63](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L63)*

EC signature parameter.

___

### `Optional` to

• **to**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Inherited from [TxData](_index_.txdata.md).[to](_index_.txdata.md#optional-to)*

*Defined in [types.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L38)*

The transaction's the address is sent to.

___

### `Optional` v

• **v**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Inherited from [TxData](_index_.txdata.md).[v](_index_.txdata.md#optional-v)*

*Defined in [types.ts:53](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L53)*

EC recovery ID.

___

### `Optional` value

• **value**? : *[BufferLike](../modules/_index_.md#bufferlike)*

*Inherited from [TxData](_index_.txdata.md).[value](_index_.txdata.md#optional-value)*

*Defined in [types.ts:68](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L68)*

The amount of Ether sent.
