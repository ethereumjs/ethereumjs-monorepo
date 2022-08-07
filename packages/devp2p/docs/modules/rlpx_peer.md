[@ethereumjs/devp2p](../README.md) / rlpx/peer

# Module: rlpx/peer

## Table of contents

### Enumerations

- [DISCONNECT_REASONS](../enums/rlpx_peer.disconnect_reasons.md)
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

- [BASE_PROTOCOL_LENGTH](rlpx_peer.md#base_protocol_length)
- [BASE_PROTOCOL_VERSION](rlpx_peer.md#base_protocol_version)
- [PING_INTERVAL](rlpx_peer.md#ping_interval)

## Type aliases

### HelloMsg

Ƭ **HelloMsg**: `Object`

#### Type declaration

| Name     | Type         |
| :------- | :----------- |
| `0`      | `Buffer`     |
| `1`      | `Buffer`     |
| `2`      | `Buffer`[][] |
| `3`      | `Buffer`     |
| `4`      | `Buffer`     |
| `length` | `5`          |

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L44)

## Variables

### BASE_PROTOCOL_LENGTH

• `Const` **BASE_PROTOCOL_LENGTH**: `16`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L17)

---

### BASE_PROTOCOL_VERSION

• `Const` **BASE_PROTOCOL_VERSION**: `4`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L16)

---

### PING_INTERVAL

• `Const` **PING_INTERVAL**: `number`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L19)
