[ethereumjs-client](../README.md) › ["net/protocol/lesprotocol"](_net_protocol_lesprotocol_.md)

# Module: "net/protocol/lesprotocol"

## Index

### Classes

* [LesProtocol](../classes/_net_protocol_lesprotocol_.lesprotocol.md)

### Variables

* [BN](_net_protocol_lesprotocol_.md#const-bn)
* [Block](_net_protocol_lesprotocol_.md#const-block)
* [Protocol](_net_protocol_lesprotocol_.md#const-protocol)
* [id](_net_protocol_lesprotocol_.md#let-id)
* [messages](_net_protocol_lesprotocol_.md#const-messages)
* [util](_net_protocol_lesprotocol_.md#const-util)

## Variables

### `Const` BN

• **BN**: *[BN](_blockchain_chain_.md#bn)* = util.BN

*Defined in [lib/net/protocol/lesprotocol.js:6](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.js#L6)*

___

### `Const` Block

• **Block**: *any* = require('ethereumjs-block')

*Defined in [lib/net/protocol/lesprotocol.js:5](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.js#L5)*

___

### `Const` Protocol

• **Protocol**: *[Protocol](../classes/_net_protocol_protocol_.protocol.md)* = require('./protocol')

*Defined in [lib/net/protocol/lesprotocol.js:3](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.js#L3)*

___

### `Let` id

• **id**: *[BN](_blockchain_chain_.md#bn)‹›* = new BN(0)

*Defined in [lib/net/protocol/lesprotocol.js:8](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.js#L8)*

___

### `Const` messages

• **messages**: *object | object | object[]* = [{
  name: 'Announce',
  code: 0x01,
  encode: ({ headHash, headNumber, headTd, reorgDepth }) => [
    // TO DO: handle state changes
    headHash,
    headNumber.toArrayLike(Buffer),
    headTd.toArrayLike(Buffer),
    new BN(reorgDepth).toArrayLike(Buffer)
  ],
  decode: ([headHash, headNumber, headTd, reorgDepth]) => ({
    // TO DO: handle state changes
    headHash: headHash,
    headNumber: new BN(headNumber),
    headTd: new BN(headTd),
    reorgDepth: util.bufferToInt(reorgDepth)
  })
}, {
  name: 'GetBlockHeaders',
  code: 0x02,
  response: 0x03,
  encode: ({ reqId, block, max, skip = 0, reverse = 0 }) => [
    (reqId === undefined ? id.iaddn(1) : new BN(reqId)).toArrayLike(Buffer),
    [ BN.isBN(block) ? block.toArrayLike(Buffer) : block, max, skip, reverse ]
  ],
  decode: ([reqId, [block, max, skip, reverse]]) => ({
    reqId: new BN(reqId),
    block: block.length === 32 ? block : new BN(block),
    max: util.bufferToInt(max),
    skip: util.bufferToInt(skip),
    reverse: util.bufferToInt(reverse)
  })
}, {
  name: 'BlockHeaders',
  code: 0x03,
  encode: ({ reqId, bv, headers }) => [
    new BN(reqId).toArrayLike(Buffer),
    new BN(bv).toArrayLike(Buffer),
    headers.map(h => h.raw)
  ],
  decode: ([reqId, bv, headers]) => ({
    reqId: new BN(reqId),
    bv: new BN(bv),
    headers: headers.map(raw => new Block.Header(raw))
  })
}]

*Defined in [lib/net/protocol/lesprotocol.js:10](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.js#L10)*

___

### `Const` util

• **util**: *"/Users/ryanghods/dev/ethereumjs-client/node_modules/ethereumjs-util/dist/index"* = require('ethereumjs-util')

*Defined in [lib/net/protocol/lesprotocol.js:4](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/lesprotocol.js#L4)*
