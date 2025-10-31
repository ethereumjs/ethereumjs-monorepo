[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / BaseOpts

# Interface: BaseOpts

Defined in: [types.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L98)

## Extended by

- [`CommonOpts`](CommonOpts.md)
- [`GethConfigOpts`](GethConfigOpts.md)

## Properties

### customCrypto?

> `optional` **customCrypto**: [`CustomCrypto`](CustomCrypto.md)

Defined in: [types.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L142)

This option can be used to replace the most common crypto primitives
(keccak256 hashing e.g.) within the EthereumJS ecosystem libraries
with alternative implementations (e.g. more performant WASM libraries).

Note: please be aware that this is adding new dependencies for your
system setup to be used for sensitive/core parts of the functionality
and a choice on the libraries to add should be handled with care
and be made with eventual security implications considered.

***

### eips?

> `optional` **eips**: `number`[]

Defined in: [types.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L113)

Selected EIPs which can be activated, please use an array for instantiation
(e.g. `eips: [ 2537, ]`)

Currently supported:

- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS12-381 precompiles

***

### hardfork?

> `optional` **hardfork**: `string`

Defined in: [types.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L104)

String identifier ('byzantium') for hardfork or [Hardfork](../variables/Hardfork.md) enum.

Default: Hardfork.London

***

### params?

> `optional` **params**: [`ParamsDict`](../type-aliases/ParamsDict.md)

Defined in: [types.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L131)

Optionally pass in an EIP params dictionary, see one of the
EthereumJS library `params.ts` files for an example (e.g. tx, evm).
By default parameters are set by the respective library, so this
is only relevant if you want to use EthereumJS libraries with a
custom parameter set.

Example Format:

```ts
{
  1559: {
    initialBaseFee: 1000000000,
  }
}
```
