[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / EOACode7702TxData

# Interface: EOACode7702TxData

Defined in: [types.ts:507](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L507)

[EOACode7702Tx](../classes/EOACode7702Tx.md) data.

## Extends

- [`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md)

## Properties

### accessList?

> `optional` **accessList?**: [`AccessListBytes`](../type-aliases/AccessListBytes.md) \| [`AccessList`](../type-aliases/AccessList.md) \| `null`

Defined in: [types.ts:448](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L448)

The access list which contains the addresses/storage slots which the transaction wishes to access

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`accessList`](FeeMarketEIP1559TxData.md#accesslist)

***

### authorizationList?

> `optional` **authorizationList?**: `EOACode7702AuthorizationListBytes` \| `EOACode7702AuthorizationList`

Defined in: [types.ts:511](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L511)

EIP-7702 authority list; each entry authorizes temporary EOA code delegation.

***

### chainId?

> `optional` **chainId?**: `BigIntLike`

Defined in: [types.ts:443](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L443)

The transaction's chain ID

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`chainId`](FeeMarketEIP1559TxData.md#chainid)

***

### data?

> `optional` **data?**: `""` \| `BytesLike`

Defined in: [types.ts:412](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L412)

This will contain the data of the message or the init of a contract.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`data`](FeeMarketEIP1559TxData.md#data)

***

### gasLimit?

> `optional` **gasLimit?**: `BigIntLike`

Defined in: [types.ts:397](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L397)

The transaction's gas limit.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`gasLimit`](FeeMarketEIP1559TxData.md#gaslimit)

***

### gasPrice?

> `optional` **gasPrice?**: `null`

Defined in: [types.ts:459](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L459)

The transaction's gas price, inherited from [Transaction](Transaction.md).  This property is not used for EIP1559
transactions and should always be undefined for this specific transaction type.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`gasPrice`](FeeMarketEIP1559TxData.md#gasprice)

***

### maxFeePerGas?

> `optional` **maxFeePerGas?**: `BigIntLike`

Defined in: [types.ts:467](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L467)

The maximum total fee

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`maxFeePerGas`](FeeMarketEIP1559TxData.md#maxfeepergas)

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas?**: `BigIntLike`

Defined in: [types.ts:463](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L463)

The maximum inclusion fee per gas (this fee is given to the miner)

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`maxPriorityFeePerGas`](FeeMarketEIP1559TxData.md#maxpriorityfeepergas)

***

### nonce?

> `optional` **nonce?**: `BigIntLike`

Defined in: [types.ts:387](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L387)

The transaction's nonce.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`nonce`](FeeMarketEIP1559TxData.md#nonce)

***

### r?

> `optional` **r?**: `BigIntLike`

Defined in: [types.ts:422](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L422)

EC signature parameter.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`r`](FeeMarketEIP1559TxData.md#r)

***

### s?

> `optional` **s?**: `BigIntLike`

Defined in: [types.ts:427](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L427)

EC signature parameter.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`s`](FeeMarketEIP1559TxData.md#s)

***

### to?

> `optional` **to?**: `""` \| `AddressLike`

Defined in: [types.ts:402](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L402)

The transaction's the address is sent to.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`to`](FeeMarketEIP1559TxData.md#to)

***

### type?

> `optional` **type?**: `BigIntLike`

Defined in: [types.ts:433](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L433)

The transaction type

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`type`](FeeMarketEIP1559TxData.md#type)

***

### v?

> `optional` **v?**: `BigIntLike`

Defined in: [types.ts:417](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L417)

EC recovery ID.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`v`](FeeMarketEIP1559TxData.md#v)

***

### value?

> `optional` **value?**: `BigIntLike`

Defined in: [types.ts:407](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L407)

The amount of Ether sent.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`value`](FeeMarketEIP1559TxData.md#value)
