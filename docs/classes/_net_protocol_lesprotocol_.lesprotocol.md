[ethereumjs-client](../README.md) › ["net/protocol/lesprotocol"](../modules/_net_protocol_lesprotocol_.md) › [LesProtocol](_net_protocol_lesprotocol_.lesprotocol.md)

# Class: LesProtocol

Implements les/1 and les/2 protocols

**`memberof`** module:net/protocol

## Hierarchy

  ↳ [Protocol](_net_protocol_protocol_.protocol.md)

  ↳ **LesProtocol**

## Index

### Constructors

* [constructor](_net_protocol_lesprotocol_.lesprotocol.md#constructor)

### Accessors

* [messages](_net_protocol_lesprotocol_.lesprotocol.md#messages)
* [name](_net_protocol_lesprotocol_.lesprotocol.md#name)
* [versions](_net_protocol_lesprotocol_.lesprotocol.md#versions)

### Methods

* [bind](_net_protocol_lesprotocol_.lesprotocol.md#bind)
* [decodeStatus](_net_protocol_lesprotocol_.lesprotocol.md#decodestatus)
* [encodeStatus](_net_protocol_lesprotocol_.lesprotocol.md#encodestatus)
* [open](_net_protocol_lesprotocol_.lesprotocol.md#open)

## Constructors

###  constructor

\+ **new LesProtocol**(`options`: object): *[LesProtocol](_net_protocol_lesprotocol_.lesprotocol.md)*

*Overrides [Protocol](_net_protocol_protocol_.protocol.md).[constructor](_net_protocol_protocol_.protocol.md#constructor)*

*Defined in [lib/net/protocol/lesprotocol.js:61](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.js#L61)*

Create les protocol

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[LesProtocol](_net_protocol_lesprotocol_.lesprotocol.md)*

## Accessors

###  messages

• **get messages**(): *[Protocol](_net_protocol_protocol_.protocol.md)‹›*

*Overrides [Protocol](_net_protocol_protocol_.protocol.md).[messages](_net_protocol_protocol_.protocol.md#messages)*

*Defined in [lib/net/protocol/lesprotocol.js:98](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.js#L98)*

Messages defined by this protocol

**`type`** {Protocol~Message[]}

**Returns:** *[Protocol](_net_protocol_protocol_.protocol.md)‹›*

___

###  name

• **get name**(): *string*

*Overrides [Protocol](_net_protocol_protocol_.protocol.md).[name](_net_protocol_protocol_.protocol.md#name)*

*Defined in [lib/net/protocol/lesprotocol.js:82](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.js#L82)*

Name of protocol

**`type`** {string}

**Returns:** *string*

___

###  versions

• **get versions**(): *number[]*

*Overrides [Protocol](_net_protocol_protocol_.protocol.md).[versions](_net_protocol_protocol_.protocol.md#versions)*

*Defined in [lib/net/protocol/lesprotocol.js:90](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.js#L90)*

Protocol versions supported

**`type`** {number[]}

**Returns:** *number[]*

## Methods

###  bind

▸ **bind**(`peer`: any, `sender`: any): *Promise‹any›*

*Inherited from [Protocol](_net_protocol_protocol_.protocol.md).[bind](_net_protocol_protocol_.protocol.md#bind)*

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

*Overrides [Protocol](_net_protocol_protocol_.protocol.md).[decodeStatus](_net_protocol_protocol_.protocol.md#decodestatus)*

*Defined in [lib/net/protocol/lesprotocol.js:147](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.js#L147)*

Decodes ETH status message payload into a status object

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`status` | Object | status message payload |

**Returns:** *Object*

___

###  encodeStatus

▸ **encodeStatus**(): *Object*

*Overrides [Protocol](_net_protocol_protocol_.protocol.md).[encodeStatus](_net_protocol_protocol_.protocol.md#encodestatus)*

*Defined in [lib/net/protocol/lesprotocol.js:118](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.js#L118)*

Encodes status into LES status message payload

**Returns:** *Object*

___

###  open

▸ **open**(): *Promise‹any›*

*Overrides [Protocol](_net_protocol_protocol_.protocol.md).[open](_net_protocol_protocol_.protocol.md#open)*

*Defined in [lib/net/protocol/lesprotocol.js:106](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.js#L106)*

Opens protocol and any associated dependencies

**Returns:** *Promise‹any›*
