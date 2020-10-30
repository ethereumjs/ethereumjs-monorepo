**[ethereumjs-devp2p](../README.md)**

> [Globals](../README.md) / ["rlpx/rlpx"](../modules/_rlpx_rlpx_.md) / RLPx

# Class: RLPx

## Hierarchy

* EventEmitter

  ↳ **RLPx**

## Index

### Constructors

* [constructor](_rlpx_rlpx_.rlpx.md#constructor)

### Properties

* [\_capabilities](_rlpx_rlpx_.rlpx.md#_capabilities)
* [\_clientId](_rlpx_rlpx_.rlpx.md#_clientid)
* [\_dpt](_rlpx_rlpx_.rlpx.md#_dpt)
* [\_id](_rlpx_rlpx_.rlpx.md#_id)
* [\_listenPort](_rlpx_rlpx_.rlpx.md#_listenport)
* [\_maxPeers](_rlpx_rlpx_.rlpx.md#_maxpeers)
* [\_peers](_rlpx_rlpx_.rlpx.md#_peers)
* [\_peersLRU](_rlpx_rlpx_.rlpx.md#_peerslru)
* [\_peersQueue](_rlpx_rlpx_.rlpx.md#_peersqueue)
* [\_privateKey](_rlpx_rlpx_.rlpx.md#_privatekey)
* [\_refillIntervalId](_rlpx_rlpx_.rlpx.md#_refillintervalid)
* [\_remoteClientIdFilter](_rlpx_rlpx_.rlpx.md#_remoteclientidfilter)
* [\_server](_rlpx_rlpx_.rlpx.md#_server)
* [\_timeout](_rlpx_rlpx_.rlpx.md#_timeout)
* [defaultMaxListeners](_rlpx_rlpx_.rlpx.md#defaultmaxlisteners)
* [errorMonitor](_rlpx_rlpx_.rlpx.md#errormonitor)

### Methods

* [\_connectToPeer](_rlpx_rlpx_.rlpx.md#_connecttopeer)
* [\_getOpenSlots](_rlpx_rlpx_.rlpx.md#_getopenslots)
* [\_isAlive](_rlpx_rlpx_.rlpx.md#_isalive)
* [\_isAliveCheck](_rlpx_rlpx_.rlpx.md#_isalivecheck)
* [\_onConnect](_rlpx_rlpx_.rlpx.md#_onconnect)
* [\_refillConnections](_rlpx_rlpx_.rlpx.md#_refillconnections)
* [addListener](_rlpx_rlpx_.rlpx.md#addlistener)
* [connect](_rlpx_rlpx_.rlpx.md#connect)
* [destroy](_rlpx_rlpx_.rlpx.md#destroy)
* [disconnect](_rlpx_rlpx_.rlpx.md#disconnect)
* [emit](_rlpx_rlpx_.rlpx.md#emit)
* [eventNames](_rlpx_rlpx_.rlpx.md#eventnames)
* [getMaxListeners](_rlpx_rlpx_.rlpx.md#getmaxlisteners)
* [getPeers](_rlpx_rlpx_.rlpx.md#getpeers)
* [listen](_rlpx_rlpx_.rlpx.md#listen)
* [listenerCount](_rlpx_rlpx_.rlpx.md#listenercount)
* [listeners](_rlpx_rlpx_.rlpx.md#listeners)
* [off](_rlpx_rlpx_.rlpx.md#off)
* [on](_rlpx_rlpx_.rlpx.md#on)
* [once](_rlpx_rlpx_.rlpx.md#once)
* [prependListener](_rlpx_rlpx_.rlpx.md#prependlistener)
* [prependOnceListener](_rlpx_rlpx_.rlpx.md#prependoncelistener)
* [rawListeners](_rlpx_rlpx_.rlpx.md#rawlisteners)
* [removeAllListeners](_rlpx_rlpx_.rlpx.md#removealllisteners)
* [removeListener](_rlpx_rlpx_.rlpx.md#removelistener)
* [setMaxListeners](_rlpx_rlpx_.rlpx.md#setmaxlisteners)
* [listenerCount](_rlpx_rlpx_.rlpx.md#listenercount)

## Constructors

### constructor

\+ **new RLPx**(`privateKey`: Buffer, `options`: [RLPxOptions](../interfaces/_index_.rlpxoptions.md)): [RLPx](_rlpx_rlpx_.rlpx.md)

*Overrides void*

*Defined in [src/rlpx/rlpx.ts:41](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L41)*

#### Parameters:

Name | Type |
------ | ------ |
`privateKey` | Buffer |
`options` | [RLPxOptions](../interfaces/_index_.rlpxoptions.md) |

**Returns:** [RLPx](_rlpx_rlpx_.rlpx.md)

## Properties

### \_capabilities

•  **\_capabilities**: [Capabilities](../interfaces/_index_.capabilities.md)[]

*Defined in [src/rlpx/rlpx.ts:34](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L34)*

___

### \_clientId

•  **\_clientId**: Buffer

*Defined in [src/rlpx/rlpx.ts:32](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L32)*

___

### \_dpt

•  **\_dpt**: [DPT](_index_.dpt.md)

*Defined in [src/rlpx/rlpx.ts:36](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L36)*

___

### \_id

•  **\_id**: Buffer

*Defined in [src/rlpx/rlpx.ts:29](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L29)*

___

### \_listenPort

•  **\_listenPort**: number \| null

*Defined in [src/rlpx/rlpx.ts:35](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L35)*

___

### \_maxPeers

•  **\_maxPeers**: number

*Defined in [src/rlpx/rlpx.ts:31](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L31)*

___

### \_peers

•  **\_peers**: Map\<string, Socket \| [Peer](_index_.peer.md)>

*Defined in [src/rlpx/rlpx.ts:40](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L40)*

___

### \_peersLRU

•  **\_peersLRU**: LRUCache\<string, boolean>

*Defined in [src/rlpx/rlpx.ts:37](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L37)*

___

### \_peersQueue

•  **\_peersQueue**: { peer: [PeerInfo](../interfaces/_index_.peerinfo.md) ; ts: number  }[]

*Defined in [src/rlpx/rlpx.ts:38](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L38)*

___

### \_privateKey

•  **\_privateKey**: Buffer

*Defined in [src/rlpx/rlpx.ts:28](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L28)*

___

### \_refillIntervalId

•  **\_refillIntervalId**: Timeout

*Defined in [src/rlpx/rlpx.ts:41](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L41)*

___

### \_remoteClientIdFilter

• `Optional` **\_remoteClientIdFilter**: string[]

*Defined in [src/rlpx/rlpx.ts:33](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L33)*

___

### \_server

•  **\_server**: Server \| null

*Defined in [src/rlpx/rlpx.ts:39](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L39)*

___

### \_timeout

•  **\_timeout**: number

*Defined in [src/rlpx/rlpx.ts:30](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L30)*

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

### \_connectToPeer

▸ **_connectToPeer**(`peer`: [PeerInfo](../interfaces/_index_.peerinfo.md)): void

*Defined in [src/rlpx/rlpx.ts:164](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L164)*

#### Parameters:

Name | Type |
------ | ------ |
`peer` | [PeerInfo](../interfaces/_index_.peerinfo.md) |

**Returns:** void

___

### \_getOpenSlots

▸ **_getOpenSlots**(): number

*Defined in [src/rlpx/rlpx.ts:160](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L160)*

**Returns:** number

___

### \_isAlive

▸ **_isAlive**(): boolean

*Defined in [src/rlpx/rlpx.ts:152](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L152)*

**Returns:** boolean

___

### \_isAliveCheck

▸ **_isAliveCheck**(): void

*Defined in [src/rlpx/rlpx.ts:156](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L156)*

**Returns:** void

___

### \_onConnect

▸ **_onConnect**(`socket`: Socket, `peerId`: Buffer \| null): void

*Defined in [src/rlpx/rlpx.ts:173](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L173)*

#### Parameters:

Name | Type |
------ | ------ |
`socket` | Socket |
`peerId` | Buffer \| null |

**Returns:** void

___

### \_refillConnections

▸ **_refillConnections**(): void

*Defined in [src/rlpx/rlpx.ts:250](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L250)*

**Returns:** void

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

### connect

▸ **connect**(`peer`: [PeerInfo](../interfaces/_index_.peerinfo.md)): Promise\<void>

*Defined in [src/rlpx/rlpx.ts:115](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L115)*

#### Parameters:

Name | Type |
------ | ------ |
`peer` | [PeerInfo](../interfaces/_index_.peerinfo.md) |

**Returns:** Promise\<void>

___

### destroy

▸ **destroy**(...`args`: any[]): void

*Defined in [src/rlpx/rlpx.ts:103](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L103)*

#### Parameters:

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** void

___

### disconnect

▸ **disconnect**(`id`: Buffer): void

*Defined in [src/rlpx/rlpx.ts:147](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L147)*

#### Parameters:

Name | Type |
------ | ------ |
`id` | Buffer |

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

### getMaxListeners

▸ **getMaxListeners**(): number

*Inherited from [DPT](_index_.dpt.md).[getMaxListeners](_index_.dpt.md#getmaxlisteners)*

*Defined in node_modules/@types/node/events.d.ts:69*

**Returns:** number

___

### getPeers

▸ **getPeers**(): ([Peer](_index_.peer.md) \| Socket)[]

*Defined in [src/rlpx/rlpx.ts:143](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L143)*

**Returns:** ([Peer](_index_.peer.md) \| Socket)[]

___

### listen

▸ **listen**(...`args`: any[]): void

*Defined in [src/rlpx/rlpx.ts:96](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/rlpx.ts#L96)*

#### Parameters:

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** void

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
