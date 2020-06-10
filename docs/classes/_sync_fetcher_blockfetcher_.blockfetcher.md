[ethereumjs-client](../README.md) › ["sync/fetcher/blockfetcher"](../modules/_sync_fetcher_blockfetcher_.md) › [BlockFetcher](_sync_fetcher_blockfetcher_.blockfetcher.md)

# Class: BlockFetcher

Implements an eth/62 based block fetcher

**`memberof`** module:sync/fetcher

## Hierarchy

  ↳ [Fetcher](_sync_fetcher_fetcher_.fetcher.md)

  ↳ **BlockFetcher**

  ↳ [HeaderFetcher](_sync_fetcher_headerfetcher_.headerfetcher.md)

## Implements

* ReadableStream

## Index

### Constructors

* [constructor](_sync_fetcher_blockfetcher_.blockfetcher.md#constructor)

### Properties

* [destroyed](_sync_fetcher_blockfetcher_.blockfetcher.md#destroyed)
* [readable](_sync_fetcher_blockfetcher_.blockfetcher.md#readable)
* [readableHighWaterMark](_sync_fetcher_blockfetcher_.blockfetcher.md#readablehighwatermark)
* [readableLength](_sync_fetcher_blockfetcher_.blockfetcher.md#readablelength)
* [readableObjectMode](_sync_fetcher_blockfetcher_.blockfetcher.md#readableobjectmode)

### Methods

* [[Symbol.asyncIterator]](_sync_fetcher_blockfetcher_.blockfetcher.md#[symbol.asynciterator])
* [_destroy](_sync_fetcher_blockfetcher_.blockfetcher.md#_destroy)
* [_read](_sync_fetcher_blockfetcher_.blockfetcher.md#_read)
* [addListener](_sync_fetcher_blockfetcher_.blockfetcher.md#addlistener)
* [dequeue](_sync_fetcher_blockfetcher_.blockfetcher.md#dequeue)
* [destroy](_sync_fetcher_blockfetcher_.blockfetcher.md#destroy)
* [emit](_sync_fetcher_blockfetcher_.blockfetcher.md#emit)
* [enqueue](_sync_fetcher_blockfetcher_.blockfetcher.md#enqueue)
* [error](_sync_fetcher_blockfetcher_.blockfetcher.md#error)
* [eventNames](_sync_fetcher_blockfetcher_.blockfetcher.md#eventnames)
* [expire](_sync_fetcher_blockfetcher_.blockfetcher.md#expire)
* [fetch](_sync_fetcher_blockfetcher_.blockfetcher.md#fetch)
* [getMaxListeners](_sync_fetcher_blockfetcher_.blockfetcher.md#getmaxlisteners)
* [isPaused](_sync_fetcher_blockfetcher_.blockfetcher.md#ispaused)
* [listenerCount](_sync_fetcher_blockfetcher_.blockfetcher.md#listenercount)
* [listeners](_sync_fetcher_blockfetcher_.blockfetcher.md#listeners)
* [next](_sync_fetcher_blockfetcher_.blockfetcher.md#next)
* [off](_sync_fetcher_blockfetcher_.blockfetcher.md#off)
* [on](_sync_fetcher_blockfetcher_.blockfetcher.md#on)
* [once](_sync_fetcher_blockfetcher_.blockfetcher.md#once)
* [pause](_sync_fetcher_blockfetcher_.blockfetcher.md#pause)
* [peer](_sync_fetcher_blockfetcher_.blockfetcher.md#peer)
* [pipe](_sync_fetcher_blockfetcher_.blockfetcher.md#pipe)
* [prependListener](_sync_fetcher_blockfetcher_.blockfetcher.md#prependlistener)
* [prependOnceListener](_sync_fetcher_blockfetcher_.blockfetcher.md#prependoncelistener)
* [process](_sync_fetcher_blockfetcher_.blockfetcher.md#process)
* [push](_sync_fetcher_blockfetcher_.blockfetcher.md#push)
* [rawListeners](_sync_fetcher_blockfetcher_.blockfetcher.md#rawlisteners)
* [read](_sync_fetcher_blockfetcher_.blockfetcher.md#read)
* [removeAllListeners](_sync_fetcher_blockfetcher_.blockfetcher.md#removealllisteners)
* [removeListener](_sync_fetcher_blockfetcher_.blockfetcher.md#removelistener)
* [request](_sync_fetcher_blockfetcher_.blockfetcher.md#request)
* [resume](_sync_fetcher_blockfetcher_.blockfetcher.md#resume)
* [setEncoding](_sync_fetcher_blockfetcher_.blockfetcher.md#setencoding)
* [setMaxListeners](_sync_fetcher_blockfetcher_.blockfetcher.md#setmaxlisteners)
* [store](_sync_fetcher_blockfetcher_.blockfetcher.md#store)
* [tasks](_sync_fetcher_blockfetcher_.blockfetcher.md#tasks)
* [unpipe](_sync_fetcher_blockfetcher_.blockfetcher.md#unpipe)
* [unshift](_sync_fetcher_blockfetcher_.blockfetcher.md#unshift)
* [wait](_sync_fetcher_blockfetcher_.blockfetcher.md#wait)
* [wrap](_sync_fetcher_blockfetcher_.blockfetcher.md#wrap)
* [write](_sync_fetcher_blockfetcher_.blockfetcher.md#write)
* [from](_sync_fetcher_blockfetcher_.blockfetcher.md#static-from)

## Constructors

###  constructor

\+ **new BlockFetcher**(`options`: object): *[BlockFetcher](_sync_fetcher_blockfetcher_.blockfetcher.md)*

*Overrides [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[constructor](_sync_fetcher_fetcher_.fetcher.md#constructor)*

*Defined in [lib/sync/fetcher/blockfetcher.js:15](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.js#L15)*

Create new block fetcher

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[BlockFetcher](_sync_fetcher_blockfetcher_.blockfetcher.md)*

## Properties

###  destroyed

• **destroyed**: *boolean*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[destroyed](_sync_fetcher_fetcher_.fetcher.md#destroyed)*

Defined in node_modules/@types/node/stream.d.ts:32

___

###  readable

• **readable**: *boolean*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[readable](_sync_fetcher_fetcher_.fetcher.md#readable)*

Defined in node_modules/@types/node/stream.d.ts:28

___

###  readableHighWaterMark

• **readableHighWaterMark**: *number*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[readableHighWaterMark](_sync_fetcher_fetcher_.fetcher.md#readablehighwatermark)*

Defined in node_modules/@types/node/stream.d.ts:29

___

###  readableLength

• **readableLength**: *number*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[readableLength](_sync_fetcher_fetcher_.fetcher.md#readablelength)*

Defined in node_modules/@types/node/stream.d.ts:30

___

###  readableObjectMode

• **readableObjectMode**: *boolean*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[readableObjectMode](_sync_fetcher_fetcher_.fetcher.md#readableobjectmode)*

Defined in node_modules/@types/node/stream.d.ts:31

## Methods

###  [Symbol.asyncIterator]

▸ **[Symbol.asyncIterator]**(): *AsyncIterableIterator‹any›*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[[Symbol.asyncIterator]](_sync_fetcher_fetcher_.fetcher.md#[symbol.asynciterator])*

Defined in node_modules/@types/node/stream.d.ts:121

**Returns:** *AsyncIterableIterator‹any›*

___

###  _destroy

▸ **_destroy**(`error`: Error | null, `callback`: function): *void*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[_destroy](_sync_fetcher_fetcher_.fetcher.md#_destroy)*

Defined in node_modules/@types/node/stream.d.ts:44

**Parameters:**

▪ **error**: *Error | null*

▪ **callback**: *function*

▸ (`error?`: Error | null): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error?` | Error &#124; null |

**Returns:** *void*

___

###  _read

▸ **_read**(): *void*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[_read](_sync_fetcher_fetcher_.fetcher.md#_read)*

*Overrides void*

*Defined in [lib/sync/fetcher/fetcher.js:98](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L98)*

Implements Readable._read() by pushing completed tasks to the read queue

**Returns:** *void*

___

###  addListener

▸ **addListener**(`event`: "close", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:58

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

▪ **event**: *"close"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **addListener**(`event`: "data", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:59

**Parameters:**

▪ **event**: *"data"*

▪ **listener**: *function*

▸ (`chunk`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`chunk` | any |

**Returns:** *this*

▸ **addListener**(`event`: "end", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:60

**Parameters:**

▪ **event**: *"end"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **addListener**(`event`: "error", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:61

**Parameters:**

▪ **event**: *"error"*

▪ **listener**: *function*

▸ (`err`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error |

**Returns:** *this*

▸ **addListener**(`event`: "pause", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:62

**Parameters:**

▪ **event**: *"pause"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **addListener**(`event`: "readable", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:63

**Parameters:**

▪ **event**: *"readable"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **addListener**(`event`: "resume", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:64

**Parameters:**

▪ **event**: *"resume"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **addListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[addListener](_sync_fetcher_fetcher_.fetcher.md#addlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:65

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  dequeue

▸ **dequeue**(): *void*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[dequeue](_sync_fetcher_fetcher_.fetcher.md#dequeue)*

*Defined in [lib/sync/fetcher/fetcher.js:84](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L84)*

Dequeue all done tasks that completed in order

**Returns:** *void*

___

###  destroy

▸ **destroy**(`error?`: Error): *void*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[destroy](_sync_fetcher_fetcher_.fetcher.md#destroy)*

Defined in node_modules/@types/node/stream.d.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`error?` | Error |

**Returns:** *void*

___

###  emit

▸ **emit**(`event`: "close"): *boolean*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:67

**Parameters:**

Name | Type |
------ | ------ |
`event` | "close" |

**Returns:** *boolean*

▸ **emit**(`event`: "data", `chunk`: any): *boolean*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`event` | "data" |
`chunk` | any |

**Returns:** *boolean*

▸ **emit**(`event`: "end"): *boolean*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:69

**Parameters:**

Name | Type |
------ | ------ |
`event` | "end" |

**Returns:** *boolean*

▸ **emit**(`event`: "error", `err`: Error): *boolean*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`event` | "error" |
`err` | Error |

**Returns:** *boolean*

▸ **emit**(`event`: "pause"): *boolean*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:71

**Parameters:**

Name | Type |
------ | ------ |
`event` | "pause" |

**Returns:** *boolean*

▸ **emit**(`event`: "readable"): *boolean*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:72

**Parameters:**

Name | Type |
------ | ------ |
`event` | "readable" |

**Returns:** *boolean*

▸ **emit**(`event`: "resume"): *boolean*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`event` | "resume" |

**Returns:** *boolean*

▸ **emit**(`event`: string | symbol, ...`args`: any[]): *boolean*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[emit](_sync_fetcher_fetcher_.fetcher.md#emit)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |
`...args` | any[] |

**Returns:** *boolean*

___

###  enqueue

▸ **enqueue**(`job`: Object): *void*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[enqueue](_sync_fetcher_fetcher_.fetcher.md#enqueue)*

*Defined in [lib/sync/fetcher/fetcher.js:70](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L70)*

Enqueue job

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`job` | Object |   |

**Returns:** *void*

___

###  error

▸ **error**(`error`: Error, `job`: any): *void*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[error](_sync_fetcher_fetcher_.fetcher.md#error)*

*Defined in [lib/sync/fetcher/fetcher.js:181](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L181)*

Handle error

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`error` | Error | error object |
`job` | any | - |

**Returns:** *void*

___

###  eventNames

▸ **eventNames**(): *Array‹string | symbol›*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[eventNames](_sync_fetcher_fetcher_.fetcher.md#eventnames)*

Defined in node_modules/@types/node/globals.d.ts:568

**Returns:** *Array‹string | symbol›*

___

###  expire

▸ **expire**(`job`: any): *void*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[expire](_sync_fetcher_fetcher_.fetcher.md#expire)*

*Defined in [lib/sync/fetcher/fetcher.js:286](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L286)*

Expire job that has timed out and ban associated peer. Timed out tasks will
be re-inserted into the queue.

**Parameters:**

Name | Type |
------ | ------ |
`job` | any |

**Returns:** *void*

___

###  fetch

▸ **fetch**(): *Promise‹any›*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[fetch](_sync_fetcher_fetcher_.fetcher.md#fetch)*

*Defined in [lib/sync/fetcher/fetcher.js:226](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L226)*

Run the fetcher. Returns a promise that resolves once all tasks are completed.

**Returns:** *Promise‹any›*

___

###  getMaxListeners

▸ **getMaxListeners**(): *number*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[getMaxListeners](_sync_fetcher_fetcher_.fetcher.md#getmaxlisteners)*

Defined in node_modules/@types/node/globals.d.ts:560

**Returns:** *number*

___

###  isPaused

▸ **isPaused**(): *boolean*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[isPaused](_sync_fetcher_fetcher_.fetcher.md#ispaused)*

Defined in node_modules/@types/node/stream.d.ts:39

**Returns:** *boolean*

___

###  listenerCount

▸ **listenerCount**(`type`: string | symbol): *number*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[listenerCount](_sync_fetcher_fetcher_.fetcher.md#listenercount)*

Defined in node_modules/@types/node/globals.d.ts:564

**Parameters:**

Name | Type |
------ | ------ |
`type` | string &#124; symbol |

**Returns:** *number*

___

###  listeners

▸ **listeners**(`event`: string | symbol): *Function[]*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[listeners](_sync_fetcher_fetcher_.fetcher.md#listeners)*

Defined in node_modules/@types/node/globals.d.ts:561

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  next

▸ **next**(): *any*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[next](_sync_fetcher_fetcher_.fetcher.md#next)*

*Defined in [lib/sync/fetcher/fetcher.js:148](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L148)*

Process next task

**Returns:** *any*

___

###  off

▸ **off**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[off](_sync_fetcher_fetcher_.fetcher.md#off)*

Defined in node_modules/@types/node/globals.d.ts:557

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  on

▸ **on**(`event`: "close", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:76

**Parameters:**

▪ **event**: *"close"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **on**(`event`: "data", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:77

**Parameters:**

▪ **event**: *"data"*

▪ **listener**: *function*

▸ (`chunk`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`chunk` | any |

**Returns:** *this*

▸ **on**(`event`: "end", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:78

**Parameters:**

▪ **event**: *"end"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **on**(`event`: "error", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:79

**Parameters:**

▪ **event**: *"error"*

▪ **listener**: *function*

▸ (`err`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error |

**Returns:** *this*

▸ **on**(`event`: "pause", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:80

**Parameters:**

▪ **event**: *"pause"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **on**(`event`: "readable", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:81

**Parameters:**

▪ **event**: *"readable"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **on**(`event`: "resume", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:82

**Parameters:**

▪ **event**: *"resume"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **on**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[on](_sync_fetcher_fetcher_.fetcher.md#on)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:83

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  once

▸ **once**(`event`: "close", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:85

**Parameters:**

▪ **event**: *"close"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **once**(`event`: "data", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:86

**Parameters:**

▪ **event**: *"data"*

▪ **listener**: *function*

▸ (`chunk`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`chunk` | any |

**Returns:** *this*

▸ **once**(`event`: "end", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:87

**Parameters:**

▪ **event**: *"end"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **once**(`event`: "error", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:88

**Parameters:**

▪ **event**: *"error"*

▪ **listener**: *function*

▸ (`err`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error |

**Returns:** *this*

▸ **once**(`event`: "pause", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:89

**Parameters:**

▪ **event**: *"pause"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **once**(`event`: "readable", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:90

**Parameters:**

▪ **event**: *"readable"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **once**(`event`: "resume", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:91

**Parameters:**

▪ **event**: *"resume"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **once**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[once](_sync_fetcher_fetcher_.fetcher.md#once)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:92

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  pause

▸ **pause**(): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[pause](_sync_fetcher_fetcher_.fetcher.md#pause)*

Defined in node_modules/@types/node/stream.d.ts:37

**Returns:** *this*

___

###  peer

▸ **peer**(`job`: Object): *any*

*Overrides [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[peer](_sync_fetcher_fetcher_.fetcher.md#peer)*

*Defined in [lib/sync/fetcher/blockfetcher.js:97](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.js#L97)*

Returns a peer that can process the given job

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`job` | Object | job |

**Returns:** *any*

___

###  pipe

▸ **pipe**‹**T**›(`destination`: T, `options?`: undefined | object): *T*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[pipe](_sync_fetcher_fetcher_.fetcher.md#pipe)*

Defined in node_modules/@types/node/stream.d.ts:5

**Type parameters:**

▪ **T**: *WritableStream*

**Parameters:**

Name | Type |
------ | ------ |
`destination` | T |
`options?` | undefined &#124; object |

**Returns:** *T*

___

###  prependListener

▸ **prependListener**(`event`: "close", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:94

**Parameters:**

▪ **event**: *"close"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **prependListener**(`event`: "data", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:95

**Parameters:**

▪ **event**: *"data"*

▪ **listener**: *function*

▸ (`chunk`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`chunk` | any |

**Returns:** *this*

▸ **prependListener**(`event`: "end", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:96

**Parameters:**

▪ **event**: *"end"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **prependListener**(`event`: "error", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:97

**Parameters:**

▪ **event**: *"error"*

▪ **listener**: *function*

▸ (`err`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error |

**Returns:** *this*

▸ **prependListener**(`event`: "pause", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:98

**Parameters:**

▪ **event**: *"pause"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **prependListener**(`event`: "readable", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:99

**Parameters:**

▪ **event**: *"readable"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **prependListener**(`event`: "resume", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:100

**Parameters:**

▪ **event**: *"resume"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **prependListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependListener](_sync_fetcher_fetcher_.fetcher.md#prependlistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:101

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  prependOnceListener

▸ **prependOnceListener**(`event`: "close", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:103

**Parameters:**

▪ **event**: *"close"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **prependOnceListener**(`event`: "data", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:104

**Parameters:**

▪ **event**: *"data"*

▪ **listener**: *function*

▸ (`chunk`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`chunk` | any |

**Returns:** *this*

▸ **prependOnceListener**(`event`: "end", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:105

**Parameters:**

▪ **event**: *"end"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **prependOnceListener**(`event`: "error", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:106

**Parameters:**

▪ **event**: *"error"*

▪ **listener**: *function*

▸ (`err`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error |

**Returns:** *this*

▸ **prependOnceListener**(`event`: "pause", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:107

**Parameters:**

▪ **event**: *"pause"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **prependOnceListener**(`event`: "readable", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:108

**Parameters:**

▪ **event**: *"readable"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **prependOnceListener**(`event`: "resume", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:109

**Parameters:**

▪ **event**: *"resume"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **prependOnceListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[prependOnceListener](_sync_fetcher_fetcher_.fetcher.md#prependoncelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:110

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  process

▸ **process**(`job`: Object, `result`: Object): *any*

*Overrides [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[process](_sync_fetcher_fetcher_.fetcher.md#process)*

*Defined in [lib/sync/fetcher/blockfetcher.js:77](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.js#L77)*

Process fetch result

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`job` | Object | fetch job |
`result` | Object | fetch result |

**Returns:** *any*

results of processing job or undefined if job not finished

___

###  push

▸ **push**(`chunk`: any, `encoding?`: BufferEncoding): *boolean*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[push](_sync_fetcher_fetcher_.fetcher.md#push)*

Defined in node_modules/@types/node/stream.d.ts:43

**Parameters:**

Name | Type |
------ | ------ |
`chunk` | any |
`encoding?` | BufferEncoding |

**Returns:** *boolean*

___

###  rawListeners

▸ **rawListeners**(`event`: string | symbol): *Function[]*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[rawListeners](_sync_fetcher_fetcher_.fetcher.md#rawlisteners)*

Defined in node_modules/@types/node/globals.d.ts:562

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  read

▸ **read**(`size?`: undefined | number): *any*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[read](_sync_fetcher_fetcher_.fetcher.md#read)*

Defined in node_modules/@types/node/stream.d.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`size?` | undefined &#124; number |

**Returns:** *any*

___

###  removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeAllListeners](_sync_fetcher_fetcher_.fetcher.md#removealllisteners)*

Defined in node_modules/@types/node/globals.d.ts:558

**Parameters:**

Name | Type |
------ | ------ |
`event?` | string &#124; symbol |

**Returns:** *this*

___

###  removeListener

▸ **removeListener**(`event`: "close", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:112

**Parameters:**

▪ **event**: *"close"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **removeListener**(`event`: "data", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:113

**Parameters:**

▪ **event**: *"data"*

▪ **listener**: *function*

▸ (`chunk`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`chunk` | any |

**Returns:** *this*

▸ **removeListener**(`event`: "end", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:114

**Parameters:**

▪ **event**: *"end"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **removeListener**(`event`: "error", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:115

**Parameters:**

▪ **event**: *"error"*

▪ **listener**: *function*

▸ (`err`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error |

**Returns:** *this*

▸ **removeListener**(`event`: "pause", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:116

**Parameters:**

▪ **event**: *"pause"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **removeListener**(`event`: "readable", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:117

**Parameters:**

▪ **event**: *"readable"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **removeListener**(`event`: "resume", `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:118

**Parameters:**

▪ **event**: *"resume"*

▪ **listener**: *function*

▸ (): *void*

**Returns:** *this*

▸ **removeListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[removeListener](_sync_fetcher_fetcher_.fetcher.md#removelistener)*

*Overrides void*

Defined in node_modules/@types/node/stream.d.ts:119

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  request

▸ **request**(`job`: Object): *Promise‹any›*

*Overrides [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[request](_sync_fetcher_fetcher_.fetcher.md#request)*

*Defined in [lib/sync/fetcher/blockfetcher.js:62](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.js#L62)*

Requests blocks associated with this job

**Parameters:**

Name | Type |
------ | ------ |
`job` | Object |

**Returns:** *Promise‹any›*

___

###  resume

▸ **resume**(): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[resume](_sync_fetcher_fetcher_.fetcher.md#resume)*

Defined in node_modules/@types/node/stream.d.ts:38

**Returns:** *this*

___

###  setEncoding

▸ **setEncoding**(`encoding`: BufferEncoding): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[setEncoding](_sync_fetcher_fetcher_.fetcher.md#setencoding)*

Defined in node_modules/@types/node/stream.d.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`encoding` | BufferEncoding |

**Returns:** *this*

___

###  setMaxListeners

▸ **setMaxListeners**(`n`: number): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[setMaxListeners](_sync_fetcher_fetcher_.fetcher.md#setmaxlisteners)*

Defined in node_modules/@types/node/globals.d.ts:559

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *this*

___

###  store

▸ **store**(`blocks`: any[]): *Promise‹any›*

*Overrides [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[store](_sync_fetcher_fetcher_.fetcher.md#store)*

*Defined in [lib/sync/fetcher/blockfetcher.js:88](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.js#L88)*

Store fetch result. Resolves once store operation is complete.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blocks` | any[] | fetch result |

**Returns:** *Promise‹any›*

___

###  tasks

▸ **tasks**(): *Object[]*

*Overrides [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[tasks](_sync_fetcher_fetcher_.fetcher.md#tasks)*

*Defined in [lib/sync/fetcher/blockfetcher.js:42](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.js#L42)*

Generate list of tasks to fetch

**Returns:** *Object[]*

tasks

___

###  unpipe

▸ **unpipe**(`destination?`: NodeJS.WritableStream): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[unpipe](_sync_fetcher_fetcher_.fetcher.md#unpipe)*

Defined in node_modules/@types/node/stream.d.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`destination?` | NodeJS.WritableStream |

**Returns:** *this*

___

###  unshift

▸ **unshift**(`chunk`: any, `encoding?`: BufferEncoding): *void*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[unshift](_sync_fetcher_fetcher_.fetcher.md#unshift)*

Defined in node_modules/@types/node/stream.d.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`chunk` | any |
`encoding?` | BufferEncoding |

**Returns:** *void*

___

###  wait

▸ **wait**(`delay`: any): *Promise‹void›*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[wait](_sync_fetcher_fetcher_.fetcher.md#wait)*

*Defined in [lib/sync/fetcher/fetcher.js:306](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L306)*

**Parameters:**

Name | Type |
------ | ------ |
`delay` | any |

**Returns:** *Promise‹void›*

___

###  wrap

▸ **wrap**(`oldStream`: ReadableStream): *this*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[wrap](_sync_fetcher_fetcher_.fetcher.md#wrap)*

Defined in node_modules/@types/node/stream.d.ts:42

**Parameters:**

Name | Type |
------ | ------ |
`oldStream` | ReadableStream |

**Returns:** *this*

___

###  write

▸ **write**(): *void*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[write](_sync_fetcher_fetcher_.fetcher.md#write)*

*Defined in [lib/sync/fetcher/fetcher.js:191](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.js#L191)*

Setup writer pipe and start writing fetch results. A pipe is used in order
to support backpressure from storing results.

**Returns:** *void*

___

### `Static` from

▸ **from**(`iterable`: Iterable‹any› | AsyncIterable‹any›, `options?`: ReadableOptions): *Readable*

*Inherited from [Fetcher](_sync_fetcher_fetcher_.fetcher.md).[from](_sync_fetcher_fetcher_.fetcher.md#static-from)*

Defined in node_modules/@types/node/stream.d.ts:26

A utility method for creating Readable Streams out of iterators.

**Parameters:**

Name | Type |
------ | ------ |
`iterable` | Iterable‹any› &#124; AsyncIterable‹any› |
`options?` | ReadableOptions |

**Returns:** *Readable*
