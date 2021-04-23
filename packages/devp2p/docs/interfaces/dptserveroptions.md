[@ethereumjs/devp2p](../README.md) / DPTServerOptions

# Interface: DPTServerOptions

## Table of contents

### Properties

- [createSocket](dptserveroptions.md#createsocket)
- [endpoint](dptserveroptions.md#endpoint)
- [timeout](dptserveroptions.md#timeout)

## Properties

### createSocket

• `Optional` **createSocket**: Function

Function for socket creation

Default: dgram-created socket

Defined in: [dpt/server.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L36)

___

### endpoint

• `Optional` **endpoint**: [*PeerInfo*](peerinfo.md)

Network info to send a long a request

Default: 0.0.0.0, no UDP or TCP port provided

Defined in: [dpt/server.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L29)

___

### timeout

• `Optional` **timeout**: *number*

Timeout for peer requests

Default: 10s

Defined in: [dpt/server.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L22)
