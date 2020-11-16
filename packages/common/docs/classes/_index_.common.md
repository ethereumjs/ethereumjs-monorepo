[@ethereumjs/common](../README.md) › ["index"](../modules/_index_.md) › [Common](_index_.common.md)

# Class: Common

Common class to access chain and hardfork parameters

## Hierarchy

* **Common**

## Index

### Constructors

* [constructor](_index_.common.md#constructor)

### Properties

* [DEFAULT_HARDFORK](_index_.common.md#default_hardfork)

### Methods

* [_calcForkHash](_index_.common.md#_calcforkhash)
* [_chooseHardfork](_index_.common.md#_choosehardfork)
* [_getHardfork](_index_.common.md#_gethardfork)
* [_isSupportedHardfork](_index_.common.md#_issupportedhardfork)
* [activeHardfork](_index_.common.md#activehardfork)
* [activeHardforks](_index_.common.md#activehardforks)
* [activeOnBlock](_index_.common.md#activeonblock)
* [bootstrapNodes](_index_.common.md#bootstrapnodes)
* [chainId](_index_.common.md#chainid)
* [chainName](_index_.common.md#chainname)
* [consensusAlgorithm](_index_.common.md#consensusalgorithm)
* [consensusType](_index_.common.md#consensustype)
* [eips](_index_.common.md#eips)
* [forkHash](_index_.common.md#forkhash)
* [genesis](_index_.common.md#genesis)
* [gteHardfork](_index_.common.md#gtehardfork)
* [hardfork](_index_.common.md#hardfork)
* [hardforkBlock](_index_.common.md#hardforkblock)
* [hardforkForForkHash](_index_.common.md#hardforkforforkhash)
* [hardforkGteHardfork](_index_.common.md#hardforkgtehardfork)
* [hardforkIsActiveOnBlock](_index_.common.md#hardforkisactiveonblock)
* [hardforkIsActiveOnChain](_index_.common.md#hardforkisactiveonchain)
* [hardforks](_index_.common.md#hardforks)
* [isHardforkBlock](_index_.common.md#ishardforkblock)
* [isNextHardforkBlock](_index_.common.md#isnexthardforkblock)
* [networkId](_index_.common.md#networkid)
* [nextHardforkBlock](_index_.common.md#nexthardforkblock)
* [param](_index_.common.md#param)
* [paramByBlock](_index_.common.md#parambyblock)
* [paramByEIP](_index_.common.md#parambyeip)
* [paramByHardfork](_index_.common.md#parambyhardfork)
* [setChain](_index_.common.md#setchain)
* [setEIPs](_index_.common.md#seteips)
* [setHardfork](_index_.common.md#sethardfork)
* [setHardforkByBlockNumber](_index_.common.md#sethardforkbyblocknumber)
* [forCustomChain](_index_.common.md#static-forcustomchain)

## Constructors

###  constructor

\+ **new Common**(`opts`: [CommonOpts](../interfaces/_index_.commonopts.md)): *[Common](_index_.common.md)*

*Defined in [index.ts:96](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L96)*

**`constructor`** 

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [CommonOpts](../interfaces/_index_.commonopts.md) |

**Returns:** *[Common](_index_.common.md)*

## Properties

###  DEFAULT_HARDFORK

• **DEFAULT_HARDFORK**: *string* = "istanbul"

*Defined in [index.ts:47](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L47)*

## Methods

###  _calcForkHash

▸ **_calcForkHash**(`hardfork`: string): *string*

*Defined in [index.ts:516](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L516)*

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

*Defined in [index.ts:186](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L186)*

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

*Defined in [index.ts:200](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L200)*

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

*Defined in [index.ts:213](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L213)*

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

*Defined in [index.ts:451](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L451)*

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

*Defined in [index.ts:431](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L431)*

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

*Defined in [index.ts:361](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L361)*

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

*Defined in [index.ts:591](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L591)*

Returns bootstrap nodes for the current chain

**Returns:** *any*

Dict with bootstrap nodes

___

###  chainId

▸ **chainId**(): *number*

*Defined in [index.ts:607](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L607)*

Returns the Id of current chain

**Returns:** *number*

chain Id

___

###  chainName

▸ **chainName**(): *string*

*Defined in [index.ts:615](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L615)*

Returns the name of current chain

**Returns:** *string*

chain name (lower case)

___

###  consensusAlgorithm

▸ **consensusAlgorithm**(): *string*

*Defined in [index.ts:649](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L649)*

Returns the concrete consensus implementation
algorithm or protocol for the network
e.g. "ethash" for "pow" consensus type or
"clique" for "poa" consensus type

**Returns:** *string*

___

###  consensusType

▸ **consensusType**(): *string*

*Defined in [index.ts:639](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L639)*

Returns the consensus type of the network
Possible values: "pow"|"poa"

**Returns:** *string*

___

###  eips

▸ **eips**(): *number[]*

*Defined in [index.ts:631](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L631)*

Returns the active EIPs

**Returns:** *number[]*

List of EIPs

___

###  forkHash

▸ **forkHash**(`hardfork?`: undefined | string): *any*

*Defined in [index.ts:546](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L546)*

Returns an eth/64 compliant fork hash (EIP-2124)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork?` | undefined &#124; string | Hardfork name, optional if HF set  |

**Returns:** *any*

___

###  genesis

▸ **genesis**(): *any*

*Defined in [index.ts:575](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L575)*

Returns the Genesis parameters of current chain

**Returns:** *any*

Genesis dictionary

___

###  gteHardfork

▸ **gteHardfork**(`hardfork`: string, `opts?`: hardforkOptions): *boolean*

*Defined in [index.ts:405](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L405)*

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

*Defined in [index.ts:599](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L599)*

Returns the hardfork set

**Returns:** *string*

Hardfork name

___

###  hardforkBlock

▸ **hardforkBlock**(`hardfork?`: undefined | string): *number*

*Defined in [index.ts:466](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L466)*

Returns the hardfork change block for hardfork provided or set

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork?` | undefined &#124; string | Hardfork name, optional if HF set |

**Returns:** *number*

Block number

___

###  hardforkForForkHash

▸ **hardforkForForkHash**(`forkHash`: string): *any | null*

*Defined in [index.ts:564](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L564)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`forkHash` | string | Fork hash as a hex string |

**Returns:** *any | null*

Array with hardfork data (name, block, forkHash)

___

###  hardforkGteHardfork

▸ **hardforkGteHardfork**(`hardfork1`: string | null, `hardfork2`: string, `opts?`: hardforkOptions): *boolean*

*Defined in [index.ts:372](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L372)*

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

*Defined in [index.ts:342](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L342)*

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

*Defined in [index.ts:415](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L415)*

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

*Defined in [index.ts:583](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L583)*

Returns the hardforks for current chain

**Returns:** *any*

Array with arrays of hardforks

___

###  isHardforkBlock

▸ **isHardforkBlock**(`blockNumber`: number, `hardfork?`: undefined | string): *boolean*

*Defined in [index.ts:477](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L477)*

True if block number provided is the hardfork (given or set) change block

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockNumber` | number | Number of the block to check |
`hardfork?` | undefined &#124; string | Hardfork name, optional if HF set |

**Returns:** *boolean*

True if blockNumber is HF block

___

###  isNextHardforkBlock

▸ **isNextHardforkBlock**(`blockNumber`: number, `hardfork?`: undefined | string): *boolean*

*Defined in [index.ts:506](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L506)*

True if block number provided is the hardfork change block following the hardfork given or set

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

*Defined in [index.ts:623](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L623)*

Returns the Id of current network

**Returns:** *number*

network Id

___

###  nextHardforkBlock

▸ **nextHardforkBlock**(`hardfork?`: undefined | string): *number | null*

*Defined in [index.ts:487](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L487)*

Returns the change block for the next hardfork after the hardfork provided or set

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork?` | undefined &#124; string | Hardfork name, optional if HF set |

**Returns:** *number | null*

Block number or null if not available

___

###  param

▸ **param**(`topic`: string, `name`: string): *any*

*Defined in [index.ts:254](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L254)*

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

▸ **paramByBlock**(`topic`: string, `name`: string, `blockNumber`: number): *any*

*Defined in [index.ts:329](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L329)*

Returns a parameter for the hardfork active on block number

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`topic` | string | Parameter topic |
`name` | string | Parameter name |
`blockNumber` | number | Block number  |

**Returns:** *any*

___

###  paramByEIP

▸ **paramByEIP**(`topic`: string, `name`: string, `eip`: number): *any*

*Defined in [index.ts:307](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L307)*

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

*Defined in [index.ts:274](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L274)*

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

###  setChain

▸ **setChain**(`chain`: string | number | object): *any*

*Defined in [index.ts:121](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L121)*

Sets the chain

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`chain` | string &#124; number &#124; object | String ('mainnet') or Number (1) chain     representation. Or, a Dictionary of chain parameters for a private network. |

**Returns:** *any*

The dictionary with parameters set as chain

___

###  setEIPs

▸ **setEIPs**(`eips`: number[]): *void*

*Defined in [index.ts:228](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L228)*

Sets the active EIPs

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`eips` | number[] | [] |   |

**Returns:** *void*

___

###  setHardfork

▸ **setHardfork**(`hardfork`: string): *void*

*Defined in [index.ts:142](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L142)*

Sets the hardfork to get params for

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hardfork` | string | String identifier (e.g. 'byzantium')  |

**Returns:** *void*

___

###  setHardforkByBlockNumber

▸ **setHardforkByBlockNumber**(`blockNumber`: number): *string*

*Defined in [index.ts:163](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L163)*

Sets a new hardfork based on the block number provided

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *string*

The name of the HF set

___

### `Static` forCustomChain

▸ **forCustomChain**(`baseChain`: string | number, `customChainParams`: Partial‹[Chain](../interfaces/_types_.chain.md)›, `hardfork?`: undefined | string, `supportedHardforks?`: Array‹string›): *[Common](_index_.common.md)*

*Defined in [index.ts:64](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L64)*

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
