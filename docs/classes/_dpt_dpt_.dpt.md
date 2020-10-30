**[ethereumjs-devp2p](../README.md)**

> [Globals](../README.md) / ["dpt/dpt"](../modules/_dpt_dpt_.md) / DPT

# Class: DPT

## Hierarchy

* EventEmitter

  ↳ **DPT**

## Index

### Constructors

* [constructor](_dpt_dpt_.dpt.md#constructor)

### Properties

* [banlist](_dpt_dpt_.dpt.md#banlist)
* [privateKey](_dpt_dpt_.dpt.md#privatekey)
* [defaultMaxListeners](_dpt_dpt_.dpt.md#defaultmaxlisteners)
* [errorMonitor](_dpt_dpt_.dpt.md#errormonitor)

### Methods

* [\_onKBucketPing](_dpt_dpt_.dpt.md#_onkbucketping)
* [\_onServerPeers](_dpt_dpt_.dpt.md#_onserverpeers)
* [addListener](_dpt_dpt_.dpt.md#addlistener)
* [addPeer](_dpt_dpt_.dpt.md#addpeer)
* [banPeer](_dpt_dpt_.dpt.md#banpeer)
* [bind](_dpt_dpt_.dpt.md#bind)
* [bootstrap](_dpt_dpt_.dpt.md#bootstrap)
* [destroy](_dpt_dpt_.dpt.md#destroy)
* [emit](_dpt_dpt_.dpt.md#emit)
* [eventNames](_dpt_dpt_.dpt.md#eventnames)
* [getClosestPeers](_dpt_dpt_.dpt.md#getclosestpeers)
* [getMaxListeners](_dpt_dpt_.dpt.md#getmaxlisteners)
* [getPeer](_dpt_dpt_.dpt.md#getpeer)
* [getPeers](_dpt_dpt_.dpt.md#getpeers)
* [listenerCount](_dpt_dpt_.dpt.md#listenercount)
* [listeners](_dpt_dpt_.dpt.md#listeners)
* [off](_dpt_dpt_.dpt.md#off)
* [on](_dpt_dpt_.dpt.md#on)
* [once](_dpt_dpt_.dpt.md#once)
* [prependListener](_dpt_dpt_.dpt.md#prependlistener)
* [prependOnceListener](_dpt_dpt_.dpt.md#prependoncelistener)
* [rawListeners](_dpt_dpt_.dpt.md#rawlisteners)
* [refresh](_dpt_dpt_.dpt.md#refresh)
* [removeAllListeners](_dpt_dpt_.dpt.md#removealllisteners)
* [removeListener](_dpt_dpt_.dpt.md#removelistener)
* [removePeer](_dpt_dpt_.dpt.md#removepeer)
* [setMaxListeners](_dpt_dpt_.dpt.md#setmaxlisteners)
* [listenerCount](_dpt_dpt_.dpt.md#listenercount)

## Constructors

### constructor

\+ **new DPT**(`privateKey`: Buffer, `options`: any): [DPT](_dpt_dpt_.dpt.md)

*Overrides void*

*Defined in [src/dpt/dpt.ts:20](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/dpt.ts#L20)*

#### Parameters:

Name | Type |
------ | ------ |
`privateKey` | Buffer |
`options` | any |

**Returns:** [DPT](_dpt_dpt_.dpt.md)

## Properties

### banlist

•  **banlist**: [BanList](_index_.banlist.md)

*Defined in [src/dpt/dpt.ts:15](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/dpt.ts#L15)*

___

### privateKey

•  **privateKey**: Buffer

*Defined in [src/dpt/dpt.ts:14](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/dpt.ts#L14)*

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

### \_onKBucketPing

▸ **_onKBucketPing**(`oldPeers`: any[], `newPeer`: any): void

*Defined in [src/dpt/dpt.ts:58](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/dpt.ts#L58)*

#### Parameters:

Name | Type |
------ | ------ |
`oldPeers` | any[] |
`newPeer` | any |

**Returns:** void

___

### \_onServerPeers

▸ **_onServerPeers**(`peers`: any[]): void

*Defined in [src/dpt/dpt.ts:80](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/dpt.ts#L80)*

#### Parameters:

Name | Type |
------ | ------ |
`peers` | any[] |

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

### addPeer

▸ **addPeer**(`obj`: any): Promise\<any>

*Defined in [src/dpt/dpt.ts:92](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/dpt.ts#L92)*

#### Parameters:

Name | Type |
------ | ------ |
`obj` | any |

**Returns:** Promise\<any>

___

### banPeer

▸ **banPeer**(`obj`: any, `maxAge?`: undefined \| number): void

*Defined in [src/dpt/dpt.ts:128](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/dpt.ts#L128)*

#### Parameters:

Name | Type |
------ | ------ |
`obj` | any |
`maxAge?` | undefined \| number |

**Returns:** void

___

### bind

▸ **bind**(...`args`: any[]): void

*Defined in [src/dpt/dpt.ts:49](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/dpt.ts#L49)*

#### Parameters:

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** void

___

### bootstrap

▸ **bootstrap**(`peer`: any): Promise\<void>

*Defined in [src/dpt/dpt.ts:84](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/dpt.ts#L84)*

#### Parameters:

Name | Type |
------ | ------ |
`peer` | any |

**Returns:** Promise\<void>

___

### destroy

▸ **destroy**(...`args`: any[]): void

*Defined in [src/dpt/dpt.ts:53](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/dpt.ts#L53)*

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

### getClosestPeers

▸ **getClosestPeers**(`id`: string): any

*Defined in [src/dpt/dpt.ts:120](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/dpt.ts#L120)*

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |

**Returns:** any

___

### getMaxListeners

▸ **getMaxListeners**(): number

*Inherited from [DPT](_index_.dpt.md).[getMaxListeners](_index_.dpt.md#getmaxlisteners)*

*Defined in node_modules/@types/node/events.d.ts:69*

**Returns:** number

___

### getPeer

▸ **getPeer**(`obj`: any): any

*Defined in [src/dpt/dpt.ts:112](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/dpt.ts#L112)*

#### Parameters:

Name | Type |
------ | ------ |
`obj` | any |

**Returns:** any

___

### getPeers

▸ **getPeers**(): any[]

*Defined in [src/dpt/dpt.ts:116](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/dpt.ts#L116)*

**Returns:** any[]

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

### refresh

▸ **refresh**(): void

*Defined in [src/dpt/dpt.ts:133](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/dpt.ts#L133)*

**Returns:** void

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

### removePeer

▸ **removePeer**(`obj`: any): void

*Defined in [src/dpt/dpt.ts:124](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/dpt.ts#L124)*

#### Parameters:

Name | Type |
------ | ------ |
`obj` | any |

**Returns:** void

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
