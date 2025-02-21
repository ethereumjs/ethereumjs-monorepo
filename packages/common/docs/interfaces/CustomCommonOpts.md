[@ethereumjs/common](../README.md) / CustomCommonOpts

# Interface: CustomCommonOpts

Options to be used with the [custom](../classes/Common.md#custom) static constructor.

## Hierarchy

- `BaseOpts`

  ↳ **`CustomCommonOpts`**

## Table of contents

### Properties

- [baseChain](CustomCommonOpts.md#basechain)
- [customCrypto](CustomCommonOpts.md#customcrypto)
- [eips](CustomCommonOpts.md#eips)
- [hardfork](CustomCommonOpts.md#hardfork)

## Properties

### baseChain

• `Optional` **baseChain**: `string` \| `number` \| `bigint`

The name (`mainnet`), id (`1`), or [Chain](../enums/Chain.md) enum of
a standard chain used to base the custom chain params on.

#### Defined in

[types.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L147)

___

### customCrypto

• `Optional` **customCrypto**: [`CustomCrypto`](CustomCrypto.md)

This option can be used to replace the most common crypto primitives
(keccak256 hashing e.g.) within the EthereumJS ecosystem libraries
with alternative implementations (e.g. more performant WASM libraries).

Note: please be aware that this is adding new dependencies for your
system setup to be used for sensitive/core parts of the functionality
and a choice on the libraries to add should be handled with care
and be made with eventual security implications considered.

#### Inherited from

BaseOpts.customCrypto

#### Defined in

[types.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L112)

___

### eips

• `Optional` **eips**: `number`[]

Selected EIPs which can be activated, please use an array for instantiation
(e.g. `eips: [ 1559, 3860 ]`)

#### Inherited from

BaseOpts.eips

#### Defined in

[types.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L101)

___

### hardfork

• `Optional` **hardfork**: `string`

String identifier ('byzantium') for hardfork or [Hardfork](../enums/Hardfork.md) enum.

Default: Hardfork.London

#### Inherited from

BaseOpts.hardfork

#### Defined in

[types.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L96)
