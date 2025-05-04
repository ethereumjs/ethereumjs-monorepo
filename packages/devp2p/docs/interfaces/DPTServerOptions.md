[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / DPTServerOptions

# Interface: DPTServerOptions

Defined in: [packages/devp2p/src/types.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L195)

## Properties

### common?

> `optional` **common**: `Common`

Defined in: [packages/devp2p/src/types.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L220)

Common instance to allow for crypto primitive (e.g. keccak) replacement

***

### createSocket?

> `optional` **createSocket**: `Function`

Defined in: [packages/devp2p/src/types.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L215)

Function for socket creation

Default: dgram-created socket

***

### endpoint?

> `optional` **endpoint**: [`PeerInfo`](PeerInfo.md)

Defined in: [packages/devp2p/src/types.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L208)

Network info to send a long a request

Default: 0.0.0.0, no UDP or TCP port provided

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/devp2p/src/types.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L201)

Timeout for peer requests

Default: 10s
