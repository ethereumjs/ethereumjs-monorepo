[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / PrecompileFunc

# Interface: PrecompileFunc()

Defined in: [precompiles/types.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/types.ts#L6)

Precompile implementation invoked at a fixed address when the EVM calls compiled code.

> **PrecompileFunc**(`input`): [`ExecResult`](ExecResult.md) \| `Promise`\<[`ExecResult`](ExecResult.md)\>

Defined in: [precompiles/types.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/types.ts#L7)

Precompile implementation invoked at a fixed address when the EVM calls compiled code.

## Parameters

### input

[`PrecompileInput`](PrecompileInput.md)

## Returns

[`ExecResult`](ExecResult.md) \| `Promise`\<[`ExecResult`](ExecResult.md)\>
