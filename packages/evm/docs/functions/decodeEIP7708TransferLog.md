[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / decodeEIP7708TransferLog

# Function: decodeEIP7708TransferLog()

> **decodeEIP7708TransferLog**(`log`): \{ `from`: `` `0x${string}` ``; `to`: `` `0x${string}` ``; `value`: `bigint`; \} \| `undefined`

Defined in: [eip7708.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eip7708.ts#L70)

Parses a system-address EIP-7708 Transfer log into from/to/value.

## Parameters

### log

[`Log`](../type-aliases/Log.md)

## Returns

\{ `from`: `` `0x${string}` ``; `to`: `` `0x${string}` ``; `value`: `bigint`; \} \| `undefined`

`undefined` when the emitter or topics do not match EIP-7708 transfer layout.

## Remarks

Experimental (Amsterdam): may change on patch releases.
