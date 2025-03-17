[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / DPTServerOptions

# Interface: DPTServerOptions

Defined in: [packages/devp2p/src/types.ts:181](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L181)

## Properties

### common?

> `optional` **common**: `Common`

Defined in: [packages/devp2p/src/types.ts:206](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L206)

Common instance to allow for crypto primitive (e.g. keccak) replacement

***

### createSocket?

> `optional` **createSocket**: `Function`

Defined in: [packages/devp2p/src/types.ts:201](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L201)

Function for socket creation

Default: dgram-created socket

***

### endpoint?

> `optional` **endpoint**: [`PeerInfo`](PeerInfo.md)

Defined in: [packages/devp2p/src/types.ts:194](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L194)

Network info to send a long a request

Default: 0.0.0.0, no UDP or TCP port provided

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/devp2p/src/types.ts:187](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L187)

Timeout for peer requests

Default: 10s
