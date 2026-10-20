[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / decodeEIP7708BurnLog

# Function: decodeEIP7708BurnLog()

> **decodeEIP7708BurnLog**(`log`): \{ `account`: `` `0x${string}` ``; `value`: `bigint`; \} \| `undefined`

Defined in: [eip7708.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eip7708.ts#L93)

Parses a system-address EIP-7708 Burn log into account/value.

## Parameters

### log

[`Log`](../type-aliases/Log.md)

## Returns

\{ `account`: `` `0x${string}` ``; `value`: `bigint`; \} \| `undefined`

`undefined` when the emitter or topics do not match EIP-7708 burn layout.

## Remarks

Experimental (Amsterdam): may change on patch releases.
