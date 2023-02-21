[@ethereumjs/util](../README.md) / AsyncEventEmitter

# Class: AsyncEventEmitter<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](../interfaces/EventMap.md) |

## Hierarchy

- `EventEmitter`

  ↳ **`AsyncEventEmitter`**

## Table of contents

### Constructors

- [constructor](AsyncEventEmitter.md#constructor)

### Properties

- [captureRejectionSymbol](AsyncEventEmitter.md#capturerejectionsymbol)
- [captureRejections](AsyncEventEmitter.md#capturerejections)
- [defaultMaxListeners](AsyncEventEmitter.md#defaultmaxlisteners)
- [errorMonitor](AsyncEventEmitter.md#errormonitor)

### Methods

- [addListener](AsyncEventEmitter.md#addlistener)
- [after](AsyncEventEmitter.md#after)
- [before](AsyncEventEmitter.md#before)
- [emit](AsyncEventEmitter.md#emit)
- [eventNames](AsyncEventEmitter.md#eventnames)
- [first](AsyncEventEmitter.md#first)
- [getMaxListeners](AsyncEventEmitter.md#getmaxlisteners)
- [listenerCount](AsyncEventEmitter.md#listenercount)
- [listeners](AsyncEventEmitter.md#listeners)
- [off](AsyncEventEmitter.md#off)
- [on](AsyncEventEmitter.md#on)
- [once](AsyncEventEmitter.md#once)
- [prependListener](AsyncEventEmitter.md#prependlistener)
- [prependOnceListener](AsyncEventEmitter.md#prependoncelistener)
- [rawListeners](AsyncEventEmitter.md#rawlisteners)
- [removeAllListeners](AsyncEventEmitter.md#removealllisteners)
- [removeListener](AsyncEventEmitter.md#removelistener)
- [setMaxListeners](AsyncEventEmitter.md#setmaxlisteners)
- [getEventListeners](AsyncEventEmitter.md#geteventlisteners)
- [listenerCount](AsyncEventEmitter.md#listenercount-1)
- [on](AsyncEventEmitter.md#on-1)
- [once](AsyncEventEmitter.md#once-1)
- [setMaxListeners](AsyncEventEmitter.md#setmaxlisteners-1)

## Constructors

### constructor

• **new AsyncEventEmitter**<`T`\>(`options?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`EventMap`](../interfaces/EventMap.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `EventEmitterOptions` |

#### Inherited from

EventEmitter.constructor

#### Defined in

node_modules/@types/node/events.d.ts:74

## Properties

### captureRejectionSymbol

▪ `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](AsyncEventEmitter.md#capturerejectionsymbol)

#### Inherited from

EventEmitter.captureRejectionSymbol

#### Defined in

node_modules/@types/node/events.d.ts:291

___

### captureRejections

▪ `Static` **captureRejections**: `boolean`

Sets or gets the default captureRejection value for all emitters.

#### Inherited from

EventEmitter.captureRejections

#### Defined in

node_modules/@types/node/events.d.ts:296

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:297

___

### errorMonitor

▪ `Static` `Readonly` **errorMonitor**: typeof [`errorMonitor`](AsyncEventEmitter.md#errormonitor)

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

#### Inherited from

EventEmitter.errorMonitor

#### Defined in

node_modules/@types/node/events.d.ts:290

## Methods

### addListener

▸ **addListener**<`E`\>(`event`, `listener`): [`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `listener` | `T`[`E`] |

#### Returns

[`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Overrides

EventEmitter.addListener

#### Defined in

[packages/util/src/asyncEventEmitter.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L173)

___

### after

▸ **after**<`E`\>(`event`, `target`, `listener`): [`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `target` | `T`[`E`] |
| `listener` | `T`[`E`] |

#### Returns

[`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Defined in

[packages/util/src/asyncEventEmitter.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L127)

___

### before

▸ **before**<`E`\>(`event`, `target`, `listener`): [`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `target` | `T`[`E`] |
| `listener` | `T`[`E`] |

#### Returns

[`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Defined in

[packages/util/src/asyncEventEmitter.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L123)

___

### emit

▸ **emit**<`E`\>(`event`, ...`args`): `boolean`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `...args` | `Parameters`<`T`[`E`]\> |

#### Returns

`boolean`

#### Overrides

EventEmitter.emit

#### Defined in

[packages/util/src/asyncEventEmitter.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L50)

___

### eventNames

▸ **eventNames**(): keyof `T` & `string`[]

#### Returns

keyof `T` & `string`[]

#### Overrides

EventEmitter.eventNames

#### Defined in

[packages/util/src/asyncEventEmitter.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L193)

___

### first

▸ **first**<`E`\>(`event`, `listener`): [`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `listener` | `T`[`E`] |

#### Returns

[`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Defined in

[packages/util/src/asyncEventEmitter.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L105)

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Overrides

EventEmitter.getMaxListeners

#### Defined in

[packages/util/src/asyncEventEmitter.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L205)

___

### listenerCount

▸ **listenerCount**(`event`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | keyof `T` & `string` |

#### Returns

`number`

#### Overrides

EventEmitter.listenerCount

#### Defined in

[packages/util/src/asyncEventEmitter.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L201)

___

### listeners

▸ **listeners**<`E`\>(`event`): `T`[`E`][]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |

#### Returns

`T`[`E`][]

#### Overrides

EventEmitter.listeners

#### Defined in

[packages/util/src/asyncEventEmitter.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L197)

___

### off

▸ **off**(`eventName`, `listener`): [`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

Alias for `emitter.removeListener()`.

**`Since`**

v10.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/events.d.ts:462

___

### on

▸ **on**<`E`\>(`event`, `listener`): [`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `listener` | `T`[`E`] |

#### Returns

[`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Overrides

EventEmitter.on

#### Defined in

[packages/util/src/asyncEventEmitter.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L169)

___

### once

▸ **once**<`E`\>(`event`, `listener`): [`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `listener` | `T`[`E`] |

#### Returns

[`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Overrides

EventEmitter.once

#### Defined in

[packages/util/src/asyncEventEmitter.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L79)

___

### prependListener

▸ **prependListener**<`E`\>(`event`, `listener`): [`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `listener` | `T`[`E`] |

#### Returns

[`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Overrides

EventEmitter.prependListener

#### Defined in

[packages/util/src/asyncEventEmitter.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L177)

___

### prependOnceListener

▸ **prependOnceListener**<`E`\>(`event`, `listener`): [`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `listener` | `T`[`E`] |

#### Returns

[`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Overrides

EventEmitter.prependOnceListener

#### Defined in

[packages/util/src/asyncEventEmitter.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L181)

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

node_modules/@types/node/events.d.ts:532

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | keyof `T` & `string` |

#### Returns

[`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Overrides

EventEmitter.removeAllListeners

#### Defined in

[packages/util/src/asyncEventEmitter.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L185)

___

### removeListener

▸ **removeListener**<`E`\>(`event`, `listener`): [`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` & `string` |
| `listener` | `T`[`E`] |

#### Returns

[`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Overrides

EventEmitter.removeListener

#### Defined in

[packages/util/src/asyncEventEmitter.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L189)

___

### setMaxListeners

▸ **setMaxListeners**(`maxListeners`): [`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxListeners` | `number` |

#### Returns

[`AsyncEventEmitter`](AsyncEventEmitter.md)<`T`\>

#### Overrides

EventEmitter.setMaxListeners

#### Defined in

[packages/util/src/asyncEventEmitter.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/asyncEventEmitter.ts#L209)

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

___

### setMaxListeners

▸ `Static` **setMaxListeners**(`n?`, ...`eventTargets`): `void`

```js
const {
  setMaxListeners,
  EventEmitter
} = require('events');

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

**`Since`**

v15.4.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `n?` | `number` | A non-negative number. The maximum number of listeners per `EventTarget` event. |
| `...eventTargets` | (`EventEmitter` \| `DOMEventTarget`)[] | - |

#### Returns

`void`

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:280
