[ethereumjs-client](../README.md) › ["net/protocol/flowcontrol"](../modules/_net_protocol_flowcontrol_.md) › [FlowControl](_net_protocol_flowcontrol_.flowcontrol.md)

# Class: FlowControl

LES flow control manager

**`memberof`** module:net/protocol

## Hierarchy

- **FlowControl**

## Index

### Constructors

- [constructor](_net_protocol_flowcontrol_.flowcontrol.md#constructor)

### Properties

- [bl](_net_protocol_flowcontrol_.flowcontrol.md#bl)
- [in](_net_protocol_flowcontrol_.flowcontrol.md#in)
- [mrc](_net_protocol_flowcontrol_.flowcontrol.md#mrc)
- [mrr](_net_protocol_flowcontrol_.flowcontrol.md#mrr)
- [out](_net_protocol_flowcontrol_.flowcontrol.md#out)

### Methods

- [handleReply](_net_protocol_flowcontrol_.flowcontrol.md#handlereply)
- [handleRequest](_net_protocol_flowcontrol_.flowcontrol.md#handlerequest)
- [maxRequestCount](_net_protocol_flowcontrol_.flowcontrol.md#maxrequestcount)

## Constructors

### constructor

\+ **new FlowControl**(`options?`: [FlowControlOptions](../interfaces/_net_protocol_flowcontrol_.flowcontroloptions.md)): _[FlowControl](_net_protocol_flowcontrol_.flowcontrol.md)_

_Defined in [lib/net/protocol/flowcontrol.ts:32](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L32)_

**Parameters:**

| Name       | Type                                                                                 |
| ---------- | ------------------------------------------------------------------------------------ |
| `options?` | [FlowControlOptions](../interfaces/_net_protocol_flowcontrol_.flowcontroloptions.md) |

**Returns:** _[FlowControl](_net_protocol_flowcontrol_.flowcontrol.md)_

## Properties

### bl

• **bl**: _number_

_Defined in [lib/net/protocol/flowcontrol.ts:28](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L28)_

---

### in

• **in**: _Map‹string, FlowParams›_

_Defined in [lib/net/protocol/flowcontrol.ts:32](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L32)_

---

### mrc

• **mrc**: _Mrc_

_Defined in [lib/net/protocol/flowcontrol.ts:29](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L29)_

---

### mrr

• **mrr**: _number_

_Defined in [lib/net/protocol/flowcontrol.ts:30](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L30)_

---

### out

• **out**: _Map‹string, FlowParams›_

_Defined in [lib/net/protocol/flowcontrol.ts:31](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L31)_

## Methods

### handleReply

▸ **handleReply**(`peer`: [Peer](_net_peer_peer_.peer.md), `bv`: number): _void_

_Defined in [lib/net/protocol/flowcontrol.ts:50](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L50)_

Process reply message from an LES peer by updating its BLE value

**Parameters:**

| Name   | Type                            | Description         |
| ------ | ------------------------------- | ------------------- |
| `peer` | [Peer](_net_peer_peer_.peer.md) | LES peer            |
| `bv`   | number                          | latest buffer value |

**Returns:** _void_

---

### handleRequest

▸ **handleRequest**(`peer`: [Peer](_net_peer_peer_.peer.md), `messageName`: string, `count`: number): _number_

_Defined in [lib/net/protocol/flowcontrol.ts:90](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L90)_

Calculate new buffer value for an LES peer after an incoming request is
processed. If the new value is negative, the peer should be dropped by the
caller.

**Parameters:**

| Name          | Type                            | Description                          |
| ------------- | ------------------------------- | ------------------------------------ |
| `peer`        | [Peer](_net_peer_peer_.peer.md) | LES peer                             |
| `messageName` | string                          | message name                         |
| `count`       | number                          | number of items to request from peer |

**Returns:** _number_

new buffer value after request is sent (if negative, drop peer)

---

### maxRequestCount

▸ **maxRequestCount**(`peer`: [Peer](_net_peer_peer_.peer.md), `messageName`: string): _number_

_Defined in [lib/net/protocol/flowcontrol.ts:63](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/flowcontrol.ts#L63)_

Calculate maximum items that can be requested from an LES peer

**Parameters:**

| Name          | Type                            | Description  |
| ------------- | ------------------------------- | ------------ |
| `peer`        | [Peer](_net_peer_peer_.peer.md) | LES peer     |
| `messageName` | string                          | message name |

**Returns:** _number_

maximum count
