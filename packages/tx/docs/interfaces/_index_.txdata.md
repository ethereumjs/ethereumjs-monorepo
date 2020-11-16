[@ethereumjs/tx](../README.md) › ["index"](../modules/_index_.md) › [TxData](_index_.txdata.md)

# Interface: TxData

An object with an optional field with each of the transaction's values.

## Hierarchy

* **TxData**

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

• **data**? : *BufferLike*

*Defined in [types.ts:61](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L61)*

This will contain the data of the message or the init of a contract.

___

### `Optional` gasLimit

• **gasLimit**? : *BNLike*

*Defined in [types.ts:46](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L46)*

The transaction's gas limit.

___

### `Optional` gasPrice

• **gasPrice**? : *BNLike*

*Defined in [types.ts:41](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L41)*

The transaction's gas price.

___

### `Optional` nonce

• **nonce**? : *BNLike*

*Defined in [types.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L36)*

The transaction's nonce.

___

### `Optional` r

• **r**? : *BNLike*

*Defined in [types.ts:71](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L71)*

EC signature parameter.

___

### `Optional` s

• **s**? : *BNLike*

*Defined in [types.ts:76](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L76)*

EC signature parameter.

___

### `Optional` to

• **to**? : *AddressLike*

*Defined in [types.ts:51](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L51)*

The transaction's the address is sent to.

___

### `Optional` v

• **v**? : *BNLike*

*Defined in [types.ts:66](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L66)*

EC recovery ID.

___

### `Optional` value

• **value**? : *BNLike*

*Defined in [types.ts:56](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L56)*

The amount of Ether sent.
