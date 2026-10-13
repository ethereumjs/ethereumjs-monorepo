[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / createEIP7708TransferLog

# Function: createEIP7708TransferLog()

> **createEIP7708TransferLog**(`from`, `to`, `value`): [`Log`](../type-aliases/Log.md)

Defined in: [eip7708.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eip7708.ts#L46)

Builds an EIP-7708 ETH transfer log for CALL/CREATE value moves.

## Parameters

### from

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

### to

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

### value

`bigint`

## Returns

[`Log`](../type-aliases/Log.md)

## Remarks

Experimental (Amsterdam): may change on patch releases.
