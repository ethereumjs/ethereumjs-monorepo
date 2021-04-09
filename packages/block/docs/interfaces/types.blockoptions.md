[@ethereumjs/block](../README.md) / [types](../modules/types.md) / BlockOptions

# Interface: BlockOptions

[types](../modules/types.md).BlockOptions

An object to set to which blockchain the blocks and their headers belong. This could be specified
using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
hardfork.

## Table of contents

### Properties

- [calcDifficultyFromHeader](types.blockoptions.md#calcdifficultyfromheader)
- [cliqueSigner](types.blockoptions.md#cliquesigner)
- [common](types.blockoptions.md#common)
- [freeze](types.blockoptions.md#freeze)
- [hardforkByBlockNumber](types.blockoptions.md#hardforkbyblocknumber)
- [initWithGenesisHeader](types.blockoptions.md#initwithgenesisheader)

## Properties

### calcDifficultyFromHeader

• `Optional` **calcDifficultyFromHeader**: [*BlockHeader*](../classes/header.blockheader.md)

If a preceding `BlockHeader` (usually the parent header) is given the preceding
header will be used to calculate the difficulty for this block and the calculated
difficulty takes precedence over a provided static `difficulty` value.

Defined in: [types.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L48)

___

### cliqueSigner

• `Optional` **cliqueSigner**: *Buffer*

Provide a clique signer's privateKey to seal this block.
Will throw if provided on a non-PoA chain.

Defined in: [types.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L64)

___

### common

• `Optional` **common**: *default*

A Common object defining the chain and the hardfork a block/block header belongs to.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: `Common` object set to `mainnet` and the HF currently defined as the default
hardfork in the `Common` class.

Current default hardfork: `istanbul`

Defined in: [types.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L24)

___

### freeze

• `Optional` **freeze**: *boolean*

A block object by default gets frozen along initialization. This gives you
strong additional security guarantees on the consistency of the block parameters.

If you need to deactivate the block freeze - e.g. because you want to subclass block and
add aditional properties - it is strongly encouraged that you do the freeze yourself
within your code instead.

Default: true

Defined in: [types.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L59)

___

### hardforkByBlockNumber

• `Optional` **hardforkByBlockNumber**: *boolean*

Determine the HF by the block number

Default: `false` (HF is set to whatever default HF is set by the Common instance)

Defined in: [types.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L30)

___

### initWithGenesisHeader

• `Optional` **initWithGenesisHeader**: *boolean*

Turns the block header into the canonical genesis block header

If set to `true` all other header data is ignored.

If a Common instance is passed the instance need to be set to `chainstart` as a HF,
otherwise usage of this option will throw

Default: `false`

Defined in: [types.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L41)
