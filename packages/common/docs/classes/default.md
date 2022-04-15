[@ethereumjs/common](../README.md) / default

# Class: default

Common class to access chain and hardfork parameters and to provide
a unified and shared view on the network and hardfork state.

Use the {@link Common.custom} static constructor for creating simple
custom chain {@link Common} objects (more complete custom chain setups
can be created via the main constructor and the [CommonOpts.customChains](../interfaces/CommonOpts.md#customchains) parameter).

## Hierarchy

- `EventEmitter`

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [DEFAULT\_HARDFORK](default.md#default_hardfork)
- [captureRejectionSymbol](default.md#capturerejectionsymbol)
- [captureRejections](default.md#capturerejections)
- [defaultMaxListeners](default.md#defaultmaxlisteners)
- [errorMonitor](default.md#errormonitor)

### Methods

- [\_calcForkHash](default.md#_calcforkhash)
- [\_chooseHardfork](default.md#_choosehardfork)
- [\_getHardfork](default.md#_gethardfork)
- [\_isSupportedHardfork](default.md#_issupportedhardfork)
- [activeHardfork](default.md#activehardfork)
- [activeHardforks](default.md#activehardforks)
- [activeOnBlock](default.md#activeonblock)
- [addListener](default.md#addlistener)
- [bootstrapNodes](default.md#bootstrapnodes)
- [chainId](default.md#chainid)
- [chainIdBN](default.md#chainidbn)
- [chainName](default.md#chainname)
- [consensusAlgorithm](default.md#consensusalgorithm)
- [consensusConfig](default.md#consensusconfig)
- [consensusType](default.md#consensustype)
- [copy](default.md#copy)
- [dnsNetworks](default.md#dnsnetworks)
- [eips](default.md#eips)
- [emit](default.md#emit)
- [eventNames](default.md#eventnames)
- [forkHash](default.md#forkhash)
- [genesis](default.md#genesis)
- [genesisState](default.md#genesisstate)
- [getHardforkByBlockNumber](default.md#gethardforkbyblocknumber)
- [getMaxListeners](default.md#getmaxlisteners)
- [gteHardfork](default.md#gtehardfork)
- [hardfork](default.md#hardfork)
- [hardforkBlock](default.md#hardforkblock)
- [hardforkBlockBN](default.md#hardforkblockbn)
- [hardforkForForkHash](default.md#hardforkforforkhash)
- [hardforkGteHardfork](default.md#hardforkgtehardfork)
- [hardforkIsActiveOnBlock](default.md#hardforkisactiveonblock)
- [hardforkIsActiveOnChain](default.md#hardforkisactiveonchain)
- [hardforkTD](default.md#hardforktd)
- [hardforks](default.md#hardforks)
- [isActivatedEIP](default.md#isactivatedeip)
- [isHardforkBlock](default.md#ishardforkblock)
- [isNextHardforkBlock](default.md#isnexthardforkblock)
- [listenerCount](default.md#listenercount)
- [listeners](default.md#listeners)
- [networkId](default.md#networkid)
- [networkIdBN](default.md#networkidbn)
- [nextHardforkBlock](default.md#nexthardforkblock)
- [nextHardforkBlockBN](default.md#nexthardforkblockbn)
- [off](default.md#off)
- [on](default.md#on)
- [once](default.md#once)
- [param](default.md#param)
- [paramByBlock](default.md#parambyblock)
- [paramByEIP](default.md#parambyeip)
- [paramByHardfork](default.md#parambyhardfork)
- [prependListener](default.md#prependlistener)
- [prependOnceListener](default.md#prependoncelistener)
- [rawListeners](default.md#rawlisteners)
- [removeAllListeners](default.md#removealllisteners)
- [removeListener](default.md#removelistener)
- [setChain](default.md#setchain)
- [setEIPs](default.md#seteips)
- [setHardfork](default.md#sethardfork)
- [setHardforkByBlockNumber](default.md#sethardforkbyblocknumber)
- [setMaxListeners](default.md#setmaxlisteners)
- [custom](default.md#custom)
- [forCustomChain](default.md#forcustomchain)
- [getEventListeners](default.md#geteventlisteners)
- [isSupportedChainId](default.md#issupportedchainid)
- [listenerCount](default.md#listenercount)
- [on](default.md#on)
- [once](default.md#once)

## Constructors

### constructor

• **new default**(`opts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`CommonOpts`](../interfaces/CommonOpts.md) |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/common/src/index.ts:384](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L384)

## Properties

### DEFAULT\_HARDFORK

• `Readonly` **DEFAULT\_HARDFORK**: `string`

#### Defined in

[packages/common/src/index.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L200)

___

### captureRejectionSymbol

▪ `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](default.md#capturerejectionsymbol)

#### Inherited from

EventEmitter.captureRejectionSymbol

#### Defined in

node_modules/@types/node/events.d.ts:273

___

### captureRejections

▪ `Static` **captureRejections**: `boolean`

Sets or gets the default captureRejection value for all emitters.

#### Inherited from

EventEmitter.captureRejections

#### Defined in

node_modules/@types/node/events.d.ts:278

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:279

___

### errorMonitor

▪ `Static` `Readonly` **errorMonitor**: typeof [`errorMonitor`](default.md#errormonitor)

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

#### Inherited from

EventEmitter.errorMonitor

#### Defined in

node_modules/@types/node/events.d.ts:272

## Methods

### \_calcForkHash

▸ **_calcForkHash**(`hardfork`): `string`

Internal helper function to calculate a fork hash

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | `string` | Hardfork name |

#### Returns

`string`

Fork hash as hex string

#### Defined in

[packages/common/src/index.ts:964](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L964)

___

### \_chooseHardfork

▸ **_chooseHardfork**(`hardfork?`, `onlySupported?`): `string`

Internal helper function to choose between hardfork set and hardfork provided as param

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `hardfork?` | ``null`` \| `string` | `undefined` | Hardfork given to function as a parameter |
| `onlySupported` | `boolean` | `true` | - |

#### Returns

`string`

Hardfork chosen to be used

#### Defined in

[packages/common/src/index.ts:553](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L553)

___

### \_getHardfork

▸ **_getHardfork**(`hardfork`): `any`

Internal helper function, returns the params for the given hardfork for the chain set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | `string` | Hardfork name |

#### Returns

`any`

Dictionary with hardfork params

#### Defined in

[packages/common/src/index.ts:567](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L567)

___

### \_isSupportedHardfork

▸ **_isSupportedHardfork**(`hardfork`): `boolean`

Internal helper function to check if a hardfork is set to be supported by the library

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | ``null`` \| `string` | Hardfork name |

#### Returns

`boolean`

True if hardfork is supported

#### Defined in

[packages/common/src/index.ts:580](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L580)

___

### activeHardfork

▸ **activeHardfork**(`blockNumber?`, `opts?`): `string`

Returns the latest active hardfork name for chain or block or throws if unavailable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber?` | ``null`` \| `BNLike` | up to block if provided, otherwise for the whole chain |
| `opts` | `hardforkOptions` | Hardfork options (onlyActive unused) |

#### Returns

`string`

Hardfork name

#### Defined in

[packages/common/src/index.ts:851](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L851)

___

### activeHardforks

▸ **activeHardforks**(`blockNumber?`, `opts?`): `Hardfork`[]

Returns the active hardfork switches for the current chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber?` | ``null`` \| `BNLike` | up to block if provided, otherwise for the whole chain |
| `opts` | `hardforkOptions` | Hardfork options (onlyActive unused) |

#### Returns

`Hardfork`[]

Array with hardfork arrays

#### Defined in

[packages/common/src/index.ts:832](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L832)

___

### activeOnBlock

▸ **activeOnBlock**(`blockNumber`, `opts?`): `boolean`

Alias to hardforkIsActiveOnBlock when hardfork is set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber` | `BNLike` |  |
| `opts?` | `hardforkOptions` | Hardfork options (onlyActive unused) |

#### Returns

`boolean`

True if HF is active on block number

#### Defined in

[packages/common/src/index.ts:761](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L761)

___

### addListener

▸ **addListener**(`eventName`, `listener`): [`default`](default.md)

Alias for `emitter.on(eventName, listener)`.

**`since`** v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`default`](default.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/events.d.ts:299

___

### bootstrapNodes

▸ **bootstrapNodes**(): `BootstrapNode`[]

Returns bootstrap nodes for the current chain

#### Returns

`BootstrapNode`[]

Dict with bootstrap nodes

#### Defined in

[packages/common/src/index.ts:1080](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1080)

___

### chainId

▸ **chainId**(): `number`

Returns the Id of current chain

**`deprecated`** Please use {@link Common.chainIdBN} for large number support

#### Returns

`number`

chain Id

#### Defined in

[packages/common/src/index.ts:1105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1105)

___

### chainIdBN

▸ **chainIdBN**(): `BN`

Returns the Id of current chain

#### Returns

`BN`

chain Id

#### Defined in

[packages/common/src/index.ts:1113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1113)

___

### chainName

▸ **chainName**(): `string`

Returns the name of current chain

#### Returns

`string`

chain name (lower case)

#### Defined in

[packages/common/src/index.ts:1121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1121)

___

### consensusAlgorithm

▸ **consensusAlgorithm**(): `string`

Returns the concrete consensus implementation
algorithm or protocol for the network
e.g. "ethash" for "pow" consensus type,
"clique" for "poa" consensus type or
"casper" for "pos" consensus type.

Note: This value can update along a hardfork.

#### Returns

`string`

#### Defined in

[packages/common/src/index.ts:1181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1181)

___

### consensusConfig

▸ **consensusConfig**(): `Object`

Returns a dictionary with consensus configuration
parameters based on the consensus algorithm

Expected returns (parameters must be present in
the respective chain json files):

ethash: -
clique: period, epoch
aura: -
casper: -

Note: This value can update along a hardfork.

#### Returns

`Object`

#### Defined in

[packages/common/src/index.ts:1211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1211)

___

### consensusType

▸ **consensusType**(): `string`

Returns the consensus type of the network
Possible values: "pow"|"poa"|"pos"

Note: This value can update along a hardfork.

#### Returns

`string`

#### Defined in

[packages/common/src/index.ts:1156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1156)

___

### copy

▸ **copy**(): [`default`](default.md)

Returns a deep copy of this {@link Common} instance.

#### Returns

[`default`](default.md)

#### Defined in

[packages/common/src/index.ts:1232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1232)

___

### dnsNetworks

▸ **dnsNetworks**(): `string`[]

Returns DNS networks for the current chain

#### Returns

`string`[]

Array of DNS ENR urls

#### Defined in

[packages/common/src/index.ts:1088](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1088)

___

### eips

▸ **eips**(): `number`[]

Returns the active EIPs

#### Returns

`number`[]

List of EIPs

#### Defined in

[packages/common/src/index.ts:1146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1146)

___

### emit

▸ **emit**(`eventName`, ...`args`): `boolean`

Synchronously calls each of the listeners registered for the event named`eventName`, in the order they were registered, passing the supplied arguments
to each.

Returns `true` if the event had listeners, `false` otherwise.

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

**`since`** v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Inherited from

EventEmitter.emit

#### Defined in

node_modules/@types/node/events.d.ts:555

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

Returns an array listing the events for which the emitter has registered
listeners. The values in the array are strings or `Symbol`s.

```js
const EventEmitter = require('events');
const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

**`since`** v6.0.0

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/@types/node/events.d.ts:614

___

### forkHash

▸ **forkHash**(`hardfork?`): `any`

Returns an eth/64 compliant fork hash (EIP-2124)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

`any`

#### Defined in

[packages/common/src/index.ts:996](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L996)

___

### genesis

▸ **genesis**(): `GenesisBlock`

Returns the Genesis parameters of the current chain

#### Returns

`GenesisBlock`

Genesis dictionary

#### Defined in

[packages/common/src/index.ts:1025](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1025)

___

### genesisState

▸ **genesisState**(): `GenesisState`

Returns the Genesis state of the current chain,
all values are provided as hex-prefixed strings.

#### Returns

`GenesisState`

#### Defined in

[packages/common/src/index.ts:1033](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1033)

___

### getHardforkByBlockNumber

▸ **getHardforkByBlockNumber**(`blockNumber`, `td?`): `string`

Returns the hardfork based on the block number or an optional
total difficulty (Merge HF) provided.

An optional TD takes precedence in case the corresponding HF block
is set to `null` or otherwise needs to match (if not an error
will be thrown).

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `BNLike` |
| `td?` | `BNLike` |

#### Returns

`string`

The name of the HF

#### Defined in

[packages/common/src/index.ts:480](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L480)

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to [defaultMaxListeners](default.md#defaultmaxlisteners).

**`since`** v1.0.0

#### Returns

`number`

#### Inherited from

EventEmitter.getMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:471

___

### gteHardfork

▸ **gteHardfork**(`hardfork`, `opts?`): `boolean`

Alias to hardforkGteHardfork when hardfork is set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | `string` | Hardfork name |
| `opts?` | `hardforkOptions` | Hardfork options |

#### Returns

`boolean`

True if hardfork set is greater than hardfork provided

#### Defined in

[packages/common/src/index.ts:804](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L804)

___

### hardfork

▸ **hardfork**(): `string`

Returns the hardfork set

#### Returns

`string`

Hardfork name

#### Defined in

[packages/common/src/index.ts:1096](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1096)

___

### hardforkBlock

▸ **hardforkBlock**(`hardfork?`): ``null`` \| `number`

Returns the hardfork change block for hardfork provided or set

**`deprecated`** Please use {@link Common.hardforkBlockBN} for large number support

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `number`

Block number or null if unscheduled

#### Defined in

[packages/common/src/index.ts:866](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L866)

___

### hardforkBlockBN

▸ **hardforkBlockBN**(`hardfork?`): ``null`` \| `BN`

Returns the hardfork change block for hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `BN`

Block number or null if unscheduled

#### Defined in

[packages/common/src/index.ts:876](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L876)

___

### hardforkForForkHash

▸ **hardforkForForkHash**(`forkHash`): `any`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `forkHash` | `string` | Fork hash as a hex string |

#### Returns

`any`

Array with hardfork data (name, block, forkHash)

#### Defined in

[packages/common/src/index.ts:1014](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1014)

___

### hardforkGteHardfork

▸ **hardforkGteHardfork**(`hardfork1`, `hardfork2`, `opts?`): `boolean`

Sequence based check if given or set HF1 is greater than or equal HF2

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork1` | ``null`` \| `string` | Hardfork name or null (if set) |
| `hardfork2` | `string` | Hardfork name |
| `opts` | `hardforkOptions` | Hardfork options |

#### Returns

`boolean`

True if HF1 gte HF2

#### Defined in

[packages/common/src/index.ts:772](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L772)

___

### hardforkIsActiveOnBlock

▸ **hardforkIsActiveOnBlock**(`hardfork`, `blockNumber`, `opts?`): `boolean`

Checks if set or provided hardfork is active on block number

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | ``null`` \| `string` | Hardfork name or null (for HF set) |
| `blockNumber` | `BNLike` |  |
| `opts` | `hardforkOptions` | Hardfork options (onlyActive unused) |

#### Returns

`boolean`

True if HF is active on block number

#### Defined in

[packages/common/src/index.ts:740](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L740)

___

### hardforkIsActiveOnChain

▸ **hardforkIsActiveOnChain**(`hardfork?`, `opts?`): `boolean`

Checks if given or set hardfork is active on the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | ``null`` \| `string` | Hardfork name, optional if HF set |
| `opts` | `hardforkOptions` | Hardfork options (onlyActive unused) |

#### Returns

`boolean`

True if hardfork is active on the chain

#### Defined in

[packages/common/src/index.ts:814](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L814)

___

### hardforkTD

▸ **hardforkTD**(`hardfork?`): ``null`` \| `BN`

Returns the hardfork change total difficulty (Merge HF) for hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `BN`

Total difficulty or null if no set

#### Defined in

[packages/common/src/index.ts:890](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L890)

___

### hardforks

▸ **hardforks**(): `Hardfork`[]

Returns the hardforks for current chain

#### Returns

`Hardfork`[]

Array with arrays of hardforks

#### Defined in

[packages/common/src/index.ts:1072](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1072)

___

### isActivatedEIP

▸ **isActivatedEIP**(`eip`): `boolean`

Checks if an EIP is activated by either being included in the EIPs
manually passed in with the [CommonOpts.eips](../interfaces/CommonOpts.md#eips) or in a
hardfork currently being active

Note: this method only works for EIPs being supported
by the [CommonOpts.eips](../interfaces/CommonOpts.md#eips) constructor option

#### Parameters

| Name | Type |
| :------ | :------ |
| `eip` | `number` |

#### Returns

`boolean`

#### Defined in

[packages/common/src/index.ts:718](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L718)

___

### isHardforkBlock

▸ **isHardforkBlock**(`blockNumber`, `hardfork?`): `boolean`

True if block number provided is the hardfork (given or set) change block

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber` | `BNLike` | Number of the block to check |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

`boolean`

True if blockNumber is HF block

#### Defined in

[packages/common/src/index.ts:905](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L905)

___

### isNextHardforkBlock

▸ **isNextHardforkBlock**(`blockNumber`, `hardfork?`): `boolean`

True if block number provided is the hardfork change block following the hardfork given or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber` | `BNLike` | Number of the block to check |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

`boolean`

True if blockNumber is HF block

#### Defined in

[packages/common/src/index.ts:951](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L951)

___

### listenerCount

▸ **listenerCount**(`eventName`): `number`

Returns the number of listeners listening to the event named `eventName`.

**`since`** v3.2.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event being listened for |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:561

___

### listeners

▸ **listeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

**`since`** v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.listeners

#### Defined in

node_modules/@types/node/events.d.ts:484

___

### networkId

▸ **networkId**(): `number`

Returns the Id of current network

**`deprecated`** Please use {@link Common.networkIdBN} for large number support

#### Returns

`number`

network Id

#### Defined in

[packages/common/src/index.ts:1130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1130)

___

### networkIdBN

▸ **networkIdBN**(): `BN`

Returns the Id of current network

#### Returns

`BN`

network Id

#### Defined in

[packages/common/src/index.ts:1138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L1138)

___

### nextHardforkBlock

▸ **nextHardforkBlock**(`hardfork?`): ``null`` \| `number`

Returns the change block for the next hardfork after the hardfork provided or set

**`deprecated`** Please use {@link Common.nextHardforkBlockBN} for large number support

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `number`

Block number or null if not available

#### Defined in

[packages/common/src/index.ts:918](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L918)

___

### nextHardforkBlockBN

▸ **nextHardforkBlockBN**(`hardfork?`): ``null`` \| `BN`

Returns the change block for the next hardfork after the hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `BN`

Block number or null if not available

#### Defined in

[packages/common/src/index.ts:928](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L928)

___

### off

▸ **off**(`eventName`, `listener`): [`default`](default.md)

Alias for `emitter.removeListener()`.

**`since`** v10.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`default`](default.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/events.d.ts:444

___

### on

▸ **on**(`eventName`, `listener`): [`default`](default.md)

Adds the `listener` function to the end of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The`emitter.prependListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

**`since`** v0.1.101

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`default`](default.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:330

___

### once

▸ **once**(`eventName`, `listener`): [`default`](default.md)

Adds a **one-time**`listener` function for the event named `eventName`. The
next time `eventName` is triggered, this listener is removed and then invoked.

```js
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The`emitter.prependOnceListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

**`since`** v0.3.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`default`](default.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:359

___

### param

▸ **param**(`topic`, `name`): `any`

Returns a parameter for the current chain setup

If the parameter is present in an EIP, the EIP always takes precendence.
Otherwise the parameter if taken from the latest applied HF with
a change on the respective parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
| `name` | `string` | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |

#### Returns

`any`

The value requested or `null` if not found

#### Defined in

[packages/common/src/index.ts:628](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L628)

___

### paramByBlock

▸ **paramByBlock**(`topic`, `name`, `blockNumber`): `any`

Returns a parameter for the hardfork active on block number

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic |
| `name` | `string` | Parameter name |
| `blockNumber` | `BNLike` | Block number |

#### Returns

`any`

#### Defined in

[packages/common/src/index.ts:703](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L703)

___

### paramByEIP

▸ **paramByEIP**(`topic`, `name`, `eip`): `any`

Returns a parameter corresponding to an EIP

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
| `name` | `string` | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |
| `eip` | `number` | Number of the EIP |

#### Returns

`any`

The value requested or `null` if not found

#### Defined in

[packages/common/src/index.ts:681](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L681)

___

### paramByHardfork

▸ **paramByHardfork**(`topic`, `name`, `hardfork`): `any`

Returns the parameter corresponding to a hardfork

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow') |
| `name` | `string` | Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic) |
| `hardfork` | `string` | Hardfork name |

#### Returns

`any`

The value requested or `null` if not found

#### Defined in

[packages/common/src/index.ts:648](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L648)

___

### prependListener

▸ **prependListener**(`eventName`, `listener`): [`default`](default.md)

Adds the `listener` function to the _beginning_ of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`since`** v6.0.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`default`](default.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/events.d.ts:579

___

### prependOnceListener

▸ **prependOnceListener**(`eventName`, `listener`): [`default`](default.md)

Adds a **one-time**`listener` function for the event named `eventName` to the_beginning_ of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`since`** v6.0.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`default`](default.md)

#### Inherited from

EventEmitter.prependOnceListener

#### Defined in

node_modules/@types/node/events.d.ts:595

___

### rawListeners

▸ **rawListeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

**`since`** v9.4.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.rawListeners

#### Defined in

node_modules/@types/node/events.d.ts:514

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`default`](default.md)

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`since`** v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`default`](default.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/events.d.ts:455

___

### removeListener

▸ **removeListener**(`eventName`, `listener`): [`default`](default.md)

Removes the specified `listener` from the listener array for the event named`eventName`.

```js
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

`removeListener()` will remove, at most, one instance of a listener from the
listener array. If any single listener has been added multiple times to the
listener array for the specified `eventName`, then `removeListener()` must be
called multiple times to remove each instance.

Once an event is emitted, all listeners attached to it at the
time of emitting are called in order. This implies that any`removeListener()` or `removeAllListeners()` calls _after_ emitting and_before_ the last listener finishes execution will
not remove them from`emit()` in progress. Subsequent events behave as expected.

```js
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

Because listeners are managed using an internal array, calling this will
change the position indices of any listener registered _after_ the listener
being removed. This will not impact the order in which listeners are called,
but it means that any copies of the listener array as returned by
the `emitter.listeners()` method will need to be recreated.

When a single function has been added as a handler multiple times for a single
event (as in the example below), `removeListener()` will remove the most
recently added instance. In the example the `once('ping')`listener is removed:

```js
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`since`** v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`default`](default.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/events.d.ts:439

___

### setChain

▸ **setChain**(`chain`): `any`

Sets the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | `string` \| `number` \| `object` \| `BN` | String ('mainnet') or Number (1) chain     representation. Or, a Dictionary of chain parameters for a private network. |

#### Returns

`any`

The dictionary with parameters set as chain

#### Defined in

[packages/common/src/index.ts:412](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L412)

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

[packages/common/src/index.ts:595](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L595)

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

[packages/common/src/index.ts:449](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L449)

___

### setHardforkByBlockNumber

▸ **setHardforkByBlockNumber**(`blockNumber`, `td?`): `string`

Sets a new hardfork based on the block number or an optional
total difficulty (Merge HF) provided.

An optional TD takes precedence in case the corresponding HF block
is set to `null` or otherwise needs to match (if not an error
will be thrown).

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `BNLike` |
| `td?` | `BNLike` |

#### Returns

`string`

The name of the HF set

#### Defined in

[packages/common/src/index.ts:542](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L542)

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`default`](default.md)

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to`Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`since`** v0.3.5

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`default`](default.md)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:465

___

### custom

▸ `Static` **custom**(`chainParamsOrName`, `opts?`): [`default`](default.md)

Creates a {@link Common} object for a custom chain, based on a standard one.

It uses all the [Chain](../enums/Chain.md) parameters from the [baseChain](../interfaces/CustomCommonOpts.md#basechain) option except the ones overridden
in a provided {@link chainParamsOrName} dictionary. Some usage example:

```javascript
Common.custom({chainId: 123})
```

There are also selected supported custom chains which can be initialized by using one of the
{@link CustomChains} for {@link chainParamsOrName}, e.g.:

```javascript
Common.custom(CustomChains.MaticMumbai)
```

Note that these supported custom chains only provide some base parameters (usually the chain and
network ID and a name) and can only be used for selected use cases (e.g. sending a tx with
the `@ethereumjs/tx` library to a Layer-2 chain).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainParamsOrName` | `Partial`<`Chain`\> \| [`CustomChain`](../enums/CustomChain.md) | Custom parameter dict (`name` will default to `custom-chain`) or string with name of a supported custom chain |
| `opts` | [`CustomCommonOpts`](../interfaces/CustomCommonOpts.md) | Custom chain options to set the [CustomCommonOpts.baseChain](../interfaces/CustomCommonOpts.md#basechain), selected [CustomCommonOpts.hardfork](../interfaces/CustomCommonOpts.md#hardfork) and others |

#### Returns

[`default`](default.md)

#### Defined in

[packages/common/src/index.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L232)

___

### forCustomChain

▸ `Static` **forCustomChain**(`baseChain`, `customChainParams`, `hardfork?`, `supportedHardforks?`): [`default`](default.md)

Creates a {@link Common} object for a custom chain, based on a standard one. It uses all the `Chain`
params from [baseChain](../interfaces/CustomCommonOpts.md#basechain) except the ones overridden in {@link customChainParams}.

**`deprecated`** Use {@link Common.custom} instead

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseChain` | `string` \| `number` | The name (`mainnet`) or id (`1`) of a standard chain used to base the custom chain params on. |
| `customChainParams` | `Partial`<`Chain`\> | The custom parameters of the chain. |
| `hardfork?` | `string` | String identifier ('byzantium') for hardfork (optional) |
| `supportedHardforks?` | `string`[] | Limit parameter returns to the given hardforks (optional) |

#### Returns

[`default`](default.md)

#### Defined in

[packages/common/src/index.ts:329](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L329)

___

### getEventListeners

▸ `Static` **getEventListeners**(`emitter`, `name`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`.

For `EventEmitter`s this behaves exactly the same as calling `.listeners` on
the emitter.

For `EventTarget`s this is the only way to get the event listeners for the
event target. This is useful for debugging and diagnostic purposes.

```js
const { getEventListeners, EventEmitter } = require('events');

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  getEventListeners(ee, 'foo'); // [listener]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  getEventListeners(et, 'foo'); // [listener]
}
```

**`since`** v15.2.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `DOMEventTarget` \| `EventEmitter` |
| `name` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.getEventListeners

#### Defined in

node_modules/@types/node/events.d.ts:262

___

### isSupportedChainId

▸ `Static` **isSupportedChainId**(`chainId`): `boolean`

Static method to determine if a [chainId](default.md#chainid) is supported as a standard chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | `BN` | BN id (`1`) of a standard chain |

#### Returns

`boolean`

boolean

#### Defined in

[packages/common/src/index.ts:352](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L352)

___

### listenerCount

▸ `Static` **listenerCount**(`emitter`, `eventName`): `number`

A class method that returns the number of listeners for the given `eventName`registered on the given `emitter`.

```js
const { EventEmitter, listenerCount } = require('events');
const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

**`since`** v0.9.12

**`deprecated`** Since v3.2.0 - Use `listenerCount` instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `emitter` | `EventEmitter` | The emitter to query |
| `eventName` | `string` \| `symbol` | The event name |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:234

___

### on

▸ `Static` **on**(`emitter`, `eventName`, `options?`): `AsyncIterableIterator`<`any`\>

```js
const { on, EventEmitter } = require('events');

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();
```

Returns an `AsyncIterator` that iterates `eventName` events. It will throw
if the `EventEmitter` emits `'error'`. It removes all listeners when
exiting the loop. The `value` returned by each iteration is an array
composed of the emitted event arguments.

An `AbortSignal` can be used to cancel waiting on events:

```js
const { on, EventEmitter } = require('events');
const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
```

**`since`** v13.6.0, v12.16.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `emitter` | `EventEmitter` | - |
| `eventName` | `string` | The name of the event being listened for |
| `options?` | `StaticEventEmitterOptions` | - |

#### Returns

`AsyncIterableIterator`<`any`\>

that iterates `eventName` events emitted by the `emitter`

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:217

___

### once

▸ `Static` **once**(`emitter`, `eventName`, `options?`): `Promise`<`any`[]\>

Creates a `Promise` that is fulfilled when the `EventEmitter` emits the given
event or that is rejected if the `EventEmitter` emits `'error'` while waiting.
The `Promise` will resolve with an array of all the arguments emitted to the
given event.

This method is intentionally generic and works with the web platform [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) interface, which has no special`'error'` event
semantics and does not listen to the `'error'` event.

```js
const { once, EventEmitter } = require('events');

async function run() {
  const ee = new EventEmitter();

  process.nextTick(() => {
    ee.emit('myevent', 42);
  });

  const [value] = await once(ee, 'myevent');
  console.log(value);

  const err = new Error('kaboom');
  process.nextTick(() => {
    ee.emit('error', err);
  });

  try {
    await once(ee, 'myevent');
  } catch (err) {
    console.log('error happened', err);
  }
}

run();
```

The special handling of the `'error'` event is only used when `events.once()`is used to wait for another event. If `events.once()` is used to wait for the
'`error'` event itself, then it is treated as any other kind of event without
special handling:

```js
const { EventEmitter, once } = require('events');

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.log('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

An `AbortSignal` can be used to cancel waiting for the event:

```js
const { EventEmitter, once } = require('events');

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Abort waiting for the event
ee.emit('foo'); // Prints: Waiting for the event was canceled!
```

**`since`** v11.13.0, v10.16.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `NodeEventTarget` |
| `eventName` | `string` \| `symbol` |
| `options?` | `StaticEventEmitterOptions` |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:157

▸ `Static` **once**(`emitter`, `eventName`, `options?`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `DOMEventTarget` |
| `eventName` | `string` |
| `options?` | `StaticEventEmitterOptions` |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:158
