**[ethereumjs-devp2p](../README.md)**

> [Globals](../README.md) / ["rlpx/index"](../modules/_rlpx_index_.md) / Peer

# Class: Peer

## Hierarchy

* EventEmitter

  ↳ **Peer**

## Index

### Constructors

* [constructor](_rlpx_index_.peer.md#constructor)

### Properties

* [\_EIP8](_rlpx_index_.peer.md#_eip8)
* [\_capabilities](_rlpx_index_.peer.md#_capabilities)
* [\_clientId](_rlpx_index_.peer.md#_clientid)
* [\_closed](_rlpx_index_.peer.md#_closed)
* [\_connected](_rlpx_index_.peer.md#_connected)
* [\_disconnectReason](_rlpx_index_.peer.md#_disconnectreason)
* [\_disconnectWe](_rlpx_index_.peer.md#_disconnectwe)
* [\_eciesSession](_rlpx_index_.peer.md#_eciessession)
* [\_hello](_rlpx_index_.peer.md#_hello)
* [\_id](_rlpx_index_.peer.md#_id)
* [\_nextPacketSize](_rlpx_index_.peer.md#_nextpacketsize)
* [\_pingIntervalId](_rlpx_index_.peer.md#_pingintervalid)
* [\_pingTimeout](_rlpx_index_.peer.md#_pingtimeout)
* [\_pingTimeoutId](_rlpx_index_.peer.md#_pingtimeoutid)
* [\_port](_rlpx_index_.peer.md#_port)
* [\_protocols](_rlpx_index_.peer.md#_protocols)
* [\_remoteClientIdFilter](_rlpx_index_.peer.md#_remoteclientidfilter)
* [\_remoteId](_rlpx_index_.peer.md#_remoteid)
* [\_socket](_rlpx_index_.peer.md#_socket)
* [\_socketData](_rlpx_index_.peer.md#_socketdata)
* [\_state](_rlpx_index_.peer.md#_state)
* [\_weHello](_rlpx_index_.peer.md#_wehello)
* [defaultMaxListeners](_rlpx_index_.peer.md#defaultmaxlisteners)
* [errorMonitor](_rlpx_index_.peer.md#errormonitor)

### Methods

* [\_getProtocol](_rlpx_index_.peer.md#_getprotocol)
* [\_handleAck](_rlpx_index_.peer.md#_handleack)
* [\_handleAuth](_rlpx_index_.peer.md#_handleauth)
* [\_handleBody](_rlpx_index_.peer.md#_handlebody)
* [\_handleDisconnect](_rlpx_index_.peer.md#_handledisconnect)
* [\_handleHeader](_rlpx_index_.peer.md#_handleheader)
* [\_handleHello](_rlpx_index_.peer.md#_handlehello)
* [\_handleMessage](_rlpx_index_.peer.md#_handlemessage)
* [\_handlePing](_rlpx_index_.peer.md#_handleping)
* [\_handlePong](_rlpx_index_.peer.md#_handlepong)
* [\_onSocketClose](_rlpx_index_.peer.md#_onsocketclose)
* [\_onSocketData](_rlpx_index_.peer.md#_onsocketdata)
* [\_sendAck](_rlpx_index_.peer.md#_sendack)
* [\_sendAuth](_rlpx_index_.peer.md#_sendauth)
* [\_sendDisconnect](_rlpx_index_.peer.md#_senddisconnect)
* [\_sendHello](_rlpx_index_.peer.md#_sendhello)
* [\_sendMessage](_rlpx_index_.peer.md#_sendmessage)
* [\_sendPing](_rlpx_index_.peer.md#_sendping)
* [\_sendPong](_rlpx_index_.peer.md#_sendpong)
* [addListener](_rlpx_index_.peer.md#addlistener)
* [disconnect](_rlpx_index_.peer.md#disconnect)
* [emit](_rlpx_index_.peer.md#emit)
* [eventNames](_rlpx_index_.peer.md#eventnames)
* [getDisconnectPrefix](_rlpx_index_.peer.md#getdisconnectprefix)
* [getHelloMessage](_rlpx_index_.peer.md#gethellomessage)
* [getId](_rlpx_index_.peer.md#getid)
* [getMaxListeners](_rlpx_index_.peer.md#getmaxlisteners)
* [getMsgPrefix](_rlpx_index_.peer.md#getmsgprefix)
* [getProtocols](_rlpx_index_.peer.md#getprotocols)
* [listenerCount](_rlpx_index_.peer.md#listenercount)
* [listeners](_rlpx_index_.peer.md#listeners)
* [off](_rlpx_index_.peer.md#off)
* [on](_rlpx_index_.peer.md#on)
* [once](_rlpx_index_.peer.md#once)
* [prependListener](_rlpx_index_.peer.md#prependlistener)
* [prependOnceListener](_rlpx_index_.peer.md#prependoncelistener)
* [rawListeners](_rlpx_index_.peer.md#rawlisteners)
* [removeAllListeners](_rlpx_index_.peer.md#removealllisteners)
* [removeListener](_rlpx_index_.peer.md#removelistener)
* [setMaxListeners](_rlpx_index_.peer.md#setmaxlisteners)
* [listenerCount](_rlpx_index_.peer.md#listenercount)

## Constructors

### constructor

\+ **new Peer**(`options`: any): [Peer](_rlpx_index_.peer.md)

*Overrides void*

*Defined in [src/rlpx/peer.ts:99](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L99)*

#### Parameters:

Name | Type |
------ | ------ |
`options` | any |

**Returns:** [Peer](_rlpx_index_.peer.md)

## Properties

### \_EIP8

•  **\_EIP8**: Buffer

*Defined in [src/rlpx/peer.ts:84](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L84)*

___

### \_capabilities

• `Optional` **\_capabilities**: [Capabilities](../interfaces/_index_.capabilities.md)[]

*Defined in [src/rlpx/peer.ts:79](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L79)*

___

### \_clientId

•  **\_clientId**: Buffer

*Defined in [src/rlpx/peer.ts:78](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L78)*

___

### \_closed

•  **\_closed**: boolean

*Defined in [src/rlpx/peer.ts:94](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L94)*

___

### \_connected

•  **\_connected**: boolean

*Defined in [src/rlpx/peer.ts:95](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L95)*

___

### \_disconnectReason

• `Optional` **\_disconnectReason**: [DISCONNECT\_REASONS](../enums/_rlpx_index_.disconnect_reasons.md)

*Defined in [src/rlpx/peer.ts:96](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L96)*

___

### \_disconnectWe

•  **\_disconnectWe**: any

*Defined in [src/rlpx/peer.ts:97](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L97)*

___

### \_eciesSession

•  **\_eciesSession**: [ECIES](_index_.ecies.md)

*Defined in [src/rlpx/peer.ts:85](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L85)*

___

### \_hello

•  **\_hello**: [Hello](../interfaces/_index_.hello.md) \| null

*Defined in [src/rlpx/peer.ts:88](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L88)*

___

### \_id

•  **\_id**: Buffer

*Defined in [src/rlpx/peer.ts:81](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L81)*

___

### \_nextPacketSize

•  **\_nextPacketSize**: number

*Defined in [src/rlpx/peer.ts:89](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L89)*

___

### \_pingIntervalId

•  **\_pingIntervalId**: Timeout \| null

*Defined in [src/rlpx/peer.ts:92](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L92)*

___

### \_pingTimeout

•  **\_pingTimeout**: number

*Defined in [src/rlpx/peer.ts:98](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L98)*

___

### \_pingTimeoutId

•  **\_pingTimeoutId**: Timeout \| null

*Defined in [src/rlpx/peer.ts:93](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L93)*

___

### \_port

•  **\_port**: number

*Defined in [src/rlpx/peer.ts:80](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L80)*

___

### \_protocols

•  **\_protocols**: [ProtocolDescriptor](../interfaces/_index_.protocoldescriptor.md)[]

*Defined in [src/rlpx/peer.ts:99](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L99)*

___

### \_remoteClientIdFilter

•  **\_remoteClientIdFilter**: any

*Defined in [src/rlpx/peer.ts:82](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L82)*

___

### \_remoteId

•  **\_remoteId**: Buffer

*Defined in [src/rlpx/peer.ts:83](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L83)*

___

### \_socket

•  **\_socket**: Socket

*Defined in [src/rlpx/peer.ts:90](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L90)*

___

### \_socketData

•  **\_socketData**: BufferList

*Defined in [src/rlpx/peer.ts:91](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L91)*

___

### \_state

•  **\_state**: string

*Defined in [src/rlpx/peer.ts:86](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L86)*

___

### \_weHello

•  **\_weHello**: [HelloMsg](../modules/_rlpx_index_.md#hellomsg) \| null

*Defined in [src/rlpx/peer.ts:87](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L87)*

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

### \_getProtocol

▸ **_getProtocol**(`code`: number): [ProtocolDescriptor](../interfaces/_index_.protocoldescriptor.md) \| undefined

*Defined in [src/rlpx/peer.ts:546](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L546)*

#### Parameters:

Name | Type |
------ | ------ |
`code` | number |

**Returns:** [ProtocolDescriptor](../interfaces/_index_.protocoldescriptor.md) \| undefined

___

### \_handleAck

▸ **_handleAck**(): void

*Defined in [src/rlpx/peer.ts:298](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L298)*

ACK message received

**Returns:** void

___

### \_handleAuth

▸ **_handleAuth**(): void

*Defined in [src/rlpx/peer.ts:275](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L275)*

AUTH message received

**Returns:** void

___

### \_handleBody

▸ **_handleBody**(): void

*Defined in [src/rlpx/peer.ts:462](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L462)*

Handle message body

**Returns:** void

___

### \_handleDisconnect

▸ **_handleDisconnect**(`payload`: any): void

*Defined in [src/rlpx/peer.ts:391](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L391)*

DISCONNECT message received

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`payload` | any |   |

**Returns:** void

___

### \_handleHeader

▸ **_handleHeader**(): void

*Defined in [src/rlpx/peer.ts:443](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L443)*

Handle message header

**Returns:** void

___

### \_handleHello

▸ **_handleHello**(`payload`: any): void

*Defined in [src/rlpx/peer.ts:325](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L325)*

HELLO message received

#### Parameters:

Name | Type |
------ | ------ |
`payload` | any |

**Returns:** void

___

### \_handleMessage

▸ **_handleMessage**(`code`: [PREFIXES](../enums/_index_.prefixes.md), `msg`: Buffer): void

*Defined in [src/rlpx/peer.ts:422](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L422)*

Message handling, called from a SubProtocol context

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`code` | [PREFIXES](../enums/_index_.prefixes.md) |  |
`msg` | Buffer |   |

**Returns:** void

___

### \_handlePing

▸ **_handlePing**(): void

*Defined in [src/rlpx/peer.ts:406](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L406)*

PING message received

**Returns:** void

___

### \_handlePong

▸ **_handlePong**(): void

*Defined in [src/rlpx/peer.ts:413](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L413)*

PONG message received

**Returns:** void

___

### \_onSocketClose

▸ **_onSocketClose**(): void

*Defined in [src/rlpx/peer.ts:538](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L538)*

React to socket being closed

**Returns:** void

___

### \_onSocketData

▸ **_onSocketData**(`data`: Buffer): void

*Defined in [src/rlpx/peer.ts:509](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L509)*

Process socket data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Buffer |   |

**Returns:** void

___

### \_sendAck

▸ **_sendAck**(): void

*Defined in [src/rlpx/peer.ts:169](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L169)*

Send ACK message

**Returns:** void

___

### \_sendAuth

▸ **_sendAuth**(): void

*Defined in [src/rlpx/peer.ts:148](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L148)*

Send AUTH message

**Returns:** void

___

### \_sendDisconnect

▸ **_sendDisconnect**(`reason`: [DISCONNECT\_REASONS](../enums/_index_.disconnect_reasons.md)): void

*Defined in [src/rlpx/peer.ts:234](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L234)*

Send DISCONNECT message

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`reason` | [DISCONNECT\_REASONS](../enums/_index_.disconnect_reasons.md) |   |

**Returns:** void

___

### \_sendHello

▸ **_sendHello**(): void

*Defined in [src/rlpx/peer.ts:210](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L210)*

Send HELLO message

**Returns:** void

___

### \_sendMessage

▸ **_sendMessage**(`code`: number, `data`: Buffer): undefined \| false \| true

*Defined in [src/rlpx/peer.ts:194](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L194)*

Create message HEADER and BODY and send to socket
Also called from SubProtocol context

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`code` | number |  |
`data` | Buffer |   |

**Returns:** undefined \| false \| true

___

### \_sendPing

▸ **_sendPing**(): void

*Defined in [src/rlpx/peer.ts:252](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L252)*

Send PING message

**Returns:** void

___

### \_sendPong

▸ **_sendPong**(): void

*Defined in [src/rlpx/peer.ts:266](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L266)*

Send PONG message

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

### disconnect

▸ **disconnect**(`reason?`: [DISCONNECT\_REASONS](../enums/_index_.disconnect_reasons.md)): void

*Defined in [src/rlpx/peer.ts:574](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L574)*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`reason` | [DISCONNECT\_REASONS](../enums/_index_.disconnect_reasons.md) | DISCONNECT\_REASONS.DISCONNECT\_REQUESTED |

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

### getDisconnectPrefix

▸ **getDisconnectPrefix**(`code`: [DISCONNECT\_REASONS](../enums/_index_.disconnect_reasons.md)): string

*Defined in [src/rlpx/peer.ts:570](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L570)*

#### Parameters:

Name | Type |
------ | ------ |
`code` | [DISCONNECT\_REASONS](../enums/_index_.disconnect_reasons.md) |

**Returns:** string

___

### getHelloMessage

▸ **getHelloMessage**(): null \| [Hello](../interfaces/_index_.hello.md)

*Defined in [src/rlpx/peer.ts:558](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L558)*

**Returns:** null \| [Hello](../interfaces/_index_.hello.md)

___

### getId

▸ **getId**(): null \| Buffer

*Defined in [src/rlpx/peer.ts:553](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L553)*

**Returns:** null \| Buffer

___

### getMaxListeners

▸ **getMaxListeners**(): number

*Inherited from [DPT](_index_.dpt.md).[getMaxListeners](_index_.dpt.md#getmaxlisteners)*

*Defined in node_modules/@types/node/events.d.ts:69*

**Returns:** number

___

### getMsgPrefix

▸ **getMsgPrefix**(`code`: [PREFIXES](../enums/_index_.prefixes.md)): string

*Defined in [src/rlpx/peer.ts:566](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L566)*

#### Parameters:

Name | Type |
------ | ------ |
`code` | [PREFIXES](../enums/_index_.prefixes.md) |

**Returns:** string

___

### getProtocols

▸ **getProtocols**\<T>(): T[]

*Defined in [src/rlpx/peer.ts:562](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L562)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | [ETH](_index_.eth.md) \| [LES](_index_.les.md) |

**Returns:** T[]

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
