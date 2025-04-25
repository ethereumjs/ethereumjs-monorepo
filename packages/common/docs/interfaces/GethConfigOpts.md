[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / GethConfigOpts

# Interface: GethConfigOpts

Defined in: [types.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L157)

## Extends

- [`BaseOpts`](BaseOpts.md)

## Properties

### chain?

> `optional` **chain**: `string`

Defined in: [types.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L158)

***

### customCrypto?

> `optional` **customCrypto**: [`CustomCrypto`](CustomCrypto.md)

Defined in: [types.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L143)

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

> `optional` **eips**: `number`[]

Defined in: [types.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L114)

Selected EIPs which can be activated, please use an array for instantiation
(e.g. `eips: [ 2537, ]`)

Currently supported:

- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS12-381 precompiles

#### Inherited from

[`BaseOpts`](BaseOpts.md).[`eips`](BaseOpts.md#eips)

***

### genesisHash?

> `optional` **genesisHash**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L159)

***

### hardfork?

> `optional` **hardfork**: `string`

Defined in: [types.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L105)

String identifier ('byzantium') for hardfork or [Hardfork](../variables/Hardfork.md) enum.

Default: Hardfork.London

#### Inherited from

[`BaseOpts`](BaseOpts.md).[`hardfork`](BaseOpts.md#hardfork)

***

### params?

> `optional` **params**: [`ParamsDict`](../type-aliases/ParamsDict.md)

Defined in: [types.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L132)

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
