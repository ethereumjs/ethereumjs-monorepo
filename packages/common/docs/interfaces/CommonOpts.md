[@ethereumjs/common](../README.md) / CommonOpts

# Interface: CommonOpts

Options for instantiating a {@link Common} instance.

## Hierarchy

- `BaseOpts`

  ↳ **`CommonOpts`**

## Table of contents

### Properties

- [chain](CommonOpts.md#chain)
- [customChains](CommonOpts.md#customchains)
- [eips](CommonOpts.md#eips)
- [hardfork](CommonOpts.md#hardfork)
- [supportedHardforks](CommonOpts.md#supportedhardforks)

## Properties

### chain

• **chain**: `string` \| `number` \| `object` \| `BN`

Chain name ('mainnet'), id (1), or [Chain](../enums/Chain.md) enum,
either from a chain directly supported or a custom chain
passed in via [CommonOpts.customChains](CommonOpts.md#customchains).

#### Defined in

[packages/common/src/index.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L129)

___

### customChains

• `Optional` **customChains**: `Chain`[] \| [`Chain`, `GenesisState`][]

Initialize (in addition to the supported chains) with the selected
custom chains

Usage (directly with the respective chain intialization via the [CommonOpts.chain](CommonOpts.md#chain) option):

Pattern 1 (without genesis state):

```javascript
import myCustomChain1 from '[PATH_TO_MY_CHAINS]/myCustomChain1.json'
const common = new Common({ chain: 'myCustomChain1', customChains: [ myCustomChain1 ]})
```

Pattern 2 (with genesis state, see {@link GenesisState} for format):

```javascript
import myCustomChain1 from '[PATH_TO_MY_CHAINS]/myCustomChain1.json'
import chain1GenesisState from '[PATH_TO_GENESIS_STATES]/chain1GenesisState.json'
const common = new Common({ chain: 'myCustomChain1', customChains: [ [ myCustomChain1, chain1GenesisState ] ]})
```

#### Defined in

[packages/common/src/index.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L151)

___

### eips

• `Optional` **eips**: `number`[]

Selected EIPs which can be activated, please use an array for instantiation
(e.g. `eips: [ 2537, ]`)

Currently supported:

- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS12-381 precompiles

#### Inherited from

BaseOpts.eips

#### Defined in

[packages/common/src/index.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L117)

___

### hardfork

• `Optional` **hardfork**: `string`

String identifier ('byzantium') for hardfork or [Hardfork](../enums/Hardfork.md) enum.

Default: Hardfork.Istanbul

#### Inherited from

BaseOpts.hardfork

#### Defined in

[packages/common/src/index.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L104)

___

### supportedHardforks

• `Optional` **supportedHardforks**: `string`[]

Limit parameter returns to the given hardforks

#### Inherited from

BaseOpts.supportedHardforks

#### Defined in

[packages/common/src/index.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L108)
