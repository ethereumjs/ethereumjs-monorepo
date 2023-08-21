[@ethereumjs/common](../README.md) / Common

# Class: Common

Common class to access chain and hardfork parameters and to provide
a unified and shared view on the network and hardfork state.

Use the [custom](Common.md#custom) static constructor for creating simple
custom chain [Common](Common.md) objects (more complete custom chain setups
can be created via the main constructor and the [customChains](../interfaces/CommonOpts.md#customchains) parameter).

## Table of contents

### Constructors

- [constructor](Common.md#constructor)

### Properties

- [DEFAULT\_HARDFORK](Common.md#default_hardfork)
- [events](Common.md#events)

### Methods

- [activeOnBlock](Common.md#activeonblock)
- [bootstrapNodes](Common.md#bootstrapnodes)
- [chainId](Common.md#chainid)
- [chainName](Common.md#chainname)
- [consensusAlgorithm](Common.md#consensusalgorithm)
- [consensusConfig](Common.md#consensusconfig)
- [consensusType](Common.md#consensustype)
- [copy](Common.md#copy)
- [dnsNetworks](Common.md#dnsnetworks)
- [eipBlock](Common.md#eipblock)
- [eips](Common.md#eips)
- [forkHash](Common.md#forkhash)
- [genesis](Common.md#genesis)
- [getHardforkBy](Common.md#gethardforkby)
- [gteHardfork](Common.md#gtehardfork)
- [hardfork](Common.md#hardfork)
- [hardforkBlock](Common.md#hardforkblock)
- [hardforkForForkHash](Common.md#hardforkforforkhash)
- [hardforkGteHardfork](Common.md#hardforkgtehardfork)
- [hardforkIsActiveOnBlock](Common.md#hardforkisactiveonblock)
- [hardforkTTD](Common.md#hardforkttd)
- [hardforkTimestamp](Common.md#hardforktimestamp)
- [hardforks](Common.md#hardforks)
- [isActivatedEIP](Common.md#isactivatedeip)
- [networkId](Common.md#networkid)
- [nextHardforkBlockOrTimestamp](Common.md#nexthardforkblockortimestamp)
- [param](Common.md#param)
- [paramByBlock](Common.md#parambyblock)
- [paramByEIP](Common.md#parambyeip)
- [paramByHardfork](Common.md#parambyhardfork)
- [setChain](Common.md#setchain)
- [setEIPs](Common.md#seteips)
- [setForkHashes](Common.md#setforkhashes)
- [setHardfork](Common.md#sethardfork)
- [setHardforkBy](Common.md#sethardforkby)
- [custom](Common.md#custom)
- [fromGethGenesis](Common.md#fromgethgenesis)
- [getInitializedChains](Common.md#getinitializedchains)
- [isSupportedChainId](Common.md#issupportedchainid)

## Constructors

### constructor

• **new Common**(`opts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`CommonOpts`](../interfaces/CommonOpts.md) |

#### Defined in

[common.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L223)

## Properties

### DEFAULT\_HARDFORK

• `Readonly` **DEFAULT\_HARDFORK**: `string`

#### Defined in

[common.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L47)

___

### events

• **events**: `EventEmitter`

#### Defined in

[common.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L56)

## Methods

### activeOnBlock

▸ **activeOnBlock**(`blockNumber`): `boolean`

Alias to hardforkIsActiveOnBlock when hardfork is set

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `BigIntLike` |

#### Returns

`boolean`

True if HF is active on block number

#### Defined in

[common.ts:613](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L613)

___

### bootstrapNodes

▸ **bootstrapNodes**(): [`BootstrapNodeConfig`](../interfaces/BootstrapNodeConfig.md)[]

Returns bootstrap nodes for the current chain

#### Returns

[`BootstrapNodeConfig`](../interfaces/BootstrapNodeConfig.md)[]

Dict with bootstrap nodes

#### Defined in

[common.ts:863](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L863)

___

### chainId

▸ **chainId**(): `bigint`

Returns the Id of current chain

#### Returns

`bigint`

chain Id

#### Defined in

[common.ts:887](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L887)

___

### chainName

▸ **chainName**(): `string`

Returns the name of current chain

#### Returns

`string`

chain name (lower case)

#### Defined in

[common.ts:895](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L895)

___

### consensusAlgorithm

▸ **consensusAlgorithm**(): `string`

Returns the concrete consensus implementation
algorithm or protocol for the network
e.g. "ethash" for "pow" consensus type,
"clique" for "poa" consensus type or
"casper" for "pos" consensus type.

Note: This value can update along a Hardfork.

#### Returns

`string`

#### Defined in

[common.ts:943](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L943)

___

### consensusConfig

▸ **consensusConfig**(): `Object`

Returns a dictionary with consensus configuration
parameters based on the consensus algorithm

Expected returns (parameters must be present in
the respective chain json files):

ethash: empty object
clique: period, epoch
casper: empty object

Note: This value can update along a Hardfork.

#### Returns

`Object`

#### Defined in

[common.ts:969](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L969)

___

### consensusType

▸ **consensusType**(): `string`

Returns the consensus type of the network
Possible values: "pow"|"poa"|"pos"

Note: This value can update along a Hardfork.

#### Returns

`string`

#### Defined in

[common.ts:921](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L921)

___

### copy

▸ **copy**(): [`Common`](Common.md)

Returns a deep copy of this [Common](Common.md) instance.

#### Returns

[`Common`](Common.md)

#### Defined in

[common.ts:990](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L990)

___

### dnsNetworks

▸ **dnsNetworks**(): `string`[]

Returns DNS networks for the current chain

#### Returns

`string`[]

Array of DNS ENR urls

#### Defined in

[common.ts:871](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L871)

___

### eipBlock

▸ **eipBlock**(`eip`): ``null`` \| `bigint`

Returns the hardfork change block for eip

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eip` | `number` | EIP number |

#### Returns

``null`` \| `bigint`

Block number or null if unscheduled

#### Defined in

[common.ts:676](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L676)

___

### eips

▸ **eips**(): `number`[]

Returns the active EIPs

#### Returns

`number`[]

List of EIPs

#### Defined in

[common.ts:911](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L911)

___

### forkHash

▸ **forkHash**(`hardfork?`, `genesisHash?`): `string`

Returns an eth/64 compliant fork hash (EIP-2124)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |
| `genesisHash?` | `Uint8Array` | Genesis block hash of the chain, optional if already defined and not needed to be calculated |

#### Returns

`string`

#### Defined in

[common.ts:797](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L797)

___

### genesis

▸ **genesis**(): [`GenesisBlockConfig`](../interfaces/GenesisBlockConfig.md)

Returns the Genesis parameters of the current chain

#### Returns

[`GenesisBlockConfig`](../interfaces/GenesisBlockConfig.md)

Genesis dictionary

#### Defined in

[common.ts:847](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L847)

___

### getHardforkBy

▸ **getHardforkBy**(`opts`): `string`

Returns the hardfork either based on block numer (older HFs) or
timestamp (Shanghai upwards).

An optional TD takes precedence in case the corresponding HF block
is set to `null` or otherwise needs to match (if not an error
will be thrown).

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`HardforkByOpts`](../interfaces/HardforkByOpts.md) |

#### Returns

`string`

The name of the HF

#### Defined in

[common.ts:307](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L307)

___

### gteHardfork

▸ **gteHardfork**(`hardfork`): `boolean`

Alias to hardforkGteHardfork when hardfork is set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | `string` | Hardfork name |

#### Returns

`boolean`

True if hardfork set is greater than hardfork provided

#### Defined in

[common.ts:644](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L644)

___

### hardfork

▸ **hardfork**(): `string`

Returns the hardfork set

#### Returns

`string`

Hardfork name

#### Defined in

[common.ts:879](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L879)

___

### hardforkBlock

▸ **hardforkBlock**(`hardfork?`): ``null`` \| `bigint`

Returns the hardfork change block for hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `bigint`

Block number or null if unscheduled

#### Defined in

[common.ts:653](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L653)

___

### hardforkForForkHash

▸ **hardforkForForkHash**(`forkHash`): ``null`` \| [`HardforkTransitionConfig`](../interfaces/HardforkTransitionConfig.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `forkHash` | `string` | Fork hash as a hex string |

#### Returns

``null`` \| [`HardforkTransitionConfig`](../interfaces/HardforkTransitionConfig.md)

Array with hardfork data (name, block, forkHash)

#### Defined in

[common.ts:819](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L819)

___

### hardforkGteHardfork

▸ **hardforkGteHardfork**(`hardfork1`, `hardfork2`): `boolean`

Sequence based check if given or set HF1 is greater than or equal HF2

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork1` | ``null`` \| `string` | Hardfork name or null (if set) |
| `hardfork2` | `string` | Hardfork name |

#### Returns

`boolean`

True if HF1 gte HF2

#### Defined in

[common.ts:624](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L624)

___

### hardforkIsActiveOnBlock

▸ **hardforkIsActiveOnBlock**(`hardfork`, `blockNumber`): `boolean`

Checks if set or provided hardfork is active on block number

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | ``null`` \| `string` | Hardfork name or null (for HF set) |
| `blockNumber` | `BigIntLike` |  |

#### Returns

`boolean`

True if HF is active on block number

#### Defined in

[common.ts:598](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L598)

___

### hardforkTTD

▸ **hardforkTTD**(`hardfork?`): ``null`` \| `bigint`

Returns the hardfork change total difficulty (Merge HF) for hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `bigint`

Total difficulty or null if no set

#### Defined in

[common.ts:694](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L694)

___

### hardforkTimestamp

▸ **hardforkTimestamp**(`hardfork?`): ``null`` \| `bigint`

#### Parameters

| Name | Type |
| :------ | :------ |
| `hardfork?` | `string` |

#### Returns

``null`` \| `bigint`

#### Defined in

[common.ts:662](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L662)

___

### hardforks

▸ **hardforks**(): [`HardforkTransitionConfig`](../interfaces/HardforkTransitionConfig.md)[]

Returns the hardforks for current chain

#### Returns

[`HardforkTransitionConfig`](../interfaces/HardforkTransitionConfig.md)[]

Array with arrays of hardforks

#### Defined in

[common.ts:855](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L855)

___

### isActivatedEIP

▸ **isActivatedEIP**(`eip`): `boolean`

Checks if an EIP is activated by either being included in the EIPs
manually passed in with the [eips](../interfaces/CommonOpts.md#eips) or in a
hardfork currently being active

Note: this method only works for EIPs being supported
by the [eips](../interfaces/CommonOpts.md#eips) constructor option

#### Parameters

| Name | Type |
| :------ | :------ |
| `eip` | `number` |

#### Returns

`boolean`

#### Defined in

[common.ts:577](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L577)

___

### networkId

▸ **networkId**(): `bigint`

Returns the Id of current network

#### Returns

`bigint`

network Id

#### Defined in

[common.ts:903](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L903)

___

### nextHardforkBlockOrTimestamp

▸ **nextHardforkBlockOrTimestamp**(`hardfork?`): ``null`` \| `bigint`

Returns the change block for the next hardfork after the hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `bigint`

Block timestamp, number or null if not available

#### Defined in

[common.ts:708](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L708)

___

### param

▸ **param**(`topic`, `name`): `bigint`

Returns a parameter for the current chain setup

If the parameter is present in an EIP, the EIP always takes precedence.
Otherwise the parameter if taken from the latest applied HF with
a change on the respective parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
| `name` | `string` | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |

#### Returns

`bigint`

The value requested or `BigInt(0)` if not found

#### Defined in

[common.ts:483](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L483)

___

### paramByBlock

▸ **paramByBlock**(`topic`, `name`, `blockNumber`, `td?`, `timestamp?`): `bigint`

Returns a parameter for the hardfork active on block number or
optional provided total difficulty (Merge HF)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic |
| `name` | `string` | Parameter name |
| `blockNumber` | `BigIntLike` | Block number |
| `td?` | `BigIntLike` | Total difficulty    * |
| `timestamp?` | `BigIntLike` | - |

#### Returns

`bigint`

The value requested or `BigInt(0)` if not found

#### Defined in

[common.ts:557](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L557)

___

### paramByEIP

▸ **paramByEIP**(`topic`, `name`, `eip`): `undefined` \| `bigint`

Returns a parameter corresponding to an EIP

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
| `name` | `string` | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |
| `eip` | `number` | Number of the EIP |

#### Returns

`undefined` \| `bigint`

The value requested or `undefined` if not found

#### Defined in

[common.ts:532](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L532)

___

### paramByHardfork

▸ **paramByHardfork**(`topic`, `name`, `hardfork`): `bigint`

Returns the parameter corresponding to a hardfork

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
| `name` | `string` | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |
| `hardfork` | `string` | Hardfork name |

#### Returns

`bigint`

The value requested or `BigInt(0)` if not found

#### Defined in

[common.ts:501](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L501)

___

### setChain

▸ **setChain**(`chain`): [`ChainConfig`](../interfaces/ChainConfig.md)

Sets the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | `string` \| `number` \| `bigint` \| `object` | String ('mainnet') or Number (1) chain representation.              Or, a Dictionary of chain parameters for a private network. |

#### Returns

[`ChainConfig`](../interfaces/ChainConfig.md)

The dictionary with parameters set as chain

#### Defined in

[common.ts:249](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L249)

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

[common.ts:450](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L450)

___

### setForkHashes

▸ **setForkHashes**(`genesisHash`): `void`

Sets any missing forkHashes on the passed-in [Common](Common.md) instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `genesisHash` | `Uint8Array` | The genesis block hash |

#### Returns

`void`

#### Defined in

[common.ts:831](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L831)

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

[common.ts:280](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L280)

___

### setHardforkBy

▸ **setHardforkBy**(`opts`): `string`

Sets a new hardfork either based on block numer (older HFs) or
timestamp (Shanghai upwards).

An optional TD takes precedence in case the corresponding HF block
is set to `null` or otherwise needs to match (if not an error
will be thrown).

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`HardforkByOpts`](../interfaces/HardforkByOpts.md) |

#### Returns

`string`

The name of the HF set

#### Defined in

[common.ts:427](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L427)

___

### custom

▸ `Static` **custom**(`chainParamsOrName`, `opts?`): [`Common`](Common.md)

Creates a [Common](Common.md) object for a custom chain, based on a standard one.

It uses all the [Chain](../enums/Chain.md) parameters from the baseChain option except the ones overridden
in a provided chainParamsOrName dictionary. Some usage example:

```javascript
Common.custom({chainId: 123})
```

There are also selected supported custom chains which can be initialized by using one of the
CustomChains for chainParamsOrName, e.g.:

```javascript
Common.custom(CustomChains.MaticMumbai)
```

Note that these supported custom chains only provide some base parameters (usually the chain and
network ID and a name) and can only be used for selected use cases (e.g. sending a tx with
the `@ethereumjs/tx` library to a Layer-2 chain).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainParamsOrName` | `Partial`<[`ChainConfig`](../interfaces/ChainConfig.md)\> \| [`CustomChain`](../enums/CustomChain.md) | Custom parameter dict (`name` will default to `custom-chain`) or string with name of a supported custom chain |
| `opts` | [`CustomCommonOpts`](../interfaces/CustomCommonOpts.md) | Custom chain options to set the [baseChain](../interfaces/CustomCommonOpts.md#basechain), selected [hardfork](../interfaces/CustomCommonOpts.md#hardfork) and others |

#### Returns

[`Common`](Common.md)

#### Defined in

[common.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L82)

___

### fromGethGenesis

▸ `Static` **fromGethGenesis**(`genesisJson`, `to`): [`Common`](Common.md)

Static method to load and set common from a geth genesis json

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `genesisJson` | `any` | json of geth configuration |
| `to` | [`GethConfigOpts`](../interfaces/GethConfigOpts.md) | further configure the common instance |

#### Returns

[`Common`](Common.md)

Common

#### Defined in

[common.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L173)

___

### getInitializedChains

▸ `Static` **getInitializedChains**(`customChains?`): [`ChainsConfig`](../interfaces/ChainsConfig.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `customChains?` | [`ChainConfig`](../interfaces/ChainConfig.md)[] |

#### Returns

[`ChainsConfig`](../interfaces/ChainsConfig.md)

#### Defined in

[common.ts:996](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L996)

___

### isSupportedChainId

▸ `Static` **isSupportedChainId**(`chainId`): `boolean`

Static method to determine if a [chainId](Common.md#chainid) is supported as a standard chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | `bigint` | bigint id (`1`) of a standard chain |

#### Returns

`boolean`

boolean

#### Defined in

[common.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L195)
