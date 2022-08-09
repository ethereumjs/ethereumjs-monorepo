[@ethereumjs/tx](../README.md) / FeeMarketEIP1559TxData

# Interface: FeeMarketEIP1559TxData

[FeeMarketEIP1559Transaction](../classes/FeeMarketEIP1559Transaction.md) data.

## Hierarchy

- [`AccessListEIP2930TxData`](AccessListEIP2930TxData.md)

  ↳ **`FeeMarketEIP1559TxData`**

## Table of contents

### Properties

- [accessList](FeeMarketEIP1559TxData.md#accesslist)
- [chainId](FeeMarketEIP1559TxData.md#chainid)
- [data](FeeMarketEIP1559TxData.md#data)
- [gasLimit](FeeMarketEIP1559TxData.md#gaslimit)
- [gasPrice](FeeMarketEIP1559TxData.md#gasprice)
- [maxFeePerGas](FeeMarketEIP1559TxData.md#maxfeepergas)
- [maxPriorityFeePerGas](FeeMarketEIP1559TxData.md#maxpriorityfeepergas)
- [nonce](FeeMarketEIP1559TxData.md#nonce)
- [r](FeeMarketEIP1559TxData.md#r)
- [s](FeeMarketEIP1559TxData.md#s)
- [to](FeeMarketEIP1559TxData.md#to)
- [type](FeeMarketEIP1559TxData.md#type)
- [v](FeeMarketEIP1559TxData.md#v)
- [value](FeeMarketEIP1559TxData.md#value)

## Properties

### accessList

• `Optional` **accessList**: [`AccessListBuffer`](../README.md#accesslistbuffer) \| [`AccessList`](../README.md#accesslist)

The access list which contains the addresses/storage slots which the transaction wishes to access

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[accessList](AccessListEIP2930TxData.md#accesslist)

#### Defined in

[types.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L179)

___

### chainId

• `Optional` **chainId**: `BigIntLike`

The transaction's chain ID

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[chainId](AccessListEIP2930TxData.md#chainid)

#### Defined in

[types.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L174)

___

### data

• `Optional` **data**: `BufferLike`

This will contain the data of the message or the init of a contract.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[data](AccessListEIP2930TxData.md#data)

#### Defined in

[types.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L143)

___

### gasLimit

• `Optional` **gasLimit**: `BigIntLike`

The transaction's gas limit.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[gasLimit](AccessListEIP2930TxData.md#gaslimit)

#### Defined in

[types.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L128)

___

### gasPrice

• `Optional` **gasPrice**: `undefined`

The transaction's gas price, inherited from [Transaction](../classes/Transaction.md).  This property is not used for EIP1559
transactions and should always be undefined for this specific transaction type.

#### Overrides

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[gasPrice](AccessListEIP2930TxData.md#gasprice)

#### Defined in

[types.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L190)

___

### maxFeePerGas

• `Optional` **maxFeePerGas**: `BigIntLike`

The maximum total fee

#### Defined in

[types.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L198)

___

### maxPriorityFeePerGas

• `Optional` **maxPriorityFeePerGas**: `BigIntLike`

The maximum inclusion fee per gas (this fee is given to the miner)

#### Defined in

[types.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L194)

___

### nonce

• `Optional` **nonce**: `BigIntLike`

The transaction's nonce.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[nonce](AccessListEIP2930TxData.md#nonce)

#### Defined in

[types.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L118)

___

### r

• `Optional` **r**: `BigIntLike`

EC signature parameter.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[r](AccessListEIP2930TxData.md#r)

#### Defined in

[types.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L153)

___

### s

• `Optional` **s**: `BigIntLike`

EC signature parameter.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[s](AccessListEIP2930TxData.md#s)

#### Defined in

[types.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L158)

___

### to

• `Optional` **to**: `AddressLike`

The transaction's the address is sent to.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[to](AccessListEIP2930TxData.md#to)

#### Defined in

[types.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L133)

___

### type

• `Optional` **type**: `BigIntLike`

The transaction type

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[type](AccessListEIP2930TxData.md#type)

#### Defined in

[types.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L164)

___

### v

• `Optional` **v**: `BigIntLike`

EC recovery ID.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[v](AccessListEIP2930TxData.md#v)

#### Defined in

[types.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L148)

___

### value

• `Optional` **value**: `BigIntLike`

The amount of Ether sent.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[value](AccessListEIP2930TxData.md#value)

#### Defined in

[types.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L138)
