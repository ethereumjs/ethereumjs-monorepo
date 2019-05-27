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
* [hardfork](vmopts.md#hardfork)
* [state](vmopts.md#state)
* [stateManager](vmopts.md#statemanager)

---

## Properties

<a id="activateprecompiles"></a>

### `<Optional>` activatePrecompiles

**● activatePrecompiles**: *`undefined` \| `false` \| `true`*

*Defined in [index.ts:43](https://github.com/ethereumjs/ethereumjs-vm/blob/de4d574/lib/index.ts#L43)*

If true, create entries in the state tree for the precompiled contracts

___
<a id="allowunlimitedcontractsize"></a>

### `<Optional>` allowUnlimitedContractSize

**● allowUnlimitedContractSize**: *`undefined` \| `false` \| `true`*

*Defined in [index.ts:47](https://github.com/ethereumjs/ethereumjs-vm/blob/de4d574/lib/index.ts#L47)*

Allows unlimited contract sizes while debugging. By setting this to `true`, the check for contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed

___
<a id="blockchain"></a>

### `<Optional>` blockchain

**● blockchain**: *`any`*

*Defined in [index.ts:39](https://github.com/ethereumjs/ethereumjs-vm/blob/de4d574/lib/index.ts#L39)*

A [blockchain](https://github.com/ethereumjs/ethereumjs-blockchain) object for storing/retrieving blocks

___
<a id="chain"></a>

### `<Optional>` chain

**● chain**: *`undefined` \| `string`*

*Defined in [index.ts:22](https://github.com/ethereumjs/ethereumjs-vm/blob/de4d574/lib/index.ts#L22)*

The chain the VM operates on

___
<a id="hardfork"></a>

### `<Optional>` hardfork

**● hardfork**: *`undefined` \| `string`*

*Defined in [index.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/de4d574/lib/index.ts#L26)*

Hardfork rules to be used

___
<a id="state"></a>

### `<Optional>` state

**● state**: *`any`*

*Defined in [index.ts:35](https://github.com/ethereumjs/ethereumjs-vm/blob/de4d574/lib/index.ts#L35)*

A [merkle-patricia-tree](https://github.com/ethereumjs/merkle-patricia-tree) instance for the state tree (ignored if stateManager is passed)

*__deprecated__*: 

___
<a id="statemanager"></a>

### `<Optional>` stateManager

**● stateManager**: *[StateManager](../classes/statemanager.md)*

*Defined in [index.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/de4d574/lib/index.ts#L30)*

A [StateManager](../classes/statemanager.md) instance to use as the state store (Beta API)

___

