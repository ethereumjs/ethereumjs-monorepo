[@ethereumjs/vm](../README.md) / VMOpts

# Interface: VMOpts

Options for instantiating a [VM](../classes/VM.md).

## Table of contents

### Properties

- [activateGenesisState](VMOpts.md#activategenesisstate)
- [activatePrecompiles](VMOpts.md#activateprecompiles)
- [blockchain](VMOpts.md#blockchain)
- [common](VMOpts.md#common)
- [eei](VMOpts.md#eei)
- [evm](VMOpts.md#evm)
- [hardforkByBlockNumber](VMOpts.md#hardforkbyblocknumber)
- [hardforkByTTD](VMOpts.md#hardforkbyttd)
- [stateManager](VMOpts.md#statemanager)

## Properties

### activateGenesisState

• `Optional` **activateGenesisState**: `boolean`

If true, the state of the VM will add the genesis state given by Blockchain.genesisState to a newly
created state manager instance. Note that if stateManager option is also passed as argument
this flag won't have any effect.

Default: `false`

#### Defined in

[packages/vm/src/types.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L113)

___

### activatePrecompiles

• `Optional` **activatePrecompiles**: `boolean`

If true, create entries in the state tree for the precompiled contracts, saving some gas the
first time each of them is called.

If this parameter is false, each call to each of them has to pay an extra 25000 gas
for creating the account. If the account is still empty after this call, it will be deleted,
such that this extra cost has to be paid again.

Setting this to true has the effect of precompiled contracts' gas costs matching mainnet's from
the very first call, which is intended for testing networks.

Default: `false`

#### Defined in

[packages/vm/src/types.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L105)

___

### blockchain

• `Optional` **blockchain**: `BlockchainInterface`

A Blockchain object for storing/retrieving blocks

#### Defined in

[packages/vm/src/types.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L91)

___

### common

• `Optional` **common**: `Common`

Use a Common instance
if you want to change the chain setup.

### Possible Values

- `chain`: all chains supported by `Common` or a custom chain
- `hardfork`: `mainnet` hardforks up to the `Merge` hardfork
- `eips`: `2537` (usage e.g. `eips: [ 2537, ]`)

Note: check the associated `@ethereumjs/evm` instance options
documentation for supported EIPs.

### Default Setup

Default setup if no `Common` instance is provided:

- `chain`: `mainnet`
- `hardfork`: `merge`
- `eips`: `[]`

#### Defined in

[packages/vm/src/types.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L83)

___

### eei

• `Optional` **eei**: `EEIInterface`

Use a custom EEI for the EVM. If this is not present, use the default EEI.

#### Defined in

[packages/vm/src/types.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L136)

___

### evm

• `Optional` **evm**: `EVMInterface`

Use a custom EVM to run Messages on. If this is not present, use the default EVM.

#### Defined in

[packages/vm/src/types.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L141)

___

### hardforkByBlockNumber

• `Optional` **hardforkByBlockNumber**: `boolean`

Select hardfork based upon block number. This automatically switches to the right hard fork based upon the block number.

Default: `false`

#### Defined in

[packages/vm/src/types.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L120)

___

### hardforkByTTD

• `Optional` **hardforkByTTD**: `BigIntLike`

Select the HF by total difficulty (Merge HF)

This option is a superset of `hardforkByBlockNumber` (so only use one of both options)
and determines the HF by both the block number and the TD.

Since the TD is only a threshold the block number will in doubt take precedence (imagine
e.g. both Merge and Shanghai HF blocks set and the block number from the block provided
pointing to a Shanghai block: this will lead to set the HF as Shanghai and not the Merge).

#### Defined in

[packages/vm/src/types.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L131)

___

### stateManager

• `Optional` **stateManager**: `StateManager`

A StateManager instance to use as the state store

#### Defined in

[packages/vm/src/types.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L87)
