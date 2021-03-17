[@ethereumjs/tx](../README.md) › ["index"](../modules/_index_.md) › [AccessListEIP2930TxData](_index_.accesslisteip2930txdata.md)

# Interface: AccessListEIP2930TxData

An object with an optional field with each of the transaction's values.

## Hierarchy

* object

  ↳ **AccessListEIP2930TxData**

## Index

### Properties

* [accessList](_index_.accesslisteip2930txdata.md#optional-accesslist)
* [chainId](_index_.accesslisteip2930txdata.md#optional-chainid)
* [data](_index_.accesslisteip2930txdata.md#optional-data)
* [gasLimit](_index_.accesslisteip2930txdata.md#optional-gaslimit)
* [gasPrice](_index_.accesslisteip2930txdata.md#optional-gasprice)
* [nonce](_index_.accesslisteip2930txdata.md#optional-nonce)
* [r](_index_.accesslisteip2930txdata.md#optional-r)
* [s](_index_.accesslisteip2930txdata.md#optional-s)
* [to](_index_.accesslisteip2930txdata.md#optional-to)
* [type](_index_.accesslisteip2930txdata.md#optional-type)
* [v](_index_.accesslisteip2930txdata.md#optional-v)
* [value](_index_.accesslisteip2930txdata.md#optional-value)

## Properties

### `Optional` accessList

• **accessList**? : *[AccessListBuffer](../modules/_index_.md#accesslistbuffer) | [AccessList](../modules/_index_.md#accesslist)*

*Defined in [types.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L128)*

The access list which contains the addresses/storage slots which the transaction wishes to access

___

### `Optional` chainId

• **chainId**? : *BNLike*

*Defined in [types.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L123)*

The transaction's chain ID

___

### `Optional` data

• **data**? : *BufferLike*

*Inherited from [__type](../modules/_index_.md#__type).[data](../modules/_index_.md#optional-data)*

*Defined in [types.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L98)*

This will contain the data of the message or the init of a contract.

___

### `Optional` gasLimit

• **gasLimit**? : *BNLike*

*Inherited from [__type](../modules/_index_.md#__type).[gasLimit](../modules/_index_.md#optional-gaslimit)*

*Defined in [types.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L83)*

The transaction's gas limit.

___

### `Optional` gasPrice

• **gasPrice**? : *BNLike*

*Inherited from [__type](../modules/_index_.md#__type).[gasPrice](../modules/_index_.md#optional-gasprice)*

*Defined in [types.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L78)*

The transaction's gas price.

___

### `Optional` nonce

• **nonce**? : *BNLike*

*Inherited from [__type](../modules/_index_.md#__type).[nonce](../modules/_index_.md#optional-nonce)*

*Defined in [types.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L73)*

The transaction's nonce.

___

### `Optional` r

• **r**? : *BNLike*

*Inherited from [__type](../modules/_index_.md#__type).[r](../modules/_index_.md#optional-r)*

*Defined in [types.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L108)*

EC signature parameter.

___

### `Optional` s

• **s**? : *BNLike*

*Inherited from [__type](../modules/_index_.md#__type).[s](../modules/_index_.md#optional-s)*

*Defined in [types.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L113)*

EC signature parameter.

___

### `Optional` to

• **to**? : *AddressLike*

*Inherited from [__type](../modules/_index_.md#__type).[to](../modules/_index_.md#optional-to)*

*Defined in [types.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L88)*

The transaction's the address is sent to.

___

### `Optional` type

• **type**? : *BNLike*

*Defined in [types.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L134)*

The transaction type

___

### `Optional` v

• **v**? : *BNLike*

*Inherited from [__type](../modules/_index_.md#__type).[v](../modules/_index_.md#optional-v)*

*Defined in [types.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L103)*

EC recovery ID.

___

### `Optional` value

• **value**? : *BNLike*

*Inherited from [__type](../modules/_index_.md#__type).[value](../modules/_index_.md#optional-value)*

*Defined in [types.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L93)*

The amount of Ether sent.
