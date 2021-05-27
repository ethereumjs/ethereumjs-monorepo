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

Defined in: [index.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L93)

___

### allowUnlimitedContractSize

• `Optional` **allowUnlimitedContractSize**: *boolean*

Allows unlimited contract sizes while debugging. By setting this to `true`, the check for
contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed.

Default: `false` [ONLY set to `true` during debugging]

Defined in: [index.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L100)

___

### blockchain

• `Optional` **blockchain**: *default*

A [blockchain](https://github.com/ethereumjs/ethereumjs-monorepo/packages/blockchain) object for storing/retrieving blocks

Defined in: [index.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L80)

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

- [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) - Fee Market
- [EIP-2315](https://eips.ethereum.org/EIPS/eip-2315) - VM simple subroutines
- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) (`experimental`) - BLS12-381 precompiles
- [EIP-2565](https://eips.ethereum.org/EIPS/eip-2565) - ModExp Gas Cost
- [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718) - Typed Transactions
- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) - Gas cost increases for state access opcodes
- [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930) - Access List Transaction Type
- [EIP-3198](https://eips.ethereum.org/EIPS/eip-3198) - BASEFEE opcode
- [EIP-3529](https://eips.ethereum.org/EIPS/eip-3529) - Reduction in refunds
- [EIP-3541](https://eips.ethereum.org/EIPS/eip-3541) - Reject new contracts starting with the 0xEF byte

*Annotations:*

- `experimental`: behaviour can change on patch versions

### Default Setup

Default setup if no `Common` instance is provided:

- `chain`: `mainnet`
- `hardfork`: `istanbul`
- `eips`: `[]`

Defined in: [index.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L67)

___

### hardforkByBlockNumber

• `Optional` **hardforkByBlockNumber**: *boolean*

Select hardfork based upon block number. This automatically switches to the right hard fork based upon the block number.

Default: `false`

Defined in: [index.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L107)

___

### state

• `Optional` **state**: *any*

An [merkle-patricia-tree](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie) instance for the state tree (ignored if stateManager is passed)

**`deprecated`**

Defined in: [index.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L76)

___

### stateManager

• `Optional` **stateManager**: [*StateManager*](state_interface.statemanager.md)

A [StateManager](state_interface.statemanager.md) instance to use as the state store (Beta API)

Defined in: [index.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/index.ts#L71)
