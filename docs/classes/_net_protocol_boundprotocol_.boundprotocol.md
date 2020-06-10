[ethereumjs-client](../README.md) › ["net/protocol/boundprotocol"](../modules/_net_protocol_boundprotocol_.md) › [BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)

# Class: BoundProtocol

Binds a protocol implementation to the specified peer

**`memberof`** module:net/protocol

## Hierarchy

* any

  ↳ **BoundProtocol**

## Index

### Constructors

* [constructor](_net_protocol_boundprotocol_.boundprotocol.md#constructor)

### Accessors

* [status](_net_protocol_boundprotocol_.boundprotocol.md#status)

### Methods

* [addMethods](_net_protocol_boundprotocol_.boundprotocol.md#addmethods)
* [handshake](_net_protocol_boundprotocol_.boundprotocol.md#handshake)
* [request](_net_protocol_boundprotocol_.boundprotocol.md#request)
* [send](_net_protocol_boundprotocol_.boundprotocol.md#send)

## Constructors

###  constructor

\+ **new BoundProtocol**(`options`: object): *[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)*

*Defined in [lib/net/protocol/boundprotocol.js:9](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.js#L9)*

Create bound protocol

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | object | constructor parameters |

**Returns:** *[BoundProtocol](_net_protocol_boundprotocol_.boundprotocol.md)*

## Accessors

###  status

• **get status**(): *object*

*Defined in [lib/net/protocol/boundprotocol.js:40](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.js#L40)*

**Returns:** *object*

• **set status**(`status`: object): *void*

*Defined in [lib/net/protocol/boundprotocol.js:44](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.js#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`status` | object |

**Returns:** *void*

## Methods

###  addMethods

▸ **addMethods**(): *void*

*Defined in [lib/net/protocol/boundprotocol.js:140](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.js#L140)*

Add a methods to the bound protocol for each protocol message that has a
corresponding response message

**Returns:** *void*

___

###  handshake

▸ **handshake**(`sender`: any): *Promise‹void›*

*Defined in [lib/net/protocol/boundprotocol.js:48](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.js#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`sender` | any |

**Returns:** *Promise‹void›*

___

###  request

▸ **request**(`name`: string, `args`: object): *Promise‹any›*

*Defined in [lib/net/protocol/boundprotocol.js:114](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.js#L114)*

Returns a promise that resolves with the message payload when a response
to the specified message is received

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | message to wait for |
`args` | object | message arguments |

**Returns:** *Promise‹any›*

___

###  send

▸ **send**(`name`: string, `args`: object): *any*

*Defined in [lib/net/protocol/boundprotocol.js:95](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/boundprotocol.js#L95)*

Send message with name and the specified args

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | message name |
`args` | object | message arguments  |

**Returns:** *any*
