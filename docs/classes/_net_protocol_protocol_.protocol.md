[ethereumjs-client](../README.md) › ["net/protocol/protocol"](../modules/_net_protocol_protocol_.md) › [Protocol](_net_protocol_protocol_.protocol.md)

# Class: Protocol

Base class for all wire protocols

**`memberof`** module:net/protocol

## Hierarchy

* any

  ↳ **Protocol**

  ↳ [EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md)

  ↳ [LesProtocol](_net_protocol_lesprotocol_.lesprotocol.md)

## Index

### Constructors

* [constructor](_net_protocol_protocol_.protocol.md#constructor)

### Accessors

* [messages](_net_protocol_protocol_.protocol.md#messages)
* [name](_net_protocol_protocol_.protocol.md#name)
* [versions](_net_protocol_protocol_.protocol.md#versions)

### Methods

* [bind](_net_protocol_protocol_.protocol.md#bind)
* [decodeStatus](_net_protocol_protocol_.protocol.md#decodestatus)
* [encodeStatus](_net_protocol_protocol_.protocol.md#encodestatus)
* [open](_net_protocol_protocol_.protocol.md#open)

## Constructors

###  constructor

\+ **new Protocol**(`options`: object): *[Protocol](_net_protocol_protocol_.protocol.md)*

*Defined in [lib/net/protocol/protocol.js:27](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.js#L27)*

Create new protocol

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[Protocol](_net_protocol_protocol_.protocol.md)*

## Accessors

###  messages

• **get messages**(): *[Protocol](_net_protocol_protocol_.protocol.md)‹›*

*Defined in [lib/net/protocol/protocol.js:97](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.js#L97)*

Messages defined by this protocol

**`type`** {Protocol~Message[]}

**Returns:** *[Protocol](_net_protocol_protocol_.protocol.md)‹›*

___

###  name

• **get name**(): *string*

*Defined in [lib/net/protocol/protocol.js:81](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.js#L81)*

Name of protocol

**`type`** {string}

**Returns:** *string*

___

###  versions

• **get versions**(): *number[]*

*Defined in [lib/net/protocol/protocol.js:89](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.js#L89)*

Protocol versions supported

**`type`** {number[]}

**Returns:** *number[]*

## Methods

###  bind

▸ **bind**(`peer`: any, `sender`: any): *Promise‹any›*

*Defined in [lib/net/protocol/protocol.js:155](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.js#L155)*

Binds this protocol to a given peer using the specified sender to handle
message communication.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peer` | any | peer |
`sender` | any | sender |

**Returns:** *Promise‹any›*

___

###  decodeStatus

▸ **decodeStatus**(`status`: Object): *Object*

*Defined in [lib/net/protocol/protocol.js:115](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.js#L115)*

Decodes status message payload into a status object.  Must be implemented
by subclass.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`status` | Object | status message payload |

**Returns:** *Object*

___

###  encodeStatus

▸ **encodeStatus**(): *Object*

*Defined in [lib/net/protocol/protocol.js:105](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.js#L105)*

Encodes status into status message payload. Must be implemented by subclass.

**Returns:** *Object*

___

###  open

▸ **open**(): *Promise‹any›*

*Defined in [lib/net/protocol/protocol.js:46](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/protocol.js#L46)*

Opens protocol and any associated dependencies

**Returns:** *Promise‹any›*
