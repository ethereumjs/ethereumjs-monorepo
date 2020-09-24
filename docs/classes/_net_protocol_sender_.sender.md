[ethereumjs-client](../README.md) › ["net/protocol/sender"](../modules/_net_protocol_sender_.md) › [Sender](_net_protocol_sender_.sender.md)

# Class: Sender

Base class for transport specific message sender/receiver. Subclasses should
emit a message event when the sender receives a new message, and they should
emit a status event when the sender receives a handshake status message

**`emits`** message

**`emits`** status

**`memberof`** module:net/protocol

## Hierarchy

* any

  ↳ **Sender**

  ↳ [Libp2pSender](_net_protocol_libp2psender_.libp2psender.md)

  ↳ [RlpxSender](_net_protocol_rlpxsender_.rlpxsender.md)

## Index

### Constructors

* [constructor](_net_protocol_sender_.sender.md#constructor)

### Accessors

* [status](_net_protocol_sender_.sender.md#status)

## Constructors

###  constructor

\+ **new Sender**(): *[Sender](_net_protocol_sender_.sender.md)*

*Defined in [lib/net/protocol/sender.js:13](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.js#L13)*

**Returns:** *[Sender](_net_protocol_sender_.sender.md)*

## Accessors

###  status

• **get status**(): *any*

*Defined in [lib/net/protocol/sender.js:19](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.js#L19)*

**Returns:** *any*

• **set status**(`status`: any): *void*

*Defined in [lib/net/protocol/sender.js:23](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/sender.js#L23)*

**Parameters:**

Name | Type |
------ | ------ |
`status` | any |

**Returns:** *void*
