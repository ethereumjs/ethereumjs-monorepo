[ethereumjs-client](../README.md) › ["net/protocol/libp2psender"](../modules/_net_protocol_libp2psender_.md) › [Libp2pSender](_net_protocol_libp2psender_.libp2psender.md)

# Class: Libp2pSender

Libp2p protocol sender

**`emits`** message

**`emits`** status

**`memberof`** module:net/protocol

## Hierarchy

  ↳ [Sender](_net_protocol_sender_.sender.md)

  ↳ **Libp2pSender**

## Index

### Constructors

* [constructor](_net_protocol_libp2psender_.libp2psender.md#constructor)

### Accessors

* [status](_net_protocol_libp2psender_.libp2psender.md#status)

### Methods

* [error](_net_protocol_libp2psender_.libp2psender.md#error)
* [init](_net_protocol_libp2psender_.libp2psender.md#init)
* [sendMessage](_net_protocol_libp2psender_.libp2psender.md#sendmessage)
* [sendStatus](_net_protocol_libp2psender_.libp2psender.md#sendstatus)

## Constructors

###  constructor

\+ **new Libp2pSender**(`connection`: any): *[Libp2pSender](_net_protocol_libp2psender_.libp2psender.md)*

*Overrides [Sender](_net_protocol_sender_.sender.md).[constructor](_net_protocol_sender_.sender.md#constructor)*

*Defined in [lib/net/protocol/libp2psender.js:16](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/libp2psender.js#L16)*

Creates a new Libp2p protocol sender

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`connection` | any | connection to libp2p peer  |

**Returns:** *[Libp2pSender](_net_protocol_libp2psender_.libp2psender.md)*

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

###  error

▸ **error**(`error`: Error): *void*

*Defined in [lib/net/protocol/libp2psender.js:79](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/libp2psender.js#L79)*

Handle pull stream errors

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`error` | Error | error  |

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Defined in [lib/net/protocol/libp2psender.js:29](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/libp2psender.js#L29)*

**Returns:** *void*

___

###  sendMessage

▸ **sendMessage**(`code`: number, `data`: any): *void*

*Defined in [lib/net/protocol/libp2psender.js:71](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/libp2psender.js#L71)*

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

*Defined in [lib/net/protocol/libp2psender.js:61](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/libp2psender.js#L61)*

Send a status to peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`status` | Object |   |

**Returns:** *void*
