[@ethereumjs/common](../README.md) / GethConfigOpts

# Interface: GethConfigOpts

## Hierarchy

- `BaseOpts`

  ↳ **`GethConfigOpts`**

## Table of contents

### Properties

- [chain](GethConfigOpts.md#chain)
- [customCrypto](GethConfigOpts.md#customcrypto)
- [eips](GethConfigOpts.md#eips)
- [genesisHash](GethConfigOpts.md#genesishash)
- [hardfork](GethConfigOpts.md#hardfork)
- [mergeForkIdPostMerge](GethConfigOpts.md#mergeforkidpostmerge)

## Properties

### chain

• `Optional` **chain**: `string`

#### Defined in

[types.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L150)

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

[types.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L111)

___

### eips

• `Optional` **eips**: `number`[]

Selected EIPs which can be activated, please use an array for instantiation
(e.g. `eips: [ 1559, 3860 ]`)

#### Inherited from

BaseOpts.eips

#### Defined in

[types.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L100)

___

### genesisHash

• `Optional` **genesisHash**: `Uint8Array`

#### Defined in

[types.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L151)

___

### hardfork

• `Optional` **hardfork**: `string`

String identifier ('byzantium') for hardfork or [Hardfork](../enums/Hardfork.md) enum.

Default: Hardfork.London

#### Inherited from

BaseOpts.hardfork

#### Defined in

[types.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L95)

___

### mergeForkIdPostMerge

• `Optional` **mergeForkIdPostMerge**: `boolean`

#### Defined in

[types.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L152)
