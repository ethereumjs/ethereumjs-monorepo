[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / Common

# Class: Common

Defined in: [common.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L46)

Common class to access chain and hardfork parameters and to provide
a unified and shared view on the network and hardfork state.

Use [createCustomCommon](../functions/createCustomCommon.md) for simple custom-chain setups and
[createCommonFromGethGenesis](../functions/createCommonFromGethGenesis.md) to build a `Common` instance from a Geth genesis file.
For full control over chain parameters, pass a [ChainConfig](../interfaces/ChainConfig.md) to the constructor below.

## Constructors

### Constructor

> **new Common**(`opts`): `Common`

Defined in: [common.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L67)

Create a `Common` instance for a chain configuration and optional hardfork/EIP overrides.

#### Parameters

##### opts

[`CommonOpts`](../interfaces/CommonOpts.md)

#### Returns

`Common`

## Properties

### customCrypto

> `readonly` **customCrypto**: [`CustomCrypto`](../interfaces/CustomCrypto.md)

Defined in: [common.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L56)

Optional crypto overrides from [BaseOpts.customCrypto](../interfaces/BaseOpts.md#customcrypto).

***

### DEFAULT\_HARDFORK

> `readonly` **DEFAULT\_HARDFORK**: `string`

Defined in: [common.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L48)

Default hardfork from chain config (falls back to [Hardfork.Prague](../variables/Hardfork.md#prague)).

***

### events

> **events**: `EventEmitter`\<[`CommonEvent`](../interfaces/CommonEvent.md)\>

Defined in: [common.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L64)

Emits `hardforkChanged` when the active hardfork updates.

## Methods

### activeOnBlock()

> **activeOnBlock**(`blockNumber`): `boolean`

Defined in: [common.ts:510](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L510)

Alias to hardforkIsActiveOnBlock when hardfork is set

#### Parameters

##### blockNumber

`BigIntLike`

#### Returns

`boolean`

True if HF is active on block number

***

### bootstrapNodes()

> **bootstrapNodes**(): [`BootstrapNodeConfig`](../interfaces/BootstrapNodeConfig.md)[]

Defined in: [common.ts:788](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L788)

Returns bootstrap nodes for the current chain.

#### Returns

[`BootstrapNodeConfig`](../interfaces/BootstrapNodeConfig.md)[]

Array of bootstrap node configs

***

### chainId()

> **chainId**(): `bigint`

Defined in: [common.ts:811](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L811)

Returns the Id of current chain

#### Returns

`bigint`

chain Id

***

### chainName()

> **chainName**(): `string`

Defined in: [common.ts:819](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L819)

Returns the name of current chain

#### Returns

`string`

chain name (lower case)

***

### consensusAlgorithm()

> **consensusAlgorithm**(): `string`

Defined in: [common.ts:860](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L860)

Returns the concrete consensus implementation
algorithm or protocol for the network
e.g. "ethash" for "pow" consensus type,
"clique" for "poa" consensus type or
"casper" for "pos" consensus type.

Note: This value can update along a Hardfork.

#### Returns

`string`

***

### consensusConfig()

> **consensusConfig**(): `object`

Defined in: [common.ts:886](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L886)

Returns a dictionary with consensus configuration
parameters based on the consensus algorithm

Expected returns (parameters must be present in
the respective chain JSON files):

ethash: empty object
clique: period, epoch
casper: empty object

Note: This value can update along a Hardfork.

#### Returns

`object`

***

### consensusType()

> **consensusType**(): `string`

Defined in: [common.ts:838](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L838)

Returns the consensus type of the network
Possible values: "pow"|"poa"|"pos"

Note: This value can update along a Hardfork.

#### Returns

`string`

***

### copy()

> **copy**(): `Common`

Defined in: [common.ts:907](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L907)

Returns a deep copy of this Common instance.

#### Returns

`Common`

***

### dnsNetworks()

> **dnsNetworks**(): `string`[]

Defined in: [common.ts:795](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L795)

Returns DNS ENR URLs for the current chain.

#### Returns

`string`[]

***

### eipBlock()

> **eipBlock**(`eip`): `bigint` \| `null`

Defined in: [common.ts:577](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L577)

Returns the hardfork change block for eip

#### Parameters

##### eip

`number`

EIP number

#### Returns

`bigint` \| `null`

Block number or null if unscheduled

***

### eips()

> **eips**(): `number`[]

Defined in: [common.ts:828](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L828)

Returns the additionally activated EIPs
(by using the `eips` constructor option)

#### Returns

`number`[]

List of EIPs

***

### eipTimestamp()

> **eipTimestamp**(`eip`): `bigint` \| `null`

Defined in: [common.ts:595](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L595)

Returns the scheduled timestamp of the EIP (if scheduled and scheduled by timestamp)

#### Parameters

##### eip

`number`

EIP number

#### Returns

`bigint` \| `null`

Scheduled timestamp. If this EIP is unscheduled, or the EIP is scheduled by block number, then it returns `null`.

***

### forkHash()

> **forkHash**(`hardfork?`, `genesisHash?`): `` `0x${string}` ``

Defined in: [common.ts:711](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L711)

Returns an eth/64 compliant fork hash (EIP-2124)

#### Parameters

##### hardfork?

`string`

Hardfork name, optional if HF set

##### genesisHash?

`Uint8Array`\<`ArrayBufferLike`\>

Genesis block hash of the network, optional if already defined and not needed to be calculated

#### Returns

`` `0x${string}` ``

Fork hash as a hex string

***

### genesis()

> **genesis**(): [`GenesisBlockConfig`](../interfaces/GenesisBlockConfig.md)

Defined in: [common.ts:760](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L760)

Returns the Genesis parameters of the current chain

#### Returns

[`GenesisBlockConfig`](../interfaces/GenesisBlockConfig.md)

Genesis dictionary

***

### getBlobGasSchedule()

> **getBlobGasSchedule**(): [`BpoSchedule`](../type-aliases/BpoSchedule.md)

Defined in: [common.ts:458](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L458)

Returns the blob gas schedule for the current hardfork

#### Returns

[`BpoSchedule`](../type-aliases/BpoSchedule.md)

The blob gas schedule

***

### getHardforkBy()

> **getHardforkBy**(`opts`): `string`

Defined in: [common.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L172)

Returns the hardfork either based on block number (older HFs) or
timestamp (Shanghai upwards).

#### Parameters

##### opts

[`HardforkByOpts`](../interfaces/HardforkByOpts.md)

Block number or timestamp

#### Returns

`string`

The name of the HF

***

### gteHardfork()

> **gteHardfork**(`hardfork`): `boolean`

Defined in: [common.ts:540](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L540)

Alias to hardforkGteHardfork when hardfork is set

#### Parameters

##### hardfork

`string`

Hardfork name

#### Returns

`boolean`

True if hardfork set is greater than hardfork provided

***

### hardfork()

> **hardfork**(): `string`

Defined in: [common.ts:803](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L803)

Returns the hardfork set

#### Returns

`string`

Hardfork name

***

### hardforkBlock()

> **hardforkBlock**(`hardfork?`): `bigint` \| `null`

Defined in: [common.ts:549](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L549)

Returns the hardfork change block for hardfork provided or set

#### Parameters

##### hardfork?

`string`

Hardfork name, optional if HF set

#### Returns

`bigint` \| `null`

Block number or null if unscheduled

***

### hardforkForForkHash()

> **hardforkForForkHash**(`forkHash`): [`HardforkTransitionConfig`](../interfaces/HardforkTransitionConfig.md) \| `null`

Defined in: [common.ts:732](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L732)

Look up the hardfork transition entry for a fork hash.

#### Parameters

##### forkHash

`string`

EIP-2124 fork hash as a hex string

#### Returns

[`HardforkTransitionConfig`](../interfaces/HardforkTransitionConfig.md) \| `null`

The matching transition config, or `null` when unknown

***

### hardforkGteHardfork()

> **hardforkGteHardfork**(`hardfork1`, `hardfork2`): `boolean`

Defined in: [common.ts:520](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L520)

Sequence based check if given or set HF1 is greater than or equal HF2

#### Parameters

##### hardfork1

`string` \| `null`

Hardfork name or null (if set)

##### hardfork2

`string`

Hardfork name

#### Returns

`boolean`

True if HF1 gte HF2

***

### hardforkIsActiveOnBlock()

> **hardforkIsActiveOnBlock**(`hardfork`, `blockNumber`): `boolean`

Defined in: [common.ts:495](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L495)

Checks if set or provided hardfork is active on block number

#### Parameters

##### hardfork

`string` \| `null`

Hardfork name or null (for HF set)

##### blockNumber

`BigIntLike`

#### Returns

`boolean`

True if HF is active on block number

***

### hardforks()

> **hardforks**(): [`HardforkTransitionConfig`](../interfaces/HardforkTransitionConfig.md)[]

Defined in: [common.ts:768](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L768)

Returns the hardfork definitions for the current chain.

#### Returns

[`HardforkTransitionConfig`](../interfaces/HardforkTransitionConfig.md)[]

Array of hardfork transition configs

***

### hardforkTimestamp()

> **hardforkTimestamp**(`hardfork?`): `bigint` \| `null`

Defined in: [common.ts:563](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L563)

Returns the timestamp at which a given hardfork is scheduled (if any).

#### Parameters

##### hardfork?

`string`

Hardfork name, optional if HF set

#### Returns

`bigint` \| `null`

Timestamp or null if the hardfork is not timestamp-based

***

### isActivatedEIP()

> **isActivatedEIP**(`eip`): `boolean`

Defined in: [common.ts:482](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L482)

Checks if an EIP is activated by either being included in the EIPs
manually passed in with the [CommonOpts.eips](../interfaces/BaseOpts.md#eips) or in a
hardfork currently being active

Note: this method only works for EIPs being supported
by the [CommonOpts.eips](../interfaces/BaseOpts.md#eips) constructor option

#### Parameters

##### eip

`number`

#### Returns

`boolean`

***

### nextHardforkBlockOrTimestamp()

> **nextHardforkBlockOrTimestamp**(`hardfork?`): `bigint` \| `null`

Defined in: [common.ts:616](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L616)

Returns the block number or timestamp at which the next hardfork will occur.
For pre-merge hardforks, returns the block number.
For post-merge hardforks, returns the timestamp.
Returns null if there is no next hardfork.

#### Parameters

##### hardfork?

`string`

Hardfork name, optional if HF set

#### Returns

`bigint` \| `null`

Block number or timestamp, or null if not available

***

### param()

> **param**(`name`): `bigint`

Defined in: [common.ts:379](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L379)

Returns a parameter for the current chain setup

If the parameter is present in an EIP, the EIP always takes precedence.
Otherwise the parameter is taken from the latest applied HF with
a change on the respective parameter.

#### Parameters

##### name

`string`

Parameter name (e.g. 'minGasLimit')

#### Returns

`bigint`

The value requested (throws if not found)

***

### paramByBlock()

> **paramByBlock**(`name`, `blockNumber`, `timestamp?`): `bigint`

Defined in: [common.ts:449](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L449)

Returns a parameter for the hardfork active on block number or
optional provided total difficulty (Merge HF)

#### Parameters

##### name

`string`

Parameter name

##### blockNumber

`BigIntLike`

Block number

##### timestamp?

`BigIntLike`

#### Returns

`bigint`

The value requested or `BigInt(0)` if not found

***

### paramByEIP()

> **paramByEIP**(`name`, `eip`): `bigint` \| `undefined`

Defined in: [common.ts:429](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L429)

Returns a parameter corresponding to an EIP

#### Parameters

##### name

`string`

Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic)

##### eip

`number`

Number of the EIP

#### Returns

`bigint` \| `undefined`

The value requested (throws if not found)

***

### paramByHardfork()

> **paramByHardfork**(`name`, `hardfork`): `bigint`

Defined in: [common.ts:395](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L395)

Returns the parameter corresponding to a hardfork

#### Parameters

##### name

`string`

Parameter name (e.g. 'minGasLimit')

##### hardfork

`string`

Hardfork name

#### Returns

`bigint`

The value requested (throws if not found)

***

### resetParams()

> **resetParams**(`params`): `void`

Defined in: [common.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L138)

Fully resets the internal Common EIP params set with the values provided.

Example Format:

```ts
{
  1559: {
    initialBaseFee: 1000000000,
  }
}
```

#### Parameters

##### params

[`ParamsDict`](../type-aliases/ParamsDict.md)

#### Returns

`void`

***

### setEIPs()

> **setEIPs**(`eips?`): `void`

Defined in: [common.ts:278](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L278)

Sets the active EIPs

#### Parameters

##### eips?

`number`[] = `[]`

#### Returns

`void`

***

### setForkHashes()

> **setForkHashes**(`genesisHash`): `void`

Defined in: [common.ts:743](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L743)

Sets any missing forkHashes on this Common instance.

#### Parameters

##### genesisHash

`Uint8Array`

The genesis block hash

#### Returns

`void`

***

### setHardfork()

> **setHardfork**(`hardfork`): `void`

Defined in: [common.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L147)

Sets the hardfork to get params for

#### Parameters

##### hardfork

`string`

String identifier (e.g. 'byzantium') or [Hardfork](../variables/Hardfork.md) enum

#### Returns

`void`

***

### setHardforkBy()

> **setHardforkBy**(`opts`): `string`

Defined in: [common.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L255)

Sets a new hardfork either based on block number (older HFs) or
timestamp (Shanghai upwards).

#### Parameters

##### opts

[`HardforkByOpts`](../interfaces/HardforkByOpts.md)

Block number or timestamp

#### Returns

`string`

The name of the HF set

***

### updateParams()

> **updateParams**(`params`): `void`

Defined in: [common.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L112)

Update the internal Common EIP params set. Existing values
will get preserved unless there is a new value for a parameter
provided with params.

Example Format:

```ts
{
  1559: {
    initialBaseFee: 1000000000,
  }
}
```

#### Parameters

##### params

[`ParamsDict`](../type-aliases/ParamsDict.md)

#### Returns

`void`
