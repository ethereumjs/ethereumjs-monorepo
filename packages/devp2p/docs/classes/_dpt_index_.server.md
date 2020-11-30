**[ethereumjs-devp2p](../README.md)**

> [Globals](../README.md) / ["dpt/index"](../modules/_dpt_index_.md) / Server

# Class: Server

## Hierarchy

* EventEmitter

  ↳ **Server**

## Index

### Constructors

* [constructor](_dpt_index_.server.md#constructor)

### Properties

* [\_dpt](_dpt_index_.server.md#_dpt)
* [\_endpoint](_dpt_index_.server.md#_endpoint)
* [\_parityRequestMap](_dpt_index_.server.md#_parityrequestmap)
* [\_privateKey](_dpt_index_.server.md#_privatekey)
* [\_requests](_dpt_index_.server.md#_requests)
* [\_requestsCache](_dpt_index_.server.md#_requestscache)
* [\_socket](_dpt_index_.server.md#_socket)
* [\_timeout](_dpt_index_.server.md#_timeout)
* [defaultMaxListeners](_dpt_index_.server.md#defaultmaxlisteners)
* [errorMonitor](_dpt_index_.server.md#errormonitor)

### Methods

* [\_handler](_dpt_index_.server.md#_handler)
* [\_isAliveCheck](_dpt_index_.server.md#_isalivecheck)
* [\_send](_dpt_index_.server.md#_send)
* [addListener](_dpt_index_.server.md#addlistener)
* [bind](_dpt_index_.server.md#bind)
* [destroy](_dpt_index_.server.md#destroy)
* [emit](_dpt_index_.server.md#emit)
* [eventNames](_dpt_index_.server.md#eventnames)
* [findneighbours](_dpt_index_.server.md#findneighbours)
* [getMaxListeners](_dpt_index_.server.md#getmaxlisteners)
* [listenerCount](_dpt_index_.server.md#listenercount)
* [listeners](_dpt_index_.server.md#listeners)
* [off](_dpt_index_.server.md#off)
* [on](_dpt_index_.server.md#on)
* [once](_dpt_index_.server.md#once)
* [ping](_dpt_index_.server.md#ping)
* [prependListener](_dpt_index_.server.md#prependlistener)
* [prependOnceListener](_dpt_index_.server.md#prependoncelistener)
* [rawListeners](_dpt_index_.server.md#rawlisteners)
* [removeAllListeners](_dpt_index_.server.md#removealllisteners)
* [removeListener](_dpt_index_.server.md#removelistener)
* [setMaxListeners](_dpt_index_.server.md#setmaxlisteners)
* [listenerCount](_dpt_index_.server.md#listenercount)

## Constructors

### constructor

\+ **new Server**(`dpt`: [DPT](_index_.dpt.md), `privateKey`: Buffer, `options`: [DptServerOptions](../interfaces/_index_.dptserveroptions.md)): [Server](_dpt_index_.server.md)

*Overrides void*

*Defined in [src/dpt/server.ts:31](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L31)*

#### Parameters:

Name | Type |
------ | ------ |
`dpt` | [DPT](_index_.dpt.md) |
`privateKey` | Buffer |
`options` | [DptServerOptions](../interfaces/_index_.dptserveroptions.md) |

**Returns:** [Server](_dpt_index_.server.md)

## Properties

### \_dpt

•  **\_dpt**: [DPT](_index_.dpt.md)

*Defined in [src/dpt/server.ts:24](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L24)*

___

### \_endpoint

•  **\_endpoint**: [PeerInfo](../interfaces/_index_.peerinfo.md)

*Defined in [src/dpt/server.ts:27](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L27)*

___

### \_parityRequestMap

•  **\_parityRequestMap**: Map\<string, string>

*Defined in [src/dpt/server.ts:29](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L29)*

___

### \_privateKey

•  **\_privateKey**: Buffer

*Defined in [src/dpt/server.ts:25](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L25)*

___

### \_requests

•  **\_requests**: Map\<string, any>

*Defined in [src/dpt/server.ts:28](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L28)*

___

### \_requestsCache

•  **\_requestsCache**: LRUCache\<string, Promise\<any>>

*Defined in [src/dpt/server.ts:30](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L30)*

___

### \_socket

•  **\_socket**: DgramSocket \| null

*Defined in [src/dpt/server.ts:31](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L31)*

___

### \_timeout

•  **\_timeout**: number

*Defined in [src/dpt/server.ts:26](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L26)*

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: number

*Inherited from [DPT](_index_.dpt.md).[defaultMaxListeners](_index_.dpt.md#defaultmaxlisteners)*

*Defined in node_modules/@types/node/events.d.ts:45*

___

### errorMonitor

▪ `Static` **errorMonitor**: keyof symbol

*Inherited from [DPT](_index_.dpt.md).[errorMonitor](_index_.dpt.md#errormonitor)*

*Defined in node_modules/@types/node/events.d.ts:55*

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

## Methods

### \_handler

▸ **_handler**(`msg`: Buffer, `rinfo`: RemoteInfo): void

*Defined in [src/dpt/server.ts:150](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L150)*

#### Parameters:

Name | Type |
------ | ------ |
`msg` | Buffer |
`rinfo` | RemoteInfo |

**Returns:** void

___

### \_isAliveCheck

▸ **_isAliveCheck**(): void

*Defined in [src/dpt/server.ts:119](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L119)*

**Returns:** void

___

### \_send

▸ **_send**(`peer`: [PeerInfo](../interfaces/_index_.peerinfo.md), `typename`: string, `data`: any): Buffer

*Defined in [src/dpt/server.ts:123](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L123)*

#### Parameters:

Name | Type |
------ | ------ |
`peer` | [PeerInfo](../interfaces/_index_.peerinfo.md) |
`typename` | string |
`data` | any |

**Returns:** Buffer

___

### addListener

▸ **addListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [DPT](_index_.dpt.md).[addListener](_index_.dpt.md#addlistener)*

*Defined in node_modules/@types/node/events.d.ts:62*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### bind

▸ **bind**(...`args`: any[]): void

*Defined in [src/dpt/server.ts:61](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L61)*

#### Parameters:

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** void

___

### destroy

▸ **destroy**(...`args`: any[]): void

*Defined in [src/dpt/server.ts:68](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L68)*

#### Parameters:

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** void

___

### emit

▸ **emit**(`event`: string \| symbol, ...`args`: any[]): boolean

*Inherited from [DPT](_index_.dpt.md).[emit](_index_.dpt.md#emit)*

*Defined in node_modules/@types/node/events.d.ts:72*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`...args` | any[] |

**Returns:** boolean

___

### eventNames

▸ **eventNames**(): Array\<string \| symbol>

*Inherited from [DPT](_index_.dpt.md).[eventNames](_index_.dpt.md#eventnames)*

*Defined in node_modules/@types/node/events.d.ts:77*

**Returns:** Array\<string \| symbol>

___

### findneighbours

▸ **findneighbours**(`peer`: [PeerInfo](../interfaces/_index_.peerinfo.md), `id`: Buffer): void

*Defined in [src/dpt/server.ts:114](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L114)*

#### Parameters:

Name | Type |
------ | ------ |
`peer` | [PeerInfo](../interfaces/_index_.peerinfo.md) |
`id` | Buffer |

**Returns:** void

___

### getMaxListeners

▸ **getMaxListeners**(): number

*Inherited from [DPT](_index_.dpt.md).[getMaxListeners](_index_.dpt.md#getmaxlisteners)*

*Defined in node_modules/@types/node/events.d.ts:69*

**Returns:** number

___

### listenerCount

▸ **listenerCount**(`event`: string \| symbol): number

*Inherited from [DPT](_index_.dpt.md).[listenerCount](_index_.dpt.md#listenercount)*

*Defined in node_modules/@types/node/events.d.ts:73*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |

**Returns:** number

___

### listeners

▸ **listeners**(`event`: string \| symbol): Function[]

*Inherited from [DPT](_index_.dpt.md).[listeners](_index_.dpt.md#listeners)*

*Defined in node_modules/@types/node/events.d.ts:70*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |

**Returns:** Function[]

___

### off

▸ **off**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [DPT](_index_.dpt.md).[off](_index_.dpt.md#off)*

*Defined in node_modules/@types/node/events.d.ts:66*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### on

▸ **on**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [DPT](_index_.dpt.md).[on](_index_.dpt.md#on)*

*Defined in node_modules/@types/node/events.d.ts:63*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### once

▸ **once**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [DPT](_index_.dpt.md).[once](_index_.dpt.md#once)*

*Defined in node_modules/@types/node/events.d.ts:64*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### ping

▸ **ping**(`peer`: [PeerInfo](../interfaces/_index_.peerinfo.md)): Promise\<any>

*Defined in [src/dpt/server.ts:78](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/server.ts#L78)*

#### Parameters:

Name | Type |
------ | ------ |
`peer` | [PeerInfo](../interfaces/_index_.peerinfo.md) |

**Returns:** Promise\<any>

___

### prependListener

▸ **prependListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [DPT](_index_.dpt.md).[prependListener](_index_.dpt.md#prependlistener)*

*Defined in node_modules/@types/node/events.d.ts:75*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### prependOnceListener

▸ **prependOnceListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [DPT](_index_.dpt.md).[prependOnceListener](_index_.dpt.md#prependoncelistener)*

*Defined in node_modules/@types/node/events.d.ts:76*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### rawListeners

▸ **rawListeners**(`event`: string \| symbol): Function[]

*Inherited from [DPT](_index_.dpt.md).[rawListeners](_index_.dpt.md#rawlisteners)*

*Defined in node_modules/@types/node/events.d.ts:71*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |

**Returns:** Function[]

___

### removeAllListeners

▸ **removeAllListeners**(`event?`: string \| symbol): this

*Inherited from [DPT](_index_.dpt.md).[removeAllListeners](_index_.dpt.md#removealllisteners)*

*Defined in node_modules/@types/node/events.d.ts:67*

#### Parameters:

Name | Type |
------ | ------ |
`event?` | string \| symbol |

**Returns:** this

___

### removeListener

▸ **removeListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [DPT](_index_.dpt.md).[removeListener](_index_.dpt.md#removelistener)*

*Defined in node_modules/@types/node/events.d.ts:65*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### setMaxListeners

▸ **setMaxListeners**(`n`: number): this

*Inherited from [DPT](_index_.dpt.md).[setMaxListeners](_index_.dpt.md#setmaxlisteners)*

*Defined in node_modules/@types/node/events.d.ts:68*

#### Parameters:

Name | Type |
------ | ------ |
`n` | number |

**Returns:** this

___

### listenerCount

▸ `Static`**listenerCount**(`emitter`: EventEmitter, `event`: string \| symbol): number

*Inherited from [DPT](_index_.dpt.md).[listenerCount](_index_.dpt.md#listenercount)*

*Defined in node_modules/@types/node/events.d.ts:44*

**`deprecated`** since v4.0.0

#### Parameters:

Name | Type |
------ | ------ |
`emitter` | EventEmitter |
`event` | string \| symbol |

**Returns:** number
