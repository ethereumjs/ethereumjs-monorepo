[ethereumjs-common](../README.md) › ["index"](../modules/_index_.md) › [Common](_index_.common.md)

# Class: Common

Common class to access chain and hardfork parameters

## Hierarchy

- **Common**

## Index

### Constructors

- [constructor](_index_.common.md#constructor)

### Methods

- [\_chooseHardfork](_index_.common.md#_choosehardfork)
- [\_getHardfork](_index_.common.md#_gethardfork)
- [\_isSupportedHardfork](_index_.common.md#_issupportedhardfork)
- [activeHardfork](_index_.common.md#activehardfork)
- [activeHardforks](_index_.common.md#activehardforks)
- [activeOnBlock](_index_.common.md#activeonblock)
- [bootstrapNodes](_index_.common.md#bootstrapnodes)
- [chainId](_index_.common.md#chainid)
- [chainName](_index_.common.md#chainname)
- [consensus](_index_.common.md#consensus)
- [finality](_index_.common.md#finality)
- [genesis](_index_.common.md#genesis)
- [gteHardfork](_index_.common.md#gtehardfork)
- [hardfork](_index_.common.md#hardfork)
- [hardforkBlock](_index_.common.md#hardforkblock)
- [hardforkGteHardfork](_index_.common.md#hardforkgtehardfork)
- [hardforkIsActiveOnBlock](_index_.common.md#hardforkisactiveonblock)
- [hardforkIsActiveOnChain](_index_.common.md#hardforkisactiveonchain)
- [hardforks](_index_.common.md#hardforks)
- [isHardforkBlock](_index_.common.md#ishardforkblock)
- [networkId](_index_.common.md#networkid)
- [param](_index_.common.md#param)
- [paramByBlock](_index_.common.md#parambyblock)
- [setChain](_index_.common.md#setchain)
- [setHardfork](_index_.common.md#sethardfork)
- [forCustomChain](_index_.common.md#static-forcustomchain)

## Constructors

### constructor

\+ **new Common**(`chain`: string | number | object, `hardfork?`: string | null, `supportedHardforks?`: Array‹string›): _[Common](\_index_.common.md)\_

_Defined in [index.ts:62](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L62)_

**`constructor`**

**Parameters:**

| Name                  | Type                               | Description                                               |
| --------------------- | ---------------------------------- | --------------------------------------------------------- |
| `chain`               | string &#124; number &#124; object | String ('mainnet') or Number (1) chain                    |
| `hardfork?`           | string &#124; null                 | String identifier ('byzantium') for hardfork (optional)   |
| `supportedHardforks?` | Array‹string›                      | Limit parameter returns to the given hardforks (optional) |

**Returns:** _[Common](\_index_.common.md)\_

## Methods

### \_chooseHardfork

▸ **\_chooseHardfork**(`hardfork?`: string | null, `onlySupported?`: undefined | false | true): _string_

_Defined in [index.ts:131](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L131)_

Internal helper function to choose between hardfork set and hardfork provided as param

**Parameters:**

| Name             | Type                               | Description                               |
| ---------------- | ---------------------------------- | ----------------------------------------- |
| `hardfork?`      | string &#124; null                 | Hardfork given to function as a parameter |
| `onlySupported?` | undefined &#124; false &#124; true | -                                         |

**Returns:** _string_

Hardfork chosen to be used

---

### \_getHardfork

▸ **\_getHardfork**(`hardfork`: string): _any_

_Defined in [index.ts:150](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L150)_

Internal helper function, returns the params for the given hardfork for the chain set

**Parameters:**

| Name       | Type   | Description   |
| ---------- | ------ | ------------- |
| `hardfork` | string | Hardfork name |

**Returns:** _any_

Dictionary with hardfork params

---

### \_isSupportedHardfork

▸ **\_isSupportedHardfork**(`hardfork`: string | null): _boolean_

_Defined in [index.ts:163](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L163)_

Internal helper function to check if a hardfork is set to be supported by the library

**Parameters:**

| Name       | Type               | Description   |
| ---------- | ------------------ | ------------- |
| `hardfork` | string &#124; null | Hardfork name |

**Returns:** _boolean_

True if hardfork is supported

---

### activeHardfork

▸ **activeHardfork**(`blockNumber?`: number | null, `opts?`: hardforkOptions): _string_

_Defined in [index.ts:327](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L327)_

Returns the latest active hardfork name for chain or block or throws if unavailable

**Parameters:**

| Name           | Type               | Description                                            |
| -------------- | ------------------ | ------------------------------------------------------ |
| `blockNumber?` | number &#124; null | up to block if provided, otherwise for the whole chain |
| `opts?`        | hardforkOptions    | Hardfork options (onlyActive unused)                   |

**Returns:** _string_

Hardfork name

---

### activeHardforks

▸ **activeHardforks**(`blockNumber?`: number | null, `opts?`: hardforkOptions): _Array‹any›_

_Defined in [index.ts:307](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L307)_

Returns the active hardfork switches for the current chain

**Parameters:**

| Name           | Type               | Description                                            |
| -------------- | ------------------ | ------------------------------------------------------ |
| `blockNumber?` | number &#124; null | up to block if provided, otherwise for the whole chain |
| `opts?`        | hardforkOptions    | Hardfork options (onlyActive unused)                   |

**Returns:** _Array‹any›_

Array with hardfork arrays

---

### activeOnBlock

▸ **activeOnBlock**(`blockNumber`: number, `opts?`: hardforkOptions): _boolean_

_Defined in [index.ts:237](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L237)_

Alias to hardforkIsActiveOnBlock when hardfork is set

**Parameters:**

| Name          | Type            | Description                          |
| ------------- | --------------- | ------------------------------------ |
| `blockNumber` | number          | -                                    |
| `opts?`       | hardforkOptions | Hardfork options (onlyActive unused) |

**Returns:** _boolean_

True if HF is active on block number

---

### bootstrapNodes

▸ **bootstrapNodes**(): _any_

_Defined in [index.ts:402](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L402)_

Returns bootstrap nodes for the current chain

**Returns:** _any_

Dict with bootstrap nodes

---

### chainId

▸ **chainId**(): _number_

_Defined in [index.ts:418](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L418)_

Returns the Id of current chain

**Returns:** _number_

chain Id

---

### chainName

▸ **chainName**(): _string_

_Defined in [index.ts:426](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L426)_

Returns the name of current chain

**Returns:** _string_

chain name (lower case)

---

### consensus

▸ **consensus**(`hardfork?`: undefined | string): _string_

_Defined in [index.ts:367](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L367)_

Provide the consensus type for the hardfork set or provided as param

**Parameters:**

| Name        | Type                    | Description                             |
| ----------- | ----------------------- | --------------------------------------- |
| `hardfork?` | undefined &#124; string | Hardfork name, optional if hardfork set |

**Returns:** _string_

Consensus type (e.g. 'pow', 'poa')

---

### finality

▸ **finality**(`hardfork?`: undefined | string): _string_

_Defined in [index.ts:377](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L377)_

Provide the finality type for the hardfork set or provided as param

**Parameters:**

| Name        | Type                    | Description                             |
| ----------- | ----------------------- | --------------------------------------- |
| `hardfork?` | undefined &#124; string | Hardfork name, optional if hardfork set |

**Returns:** _string_

Finality type (e.g. 'pos', null of no finality)

---

### genesis

▸ **genesis**(): _any_

_Defined in [index.ts:386](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L386)_

Returns the Genesis parameters of current chain

**Returns:** _any_

Genesis dictionary

---

### gteHardfork

▸ **gteHardfork**(`hardfork`: string, `opts?`: hardforkOptions): _boolean_

_Defined in [index.ts:281](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L281)_

Alias to hardforkGteHardfork when hardfork is set

**Parameters:**

| Name       | Type            | Description      |
| ---------- | --------------- | ---------------- |
| `hardfork` | string          | Hardfork name    |
| `opts?`    | hardforkOptions | Hardfork options |

**Returns:** _boolean_

True if hardfork set is greater than hardfork provided

---

### hardfork

▸ **hardfork**(): _string | null_

_Defined in [index.ts:410](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L410)_

Returns the hardfork set

**Returns:** _string | null_

Hardfork name

---

### hardforkBlock

▸ **hardforkBlock**(`hardfork?`: undefined | string): _number_

_Defined in [index.ts:342](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L342)_

Returns the hardfork change block for hardfork provided or set

**Parameters:**

| Name        | Type                    | Description                       |
| ----------- | ----------------------- | --------------------------------- |
| `hardfork?` | undefined &#124; string | Hardfork name, optional if HF set |

**Returns:** _number_

Block number

---

### hardforkGteHardfork

▸ **hardforkGteHardfork**(`hardfork1`: string | null, `hardfork2`: string, `opts?`: hardforkOptions): _boolean_

_Defined in [index.ts:248](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L248)_

Sequence based check if given or set HF1 is greater than or equal HF2

**Parameters:**

| Name        | Type               | Description                    |
| ----------- | ------------------ | ------------------------------ |
| `hardfork1` | string &#124; null | Hardfork name or null (if set) |
| `hardfork2` | string             | Hardfork name                  |
| `opts?`     | hardforkOptions    | Hardfork options               |

**Returns:** _boolean_

True if HF1 gte HF2

---

### hardforkIsActiveOnBlock

▸ **hardforkIsActiveOnBlock**(`hardfork`: string | null, `blockNumber`: number, `opts?`: hardforkOptions): _boolean_

_Defined in [index.ts:218](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L218)_

Checks if set or provided hardfork is active on block number

**Parameters:**

| Name          | Type               | Description                          |
| ------------- | ------------------ | ------------------------------------ |
| `hardfork`    | string &#124; null | Hardfork name or null (for HF set)   |
| `blockNumber` | number             | -                                    |
| `opts?`       | hardforkOptions    | Hardfork options (onlyActive unused) |

**Returns:** _boolean_

True if HF is active on block number

---

### hardforkIsActiveOnChain

▸ **hardforkIsActiveOnChain**(`hardfork?`: string | null, `opts?`: hardforkOptions): _boolean_

_Defined in [index.ts:291](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L291)_

Checks if given or set hardfork is active on the chain

**Parameters:**

| Name        | Type               | Description                          |
| ----------- | ------------------ | ------------------------------------ |
| `hardfork?` | string &#124; null | Hardfork name, optional if HF set    |
| `opts?`     | hardforkOptions    | Hardfork options (onlyActive unused) |

**Returns:** _boolean_

True if hardfork is active on the chain

---

### hardforks

▸ **hardforks**(): _any_

_Defined in [index.ts:394](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L394)_

Returns the hardforks for current chain

**Returns:** _any_

Array with arrays of hardforks

---

### isHardforkBlock

▸ **isHardforkBlock**(`blockNumber`: number, `hardfork?`: undefined | string): _boolean_

_Defined in [index.ts:353](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L353)_

True if block number provided is the hardfork (given or set) change block of the current chain

**Parameters:**

| Name          | Type                    | Description                       |
| ------------- | ----------------------- | --------------------------------- |
| `blockNumber` | number                  | Number of the block to check      |
| `hardfork?`   | undefined &#124; string | Hardfork name, optional if HF set |

**Returns:** _boolean_

True if blockNumber is HF block

---

### networkId

▸ **networkId**(): _number_

_Defined in [index.ts:434](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L434)_

Returns the Id of current network

**Returns:** _number_

network Id

---

### param

▸ **param**(`topic`: string, `name`: string, `hardfork?`: undefined | string): _any_

_Defined in [index.ts:180](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L180)_

Returns the parameter corresponding to a hardfork

**Parameters:**

| Name        | Type                    | Description                                                                   |
| ----------- | ----------------------- | ----------------------------------------------------------------------------- |
| `topic`     | string                  | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow', 'casper', 'sharding') |
| `name`      | string                  | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic)                     |
| `hardfork?` | undefined &#124; string | Hardfork name, optional if hardfork set                                       |

**Returns:** _any_

---

### paramByBlock

▸ **paramByBlock**(`topic`: string, `name`: string, `blockNumber`: number): _any_

_Defined in [index.ts:205](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L205)_

Returns a parameter for the hardfork active on block number

**Parameters:**

| Name          | Type   | Description     |
| ------------- | ------ | --------------- |
| `topic`       | string | Parameter topic |
| `name`        | string | Parameter name  |
| `blockNumber` | number | Block number    |

**Returns:** _any_

---

### setChain

▸ **setChain**(`chain`: string | number | object): _any_

_Defined in [index.ts:89](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L89)_

Sets the chain

**Parameters:**

| Name    | Type                               | Description                                                                                                        |
| ------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `chain` | string &#124; number &#124; object | String ('mainnet') or Number (1) chain representation. Or, a Dictionary of chain parameters for a private network. |

**Returns:** _any_

The dictionary with parameters set as chain

---

### setHardfork

▸ **setHardfork**(`hardfork`: string | null): _void_

_Defined in [index.ts:110](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L110)_

Sets the hardfork to get params for

**Parameters:**

| Name       | Type               | Description                     |
| ---------- | ------------------ | ------------------------------- |
| `hardfork` | string &#124; null | String identifier ('byzantium') |

**Returns:** _void_

---

### `Static` forCustomChain

▸ **forCustomChain**(`baseChain`: string | number, `customChainParams`: Partial‹[Chain](../interfaces/_types_.chain.md)›, `hardfork?`: string | null, `supportedHardforks?`: Array‹string›): _[Common](\_index_.common.md)\_

_Defined in [index.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/common/src/index.ts#L30)_

Creates a Common object for a custom chain, based on a standard one. It uses all the [Chain](../interfaces/_types_.chain.md)
params from [[baseChain]] except the ones overridden in [[customChainParams]].

**Parameters:**

| Name                  | Type                                             | Description                                                                                   |
| --------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `baseChain`           | string &#124; number                             | The name (`mainnet`) or id (`1`) of a standard chain used to base the custom chain params on. |
| `customChainParams`   | Partial‹[Chain](../interfaces/_types_.chain.md)› | The custom parameters of the chain.                                                           |
| `hardfork?`           | string &#124; null                               | String identifier ('byzantium') for hardfork (optional)                                       |
| `supportedHardforks?` | Array‹string›                                    | Limit parameter returns to the given hardforks (optional)                                     |

**Returns:** _[Common](\_index_.common.md)\_
