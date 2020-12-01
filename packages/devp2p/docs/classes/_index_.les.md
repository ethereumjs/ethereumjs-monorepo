**[ethereumjs-devp2p](../README.md)**

> [Globals](../README.md) / ["index"](../modules/_index_.md) / LES

# Class: LES

## Hierarchy

* EventEmitter

  ↳ **LES**

## Index

### Enumerations

* [MESSAGE\_CODES](../enums/_index_.les.message_codes.md)

### Interfaces

* [Status](../interfaces/_index_.les.status.md)

### Constructors

* [constructor](_index_.les.md#constructor)

### Properties

* [\_peer](_index_.les.md#_peer)
* [\_peerStatus](_index_.les.md#_peerstatus)
* [\_send](_index_.les.md#_send)
* [\_status](_index_.les.md#_status)
* [\_statusTimeoutId](_index_.les.md#_statustimeoutid)
* [\_version](_index_.les.md#_version)
* [defaultMaxListeners](_index_.les.md#defaultmaxlisteners)
* [errorMonitor](_index_.les.md#errormonitor)

### Methods

* [\_getStatusString](_index_.les.md#_getstatusstring)
* [\_handleMessage](_index_.les.md#_handlemessage)
* [\_handleStatus](_index_.les.md#_handlestatus)
* [addListener](_index_.les.md#addlistener)
* [emit](_index_.les.md#emit)
* [eventNames](_index_.les.md#eventnames)
* [getMaxListeners](_index_.les.md#getmaxlisteners)
* [getMsgPrefix](_index_.les.md#getmsgprefix)
* [getVersion](_index_.les.md#getversion)
* [listenerCount](_index_.les.md#listenercount)
* [listeners](_index_.les.md#listeners)
* [off](_index_.les.md#off)
* [on](_index_.les.md#on)
* [once](_index_.les.md#once)
* [prependListener](_index_.les.md#prependlistener)
* [prependOnceListener](_index_.les.md#prependoncelistener)
* [rawListeners](_index_.les.md#rawlisteners)
* [removeAllListeners](_index_.les.md#removealllisteners)
* [removeListener](_index_.les.md#removelistener)
* [sendMessage](_index_.les.md#sendmessage)
* [sendStatus](_index_.les.md#sendstatus)
* [setMaxListeners](_index_.les.md#setmaxlisteners)
* [listenerCount](_index_.les.md#listenercount)

### Object literals

* [les2](_index_.les.md#les2)

## Constructors

### constructor

\+ **new LES**(`version`: number, `peer`: [Peer](_index_.peer.md), `send`: any): [LES](_index_.les.md)

*Overrides void*

*Defined in [src/les/index.ts:19](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L19)*

#### Parameters:

Name | Type |
------ | ------ |
`version` | number |
`peer` | [Peer](_index_.peer.md) |
`send` | any |

**Returns:** [LES](_index_.les.md)

## Properties

### \_peer

•  **\_peer**: any

*Defined in [src/les/index.ts:15](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L15)*

___

### \_peerStatus

•  **\_peerStatus**: [Status](../interfaces/_index_.les.status.md) \| null

*Defined in [src/les/index.ts:18](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L18)*

___

### \_send

•  **\_send**: any

*Defined in [src/les/index.ts:16](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L16)*

___

### \_status

•  **\_status**: [Status](../interfaces/_index_.les.status.md) \| null

*Defined in [src/les/index.ts:17](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L17)*

___

### \_statusTimeoutId

•  **\_statusTimeoutId**: Timeout

*Defined in [src/les/index.ts:19](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L19)*

___

### \_version

•  **\_version**: any

*Defined in [src/les/index.ts:14](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L14)*

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

### \_getStatusString

▸ **_getStatusString**(`status`: [Status](../interfaces/_index_.les.status.md)): string

*Defined in [src/les/index.ts:117](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L117)*

#### Parameters:

Name | Type |
------ | ------ |
`status` | [Status](../interfaces/_index_.les.status.md) |

**Returns:** string

___

### \_handleMessage

▸ **_handleMessage**(`code`: [MESSAGE\_CODES](../enums/_index_.les.message_codes.md), `data`: any): void

*Defined in [src/les/index.ts:36](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L36)*

#### Parameters:

Name | Type |
------ | ------ |
`code` | [MESSAGE\_CODES](../enums/_index_.les.message_codes.md) |
`data` | any |

**Returns:** void

___

### \_handleStatus

▸ **_handleStatus**(): void

*Defined in [src/les/index.ts:93](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L93)*

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

### getMsgPrefix

▸ **getMsgPrefix**(`msgCode`: [MESSAGE\_CODES](../enums/_index_.les.message_codes.md)): string

*Defined in [src/les/index.ts:203](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L203)*

#### Parameters:

Name | Type |
------ | ------ |
`msgCode` | [MESSAGE\_CODES](../enums/_index_.les.message_codes.md) |

**Returns:** string

___

### getVersion

▸ **getVersion**(): any

*Defined in [src/les/index.ts:113](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L113)*

**Returns:** any

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

### sendMessage

▸ **sendMessage**(`code`: [MESSAGE\_CODES](../enums/_index_.les.message_codes.md), `reqId`: number, `payload`: any): void

*Defined in [src/les/index.ts:161](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L161)*

#### Parameters:

Name | Type |
------ | ------ |
`code` | [MESSAGE\_CODES](../enums/_index_.les.message_codes.md) |
`reqId` | number |
`payload` | any |

**Returns:** void

___

### sendStatus

▸ **sendStatus**(`status`: [Status](../interfaces/_index_.les.status.md)): void

*Defined in [src/les/index.ts:135](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L135)*

#### Parameters:

Name | Type |
------ | ------ |
`status` | [Status](../interfaces/_index_.les.status.md) |

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

## Object literals

### les2

▪ `Static` **les2**: object

*Defined in [src/les/index.ts:34](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L34)*

#### Properties:

Name | Type | Value |
------ | ------ | ------ |
`constructor` | [LES](_index_.les.md) | LES |
`length` | number | 21 |
`name` | string | "les" |
`version` | number | 2 |
