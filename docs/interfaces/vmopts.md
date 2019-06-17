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

*Defined in [index.ts:44](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/index.ts#L44)*

If true, create entries in the state tree for the precompiled contracts

___
<a id="allowunlimitedcontractsize"></a>

### `<Optional>` allowUnlimitedContractSize

**● allowUnlimitedContractSize**: *`undefined` \| `false` \| `true`*

*Defined in [index.ts:48](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/index.ts#L48)*

Allows unlimited contract sizes while debugging. By setting this to `true`, the check for contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed

___
<a id="blockchain"></a>

### `<Optional>` blockchain

**● blockchain**: *`any`*

*Defined in [index.ts:40](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/index.ts#L40)*

A [blockchain](https://github.com/ethereumjs/ethereumjs-blockchain) object for storing/retrieving blocks

___
<a id="chain"></a>

### `<Optional>` chain

**● chain**: *`undefined` \| `string`*

*Defined in [index.ts:23](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/index.ts#L23)*

The chain the VM operates on

___
<a id="common"></a>

### `<Optional>` common

**● common**: *`Common`*

*Defined in [index.ts:49](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/index.ts#L49)*

___
<a id="hardfork"></a>

### `<Optional>` hardfork

**● hardfork**: *`undefined` \| `string`*

*Defined in [index.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/index.ts#L27)*

Hardfork rules to be used

___
<a id="state"></a>

### `<Optional>` state

**● state**: *`any`*

*Defined in [index.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/index.ts#L36)*

A [merkle-patricia-tree](https://github.com/ethereumjs/merkle-patricia-tree) instance for the state tree (ignored if stateManager is passed)

*__deprecated__*: 

___
<a id="statemanager"></a>

### `<Optional>` stateManager

**● stateManager**: *[StateManager](../classes/statemanager.md)*

*Defined in [index.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/2fcfe31/lib/index.ts#L31)*

A [StateManager](../classes/statemanager.md) instance to use as the state store (Beta API)

___

