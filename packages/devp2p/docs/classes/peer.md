[@ethereumjs/devp2p](../README.md) / Peer

# Class: Peer

## Hierarchy

* *EventEmitter*

  ↳ **Peer**

## Table of contents

### Constructors

- [constructor](peer.md#constructor)

### Properties

- [\_EIP8](peer.md#_eip8)
- [\_capabilities](peer.md#_capabilities)
- [\_clientId](peer.md#_clientid)
- [\_closed](peer.md#_closed)
- [\_common](peer.md#_common)
- [\_connected](peer.md#_connected)
- [\_disconnectReason](peer.md#_disconnectreason)
- [\_disconnectWe](peer.md#_disconnectwe)
- [\_eciesSession](peer.md#_eciessession)
- [\_hello](peer.md#_hello)
- [\_id](peer.md#_id)
- [\_nextPacketSize](peer.md#_nextpacketsize)
- [\_pingIntervalId](peer.md#_pingintervalid)
- [\_pingTimeout](peer.md#_pingtimeout)
- [\_pingTimeoutId](peer.md#_pingtimeoutid)
- [\_port](peer.md#_port)
- [\_protocols](peer.md#_protocols)
- [\_remoteClientIdFilter](peer.md#_remoteclientidfilter)
- [\_remoteId](peer.md#_remoteid)
- [\_socket](peer.md#_socket)
- [\_socketData](peer.md#_socketdata)
- [\_state](peer.md#_state)
- [\_weHello](peer.md#_wehello)

### Methods

- [\_getProtocol](peer.md#_getprotocol)
- [\_handleAck](peer.md#_handleack)
- [\_handleAuth](peer.md#_handleauth)
- [\_handleBody](peer.md#_handlebody)
- [\_handleDisconnect](peer.md#_handledisconnect)
- [\_handleHeader](peer.md#_handleheader)
- [\_handleHello](peer.md#_handlehello)
- [\_handleMessage](peer.md#_handlemessage)
- [\_handlePing](peer.md#_handleping)
- [\_handlePong](peer.md#_handlepong)
- [\_onSocketClose](peer.md#_onsocketclose)
- [\_onSocketData](peer.md#_onsocketdata)
- [\_sendAck](peer.md#_sendack)
- [\_sendAuth](peer.md#_sendauth)
- [\_sendDisconnect](peer.md#_senddisconnect)
- [\_sendHello](peer.md#_sendhello)
- [\_sendMessage](peer.md#_sendmessage)
- [\_sendPing](peer.md#_sendping)
- [\_sendPong](peer.md#_sendpong)
- [disconnect](peer.md#disconnect)
- [getDisconnectPrefix](peer.md#getdisconnectprefix)
- [getHelloMessage](peer.md#gethellomessage)
- [getId](peer.md#getid)
- [getMsgPrefix](peer.md#getmsgprefix)
- [getProtocols](peer.md#getprotocols)

## Constructors

### constructor

\+ **new Peer**(`options`: *any*): [*Peer*](peer.md)

#### Parameters:

Name | Type |
:------ | :------ |
`options` | *any* |

**Returns:** [*Peer*](peer.md)

Overrides: void

Defined in: [rlpx/peer.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L101)

## Properties

### \_EIP8

• **\_EIP8**: *Buffer*

Defined in: [rlpx/peer.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L86)

___

### \_capabilities

• `Optional` **\_capabilities**: [*Capabilities*](../interfaces/capabilities.md)[]

Defined in: [rlpx/peer.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L80)

___

### \_clientId

• **\_clientId**: *Buffer*

Defined in: [rlpx/peer.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L79)

___

### \_closed

• **\_closed**: *boolean*

Defined in: [rlpx/peer.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L96)

___

### \_common

• **\_common**: *default*

Defined in: [rlpx/peer.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L81)

___

### \_connected

• **\_connected**: *boolean*

Defined in: [rlpx/peer.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L97)

___

### \_disconnectReason

• `Optional` **\_disconnectReason**: [*DISCONNECT\_REQUESTED*](../enums/disconnect_reasons.md#disconnect_requested) \| [*NETWORK\_ERROR*](../enums/disconnect_reasons.md#network_error) \| [*PROTOCOL\_ERROR*](../enums/disconnect_reasons.md#protocol_error) \| [*USELESS\_PEER*](../enums/disconnect_reasons.md#useless_peer) \| [*TOO\_MANY\_PEERS*](../enums/disconnect_reasons.md#too_many_peers) \| [*ALREADY\_CONNECTED*](../enums/disconnect_reasons.md#already_connected) \| [*INCOMPATIBLE\_VERSION*](../enums/disconnect_reasons.md#incompatible_version) \| [*INVALID\_IDENTITY*](../enums/disconnect_reasons.md#invalid_identity) \| [*CLIENT\_QUITTING*](../enums/disconnect_reasons.md#client_quitting) \| [*UNEXPECTED\_IDENTITY*](../enums/disconnect_reasons.md#unexpected_identity) \| [*SAME\_IDENTITY*](../enums/disconnect_reasons.md#same_identity) \| [*TIMEOUT*](../enums/disconnect_reasons.md#timeout) \| [*SUBPROTOCOL\_ERROR*](../enums/disconnect_reasons.md#subprotocol_error)

Defined in: [rlpx/peer.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L98)

___

### \_disconnectWe

• **\_disconnectWe**: *any*

Defined in: [rlpx/peer.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L99)

___

### \_eciesSession

• **\_eciesSession**: [*ECIES*](ecies.md)

Defined in: [rlpx/peer.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L87)

___

### \_hello

• **\_hello**: *null* \| [*Hello*](../interfaces/hello.md)

Defined in: [rlpx/peer.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L90)

___

### \_id

• **\_id**: *Buffer*

Defined in: [rlpx/peer.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L83)

___

### \_nextPacketSize

• **\_nextPacketSize**: *number*

Defined in: [rlpx/peer.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L91)

___

### \_pingIntervalId

• **\_pingIntervalId**: *null* \| *Timeout*

Defined in: [rlpx/peer.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L94)

___

### \_pingTimeout

• **\_pingTimeout**: *number*

Defined in: [rlpx/peer.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L100)

___

### \_pingTimeoutId

• **\_pingTimeoutId**: *null* \| *Timeout*

Defined in: [rlpx/peer.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L95)

___

### \_port

• **\_port**: *number*

Defined in: [rlpx/peer.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L82)

___

### \_protocols

• **\_protocols**: [*ProtocolDescriptor*](../interfaces/protocoldescriptor.md)[]

Defined in: [rlpx/peer.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L101)

___

### \_remoteClientIdFilter

• **\_remoteClientIdFilter**: *any*

Defined in: [rlpx/peer.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L84)

___

### \_remoteId

• **\_remoteId**: *Buffer*

Defined in: [rlpx/peer.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L85)

___

### \_socket

• **\_socket**: *Socket*

Defined in: [rlpx/peer.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L92)

___

### \_socketData

• **\_socketData**: *BufferList*

Defined in: [rlpx/peer.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L93)

___

### \_state

• **\_state**: *string*

Defined in: [rlpx/peer.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L88)

___

### \_weHello

• **\_weHello**: *null* \| [*HelloMsg*](../README.md#hellomsg)

Defined in: [rlpx/peer.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L89)

## Methods

### \_getProtocol

▸ **_getProtocol**(`code`: *number*): *undefined* \| [*ProtocolDescriptor*](../interfaces/protocoldescriptor.md)

#### Parameters:

Name | Type |
:------ | :------ |
`code` | *number* |

**Returns:** *undefined* \| [*ProtocolDescriptor*](../interfaces/protocoldescriptor.md)

Defined in: [rlpx/peer.ts:553](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L553)

___

### \_handleAck

▸ **_handleAck**(): *void*

ACK message received

**Returns:** *void*

Defined in: [rlpx/peer.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L304)

___

### \_handleAuth

▸ **_handleAuth**(): *void*

AUTH message received

**Returns:** *void*

Defined in: [rlpx/peer.ts:281](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L281)

___

### \_handleBody

▸ **_handleBody**(): *void*

Handle message body

**Returns:** *void*

Defined in: [rlpx/peer.ts:468](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L468)

___

### \_handleDisconnect

▸ **_handleDisconnect**(`payload`: *any*): *void*

DISCONNECT message received

#### Parameters:

Name | Type |
:------ | :------ |
`payload` | *any* |

**Returns:** *void*

Defined in: [rlpx/peer.ts:397](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L397)

___

### \_handleHeader

▸ **_handleHeader**(): *void*

Handle message header

**Returns:** *void*

Defined in: [rlpx/peer.ts:449](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L449)

___

### \_handleHello

▸ **_handleHello**(`payload`: *any*): *void*

HELLO message received

#### Parameters:

Name | Type |
:------ | :------ |
`payload` | *any* |

**Returns:** *void*

Defined in: [rlpx/peer.ts:331](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L331)

___

### \_handleMessage

▸ **_handleMessage**(`code`: [*PREFIXES*](../enums/prefixes.md), `msg`: *Buffer*): *void*

Message handling, called from a SubProtocol context

#### Parameters:

Name | Type |
:------ | :------ |
`code` | [*PREFIXES*](../enums/prefixes.md) |
`msg` | *Buffer* |

**Returns:** *void*

Defined in: [rlpx/peer.ts:428](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L428)

___

### \_handlePing

▸ **_handlePing**(): *void*

PING message received

**Returns:** *void*

Defined in: [rlpx/peer.ts:412](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L412)

___

### \_handlePong

▸ **_handlePong**(): *void*

PONG message received

**Returns:** *void*

Defined in: [rlpx/peer.ts:419](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L419)

___

### \_onSocketClose

▸ **_onSocketClose**(): *void*

React to socket being closed

**Returns:** *void*

Defined in: [rlpx/peer.ts:545](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L545)

___

### \_onSocketData

▸ **_onSocketData**(`data`: *Buffer*): *void*

Process socket data

#### Parameters:

Name | Type |
:------ | :------ |
`data` | *Buffer* |

**Returns:** *void*

Defined in: [rlpx/peer.ts:515](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L515)

___

### \_sendAck

▸ **_sendAck**(): *void*

Send ACK message

**Returns:** *void*

Defined in: [rlpx/peer.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L172)

___

### \_sendAuth

▸ **_sendAuth**(): *void*

Send AUTH message

**Returns:** *void*

Defined in: [rlpx/peer.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L151)

___

### \_sendDisconnect

▸ **_sendDisconnect**(`reason`: [*DISCONNECT\_REASONS*](../enums/disconnect_reasons.md)): *void*

Send DISCONNECT message

#### Parameters:

Name | Type |
:------ | :------ |
`reason` | [*DISCONNECT\_REASONS*](../enums/disconnect_reasons.md) |

**Returns:** *void*

Defined in: [rlpx/peer.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L240)

___

### \_sendHello

▸ **_sendHello**(): *void*

Send HELLO message

**Returns:** *void*

Defined in: [rlpx/peer.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L216)

___

### \_sendMessage

▸ **_sendMessage**(`code`: *number*, `data`: *Buffer*): *undefined* \| *boolean*

Create message HEADER and BODY and send to socket
Also called from SubProtocol context

#### Parameters:

Name | Type |
:------ | :------ |
`code` | *number* |
`data` | *Buffer* |

**Returns:** *undefined* \| *boolean*

Defined in: [rlpx/peer.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L197)

___

### \_sendPing

▸ **_sendPing**(): *void*

Send PING message

**Returns:** *void*

Defined in: [rlpx/peer.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L258)

___

### \_sendPong

▸ **_sendPong**(): *void*

Send PONG message

**Returns:** *void*

Defined in: [rlpx/peer.ts:272](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L272)

___

### disconnect

▸ **disconnect**(`reason?`: [*DISCONNECT\_REASONS*](../enums/disconnect_reasons.md)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`reason` | [*DISCONNECT\_REASONS*](../enums/disconnect_reasons.md) |

**Returns:** *void*

Defined in: [rlpx/peer.ts:581](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L581)

___

### getDisconnectPrefix

▸ **getDisconnectPrefix**(`code`: [*DISCONNECT\_REASONS*](../enums/disconnect_reasons.md)): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`code` | [*DISCONNECT\_REASONS*](../enums/disconnect_reasons.md) |

**Returns:** *string*

Defined in: [rlpx/peer.ts:577](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L577)

___

### getHelloMessage

▸ **getHelloMessage**(): *null* \| [*Hello*](../interfaces/hello.md)

**Returns:** *null* \| [*Hello*](../interfaces/hello.md)

Defined in: [rlpx/peer.ts:565](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L565)

___

### getId

▸ **getId**(): *null* \| *Buffer*

**Returns:** *null* \| *Buffer*

Defined in: [rlpx/peer.ts:560](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L560)

___

### getMsgPrefix

▸ **getMsgPrefix**(`code`: [*PREFIXES*](../enums/prefixes.md)): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`code` | [*PREFIXES*](../enums/prefixes.md) |

**Returns:** *string*

Defined in: [rlpx/peer.ts:573](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L573)

___

### getProtocols

▸ **getProtocols**<T\>(): T[]

#### Type parameters:

Name | Type |
:------ | :------ |
`T` | [*ETH*](eth.md) \| [*LES*](les.md) |

**Returns:** T[]

Defined in: [rlpx/peer.ts:569](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L569)
