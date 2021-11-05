[@ethereumjs/common](../README.md) / default

# Class: default

Common class to access chain and hardfork parameters and to provide
a unified and shared view on the network and hardfork state.

Use the {@link Common.custom} static constructor for creating simple
custom chain {@link Common} objects (more complete custom chain setups
can be created via the main constructor and the [CommonOpts.customChains](../interfaces/CommonOpts.md#customchains) parameter).

## Hierarchy

- `EventEmitter`

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [DEFAULT\_HARDFORK](default.md#default_hardfork)
- [defaultMaxListeners](default.md#defaultmaxlisteners)

### Methods

- [\_calcForkHash](default.md#_calcforkhash)
- [\_chooseHardfork](default.md#_choosehardfork)
- [\_getHardfork](default.md#_gethardfork)
- [\_isSupportedHardfork](default.md#_issupportedhardfork)
- [activeHardfork](default.md#activehardfork)
- [activeHardforks](default.md#activehardforks)
- [activeOnBlock](default.md#activeonblock)
- [addListener](default.md#addlistener)
- [bootstrapNodes](default.md#bootstrapnodes)
- [chainId](default.md#chainid)
- [chainIdBN](default.md#chainidbn)
- [chainName](default.md#chainname)
- [consensusAlgorithm](default.md#consensusalgorithm)
- [consensusConfig](default.md#consensusconfig)
- [consensusType](default.md#consensustype)
- [copy](default.md#copy)
- [dnsNetworks](default.md#dnsnetworks)
- [eips](default.md#eips)
- [emit](default.md#emit)
- [eventNames](default.md#eventnames)
- [forkHash](default.md#forkhash)
- [genesis](default.md#genesis)
- [genesisState](default.md#genesisstate)
- [getHardforkByBlockNumber](default.md#gethardforkbyblocknumber)
- [getMaxListeners](default.md#getmaxlisteners)
- [gteHardfork](default.md#gtehardfork)
- [hardfork](default.md#hardfork)
- [hardforkBlock](default.md#hardforkblock)
- [hardforkBlockBN](default.md#hardforkblockbn)
- [hardforkForForkHash](default.md#hardforkforforkhash)
- [hardforkGteHardfork](default.md#hardforkgtehardfork)
- [hardforkIsActiveOnBlock](default.md#hardforkisactiveonblock)
- [hardforkIsActiveOnChain](default.md#hardforkisactiveonchain)
- [hardforkTD](default.md#hardforktd)
- [hardforks](default.md#hardforks)
- [isActivatedEIP](default.md#isactivatedeip)
- [isHardforkBlock](default.md#ishardforkblock)
- [isNextHardforkBlock](default.md#isnexthardforkblock)
- [listenerCount](default.md#listenercount)
- [listeners](default.md#listeners)
- [networkId](default.md#networkid)
- [networkIdBN](default.md#networkidbn)
- [nextHardforkBlock](default.md#nexthardforkblock)
- [nextHardforkBlockBN](default.md#nexthardforkblockbn)
- [off](default.md#off)
- [on](default.md#on)
- [once](default.md#once)
- [param](default.md#param)
- [paramByBlock](default.md#parambyblock)
- [paramByEIP](default.md#parambyeip)
- [paramByHardfork](default.md#parambyhardfork)
- [prependListener](default.md#prependlistener)
- [prependOnceListener](default.md#prependoncelistener)
- [rawListeners](default.md#rawlisteners)
- [removeAllListeners](default.md#removealllisteners)
- [removeListener](default.md#removelistener)
- [setChain](default.md#setchain)
- [setEIPs](default.md#seteips)
- [setHardfork](default.md#sethardfork)
- [setHardforkByBlockNumber](default.md#sethardforkbyblocknumber)
- [setMaxListeners](default.md#setmaxlisteners)
- [custom](default.md#custom)
- [forCustomChain](default.md#forcustomchain)
- [isSupportedChainId](default.md#issupportedchainid)
- [listenerCount](default.md#listenercount)
- [once](default.md#once)

## Constructors

### constructor

• **new default**(`opts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`CommonOpts`](../interfaces/CommonOpts.md) |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/common/src/index.ts:351](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L351)

## Properties

### DEFAULT\_HARDFORK

• `Readonly` **DEFAULT\_HARDFORK**: `string`

#### Defined in

[packages/common/src/index.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L179)

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

[packages/common/src/index.ts:932](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L932)

___

### \_chooseHardfork

▸ **_chooseHardfork**(`hardfork?`, `onlySupported?`): `string`

Internal helper function to choose between hardfork set and hardfork provided as param

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `hardfork?` | ``null`` \| `string` | `undefined` | Hardfork given to function as a parameter |
| `onlySupported` | `boolean` | `true` | - |

#### Returns

`string`

Hardfork chosen to be used

#### Defined in

[packages/common/src/index.ts:520](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L520)

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

[packages/common/src/index.ts:534](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L534)

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

[packages/common/src/index.ts:547](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L547)

___

### activeHardfork

▸ **activeHardfork**(`blockNumber?`, `opts?`): `string`

Returns the latest active hardfork name for chain or block or throws if unavailable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber?` | ``null`` \| `BNLike` | up to block if provided, otherwise for the whole chain |
| `opts` | `hardforkOptions` | Hardfork options (onlyActive unused) |

#### Returns

`string`

Hardfork name

#### Defined in

[packages/common/src/index.ts:819](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L819)

___

### activeHardforks

▸ **activeHardforks**(`blockNumber?`, `opts?`): `Hardfork`[]

Returns the active hardfork switches for the current chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber?` | ``null`` \| `BNLike` | up to block if provided, otherwise for the whole chain |
| `opts` | `hardforkOptions` | Hardfork options (onlyActive unused) |

#### Returns

`Hardfork`[]

Array with hardfork arrays

#### Defined in

[packages/common/src/index.ts:800](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L800)

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

[packages/common/src/index.ts:729](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L729)

___

### addListener

▸ **addListener**(`event`, `listener`): [`default`](default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`default`](default.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/globals.d.ts:595

___

### bootstrapNodes

▸ **bootstrapNodes**(): `BootstrapNode`[]

Returns bootstrap nodes for the current chain

#### Returns

`BootstrapNode`[]

Dict with bootstrap nodes

#### Defined in

[packages/common/src/index.ts:1046](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1046)

___

### chainId

▸ **chainId**(): `number`

Returns the Id of current chain

**`deprecated`** Please use {@link Common.chainIdBN} for large number support

#### Returns

`number`

chain Id

#### Defined in

[packages/common/src/index.ts:1071](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1071)

___

### chainIdBN

▸ **chainIdBN**(): `BN`

Returns the Id of current chain

#### Returns

`BN`

chain Id

#### Defined in

[packages/common/src/index.ts:1079](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1079)

___

### chainName

▸ **chainName**(): `string`

Returns the name of current chain

#### Returns

`string`

chain name (lower case)

#### Defined in

[packages/common/src/index.ts:1087](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1087)

___

### consensusAlgorithm

▸ **consensusAlgorithm**(): `string`

Returns the concrete consensus implementation
algorithm or protocol for the network
e.g. "ethash" for "pow" consensus type,
"clique" for "poa" consensus type or
"casper" for "pos" consensus type.

Note: This value can update along a hardfork.

#### Returns

`string`

#### Defined in

[packages/common/src/index.ts:1147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1147)

___

### consensusConfig

▸ **consensusConfig**(): `Object`

Returns a dictionary with consensus configuration
parameters based on the consensus algorithm

Expected returns (parameters must be present in
the respective chain json files):

ethash: -
clique: period, epoch
aura: -
casper: -

Note: This value can update along a hardfork.

#### Returns

`Object`

#### Defined in

[packages/common/src/index.ts:1177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1177)

___

### consensusType

▸ **consensusType**(): `string`

Returns the consensus type of the network
Possible values: "pow"|"poa"|"pos"

Note: This value can update along a hardfork.

#### Returns

`string`

#### Defined in

[packages/common/src/index.ts:1122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1122)

___

### copy

▸ **copy**(): [`default`](default.md)

Returns a deep copy of this {@link Common} instance.

#### Returns

[`default`](default.md)

#### Defined in

[packages/common/src/index.ts:1198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1198)

___

### dnsNetworks

▸ **dnsNetworks**(): `string`[]

Returns DNS networks for the current chain

#### Returns

`string`[]

Array of DNS ENR urls

#### Defined in

[packages/common/src/index.ts:1054](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1054)

___

### eips

▸ **eips**(): `number`[]

Returns the active EIPs

#### Returns

`number`[]

List of EIPs

#### Defined in

[packages/common/src/index.ts:1112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1112)

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

[packages/common/src/index.ts:964](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L964)

___

### genesis

▸ **genesis**(): `GenesisBlock`

Returns the Genesis parameters of the current chain

#### Returns

`GenesisBlock`

Genesis dictionary

#### Defined in

[packages/common/src/index.ts:993](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L993)

___

### genesisState

▸ **genesisState**(): `GenesisState`

Returns the Genesis state of the current chain,
all values are provided as hex-prefixed strings.

#### Returns

`GenesisState`

#### Defined in

[packages/common/src/index.ts:1001](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1001)

___

### getHardforkByBlockNumber

▸ **getHardforkByBlockNumber**(`blockNumber`, `td?`): `string`

Returns the hardfork based on the block number or an optional
total difficulty (Merge HF) provided.

An optional TD takes precedence in case the corresponding HF block
is set to `null` or otherwise needs to match (if not an error
will be thrown).

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `BNLike` |
| `td?` | `BNLike` |

#### Returns

`string`

The name of the HF

#### Defined in

[packages/common/src/index.ts:447](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L447)

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

[packages/common/src/index.ts:772](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L772)

___

### hardfork

▸ **hardfork**(): `string`

Returns the hardfork set

#### Returns

`string`

Hardfork name

#### Defined in

[packages/common/src/index.ts:1062](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1062)

___

### hardforkBlock

▸ **hardforkBlock**(`hardfork?`): ``null`` \| `number`

Returns the hardfork change block for hardfork provided or set

**`deprecated`** Please use {@link Common.hardforkBlockBN} for large number support

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `number`

Block number or null if unscheduled

#### Defined in

[packages/common/src/index.ts:834](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L834)

___

### hardforkBlockBN

▸ **hardforkBlockBN**(`hardfork?`): ``null`` \| `BN`

Returns the hardfork change block for hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `BN`

Block number or null if unscheduled

#### Defined in

[packages/common/src/index.ts:844](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L844)

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

[packages/common/src/index.ts:982](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L982)

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

[packages/common/src/index.ts:740](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L740)

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

[packages/common/src/index.ts:708](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L708)

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

[packages/common/src/index.ts:782](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L782)

___

### hardforkTD

▸ **hardforkTD**(`hardfork?`): ``null`` \| `BN`

Returns the hardfork change total difficulty (Merge HF) for hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `BN`

Total difficulty or null if no set

#### Defined in

[packages/common/src/index.ts:858](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L858)

___

### hardforks

▸ **hardforks**(): `Hardfork`[]

Returns the hardforks for current chain

#### Returns

`Hardfork`[]

Array with arrays of hardforks

#### Defined in

[packages/common/src/index.ts:1038](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1038)

___

### isActivatedEIP

▸ **isActivatedEIP**(`eip`): `boolean`

Checks if an EIP is activated by either being included in the EIPs
manually passed in with the [CommonOpts.eips](../interfaces/CommonOpts.md#eips) or in a
hardfork currently being active

Note: this method only works for EIPs being supported
by the [CommonOpts.eips](../interfaces/CommonOpts.md#eips) constructor option

#### Parameters

| Name | Type |
| :------ | :------ |
| `eip` | `number` |

#### Returns

`boolean`

#### Defined in

[packages/common/src/index.ts:686](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L686)

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

[packages/common/src/index.ts:873](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L873)

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

[packages/common/src/index.ts:919](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L919)

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

**`deprecated`** Please use {@link Common.networkIdBN} for large number support

#### Returns

`number`

network Id

#### Defined in

[packages/common/src/index.ts:1096](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1096)

___

### networkIdBN

▸ **networkIdBN**(): `BN`

Returns the Id of current network

#### Returns

`BN`

network Id

#### Defined in

[packages/common/src/index.ts:1104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1104)

___

### nextHardforkBlock

▸ **nextHardforkBlock**(`hardfork?`): ``null`` \| `number`

Returns the change block for the next hardfork after the hardfork provided or set

**`deprecated`** Please use {@link Common.nextHardforkBlockBN} for large number support

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `number`

Block number or null if not available

#### Defined in

[packages/common/src/index.ts:886](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L886)

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

[packages/common/src/index.ts:896](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L896)

___

### off

▸ **off**(`event`, `listener`): [`default`](default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`default`](default.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/globals.d.ts:599

___

### on

▸ **on**(`event`, `listener`): [`default`](default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`default`](default.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/globals.d.ts:596

___

### once

▸ **once**(`event`, `listener`): [`default`](default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`default`](default.md)

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

[packages/common/src/index.ts:596](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L596)

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

[packages/common/src/index.ts:671](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L671)

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

[packages/common/src/index.ts:649](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L649)

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

[packages/common/src/index.ts:616](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L616)

___

### prependListener

▸ **prependListener**(`event`, `listener`): [`default`](default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`default`](default.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/globals.d.ts:608

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`default`](default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`default`](default.md)

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

▸ **removeAllListeners**(`event?`): [`default`](default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`default`](default.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/globals.d.ts:600

___

### removeListener

▸ **removeListener**(`event`, `listener`): [`default`](default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`default`](default.md)

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

[packages/common/src/index.ts:379](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L379)

___

### setEIPs

▸ **setEIPs**(`eips?`): `void`

Sets the active EIPs

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `eips` | `number`[] | `[]` |

#### Returns

`void`

#### Defined in

[packages/common/src/index.ts:562](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L562)

___

### setHardfork

▸ **setHardfork**(`hardfork`): `void`

Sets the hardfork to get params for

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | `string` | String identifier (e.g. 'byzantium') or [Hardfork](../enums/Hardfork.md) enum |

#### Returns

`void`

#### Defined in

[packages/common/src/index.ts:416](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L416)

___

### setHardforkByBlockNumber

▸ **setHardforkByBlockNumber**(`blockNumber`, `td?`): `string`

Sets a new hardfork based on the block number or an optional
total difficulty (Merge HF) provided.

An optional TD takes precedence in case the corresponding HF block
is set to `null` or otherwise needs to match (if not an error
will be thrown).

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `BNLike` |
| `td?` | `BNLike` |

#### Returns

`string`

The name of the HF set

#### Defined in

[packages/common/src/index.ts:509](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L509)

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`default`](default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`default`](default.md)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:601

___

### custom

▸ `Static` **custom**(`chainParamsOrName`, `opts?`): [`default`](default.md)

Creates a {@link Common} object for a custom chain, based on a standard one.

It uses all the [Chain](../enums/Chain.md) parameters from the [baseChain](../interfaces/CustomCommonOpts.md#basechain) option except the ones overridden
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
| `chainParamsOrName` | `Partial`<`Chain`\> \| [`CustomChain`](../enums/CustomChain.md) | Custom parameter dict (`name` will default to `custom-chain`) or string with name of a supported custom chain |
| `opts` | [`CustomCommonOpts`](../interfaces/CustomCommonOpts.md) | Custom chain options to set the [CustomCommonOpts.baseChain](../interfaces/CustomCommonOpts.md#basechain), selected [CustomCommonOpts.hardfork](../interfaces/CustomCommonOpts.md#hardfork) and others |

#### Returns

[`default`](default.md)

#### Defined in

[packages/common/src/index.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L211)

___

### forCustomChain

▸ `Static` **forCustomChain**(`baseChain`, `customChainParams`, `hardfork?`, `supportedHardforks?`): [`default`](default.md)

Creates a {@link Common} object for a custom chain, based on a standard one. It uses all the `Chain`
params from [baseChain](../interfaces/CustomCommonOpts.md#basechain) except the ones overridden in {@link customChainParams}.

**`deprecated`** Use {@link Common.custom} instead

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseChain` | `string` \| `number` | The name (`mainnet`) or id (`1`) of a standard chain used to base the custom chain params on. |
| `customChainParams` | `Partial`<`Chain`\> | The custom parameters of the chain. |
| `hardfork?` | `string` | String identifier ('byzantium') for hardfork (optional) |
| `supportedHardforks?` | `string`[] | Limit parameter returns to the given hardforks (optional) |

#### Returns

[`default`](default.md)

#### Defined in

[packages/common/src/index.ts:296](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L296)

___

### isSupportedChainId

▸ `Static` **isSupportedChainId**(`chainId`): `boolean`

Static method to determine if a {@link chainId} is supported as a standard chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | `BN` | BN id (`1`) of a standard chain |

#### Returns

`boolean`

boolean

#### Defined in

[packages/common/src/index.ts:319](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L319)

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

▸ `Static` **once**(`emitter`, `event`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `NodeEventTarget` |
| `event` | `string` \| `symbol` |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:13

▸ `Static` **once**(`emitter`, `event`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `DOMEventTarget` |
| `event` | `string` |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:14
