[ethereumjs-common](../README.md) > [Common](../classes/common.md)

# Class: Common

Common class to access chain and hardfork parameters

## Hierarchy

**Common**

## Index

### Constructors

- [constructor](common.md#constructor)

### Methods

- [\_chooseHardfork](common.md#_choosehardfork)
- [\_getHardfork](common.md#_gethardfork)
- [\_isSupportedHardfork](common.md#_issupportedhardfork)
- [activeHardfork](common.md#activehardfork)
- [activeHardforks](common.md#activehardforks)
- [activeOnBlock](common.md#activeonblock)
- [bootstrapNodes](common.md#bootstrapnodes)
- [chainId](common.md#chainid)
- [chainName](common.md#chainname)
- [consensus](common.md#consensus)
- [finality](common.md#finality)
- [genesis](common.md#genesis)
- [gteHardfork](common.md#gtehardfork)
- [hardfork](common.md#hardfork)
- [hardforkBlock](common.md#hardforkblock)
- [hardforkGteHardfork](common.md#hardforkgtehardfork)
- [hardforkIsActiveOnBlock](common.md#hardforkisactiveonblock)
- [hardforkIsActiveOnChain](common.md#hardforkisactiveonchain)
- [hardforks](common.md#hardforks)
- [isHardforkBlock](common.md#ishardforkblock)
- [networkId](common.md#networkid)
- [param](common.md#param)
- [paramByBlock](common.md#parambyblock)
- [setChain](common.md#setchain)
- [setHardfork](common.md#sethardfork)
- [forCustomChain](common.md#forcustomchain)

---

## Constructors

<a id="constructor"></a>

### constructor

⊕ **new Common**(chain: _`string` \| `number` \| `object`_, hardfork?: _`string` \| `null`_, supportedHardforks?: _`Array`<`string`>_): [Common](common.md)

_Defined in [index.ts:62](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L62)_

_**constructor**_:

**Parameters:**

| Name                          | Type                             | Description                                               |
| ----------------------------- | -------------------------------- | --------------------------------------------------------- |
| chain                         | `string` \| `number` \| `object` | String ('mainnet') or Number (1) chain                    |
| `Optional` hardfork           | `string` \| `null`               | String identifier ('byzantium') for hardfork (optional)   |
| `Optional` supportedHardforks | `Array`<`string`>                | Limit parameter returns to the given hardforks (optional) |

**Returns:** [Common](common.md)

---

## Methods

<a id="_choosehardfork"></a>

### \_chooseHardfork

▸ **\_chooseHardfork**(hardfork?: _`string` \| `null`_, onlySupported?: _`undefined` \| `false` \| `true`_): `string`

_Defined in [index.ts:131](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L131)_

Internal helper function to choose between hardfork set and hardfork provided as param

**Parameters:**

| Name                     | Type                             | Description                               |
| ------------------------ | -------------------------------- | ----------------------------------------- |
| `Optional` hardfork      | `string` \| `null`               | Hardfork given to function as a parameter |
| `Optional` onlySupported | `undefined` \| `false` \| `true` |

**Returns:** `string`
Hardfork chosen to be used

---

<a id="_gethardfork"></a>

### \_getHardfork

▸ **\_getHardfork**(hardfork: _`string`_): `any`

_Defined in [index.ts:150](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L150)_

Internal helper function, returns the params for the given hardfork for the chain set

**Parameters:**

| Name     | Type     | Description   |
| -------- | -------- | ------------- |
| hardfork | `string` | Hardfork name |

**Returns:** `any`
Dictionary with hardfork params

---

<a id="_issupportedhardfork"></a>

### \_isSupportedHardfork

▸ **\_isSupportedHardfork**(hardfork: _`string` \| `null`_): `boolean`

_Defined in [index.ts:163](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L163)_

Internal helper function to check if a hardfork is set to be supported by the library

**Parameters:**

| Name     | Type               | Description   |
| -------- | ------------------ | ------------- |
| hardfork | `string` \| `null` | Hardfork name |

**Returns:** `boolean`
True if hardfork is supported

---

<a id="activehardfork"></a>

### activeHardfork

▸ **activeHardfork**(blockNumber?: _`number` \| `null`_, opts?: _[hardforkOptions](../interfaces/hardforkoptions.md)_): `string`

_Defined in [index.ts:327](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L327)_

Returns the latest active hardfork name for chain or block or throws if unavailable

**Parameters:**

| Name                   | Type                                                | Description                                            |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------------ |
| `Optional` blockNumber | `number` \| `null`                                  | up to block if provided, otherwise for the whole chain |
| `Optional` opts        | [hardforkOptions](../interfaces/hardforkoptions.md) | Hardfork options (onlyActive unused)                   |

**Returns:** `string`
Hardfork name

---

<a id="activehardforks"></a>

### activeHardforks

▸ **activeHardforks**(blockNumber?: _`number` \| `null`_, opts?: _[hardforkOptions](../interfaces/hardforkoptions.md)_): `Array`<`any`>

_Defined in [index.ts:307](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L307)_

Returns the active hardfork switches for the current chain

**Parameters:**

| Name                   | Type                                                | Description                                            |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------------ |
| `Optional` blockNumber | `number` \| `null`                                  | up to block if provided, otherwise for the whole chain |
| `Optional` opts        | [hardforkOptions](../interfaces/hardforkoptions.md) | Hardfork options (onlyActive unused)                   |

**Returns:** `Array`<`any`>
Array with hardfork arrays

---

<a id="activeonblock"></a>

### activeOnBlock

▸ **activeOnBlock**(blockNumber: _`number`_, opts?: _[hardforkOptions](../interfaces/hardforkoptions.md)_): `boolean`

_Defined in [index.ts:237](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L237)_

Alias to hardforkIsActiveOnBlock when hardfork is set

**Parameters:**

| Name            | Type                                                | Description                          |
| --------------- | --------------------------------------------------- | ------------------------------------ |
| blockNumber     | `number`                                            | \-                                   |
| `Optional` opts | [hardforkOptions](../interfaces/hardforkoptions.md) | Hardfork options (onlyActive unused) |

**Returns:** `boolean`
True if HF is active on block number

---

<a id="bootstrapnodes"></a>

### bootstrapNodes

▸ **bootstrapNodes**(): `any`

_Defined in [index.ts:402](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L402)_

Returns bootstrap nodes for the current chain

**Returns:** `any`
Dict with bootstrap nodes

---

<a id="chainid"></a>

### chainId

▸ **chainId**(): `number`

_Defined in [index.ts:418](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L418)_

Returns the Id of current chain

**Returns:** `number`
chain Id

---

<a id="chainname"></a>

### chainName

▸ **chainName**(): `string`

_Defined in [index.ts:426](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L426)_

Returns the name of current chain

**Returns:** `string`
chain name (lower case)

---

<a id="consensus"></a>

### consensus

▸ **consensus**(hardfork?: _`undefined` \| `string`_): `string`

_Defined in [index.ts:367](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L367)_

Provide the consensus type for the hardfork set or provided as param

**Parameters:**

| Name                | Type                    | Description                             |
| ------------------- | ----------------------- | --------------------------------------- |
| `Optional` hardfork | `undefined` \| `string` | Hardfork name, optional if hardfork set |

**Returns:** `string`
Consensus type (e.g. 'pow', 'poa')

---

<a id="finality"></a>

### finality

▸ **finality**(hardfork?: _`undefined` \| `string`_): `string`

_Defined in [index.ts:377](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L377)_

Provide the finality type for the hardfork set or provided as param

**Parameters:**

| Name                | Type                    | Description                             |
| ------------------- | ----------------------- | --------------------------------------- |
| `Optional` hardfork | `undefined` \| `string` | Hardfork name, optional if hardfork set |

**Returns:** `string`
Finality type (e.g. 'pos', null of no finality)

---

<a id="genesis"></a>

### genesis

▸ **genesis**(): `any`

_Defined in [index.ts:386](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L386)_

Returns the Genesis parameters of current chain

**Returns:** `any`
Genesis dictionary

---

<a id="gtehardfork"></a>

### gteHardfork

▸ **gteHardfork**(hardfork: _`string`_, opts?: _[hardforkOptions](../interfaces/hardforkoptions.md)_): `boolean`

_Defined in [index.ts:281](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L281)_

Alias to hardforkGteHardfork when hardfork is set

**Parameters:**

| Name            | Type                                                | Description      |
| --------------- | --------------------------------------------------- | ---------------- |
| hardfork        | `string`                                            | Hardfork name    |
| `Optional` opts | [hardforkOptions](../interfaces/hardforkoptions.md) | Hardfork options |

**Returns:** `boolean`
True if hardfork set is greater than hardfork provided

---

<a id="hardfork"></a>

### hardfork

▸ **hardfork**(): `string` \| `null`

_Defined in [index.ts:410](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L410)_

Returns the hardfork set

**Returns:** `string` \| `null`
Hardfork name

---

<a id="hardforkblock"></a>

### hardforkBlock

▸ **hardforkBlock**(hardfork?: _`undefined` \| `string`_): `number`

_Defined in [index.ts:342](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L342)_

Returns the hardfork change block for hardfork provided or set

**Parameters:**

| Name                | Type                    | Description                       |
| ------------------- | ----------------------- | --------------------------------- |
| `Optional` hardfork | `undefined` \| `string` | Hardfork name, optional if HF set |

**Returns:** `number`
Block number

---

<a id="hardforkgtehardfork"></a>

### hardforkGteHardfork

▸ **hardforkGteHardfork**(hardfork1: _`string` \| `null`_, hardfork2: _`string`_, opts?: _[hardforkOptions](../interfaces/hardforkoptions.md)_): `boolean`

_Defined in [index.ts:248](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L248)_

Sequence based check if given or set HF1 is greater than or equal HF2

**Parameters:**

| Name            | Type                                                | Description                    |
| --------------- | --------------------------------------------------- | ------------------------------ |
| hardfork1       | `string` \| `null`                                  | Hardfork name or null (if set) |
| hardfork2       | `string`                                            | Hardfork name                  |
| `Optional` opts | [hardforkOptions](../interfaces/hardforkoptions.md) | Hardfork options               |

**Returns:** `boolean`
True if HF1 gte HF2

---

<a id="hardforkisactiveonblock"></a>

### hardforkIsActiveOnBlock

▸ **hardforkIsActiveOnBlock**(hardfork: _`string` \| `null`_, blockNumber: _`number`_, opts?: _[hardforkOptions](../interfaces/hardforkoptions.md)_): `boolean`

_Defined in [index.ts:218](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L218)_

Checks if set or provided hardfork is active on block number

**Parameters:**

| Name            | Type                                                | Description                          |
| --------------- | --------------------------------------------------- | ------------------------------------ |
| hardfork        | `string` \| `null`                                  | Hardfork name or null (for HF set)   |
| blockNumber     | `number`                                            | \-                                   |
| `Optional` opts | [hardforkOptions](../interfaces/hardforkoptions.md) | Hardfork options (onlyActive unused) |

**Returns:** `boolean`
True if HF is active on block number

---

<a id="hardforkisactiveonchain"></a>

### hardforkIsActiveOnChain

▸ **hardforkIsActiveOnChain**(hardfork?: _`string` \| `null`_, opts?: _[hardforkOptions](../interfaces/hardforkoptions.md)_): `boolean`

_Defined in [index.ts:291](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L291)_

Checks if given or set hardfork is active on the chain

**Parameters:**

| Name                | Type                                                | Description                          |
| ------------------- | --------------------------------------------------- | ------------------------------------ |
| `Optional` hardfork | `string` \| `null`                                  | Hardfork name, optional if HF set    |
| `Optional` opts     | [hardforkOptions](../interfaces/hardforkoptions.md) | Hardfork options (onlyActive unused) |

**Returns:** `boolean`
True if hardfork is active on the chain

---

<a id="hardforks"></a>

### hardforks

▸ **hardforks**(): `any`

_Defined in [index.ts:394](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L394)_

Returns the hardforks for current chain

**Returns:** `any`
Array with arrays of hardforks

---

<a id="ishardforkblock"></a>

### isHardforkBlock

▸ **isHardforkBlock**(blockNumber: _`number`_, hardfork?: _`undefined` \| `string`_): `boolean`

_Defined in [index.ts:353](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L353)_

True if block number provided is the hardfork (given or set) change block of the current chain

**Parameters:**

| Name                | Type                    | Description                       |
| ------------------- | ----------------------- | --------------------------------- |
| blockNumber         | `number`                | Number of the block to check      |
| `Optional` hardfork | `undefined` \| `string` | Hardfork name, optional if HF set |

**Returns:** `boolean`
True if blockNumber is HF block

---

<a id="networkid"></a>

### networkId

▸ **networkId**(): `number`

_Defined in [index.ts:434](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L434)_

Returns the Id of current network

**Returns:** `number`
network Id

---

<a id="param"></a>

### param

▸ **param**(topic: _`string`_, name: _`string`_, hardfork?: _`undefined` \| `string`_): `any`

_Defined in [index.ts:180](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L180)_

Returns the parameter corresponding to a hardfork

**Parameters:**

| Name                | Type                    | Description                                                                   |
| ------------------- | ----------------------- | ----------------------------------------------------------------------------- |
| topic               | `string`                | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow', 'casper', 'sharding') |
| name                | `string`                | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic)                     |
| `Optional` hardfork | `undefined` \| `string` | Hardfork name, optional if hardfork set                                       |

**Returns:** `any`

---

<a id="parambyblock"></a>

### paramByBlock

▸ **paramByBlock**(topic: _`string`_, name: _`string`_, blockNumber: _`number`_): `any`

_Defined in [index.ts:205](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L205)_

Returns a parameter for the hardfork active on block number

**Parameters:**

| Name        | Type     | Description     |
| ----------- | -------- | --------------- |
| topic       | `string` | Parameter topic |
| name        | `string` | Parameter name  |
| blockNumber | `number` | Block number    |

**Returns:** `any`

---

<a id="setchain"></a>

### setChain

▸ **setChain**(chain: _`string` \| `number` \| `object`_): `any`

_Defined in [index.ts:89](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L89)_

Sets the chain

**Parameters:**

| Name  | Type                             | Description                                                                                                        |
| ----- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| chain | `string` \| `number` \| `object` | String ('mainnet') or Number (1) chain representation. Or, a Dictionary of chain parameters for a private network. |

**Returns:** `any`
The dictionary with parameters set as chain

---

<a id="sethardfork"></a>

### setHardfork

▸ **setHardfork**(hardfork: _`string` \| `null`_): `void`

_Defined in [index.ts:110](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L110)_

Sets the hardfork to get params for

**Parameters:**

| Name     | Type               | Description                     |
| -------- | ------------------ | ------------------------------- |
| hardfork | `string` \| `null` | String identifier ('byzantium') |

**Returns:** `void`

---

<a id="forcustomchain"></a>

### `<Static>` forCustomChain

▸ **forCustomChain**(baseChain: _`string` \| `number`_, customChainParams: _`Partial`<[Chain](../interfaces/chain.md)>_, hardfork?: _`string` \| `null`_, supportedHardforks?: _`Array`<`string`>_): [Common](common.md)

_Defined in [index.ts:30](https://github.com/ethereumjs/ethereumjs-common/blob/30c4186/src/index.ts#L30)_

Creates a Common object for a custom chain, based on a standard one. It uses all the [Chain](../interfaces/chain.md) params from \[\[baseChain\]\] except the ones overridden in \[\[customChainParams\]\].

**Parameters:**

| Name                          | Type                                       | Description                                                                                       |
| ----------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| baseChain                     | `string` \| `number`                       | The name (\`mainnet\`) or id (\`1\`) of a standard chain used to base the custom chain params on. |
| customChainParams             | `Partial`<[Chain](../interfaces/chain.md)> | The custom parameters of the chain.                                                               |
| `Optional` hardfork           | `string` \| `null`                         | String identifier ('byzantium') for hardfork (optional)                                           |
| `Optional` supportedHardforks | `Array`<`string`>                          | Limit parameter returns to the given hardforks (optional)                                         |

**Returns:** [Common](common.md)

---
