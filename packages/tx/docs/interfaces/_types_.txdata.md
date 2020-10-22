[@ethereumjs/tx](../README.md) › ["types"](../modules/_types_.md) › [TxData](_types_.txdata.md)

# Interface: TxData

An object with an optional field with each of the transaction's values.

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

• **data**? : *BufferLike*

*Defined in [types.ts:50](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L50)*

This will contain the data of the message or the init of a contract.

___

### `Optional` gasLimit

• **gasLimit**? : *BNLike*

*Defined in [types.ts:35](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L35)*

The transaction's gas limit.

___

### `Optional` gasPrice

• **gasPrice**? : *BNLike*

*Defined in [types.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L30)*

The transaction's gas price.

___

### `Optional` nonce

• **nonce**? : *BNLike*

*Defined in [types.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L25)*

The transaction's nonce.

___

### `Optional` r

• **r**? : *BNLike*

*Defined in [types.ts:60](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L60)*

EC signature parameter.

___

### `Optional` s

• **s**? : *BNLike*

*Defined in [types.ts:65](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L65)*

EC signature parameter.

___

### `Optional` to

• **to**? : *AddressLike*

*Defined in [types.ts:40](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L40)*

The transaction's the address is sent to.

___

### `Optional` v

• **v**? : *BNLike*

*Defined in [types.ts:55](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L55)*

EC recovery ID.

___

### `Optional` value

• **value**? : *BNLike*

*Defined in [types.ts:45](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/tx/src/types.ts#L45)*

The amount of Ether sent.
