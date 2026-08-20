[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / activeCostPerStateByte

# Function: activeCostPerStateByte()

> **activeCostPerStateByte**(`common`, `_blockGasLimit?`): `bigint`

Defined in: [eip8037.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eip8037.ts#L13)

Returns the active EIP-8037 cost per state byte from Common.

Under v7 fixtures this is the flat `costPerStateByte` parameter; the
optional block gas limit is reserved for a future derived formula.

## Parameters

### common

`Common`

### \_blockGasLimit?

`bigint`

## Returns

`bigint`

## Remarks

Experimental (Amsterdam): may change on patch releases.
