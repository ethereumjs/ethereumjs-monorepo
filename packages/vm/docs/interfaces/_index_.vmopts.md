[@ethereumjs/vm](../README.md) › ["index"](../modules/_index_.md) › [VMOpts](_index_.vmopts.md)

# Interface: VMOpts

Options for instantiating a [VM](../classes/_index_.vm.md).

## Hierarchy

* **VMOpts**

## Index

### Properties

* [activatePrecompiles](_index_.vmopts.md#optional-activateprecompiles)
* [allowUnlimitedContractSize](_index_.vmopts.md#optional-allowunlimitedcontractsize)
* [blockchain](_index_.vmopts.md#optional-blockchain)
* [common](_index_.vmopts.md#optional-common)
* [state](_index_.vmopts.md#optional-state)
* [stateManager](_index_.vmopts.md#optional-statemanager)

## Properties

### `Optional` activatePrecompiles

• **activatePrecompiles**? : *undefined | false | true*

*Defined in [index.ts:84](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L84)*

If true, create entries in the state tree for the precompiled contracts, saving some gas the
first time each of them is called.

If this parameter is false, the first call to each of them has to pay an extra 25000 gas
for creating the account.

Setting this to true has the effect of precompiled contracts' gas costs matching mainnet's from
the very first call, which is intended for testing networks.

Default: `false`

___

### `Optional` allowUnlimitedContractSize

• **allowUnlimitedContractSize**? : *undefined | false | true*

*Defined in [index.ts:91](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L91)*

Allows unlimited contract sizes while debugging. By setting this to `true`, the check for
contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed.

Default: `false` [ONLY set to `true` during debugging]

___

### `Optional` blockchain

• **blockchain**? : *Blockchain*

*Defined in [index.ts:71](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L71)*

A [blockchain](https://github.com/ethereumjs/ethereumjs-vm/packages/blockchain) object for storing/retrieving blocks

___

### `Optional` common

• **common**? : *Common*

*Defined in [index.ts:58](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L58)*

Use a [common](https://github.com/ethereumjs/ethereumjs-vm/packages/common) instance
if you want to change the chain setup.

### Possible Values

- `chain`: all chains supported by `Common` or a custom chain
- `hardfork`: `mainnet` hardforks up to the `MuirGlacier` hardfork
- `eips`: `2537` (usage e.g. `eips: [ 2537, ]`)

### Supported EIPs

- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) (`experimental`) - BLS12-381 precompiles
- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) (`experimental`) - Gas cost increases for state access opcodes

*Annotations:*

- `experimental`: behaviour can change on patch versions

### Default Setup

Default setup if no `Common` instance is provided:

- `chain`: `mainnet`
- `hardfork`: `istanbul`
- `eips`: `[]`

___

### `Optional` state

• **state**? : *any*

*Defined in [index.ts:67](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L67)*

A [merkle-patricia-tree](https://github.com/ethereumjs/merkle-patricia-tree) instance for the state tree (ignored if stateManager is passed)

**`deprecated`** 

___

### `Optional` stateManager

• **stateManager**? : *[StateManager](_state_index_.statemanager.md)*

*Defined in [index.ts:62](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L62)*

A [StateManager](_state_index_.statemanager.md) instance to use as the state store (Beta API)
