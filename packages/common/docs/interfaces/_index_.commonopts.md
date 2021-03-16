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

• **chain**: *string | number | BN | object*

*Defined in [packages/common/src/index.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L17)*

Chain name ('mainnet') or id (1), either from a chain directly supported
or a custom chain passed in via `customChains`

___

### `Optional` customChains

• **customChains**? : *[Chain](_types_.chain.md)[]*

*Defined in [packages/common/src/index.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L48)*

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

*Defined in [packages/common/src/index.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L36)*

Selected EIPs which can be activated, please use an array for instantiation
(e.g. `eips: [ 2537, ]`)

Currently supported:

- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS12-381 precompiles

___

### `Optional` hardfork

• **hardfork**? : *undefined | string*

*Defined in [packages/common/src/index.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L23)*

String identifier ('byzantium') for hardfork

Default: `istanbul`

___

### `Optional` supportedHardforks

• **supportedHardforks**? : *Array‹string›*

*Defined in [packages/common/src/index.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L27)*

Limit parameter returns to the given hardforks
