[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / Common

# Class: Common

Defined in: [common.ts:44](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L44)

Common class to access chain and hardfork parameters and to provide
a unified and shared view on the network and hardfork state.

Use the Common.custom static constructor for creating simple
custom chain [Common](Common.md) objects (more complete custom chain setups
can be created via the main constructor).

## Constructors

### new Common()

> **new Common**(`opts`): [`Common`](Common.md)

Defined in: [common.ts:61](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L61)

#### Parameters

##### opts

[`CommonOpts`](../interfaces/CommonOpts.md)

#### Returns

[`Common`](Common.md)

## Properties

### customCrypto

> `readonly` **customCrypto**: [`CustomCrypto`](../interfaces/CustomCrypto.md)

Defined in: [common.ts:52](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L52)

***

### DEFAULT\_HARDFORK

> `readonly` **DEFAULT\_HARDFORK**: `string`

Defined in: [common.ts:45](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L45)

***

### events

> **events**: `EventEmitter`\<[`CommonEvent`](../interfaces/CommonEvent.md)\>

Defined in: [common.ts:59](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L59)

## Methods

### activeOnBlock()

> **activeOnBlock**(`blockNumber`): `boolean`

Defined in: [common.ts:469](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L469)

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

Defined in: [common.ts:725](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L725)

Returns bootstrap nodes for the current chain

#### Returns

[`BootstrapNodeConfig`](../interfaces/BootstrapNodeConfig.md)[]

Dict with bootstrap nodes

***

### chainId()

> **chainId**(): `bigint`

Defined in: [common.ts:749](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L749)

Returns the Id of current chain

#### Returns

`bigint`

chain Id

***

### chainName()

> **chainName**(): `string`

Defined in: [common.ts:757](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L757)

Returns the name of current chain

#### Returns

`string`

chain name (lower case)

***

### consensusAlgorithm()

> **consensusAlgorithm**(): `string`

Defined in: [common.ts:798](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L798)

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

Defined in: [common.ts:824](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L824)

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

Defined in: [common.ts:776](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L776)

Returns the consensus type of the network
Possible values: "pow"|"poa"|"pos"

Note: This value can update along a Hardfork.

#### Returns

`string`

***

### copy()

> **copy**(): [`Common`](Common.md)

Defined in: [common.ts:845](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L845)

Returns a deep copy of this [Common](Common.md) instance.

#### Returns

[`Common`](Common.md)

***

### dnsNetworks()

> **dnsNetworks**(): `string`[]

Defined in: [common.ts:733](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L733)

Returns DNS networks for the current chain

#### Returns

`string`[]

Array of DNS ENR urls

***

### eipBlock()

> **eipBlock**(`eip`): `null` \| `bigint`

Defined in: [common.ts:532](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L532)

Returns the hardfork change block for eip

#### Parameters

##### eip

`number`

EIP number

#### Returns

`null` \| `bigint`

Block number or null if unscheduled

***

### eips()

> **eips**(): `number`[]

Defined in: [common.ts:766](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L766)

Returns the additionally activated EIPs
(by using the `eips` constructor option)

#### Returns

`number`[]

List of EIPs

***

### eipTimestamp()

> **eipTimestamp**(`eip`): `null` \| `bigint`

Defined in: [common.ts:550](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L550)

Returns the scheduled timestamp of the EIP (if scheduled and scheduled by timestamp)

#### Parameters

##### eip

`number`

EIP number

#### Returns

`null` \| `bigint`

Scheduled timestamp. If this EIP is unscheduled, or the EIP is scheduled by block number, then it returns `null`.

***

### forkHash()

> **forkHash**(`hardfork`?, `genesisHash`?): `` `0x${string}` ``

Defined in: [common.ts:657](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L657)

Returns an eth/64 compliant fork hash (EIP-2124)

#### Parameters

##### hardfork?

`string`

Hardfork name, optional if HF set

##### genesisHash?

`Uint8Array`

Genesis block hash of the network, optional if already defined and not needed to be calculated

#### Returns

`` `0x${string}` ``

***

### genesis()

> **genesis**(): [`GenesisBlockConfig`](../interfaces/GenesisBlockConfig.md)

Defined in: [common.ts:705](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L705)

Returns the Genesis parameters of the current chain

#### Returns

[`GenesisBlockConfig`](../interfaces/GenesisBlockConfig.md)

Genesis dictionary

***

### getHardforkBy()

> **getHardforkBy**(`opts`): `string`

Defined in: [common.ts:168](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L168)

Returns the hardfork either based on block number (older HFs) or
timestamp (Shanghai upwards).

#### Parameters

##### opts

[`HardforkByOpts`](../interfaces/HardforkByOpts.md)

#### Returns

`string`

The name of the HF

***

### gteHardfork()

> **gteHardfork**(`hardfork`): `boolean`

Defined in: [common.ts:500](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L500)

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

Defined in: [common.ts:741](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L741)

Returns the hardfork set

#### Returns

`string`

Hardfork name

***

### hardforkBlock()

> **hardforkBlock**(`hardfork`?): `null` \| `bigint`

Defined in: [common.ts:509](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L509)

Returns the hardfork change block for hardfork provided or set

#### Parameters

##### hardfork?

`string`

Hardfork name, optional if HF set

#### Returns

`null` \| `bigint`

Block number or null if unscheduled

***

### hardforkForForkHash()

> **hardforkForForkHash**(`forkHash`): `null` \| [`HardforkTransitionConfig`](../interfaces/HardforkTransitionConfig.md)

Defined in: [common.ts:676](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L676)

#### Parameters

##### forkHash

`string`

Fork hash as a hex string

#### Returns

`null` \| [`HardforkTransitionConfig`](../interfaces/HardforkTransitionConfig.md)

Array with hardfork data (name, block, forkHash)

***

### hardforkGteHardfork()

> **hardforkGteHardfork**(`hardfork1`, `hardfork2`): `boolean`

Defined in: [common.ts:480](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L480)

Sequence based check if given or set HF1 is greater than or equal HF2

#### Parameters

##### hardfork1

Hardfork name or null (if set)

`null` | `string`

##### hardfork2

`string`

Hardfork name

#### Returns

`boolean`

True if HF1 gte HF2

***

### hardforkIsActiveOnBlock()

> **hardforkIsActiveOnBlock**(`hardfork`, `blockNumber`): `boolean`

Defined in: [common.ts:454](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L454)

Checks if set or provided hardfork is active on block number

#### Parameters

##### hardfork

Hardfork name or null (for HF set)

`null` | `string`

##### blockNumber

`BigIntLike`

#### Returns

`boolean`

True if HF is active on block number

***

### hardforks()

> **hardforks**(): [`HardforkTransitionConfig`](../interfaces/HardforkTransitionConfig.md)[]

Defined in: [common.ts:713](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L713)

Returns the hardforks for current chain

#### Returns

[`HardforkTransitionConfig`](../interfaces/HardforkTransitionConfig.md)[]

Array with arrays of hardforks

***

### hardforkTimestamp()

> **hardforkTimestamp**(`hardfork`?): `null` \| `bigint`

Defined in: [common.ts:518](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L518)

#### Parameters

##### hardfork?

`string`

#### Returns

`null` \| `bigint`

***

### isActivatedEIP()

> **isActivatedEIP**(`eip`): `boolean`

Defined in: [common.ts:441](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L441)

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

> **nextHardforkBlockOrTimestamp**(`hardfork`?): `null` \| `bigint`

Defined in: [common.ts:568](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L568)

Returns the change block for the next hardfork after the hardfork provided or set

#### Parameters

##### hardfork?

`string`

Hardfork name, optional if HF set

#### Returns

`null` \| `bigint`

Block timestamp, number or null if not available

***

### param()

> **param**(`name`): `bigint`

Defined in: [common.ts:357](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L357)

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

> **paramByBlock**(`name`, `blockNumber`, `timestamp`?): `bigint`

Defined in: [common.ts:427](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L427)

Returns a parameter for the hardfork active on block number or
optional provided total difficulty (Merge HF)

#### Parameters

##### name

`string`

Parameter name

##### blockNumber

`BigIntLike`

Block number
   *

##### timestamp?

`BigIntLike`

#### Returns

`bigint`

The value requested or `BigInt(0)` if not found

***

### paramByEIP()

> **paramByEIP**(`name`, `eip`): `undefined` \| `bigint`

Defined in: [common.ts:407](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L407)

Returns a parameter corresponding to an EIP

#### Parameters

##### name

`string`

Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic)

