[ethereumjs-client](../README.md) › ["sync/fetcher/blockfetcher"](../modules/_sync_fetcher_blockfetcher_.md) › [BlockFetcher](_sync_fetcher_blockfetcher_.blockfetcher.md)

# Class: BlockFetcher

Implements an eth/62 based block fetcher

**`memberof`** module:sync/fetcher

## Hierarchy

↳ [Fetcher](_sync_fetcher_fetcher_.fetcher.md)

↳ **BlockFetcher**

↳ [HeaderFetcher](_sync_fetcher_headerfetcher_.headerfetcher.md)

## Implements

- ReadableStream

## Index

### Constructors

- [constructor](_sync_fetcher_blockfetcher_.blockfetcher.md#constructor)

### Properties

- [config](_sync_fetcher_blockfetcher_.blockfetcher.md#config)
- [destroyed](_sync_fetcher_blockfetcher_.blockfetcher.md#destroyed)
- [readable](_sync_fetcher_blockfetcher_.blockfetcher.md#readable)
- [readableEncoding](_sync_fetcher_blockfetcher_.blockfetcher.md#readableencoding)
- [readableEnded](_sync_fetcher_blockfetcher_.blockfetcher.md#readableended)
- [readableFlowing](_sync_fetcher_blockfetcher_.blockfetcher.md#readableflowing)
- [readableHighWaterMark](_sync_fetcher_blockfetcher_.blockfetcher.md#readablehighwatermark)
- [readableLength](_sync_fetcher_blockfetcher_.blockfetcher.md#readablelength)
- [readableObjectMode](_sync_fetcher_blockfetcher_.blockfetcher.md#readableobjectmode)

### Methods

- [[Symbol.asyncIterator]](_sync_fetcher_blockfetcher_.blockfetcher.md#[symbol.asynciterator])
- [\_destroy](_sync_fetcher_blockfetcher_.blockfetcher.md#_destroy)
- [\_read](_sync_fetcher_blockfetcher_.blockfetcher.md#_read)
- [addListener](_sync_fetcher_blockfetcher_.blockfetcher.md#addlistener)
- [dequeue](_sync_fetcher_blockfetcher_.blockfetcher.md#dequeue)
- [destroy](_sync_fetcher_blockfetcher_.blockfetcher.md#destroy)
- [emit](_sync_fetcher_blockfetcher_.blockfetcher.md#emit)
- [enqueue](_sync_fetcher_blockfetcher_.blockfetcher.md#enqueue)
- [error](_sync_fetcher_blockfetcher_.blockfetcher.md#error)
- [eventNames](_sync_fetcher_blockfetcher_.blockfetcher.md#eventnames)
- [expire](_sync_fetcher_blockfetcher_.blockfetcher.md#expire)
- [failure](_sync_fetcher_blockfetcher_.blockfetcher.md#private-failure)
- [fetch](_sync_fetcher_blockfetcher_.blockfetcher.md#fetch)
- [getMaxListeners](_sync_fetcher_blockfetcher_.blockfetcher.md#getmaxlisteners)
- [isPaused](_sync_fetcher_blockfetcher_.blockfetcher.md#ispaused)
- [listenerCount](_sync_fetcher_blockfetcher_.blockfetcher.md#listenercount)
- [listeners](_sync_fetcher_blockfetcher_.blockfetcher.md#listeners)
- [next](_sync_fetcher_blockfetcher_.blockfetcher.md#next)
- [off](_sync_fetcher_blockfetcher_.blockfetcher.md#off)
- [on](_sync_fetcher_blockfetcher_.blockfetcher.md#on)
- [once](_sync_fetcher_blockfetcher_.blockfetcher.md#once)
- [pause](_sync_fetcher_blockfetcher_.blockfetcher.md#pause)
- [peer](_sync_fetcher_blockfetcher_.blockfetcher.md#peer)
- [pipe](_sync_fetcher_blockfetcher_.blockfetcher.md#pipe)
- [prependListener](_sync_fetcher_blockfetcher_.blockfetcher.md#prependlistener)
- [prependOnceListener](_sync_fetcher_blockfetcher_.blockfetcher.md#prependoncelistener)
- [process](_sync_fetcher_blockfetcher_.blockfetcher.md#process)
- [push](_sync_fetcher_blockfetcher_.blockfetcher.md#push)
- [rawListeners](_sync_fetcher_blockfetcher_.blockfetcher.md#rawlisteners)
- [read](_sync_fetcher_blockfetcher_.blockfetcher.md#read)
- [removeAllListeners](_sync_fetcher_blockfetcher_.blockfetcher.md#removealllisteners)
- [removeListener](_sync_fetcher_blockfetcher_.blockfetcher.md#removelistener)
- [request](_sync_fetcher_blockfetcher_.blockfetcher.md#request)
- [resume](_sync_fetcher_blockfetcher_.blockfetcher.md#resume)
- [setEncoding](_sync_fetcher_blockfetcher_.blockfetcher.md#setencoding)
- [setMaxListeners](_sync_fetcher_blockfetcher_.blockfetcher.md#setmaxlisteners)
- [store](_sync_fetcher_blockfetcher_.blockfetcher.md#store)
- [success](_sync_fetcher_blockfetcher_.blockfetcher.md#private-success)
- [tasks](_sync_fetcher_blockfetcher_.blockfetcher.md#tasks)
- [unpipe](_sync_fetcher_blockfetcher_.blockfetcher.md#unpipe)
- [unshift](_sync_fetcher_blockfetcher_.blockfetcher.md#unshift)
- [wait](_sync_fetcher_blockfetcher_.blockfetcher.md#wait)
- [wrap](_sync_fetcher_blockfetcher_.blockfetcher.md#wrap)
- [write](_sync_fetcher_blockfetcher_.blockfetcher.md#write)
- [from](_sync_fetcher_blockfetcher_.blockfetcher.md#static-from)

## Constructors

### constructor

\+ **new BlockFetcher**(`options`: [BlockFetcherOptions](../interfaces/_sync_fetcher_blockfetcher_.blockfetcheroptions.md)): _[BlockFetcher](_sync_fetcher_blockfetcher_.blockfetcher.md)_

_Overrides [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[constructor](_sync_fetcher_fetcher_.fetcher.md#constructor)_

_Defined in [lib/sync/fetcher/blockfetcher.ts:25](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.ts#L25)_

Create new block fetcher

**Parameters:**

| Name      | Type                                                                                    |
| --------- | --------------------------------------------------------------------------------------- |
| `options` | [BlockFetcherOptions](../interfaces/_sync_fetcher_blockfetcher_.blockfetcheroptions.md) |

**Returns:** _[BlockFetcher](_sync_fetcher_blockfetcher_.blockfetcher.md)_

## Properties

### config

• **config**: _[Config](_config_.config.md)_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[config](_sync_fetcher_fetcher_.fetcher.md#config)_

_Defined in [lib/sync/fetcher/fetcher.ts:37](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L37)_

---

### destroyed

• **destroyed**: _boolean_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[destroyed](_sync_fetcher_fetcher_.fetcher.md#destroyed)_

Defined in node_modules/@types/node/stream.d.ts:35

---

### readable

• **readable**: _boolean_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[readable](_sync_fetcher_fetcher_.fetcher.md#readable)_

Defined in node_modules/@types/node/stream.d.ts:28

---

### readableEncoding

• **readableEncoding**: _BufferEncoding | null_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[readableEncoding](_sync_fetcher_fetcher_.fetcher.md#readableencoding)_

Defined in node_modules/@types/node/stream.d.ts:29

---

### readableEnded

• **readableEnded**: _boolean_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[readableEnded](_sync_fetcher_fetcher_.fetcher.md#readableended)_

Defined in node_modules/@types/node/stream.d.ts:30

---

### readableFlowing

• **readableFlowing**: _boolean | null_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[readableFlowing](_sync_fetcher_fetcher_.fetcher.md#readableflowing)_

Defined in node_modules/@types/node/stream.d.ts:31

---

### readableHighWaterMark

• **readableHighWaterMark**: _number_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[readableHighWaterMark](_sync_fetcher_fetcher_.fetcher.md#readablehighwatermark)_

Defined in node_modules/@types/node/stream.d.ts:32

---

### readableLength

• **readableLength**: _number_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[readableLength](_sync_fetcher_fetcher_.fetcher.md#readablelength)_

Defined in node_modules/@types/node/stream.d.ts:33

---

### readableObjectMode

• **readableObjectMode**: _boolean_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[readableObjectMode](_sync_fetcher_fetcher_.fetcher.md#readableobjectmode)_

Defined in node_modules/@types/node/stream.d.ts:34

## Methods

### [Symbol.asyncIterator]

▸ **[Symbol.asyncIterator]**(): _AsyncIterableIterator‹any›_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[[Symbol.asyncIterator]](*sync_fetcher_fetcher*.fetcher.md#[symbol.asynciterator])_

Defined in node_modules/@types/node/stream.d.ts:124

**Returns:** _AsyncIterableIterator‹any›_

---

### \_destroy

▸ **\_destroy**(`error`: Error | null, `callback`: function): _void_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[\_destroy](_sync_fetcher_fetcher_.fetcher.md#_destroy)_

Defined in node_modules/@types/node/stream.d.ts:47

**Parameters:**

▪ **error**: _Error | null_

▪ **callback**: _function_

▸ (`error?`: Error | null): _void_

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `error?` | Error &#124; null |

**Returns:** _void_

---

### \_read

▸ **\_read**(): _void_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[\_read](_sync_fetcher_fetcher_.fetcher.md#_read)_

_Overrides void_

_Defined in [lib/sync/fetcher/fetcher.ts:116](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L116)_

Implements Readable.\_read() by pushing completed tasks to the read queue

**Returns:** _void_

---

### addListener

▸ **addListener**(`event`: "close", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[addListener](_net_protocol_sender_.sender.md#addlistener)_

Defined in node_modules/@types/node/stream.d.ts:61

Event emitter
The defined events on documents including:

1. close
2. data
3. end
4. error
5. pause
6. readable
7. resume

**Parameters:**

▪ **event**: _"close"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **addListener**(`event`: "data", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[addListener](_net_protocol_sender_.sender.md#addlistener)_

Defined in node_modules/@types/node/stream.d.ts:62

**Parameters:**

▪ **event**: _"data"_

▪ **listener**: _function_

▸ (`chunk`: any): _void_

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `chunk` | any  |

**Returns:** _this_

▸ **addListener**(`event`: "end", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[addListener](_net_protocol_sender_.sender.md#addlistener)_

Defined in node_modules/@types/node/stream.d.ts:63

**Parameters:**

▪ **event**: _"end"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **addListener**(`event`: "error", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[addListener](_net_protocol_sender_.sender.md#addlistener)_

Defined in node_modules/@types/node/stream.d.ts:64

**Parameters:**

▪ **event**: _"error"_

▪ **listener**: _function_

▸ (`err`: Error): _void_

**Parameters:**

| Name  | Type  |
| ----- | ----- |
| `err` | Error |

**Returns:** _this_

▸ **addListener**(`event`: "pause", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[addListener](_net_protocol_sender_.sender.md#addlistener)_

Defined in node_modules/@types/node/stream.d.ts:65

**Parameters:**

▪ **event**: _"pause"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **addListener**(`event`: "readable", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[addListener](_net_protocol_sender_.sender.md#addlistener)_

Defined in node_modules/@types/node/stream.d.ts:66

**Parameters:**

▪ **event**: _"readable"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **addListener**(`event`: "resume", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[addListener](_net_protocol_sender_.sender.md#addlistener)_

Defined in node_modules/@types/node/stream.d.ts:67

**Parameters:**

▪ **event**: _"resume"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **addListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[addListener](_net_protocol_sender_.sender.md#addlistener)_

Defined in node_modules/@types/node/stream.d.ts:68

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### dequeue

▸ **dequeue**(): _void_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[dequeue](_sync_fetcher_fetcher_.fetcher.md#dequeue)_

_Defined in [lib/sync/fetcher/fetcher.ts:102](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L102)_

Dequeue all done tasks that completed in order

**Returns:** _void_

---

### destroy

▸ **destroy**(`error?`: Error): _void_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[destroy](_sync_fetcher_fetcher_.fetcher.md#destroy)_

Defined in node_modules/@types/node/stream.d.ts:48

**Parameters:**

| Name     | Type  |
| -------- | ----- |
| `error?` | Error |

**Returns:** _void_

---

### emit

▸ **emit**(`event`: "close"): _boolean_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[emit](_net_protocol_sender_.sender.md#emit)_

Defined in node_modules/@types/node/stream.d.ts:70

**Parameters:**

| Name    | Type    |
| ------- | ------- |
| `event` | "close" |

**Returns:** _boolean_

▸ **emit**(`event`: "data", `chunk`: any): _boolean_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[emit](_net_protocol_sender_.sender.md#emit)_

Defined in node_modules/@types/node/stream.d.ts:71

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `event` | "data" |
| `chunk` | any    |

**Returns:** _boolean_

▸ **emit**(`event`: "end"): _boolean_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[emit](_net_protocol_sender_.sender.md#emit)_

Defined in node_modules/@types/node/stream.d.ts:72

**Parameters:**

| Name    | Type  |
| ------- | ----- |
| `event` | "end" |

**Returns:** _boolean_

▸ **emit**(`event`: "error", `err`: Error): _boolean_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[emit](_net_protocol_sender_.sender.md#emit)_

Defined in node_modules/@types/node/stream.d.ts:73

**Parameters:**

| Name    | Type    |
| ------- | ------- |
| `event` | "error" |
| `err`   | Error   |

**Returns:** _boolean_

▸ **emit**(`event`: "pause"): _boolean_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[emit](_net_protocol_sender_.sender.md#emit)_

Defined in node_modules/@types/node/stream.d.ts:74

**Parameters:**

| Name    | Type    |
| ------- | ------- |
| `event` | "pause" |

**Returns:** _boolean_

▸ **emit**(`event`: "readable"): _boolean_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[emit](_net_protocol_sender_.sender.md#emit)_

Defined in node_modules/@types/node/stream.d.ts:75

**Parameters:**

| Name    | Type       |
| ------- | ---------- |
| `event` | "readable" |

**Returns:** _boolean_

▸ **emit**(`event`: "resume"): _boolean_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[emit](_net_protocol_sender_.sender.md#emit)_

Defined in node_modules/@types/node/stream.d.ts:76

**Parameters:**

| Name    | Type     |
| ------- | -------- |
| `event` | "resume" |

**Returns:** _boolean_

▸ **emit**(`event`: string | symbol, ...`args`: any[]): _boolean_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[emit](_net_protocol_sender_.sender.md#emit)_

Defined in node_modules/@types/node/stream.d.ts:77

**Parameters:**

| Name      | Type                 |
| --------- | -------------------- |
| `event`   | string &#124; symbol |
| `...args` | any[]                |

**Returns:** _boolean_

---

### enqueue

▸ **enqueue**(`job`: any): _void_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[enqueue](_sync_fetcher_fetcher_.fetcher.md#enqueue)_

_Defined in [lib/sync/fetcher/fetcher.ts:88](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L88)_

Enqueue job

**Parameters:**

| Name  | Type | Description |
| ----- | ---- | ----------- |
| `job` | any  |             |

**Returns:** _void_

---

### error

▸ **error**(`error`: Error, `job?`: any): _void_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[error](_sync_fetcher_fetcher_.fetcher.md#error)_

_Defined in [lib/sync/fetcher/fetcher.ts:201](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L201)_

Handle error

**Parameters:**

| Name    | Type  | Description  |
| ------- | ----- | ------------ |
| `error` | Error | error object |
| `job?`  | any   | task         |

**Returns:** _void_

---

### eventNames

▸ **eventNames**(): _Array‹string | symbol›_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[eventNames](_net_protocol_sender_.sender.md#eventnames)_

Defined in node_modules/@types/node/events.d.ts:77

**Returns:** _Array‹string | symbol›_

---

### expire

▸ **expire**(`job`: any): _void_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[expire](_sync_fetcher_fetcher_.fetcher.md#expire)_

_Defined in [lib/sync/fetcher/fetcher.ts:308](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L308)_

Expire job that has timed out and ban associated peer. Timed out tasks will
be re-inserted into the queue.

**Parameters:**

| Name  | Type |
| ----- | ---- |
| `job` | any  |

**Returns:** _void_

---

### `Private` failure

▸ **failure**(`job`: any, `error?`: Error): _void_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[failure](_sync_fetcher_fetcher_.fetcher.md#private-failure)_

_Defined in [lib/sync/fetcher/fetcher.ts:154](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L154)_

handle failed job completion

**Parameters:**

| Name     | Type  | Description |
| -------- | ----- | ----------- |
| `job`    | any   | failed job  |
| `error?` | Error |             |

**Returns:** _void_

---

### fetch

▸ **fetch**(): _Promise‹undefined | false›_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[fetch](_sync_fetcher_fetcher_.fetcher.md#fetch)_

_Defined in [lib/sync/fetcher/fetcher.ts:246](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L246)_

Run the fetcher. Returns a promise that resolves once all tasks are completed.

**Returns:** _Promise‹undefined | false›_

---

### getMaxListeners

▸ **getMaxListeners**(): _number_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[getMaxListeners](_net_protocol_sender_.sender.md#getmaxlisteners)_

Defined in node_modules/@types/node/events.d.ts:69

**Returns:** _number_

---

### isPaused

▸ **isPaused**(): _boolean_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[isPaused](_sync_fetcher_fetcher_.fetcher.md#ispaused)_

Defined in node_modules/@types/node/stream.d.ts:42

**Returns:** _boolean_

---

### listenerCount

▸ **listenerCount**(`event`: string | symbol): _number_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[listenerCount](_net_protocol_sender_.sender.md#listenercount)_

Defined in node_modules/@types/node/events.d.ts:73

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _number_

---

### listeners

▸ **listeners**(`event`: string | symbol): _Function[]_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[listeners](_net_protocol_sender_.sender.md#listeners)_

Defined in node_modules/@types/node/events.d.ts:70

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _Function[]_

---

### next

▸ **next**(): _any_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[next](_sync_fetcher_fetcher_.fetcher.md#next)_

_Defined in [lib/sync/fetcher/fetcher.ts:168](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L168)_

Process next task

**Returns:** _any_

---

### off

▸ **off**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[off](_net_protocol_sender_.sender.md#off)_

Defined in node_modules/@types/node/events.d.ts:66

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### on

▸ **on**(`event`: "close", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[on](_net_protocol_sender_.sender.md#on)_

Defined in node_modules/@types/node/stream.d.ts:79

**Parameters:**

▪ **event**: _"close"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **on**(`event`: "data", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[on](_net_protocol_sender_.sender.md#on)_

Defined in node_modules/@types/node/stream.d.ts:80

**Parameters:**

▪ **event**: _"data"_

▪ **listener**: _function_

▸ (`chunk`: any): _void_

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `chunk` | any  |

**Returns:** _this_

▸ **on**(`event`: "end", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[on](_net_protocol_sender_.sender.md#on)_

Defined in node_modules/@types/node/stream.d.ts:81

**Parameters:**

▪ **event**: _"end"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **on**(`event`: "error", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[on](_net_protocol_sender_.sender.md#on)_

Defined in node_modules/@types/node/stream.d.ts:82

**Parameters:**

▪ **event**: _"error"_

▪ **listener**: _function_

▸ (`err`: Error): _void_

**Parameters:**

| Name  | Type  |
| ----- | ----- |
| `err` | Error |

**Returns:** _this_

▸ **on**(`event`: "pause", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[on](_net_protocol_sender_.sender.md#on)_

Defined in node_modules/@types/node/stream.d.ts:83

**Parameters:**

▪ **event**: _"pause"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **on**(`event`: "readable", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[on](_net_protocol_sender_.sender.md#on)_

Defined in node_modules/@types/node/stream.d.ts:84

**Parameters:**

▪ **event**: _"readable"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **on**(`event`: "resume", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[on](_net_protocol_sender_.sender.md#on)_

Defined in node_modules/@types/node/stream.d.ts:85

**Parameters:**

▪ **event**: _"resume"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **on**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[on](_net_protocol_sender_.sender.md#on)_

Defined in node_modules/@types/node/stream.d.ts:86

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### once

▸ **once**(`event`: "close", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[once](_net_protocol_sender_.sender.md#once)_

Defined in node_modules/@types/node/stream.d.ts:88

**Parameters:**

▪ **event**: _"close"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **once**(`event`: "data", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[once](_net_protocol_sender_.sender.md#once)_

Defined in node_modules/@types/node/stream.d.ts:89

**Parameters:**

▪ **event**: _"data"_

▪ **listener**: _function_

▸ (`chunk`: any): _void_

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `chunk` | any  |

**Returns:** _this_

▸ **once**(`event`: "end", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[once](_net_protocol_sender_.sender.md#once)_

Defined in node_modules/@types/node/stream.d.ts:90

**Parameters:**

▪ **event**: _"end"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **once**(`event`: "error", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[once](_net_protocol_sender_.sender.md#once)_

Defined in node_modules/@types/node/stream.d.ts:91

**Parameters:**

▪ **event**: _"error"_

▪ **listener**: _function_

▸ (`err`: Error): _void_

**Parameters:**

| Name  | Type  |
| ----- | ----- |
| `err` | Error |

**Returns:** _this_

▸ **once**(`event`: "pause", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[once](_net_protocol_sender_.sender.md#once)_

Defined in node_modules/@types/node/stream.d.ts:92

**Parameters:**

▪ **event**: _"pause"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **once**(`event`: "readable", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[once](_net_protocol_sender_.sender.md#once)_

Defined in node_modules/@types/node/stream.d.ts:93

**Parameters:**

▪ **event**: _"readable"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **once**(`event`: "resume", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[once](_net_protocol_sender_.sender.md#once)_

Defined in node_modules/@types/node/stream.d.ts:94

**Parameters:**

▪ **event**: _"resume"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **once**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[once](_net_protocol_sender_.sender.md#once)_

Defined in node_modules/@types/node/stream.d.ts:95

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### pause

▸ **pause**(): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[pause](_sync_fetcher_fetcher_.fetcher.md#pause)_

Defined in node_modules/@types/node/stream.d.ts:40

**Returns:** _this_

---

### peer

▸ **peer**(`_job`: any): _[Peer](_net_peer_peer_.peer.md)_

_Overrides [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[peer](_sync_fetcher_fetcher_.fetcher.md#peer)_

_Defined in [lib/sync/fetcher/blockfetcher.ts:101](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.ts#L101)_

Returns a peer that can process the given job

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `_job` | any  |

**Returns:** _[Peer](_net_peer_peer_.peer.md)_

---

### pipe

▸ **pipe**‹**T**›(`destination`: T, `options?`: undefined | object): _T_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[pipe](_sync_fetcher_fetcher_.fetcher.md#pipe)_

Defined in node_modules/@types/node/stream.d.ts:5

**Type parameters:**

▪ **T**: _WritableStream_

**Parameters:**

| Name          | Type                    |
| ------------- | ----------------------- |
| `destination` | T                       |
| `options?`    | undefined &#124; object |

**Returns:** _T_

---

### prependListener

▸ **prependListener**(`event`: "close", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependListener](_net_protocol_sender_.sender.md#prependlistener)_

Defined in node_modules/@types/node/stream.d.ts:97

**Parameters:**

▪ **event**: _"close"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **prependListener**(`event`: "data", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependListener](_net_protocol_sender_.sender.md#prependlistener)_

Defined in node_modules/@types/node/stream.d.ts:98

**Parameters:**

▪ **event**: _"data"_

▪ **listener**: _function_

▸ (`chunk`: any): _void_

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `chunk` | any  |

**Returns:** _this_

▸ **prependListener**(`event`: "end", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependListener](_net_protocol_sender_.sender.md#prependlistener)_

Defined in node_modules/@types/node/stream.d.ts:99

**Parameters:**

▪ **event**: _"end"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **prependListener**(`event`: "error", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependListener](_net_protocol_sender_.sender.md#prependlistener)_

Defined in node_modules/@types/node/stream.d.ts:100

**Parameters:**

▪ **event**: _"error"_

▪ **listener**: _function_

▸ (`err`: Error): _void_

**Parameters:**

| Name  | Type  |
| ----- | ----- |
| `err` | Error |

**Returns:** _this_

▸ **prependListener**(`event`: "pause", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependListener](_net_protocol_sender_.sender.md#prependlistener)_

Defined in node_modules/@types/node/stream.d.ts:101

**Parameters:**

▪ **event**: _"pause"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **prependListener**(`event`: "readable", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependListener](_net_protocol_sender_.sender.md#prependlistener)_

Defined in node_modules/@types/node/stream.d.ts:102

**Parameters:**

▪ **event**: _"readable"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **prependListener**(`event`: "resume", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependListener](_net_protocol_sender_.sender.md#prependlistener)_

Defined in node_modules/@types/node/stream.d.ts:103

**Parameters:**

▪ **event**: _"resume"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **prependListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependListener](_net_protocol_sender_.sender.md#prependlistener)_

Defined in node_modules/@types/node/stream.d.ts:104

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### prependOnceListener

▸ **prependOnceListener**(`event`: "close", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)_

Defined in node_modules/@types/node/stream.d.ts:106

**Parameters:**

▪ **event**: _"close"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **prependOnceListener**(`event`: "data", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)_

Defined in node_modules/@types/node/stream.d.ts:107

**Parameters:**

▪ **event**: _"data"_

▪ **listener**: _function_

▸ (`chunk`: any): _void_

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `chunk` | any  |

**Returns:** _this_

▸ **prependOnceListener**(`event`: "end", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)_

Defined in node_modules/@types/node/stream.d.ts:108

**Parameters:**

▪ **event**: _"end"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **prependOnceListener**(`event`: "error", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)_

Defined in node_modules/@types/node/stream.d.ts:109

**Parameters:**

▪ **event**: _"error"_

▪ **listener**: _function_

▸ (`err`: Error): _void_

**Parameters:**

| Name  | Type  |
| ----- | ----- |
| `err` | Error |

**Returns:** _this_

▸ **prependOnceListener**(`event`: "pause", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)_

Defined in node_modules/@types/node/stream.d.ts:110

**Parameters:**

▪ **event**: _"pause"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **prependOnceListener**(`event`: "readable", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)_

Defined in node_modules/@types/node/stream.d.ts:111

**Parameters:**

▪ **event**: _"readable"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **prependOnceListener**(`event`: "resume", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)_

Defined in node_modules/@types/node/stream.d.ts:112

**Parameters:**

▪ **event**: _"resume"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **prependOnceListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[prependOnceListener](_net_protocol_sender_.sender.md#prependoncelistener)_

Defined in node_modules/@types/node/stream.d.ts:113

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### process

▸ **process**(`job`: any, `result`: any): _any_

_Overrides [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[process](_sync_fetcher_fetcher_.fetcher.md#process)_

_Defined in [lib/sync/fetcher/blockfetcher.ts:80](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.ts#L80)_

Process fetch result

**Parameters:**

| Name     | Type | Description  |
| -------- | ---- | ------------ |
| `job`    | any  | fetch job    |
| `result` | any  | fetch result |

**Returns:** _any_

results of processing job or undefined if job not finished

---

### push

▸ **push**(`chunk`: any, `encoding?`: BufferEncoding): _boolean_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[push](_sync_fetcher_fetcher_.fetcher.md#push)_

Defined in node_modules/@types/node/stream.d.ts:46

**Parameters:**

| Name        | Type           |
| ----------- | -------------- |
| `chunk`     | any            |
| `encoding?` | BufferEncoding |

**Returns:** _boolean_

---

### rawListeners

▸ **rawListeners**(`event`: string | symbol): _Function[]_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[rawListeners](_net_protocol_sender_.sender.md#rawlisteners)_

Defined in node_modules/@types/node/events.d.ts:71

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _Function[]_

---

### read

▸ **read**(`size?`: undefined | number): _any_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[read](_sync_fetcher_fetcher_.fetcher.md#read)_

Defined in node_modules/@types/node/stream.d.ts:38

**Parameters:**

| Name    | Type                    |
| ------- | ----------------------- |
| `size?` | undefined &#124; number |

**Returns:** _any_

---

### removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[removeAllListeners](_net_protocol_sender_.sender.md#removealllisteners)_

Defined in node_modules/@types/node/events.d.ts:67

**Parameters:**

| Name     | Type                 |
| -------- | -------------------- |
| `event?` | string &#124; symbol |

**Returns:** _this_

---

### removeListener

▸ **removeListener**(`event`: "close", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[removeListener](_net_protocol_sender_.sender.md#removelistener)_

Defined in node_modules/@types/node/stream.d.ts:115

**Parameters:**

▪ **event**: _"close"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **removeListener**(`event`: "data", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[removeListener](_net_protocol_sender_.sender.md#removelistener)_

Defined in node_modules/@types/node/stream.d.ts:116

**Parameters:**

▪ **event**: _"data"_

▪ **listener**: _function_

▸ (`chunk`: any): _void_

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `chunk` | any  |

**Returns:** _this_

▸ **removeListener**(`event`: "end", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[removeListener](_net_protocol_sender_.sender.md#removelistener)_

Defined in node_modules/@types/node/stream.d.ts:117

**Parameters:**

▪ **event**: _"end"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **removeListener**(`event`: "error", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[removeListener](_net_protocol_sender_.sender.md#removelistener)_

Defined in node_modules/@types/node/stream.d.ts:118

**Parameters:**

▪ **event**: _"error"_

▪ **listener**: _function_

▸ (`err`: Error): _void_

**Parameters:**

| Name  | Type  |
| ----- | ----- |
| `err` | Error |

**Returns:** _this_

▸ **removeListener**(`event`: "pause", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[removeListener](_net_protocol_sender_.sender.md#removelistener)_

Defined in node_modules/@types/node/stream.d.ts:119

**Parameters:**

▪ **event**: _"pause"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **removeListener**(`event`: "readable", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[removeListener](_net_protocol_sender_.sender.md#removelistener)_

Defined in node_modules/@types/node/stream.d.ts:120

**Parameters:**

▪ **event**: _"readable"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **removeListener**(`event`: "resume", `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[removeListener](_net_protocol_sender_.sender.md#removelistener)_

Defined in node_modules/@types/node/stream.d.ts:121

**Parameters:**

▪ **event**: _"resume"_

▪ **listener**: _function_

▸ (): _void_

**Returns:** _this_

▸ **removeListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)_

_Overrides [Sender](_net_protocol_sender_.sender.md).[removeListener](_net_protocol_sender_.sender.md#removelistener)_

Defined in node_modules/@types/node/stream.d.ts:122

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### request

▸ **request**(`job`: any): _Promise‹any›_

_Overrides [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[request](_sync_fetcher_fetcher_.fetcher.md#request)_

_Defined in [lib/sync/fetcher/blockfetcher.ts:63](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.ts#L63)_

Requests blocks associated with this job

**Parameters:**

| Name  | Type | Description |
| ----- | ---- | ----------- |
| `job` | any  |             |

**Returns:** _Promise‹any›_

---

### resume

▸ **resume**(): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[resume](_sync_fetcher_fetcher_.fetcher.md#resume)_

Defined in node_modules/@types/node/stream.d.ts:41

**Returns:** _this_

---

### setEncoding

▸ **setEncoding**(`encoding`: BufferEncoding): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[setEncoding](_sync_fetcher_fetcher_.fetcher.md#setencoding)_

Defined in node_modules/@types/node/stream.d.ts:39

**Parameters:**

| Name       | Type           |
| ---------- | -------------- |
| `encoding` | BufferEncoding |

**Returns:** _this_

---

### setMaxListeners

▸ **setMaxListeners**(`n`: number): _this_

_Inherited from [Sender](_net_protocol_sender_.sender.md).[setMaxListeners](_net_protocol_sender_.sender.md#setmaxlisteners)_

Defined in node_modules/@types/node/events.d.ts:68

**Parameters:**

| Name | Type   |
| ---- | ------ |
| `n`  | number |

**Returns:** _this_

---

### store

▸ **store**(`blocks`: Array‹any›): _Promise‹void›_

_Overrides [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[store](_sync_fetcher_fetcher_.fetcher.md#store)_

_Defined in [lib/sync/fetcher/blockfetcher.ts:91](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.ts#L91)_

Store fetch result. Resolves once store operation is complete.

**Parameters:**

| Name     | Type       | Description  |
| -------- | ---------- | ------------ |
| `blocks` | Array‹any› | fetch result |

**Returns:** _Promise‹void›_

---

### `Private` success

▸ **success**(`job`: any, `result`: any): _void_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[success](_sync_fetcher_fetcher_.fetcher.md#private-success)_

_Defined in [lib/sync/fetcher/fetcher.ts:126](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L126)_

handle successful job completion

**Parameters:**

| Name     | Type | Description    |
| -------- | ---- | -------------- |
| `job`    | any  | successful job |
| `result` | any  | job result     |

**Returns:** _void_

---

### tasks

▸ **tasks**(): _object[]_

_Overrides [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[tasks](_sync_fetcher_fetcher_.fetcher.md#tasks)_

_Defined in [lib/sync/fetcher/blockfetcher.ts:44](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.ts#L44)_

Generate list of tasks to fetch

**Returns:** _object[]_

tasks

---

### unpipe

▸ **unpipe**(`destination?`: NodeJS.WritableStream): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[unpipe](_sync_fetcher_fetcher_.fetcher.md#unpipe)_

Defined in node_modules/@types/node/stream.d.ts:43

**Parameters:**

| Name           | Type                  |
| -------------- | --------------------- |
| `destination?` | NodeJS.WritableStream |

**Returns:** _this_

---

### unshift

▸ **unshift**(`chunk`: any, `encoding?`: BufferEncoding): _void_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[unshift](_sync_fetcher_fetcher_.fetcher.md#unshift)_

Defined in node_modules/@types/node/stream.d.ts:44

**Parameters:**

| Name        | Type           |
| ----------- | -------------- |
| `chunk`     | any            |
| `encoding?` | BufferEncoding |

**Returns:** _void_

---

### wait

▸ **wait**(`delay?`: undefined | number): _Promise‹void›_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[wait](_sync_fetcher_fetcher_.fetcher.md#wait)_

_Defined in [lib/sync/fetcher/fetcher.ts:332](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L332)_

**Parameters:**

| Name     | Type                    |
| -------- | ----------------------- |
| `delay?` | undefined &#124; number |

**Returns:** _Promise‹void›_

---

### wrap

▸ **wrap**(`oldStream`: ReadableStream): _this_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[wrap](_sync_fetcher_fetcher_.fetcher.md#wrap)_

Defined in node_modules/@types/node/stream.d.ts:45

**Parameters:**

| Name        | Type           |
| ----------- | -------------- |
| `oldStream` | ReadableStream |

**Returns:** _this_

---

### write

▸ **write**(): _void_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[write](_sync_fetcher_fetcher_.fetcher.md#write)_

_Defined in [lib/sync/fetcher/fetcher.ts:211](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L211)_

Setup writer pipe and start writing fetch results. A pipe is used in order
to support backpressure from storing results.

**Returns:** _void_

---

### `Static` from

▸ **from**(`iterable`: Iterable‹any› | AsyncIterable‹any›, `options?`: ReadableOptions): _Readable_

_Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[from](_sync_fetcher_fetcher_.fetcher.md#static-from)_

Defined in node_modules/@types/node/stream.d.ts:26

A utility method for creating Readable Streams out of iterators.

**Parameters:**

| Name       | Type                                    |
| ---------- | --------------------------------------- |
| `iterable` | Iterable‹any› &#124; AsyncIterable‹any› |
| `options?` | ReadableOptions                         |

**Returns:** _Readable_
