[ethereumjs-client](../README.md) › ["net/protocol/ethprotocol"](_net_protocol_ethprotocol_.md)

# Module: "net/protocol/ethprotocol"

## Index

### Classes

* [EthProtocol](../classes/_net_protocol_ethprotocol_.ethprotocol.md)

### Variables

* [BN](_net_protocol_ethprotocol_.md#const-bn)
* [Block](_net_protocol_ethprotocol_.md#const-block)
* [Protocol](_net_protocol_ethprotocol_.md#const-protocol)
* [messages](_net_protocol_ethprotocol_.md#const-messages)
* [util](_net_protocol_ethprotocol_.md#const-util)

## Variables

### `Const` BN

• **BN**: *[BN](_blockchain_chain_.md#bn)* = util.BN

*Defined in [lib/net/protocol/ethprotocol.js:6](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/ethprotocol.js#L6)*

___

### `Const` Block

• **Block**: *any* = require('ethereumjs-block')

*Defined in [lib/net/protocol/ethprotocol.js:5](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/ethprotocol.js#L5)*

___

### `Const` Protocol

• **Protocol**: *[Protocol](../classes/_net_protocol_protocol_.protocol.md)* = require('./protocol')

*Defined in [lib/net/protocol/ethprotocol.js:3](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/ethprotocol.js#L3)*

___

### `Const` messages

• **messages**: *object | object | object | object[]* = [{
  name: 'NewBlockHashes',
  code: 0x01,
  encode: (hashes) => hashes.map(hn => [hn[0], hn[1].toArrayLike(Buffer)]),
  decode: (hashes) => hashes.map(hn => [hn[0], new BN(hn[1])])
}, {
  name: 'GetBlockHeaders',
  code: 0x03,
  response: 0x04,
  encode: ({ block, max, skip = 0, reverse = 0 }) => [
    BN.isBN(block) ? block.toArrayLike(Buffer) : block, max, skip, reverse
  ],
  decode: ([block, max, skip, reverse]) => ({
    block: block.length === 32 ? block : new BN(block),
    max: util.bufferToInt(max),
    skip: util.bufferToInt(skip),
    reverse: util.bufferToInt(reverse)
  })
}, {
  name: 'BlockHeaders',
  code: 0x04,
  encode: (headers) => headers.map(h => h.raw),
  decode: (headers) => headers.map(raw => new Block.Header(raw))
}, {
  name: 'GetBlockBodies',
  code: 0x05,
  response: 0x06
}, {
  name: 'BlockBodies',
  code: 0x06
}]

*Defined in [lib/net/protocol/ethprotocol.js:8](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/ethprotocol.js#L8)*

___

### `Const` util

• **util**: *"/Users/ryanghods/dev/ethereumjs-client/node_modules/ethereumjs-util/dist/index"* = require('ethereumjs-util')

*Defined in [lib/net/protocol/ethprotocol.js:4](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/net/protocol/ethprotocol.js#L4)*
