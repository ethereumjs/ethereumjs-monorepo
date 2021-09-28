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

[types.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L178)

___

### chainId

• `Optional` **chainId**: `BNLike`

The transaction's chain ID

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[chainId](AccessListEIP2930TxData.md#chainid)

#### Defined in

[types.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L173)

___

### data

• `Optional` **data**: `BufferLike`

This will contain the data of the message or the init of a contract.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[data](AccessListEIP2930TxData.md#data)

#### Defined in

[types.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L142)

___

### gasLimit

• `Optional` **gasLimit**: `BNLike`

The transaction's gas limit.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[gasLimit](AccessListEIP2930TxData.md#gaslimit)

#### Defined in

[types.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L127)

___

### gasPrice

• `Optional` **gasPrice**: `undefined`

The transaction's gas price, inherited from [Transaction](../classes/Transaction.md).  This property is not used for EIP1559
transactions and should always be undefined for this specific transaction type.

#### Overrides

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[gasPrice](AccessListEIP2930TxData.md#gasprice)

#### Defined in

[types.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L189)

___

### maxFeePerGas

• `Optional` **maxFeePerGas**: `BNLike`

The maximum total fee

#### Defined in

[types.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L197)

___

### maxPriorityFeePerGas

• `Optional` **maxPriorityFeePerGas**: `BNLike`

The maximum inclusion fee per gas (this fee is given to the miner)

#### Defined in

[types.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L193)

___

### nonce

• `Optional` **nonce**: `BNLike`

The transaction's nonce.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[nonce](AccessListEIP2930TxData.md#nonce)

#### Defined in

[types.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L117)

___

### r

• `Optional` **r**: `BNLike`

EC signature parameter.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[r](AccessListEIP2930TxData.md#r)

#### Defined in

[types.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L152)

___

### s

• `Optional` **s**: `BNLike`

EC signature parameter.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[s](AccessListEIP2930TxData.md#s)

#### Defined in

[types.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L157)

___

### to

• `Optional` **to**: `AddressLike`

The transaction's the address is sent to.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[to](AccessListEIP2930TxData.md#to)

#### Defined in

[types.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L132)

___

### type

• `Optional` **type**: `BNLike`

The transaction type

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[type](AccessListEIP2930TxData.md#type)

#### Defined in

[types.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L163)

___

### v

• `Optional` **v**: `BNLike`

EC recovery ID.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[v](AccessListEIP2930TxData.md#v)

#### Defined in

[types.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L147)

___

### value

• `Optional` **value**: `BNLike`

The amount of Ether sent.

#### Inherited from

[AccessListEIP2930TxData](AccessListEIP2930TxData.md).[value](AccessListEIP2930TxData.md#value)

#### Defined in

[types.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L137)
