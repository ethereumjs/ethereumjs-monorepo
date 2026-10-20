[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / getActivePrecompiles

# Function: getActivePrecompiles()

> **getActivePrecompiles**(`common`, `customPrecompiles?`): `Map`\<`string`, [`PrecompileFunc`](../interfaces/PrecompileFunc.md)\>

Defined in: [precompiles/index.ts:298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/index.ts#L298)

Returns the precompile map active for `common`, merged with optional custom entries.

Custom additions override built-ins at the same address; deletions set the address to `undefined`.

## Parameters

### common

[`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md)

### customPrecompiles?

[`CustomPrecompile`](../type-aliases/CustomPrecompile.md)[]

## Returns

`Map`\<`string`, [`PrecompileFunc`](../interfaces/PrecompileFunc.md)\>
