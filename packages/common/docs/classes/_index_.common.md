[@ethereumjs/common](../README.md) › ["index"](../modules/_index_.md) › [Common](_index_.common.md)

# Class: Common

Common class to access chain and hardfork parameters

## Hierarchy

* EventEmitter

  ↳ **Common**

## Index

### References

* [EventEmitter](_index_.common.md#eventemitter)

### Constructors

* [constructor](_index_.common.md#constructor)

### Properties

* [DEFAULT_HARDFORK](_index_.common.md#default_hardfork)
* [defaultMaxListeners](_index_.common.md#static-defaultmaxlisteners)

### Methods

* [_calcForkHash](_index_.common.md#_calcforkhash)
* [_chooseHardfork](_index_.common.md#_choosehardfork)
* [_getHardfork](_index_.common.md#_gethardfork)
* [_isSupportedHardfork](_index_.common.md#_issupportedhardfork)
* [activeHardfork](_index_.common.md#activehardfork)
* [activeHardforks](_index_.common.md#activehardforks)
* [activeOnBlock](_index_.common.md#activeonblock)
* [addListener](_index_.common.md#addlistener)
* [bootstrapNodes](_index_.common.md#bootstrapnodes)
* [chainId](_index_.common.md#chainid)
* [chainIdBN](_index_.common.md#chainidbn)
* [chainName](_index_.common.md#chainname)
* [consensusAlgorithm](_index_.common.md#consensusalgorithm)
* [consensusConfig](_index_.common.md#consensusconfig)
* [consensusType](_index_.common.md#consensustype)
* [copy](_index_.common.md#copy)
* [dnsNetworks](_index_.common.md#dnsnetworks)
* [eips](_index_.common.md#eips)
* [emit](_index_.common.md#emit)
* [eventNames](_index_.common.md#eventnames)
* [forkHash](_index_.common.md#forkhash)
* [genesis](_index_.common.md#genesis)
* [getHardforkByBlockNumber](_index_.common.md#gethardforkbyblocknumber)
* [getMaxListeners](_index_.common.md#getmaxlisteners)
* [gteHardfork](_index_.common.md#gtehardfork)
* [hardfork](_index_.common.md#hardfork)
* [hardforkBlock](_index_.common.md#hardforkblock)
* [hardforkBlockBN](_index_.common.md#hardforkblockbn)
* [hardforkForForkHash](_index_.common.md#hardforkforforkhash)
* [hardforkGteHardfork](_index_.common.md#hardforkgtehardfork)
* [hardforkIsActiveOnBlock](_index_.common.md#hardforkisactiveonblock)
* [hardforkIsActiveOnChain](_index_.common.md#hardforkisactiveonchain)
* [hardforks](_index_.common.md#hardforks)
* [isActivatedEIP](_index_.common.md#isactivatedeip)
* [isHardforkBlock](_index_.common.md#ishardforkblock)
* [isNextHardforkBlock](_index_.common.md#isnexthardforkblock)
* [listenerCount](_index_.common.md#listenercount)
* [listeners](_index_.common.md#listeners)
* [networkId](_index_.common.md#networkid)
* [networkIdBN](_index_.common.md#networkidbn)
* [nextHardforkBlock](_index_.common.md#nexthardforkblock)
* [nextHardforkBlockBN](_index_.common.md#nexthardforkblockbn)
* [off](_index_.common.md#off)
* [on](_index_.common.md#on)
* [once](_index_.common.md#once)
* [param](_index_.common.md#param)
* [paramByBlock](_index_.common.md#parambyblock)
* [paramByEIP](_index_.common.md#parambyeip)
* [paramByHardfork](_index_.common.md#parambyhardfork)
* [prependListener](_index_.common.md#prependlistener)
* [prependOnceListener](_index_.common.md#prependoncelistener)
* [rawListeners](_index_.common.md#rawlisteners)
* [removeAllListeners](_index_.common.md#removealllisteners)
* [removeListener](_index_.common.md#removelistener)
* [setChain](_index_.common.md#setchain)
* [setEIPs](_index_.common.md#seteips)
* [setHardfork](_index_.common.md#sethardfork)
* [setHardforkByBlockNumber](_index_.common.md#sethardforkbyblocknumber)
* [setMaxListeners](_index_.common.md#setmaxlisteners)
* [forCustomChain](_index_.common.md#static-forcustomchain)
* [listenerCount](_index_.common.md#static-listenercount)
* [once](_index_.common.md#static-once)

## References

###  EventEmitter

• **EventEmitter**:

## Constructors

###  constructor

\+ **new Common**(`opts`: [CommonOpts](../interfaces/_index_.commonopts.md)): *[Common](_index_.common.md)*

*Overrides void*

*Defined in [packages/common/src/index.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L116)*

**`constructor`** 

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [CommonOpts](../interfaces/_index_.commonopts.md) |

**Returns:** *[Common](_index_.common.md)*

## Properties

###  DEFAULT_HARDFORK

• **DEFAULT_HARDFORK**: *string*

*Defined in [packages/common/src/index.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L62)*

___

### `Static` defaultMaxListeners

▪ **defaultMaxListeners**: *number*

*Inherited from [Common](_index_.common.md).[defaultMaxListeners](_index_.common.md#static-defaultmaxlisteners)*

Defined in node_modules/@types/node/events.d.ts:20

## Methods

###  _calcForkHash

▸ **_calcForkHash**(`hardfork`: string): *string*

*Defined in [packages/common/src/index.ts:613](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L613)*

Internal helper function to calculate a fork hash

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork` | string | Hardfork name |

**Returns:** *string*

Fork hash as hex string

___

###  _chooseHardfork

▸ **_chooseHardfork**(`hardfork?`: string | null, `onlySupported`: boolean): *string*

*Defined in [packages/common/src/index.ts:228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L228)*

Internal helper function to choose between hardfork set and hardfork provided as param

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`hardfork?` | string &#124; null | - | Hardfork given to function as a parameter |
`onlySupported` | boolean | true | - |

**Returns:** *string*

Hardfork chosen to be used

___

###  _getHardfork

▸ **_getHardfork**(`hardfork`: string): *any*

*Defined in [packages/common/src/index.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L242)*

Internal helper function, returns the params for the given hardfork for the chain set

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork` | string | Hardfork name |

**Returns:** *any*

Dictionary with hardfork params

___

###  _isSupportedHardfork

▸ **_isSupportedHardfork**(`hardfork`: string | null): *boolean*

*Defined in [packages/common/src/index.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L255)*

Internal helper function to check if a hardfork is set to be supported by the library

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork` | string &#124; null | Hardfork name |

**Returns:** *boolean*

True if hardfork is supported

___

###  activeHardfork

▸ **activeHardfork**(`blockNumber?`: BNLike | null, `opts`: hardforkOptions): *string*

*Defined in [packages/common/src/index.ts:524](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L524)*

Returns the latest active hardfork name for chain or block or throws if unavailable

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`blockNumber?` | BNLike &#124; null | - | up to block if provided, otherwise for the whole chain |
`opts` | hardforkOptions | {} | Hardfork options (onlyActive unused) |

**Returns:** *string*

Hardfork name

___

###  activeHardforks

▸ **activeHardforks**(`blockNumber?`: BNLike | null, `opts`: hardforkOptions): *Array‹any›*

*Defined in [packages/common/src/index.ts:505](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L505)*

Returns the active hardfork switches for the current chain

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`blockNumber?` | BNLike &#124; null | - | up to block if provided, otherwise for the whole chain |
`opts` | hardforkOptions | {} | Hardfork options (onlyActive unused) |

**Returns:** *Array‹any›*

Array with hardfork arrays

___

###  activeOnBlock

▸ **activeOnBlock**(`blockNumber`: BNLike, `opts?`: hardforkOptions): *boolean*

*Defined in [packages/common/src/index.ts:437](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L437)*

Alias to hardforkIsActiveOnBlock when hardfork is set

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockNumber` | BNLike | - |
`opts?` | hardforkOptions | Hardfork options (onlyActive unused) |

**Returns:** *boolean*

True if HF is active on block number

___

###  addListener

▸ **addListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Common](_index_.common.md).[addListener](_index_.common.md#addlistener)*

Defined in node_modules/@types/node/globals.d.ts:595

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  bootstrapNodes

▸ **bootstrapNodes**(): *any*

*Defined in [packages/common/src/index.ts:688](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L688)*

Returns bootstrap nodes for the current chain

**Returns:** *any*

Dict with bootstrap nodes

___

###  chainId

▸ **chainId**(): *number*

*Defined in [packages/common/src/index.ts:713](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L713)*

Returns the Id of current chain

**`deprecated`** Please use chainIdBN() for large number support

**Returns:** *number*

chain Id

___

###  chainIdBN

▸ **chainIdBN**(): *BN*

*Defined in [packages/common/src/index.ts:721](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L721)*

Returns the Id of current chain

**Returns:** *BN*

chain Id

___

###  chainName

▸ **chainName**(): *string*

*Defined in [packages/common/src/index.ts:729](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L729)*

Returns the name of current chain

**Returns:** *string*

chain name (lower case)

___

###  consensusAlgorithm

▸ **consensusAlgorithm**(): *string*

*Defined in [packages/common/src/index.ts:772](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L772)*

Returns the concrete consensus implementation
algorithm or protocol for the network
e.g. "ethash" for "pow" consensus type or
"clique" for "poa" consensus type

**Returns:** *string*

___

###  consensusConfig

▸ **consensusConfig**(): *any*

*Defined in [packages/common/src/index.ts:787](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L787)*

Returns a dictionary with consensus configuration
parameters based on the consensus algorithm

Expected returns (parameters must be present in
the respective chain json files):

ethash: -
clique: period, epoch
aura: -

**Returns:** *any*

___

###  consensusType

▸ **consensusType**(): *string*

*Defined in [packages/common/src/index.ts:762](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L762)*

Returns the consensus type of the network
Possible values: "pow"|"poa"

**Returns:** *string*

___

###  copy

▸ **copy**(): *[Common](_index_.common.md)*

*Defined in [packages/common/src/index.ts:794](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L794)*

Returns a deep copy of this common instance.

**Returns:** *[Common](_index_.common.md)*

___

###  dnsNetworks

▸ **dnsNetworks**(): *any*

*Defined in [packages/common/src/index.ts:696](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L696)*

Returns DNS networks for the current chain

**Returns:** *any*

Array of DNS ENR urls

___

###  eips

▸ **eips**(): *number[]*

*Defined in [packages/common/src/index.ts:754](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L754)*

Returns the active EIPs

**Returns:** *number[]*

List of EIPs

___

###  emit

▸ **emit**(`event`: string | symbol, ...`args`: any[]): *boolean*

*Inherited from [Common](_index_.common.md).[emit](_index_.common.md#emit)*

Defined in node_modules/@types/node/globals.d.ts:605

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |
`...args` | any[] |

**Returns:** *boolean*

___

###  eventNames

▸ **eventNames**(): *Array‹string | symbol›*

*Inherited from [Common](_index_.common.md).[eventNames](_index_.common.md#eventnames)*

Defined in node_modules/@types/node/globals.d.ts:610

**Returns:** *Array‹string | symbol›*

___

###  forkHash

▸ **forkHash**(`hardfork?`: undefined | string): *any*

*Defined in [packages/common/src/index.ts:643](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L643)*

Returns an eth/64 compliant fork hash (EIP-2124)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork?` | undefined &#124; string | Hardfork name, optional if HF set  |

**Returns:** *any*

___

###  genesis

▸ **genesis**(): *any*

*Defined in [packages/common/src/index.ts:672](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L672)*

Returns the Genesis parameters of current chain

**Returns:** *any*

Genesis dictionary

___

###  getHardforkByBlockNumber

▸ **getHardforkByBlockNumber**(`blockNumber`: BNLike): *string*

*Defined in [packages/common/src/index.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L194)*

Returns the hardfork based on the block number provided

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | BNLike |

**Returns:** *string*

The name of the HF

___

###  getMaxListeners

▸ **getMaxListeners**(): *number*

*Inherited from [Common](_index_.common.md).[getMaxListeners](_index_.common.md#getmaxlisteners)*

Defined in node_modules/@types/node/globals.d.ts:602

**Returns:** *number*

___

###  gteHardfork

▸ **gteHardfork**(`hardfork`: string, `opts?`: hardforkOptions): *boolean*

*Defined in [packages/common/src/index.ts:480](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L480)*

Alias to hardforkGteHardfork when hardfork is set

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork` | string | Hardfork name |
`opts?` | hardforkOptions | Hardfork options |

**Returns:** *boolean*

True if hardfork set is greater than hardfork provided

___

###  hardfork

▸ **hardfork**(): *string*

*Defined in [packages/common/src/index.ts:704](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L704)*

Returns the hardfork set

**Returns:** *string*

Hardfork name

___

###  hardforkBlock

▸ **hardforkBlock**(`hardfork?`: undefined | string): *number*

*Defined in [packages/common/src/index.ts:539](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L539)*

Returns the hardfork change block for hardfork provided or set

**`deprecated`** Please use hardforkBlockBN() for large number support

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork?` | undefined &#124; string | Hardfork name, optional if HF set |

**Returns:** *number*

Block number

___

###  hardforkBlockBN

▸ **hardforkBlockBN**(`hardfork?`: undefined | string): *BN*

*Defined in [packages/common/src/index.ts:548](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L548)*

Returns the hardfork change block for hardfork provided or set

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork?` | undefined &#124; string | Hardfork name, optional if HF set |

**Returns:** *BN*

Block number

___

###  hardforkForForkHash

▸ **hardforkForForkHash**(`forkHash`: string): *any | null*

*Defined in [packages/common/src/index.ts:661](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L661)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`forkHash` | string | Fork hash as a hex string |

**Returns:** *any | null*

Array with hardfork data (name, block, forkHash)

___

###  hardforkGteHardfork

▸ **hardforkGteHardfork**(`hardfork1`: string | null, `hardfork2`: string, `opts`: hardforkOptions): *boolean*

*Defined in [packages/common/src/index.ts:448](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L448)*

Sequence based check if given or set HF1 is greater than or equal HF2

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`hardfork1` | string &#124; null | - | Hardfork name or null (if set) |
`hardfork2` | string | - | Hardfork name |
`opts` | hardforkOptions | {} | Hardfork options |

**Returns:** *boolean*

True if HF1 gte HF2

___

###  hardforkIsActiveOnBlock

▸ **hardforkIsActiveOnBlock**(`hardfork`: string | null, `blockNumber`: BNLike, `opts`: hardforkOptions): *boolean*

*Defined in [packages/common/src/index.ts:416](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L416)*

Checks if set or provided hardfork is active on block number

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`hardfork` | string &#124; null | - | Hardfork name or null (for HF set) |
`blockNumber` | BNLike | - | - |
`opts` | hardforkOptions | {} | Hardfork options (onlyActive unused) |

**Returns:** *boolean*

True if HF is active on block number

___

###  hardforkIsActiveOnChain

▸ **hardforkIsActiveOnChain**(`hardfork?`: string | null, `opts`: hardforkOptions): *boolean*

*Defined in [packages/common/src/index.ts:490](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L490)*

Checks if given or set hardfork is active on the chain

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`hardfork?` | string &#124; null | - | Hardfork name, optional if HF set |
`opts` | hardforkOptions | {} | Hardfork options (onlyActive unused) |

**Returns:** *boolean*

True if hardfork is active on the chain

___

###  hardforks

▸ **hardforks**(): *any*

*Defined in [packages/common/src/index.ts:680](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L680)*

Returns the hardforks for current chain

**Returns:** *any*

Array with arrays of hardforks

___

###  isActivatedEIP

▸ **isActivatedEIP**(`eip`: number): *boolean*

*Defined in [packages/common/src/index.ts:394](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L394)*

Checks if an EIP is activated by either being included in the EIPs
manually passed in with the `eips` constructor option or in a
hardfork currently being active

Note: this method only works for EIPs being supported
by the `eips` constructor option

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`eip` | number |   |

**Returns:** *boolean*

___

###  isHardforkBlock

▸ **isHardforkBlock**(`blockNumber`: BNLike, `hardfork?`: undefined | string): *boolean*

*Defined in [packages/common/src/index.ts:559](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L559)*

True if block number provided is the hardfork (given or set) change block

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockNumber` | BNLike | Number of the block to check |
`hardfork?` | undefined &#124; string | Hardfork name, optional if HF set |

**Returns:** *boolean*

True if blockNumber is HF block

___

###  isNextHardforkBlock

▸ **isNextHardforkBlock**(`blockNumber`: BNLike, `hardfork?`: undefined | string): *boolean*

*Defined in [packages/common/src/index.ts:601](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L601)*

True if block number provided is the hardfork change block following the hardfork given or set

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockNumber` | BNLike | Number of the block to check |
`hardfork?` | undefined &#124; string | Hardfork name, optional if HF set |

**Returns:** *boolean*

True if blockNumber is HF block

___

###  listenerCount

▸ **listenerCount**(`type`: string | symbol): *number*

*Inherited from [Common](_index_.common.md).[listenerCount](_index_.common.md#listenercount)*

Defined in node_modules/@types/node/globals.d.ts:606

**Parameters:**

Name | Type |
------ | ------ |
`type` | string &#124; symbol |

**Returns:** *number*

___

###  listeners

▸ **listeners**(`event`: string | symbol): *Function[]*

*Inherited from [Common](_index_.common.md).[listeners](_index_.common.md#listeners)*

Defined in node_modules/@types/node/globals.d.ts:603

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  networkId

▸ **networkId**(): *number*

*Defined in [packages/common/src/index.ts:738](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L738)*

Returns the Id of current network

**`deprecated`** Please use networkIdBN() for large number support

**Returns:** *number*

network Id

___

###  networkIdBN

▸ **networkIdBN**(): *BN*

*Defined in [packages/common/src/index.ts:746](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L746)*

Returns the Id of current network

**Returns:** *BN*

network Id

___

###  nextHardforkBlock

▸ **nextHardforkBlock**(`hardfork?`: undefined | string): *number | null*

*Defined in [packages/common/src/index.ts:571](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L571)*

Returns the change block for the next hardfork after the hardfork provided or set

**`deprecated`** Please use nextHardforkBlockBN() for large number support

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork?` | undefined &#124; string | Hardfork name, optional if HF set |

**Returns:** *number | null*

Block number or null if not available

___

###  nextHardforkBlockBN

▸ **nextHardforkBlockBN**(`hardfork?`: undefined | string): *BN | null*

*Defined in [packages/common/src/index.ts:581](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L581)*

Returns the change block for the next hardfork after the hardfork provided or set

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork?` | undefined &#124; string | Hardfork name, optional if HF set |

**Returns:** *BN | null*

Block number or null if not available

___

###  off

▸ **off**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Common](_index_.common.md).[off](_index_.common.md#off)*

Defined in node_modules/@types/node/globals.d.ts:599

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  on

▸ **on**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Common](_index_.common.md).[on](_index_.common.md#on)*

Defined in node_modules/@types/node/globals.d.ts:596

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  once

▸ **once**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Common](_index_.common.md).[once](_index_.common.md#once)*

Defined in node_modules/@types/node/globals.d.ts:597

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  param

▸ **param**(`topic`: string, `name`: string): *any*

*Defined in [packages/common/src/index.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L304)*

Returns a parameter for the current chain setup

If the parameter is present in an EIP, the EIP always takes precendence.
Otherwise the parameter if taken from the latest applied HF with
a change on the respective parameter.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`topic` | string | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
`name` | string | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |

**Returns:** *any*

The value requested or `null` if not found

___

###  paramByBlock

▸ **paramByBlock**(`topic`: string, `name`: string, `blockNumber`: BNLike): *any*

*Defined in [packages/common/src/index.ts:379](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L379)*

Returns a parameter for the hardfork active on block number

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`topic` | string | Parameter topic |
`name` | string | Parameter name |
`blockNumber` | BNLike | Block number  |

**Returns:** *any*

___

###  paramByEIP

▸ **paramByEIP**(`topic`: string, `name`: string, `eip`: number): *any*

*Defined in [packages/common/src/index.ts:357](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L357)*

Returns a parameter corresponding to an EIP

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`topic` | string | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
`name` | string | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |
`eip` | number | Number of the EIP |

**Returns:** *any*

The value requested or `null` if not found

___

###  paramByHardfork

▸ **paramByHardfork**(`topic`: string, `name`: string, `hardfork`: string): *any*

*Defined in [packages/common/src/index.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L324)*

Returns the parameter corresponding to a hardfork

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`topic` | string | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
`name` | string | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |
`hardfork` | string | Hardfork name |

**Returns:** *any*

The value requested or `null` if not found

___

###  prependListener

▸ **prependListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Common](_index_.common.md).[prependListener](_index_.common.md#prependlistener)*

Defined in node_modules/@types/node/globals.d.ts:608

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  prependOnceListener

▸ **prependOnceListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Common](_index_.common.md).[prependOnceListener](_index_.common.md#prependoncelistener)*

Defined in node_modules/@types/node/globals.d.ts:609

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  rawListeners

▸ **rawListeners**(`event`: string | symbol): *Function[]*

*Inherited from [Common](_index_.common.md).[rawListeners](_index_.common.md#rawlisteners)*

Defined in node_modules/@types/node/globals.d.ts:604

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): *this*

*Inherited from [Common](_index_.common.md).[removeAllListeners](_index_.common.md#removealllisteners)*

Defined in node_modules/@types/node/globals.d.ts:600

**Parameters:**

Name | Type |
------ | ------ |
`event?` | string &#124; symbol |

**Returns:** *this*

___

###  removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Common](_index_.common.md).[removeListener](_index_.common.md#removelistener)*

Defined in node_modules/@types/node/globals.d.ts:598

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  setChain

▸ **setChain**(`chain`: string | number | BN | object): *any*

*Defined in [packages/common/src/index.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L144)*

Sets the chain

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`chain` | string &#124; number &#124; BN &#124; object | String ('mainnet') or Number (1) chain     representation. Or, a Dictionary of chain parameters for a private network. |

**Returns:** *any*

The dictionary with parameters set as chain

___

###  setEIPs

▸ **setEIPs**(`eips`: number[]): *void*

*Defined in [packages/common/src/index.ts:270](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L270)*

Sets the active EIPs

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`eips` | number[] | [] |   |

**Returns:** *void*

___

###  setHardfork

▸ **setHardfork**(`hardfork`: string): *void*

*Defined in [packages/common/src/index.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L170)*

Sets the hardfork to get params for

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork` | string | String identifier (e.g. 'byzantium')  |

**Returns:** *void*

___

###  setHardforkByBlockNumber

▸ **setHardforkByBlockNumber**(`blockNumber`: BNLike): *string*

*Defined in [packages/common/src/index.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L216)*

Sets a new hardfork based on the block number provided

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | BNLike |

**Returns:** *string*

The name of the HF set

___

###  setMaxListeners

▸ **setMaxListeners**(`n`: number): *this*

*Inherited from [Common](_index_.common.md).[setMaxListeners](_index_.common.md#setmaxlisteners)*

Defined in node_modules/@types/node/globals.d.ts:601

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *this*

___

### `Static` forCustomChain

▸ **forCustomChain**(`baseChain`: string | number, `customChainParams`: Partial‹[Chain](../interfaces/_types_.chain.md)›, `hardfork?`: undefined | string, `supportedHardforks?`: Array‹string›): *[Common](_index_.common.md)*

*Defined in [packages/common/src/index.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L80)*

Creates a Common object for a custom chain, based on a standard one. It uses all the [Chain](../interfaces/_types_.chain.md)
params from [[baseChain]] except the ones overridden in [[customChainParams]].

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`baseChain` | string &#124; number | The name (`mainnet`) or id (`1`) of a standard chain used to base the custom chain params on. |
`customChainParams` | Partial‹[Chain](../interfaces/_types_.chain.md)› | The custom parameters of the chain. |
`hardfork?` | undefined &#124; string | String identifier ('byzantium') for hardfork (optional) |
`supportedHardforks?` | Array‹string› | Limit parameter returns to the given hardforks (optional)  |

**Returns:** *[Common](_index_.common.md)*

___

### `Static` listenerCount

▸ **listenerCount**(`emitter`: EventEmitter, `event`: string | symbol): *number*

*Inherited from [Common](_index_.common.md).[listenerCount](_index_.common.md#static-listenercount)*

Defined in node_modules/@types/node/events.d.ts:17

**`deprecated`** since v4.0.0

**Parameters:**

Name | Type |
------ | ------ |
`emitter` | EventEmitter |
`event` | string &#124; symbol |

**Returns:** *number*

___

### `Static` once

▸ **once**(`emitter`: NodeEventTarget, `event`: string | symbol): *Promise‹any[]›*

*Inherited from [Common](_index_.common.md).[once](_index_.common.md#static-once)*

Defined in node_modules/@types/node/events.d.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`emitter` | NodeEventTarget |
`event` | string &#124; symbol |

**Returns:** *Promise‹any[]›*

▸ **once**(`emitter`: DOMEventTarget, `event`: string): *Promise‹any[]›*

*Inherited from [Common](_index_.common.md).[once](_index_.common.md#static-once)*

Defined in node_modules/@types/node/events.d.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`emitter` | DOMEventTarget |
`event` | string |

**Returns:** *Promise‹any[]›*
