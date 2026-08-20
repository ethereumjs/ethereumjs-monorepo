[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / AddPrecompile

# Type Alias: AddPrecompile

> **AddPrecompile** = `object`

Defined in: [precompiles/index.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/index.ts#L264)

Specifies a precompile to add to (or override in) the EVM.
The address can be an `Address` instance or a `0x`-prefixed hex string.

## Properties

### address

> **address**: `Address` \| `PrefixedHexString`

Defined in: [precompiles/index.ts:265](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/index.ts#L265)

***

### function

> **function**: [`PrecompileFunc`](../interfaces/PrecompileFunc.md)

Defined in: [precompiles/index.ts:266](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/index.ts#L266)
