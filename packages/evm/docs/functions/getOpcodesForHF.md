[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / getOpcodesForHF

# Function: getOpcodesForHF()

> **getOpcodesForHF**(`common`, `customOpcodes?`): `OpcodeContext`

Defined in: [opcodes/codes.ts:431](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/opcodes/codes.ts#L431)

Returns opcode handlers and gas tables for the active hardfork and EIPs.

Merges fork-specific and EIP-specific opcode overrides with optional [CustomOpcode](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/docs/type-aliases/CustomOpcode.md) entries.

## Parameters

### common

[`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md)

### customOpcodes?

[`CustomOpcode`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/docs/type-aliases/CustomOpcode.md)[]

## Returns

`OpcodeContext`
