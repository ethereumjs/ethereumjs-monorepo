[@ethereumjs/vm](../README.md) / BuilderOpts

# Interface: BuilderOpts

Options for the block builder.

## Hierarchy

- `BlockOptions`

  ↳ **`BuilderOpts`**

## Table of contents

### Properties

- [calcDifficultyFromHeader](BuilderOpts.md#calcdifficultyfromheader)
- [cliqueSigner](BuilderOpts.md#cliquesigner)
- [common](BuilderOpts.md#common)
- [freeze](BuilderOpts.md#freeze)
- [hardforkByBlockNumber](BuilderOpts.md#hardforkbyblocknumber)
- [hardforkByTTD](BuilderOpts.md#hardforkbyttd)
- [putBlockIntoBlockchain](BuilderOpts.md#putblockintoblockchain)

## Properties

### calcDifficultyFromHeader

• `Optional` **calcDifficultyFromHeader**: `BlockHeader`

If a preceding BlockHeader (usually the parent header) is given the preceding
header will be used to calculate the difficulty for this block and the calculated
difficulty takes precedence over a provided static `difficulty` value.

Note that this option has no effect on networks other than PoW/Ethash networks
(respectively also deactivates on the Merge HF switching to PoS/Casper).

#### Inherited from

BlockOptions.calcDifficultyFromHeader

#### Defined in

packages/block/dist/types.d.ts:49

___

### cliqueSigner

• `Optional` **cliqueSigner**: `Buffer`

Provide a clique signer's privateKey to seal this block.
Will throw if provided on a non-PoA chain.

#### Inherited from

BlockOptions.cliqueSigner

#### Defined in

packages/block/dist/types.d.ts:66

___

### common

• `Optional` **common**: `Common`

A Common object defining the chain and the hardfork a block/block header belongs to.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: Common object set to `mainnet` and the HF currently defined as the default
hardfork in the Common class.

Current default hardfork: `merge`

#### Inherited from

BlockOptions.common

#### Defined in

packages/block/dist/types.d.ts:23

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

#### Inherited from

BlockOptions.freeze

#### Defined in

packages/block/dist/types.d.ts:61

___

### hardforkByBlockNumber

• `Optional` **hardforkByBlockNumber**: `boolean`

Determine the HF by the block number

Default: `false` (HF is set to whatever default HF is set by the Common instance)

#### Inherited from

BlockOptions.hardforkByBlockNumber

#### Defined in

packages/block/dist/types.d.ts:29

___

### hardforkByTTD

• `Optional` **hardforkByTTD**: `BigIntLike`

Determine the HF by total difficulty (Merge HF)

This option is a superset of `hardforkByBlockNumber` (so only use one of both options)
and determines the HF by both the block number and the TD.

Since the TTD is only a threshold the block number will in doubt take precedence (imagine
e.g. both Merge and Shanghai HF blocks set and the block number from the block provided
pointing to a Shanghai block: this will lead to set the HF as Shanghai and not the Merge).

#### Inherited from

BlockOptions.hardforkByTTD

#### Defined in

packages/block/dist/types.d.ts:40

___

### putBlockIntoBlockchain

• `Optional` **putBlockIntoBlockchain**: `boolean`

Whether to put the block into the vm's blockchain after building it.
This is useful for completing a full cycle when building a block so
the only next step is to build again, however it may not be desired
if the block is being emulated or may be discarded as to not affect
the underlying blockchain.

Default: true

#### Defined in

[packages/vm/src/types.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L157)
