[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / getEip2780FloorBaseGas

# Function: getEip2780FloorBaseGas()

> **getEip2780FloorBaseGas**(`tx`, `sender?`): `bigint`

Defined in: [util/intrinsic.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/util/intrinsic.ts#L79)

Floor / intrinsic base for EIP-7623: `TX_BASE`, plus the decomposed EIP-2780
recipient regular gas (`COLD_ACCOUNT_ACCESS` or `CREATE_ACCESS`, and value
extras). Does not include calldata, access-list, or auth costs.

See execution-specs#3120: the floor is anchored on this base rather than
`TX_BASE` alone.

## Parameters

### tx

[`LegacyTxInterface`](../interfaces/LegacyTxInterface.md)

### sender?

`Address`

## Returns

`bigint`
