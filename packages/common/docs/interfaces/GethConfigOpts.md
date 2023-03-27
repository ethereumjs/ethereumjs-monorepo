[@ethereumjs/common](../README.md) / GethConfigOpts

# Interface: GethConfigOpts

## Hierarchy

- `BaseOpts`

  ↳ **`GethConfigOpts`**

## Table of contents

### Properties

- [chain](GethConfigOpts.md#chain)
- [eips](GethConfigOpts.md#eips)
- [genesisHash](GethConfigOpts.md#genesishash)
- [hardfork](GethConfigOpts.md#hardfork)
- [mergeForkIdPostMerge](GethConfigOpts.md#mergeforkidpostmerge)

## Properties

### chain

• `Optional` **chain**: `string`

#### Defined in

[packages/common/src/types.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L119)

___

### eips

• `Optional` **eips**: `number`[]

Selected EIPs which can be activated, please use an array for instantiation
(e.g. `eips: [ 2537, ]`)

Currently supported:

- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS12-381 precompiles

#### Inherited from

BaseOpts.eips

#### Defined in

[packages/common/src/types.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L80)

___

### genesisHash

• `Optional` **genesisHash**: `Buffer`

#### Defined in

[packages/common/src/types.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L120)

___

### hardfork

• `Optional` **hardfork**: `string`

String identifier ('byzantium') for hardfork or [Hardfork](../enums/Hardfork.md) enum.

Default: Hardfork.London

#### Inherited from

BaseOpts.hardfork

#### Defined in

[packages/common/src/types.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L71)

___

### mergeForkIdPostMerge

• `Optional` **mergeForkIdPostMerge**: `boolean`

#### Defined in

[packages/common/src/types.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L121)
