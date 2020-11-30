**[ethereumjs-devp2p](../README.md)**

> [Globals](../README.md) / ["dpt/index"](../modules/_dpt_index_.md) / KBucket

# Class: KBucket

## Hierarchy

* EventEmitter

  ↳ **KBucket**

## Index

### Constructors

* [constructor](_dpt_index_.kbucket.md#constructor)

### Properties

* [\_kbucket](_dpt_index_.kbucket.md#_kbucket)
* [\_peers](_dpt_index_.kbucket.md#_peers)
* [defaultMaxListeners](_dpt_index_.kbucket.md#defaultmaxlisteners)
* [errorMonitor](_dpt_index_.kbucket.md#errormonitor)

### Methods

* [add](_dpt_index_.kbucket.md#add)
* [addListener](_dpt_index_.kbucket.md#addlistener)
* [closest](_dpt_index_.kbucket.md#closest)
* [emit](_dpt_index_.kbucket.md#emit)
* [eventNames](_dpt_index_.kbucket.md#eventnames)
* [get](_dpt_index_.kbucket.md#get)
* [getAll](_dpt_index_.kbucket.md#getall)
* [getMaxListeners](_dpt_index_.kbucket.md#getmaxlisteners)
* [listenerCount](_dpt_index_.kbucket.md#listenercount)
* [listeners](_dpt_index_.kbucket.md#listeners)
* [off](_dpt_index_.kbucket.md#off)
* [on](_dpt_index_.kbucket.md#on)
* [once](_dpt_index_.kbucket.md#once)
* [prependListener](_dpt_index_.kbucket.md#prependlistener)
* [prependOnceListener](_dpt_index_.kbucket.md#prependoncelistener)
* [rawListeners](_dpt_index_.kbucket.md#rawlisteners)
* [remove](_dpt_index_.kbucket.md#remove)
* [removeAllListeners](_dpt_index_.kbucket.md#removealllisteners)
* [removeListener](_dpt_index_.kbucket.md#removelistener)
* [setMaxListeners](_dpt_index_.kbucket.md#setmaxlisteners)
* [getKeys](_dpt_index_.kbucket.md#getkeys)
* [listenerCount](_dpt_index_.kbucket.md#listenercount)

## Constructors

### constructor

\+ **new KBucket**(`id`: string \| Buffer): [KBucket](_dpt_index_.kbucket.md)

*Overrides void*

*Defined in [src/dpt/kbucket.ts:15](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/kbucket.ts#L15)*

#### Parameters:

Name | Type |
------ | ------ |
`id` | string \| Buffer |

**Returns:** [KBucket](_dpt_index_.kbucket.md)

## Properties

### \_kbucket

•  **\_kbucket**: \_KBucket

*Defined in [src/dpt/kbucket.ts:15](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/kbucket.ts#L15)*

___

### \_peers

•  **\_peers**: Map\<string, any> = new Map()

*Defined in [src/dpt/kbucket.ts:14](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/kbucket.ts#L14)*

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

### add

▸ **add**(`peer`: any): void

*Defined in [src/dpt/kbucket.ts:48](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/kbucket.ts#L48)*

#### Parameters:

Name | Type |
------ | ------ |
`peer` | any |

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

### closest

▸ **closest**(`id`: string): any

*Defined in [src/dpt/kbucket.ts:66](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/kbucket.ts#L66)*

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |

**Returns:** any

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

### get

▸ **get**(`obj`: Buffer \| string \| [KObj](../interfaces/_index_.kobj.md)): any

*Defined in [src/dpt/kbucket.ts:53](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/kbucket.ts#L53)*

#### Parameters:

Name | Type |
------ | ------ |
`obj` | Buffer \| string \| [KObj](../interfaces/_index_.kobj.md) |

**Returns:** any

___

### getAll

▸ **getAll**(): Array\<any>

*Defined in [src/dpt/kbucket.ts:62](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/kbucket.ts#L62)*

**Returns:** Array\<any>

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

### remove

▸ **remove**(`obj`: Buffer \| string \| [KObj](../interfaces/_index_.kobj.md)): void

*Defined in [src/dpt/kbucket.ts:70](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/kbucket.ts#L70)*

#### Parameters:

Name | Type |
------ | ------ |
`obj` | Buffer \| string \| [KObj](../interfaces/_index_.kobj.md) |

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

### getKeys

▸ `Static`**getKeys**(`obj`: Buffer \| string \| [KObj](../interfaces/_index_.kobj.md)): string[]

*Defined in [src/dpt/kbucket.ts:38](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/kbucket.ts#L38)*

#### Parameters:

Name | Type |
------ | ------ |
`obj` | Buffer \| string \| [KObj](../interfaces/_index_.kobj.md) |

**Returns:** string[]

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
