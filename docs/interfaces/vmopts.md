[ethereumjs-vm](../README.md) > [VMOpts](../interfaces/vmopts.md)

# Interface: VMOpts

Options for instantiating a [VM](../classes/vm.md).

## Hierarchy

**VMOpts**

## Index

### Properties

* [activatePrecompiles](vmopts.md#activateprecompiles)
* [allowUnlimitedContractSize](vmopts.md#allowunlimitedcontractsize)
* [blockchain](vmopts.md#blockchain)
* [chain](vmopts.md#chain)
* [common](vmopts.md#common)
* [hardfork](vmopts.md#hardfork)
* [state](vmopts.md#state)
* [stateManager](vmopts.md#statemanager)

---

## Properties

<a id="activateprecompiles"></a>

### `<Optional>` activatePrecompiles

**● activatePrecompiles**: *`undefined` \| `false` \| `true`*

*Defined in [index.ts:52](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L52)*

If true, create entries in the state tree for the precompiled contracts, saving some gas the first time each of them is called.

If this parameter is false, the first call to each of them has to pay an extra 25000 gas for creating the account.

Setting this to true has the effect of precompiled contracts' gas costs matching mainnet's from the very first call, which is intended for testing networks.

___
<a id="allowunlimitedcontractsize"></a>

### `<Optional>` allowUnlimitedContractSize

**● allowUnlimitedContractSize**: *`undefined` \| `false` \| `true`*

*Defined in [index.ts:56](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L56)*

Allows unlimited contract sizes while debugging. By setting this to `true`, the check for contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed

___
<a id="blockchain"></a>

### `<Optional>` blockchain

**● blockchain**: *`Blockchain`*

*Defined in [index.ts:41](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L41)*

A [blockchain](https://github.com/ethereumjs/ethereumjs-blockchain) object for storing/retrieving blocks

___
<a id="chain"></a>

### `<Optional>` chain

**● chain**: *`undefined` \| `string`*

*Defined in [index.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L24)*

The chain the VM operates on

___
<a id="common"></a>

### `<Optional>` common

**● common**: *`Common`*

*Defined in [index.ts:57](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L57)*

___
<a id="hardfork"></a>

### `<Optional>` hardfork

**● hardfork**: *`undefined` \| `string`*

*Defined in [index.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L28)*

Hardfork rules to be used

___
<a id="state"></a>

### `<Optional>` state

**● state**: *`any`*

*Defined in [index.ts:37](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L37)*

A [merkle-patricia-tree](https://github.com/ethereumjs/merkle-patricia-tree) instance for the state tree (ignored if stateManager is passed)

*__deprecated__*: 

___
<a id="statemanager"></a>

### `<Optional>` stateManager

**● stateManager**: *[StateManager](../classes/statemanager.md)*

*Defined in [index.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/439570a/lib/index.ts#L32)*

A [StateManager](../classes/statemanager.md) instance to use as the state store (Beta API)

___

