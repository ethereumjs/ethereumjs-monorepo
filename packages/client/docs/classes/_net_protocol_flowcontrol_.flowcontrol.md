[ethereumjs-client](../README.md) › ["net/protocol/flowcontrol"](../modules/_net_protocol_flowcontrol_.md) › [FlowControl](_net_protocol_flowcontrol_.flowcontrol.md)

# Class: FlowControl

LES flow control manager

**`memberof`** module:net/protocol

## Hierarchy

* **FlowControl**

## Index

### Constructors

* [constructor](_net_protocol_flowcontrol_.flowcontrol.md#constructor)

### Properties

* [bl](_net_protocol_flowcontrol_.flowcontrol.md#bl)
* [in](_net_protocol_flowcontrol_.flowcontrol.md#in)
* [mrc](_net_protocol_flowcontrol_.flowcontrol.md#mrc)
* [mrr](_net_protocol_flowcontrol_.flowcontrol.md#mrr)
* [out](_net_protocol_flowcontrol_.flowcontrol.md#out)

### Methods

* [handleReply](_net_protocol_flowcontrol_.flowcontrol.md#handlereply)
* [handleRequest](_net_protocol_flowcontrol_.flowcontrol.md#handlerequest)
* [maxRequestCount](_net_protocol_flowcontrol_.flowcontrol.md#maxrequestcount)

## Constructors

###  constructor

\+ **new FlowControl**(`options?`: [FlowControlOptions](../interfaces/_net_protocol_flowcontrol_.flowcontroloptions.md)): *[FlowControl](_net_protocol_flowcontrol_.flowcontrol.md)*

*Defined in [lib/net/protocol/flowcontrol.ts:32](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`options?` | [FlowControlOptions](../interfaces/_net_protocol_flowcontrol_.flowcontroloptions.md) |

**Returns:** *[FlowControl](_net_protocol_flowcontrol_.flowcontrol.md)*

## Properties

###  bl

• **bl**: *number*

*Defined in [lib/net/protocol/flowcontrol.ts:28](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L28)*

___

###  in

• **in**: *Map‹string, FlowParams›*

*Defined in [lib/net/protocol/flowcontrol.ts:32](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L32)*

___

###  mrc

• **mrc**: *Mrc*

*Defined in [lib/net/protocol/flowcontrol.ts:29](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L29)*

___

###  mrr

• **mrr**: *number*

*Defined in [lib/net/protocol/flowcontrol.ts:30](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L30)*

___

###  out

• **out**: *Map‹string, FlowParams›*

*Defined in [lib/net/protocol/flowcontrol.ts:31](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L31)*

## Methods

###  handleReply

▸ **handleReply**(`peer`: [Peer](_net_peer_peer_.peer.md), `bv`: number): *void*

*Defined in [lib/net/protocol/flowcontrol.ts:50](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L50)*

Process reply message from an LES peer by updating its BLE value

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peer` | [Peer](_net_peer_peer_.peer.md) | LES peer |
`bv` | number | latest buffer value  |

**Returns:** *void*

___

###  handleRequest

▸ **handleRequest**(`peer`: [Peer](_net_peer_peer_.peer.md), `messageName`: string, `count`: number): *number*

*Defined in [lib/net/protocol/flowcontrol.ts:90](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L90)*

Calculate new buffer value for an LES peer after an incoming request is
processed. If the new value is negative, the peer should be dropped by the
caller.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peer` | [Peer](_net_peer_peer_.peer.md) | LES peer |
`messageName` | string | message name |
`count` | number | number of items to request from peer |

**Returns:** *number*

new buffer value after request is sent (if negative, drop peer)

___

###  maxRequestCount

▸ **maxRequestCount**(`peer`: [Peer](_net_peer_peer_.peer.md), `messageName`: string): *number*

*Defined in [lib/net/protocol/flowcontrol.ts:63](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L63)*

Calculate maximum items that can be requested from an LES peer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`peer` | [Peer](_net_peer_peer_.peer.md) | LES peer |
`messageName` | string | message name |

**Returns:** *number*

maximum count
