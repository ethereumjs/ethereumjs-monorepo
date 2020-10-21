[@ethereumjs/common](../README.md) › ["index"](../modules/_index_.md) › [CommonOpts](_index_.commonopts.md)

# Interface: CommonOpts

Options for instantiating a [Common](../classes/_index_.common.md) instance.

## Hierarchy

* **CommonOpts**

## Index

### Properties

* [chain](_index_.commonopts.md#chain)
* [eips](_index_.commonopts.md#optional-eips)
* [hardfork](_index_.commonopts.md#optional-hardfork)
* [supportedHardforks](_index_.commonopts.md#optional-supportedhardforks)

## Properties

###  chain

• **chain**: *string | number | object*

*Defined in [index.ts:14](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L14)*

String ('mainnet') or Number (1) chain

___

### `Optional` eips

• **eips**? : *number[]*

*Defined in [index.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L33)*

Selected EIPs which can be activated, please use an array for instantiation
(e.g. `eips: [ 2537, ]`)

Currently supported:

- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS12-381 precompiles

___

### `Optional` hardfork

• **hardfork**? : *undefined | string*

*Defined in [index.ts:20](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L20)*

String identifier ('byzantium') for hardfork

Default: `istanbul`

___

### `Optional` supportedHardforks

• **supportedHardforks**? : *Array‹string›*

*Defined in [index.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L24)*

Limit parameter returns to the given hardforks
