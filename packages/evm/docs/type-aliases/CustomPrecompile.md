[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / CustomPrecompile

# Type Alias: CustomPrecompile

> **CustomPrecompile** = [`AddPrecompile`](AddPrecompile.md) \| [`DeletePrecompile`](DeletePrecompile.md)

Defined in: [precompiles/index.ts:281](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/index.ts#L281)

A custom precompile entry: either an addition/override or a deletion.

```ts
// Add a custom precompile at a new address
const add: CustomPrecompile = {
  address: '0x0000000000000000000000000000000000ff0001',
  function: myPrecompileImpl,
}
// Delete an existing precompile
const del: CustomPrecompile = {
  address: '0x0000000000000000000000000000000000000002',
}
```
