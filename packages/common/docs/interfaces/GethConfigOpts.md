[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / GethConfigOpts

# Interface: GethConfigOpts

Defined in: [types.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L165)

Options when constructing [Common](../classes/Common.md) from a geth genesis file.

## Extends

- [`BaseOpts`](BaseOpts.md)

## Properties

### chain?

> `optional` **chain?**: `string`

Defined in: [types.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L166)

***

### customCrypto?

> `optional` **customCrypto?**: [`CustomCrypto`](CustomCrypto.md)

Defined in: [types.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L150)

This option can be used to replace the most common crypto primitives
(keccak256 hashing e.g.) within the EthereumJS ecosystem libraries
with alternative implementations (e.g. more performant WASM libraries).

Note: please be aware that this is adding new dependencies for your
system setup to be used for sensitive/core parts of the functionality
and a choice on the libraries to add should be handled with care
and be made with eventual security implications considered.

#### Inherited from

[`BaseOpts`](BaseOpts.md).[`customCrypto`](BaseOpts.md#customcrypto)

***

### eips?

> `optional` **eips?**: `number`[]

Defined in: [types.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L121)

Selected EIPs which can be activated, please use an array for instantiation
(e.g. `eips: [ 2537, ]`)

Currently supported:

- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS12-381 precompiles

#### Inherited from

[`BaseOpts`](BaseOpts.md).[`eips`](BaseOpts.md#eips)

***

### genesisHash?

> `optional` **genesisHash?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L167)

***

### hardfork?

> `optional` **hardfork?**: `string`

Defined in: [types.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L112)

String identifier ('byzantium') for hardfork or [Hardfork](../variables/Hardfork.md) enum.

Default: Hardfork.London

#### Inherited from

[`BaseOpts`](BaseOpts.md).[`hardfork`](BaseOpts.md#hardfork)

***

### params?

> `optional` **params?**: [`ParamsDict`](../type-aliases/ParamsDict.md)

Defined in: [types.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L139)

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

#### Inherited from

[`BaseOpts`](BaseOpts.md).[`params`](BaseOpts.md#params)
