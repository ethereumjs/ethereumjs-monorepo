[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / getOpcodesForHF

# Function: getOpcodesForHF()

> **getOpcodesForHF**(`common`, `customOpcodes?`): `OpcodeContext`

Defined in: [opcodes/codes.ts:424](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/opcodes/codes.ts#L424)

Get suitable opcodes for the required hardfork.

## Parameters

### common

`Common`

{Common} Ethereumjs Common metadata object.

### customOpcodes?

`CustomOpcode`[]

List with custom opcodes (see EVM `customOpcodes` option description).

## Returns

`OpcodeContext`

Opcodes dictionary object.
