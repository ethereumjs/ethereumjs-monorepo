[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / Common

# Class: Common

Defined in: [common.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L46)

Common class to access chain and hardfork parameters and to provide
a unified and shared view on the network and hardfork state.

A `Common` object can be created with one of the following constructor methods:

* [createCustomCommon](../functions/createCustomCommon.md)
* [createCommonFromGethGenesis](../functions/createCommonFromGethGenesis.md)

## Constructors

### Constructor

> **new Common**(`opts`): `Common`

Defined in: [common.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L63)

#### Parameters

##### opts

[`CommonOpts`](../interfaces/CommonOpts.md)

#### Returns

`Common`

## Properties

### customCrypto

> `readonly` **customCrypto**: [`CustomCrypto`](../interfaces/CustomCrypto.md)

Defined in: [common.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L54)

***

### DEFAULT\_HARDFORK

> `readonly` **DEFAULT\_HARDFORK**: `string`

Defined in: [common.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L47)

***

### events

> **events**: `EventEmitter`\<[`CommonEvent`](../interfaces/CommonEvent.md)\>

Defined in: [common.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L61)

## Methods

### activeOnBlock()

> **activeOnBlock**(`blockNumber`): `boolean`

Defined in: [common.ts:473](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L473)

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

Defined in: [common.ts:730](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L730)

Returns bootstrap nodes for the current chain

#### Returns

[`BootstrapNodeConfig`](../interfaces/BootstrapNodeConfig.md)[]

Dict with bootstrap nodes

***

### chainId()

> **chainId**(): `bigint`

Defined in: [common.ts:754](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L754)

Returns the Id of current chain

#### Returns

`bigint`

chain Id

***

### chainName()

> **chainName**(): `string`

Defined in: [common.ts:762](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L762)

Returns the name of current chain

#### Returns

`string`

chain name (lower case)

***

### consensusAlgorithm()

> **consensusAlgorithm**(): `string`

Defined in: [common.ts:803](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L803)

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

Defined in: [common.ts:829](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L829)

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

Defined in: [common.ts:781](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L781)

Returns the consensus type of the network
Possible values: "pow"|"poa"|"pos"

Note: This value can update along a Hardfork.

#### Returns

`string`

***

### copy()

> **copy**(): `Common`

Defined in: [common.ts:850](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L850)

Returns a deep copy of this Common instance.

#### Returns

`Common`

***

### dnsNetworks()

> **dnsNetworks**(): `string`[]

Defined in: [common.ts:738](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L738)

Returns DNS networks for the current chain

#### Returns

`string`[]

Array of DNS ENR urls

***

### eipBlock()

> **eipBlock**(`eip`): `null` \| `bigint`

Defined in: [common.ts:536](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L536)

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

Defined in: [common.ts:771](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L771)

Returns the additionally activated EIPs
(by using the `eips` constructor option)

#### Returns

`number`[]

List of EIPs

***

### eipTimestamp()

> **eipTimestamp**(`eip`): `null` \| `bigint`

Defined in: [common.ts:554](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L554)

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

> **forkHash**(`hardfork?`, `genesisHash?`): `` `0x${string}` ``

Defined in: [common.ts:661](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L661)

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

***

### genesis()

> **genesis**(): [`GenesisBlockConfig`](../interfaces/GenesisBlockConfig.md)

Defined in: [common.ts:710](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L710)

Returns the Genesis parameters of the current chain

#### Returns

[`GenesisBlockConfig`](../interfaces/GenesisBlockConfig.md)

Genesis dictionary

***

### getHardforkBy()

> **getHardforkBy**(`opts`): `string`

Defined in: [common.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L170)

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

Defined in: [common.ts:504](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L504)

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

Defined in: [common.ts:746](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L746)

Returns the hardfork set

#### Returns

`string`

Hardfork name

***

### hardforkBlock()

> **hardforkBlock**(`hardfork?`): `null` \| `bigint`

Defined in: [common.ts:513](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L513)

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

Defined in: [common.ts:681](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L681)

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

Defined in: [common.ts:484](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L484)

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

Defined in: [common.ts:458](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L458)

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

Defined in: [common.ts:718](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L718)

Returns the hardforks for current chain

#### Returns

[`HardforkTransitionConfig`](../interfaces/HardforkTransitionConfig.md)[]

Array with arrays of hardforks

***

### hardforkTimestamp()

> **hardforkTimestamp**(`hardfork?`): `null` \| `bigint`

Defined in: [common.ts:522](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L522)

#### Parameters

##### hardfork?

`string`

#### Returns

`null` \| `bigint`

***

### isActivatedEIP()

> **isActivatedEIP**(`eip`): `boolean`

Defined in: [common.ts:445](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L445)

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

> **nextHardforkBlockOrTimestamp**(`hardfork?`): `null` \| `bigint`

Defined in: [common.ts:572](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L572)

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

Defined in: [common.ts:361](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L361)

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

Defined in: [common.ts:431](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L431)

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

Defined in: [common.ts:411](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L411)

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

Defined in: [common.ts:377](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L377)

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

Defined in: [common.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L136)

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

Defined in: [common.ts:276](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L276)

Sets the active EIPs

#### Parameters

##### eips

`number`[] = `[]`

#### Returns

`void`

***

### setForkHashes()

> **setForkHashes**(`genesisHash`): `void`

Defined in: [common.ts:693](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L693)

Sets any missing forkHashes on the passed-in Common instance

#### Parameters

##### genesisHash

`Uint8Array`

The genesis block hash

#### Returns

`void`

***

### setHardfork()

> **setHardfork**(`hardfork`): `void`

Defined in: [common.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L145)

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

Defined in: [common.ts:253](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L253)

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

Defined in: [common.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L109)

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
