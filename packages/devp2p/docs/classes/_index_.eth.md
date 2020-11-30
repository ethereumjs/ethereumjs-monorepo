**[ethereumjs-devp2p](../README.md)**

> [Globals](../README.md) / ["index"](../modules/_index_.md) / ETH

# Class: ETH

## Hierarchy

* EventEmitter

  ↳ **ETH**

## Index

### Enumerations

* [MESSAGE\_CODES](../enums/_index_.eth.message_codes.md)

### Type aliases

* [Status](_index_.eth.md#status)
* [StatusMsg](_index_.eth.md#statusmsg)

### Constructors

* [constructor](_index_.eth.md#constructor)

### Properties

* [\_peer](_index_.eth.md#_peer)
* [\_peerStatus](_index_.eth.md#_peerstatus)
* [\_send](_index_.eth.md#_send)
* [\_status](_index_.eth.md#_status)
* [\_statusTimeoutId](_index_.eth.md#_statustimeoutid)
* [\_version](_index_.eth.md#_version)
* [defaultMaxListeners](_index_.eth.md#defaultmaxlisteners)
* [errorMonitor](_index_.eth.md#errormonitor)

### Methods

* [\_getStatusString](_index_.eth.md#_getstatusstring)
* [\_handleMessage](_index_.eth.md#_handlemessage)
* [\_handleStatus](_index_.eth.md#_handlestatus)
* [addListener](_index_.eth.md#addlistener)
* [emit](_index_.eth.md#emit)
* [eventNames](_index_.eth.md#eventnames)
* [getMaxListeners](_index_.eth.md#getmaxlisteners)
* [getMsgPrefix](_index_.eth.md#getmsgprefix)
* [getVersion](_index_.eth.md#getversion)
* [listenerCount](_index_.eth.md#listenercount)
* [listeners](_index_.eth.md#listeners)
* [off](_index_.eth.md#off)
* [on](_index_.eth.md#on)
* [once](_index_.eth.md#once)
* [prependListener](_index_.eth.md#prependlistener)
* [prependOnceListener](_index_.eth.md#prependoncelistener)
* [rawListeners](_index_.eth.md#rawlisteners)
* [removeAllListeners](_index_.eth.md#removealllisteners)
* [removeListener](_index_.eth.md#removelistener)
* [sendMessage](_index_.eth.md#sendmessage)
* [sendStatus](_index_.eth.md#sendstatus)
* [setMaxListeners](_index_.eth.md#setmaxlisteners)
* [listenerCount](_index_.eth.md#listenercount)

### Object literals

* [eth62](_index_.eth.md#eth62)
* [eth63](_index_.eth.md#eth63)

## Type aliases

### Status

Ƭ `Static` **Status**: { bestHash: Buffer ; genesisHash: Buffer ; networkId: number ; td: Buffer ; version: number  }

*Defined in [src/eth/index.ts:183](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L183)*

#### Type declaration:

Name | Type |
------ | ------ |
`bestHash` | Buffer |
`genesisHash` | Buffer |
`networkId` | number |
`td` | Buffer |
`version` | number |

___

### StatusMsg

Ƭ `Static` **StatusMsg**: { 0: Buffer ; 1: Buffer ; 2: Buffer ; 3: Buffer ; 4: Buffer ; length: 5  }

*Defined in [src/eth/index.ts:174](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L174)*

#### Type declaration:

Name | Type |
------ | ------ |
`0` | Buffer |
`1` | Buffer |
`2` | Buffer |
`3` | Buffer |
`4` | Buffer |
`length` | 5 |

## Constructors

### constructor

\+ **new ETH**(`version`: number, `peer`: [Peer](_index_.peer.md), `send`: SendMethod): [ETH](_index_.eth.md)

*Overrides void*

*Defined in [src/eth/index.ts:19](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L19)*

#### Parameters:

Name | Type |
------ | ------ |
`version` | number |
`peer` | [Peer](_index_.peer.md) |
`send` | SendMethod |

**Returns:** [ETH](_index_.eth.md)

## Properties

### \_peer

•  **\_peer**: [Peer](_index_.peer.md)

*Defined in [src/eth/index.ts:15](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L15)*

___

### \_peerStatus

•  **\_peerStatus**: [StatusMsg](_index_.eth.md#statusmsg) \| null

*Defined in [src/eth/index.ts:17](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L17)*

___

### \_send

•  **\_send**: SendMethod

*Defined in [src/eth/index.ts:19](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L19)*

___

### \_status

•  **\_status**: [StatusMsg](_index_.eth.md#statusmsg) \| null

*Defined in [src/eth/index.ts:16](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L16)*

___

### \_statusTimeoutId

•  **\_statusTimeoutId**: Timeout

*Defined in [src/eth/index.ts:18](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L18)*

___

### \_version

•  **\_version**: number

*Defined in [src/eth/index.ts:14](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L14)*

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

▸ **_getStatusString**(`status`: [StatusMsg](_index_.eth.md#statusmsg)): string

*Defined in [src/eth/index.ts:103](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L103)*

#### Parameters:

Name | Type |
------ | ------ |
`status` | [StatusMsg](_index_.eth.md#statusmsg) |

**Returns:** string

___

### \_handleMessage

▸ **_handleMessage**(`code`: [MESSAGE\_CODES](../enums/_index_.eth.message_codes.md), `data`: any): void

*Defined in [src/eth/index.ts:38](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L38)*

#### Parameters:

Name | Type |
------ | ------ |
`code` | [MESSAGE\_CODES](../enums/_index_.eth.message_codes.md) |
`data` | any |

**Returns:** void

___

### \_handleStatus

▸ **_handleStatus**(): void

*Defined in [src/eth/index.ts:83](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L83)*

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

▸ **getMsgPrefix**(`msgCode`: [MESSAGE\_CODES](../enums/_index_.eth.message_codes.md)): string

*Defined in [src/eth/index.ts:168](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L168)*

#### Parameters:

Name | Type |
------ | ------ |
`msgCode` | [MESSAGE\_CODES](../enums/_index_.eth.message_codes.md) |

**Returns:** string

___

### getVersion

▸ **getVersion**(): number

*Defined in [src/eth/index.ts:99](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L99)*

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

▸ **sendMessage**(`code`: [MESSAGE\_CODES](../enums/_index_.eth.message_codes.md), `payload`: any): void

*Defined in [src/eth/index.ts:133](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L133)*

#### Parameters:

Name | Type |
------ | ------ |
`code` | [MESSAGE\_CODES](../enums/_index_.eth.message_codes.md) |
`payload` | any |

**Returns:** void

___

### sendStatus

▸ **sendStatus**(`status`: [Status](_index_.eth.md#status)): void

*Defined in [src/eth/index.ts:114](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L114)*

#### Parameters:

Name | Type |
------ | ------ |
`status` | [Status](_index_.eth.md#status) |

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

### eth62

▪ `Static` **eth62**: object

*Defined in [src/eth/index.ts:35](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L35)*

#### Properties:

Name | Type | Value |
------ | ------ | ------ |
`constructor` | [ETH](_index_.eth.md) | ETH |
`length` | number | 8 |
`name` | string | "eth" |
`version` | number | 62 |

___

### eth63

▪ `Static` **eth63**: object

*Defined in [src/eth/index.ts:36](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L36)*

#### Properties:

Name | Type | Value |
------ | ------ | ------ |
`constructor` | [ETH](_index_.eth.md) | ETH |
`length` | number | 17 |
`name` | string | "eth" |
`version` | number | 63 |
