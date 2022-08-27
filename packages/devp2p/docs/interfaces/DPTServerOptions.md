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

[packages/devp2p/src/dpt/server.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L41)

___

### endpoint

• `Optional` **endpoint**: [`PeerInfo`](PeerInfo.md)

Network info to send a long a request

Default: 0.0.0.0, no UDP or TCP port provided

#### Defined in

[packages/devp2p/src/dpt/server.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L34)

___

### timeout

• `Optional` **timeout**: `number`

Timeout for peer requests

Default: 10s

#### Defined in

[packages/devp2p/src/dpt/server.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L27)
