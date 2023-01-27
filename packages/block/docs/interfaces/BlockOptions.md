[@ethereumjs/block](../README.md) / BlockOptions

# Interface: BlockOptions

An object to set to which blockchain the blocks and their headers belong. This could be specified
using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
hardfork.

## Table of contents

### Properties

- [calcDifficultyFromHeader](BlockOptions.md#calcdifficultyfromheader)
- [cliqueSigner](BlockOptions.md#cliquesigner)
- [common](BlockOptions.md#common)
- [freeze](BlockOptions.md#freeze)
- [hardforkByBlockNumber](BlockOptions.md#hardforkbyblocknumber)
- [hardforkByTTD](BlockOptions.md#hardforkbyttd)
- [skipConsensusFormatValidation](BlockOptions.md#skipconsensusformatvalidation)

## Properties

### calcDifficultyFromHeader

• `Optional` **calcDifficultyFromHeader**: [`BlockHeader`](../classes/BlockHeader.md)

If a preceding [BlockHeader](../classes/BlockHeader.md) (usually the parent header) is given the preceding
header will be used to calculate the difficulty for this block and the calculated
difficulty takes precedence over a provided static `difficulty` value.

Note that this option has no effect on networks other than PoW/Ethash networks
(respectively also deactivates on the Merge HF switching to PoS/Casper).

#### Defined in

[types.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L62)

___

### cliqueSigner

• `Optional` **cliqueSigner**: `Buffer`

Provide a clique signer's privateKey to seal this block.
Will throw if provided on a non-PoA chain.

#### Defined in

[types.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L79)

___

### common

• `Optional` **common**: `Common`

A Common object defining the chain and the hardfork a block/block header belongs to.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: Common object set to `mainnet` and the HF currently defined as the default
hardfork in the Common class.

Current default hardfork: `merge`

#### Defined in

[types.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L36)

___

### freeze

• `Optional` **freeze**: `boolean`

A block object by default gets frozen along initialization. This gives you
strong additional security guarantees on the consistency of the block parameters.
It also enables block hash caching when the `hash()` method is called multiple times.

If you need to deactivate the block freeze - e.g. because you want to subclass block and
add aditional properties - it is strongly encouraged that you do the freeze yourself
within your code instead.

Default: true

#### Defined in

[types.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L74)

___

### hardforkByBlockNumber

• `Optional` **hardforkByBlockNumber**: `boolean`

Determine the HF by the block number

Default: `false` (HF is set to whatever default HF is set by the Common instance)

#### Defined in

[types.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L42)

___

### hardforkByTTD

• `Optional` **hardforkByTTD**: `BigIntLike`

Determine the HF by total difficulty (Merge HF)

This option is a superset of `hardforkByBlockNumber` (so only use one of both options)
and determines the HF by both the block number and the TD.

Since the TTD is only a threshold the block number will in doubt take precedence (imagine
e.g. both Merge and Shanghai HF blocks set and the block number from the block provided
pointing to a Shanghai block: this will lead to set the HF as Shanghai and not the Merge).

#### Defined in

[types.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L53)

___

### skipConsensusFormatValidation

• `Optional` **skipConsensusFormatValidation**: `boolean`

Skip consensus format validation checks on header if set. Defaults to false.

#### Defined in

[types.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L83)
