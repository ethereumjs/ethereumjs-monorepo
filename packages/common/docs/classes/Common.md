[@ethereumjs/common](../README.md) / Common

# Class: Common

Common class to access chain and hardfork parameters and to provide
a unified and shared view on the network and hardfork state.

Use the [custom](Common.md#custom) static constructor for creating simple
custom chain [Common](Common.md) objects (more complete custom chain setups
can be created via the main constructor and the [customChains](../interfaces/CommonOpts.md#customchains) parameter).

## Hierarchy

- `EventEmitter`

  ↳ **`Common`**

## Table of contents

### Constructors

- [constructor](Common.md#constructor)

### Properties

- [DEFAULT\_HARDFORK](Common.md#default_hardfork)
- [captureRejectionSymbol](Common.md#capturerejectionsymbol)
- [captureRejections](Common.md#capturerejections)
- [defaultMaxListeners](Common.md#defaultmaxlisteners)
- [errorMonitor](Common.md#errormonitor)

### Methods

- [\_calcForkHash](Common.md#_calcforkhash)
- [\_getHardfork](Common.md#_gethardfork)
- [activeOnBlock](Common.md#activeonblock)
- [addListener](Common.md#addlistener)
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
- [emit](Common.md#emit)
- [eventNames](Common.md#eventnames)
- [forkHash](Common.md#forkhash)
- [genesis](Common.md#genesis)
- [getHardforkByBlockNumber](Common.md#gethardforkbyblocknumber)
- [getMaxListeners](Common.md#getmaxlisteners)
- [gteHardfork](Common.md#gtehardfork)
- [hardfork](Common.md#hardfork)
- [hardforkBlock](Common.md#hardforkblock)
- [hardforkForForkHash](Common.md#hardforkforforkhash)
- [hardforkGteHardfork](Common.md#hardforkgtehardfork)
- [hardforkIsActiveOnBlock](Common.md#hardforkisactiveonblock)
- [hardforkTTD](Common.md#hardforkttd)
- [hardforks](Common.md#hardforks)
- [isActivatedEIP](Common.md#isactivatedeip)
- [isHardforkBlock](Common.md#ishardforkblock)
- [isNextHardforkBlock](Common.md#isnexthardforkblock)
- [listenerCount](Common.md#listenercount)
- [listeners](Common.md#listeners)
- [networkId](Common.md#networkid)
- [nextHardforkBlock](Common.md#nexthardforkblock)
- [off](Common.md#off)
- [on](Common.md#on)
- [once](Common.md#once)
- [param](Common.md#param)
- [paramByBlock](Common.md#parambyblock)
- [paramByEIP](Common.md#parambyeip)
- [paramByHardfork](Common.md#parambyhardfork)
- [prependListener](Common.md#prependlistener)
- [prependOnceListener](Common.md#prependoncelistener)
- [rawListeners](Common.md#rawlisteners)
- [removeAllListeners](Common.md#removealllisteners)
- [removeListener](Common.md#removelistener)
- [setChain](Common.md#setchain)
- [setEIPs](Common.md#seteips)
- [setHardfork](Common.md#sethardfork)
- [setHardforkByBlockNumber](Common.md#sethardforkbyblocknumber)
- [setMaxListeners](Common.md#setmaxlisteners)
- [\_getInitializedChains](Common.md#_getinitializedchains)
- [custom](Common.md#custom)
- [getEventListeners](Common.md#geteventlisteners)
- [isSupportedChainId](Common.md#issupportedchainid)
- [listenerCount](Common.md#listenercount-1)
- [on](Common.md#on-1)
- [once](Common.md#once-1)

## Constructors

### constructor

• **new Common**(`opts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`CommonOpts`](../interfaces/CommonOpts.md) |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/common/src/common.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L186)

## Properties

### DEFAULT\_HARDFORK

• `Readonly` **DEFAULT\_HARDFORK**: `string`

#### Defined in

[packages/common/src/common.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L37)

___

### captureRejectionSymbol

▪ `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](Common.md#capturerejectionsymbol)

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

▪ `Static` `Readonly` **errorMonitor**: typeof [`errorMonitor`](Common.md#errormonitor)

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

▸ **_calcForkHash**(`hardfork`, `genesisHash`): `string`

Internal helper function to calculate a fork hash

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | `string` | Hardfork name |
| `genesisHash` | `Buffer` | Genesis block hash of the chain |

#### Returns

`string`

Fork hash as hex string

#### Defined in

[packages/common/src/common.ts:638](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L638)

___

### \_getHardfork

▸ **_getHardfork**(`hardfork`): ``null`` \| [`HardforkConfig`](../interfaces/HardforkConfig.md)

Internal helper function, returns the params for the given hardfork for the chain set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork` | `string` | Hardfork name |

#### Returns

``null`` \| [`HardforkConfig`](../interfaces/HardforkConfig.md)

Dictionary with hardfork params or null if hardfork not on chain

#### Defined in

[packages/common/src/common.ts:333](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L333)

___

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

[packages/common/src/common.ts:502](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L502)

___

### addListener

▸ **addListener**(`eventName`, `listener`): [`Common`](Common.md)

Alias for `emitter.on(eventName, listener)`.

**`Since`**

v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Common`](Common.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/events.d.ts:299

___

### bootstrapNodes

▸ **bootstrapNodes**(): [`BootstrapNodeConfig`](../interfaces/BootstrapNodeConfig.md)[]

Returns bootstrap nodes for the current chain

#### Returns

[`BootstrapNodeConfig`](../interfaces/BootstrapNodeConfig.md)[]

Dict with bootstrap nodes

#### Defined in

[packages/common/src/common.ts:715](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L715)

___

### chainId

▸ **chainId**(): `bigint`

Returns the Id of current chain

#### Returns

`bigint`

chain Id

#### Defined in

[packages/common/src/common.ts:739](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L739)

___

### chainName

▸ **chainName**(): `string`

Returns the name of current chain

#### Returns

`string`

chain name (lower case)

#### Defined in

[packages/common/src/common.ts:747](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L747)

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

[packages/common/src/common.ts:795](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L795)

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

Note: This value can update along a Hardfork.

#### Returns

`Object`

#### Defined in

[packages/common/src/common.ts:824](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L824)

___

### consensusType

▸ **consensusType**(): `string`

Returns the consensus type of the network
Possible values: "pow"|"poa"|"pos"

Note: This value can update along a Hardfork.

#### Returns

`string`

#### Defined in

[packages/common/src/common.ts:773](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L773)

___

### copy

▸ **copy**(): [`Common`](Common.md)

Returns a deep copy of this [Common](Common.md) instance.

#### Returns

[`Common`](Common.md)

#### Defined in

[packages/common/src/common.ts:843](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L843)

___

### dnsNetworks

▸ **dnsNetworks**(): `string`[]

Returns DNS networks for the current chain

#### Returns

`string`[]

Array of DNS ENR urls

#### Defined in

[packages/common/src/common.ts:723](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L723)

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

[packages/common/src/common.ts:556](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L556)

___

### eips

▸ **eips**(): `number`[]

Returns the active EIPs

#### Returns

`number`[]

List of EIPs

#### Defined in

[packages/common/src/common.ts:763](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L763)

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

**`Since`**

v0.1.26

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

**`Since`**

v6.0.0

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/@types/node/events.d.ts:614

___

### forkHash

▸ **forkHash**(`hardfork?`, `genesisHash?`): `string`

Returns an eth/64 compliant fork hash (EIP-2124)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |
| `genesisHash?` | `Buffer` | Genesis block hash of the chain, optional if already defined and not needed to be calculated |

#### Returns

`string`

#### Defined in

[packages/common/src/common.ts:669](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L669)

___

### genesis

▸ **genesis**(): [`GenesisBlockConfig`](../interfaces/GenesisBlockConfig.md)

Returns the Genesis parameters of the current chain

#### Returns

[`GenesisBlockConfig`](../interfaces/GenesisBlockConfig.md)

Genesis dictionary

#### Defined in

[packages/common/src/common.ts:699](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L699)

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
| `blockNumber` | `BigIntLike` |
| `td?` | `BigIntLike` |

#### Returns

`string`

The name of the HF

#### Defined in

[packages/common/src/common.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L260)

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to [defaultMaxListeners](Common.md#defaultmaxlisteners).

**`Since`**

v1.0.0

#### Returns

`number`

#### Inherited from

EventEmitter.getMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:471

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

[packages/common/src/common.ts:533](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L533)

___

### hardfork

▸ **hardfork**(): `string`

Returns the hardfork set

#### Returns

`string`

Hardfork name

#### Defined in

[packages/common/src/common.ts:731](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L731)

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

[packages/common/src/common.ts:542](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L542)

___

### hardforkForForkHash

▸ **hardforkForForkHash**(`forkHash`): ``null`` \| [`HardforkConfig`](../interfaces/HardforkConfig.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `forkHash` | `string` | Fork hash as a hex string |

#### Returns

``null`` \| [`HardforkConfig`](../interfaces/HardforkConfig.md)

Array with hardfork data (name, block, forkHash)

#### Defined in

[packages/common/src/common.ts:688](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L688)

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

[packages/common/src/common.ts:513](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L513)

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

[packages/common/src/common.ts:487](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L487)

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

[packages/common/src/common.ts:574](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L574)

___

### hardforks

▸ **hardforks**(): [`HardforkConfig`](../interfaces/HardforkConfig.md)[]

Returns the hardforks for current chain

#### Returns

[`HardforkConfig`](../interfaces/HardforkConfig.md)[]

Array with arrays of hardforks

#### Defined in

[packages/common/src/common.ts:707](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L707)

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

[packages/common/src/common.ts:466](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L466)

___

### isHardforkBlock

▸ **isHardforkBlock**(`blockNumber`, `hardfork?`): `boolean`

True if block number provided is the hardfork (given or set) change block

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber` | `BigIntLike` | Number of the block to check |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

`boolean`

True if blockNumber is HF block

#### Defined in

[packages/common/src/common.ts:589](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L589)

___

### isNextHardforkBlock

▸ **isNextHardforkBlock**(`blockNumber`, `hardfork?`): `boolean`

True if block number provided is the hardfork change block following the hardfork given or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber` | `BigIntLike` | Number of the block to check |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

`boolean`

True if blockNumber is HF block

#### Defined in

[packages/common/src/common.ts:624](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L624)

___

### listenerCount

▸ **listenerCount**(`eventName`): `number`

Returns the number of listeners listening to the event named `eventName`.

**`Since`**

v3.2.0

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

**`Since`**

v0.1.26

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

▸ **networkId**(): `bigint`

Returns the Id of current network

#### Returns

`bigint`

network Id

#### Defined in

[packages/common/src/common.ts:755](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L755)

___

### nextHardforkBlock

▸ **nextHardforkBlock**(`hardfork?`): ``null`` \| `bigint`

Returns the change block for the next hardfork after the hardfork provided or set

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hardfork?` | `string` | Hardfork name, optional if HF set |

#### Returns

``null`` \| `bigint`

Block number or null if not available

#### Defined in

[packages/common/src/common.ts:601](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L601)

___

### off

▸ **off**(`eventName`, `listener`): [`Common`](Common.md)

Alias for `emitter.removeListener()`.

**`Since`**

v10.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Common`](Common.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/events.d.ts:444

___

### on

▸ **on**(`eventName`, `listener`): [`Common`](Common.md)

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

**`Since`**

v0.1.101

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Common`](Common.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:330

___

### once

▸ **once**(`eventName`, `listener`): [`Common`](Common.md)

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

**`Since`**

v0.3.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Common`](Common.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:359

___

### param

▸ **param**(`topic`, `name`): `bigint`

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

`bigint`

The value requested or `BigInt(0)` if not found

#### Defined in

[packages/common/src/common.ts:378](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L378)

___

### paramByBlock

▸ **paramByBlock**(`topic`, `name`, `blockNumber`, `td?`): `bigint`

Returns a parameter for the hardfork active on block number or
optional provided total difficulty (Merge HF)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | Parameter topic |
| `name` | `string` | Parameter name |
| `blockNumber` | `BigIntLike` | Block number |
| `td?` | `BigIntLike` | Total difficulty    * |

#### Returns

`bigint`

The value requested or `BigInt(0)` if not found

#### Defined in

[packages/common/src/common.ts:452](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L452)

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

[packages/common/src/common.ts:427](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L427)

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

[packages/common/src/common.ts:396](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L396)

___

### prependListener

▸ **prependListener**(`eventName`, `listener`): [`Common`](Common.md)

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

**`Since`**

v6.0.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Common`](Common.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/events.d.ts:579

___

### prependOnceListener

▸ **prependOnceListener**(`eventName`, `listener`): [`Common`](Common.md)

Adds a **one-time**`listener` function for the event named `eventName` to the_beginning_ of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`Since`**

v6.0.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Common`](Common.md)

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

**`Since`**

v9.4.0

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

▸ **removeAllListeners**(`event?`): [`Common`](Common.md)

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`Since`**

v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`Common`](Common.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/events.d.ts:455

___

### removeListener

▸ **removeListener**(`eventName`, `listener`): [`Common`](Common.md)

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

**`Since`**

v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Common`](Common.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/events.d.ts:439

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

[packages/common/src/common.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L206)

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

[packages/common/src/common.ts:345](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L345)

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

[packages/common/src/common.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L232)

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
| `blockNumber` | `BigIntLike` |
| `td?` | `BigIntLike` |

#### Returns

`string`

The name of the HF set

#### Defined in

[packages/common/src/common.ts:322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L322)

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`Common`](Common.md)

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to`Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`Since`**

v0.3.5

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`Common`](Common.md)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:465

___

### \_getInitializedChains

▸ `Static` **_getInitializedChains**(`customChains?`): [`ChainsConfig`](../interfaces/ChainsConfig.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `customChains?` | [`ChainConfig`](../interfaces/ChainConfig.md)[] |

#### Returns

[`ChainsConfig`](../interfaces/ChainsConfig.md)

#### Defined in

[packages/common/src/common.ts:849](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L849)

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

[packages/common/src/common.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L68)

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

**`Since`**

v15.2.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` \| `DOMEventTarget` |
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

Static method to determine if a [chainId](Common.md#chainid) is supported as a standard chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | `bigint` | bigint id (`1`) of a standard chain |

#### Returns

`boolean`

boolean

#### Defined in

[packages/common/src/common.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/common.ts#L158)

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

**`Since`**

v0.9.12

**`Deprecated`**

Since v3.2.0 - Use `listenerCount` instead.

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

**`Since`**

v13.6.0, v12.16.0

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

**`Since`**

v11.13.0, v10.16.0

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
