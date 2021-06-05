[@ethereumjs/common](../README.md) / [index](../modules/index.md) / default

# Class: default

[index](../modules/index.md).default

Common class to access chain and hardfork parameters

## Hierarchy

- *EventEmitter*

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
- [forCustomChain](index.default.md#forcustomchain)
- [listenerCount](index.default.md#listenercount)
- [once](index.default.md#once)

## Constructors

### constructor

\+ **new default**(`opts`: [*CommonOpts*](../interfaces/index.commonopts.md)): [*default*](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [*CommonOpts*](../interfaces/index.commonopts.md) |

**Returns:** [*default*](index.default.md)

Overrides: EventEmitter.constructor

Defined in: [packages/common/src/index.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L116)

## Properties

### DEFAULT\_HARDFORK

• `Readonly` **DEFAULT\_HARDFORK**: *string*

Defined in: [packages/common/src/index.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L62)

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: *number*

Inherited from: EventEmitter.defaultMaxListeners

Defined in: node_modules/@types/node/events.d.ts:20

## Methods

### \_calcForkHash

▸ **_calcForkHash**(`hardfork`: *string*): *string*

Internal helper function to calculate a fork hash

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | *string* | Hardfork name |

**Returns:** *string*

Fork hash as hex string

Defined in: [packages/common/src/index.ts:613](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L613)

___

### \_chooseHardfork

▸ **_chooseHardfork**(`hardfork?`: ``null`` \| *string*, `onlySupported?`: *boolean*): *string*

Internal helper function to choose between hardfork set and hardfork provided as param

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `hardfork?` | ``null`` \| *string* | - | Hardfork given to function as a parameter |
| `onlySupported` | *boolean* | true | - |

**Returns:** *string*

Hardfork chosen to be used

Defined in: [packages/common/src/index.ts:228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L228)

___

### \_getHardfork

▸ **_getHardfork**(`hardfork`: *string*): *any*

Internal helper function, returns the params for the given hardfork for the chain set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | *string* | Hardfork name |

**Returns:** *any*

Dictionary with hardfork params

Defined in: [packages/common/src/index.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L242)

___

### \_isSupportedHardfork

▸ **_isSupportedHardfork**(`hardfork`: ``null`` \| *string*): *boolean*

Internal helper function to check if a hardfork is set to be supported by the library

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | ``null`` \| *string* | Hardfork name |

**Returns:** *boolean*

True if hardfork is supported

Defined in: [packages/common/src/index.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L255)

___

### activeHardfork

▸ **activeHardfork**(`blockNumber?`: ``null`` \| *string* \| *number* \| *BN* \| *Buffer*, `opts?`: hardforkOptions): *string*

Returns the latest active hardfork name for chain or block or throws if unavailable

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `blockNumber?` | ``null`` \| *string* \| *number* \| *BN* \| *Buffer* | - | up to block if provided, otherwise for the whole chain |
| `opts` | hardforkOptions | {} | Hardfork options (onlyActive unused) |

**Returns:** *string*

Hardfork name

Defined in: [packages/common/src/index.ts:524](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L524)

___

### activeHardforks

▸ **activeHardforks**(`blockNumber?`: ``null`` \| *string* \| *number* \| *BN* \| *Buffer*, `opts?`: hardforkOptions): *any*[]

Returns the active hardfork switches for the current chain

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `blockNumber?` | ``null`` \| *string* \| *number* \| *BN* \| *Buffer* | - | up to block if provided, otherwise for the whole chain |
| `opts` | hardforkOptions | {} | Hardfork options (onlyActive unused) |

**Returns:** *any*[]

Array with hardfork arrays

Defined in: [packages/common/src/index.ts:505](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L505)

___

### activeOnBlock

▸ **activeOnBlock**(`blockNumber`: BNLike, `opts?`: hardforkOptions): *boolean*

Alias to hardforkIsActiveOnBlock when hardfork is set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber` | BNLike |  |
| `opts?` | hardforkOptions | Hardfork options (onlyActive unused) |

**Returns:** *boolean*

True if HF is active on block number

Defined in: [packages/common/src/index.ts:437](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L437)

___

### addListener

▸ **addListener**(`event`: *string* \| *symbol*, `listener`: (...`args`: *any*[]) => *void*): [*default*](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | *string* \| *symbol* |
| `listener` | (...`args`: *any*[]) => *void* |

**Returns:** [*default*](index.default.md)

Inherited from: EventEmitter.addListener

Defined in: node_modules/@types/node/globals.d.ts:595

___

### bootstrapNodes

▸ **bootstrapNodes**(): *any*

Returns bootstrap nodes for the current chain

**Returns:** *any*

Dict with bootstrap nodes

Defined in: [packages/common/src/index.ts:688](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L688)

___

### chainId

▸ **chainId**(): *number*

Returns the Id of current chain

**`deprecated`** Please use chainIdBN() for large number support

**Returns:** *number*

chain Id

Defined in: [packages/common/src/index.ts:713](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L713)

___

### chainIdBN

▸ **chainIdBN**(): *BN*

Returns the Id of current chain

**Returns:** *BN*

chain Id

Defined in: [packages/common/src/index.ts:721](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L721)

___

### chainName

▸ **chainName**(): *string*

Returns the name of current chain

**Returns:** *string*

chain name (lower case)

Defined in: [packages/common/src/index.ts:729](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L729)

___

### consensusAlgorithm

▸ **consensusAlgorithm**(): *string*

Returns the concrete consensus implementation
algorithm or protocol for the network
e.g. "ethash" for "pow" consensus type or
"clique" for "poa" consensus type

**Returns:** *string*

Defined in: [packages/common/src/index.ts:772](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L772)

___

### consensusConfig

▸ **consensusConfig**(): *any*

Returns a dictionary with consensus configuration
parameters based on the consensus algorithm

Expected returns (parameters must be present in
the respective chain json files):

ethash: -
clique: period, epoch
aura: -

**Returns:** *any*

Defined in: [packages/common/src/index.ts:787](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L787)

___

### consensusType

▸ **consensusType**(): *string*

Returns the consensus type of the network
Possible values: "pow"|"poa"

**Returns:** *string*

Defined in: [packages/common/src/index.ts:762](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L762)

___

### copy

▸ **copy**(): [*default*](index.default.md)

Returns a deep copy of this common instance.

**Returns:** [*default*](index.default.md)

Defined in: [packages/common/src/index.ts:794](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L794)

___

### dnsNetworks

▸ **dnsNetworks**(): *any*

Returns DNS networks for the current chain

**Returns:** *any*

Array of DNS ENR urls

Defined in: [packages/common/src/index.ts:696](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L696)

___

### eips

▸ **eips**(): *number*[]

Returns the active EIPs

**Returns:** *number*[]

List of EIPs

Defined in: [packages/common/src/index.ts:754](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L754)

___

### emit

▸ **emit**(`event`: *string* \| *symbol*, ...`args`: *any*[]): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | *string* \| *symbol* |
| `...args` | *any*[] |

**Returns:** *boolean*

Inherited from: EventEmitter.emit

Defined in: node_modules/@types/node/globals.d.ts:605

___

### eventNames

▸ **eventNames**(): (*string* \| *symbol*)[]

**Returns:** (*string* \| *symbol*)[]

Inherited from: EventEmitter.eventNames

Defined in: node_modules/@types/node/globals.d.ts:610

___

### forkHash

▸ **forkHash**(`hardfork?`: *string*): *any*

Returns an eth/64 compliant fork hash (EIP-2124)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | *string* | Hardfork name, optional if HF set |

**Returns:** *any*

Defined in: [packages/common/src/index.ts:643](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L643)

___

### genesis

▸ **genesis**(): *any*

Returns the Genesis parameters of current chain

**Returns:** *any*

Genesis dictionary

Defined in: [packages/common/src/index.ts:672](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L672)

___

### getHardforkByBlockNumber

▸ **getHardforkByBlockNumber**(`blockNumber`: BNLike): *string*

Returns the hardfork based on the block number provided

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | BNLike |

**Returns:** *string*

The name of the HF

Defined in: [packages/common/src/index.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L194)

___

### getMaxListeners

▸ **getMaxListeners**(): *number*

**Returns:** *number*

Inherited from: EventEmitter.getMaxListeners

Defined in: node_modules/@types/node/globals.d.ts:602

___

### gteHardfork

▸ **gteHardfork**(`hardfork`: *string*, `opts?`: hardforkOptions): *boolean*

Alias to hardforkGteHardfork when hardfork is set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | *string* | Hardfork name |
| `opts?` | hardforkOptions | Hardfork options |

**Returns:** *boolean*

True if hardfork set is greater than hardfork provided

Defined in: [packages/common/src/index.ts:480](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L480)

___

### hardfork

▸ **hardfork**(): *string*

Returns the hardfork set

**Returns:** *string*

Hardfork name

Defined in: [packages/common/src/index.ts:704](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L704)

___

### hardforkBlock

▸ **hardforkBlock**(`hardfork?`: *string*): *number*

Returns the hardfork change block for hardfork provided or set

**`deprecated`** Please use hardforkBlockBN() for large number support

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | *string* | Hardfork name, optional if HF set |

**Returns:** *number*

Block number

Defined in: [packages/common/src/index.ts:539](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L539)

___

### hardforkBlockBN

▸ **hardforkBlockBN**(`hardfork?`: *string*): *BN*

Returns the hardfork change block for hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | *string* | Hardfork name, optional if HF set |

**Returns:** *BN*

Block number

Defined in: [packages/common/src/index.ts:548](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L548)

___

### hardforkForForkHash

▸ **hardforkForForkHash**(`forkHash`: *string*): *any*

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `forkHash` | *string* | Fork hash as a hex string |

**Returns:** *any*

Array with hardfork data (name, block, forkHash)

Defined in: [packages/common/src/index.ts:661](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L661)

___

### hardforkGteHardfork

▸ **hardforkGteHardfork**(`hardfork1`: ``null`` \| *string*, `hardfork2`: *string*, `opts?`: hardforkOptions): *boolean*

Sequence based check if given or set HF1 is greater than or equal HF2

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `hardfork1` | ``null`` \| *string* | - | Hardfork name or null (if set) |
| `hardfork2` | *string* | - | Hardfork name |
| `opts` | hardforkOptions | {} | Hardfork options |

**Returns:** *boolean*

True if HF1 gte HF2

Defined in: [packages/common/src/index.ts:448](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L448)

___

### hardforkIsActiveOnBlock

▸ **hardforkIsActiveOnBlock**(`hardfork`: ``null`` \| *string*, `blockNumber`: BNLike, `opts?`: hardforkOptions): *boolean*

Checks if set or provided hardfork is active on block number

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `hardfork` | ``null`` \| *string* | - | Hardfork name or null (for HF set) |
| `blockNumber` | BNLike | - |  |
| `opts` | hardforkOptions | {} | Hardfork options (onlyActive unused) |

**Returns:** *boolean*

True if HF is active on block number

Defined in: [packages/common/src/index.ts:416](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L416)

___

### hardforkIsActiveOnChain

▸ **hardforkIsActiveOnChain**(`hardfork?`: ``null`` \| *string*, `opts?`: hardforkOptions): *boolean*

Checks if given or set hardfork is active on the chain

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `hardfork?` | ``null`` \| *string* | - | Hardfork name, optional if HF set |
| `opts` | hardforkOptions | {} | Hardfork options (onlyActive unused) |

**Returns:** *boolean*

True if hardfork is active on the chain

Defined in: [packages/common/src/index.ts:490](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L490)

___

### hardforks

▸ **hardforks**(): *any*

Returns the hardforks for current chain

**Returns:** *any*

Array with arrays of hardforks

Defined in: [packages/common/src/index.ts:680](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L680)

___

### isActivatedEIP

▸ **isActivatedEIP**(`eip`: *number*): *boolean*

Checks if an EIP is activated by either being included in the EIPs
manually passed in with the `eips` constructor option or in a
hardfork currently being active

Note: this method only works for EIPs being supported
by the `eips` constructor option

#### Parameters

| Name | Type |
| :------ | :------ |
| `eip` | *number* |

**Returns:** *boolean*

Defined in: [packages/common/src/index.ts:394](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L394)

___

### isHardforkBlock

▸ **isHardforkBlock**(`blockNumber`: BNLike, `hardfork?`: *string*): *boolean*

True if block number provided is the hardfork (given or set) change block

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber` | BNLike | Number of the block to check |
| `hardfork?` | *string* | Hardfork name, optional if HF set |

**Returns:** *boolean*

True if blockNumber is HF block

Defined in: [packages/common/src/index.ts:559](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L559)

___

### isNextHardforkBlock

▸ **isNextHardforkBlock**(`blockNumber`: BNLike, `hardfork?`: *string*): *boolean*

True if block number provided is the hardfork change block following the hardfork given or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber` | BNLike | Number of the block to check |
| `hardfork?` | *string* | Hardfork name, optional if HF set |

**Returns:** *boolean*

True if blockNumber is HF block

Defined in: [packages/common/src/index.ts:601](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L601)

___

### listenerCount

▸ **listenerCount**(`type`: *string* \| *symbol*): *number*

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | *string* \| *symbol* |

**Returns:** *number*

Inherited from: EventEmitter.listenerCount

Defined in: node_modules/@types/node/globals.d.ts:606

___

### listeners

▸ **listeners**(`event`: *string* \| *symbol*): Function[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | *string* \| *symbol* |

**Returns:** Function[]

Inherited from: EventEmitter.listeners

Defined in: node_modules/@types/node/globals.d.ts:603

___

### networkId

▸ **networkId**(): *number*

Returns the Id of current network

**`deprecated`** Please use networkIdBN() for large number support

**Returns:** *number*

network Id

Defined in: [packages/common/src/index.ts:738](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L738)

___

### networkIdBN

▸ **networkIdBN**(): *BN*

Returns the Id of current network

**Returns:** *BN*

network Id

Defined in: [packages/common/src/index.ts:746](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L746)

___

### nextHardforkBlock

▸ **nextHardforkBlock**(`hardfork?`: *string*): ``null`` \| *number*

Returns the change block for the next hardfork after the hardfork provided or set

**`deprecated`** Please use nextHardforkBlockBN() for large number support

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | *string* | Hardfork name, optional if HF set |

**Returns:** ``null`` \| *number*

Block number or null if not available

Defined in: [packages/common/src/index.ts:571](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L571)

___

### nextHardforkBlockBN

▸ **nextHardforkBlockBN**(`hardfork?`: *string*): ``null`` \| *BN*

Returns the change block for the next hardfork after the hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | *string* | Hardfork name, optional if HF set |

**Returns:** ``null`` \| *BN*

Block number or null if not available

Defined in: [packages/common/src/index.ts:581](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L581)

___

### off

▸ **off**(`event`: *string* \| *symbol*, `listener`: (...`args`: *any*[]) => *void*): [*default*](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | *string* \| *symbol* |
| `listener` | (...`args`: *any*[]) => *void* |

**Returns:** [*default*](index.default.md)

Inherited from: EventEmitter.off

Defined in: node_modules/@types/node/globals.d.ts:599

___

### on

▸ **on**(`event`: *string* \| *symbol*, `listener`: (...`args`: *any*[]) => *void*): [*default*](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | *string* \| *symbol* |
| `listener` | (...`args`: *any*[]) => *void* |

**Returns:** [*default*](index.default.md)

Inherited from: EventEmitter.on

Defined in: node_modules/@types/node/globals.d.ts:596

___

### once

▸ **once**(`event`: *string* \| *symbol*, `listener`: (...`args`: *any*[]) => *void*): [*default*](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | *string* \| *symbol* |
| `listener` | (...`args`: *any*[]) => *void* |

**Returns:** [*default*](index.default.md)

Inherited from: EventEmitter.once

Defined in: node_modules/@types/node/globals.d.ts:597

___

### param

▸ **param**(`topic`: *string*, `name`: *string*): *any*

Returns a parameter for the current chain setup

If the parameter is present in an EIP, the EIP always takes precendence.
Otherwise the parameter if taken from the latest applied HF with
a change on the respective parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | *string* | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
| `name` | *string* | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |

**Returns:** *any*

The value requested or `null` if not found

Defined in: [packages/common/src/index.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L304)

___

### paramByBlock

▸ **paramByBlock**(`topic`: *string*, `name`: *string*, `blockNumber`: BNLike): *any*

Returns a parameter for the hardfork active on block number

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | *string* | Parameter topic |
| `name` | *string* | Parameter name |
| `blockNumber` | BNLike | Block number |

**Returns:** *any*

Defined in: [packages/common/src/index.ts:379](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L379)

___

### paramByEIP

▸ **paramByEIP**(`topic`: *string*, `name`: *string*, `eip`: *number*): *any*

Returns a parameter corresponding to an EIP

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | *string* | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
| `name` | *string* | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |
| `eip` | *number* | Number of the EIP |

**Returns:** *any*

The value requested or `null` if not found

Defined in: [packages/common/src/index.ts:357](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L357)

___

### paramByHardfork

▸ **paramByHardfork**(`topic`: *string*, `name`: *string*, `hardfork`: *string*): *any*

Returns the parameter corresponding to a hardfork

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | *string* | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
| `name` | *string* | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |
| `hardfork` | *string* | Hardfork name |

**Returns:** *any*

The value requested or `null` if not found

Defined in: [packages/common/src/index.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L324)

___

### prependListener

▸ **prependListener**(`event`: *string* \| *symbol*, `listener`: (...`args`: *any*[]) => *void*): [*default*](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | *string* \| *symbol* |
| `listener` | (...`args`: *any*[]) => *void* |

**Returns:** [*default*](index.default.md)

Inherited from: EventEmitter.prependListener

Defined in: node_modules/@types/node/globals.d.ts:608

___

### prependOnceListener

▸ **prependOnceListener**(`event`: *string* \| *symbol*, `listener`: (...`args`: *any*[]) => *void*): [*default*](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | *string* \| *symbol* |
| `listener` | (...`args`: *any*[]) => *void* |

**Returns:** [*default*](index.default.md)

Inherited from: EventEmitter.prependOnceListener

Defined in: node_modules/@types/node/globals.d.ts:609

___

### rawListeners

▸ **rawListeners**(`event`: *string* \| *symbol*): Function[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | *string* \| *symbol* |

**Returns:** Function[]

Inherited from: EventEmitter.rawListeners

Defined in: node_modules/@types/node/globals.d.ts:604

___

### removeAllListeners

▸ **removeAllListeners**(`event?`: *string* \| *symbol*): [*default*](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | *string* \| *symbol* |

**Returns:** [*default*](index.default.md)

Inherited from: EventEmitter.removeAllListeners

Defined in: node_modules/@types/node/globals.d.ts:600

___

### removeListener

▸ **removeListener**(`event`: *string* \| *symbol*, `listener`: (...`args`: *any*[]) => *void*): [*default*](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | *string* \| *symbol* |
| `listener` | (...`args`: *any*[]) => *void* |

**Returns:** [*default*](index.default.md)

Inherited from: EventEmitter.removeListener

Defined in: node_modules/@types/node/globals.d.ts:598

___

### setChain

▸ **setChain**(`chain`: *string* \| *number* \| *object* \| *BN*): *any*

Sets the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | *string* \| *number* \| *object* \| *BN* | String ('mainnet') or Number (1) chain     representation. Or, a Dictionary of chain parameters for a private network. |

**Returns:** *any*

The dictionary with parameters set as chain

Defined in: [packages/common/src/index.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L144)

___

### setEIPs

▸ **setEIPs**(`eips?`: *number*[]): *void*

Sets the active EIPs

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `eips` | *number*[] | [] |

**Returns:** *void*

Defined in: [packages/common/src/index.ts:270](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L270)

___

### setHardfork

▸ **setHardfork**(`hardfork`: *string*): *void*

Sets the hardfork to get params for

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | *string* | String identifier (e.g. 'byzantium') |

**Returns:** *void*

Defined in: [packages/common/src/index.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L170)

___

### setHardforkByBlockNumber

▸ **setHardforkByBlockNumber**(`blockNumber`: BNLike): *string*

Sets a new hardfork based on the block number provided

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | BNLike |

**Returns:** *string*

The name of the HF set

Defined in: [packages/common/src/index.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L216)

___

### setMaxListeners

▸ **setMaxListeners**(`n`: *number*): [*default*](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | *number* |

**Returns:** [*default*](index.default.md)

Inherited from: EventEmitter.setMaxListeners

Defined in: node_modules/@types/node/globals.d.ts:601

___

### forCustomChain

▸ `Static` **forCustomChain**(`baseChain`: *string* \| *number*, `customChainParams`: *Partial*<[*Chain*](../interfaces/types.chain.md)\>, `hardfork?`: *string*, `supportedHardforks?`: *string*[]): [*default*](index.default.md)

Creates a Common object for a custom chain, based on a standard one. It uses all the [Chain](../interfaces/types.chain.md)
params from [[baseChain]] except the ones overridden in [[customChainParams]].

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseChain` | *string* \| *number* | The name (`mainnet`) or id (`1`) of a standard chain used to base the custom chain params on. |
| `customChainParams` | *Partial*<[*Chain*](../interfaces/types.chain.md)\> | The custom parameters of the chain. |
| `hardfork?` | *string* | String identifier ('byzantium') for hardfork (optional) |
| `supportedHardforks?` | *string*[] | Limit parameter returns to the given hardforks (optional) |

**Returns:** [*default*](index.default.md)

Defined in: [packages/common/src/index.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L80)

___

### listenerCount

▸ `Static` **listenerCount**(`emitter`: *EventEmitter*, `event`: *string* \| *symbol*): *number*

**`deprecated`** since v4.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | *EventEmitter* |
| `event` | *string* \| *symbol* |

**Returns:** *number*

Inherited from: EventEmitter.listenerCount

Defined in: node_modules/@types/node/events.d.ts:17

___

### once

▸ `Static` **once**(`emitter`: *NodeEventTarget*, `event`: *string* \| *symbol*): *Promise*<any[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | *NodeEventTarget* |
| `event` | *string* \| *symbol* |

**Returns:** *Promise*<any[]\>

Inherited from: EventEmitter.once

Defined in: node_modules/@types/node/events.d.ts:13

▸ `Static` **once**(`emitter`: DOMEventTarget, `event`: *string*): *Promise*<any[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | DOMEventTarget |
| `event` | *string* |

**Returns:** *Promise*<any[]\>

Inherited from: EventEmitter.once

Defined in: node_modules/@types/node/events.d.ts:14
