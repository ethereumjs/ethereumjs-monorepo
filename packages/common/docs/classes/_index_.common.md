[ethereumjs-common](../README.md) › ["index"](../modules/_index_.md) › [Common](_index_.common.md)

# Class: Common

Common class to access chain and hardfork parameters

## Hierarchy

* **Common**

## Index

### Constructors

* [constructor](_index_.common.md#constructor)

### Methods

* [_chooseHardfork](_index_.common.md#_choosehardfork)
* [_getHardfork](_index_.common.md#_gethardfork)
* [_isSupportedHardfork](_index_.common.md#_issupportedhardfork)
* [activeHardfork](_index_.common.md#activehardfork)
* [activeHardforks](_index_.common.md#activehardforks)
* [activeOnBlock](_index_.common.md#activeonblock)
* [bootstrapNodes](_index_.common.md#bootstrapnodes)
* [chainId](_index_.common.md#chainid)
* [chainName](_index_.common.md#chainname)
* [genesis](_index_.common.md#genesis)
* [gteHardfork](_index_.common.md#gtehardfork)
* [hardfork](_index_.common.md#hardfork)
* [hardforkBlock](_index_.common.md#hardforkblock)
* [hardforkGteHardfork](_index_.common.md#hardforkgtehardfork)
* [hardforkIsActiveOnBlock](_index_.common.md#hardforkisactiveonblock)
* [hardforkIsActiveOnChain](_index_.common.md#hardforkisactiveonchain)
* [hardforks](_index_.common.md#hardforks)
* [isHardforkBlock](_index_.common.md#ishardforkblock)
* [networkId](_index_.common.md#networkid)
* [param](_index_.common.md#param)
* [paramByBlock](_index_.common.md#parambyblock)
* [setChain](_index_.common.md#setchain)
* [setHardfork](_index_.common.md#sethardfork)
* [forCustomChain](_index_.common.md#static-forcustomchain)

## Constructors

###  constructor

\+ **new Common**(`chain`: string | number | object, `hardfork?`: string | null, `supportedHardforks?`: Array‹string›): *[Common](_index_.common.md)*

*Defined in [index.ts:62](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L62)*

**`constructor`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`chain` | string &#124; number &#124; object | String ('mainnet') or Number (1) chain |
`hardfork?` | string &#124; null | String identifier ('byzantium') for hardfork (optional) |
`supportedHardforks?` | Array‹string› | Limit parameter returns to the given hardforks (optional)  |

**Returns:** *[Common](_index_.common.md)*

## Methods

###  _chooseHardfork

▸ **_chooseHardfork**(`hardfork?`: string | null, `onlySupported?`: undefined | false | true): *string*

*Defined in [index.ts:131](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L131)*

Internal helper function to choose between hardfork set and hardfork provided as param

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork?` | string &#124; null | Hardfork given to function as a parameter |
`onlySupported?` | undefined &#124; false &#124; true | - |

**Returns:** *string*

Hardfork chosen to be used

___

###  _getHardfork

▸ **_getHardfork**(`hardfork`: string): *any*

*Defined in [index.ts:150](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L150)*

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

*Defined in [index.ts:163](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L163)*

Internal helper function to check if a hardfork is set to be supported by the library

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork` | string &#124; null | Hardfork name |

**Returns:** *boolean*

True if hardfork is supported

___

###  activeHardfork

▸ **activeHardfork**(`blockNumber?`: number | null, `opts?`: hardforkOptions): *string*

*Defined in [index.ts:327](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L327)*

Returns the latest active hardfork name for chain or block or throws if unavailable

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockNumber?` | number &#124; null | up to block if provided, otherwise for the whole chain |
`opts?` | hardforkOptions | Hardfork options (onlyActive unused) |

**Returns:** *string*

Hardfork name

___

###  activeHardforks

▸ **activeHardforks**(`blockNumber?`: number | null, `opts?`: hardforkOptions): *Array‹any›*

*Defined in [index.ts:307](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L307)*

Returns the active hardfork switches for the current chain

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockNumber?` | number &#124; null | up to block if provided, otherwise for the whole chain |
`opts?` | hardforkOptions | Hardfork options (onlyActive unused) |

**Returns:** *Array‹any›*

Array with hardfork arrays

___

###  activeOnBlock

▸ **activeOnBlock**(`blockNumber`: number, `opts?`: hardforkOptions): *boolean*

*Defined in [index.ts:237](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L237)*

Alias to hardforkIsActiveOnBlock when hardfork is set

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockNumber` | number | - |
`opts?` | hardforkOptions | Hardfork options (onlyActive unused) |

**Returns:** *boolean*

True if HF is active on block number

___

###  bootstrapNodes

▸ **bootstrapNodes**(): *any*

*Defined in [index.ts:382](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L382)*

Returns bootstrap nodes for the current chain

**Returns:** *any*

Dict with bootstrap nodes

___

###  chainId

▸ **chainId**(): *number*

*Defined in [index.ts:398](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L398)*

Returns the Id of current chain

**Returns:** *number*

chain Id

___

###  chainName

▸ **chainName**(): *string*

*Defined in [index.ts:406](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L406)*

Returns the name of current chain

**Returns:** *string*

chain name (lower case)

___

###  genesis

▸ **genesis**(): *any*

*Defined in [index.ts:366](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L366)*

Returns the Genesis parameters of current chain

**Returns:** *any*

Genesis dictionary

___

###  gteHardfork

▸ **gteHardfork**(`hardfork`: string, `opts?`: hardforkOptions): *boolean*

*Defined in [index.ts:281](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L281)*

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

▸ **hardfork**(): *string | null*

*Defined in [index.ts:390](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L390)*

Returns the hardfork set

**Returns:** *string | null*

Hardfork name

___

###  hardforkBlock

▸ **hardforkBlock**(`hardfork?`: undefined | string): *number*

*Defined in [index.ts:342](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L342)*

Returns the hardfork change block for hardfork provided or set

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork?` | undefined &#124; string | Hardfork name, optional if HF set |

**Returns:** *number*

Block number

___

###  hardforkGteHardfork

▸ **hardforkGteHardfork**(`hardfork1`: string | null, `hardfork2`: string, `opts?`: hardforkOptions): *boolean*

*Defined in [index.ts:248](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L248)*

Sequence based check if given or set HF1 is greater than or equal HF2

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork1` | string &#124; null | Hardfork name or null (if set) |
`hardfork2` | string | Hardfork name |
`opts?` | hardforkOptions | Hardfork options |

**Returns:** *boolean*

True if HF1 gte HF2

___

###  hardforkIsActiveOnBlock

▸ **hardforkIsActiveOnBlock**(`hardfork`: string | null, `blockNumber`: number, `opts?`: hardforkOptions): *boolean*

*Defined in [index.ts:218](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L218)*

Checks if set or provided hardfork is active on block number

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork` | string &#124; null | Hardfork name or null (for HF set) |
`blockNumber` | number | - |
`opts?` | hardforkOptions | Hardfork options (onlyActive unused) |

**Returns:** *boolean*

True if HF is active on block number

___

###  hardforkIsActiveOnChain

▸ **hardforkIsActiveOnChain**(`hardfork?`: string | null, `opts?`: hardforkOptions): *boolean*

*Defined in [index.ts:291](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L291)*

Checks if given or set hardfork is active on the chain

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork?` | string &#124; null | Hardfork name, optional if HF set |
`opts?` | hardforkOptions | Hardfork options (onlyActive unused) |

**Returns:** *boolean*

True if hardfork is active on the chain

___

###  hardforks

▸ **hardforks**(): *any*

*Defined in [index.ts:374](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L374)*

Returns the hardforks for current chain

**Returns:** *any*

Array with arrays of hardforks

___

###  isHardforkBlock

▸ **isHardforkBlock**(`blockNumber`: number, `hardfork?`: undefined | string): *boolean*

*Defined in [index.ts:353](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L353)*

True if block number provided is the hardfork (given or set) change block of the current chain

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockNumber` | number | Number of the block to check |
`hardfork?` | undefined &#124; string | Hardfork name, optional if HF set |

**Returns:** *boolean*

True if blockNumber is HF block

___

###  networkId

▸ **networkId**(): *number*

*Defined in [index.ts:414](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L414)*

Returns the Id of current network

**Returns:** *number*

network Id

___

###  param

▸ **param**(`topic`: string, `name`: string, `hardfork?`: undefined | string): *any*

*Defined in [index.ts:180](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L180)*

Returns the parameter corresponding to a hardfork

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`topic` | string | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
`name` | string | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |
`hardfork?` | undefined &#124; string | Hardfork name, optional if hardfork set  |

**Returns:** *any*

___

###  paramByBlock

▸ **paramByBlock**(`topic`: string, `name`: string, `blockNumber`: number): *any*

*Defined in [index.ts:205](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L205)*

Returns a parameter for the hardfork active on block number

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`topic` | string | Parameter topic |
`name` | string | Parameter name |
`blockNumber` | number | Block number  |

**Returns:** *any*

___

###  setChain

▸ **setChain**(`chain`: string | number | object): *any*

*Defined in [index.ts:89](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L89)*

Sets the chain

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`chain` | string &#124; number &#124; object | String ('mainnet') or Number (1) chain     representation. Or, a Dictionary of chain parameters for a private network. |

**Returns:** *any*

The dictionary with parameters set as chain

___

###  setHardfork

▸ **setHardfork**(`hardfork`: string | null): *void*

*Defined in [index.ts:110](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L110)*

Sets the hardfork to get params for

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork` | string &#124; null | String identifier ('byzantium')  |

**Returns:** *void*

___

### `Static` forCustomChain

▸ **forCustomChain**(`baseChain`: string | number, `customChainParams`: Partial‹[Chain](../interfaces/_types_.chain.md)›, `hardfork?`: string | null, `supportedHardforks?`: Array‹string›): *[Common](_index_.common.md)*

*Defined in [index.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L30)*

Creates a Common object for a custom chain, based on a standard one. It uses all the [Chain](../interfaces/_types_.chain.md)
params from [[baseChain]] except the ones overridden in [[customChainParams]].

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`baseChain` | string &#124; number | The name (`mainnet`) or id (`1`) of a standard chain used to base the custom chain params on. |
`customChainParams` | Partial‹[Chain](../interfaces/_types_.chain.md)› | The custom parameters of the chain. |
`hardfork?` | string &#124; null | String identifier ('byzantium') for hardfork (optional) |
`supportedHardforks?` | Array‹string› | Limit parameter returns to the given hardforks (optional)  |

**Returns:** *[Common](_index_.common.md)*
