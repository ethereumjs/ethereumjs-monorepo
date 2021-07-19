[@ethereumjs/devp2p](../README.md) / [dpt/server](../modules/dpt_server.md) / DPTServerOptions

# Interface: DPTServerOptions

[dpt/server](../modules/dpt_server.md).DPTServerOptions

## Table of contents

### Properties

- [createSocket](dpt_server.dptserveroptions.md#createsocket)
- [endpoint](dpt_server.dptserveroptions.md#endpoint)
- [timeout](dpt_server.dptserveroptions.md#timeout)

## Properties

### createSocket

• `Optional` **createSocket**: `Function`

Function for socket creation

Default: dgram-created socket

#### Defined in

[packages/devp2p/src/dpt/server.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L36)

___

### endpoint

• `Optional` **endpoint**: [PeerInfo](dpt_dpt.peerinfo.md)

Network info to send a long a request

Default: 0.0.0.0, no UDP or TCP port provided

#### Defined in

[packages/devp2p/src/dpt/server.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L29)

___

### timeout

• `Optional` **timeout**: `number`

Timeout for peer requests

Default: 10s

#### Defined in

[packages/devp2p/src/dpt/server.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L22)
