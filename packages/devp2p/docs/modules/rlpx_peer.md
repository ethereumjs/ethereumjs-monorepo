[@ethereumjs/devp2p](../README.md) / rlpx/peer

# Module: rlpx/peer

## Table of contents

### Enumerations

- [DISCONNECT\_REASONS](../enums/rlpx_peer.disconnect_reasons.md)
- [PREFIXES](../enums/rlpx_peer.prefixes.md)

### Classes

- [Peer](../classes/rlpx_peer.peer.md)

### Interfaces

- [Capabilities](../interfaces/rlpx_peer.capabilities.md)
- [Hello](../interfaces/rlpx_peer.hello.md)
- [ProtocolConstructor](../interfaces/rlpx_peer.protocolconstructor.md)
- [ProtocolDescriptor](../interfaces/rlpx_peer.protocoldescriptor.md)

### Type aliases

- [HelloMsg](rlpx_peer.md#hellomsg)

### Variables

- [BASE\_PROTOCOL\_LENGTH](rlpx_peer.md#base_protocol_length)
- [BASE\_PROTOCOL\_VERSION](rlpx_peer.md#base_protocol_version)
- [PING\_INTERVAL](rlpx_peer.md#ping_interval)

## Type aliases

### HelloMsg

Ƭ **HelloMsg**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `0` | `Buffer` |
| `1` | `Buffer` |
| `2` | `Buffer`[][] |
| `3` | `Buffer` |
| `4` | `Buffer` |
| `length` | ``5`` |

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L44)

## Variables

### BASE\_PROTOCOL\_LENGTH

• `Const` **BASE\_PROTOCOL\_LENGTH**: ``16``

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L17)

___

### BASE\_PROTOCOL\_VERSION

• `Const` **BASE\_PROTOCOL\_VERSION**: ``4``

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L16)

___

### PING\_INTERVAL

• `Const` **PING\_INTERVAL**: `number`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L19)
