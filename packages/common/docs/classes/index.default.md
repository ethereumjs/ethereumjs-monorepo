[@ethereumjs/common](../README.md) / [index](../modules/index.md) / default

# Class: default

[index](../modules/index.md).default

Common class to access chain and hardfork parameters and to provide
a unified and shared view on the network and hardfork state.

Use the {@link Common.custom} static constructor for creating simple
custom chain {@link Common} objects (more complete custom chain setups
can be created via the main constructor and the [CommonOpts.customChains](../interfaces/index.commonopts.md#customchains) parameter).

## Hierarchy

- `EventEmitter`

  ↳ **default**

## Table of contents

### Constructors

- [constructor](index.default.md#constructor)

### Properties

- [DEFAULT\_HARDFORK](index.default.md#default_hardfork)
- [defaultMaxListeners](index.default.md#defaultmaxlisteners)

### Methods

- [\_calcForkHash](index.default.md#_calcforkhash)
- [\_chooseHardfork](index.default.md#_choosehardfork)
- [\_getHardfork](index.default.md#_gethardfork)
- [\_isSupportedHardfork](index.default.md#_issupportedhardfork)
- [activeHardfork](index.default.md#activehardfork)
- [activeHardforks](index.default.md#activehardforks)
- [activeOnBlock](index.default.md#activeonblock)
- [addListener](index.default.md#addlistener)
- [bootstrapNodes](index.default.md#bootstrapnodes)
- [chainId](index.default.md#chainid)
- [chainIdBN](index.default.md#chainidbn)
- [chainName](index.default.md#chainname)
- [consensusAlgorithm](index.default.md#consensusalgorithm)
- [consensusConfig](index.default.md#consensusconfig)
- [consensusType](index.default.md#consensustype)
- [copy](index.default.md#copy)
- [dnsNetworks](index.default.md#dnsnetworks)
- [eips](index.default.md#eips)
- [emit](index.default.md#emit)
- [eventNames](index.default.md#eventnames)
- [forkHash](index.default.md#forkhash)
- [genesis](index.default.md#genesis)
- [getHardforkByBlockNumber](index.default.md#gethardforkbyblocknumber)
- [getMaxListeners](index.default.md#getmaxlisteners)
- [gteHardfork](index.default.md#gtehardfork)
- [hardfork](index.default.md#hardfork)
- [hardforkBlock](index.default.md#hardforkblock)
- [hardforkBlockBN](index.default.md#hardforkblockbn)
- [hardforkForForkHash](index.default.md#hardforkforforkhash)
- [hardforkGteHardfork](index.default.md#hardforkgtehardfork)
- [hardforkIsActiveOnBlock](index.default.md#hardforkisactiveonblock)
- [hardforkIsActiveOnChain](index.default.md#hardforkisactiveonchain)
- [hardforks](index.default.md#hardforks)
- [isActivatedEIP](index.default.md#isactivatedeip)
- [isHardforkBlock](index.default.md#ishardforkblock)
- [isNextHardforkBlock](index.default.md#isnexthardforkblock)
- [listenerCount](index.default.md#listenercount)
- [listeners](index.default.md#listeners)
- [networkId](index.default.md#networkid)
- [networkIdBN](index.default.md#networkidbn)
- [nextHardforkBlock](index.default.md#nexthardforkblock)
- [nextHardforkBlockBN](index.default.md#nexthardforkblockbn)
- [off](index.default.md#off)
- [on](index.default.md#on)
- [once](index.default.md#once)
- [param](index.default.md#param)
- [paramByBlock](index.default.md#parambyblock)
- [paramByEIP](index.default.md#parambyeip)
- [paramByHardfork](index.default.md#parambyhardfork)
- [prependListener](index.default.md#prependlistener)
- [prependOnceListener](index.default.md#prependoncelistener)
- [rawListeners](index.default.md#rawlisteners)
- [removeAllListeners](index.default.md#removealllisteners)
- [removeListener](index.default.md#removelistener)
- [setChain](index.default.md#setchain)
- [setEIPs](index.default.md#seteips)
- [setHardfork](index.default.md#sethardfork)
- [setHardforkByBlockNumber](index.default.md#sethardforkbyblocknumber)
- [setMaxListeners](index.default.md#setmaxlisteners)
- [custom](index.default.md#custom)
- [forCustomChain](index.default.md#forcustomchain)
- [isSupportedChainId](index.default.md#issupportedchainid)
- [listenerCount](index.default.md#listenercount)
- [once](index.default.md#once)

## Constructors

### constructor

• **new default**(`opts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [CommonOpts](../interfaces/index.commonopts.md) |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/common/src/index.ts:278](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L278)

## Properties

### DEFAULT\_HARDFORK

• `Readonly` **DEFAULT\_HARDFORK**: `string`

#### Defined in

[packages/common/src/index.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L135)

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:20

## Methods

### \_calcForkHash

▸ **_calcForkHash**(`hardfork`): `string`

Internal helper function to calculate a fork hash

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | `string` | Hardfork name |

#### Returns

`string`

Fork hash as hex string

#### Defined in

[packages/common/src/index.ts:778](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L778)

___

### \_chooseHardfork

▸ **_chooseHardfork**(`hardfork?`, `onlySupported?`): `string`

Internal helper function to choose between hardfork set and hardfork provided as param

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `hardfork?` | ``null`` \| `string` | `undefined` | Hardfork given to function as a parameter |
| `onlySupported` | `boolean` | true | - |

#### Returns

`string`

Hardfork chosen to be used

#### Defined in

[packages/common/src/index.ts:390](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L390)

___

### \_getHardfork

▸ **_getHardfork**(`hardfork`): `any`

Internal helper function, returns the params for the given hardfork for the chain set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | `string` | Hardfork name |

#### Returns

`any`

Dictionary with hardfork params

#### Defined in

[packages/common/src/index.ts:404](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L404)

___

### \_isSupportedHardfork

▸ **_isSupportedHardfork**(`hardfork`): `boolean`

Internal helper function to check if a hardfork is set to be supported by the library

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | ``null`` \| `string` | Hardfork name |

#### Returns

`boolean`

True if hardfork is supported

#### Defined in

[packages/common/src/index.ts:417](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L417)

___

### activeHardfork

▸ **activeHardfork**(`blockNumber?`, `opts?`): `string`

Returns the latest active hardfork name for chain or block or throws if unavailable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber?` | ``null`` \| `string` \| `number` \| `BN` \| `Buffer` | up to block if provided, otherwise for the whole chain |
| `opts` | `hardforkOptions` | Hardfork options (onlyActive unused) |

#### Returns

`string`

Hardfork name

#### Defined in

[packages/common/src/index.ts:689](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L689)

___

### activeHardforks

▸ **activeHardforks**(`blockNumber?`, `opts?`): `any`[]

Returns the active hardfork switches for the current chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber?` | ``null`` \| `string` \| `number` \| `BN` \| `Buffer` | up to block if provided, otherwise for the whole chain |
| `opts` | `hardforkOptions` | Hardfork options (onlyActive unused) |

#### Returns

`any`[]

Array with hardfork arrays

#### Defined in

[packages/common/src/index.ts:670](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L670)

___

### activeOnBlock

▸ **activeOnBlock**(`blockNumber`, `opts?`): `boolean`

Alias to hardforkIsActiveOnBlock when hardfork is set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber` | `BNLike` |  |
| `opts?` | `hardforkOptions` | Hardfork options (onlyActive unused) |

#### Returns

`boolean`

True if HF is active on block number

#### Defined in

[packages/common/src/index.ts:599](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L599)

___

### addListener

▸ **addListener**(`event`, `listener`): [default](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[default](index.default.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/globals.d.ts:595

___

### bootstrapNodes

▸ **bootstrapNodes**(): `any`

Returns bootstrap nodes for the current chain

#### Returns

`any`

Dict with bootstrap nodes

#### Defined in

[packages/common/src/index.ts:853](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L853)

___

### chainId

▸ **chainId**(): `number`

Returns the Id of current chain

**`deprecated`** Please use chainIdBN() for large number support

#### Returns

`number`

chain Id

#### Defined in

[packages/common/src/index.ts:878](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L878)

___

### chainIdBN

▸ **chainIdBN**(): `BN`

Returns the Id of current chain

#### Returns

`BN`

chain Id

#### Defined in

[packages/common/src/index.ts:886](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L886)

___

### chainName

▸ **chainName**(): `string`

Returns the name of current chain

#### Returns

`string`

chain name (lower case)

#### Defined in

[packages/common/src/index.ts:894](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L894)

___

### consensusAlgorithm

▸ **consensusAlgorithm**(): `string`

Returns the concrete consensus implementation
algorithm or protocol for the network
e.g. "ethash" for "pow" consensus type or
"clique" for "poa" consensus type

#### Returns

`string`

#### Defined in

[packages/common/src/index.ts:937](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L937)

___

### consensusConfig

▸ **consensusConfig**(): `any`

Returns a dictionary with consensus configuration
parameters based on the consensus algorithm

Expected returns (parameters must be present in
the respective chain json files):

ethash: -
clique: period, epoch
aura: -

#### Returns

`any`

#### Defined in

[packages/common/src/index.ts:952](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L952)

___

### consensusType

▸ **consensusType**(): `string`

Returns the consensus type of the network
Possible values: "pow"|"poa"|"pos"

#### Returns

`string`

#### Defined in

[packages/common/src/index.ts:927](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L927)

___

### copy

▸ **copy**(): [default](index.default.md)

Returns a deep copy of this {@link Common} instance.

#### Returns

[default](index.default.md)

#### Defined in

[packages/common/src/index.ts:959](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L959)

___

### dnsNetworks

▸ **dnsNetworks**(): `any`

Returns DNS networks for the current chain

#### Returns

`any`

Array of DNS ENR urls

#### Defined in

[packages/common/src/index.ts:861](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L861)

___

### eips

▸ **eips**(): `number`[]

Returns the active EIPs

#### Returns

`number`[]

List of EIPs

#### Defined in

[packages/common/src/index.ts:919](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L919)

___

### emit

▸ **emit**(`event`, ...`args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Inherited from

EventEmitter.emit

#### Defined in

node_modules/@types/node/globals.d.ts:605

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/@types/node/globals.d.ts:610

___

### forkHash

▸ **forkHash**(`hardfork?`): `any`

Returns an eth/64 compliant fork hash (EIP-2124)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

`any`

#### Defined in

[packages/common/src/index.ts:808](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L808)

___

### genesis

▸ **genesis**(): `any`

Returns the Genesis parameters of current chain

#### Returns

`any`

Genesis dictionary

#### Defined in

[packages/common/src/index.ts:837](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L837)

___

### getHardforkByBlockNumber

▸ **getHardforkByBlockNumber**(`blockNumber`): `string`

Returns the hardfork based on the block number provided

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `BNLike` |

#### Returns

`string`

The name of the HF

#### Defined in

[packages/common/src/index.ts:356](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L356)

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Inherited from

EventEmitter.getMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:602

___

### gteHardfork

▸ **gteHardfork**(`hardfork`, `opts?`): `boolean`

Alias to hardforkGteHardfork when hardfork is set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | `string` | Hardfork name |
| `opts?` | `hardforkOptions` | Hardfork options |

#### Returns

`boolean`

True if hardfork set is greater than hardfork provided

#### Defined in

[packages/common/src/index.ts:642](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L642)

___

### hardfork

▸ **hardfork**(): `string`

Returns the hardfork set

#### Returns

`string`

Hardfork name

#### Defined in

[packages/common/src/index.ts:869](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L869)

___

### hardforkBlock

▸ **hardforkBlock**(`hardfork?`): `number`

Returns the hardfork change block for hardfork provided or set

**`deprecated`** Please use hardforkBlockBN() for large number support

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

`number`

Block number

#### Defined in

[packages/common/src/index.ts:704](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L704)

___

### hardforkBlockBN

▸ **hardforkBlockBN**(`hardfork?`): `BN`

Returns the hardfork change block for hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

`BN`

Block number

#### Defined in

[packages/common/src/index.ts:713](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L713)

___

### hardforkForForkHash

▸ **hardforkForForkHash**(`forkHash`): `any`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `forkHash` | `string` | Fork hash as a hex string |

#### Returns

`any`

Array with hardfork data (name, block, forkHash)

#### Defined in

[packages/common/src/index.ts:826](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L826)

___

### hardforkGteHardfork

▸ **hardforkGteHardfork**(`hardfork1`, `hardfork2`, `opts?`): `boolean`

Sequence based check if given or set HF1 is greater than or equal HF2

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork1` | ``null`` \| `string` | Hardfork name or null (if set) |
| `hardfork2` | `string` | Hardfork name |
| `opts` | `hardforkOptions` | Hardfork options |

#### Returns

`boolean`

True if HF1 gte HF2

#### Defined in

[packages/common/src/index.ts:610](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L610)

___

### hardforkIsActiveOnBlock

▸ **hardforkIsActiveOnBlock**(`hardfork`, `blockNumber`, `opts?`): `boolean`

Checks if set or provided hardfork is active on block number

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | ``null`` \| `string` | Hardfork name or null (for HF set) |
| `blockNumber` | `BNLike` |  |
| `opts` | `hardforkOptions` | Hardfork options (onlyActive unused) |

#### Returns

`boolean`

True if HF is active on block number

#### Defined in

[packages/common/src/index.ts:578](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L578)

___

### hardforkIsActiveOnChain

▸ **hardforkIsActiveOnChain**(`hardfork?`, `opts?`): `boolean`

Checks if given or set hardfork is active on the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | ``null`` \| `string` | Hardfork name, optional if HF set |
| `opts` | `hardforkOptions` | Hardfork options (onlyActive unused) |

#### Returns

`boolean`

True if hardfork is active on the chain

#### Defined in

[packages/common/src/index.ts:652](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L652)

___

### hardforks

▸ **hardforks**(): `any`

Returns the hardforks for current chain

#### Returns

`any`

Array with arrays of hardforks

#### Defined in

[packages/common/src/index.ts:845](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L845)

___

### isActivatedEIP

▸ **isActivatedEIP**(`eip`): `boolean`

Checks if an EIP is activated by either being included in the EIPs
manually passed in with the [CommonOpts.eips](../interfaces/index.commonopts.md#eips) or in a
hardfork currently being active

Note: this method only works for EIPs being supported
by the [CommonOpts.eips](../interfaces/index.commonopts.md#eips) constructor option

#### Parameters

| Name | Type |
| :------ | :------ |
| `eip` | `number` |

#### Returns

`boolean`

#### Defined in

[packages/common/src/index.ts:556](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L556)

___

### isHardforkBlock

▸ **isHardforkBlock**(`blockNumber`, `hardfork?`): `boolean`

True if block number provided is the hardfork (given or set) change block

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber` | `BNLike` | Number of the block to check |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

`boolean`

True if blockNumber is HF block

#### Defined in

[packages/common/src/index.ts:724](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L724)

___

### isNextHardforkBlock

▸ **isNextHardforkBlock**(`blockNumber`, `hardfork?`): `boolean`

True if block number provided is the hardfork change block following the hardfork given or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber` | `BNLike` | Number of the block to check |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

`boolean`

True if blockNumber is HF block

#### Defined in

[packages/common/src/index.ts:766](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L766)

___

### listenerCount

▸ **listenerCount**(`type`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/globals.d.ts:606

___

### listeners

▸ **listeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.listeners

#### Defined in

node_modules/@types/node/globals.d.ts:603

___

### networkId

▸ **networkId**(): `number`

Returns the Id of current network

**`deprecated`** Please use networkIdBN() for large number support

#### Returns

`number`

network Id

#### Defined in

[packages/common/src/index.ts:903](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L903)

___

### networkIdBN

▸ **networkIdBN**(): `BN`

Returns the Id of current network

#### Returns

`BN`

network Id

#### Defined in

[packages/common/src/index.ts:911](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L911)

___

### nextHardforkBlock

▸ **nextHardforkBlock**(`hardfork?`): ``null`` \| `number`

Returns the change block for the next hardfork after the hardfork provided or set

**`deprecated`** Please use nextHardforkBlockBN() for large number support

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `number`

Block number or null if not available

#### Defined in

[packages/common/src/index.ts:736](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L736)

___

### nextHardforkBlockBN

▸ **nextHardforkBlockBN**(`hardfork?`): ``null`` \| `BN`

Returns the change block for the next hardfork after the hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `BN`

Block number or null if not available

#### Defined in

[packages/common/src/index.ts:746](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L746)

___

### off

▸ **off**(`event`, `listener`): [default](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[default](index.default.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/globals.d.ts:599

___

### on

▸ **on**(`event`, `listener`): [default](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[default](index.default.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/globals.d.ts:596

___

### once

▸ **once**(`event`, `listener`): [default](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[default](index.default.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/globals.d.ts:597

___

### param

▸ **param**(`topic`, `name`): `any`

Returns a parameter for the current chain setup

If the parameter is present in an EIP, the EIP always takes precendence.
Otherwise the parameter if taken from the latest applied HF with
a change on the respective parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
| `name` | `string` | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |

#### Returns

`any`

The value requested or `null` if not found

#### Defined in

[packages/common/src/index.ts:466](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L466)

___

### paramByBlock

▸ **paramByBlock**(`topic`, `name`, `blockNumber`): `any`

Returns a parameter for the hardfork active on block number

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic |
| `name` | `string` | Parameter name |
| `blockNumber` | `BNLike` | Block number |

#### Returns

`any`

#### Defined in

[packages/common/src/index.ts:541](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L541)

___

### paramByEIP

▸ **paramByEIP**(`topic`, `name`, `eip`): `any`

Returns a parameter corresponding to an EIP

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
| `name` | `string` | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |
| `eip` | `number` | Number of the EIP |

#### Returns

`any`

The value requested or `null` if not found

#### Defined in

[packages/common/src/index.ts:519](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L519)

___

### paramByHardfork

▸ **paramByHardfork**(`topic`, `name`, `hardfork`): `any`

Returns the parameter corresponding to a hardfork

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
| `name` | `string` | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |
| `hardfork` | `string` | Hardfork name |

#### Returns

`any`

The value requested or `null` if not found

#### Defined in

[packages/common/src/index.ts:486](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L486)

___

### prependListener

▸ **prependListener**(`event`, `listener`): [default](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[default](index.default.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/globals.d.ts:608

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [default](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[default](index.default.md)

#### Inherited from

EventEmitter.prependOnceListener

#### Defined in

node_modules/@types/node/globals.d.ts:609

___

### rawListeners

▸ **rawListeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.rawListeners

#### Defined in

node_modules/@types/node/globals.d.ts:604

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [default](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[default](index.default.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/globals.d.ts:600

___

### removeListener

▸ **removeListener**(`event`, `listener`): [default](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[default](index.default.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/globals.d.ts:598

___

### setChain

▸ **setChain**(`chain`): `any`

Sets the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | `string` \| `number` \| `object` \| `BN` | String ('mainnet') or Number (1) chain     representation. Or, a Dictionary of chain parameters for a private network. |

#### Returns

`any`

The dictionary with parameters set as chain

#### Defined in

[packages/common/src/index.ts:306](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L306)

___

### setEIPs

▸ **setEIPs**(`eips?`): `void`

Sets the active EIPs

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `eips` | `number`[] | [] |

#### Returns

`void`

#### Defined in

[packages/common/src/index.ts:432](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L432)

___

### setHardfork

▸ **setHardfork**(`hardfork`): `void`

Sets the hardfork to get params for

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | `string` | String identifier (e.g. 'byzantium') |

#### Returns

`void`

#### Defined in

[packages/common/src/index.ts:332](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L332)

___

### setHardforkByBlockNumber

▸ **setHardforkByBlockNumber**(`blockNumber`): `string`

Sets a new hardfork based on the block number provided

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `BNLike` |

#### Returns

`string`

The name of the HF set

#### Defined in

[packages/common/src/index.ts:378](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L378)

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [default](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[default](index.default.md)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:601

___

### custom

▸ `Static` **custom**(`chainParamsOrName`, `opts?`): [default](index.default.md)

Creates a {@link Common} object for a custom chain, based on a standard one.

It uses all the [Chain](../enums/index.chain.md) parameters from the [baseChain](../interfaces/index.customcommonopts.md#basechain) option except the ones overridden
in a provided {@link chainParamsOrName} dictionary. Some usage example:

```javascript
Common.custom({chainId: 123})
```

There are also selected supported custom chains which can be initialized by using one of the
{@link CustomChains} for {@link chainParamsOrName}, e.g.:

```javascript
Common.custom(CustomChains.MaticMumbai)
```

Note that these supported custom chains only provide some base parameters (usually the chain and
network ID and a name) and can only be used for selected use cases (e.g. sending a tx with
the `@ethereumjs/tx` library to a Layer-2 chain).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainParamsOrName` | `Partial`<[Chain](../interfaces/types.chain.md)\> \| [PolygonMainnet](../enums/index.customchain.md#polygonmainnet) \| [PolygonMumbai](../enums/index.customchain.md#polygonmumbai) \| [ArbitrumRinkebyTestnet](../enums/index.customchain.md#arbitrumrinkebytestnet) \| [xDaiChain](../enums/index.customchain.md#xdaichain) | Custom parameter dict (`name` will default to `custom-chain`) or string with name of a supported custom chain |
| `opts` | [CustomCommonOpts](../interfaces/index.customcommonopts.md) | Custom chain options to set the [CustomCommonOpts.baseChain](../interfaces/index.customcommonopts.md#basechain), selected [CustomCommonOpts.hardfork](../interfaces/index.customcommonopts.md#hardfork) and others |

#### Returns

[default](index.default.md)

#### Defined in

[packages/common/src/index.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L167)

___

### forCustomChain

▸ `Static` **forCustomChain**(`baseChain`, `customChainParams`, `hardfork?`, `supportedHardforks?`): [default](index.default.md)

Creates a {@link Common} object for a custom chain, based on a standard one. It uses all the `Chain`
params from [baseChain](../interfaces/index.customcommonopts.md#basechain) except the ones overridden in {@link customChainParams}.

**`deprecated`** Use {@link Common.custom} instead

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseChain` | `string` \| `number` | The name (`mainnet`) or id (`1`) of a standard chain used to base the custom chain params on. |
| `customChainParams` | `Partial`<[Chain](../interfaces/types.chain.md)\> | The custom parameters of the chain. |
| `hardfork?` | `string` | String identifier ('byzantium') for hardfork (optional) |
| `supportedHardforks?` | `string`[] | Limit parameter returns to the given hardforks (optional) |

#### Returns

[default](index.default.md)

#### Defined in

[packages/common/src/index.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L229)

___

### isSupportedChainId

▸ `Static` **isSupportedChainId**(`chainId`): `boolean`

Static method to determine if a [chainId](index.default.md#chainid) is supported as a standard chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | `BN` | BN id (`1`) of a standard chain |

#### Returns

`boolean`

boolean

#### Defined in

[packages/common/src/index.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L252)

___

### listenerCount

▸ `Static` **listenerCount**(`emitter`, `event`): `number`

**`deprecated`** since v4.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` |
| `event` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:17

___

### once

▸ `Static` **once**(`emitter`, `event`): `Promise`<any[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `NodeEventTarget` |
| `event` | `string` \| `symbol` |

#### Returns

`Promise`<any[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:13

▸ `Static` **once**(`emitter`, `event`): `Promise`<any[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `DOMEventTarget` |
| `event` | `string` |

#### Returns

`Promise`<any[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:14
