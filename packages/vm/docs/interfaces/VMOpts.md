[@ethereumjs/vm](../README.md) / VMOpts

# Interface: VMOpts

Options for instantiating a [VM](../classes/VM.md).

## Table of contents

### Properties

- [activatePrecompiles](VMOpts.md#activateprecompiles)
- [blockchain](VMOpts.md#blockchain)
- [common](VMOpts.md#common)
- [evm](VMOpts.md#evm)
- [genesisState](VMOpts.md#genesisstate)
- [setHardfork](VMOpts.md#sethardfork)
- [stateManager](VMOpts.md#statemanager)

## Properties

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

[vm/src/types.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L121)

___

### blockchain

• `Optional` **blockchain**: `BlockchainInterface`

A Blockchain object for storing/retrieving blocks

#### Defined in

[vm/src/types.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L107)

___

### common

• `Optional` **common**: `Common`

Use a Common instance
if you want to change the chain setup.

### Possible Values

- `chain`: all chains supported by `Common` or a custom chain
- `hardfork`: `mainnet` hardforks up to the `Paris` hardfork
- `eips`: `1559` (usage e.g. `eips: [ 1559, ]`)

Note: check the associated `@ethereumjs/evm` instance options
documentation for supported EIPs.

### Default Setup

Default setup if no `Common` instance is provided:

- `chain`: `mainnet`
- `hardfork`: `paris`
- `eips`: `[]`

#### Defined in

[vm/src/types.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L99)

___

### evm

• `Optional` **evm**: `EVMInterface`

Use a custom EVM to run Messages on. If this is not present, use the default EVM.

#### Defined in

[vm/src/types.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L142)

___

### genesisState

• `Optional` **genesisState**: `GenesisState`

A genesisState to generate canonical genesis for the "in-house" created stateManager if external
stateManager not provided for the VM, defaults to an empty state

#### Defined in

[vm/src/types.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L126)

___

### setHardfork

• `Optional` **setHardfork**: `boolean` \| `BigIntLike`

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

#### Defined in

[vm/src/types.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L137)

___

### stateManager

• `Optional` **stateManager**: `EVMStateManagerInterface`

A StateManager instance to use as the state store

#### Defined in

[vm/src/types.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L103)
