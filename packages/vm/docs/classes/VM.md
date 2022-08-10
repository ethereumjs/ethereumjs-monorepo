[@ethereumjs/vm](../README.md) / VM

# Class: VM

Execution engine which can be used to run a blockchain, individual
blocks, individual transactions, or snippets of EVM bytecode.

This class is an AsyncEventEmitter, please consult the README to learn how to use it.

## Hierarchy

- `AsyncEventEmitter`<[`VMEvents`](../README.md#vmevents)\>

  ↳ **`VM`**

## Table of contents

### Properties

- [\_common](VM.md#_common)
- [blockchain](VM.md#blockchain)
- [eei](VM.md#eei)
- [evm](VM.md#evm)
- [stateManager](VM.md#statemanager)
- [captureRejectionSymbol](VM.md#capturerejectionsymbol)
- [captureRejections](VM.md#capturerejections)
- [defaultMaxListeners](VM.md#defaultmaxlisteners)
- [errorMonitor](VM.md#errormonitor)

### Methods

- [addListener](VM.md#addlistener)
- [after](VM.md#after)
- [at](VM.md#at)
- [before](VM.md#before)
- [buildBlock](VM.md#buildblock)
- [copy](VM.md#copy)
- [emit](VM.md#emit)
- [errorStr](VM.md#errorstr)
- [eventNames](VM.md#eventnames)
- [first](VM.md#first)
- [getMaxListeners](VM.md#getmaxlisteners)
- [init](VM.md#init)
- [listenerCount](VM.md#listenercount)
- [listeners](VM.md#listeners)
- [off](VM.md#off)
- [on](VM.md#on)
- [once](VM.md#once)
- [prependListener](VM.md#prependlistener)
- [prependOnceListener](VM.md#prependoncelistener)
- [rawListeners](VM.md#rawlisteners)
- [removeAllListeners](VM.md#removealllisteners)
- [removeListener](VM.md#removelistener)
- [runBlock](VM.md#runblock)
- [runTx](VM.md#runtx)
- [setMaxListeners](VM.md#setmaxlisteners)
- [create](VM.md#create)
- [getEventListeners](VM.md#geteventlisteners)
- [listenerCount](VM.md#listenercount-1)
- [on](VM.md#on-1)
- [once](VM.md#once-1)

## Properties

### \_common

• `Readonly` **\_common**: `Common`

#### Defined in

[packages/vm/src/vm.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L41)

___

### blockchain

• `Readonly` **blockchain**: `BlockchainInterface`

The blockchain the VM operates on

#### Defined in

[packages/vm/src/vm.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L39)

___

### eei

• `Readonly` **eei**: `EEIInterface`

#### Defined in

[packages/vm/src/vm.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L47)

___

### evm

• `Readonly` **evm**: `EVMInterface` \| `EVM`

The EVM used for bytecode execution

#### Defined in

[packages/vm/src/vm.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L46)

___

### stateManager

• `Readonly` **stateManager**: `StateManager`

The StateManager used by the VM

#### Defined in

[packages/vm/src/vm.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L34)

___

### captureRejectionSymbol

▪ `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](VM.md#capturerejectionsymbol)

#### Inherited from

AsyncEventEmitter.captureRejectionSymbol

#### Defined in

node_modules/@types/node/events.d.ts:273

___

### captureRejections

▪ `Static` **captureRejections**: `boolean`

Sets or gets the default captureRejection value for all emitters.

#### Inherited from

AsyncEventEmitter.captureRejections

#### Defined in

node_modules/@types/node/events.d.ts:278

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

AsyncEventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:279

___

### errorMonitor

▪ `Static` `Readonly` **errorMonitor**: typeof [`errorMonitor`](VM.md#errormonitor)

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

#### Inherited from

AsyncEventEmitter.errorMonitor

#### Defined in

node_modules/@types/node/events.d.ts:272

## Methods

### addListener

▸ **addListener**<`E`\>(`event`, `listener`): [`VM`](VM.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends keyof [`VMEvents`](../README.md#vmevents) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `listener` | [`VMEvents`](../README.md#vmevents)[`E`] |

#### Returns

[`VM`](VM.md)

#### Inherited from

AsyncEventEmitter.addListener

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:82

___

### after

▸ **after**<`E`\>(`event`, `target`, `listener`): [`VM`](VM.md)

Adds a listener after the target listener in the listeners array for the specified event.

**`See`**

https://www.npmjs.com/package/async-eventemitter#important-differences-between-asynceventemitter-the-native-eventemitter

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends keyof [`VMEvents`](../README.md#vmevents) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `E` & `string` | EventMap key (event name) |
| `target` | [`VMEvents`](../README.md#vmevents)[`E`] | Listener to insert before |
| `listener` | [`VMEvents`](../README.md#vmevents)[`E`] | EventMap value (event function) |

#### Returns

[`VM`](VM.md)

#### Inherited from

AsyncEventEmitter.after

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:75

___

### at

▸ **at**<`E`\>(`event`, `index`, `listener`): [`VM`](VM.md)

Adds a listener at the specified index in the listeners array for the specified event.

**`See`**

https://www.npmjs.com/package/async-eventemitter#important-differences-between-asynceventemitter-the-native-eventemitter

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends keyof [`VMEvents`](../README.md#vmevents) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `E` & `string` | EventMap key (event name) |
| `index` | `number` | Index to insert at |
| `listener` | [`VMEvents`](../README.md#vmevents)[`E`] | EventMap value (event function) |

#### Returns

[`VM`](VM.md)

#### Inherited from

AsyncEventEmitter.at

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:55

___

### before

▸ **before**<`E`\>(`event`, `target`, `listener`): [`VM`](VM.md)

Adds a listener before the target listener in the listeners array for the specified event.

**`See`**

https://www.npmjs.com/package/async-eventemitter#important-differences-between-asynceventemitter-the-native-eventemitter

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends keyof [`VMEvents`](../README.md#vmevents) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `E` & `string` | EventMap key (event name) |
| `target` | [`VMEvents`](../README.md#vmevents)[`E`] | Listener to insert before |
| `listener` | [`VMEvents`](../README.md#vmevents)[`E`] | EventMap value (event function) |

#### Returns

[`VM`](VM.md)

#### Inherited from

AsyncEventEmitter.before

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:63

___

### buildBlock

▸ **buildBlock**(`opts`): `Promise`<`BlockBuilder`\>

Build a block on top of the current state
by adding one transaction at a time.

Creates a checkpoint on the StateManager and modifies the state
as transactions are run. The checkpoint is committed on BlockBuilder.build
or discarded with BlockBuilder.revert.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`BuildBlockOpts`](../interfaces/BuildBlockOpts.md) |

#### Returns

`Promise`<`BlockBuilder`\>

An instance of BlockBuilder with methods:
- BlockBuilder.addTransaction
- BlockBuilder.build
- BlockBuilder.revert

#### Defined in

[packages/vm/src/vm.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L233)

___

### copy

▸ **copy**(): `Promise`<[`VM`](VM.md)\>

Returns a copy of the [VM](VM.md) instance.

#### Returns

`Promise`<[`VM`](VM.md)\>

#### Defined in

[packages/vm/src/vm.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L240)

___

### emit

▸ **emit**<`E`\>(`event`, ...`args`): `boolean`

Executes all listeners for the event in order with the supplied data argument.
The optional callback is called when all of the listeners are done.

**`See`**

https://www.npmjs.com/package/async-eventemitter#important-differences-between-asynceventemitter-the-native-eventemitter

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends keyof [`VMEvents`](../README.md#vmevents) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `E` & `string` | EventMap key (event name) |
| `...args` | `Parameters`<[`VMEvents`](../README.md#vmevents)[`E`]\> | EventMap parameters |

#### Returns

`boolean`

#### Inherited from

AsyncEventEmitter.emit

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:37

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

[packages/vm/src/vm.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L256)

___

### eventNames

▸ **eventNames**(): (``"beforeTx"`` \| ``"afterTx"`` \| ``"beforeBlock"`` \| ``"afterBlock"``)[]

#### Returns

(``"beforeTx"`` \| ``"afterTx"`` \| ``"beforeBlock"`` \| ``"afterBlock"``)[]

#### Inherited from

AsyncEventEmitter.eventNames

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:94

___

### first

▸ **first**<`E`\>(`event`, `listener`): [`VM`](VM.md)

Adds a listener to the beginning of the listeners array for the specified event.

**`See`**

https://www.npmjs.com/package/async-eventemitter#important-differences-between-asynceventemitter-the-native-eventemitter

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends keyof [`VMEvents`](../README.md#vmevents) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `E` & `string` | EventMap key (event name) |
| `listener` | [`VMEvents`](../README.md#vmevents)[`E`] | EventMap value (event function) |

#### Returns

[`VM`](VM.md)

#### Inherited from

AsyncEventEmitter.first

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:47

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Inherited from

AsyncEventEmitter.getMaxListeners

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:98

___

### init

▸ **init**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/vm/src/vm.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L156)

___

### listenerCount

▸ **listenerCount**(`event`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"beforeTx"`` \| ``"afterTx"`` \| ``"beforeBlock"`` \| ``"afterBlock"`` |

#### Returns

`number`

#### Inherited from

AsyncEventEmitter.listenerCount

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:96

___

### listeners

▸ **listeners**<`E`\>(`event`): [`VMEvents`](../README.md#vmevents)[`E`][]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends keyof [`VMEvents`](../README.md#vmevents) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |

#### Returns

[`VMEvents`](../README.md#vmevents)[`E`][]

#### Inherited from

AsyncEventEmitter.listeners

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:95

___

### off

▸ **off**(`eventName`, `listener`): [`VM`](VM.md)

Alias for `emitter.removeListener()`.

**`Since`**

v10.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`VM`](VM.md)

#### Inherited from

AsyncEventEmitter.off

#### Defined in

node_modules/@types/node/events.d.ts:444

___

### on

▸ **on**<`E`\>(`event`, `listener`): [`VM`](VM.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends keyof [`VMEvents`](../README.md#vmevents) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `listener` | [`VMEvents`](../README.md#vmevents)[`E`] |

#### Returns

[`VM`](VM.md)

#### Inherited from

AsyncEventEmitter.on

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:83

___

### once

▸ **once**<`E`\>(`event`, `listener`): [`VM`](VM.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends keyof [`VMEvents`](../README.md#vmevents) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `listener` | [`VMEvents`](../README.md#vmevents)[`E`] |

#### Returns

[`VM`](VM.md)

#### Inherited from

AsyncEventEmitter.once

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:84

___

### prependListener

▸ **prependListener**<`E`\>(`event`, `listener`): [`VM`](VM.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends keyof [`VMEvents`](../README.md#vmevents) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `listener` | [`VMEvents`](../README.md#vmevents)[`E`] |

#### Returns

[`VM`](VM.md)

#### Inherited from

AsyncEventEmitter.prependListener

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:85

___

### prependOnceListener

▸ **prependOnceListener**<`E`\>(`event`, `listener`): [`VM`](VM.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends keyof [`VMEvents`](../README.md#vmevents) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `listener` | [`VMEvents`](../README.md#vmevents)[`E`] |

#### Returns

[`VM`](VM.md)

#### Inherited from

AsyncEventEmitter.prependOnceListener

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:86

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

AsyncEventEmitter.rawListeners

#### Defined in

node_modules/@types/node/events.d.ts:514

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`VM`](VM.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | ``"beforeTx"`` \| ``"afterTx"`` \| ``"beforeBlock"`` \| ``"afterBlock"`` |

#### Returns

[`VM`](VM.md)

#### Inherited from

AsyncEventEmitter.removeAllListeners

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:91

___

### removeListener

▸ **removeListener**<`E`\>(`event`, `listener`): [`VM`](VM.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends keyof [`VMEvents`](../README.md#vmevents) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `listener` | [`VMEvents`](../README.md#vmevents)[`E`] |

#### Returns

[`VM`](VM.md)

#### Inherited from

AsyncEventEmitter.removeListener

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:92

___

### runBlock

▸ **runBlock**(`opts`): `Promise`<[`RunBlockResult`](../interfaces/RunBlockResult.md)\>

Processes the `block` running all of the transactions it contains and updating the miner's account

This method modifies the state. If `generate` is `true`, the state modifications will be
reverted if an exception is raised. If it's `false`, it won't revert if the block's header is
invalid. If an error is thrown from an event handler, the state may or may not be reverted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`RunBlockOpts`](../interfaces/RunBlockOpts.md) | Default values for options:  - `generate`: false |

#### Returns

`Promise`<[`RunBlockResult`](../interfaces/RunBlockResult.md)\>

#### Defined in

[packages/vm/src/vm.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L202)

___

### runTx

▸ **runTx**(`opts`): `Promise`<[`RunTxResult`](../interfaces/RunTxResult.md)\>

Process a transaction. Run the vm. Transfers eth. Checks balances.

This method modifies the state. If an error is thrown, the modifications are reverted, except
when the error is thrown from an event handler. In the latter case the state may or may not be
reverted.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`RunTxOpts`](../interfaces/RunTxOpts.md) |

#### Returns

`Promise`<[`RunTxResult`](../interfaces/RunTxResult.md)\>

#### Defined in

[packages/vm/src/vm.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L215)

___

### setMaxListeners

▸ **setMaxListeners**(`maxListeners`): [`VM`](VM.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxListeners` | `number` |

#### Returns

[`VM`](VM.md)

#### Inherited from

AsyncEventEmitter.setMaxListeners

#### Defined in

node_modules/@types/async-eventemitter/index.d.ts:99

___

### create

▸ `Static` **create**(`opts?`): `Promise`<[`VM`](VM.md)\>

VM async constructor. Creates engine instance and initializes it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`VMOpts`](../interfaces/VMOpts.md) | VM engine constructor options |

#### Returns

`Promise`<[`VM`](VM.md)\>

#### Defined in

[packages/vm/src/vm.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/vm.ts#L77)

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

AsyncEventEmitter.getEventListeners

#### Defined in

node_modules/@types/node/events.d.ts:262

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

AsyncEventEmitter.listenerCount

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

AsyncEventEmitter.on

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

AsyncEventEmitter.once

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

AsyncEventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:158
