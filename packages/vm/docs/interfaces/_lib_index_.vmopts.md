[@ethereumjs/vm](../README.md) › ["lib/index"](../modules/_lib_index_.md) › [VMOpts](_lib_index_.vmopts.md)

# Interface: VMOpts

Options for instantiating a [VM](../classes/_lib_index_.vm.md).

## Hierarchy

* **VMOpts**

## Index

### Properties

* [activatePrecompiles](_lib_index_.vmopts.md#optional-activateprecompiles)
* [allowUnlimitedContractSize](_lib_index_.vmopts.md#optional-allowunlimitedcontractsize)
* [blockchain](_lib_index_.vmopts.md#optional-blockchain)
* [common](_lib_index_.vmopts.md#optional-common)
* [state](_lib_index_.vmopts.md#optional-state)
* [stateManager](_lib_index_.vmopts.md#optional-statemanager)

## Properties

### `Optional` activatePrecompiles

• **activatePrecompiles**? : *undefined | false | true*

*Defined in [lib/index.ts:83](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L83)*

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

*Defined in [lib/index.ts:90](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L90)*

Allows unlimited contract sizes while debugging. By setting this to `true`, the check for
contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed.

Default: `false` [ONLY set to `true` during debugging]

___

### `Optional` blockchain

• **blockchain**? : *Blockchain*

*Defined in [lib/index.ts:70](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L70)*

A [blockchain](https://github.com/ethereumjs/ethereumjs-vm/packages/blockchain) object for storing/retrieving blocks

___

### `Optional` common

• **common**? : *Common*

*Defined in [lib/index.ts:57](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L57)*

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

*Defined in [lib/index.ts:66](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L66)*

A [merkle-patricia-tree](https://github.com/ethereumjs/merkle-patricia-tree) instance for the state tree (ignored if stateManager is passed)

**`deprecated`** 

___

### `Optional` stateManager

• **stateManager**? : *[StateManager](_lib_state_index_.statemanager.md)*

*Defined in [lib/index.ts:61](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L61)*

A [StateManager](_lib_state_index_.statemanager.md) instance to use as the state store (Beta API)
