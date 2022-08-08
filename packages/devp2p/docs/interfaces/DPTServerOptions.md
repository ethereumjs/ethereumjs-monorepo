[@ethereumjs/devp2p](../README.md) / DPTServerOptions

# Interface: DPTServerOptions

## Table of contents

### Properties

- [createSocket](DPTServerOptions.md#createsocket)
- [endpoint](DPTServerOptions.md#endpoint)
- [timeout](DPTServerOptions.md#timeout)

## Properties

### createSocket

• `Optional` **createSocket**: `Function`

Function for socket creation

Default: dgram-created socket

#### Defined in

[packages/devp2p/src/dpt/server.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L38)

___

### endpoint

• `Optional` **endpoint**: [`PeerInfo`](PeerInfo.md)

Network info to send a long a request

Default: 0.0.0.0, no UDP or TCP port provided

#### Defined in

[packages/devp2p/src/dpt/server.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L31)

___

### timeout

• `Optional` **timeout**: `number`

Timeout for peer requests

Default: 10s

#### Defined in

[packages/devp2p/src/dpt/server.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L24)
