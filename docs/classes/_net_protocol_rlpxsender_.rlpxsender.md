[ethereumjs-client](../README.md) › ["net/protocol/rlpxsender"](../modules/_net_protocol_rlpxsender_.md) › [RlpxSender](_net_protocol_rlpxsender_.rlpxsender.md)

# Class: RlpxSender

DevP2P/RLPx protocol sender

**`emits`** message

**`emits`** status

**`memberof`** module:net/protocol

## Hierarchy

  ↳ [Sender](_net_protocol_sender_.sender.md)

  ↳ **RlpxSender**

## Index

### Constructors

* [constructor](_net_protocol_rlpxsender_.rlpxsender.md#constructor)

### Accessors

* [status](_net_protocol_rlpxsender_.rlpxsender.md#status)

### Methods

* [sendMessage](_net_protocol_rlpxsender_.rlpxsender.md#sendmessage)
* [sendStatus](_net_protocol_rlpxsender_.rlpxsender.md#sendstatus)

## Constructors

###  constructor

\+ **new RlpxSender**(`rlpxProtocol`: Object): *[RlpxSender](_net_protocol_rlpxsender_.rlpxsender.md)*

*Overrides [Sender](_net_protocol_sender_.sender.md).[constructor](_net_protocol_sender_.sender.md#constructor)*

*Defined in [lib/net/protocol/rlpxsender.js:12](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/rlpxsender.js#L12)*

Creates a new DevP2P/Rlpx protocol sender

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rlpxProtocol` | Object | protocol object from ethereumjs-devp2p  |

**Returns:** *[RlpxSender](_net_protocol_rlpxsender_.rlpxsender.md)*

## Accessors

###  status

• **get status**(): *any*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[status](_net_protocol_sender_.sender.md#status)*

*Defined in [lib/net/protocol/sender.js:19](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.js#L19)*

**Returns:** *any*

• **set status**(`status`: any): *void*

*Inherited from [Sender](_net_protocol_sender_.sender.md).[status](_net_protocol_sender_.sender.md#status)*

*Defined in [lib/net/protocol/sender.js:23](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.js#L23)*

**Parameters:**

Name | Type |
------ | ------ |
`status` | any |

**Returns:** *void*

## Methods

###  sendMessage

▸ **sendMessage**(`code`: number, `data`: any): *void*

*Defined in [lib/net/protocol/rlpxsender.js:46](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/rlpxsender.js#L46)*

Send a message to peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`code` | number | message code |
`data` | any | message payload  |

**Returns:** *void*

___

###  sendStatus

▸ **sendStatus**(`status`: Object): *void*

*Defined in [lib/net/protocol/rlpxsender.js:33](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/rlpxsender.js#L33)*

Send a status to peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`status` | Object |   |

**Returns:** *void*
