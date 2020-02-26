[ethereumjs-vm](../README.md) › ["index"](../modules/_index_.md) › [VMOpts](_index_.vmopts.md)

# Interface: VMOpts

Options for instantiating a [VM](../classes/_index_.vm.md).

## Hierarchy

* **VMOpts**

## Index

### Properties

* [activatePrecompiles](_index_.vmopts.md#optional-activateprecompiles)
* [allowUnlimitedContractSize](_index_.vmopts.md#optional-allowunlimitedcontractsize)
* [blockchain](_index_.vmopts.md#optional-blockchain)
* [chain](_index_.vmopts.md#optional-chain)
* [common](_index_.vmopts.md#optional-common)
* [hardfork](_index_.vmopts.md#optional-hardfork)
* [state](_index_.vmopts.md#optional-state)
* [stateManager](_index_.vmopts.md#optional-statemanager)

## Properties

### `Optional` activatePrecompiles

• **activatePrecompiles**? : *undefined | false | true*

*Defined in [index.ts:53](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L53)*

If true, create entries in the state tree for the precompiled contracts, saving some gas the
first time each of them is called.

If this parameter is false, the first call to each of them has to pay an extra 25000 gas
for creating the account.

Setting this to true has the effect of precompiled contracts' gas costs matching mainnet's from
the very first call, which is intended for testing networks.

___

### `Optional` allowUnlimitedContractSize

• **allowUnlimitedContractSize**? : *undefined | false | true*

*Defined in [index.ts:57](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L57)*

Allows unlimited contract sizes while debugging. By setting this to `true`, the check for contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed

___

### `Optional` blockchain

• **blockchain**? : *Blockchain*

*Defined in [index.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L42)*

A [blockchain](https://github.com/ethereumjs/ethereumjs-blockchain) object for storing/retrieving blocks

___

### `Optional` chain

• **chain**? : *undefined | string*

*Defined in [index.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L25)*

The chain the VM operates on

___

### `Optional` common

• **common**? : *Common*

*Defined in [index.ts:58](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L58)*

___

### `Optional` hardfork

• **hardfork**? : *undefined | string*

*Defined in [index.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L29)*

Hardfork rules to be used

___

### `Optional` state

• **state**? : *any*

*Defined in [index.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L38)*

A [merkle-patricia-tree](https://github.com/ethereumjs/merkle-patricia-tree) instance for the state tree (ignored if stateManager is passed)

**`deprecated`** 

___

### `Optional` stateManager

• **stateManager**? : *[StateManager](../classes/_state_index_.statemanager.md)*

*Defined in [index.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/index.ts#L33)*

A [StateManager](../classes/_state_index_.statemanager.md) instance to use as the state store (Beta API)
