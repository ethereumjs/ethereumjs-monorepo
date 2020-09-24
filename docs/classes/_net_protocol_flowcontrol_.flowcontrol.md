[ethereumjs-client](../README.md) › ["net/protocol/flowcontrol"](../modules/_net_protocol_flowcontrol_.md) › [FlowControl](_net_protocol_flowcontrol_.flowcontrol.md)

# Class: FlowControl

LES flow control manager

**`memberof`** module:net/protocol

## Hierarchy

* **FlowControl**

## Index

### Constructors

* [constructor](_net_protocol_flowcontrol_.flowcontrol.md#constructor)

### Methods

* [handleReply](_net_protocol_flowcontrol_.flowcontrol.md#handlereply)
* [handleRequest](_net_protocol_flowcontrol_.flowcontrol.md#handlerequest)
* [maxRequestCount](_net_protocol_flowcontrol_.flowcontrol.md#maxrequestcount)

## Constructors

###  constructor

\+ **new FlowControl**(`options`: any): *[FlowControl](_net_protocol_flowcontrol_.flowcontrol.md)*

*Defined in [lib/net/protocol/flowcontrol.js:15](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.js#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | any |

**Returns:** *[FlowControl](_net_protocol_flowcontrol_.flowcontrol.md)*

## Methods

###  handleReply

▸ **handleReply**(`peer`: any, `bv`: number): *void*

*Defined in [lib/net/protocol/flowcontrol.js:31](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.js#L31)*

Process reply message from an LES peer by updating its BLE value

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peer` | any | LES peer |
`bv` | number | latest buffer value  |

**Returns:** *void*

___

###  handleRequest

▸ **handleRequest**(`peer`: any, `messageName`: string, `count`: number): *number*

*Defined in [lib/net/protocol/flowcontrol.js:70](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.js#L70)*

Calculate new buffer value for an LES peer after an incoming request is
processed. If the new value is negative, the peer should be dropped by the
caller.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peer` | any | LES peer |
`messageName` | string | message name |
`count` | number | number of items to request from peer |

**Returns:** *number*

new buffer value after request is sent (if negative, drop peer)

___

###  maxRequestCount

▸ **maxRequestCount**(`peer`: any, `messageName`: string): *number*

*Defined in [lib/net/protocol/flowcontrol.js:44](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.js#L44)*

Calculate maximum items that can be requested from an LES peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peer` | any | LES peer |
`messageName` | string | message name |

**Returns:** *number*

maximum count
