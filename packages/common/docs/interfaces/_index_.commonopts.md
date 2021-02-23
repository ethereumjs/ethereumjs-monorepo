[@ethereumjs/common](../README.md) › ["index"](../modules/_index_.md) › [CommonOpts](_index_.commonopts.md)

# Interface: CommonOpts

Options for instantiating a [Common](../classes/_index_.common.md) instance.

## Hierarchy

* **CommonOpts**

## Index

### Properties

* [chain](_index_.commonopts.md#chain)
* [customChains](_index_.commonopts.md#optional-customchains)
* [eips](_index_.commonopts.md#optional-eips)
* [hardfork](_index_.commonopts.md#optional-hardfork)
* [supportedHardforks](_index_.commonopts.md#optional-supportedhardforks)

## Properties

###  chain

• **chain**: *string | number | object*

*Defined in [packages/common/src/index.ts:16](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L16)*

Chain name ('mainnet') or id (1), either from a chain directly supported
or a custom chain passed in via `customChains`

___

### `Optional` customChains

• **customChains**? : *[Chain](_types_.chain.md)[]*

*Defined in [packages/common/src/index.ts:47](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L47)*

Initialize (in addition to the supported chains) with the selected
custom chains

Usage (directly with the respective chain intialization via the `chain` option):

```javascript
import myCustomChain1 from '[PATH_TO_MY_CHAINS]/myCustomChain1.json'
const common = new Common({ chain: 'myCustomChain1', customChains: [ myCustomChain1 ]})
```

___

### `Optional` eips

• **eips**? : *number[]*

*Defined in [packages/common/src/index.ts:35](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L35)*

Selected EIPs which can be activated, please use an array for instantiation
(e.g. `eips: [ 2537, ]`)

Currently supported:

- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS12-381 precompiles

___

### `Optional` hardfork

• **hardfork**? : *undefined | string*

*Defined in [packages/common/src/index.ts:22](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L22)*

String identifier ('byzantium') for hardfork

Default: `istanbul`

___

### `Optional` supportedHardforks

• **supportedHardforks**? : *Array‹string›*

*Defined in [packages/common/src/index.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L26)*

Limit parameter returns to the given hardforks