##### eip

`number`

Number of the EIP

#### Returns

`undefined` \| `bigint`

The value requested (throws if not found)

***

### paramByHardfork()

> **paramByHardfork**(`name`, `hardfork`): `bigint`

Defined in: [common.ts:373](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L373)

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

Defined in: [common.ts:134](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L134)

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

> **setEIPs**(`eips`): `void`

Defined in: [common.ts:274](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L274)

Sets the active EIPs

#### Parameters

##### eips

`number`[] = `[]`

#### Returns

`void`

***

### setForkHashes()

> **setForkHashes**(`genesisHash`): `void`

Defined in: [common.ts:688](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L688)

Sets any missing forkHashes on the passed-in [Common](Common.md) instance

#### Parameters

##### genesisHash

`Uint8Array`

The genesis block hash

#### Returns

`void`

***

### setHardfork()

> **setHardfork**(`hardfork`): `void`

Defined in: [common.ts:143](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L143)

Sets the hardfork to get params for

#### Parameters

##### hardfork

`string`

String identifier (e.g. 'byzantium') or [Hardfork](../enumerations/Hardfork.md) enum

#### Returns

`void`

***

### setHardforkBy()

> **setHardforkBy**(`opts`): `string`

Defined in: [common.ts:251](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L251)

Sets a new hardfork either based on block number (older HFs) or
timestamp (Shanghai upwards).

#### Parameters

##### opts

[`HardforkByOpts`](../interfaces/HardforkByOpts.md)

#### Returns

`string`

The name of the HF set

***

### updateParams()

> **updateParams**(`params`): `void`

Defined in: [common.ts:107](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L107)

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
