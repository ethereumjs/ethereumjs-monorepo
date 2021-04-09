[@ethereumjs/vm](../README.md) / [index](../modules/index.md) / VMOpts

# Interface: VMOpts

[index](../modules/index.md).VMOpts

Options for instantiating a [[VM]].

## Table of contents

### Properties

- [activatePrecompiles](index.vmopts.md#activateprecompiles)
- [allowUnlimitedContractSize](index.vmopts.md#allowunlimitedcontractsize)
- [blockchain](index.vmopts.md#blockchain)
- [common](index.vmopts.md#common)
- [hardforkByBlockNumber](index.vmopts.md#hardforkbyblocknumber)
- [state](index.vmopts.md#state)
- [stateManager](index.vmopts.md#statemanager)

## Properties

### activatePrecompiles

• `Optional` **activatePrecompiles**: *boolean*

If true, create entries in the state tree for the precompiled contracts, saving some gas the
first time each of them is called.

If this parameter is false, the first call to each of them has to pay an extra 25000 gas
for creating the account.

Setting this to true has the effect of precompiled contracts' gas costs matching mainnet's from
the very first call, which is intended for testing networks.

Default: `false`

Defined in: [index.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L86)

___

### allowUnlimitedContractSize

• `Optional` **allowUnlimitedContractSize**: *boolean*

Allows unlimited contract sizes while debugging. By setting this to `true`, the check for
contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed.

Default: `false` [ONLY set to `true` during debugging]

Defined in: [index.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L93)

___

### blockchain

• `Optional` **blockchain**: *default*

A [blockchain](https://github.com/ethereumjs/ethereumjs-monorepo/packages/blockchain) object for storing/retrieving blocks

Defined in: [index.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L73)

___

### common

• `Optional` **common**: *default*

Use a [common](https://github.com/ethereumjs/ethereumjs-monorepo/packages/common) instance
if you want to change the chain setup.

### Possible Values

- `chain`: all chains supported by `Common` or a custom chain
- `hardfork`: `mainnet` hardforks up to the `MuirGlacier` hardfork
- `eips`: `2537` (usage e.g. `eips: [ 2537, ]`)

### Supported EIPs

- [EIP-2315](https://eips.ethereum.org/EIPS/eip-2315) - VM simple subroutines
- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) (`experimental`) - BLS12-381 precompiles
- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) - Gas cost increases for state access opcodes

*Annotations:*

- `experimental`: behaviour can change on patch versions

### Default Setup

Default setup if no `Common` instance is provided:

- `chain`: `mainnet`
- `hardfork`: `istanbul`
- `eips`: `[]`

Defined in: [index.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L60)

___

### hardforkByBlockNumber

• `Optional` **hardforkByBlockNumber**: *boolean*

Select hardfork based upon block number. This automatically switches to the right hard fork based upon the block number.

Default: `false`

Defined in: [index.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L100)

___

### state

• `Optional` **state**: *any*

An [merkle-patricia-tree](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie) instance for the state tree (ignored if stateManager is passed)

**`deprecated`** 

Defined in: [index.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L69)

___

### stateManager

• `Optional` **stateManager**: [*StateManager*](state_interface.statemanager.md)

A [StateManager](state_interface.statemanager.md) instance to use as the state store (Beta API)

Defined in: [index.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L64)
