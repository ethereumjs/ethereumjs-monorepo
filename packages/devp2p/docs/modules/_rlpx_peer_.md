**[ethereumjs-devp2p](../README.md)**

> [Globals](../README.md) / "rlpx/peer"

# Module: "rlpx/peer"

## Index

### Enumerations

* [DISCONNECT\_REASONS](../enums/_rlpx_peer_.disconnect_reasons.md)
* [PREFIXES](../enums/_rlpx_peer_.prefixes.md)

### Classes

* [Peer](../classes/_rlpx_peer_.peer.md)

### Interfaces

* [Capabilities](../interfaces/_rlpx_peer_.capabilities.md)
* [Hello](../interfaces/_rlpx_peer_.hello.md)
* [ProtocolConstructor](../interfaces/_rlpx_peer_.protocolconstructor.md)
* [ProtocolDescriptor](../interfaces/_rlpx_peer_.protocoldescriptor.md)

### Type aliases

* [HelloMsg](_rlpx_peer_.md#hellomsg)

### Variables

* [BASE\_PROTOCOL\_LENGTH](_rlpx_peer_.md#base_protocol_length)
* [BASE\_PROTOCOL\_VERSION](_rlpx_peer_.md#base_protocol_version)
* [PING\_INTERVAL](_rlpx_peer_.md#ping_interval)

## Type aliases

### HelloMsg

Ƭ  **HelloMsg**: { 0: Buffer ; 1: Buffer ; 2: Buffer[][] ; 3: Buffer ; 4: Buffer ; length: 5  }

*Defined in [src/rlpx/peer.ts:43](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L43)*

#### Type declaration:

Name | Type |
------ | ------ |
`0` | Buffer |
`1` | Buffer |
`2` | Buffer[][] |
`3` | Buffer |
`4` | Buffer |
`length` | 5 |

## Variables

### BASE\_PROTOCOL\_LENGTH

• `Const` **BASE\_PROTOCOL\_LENGTH**: 16 = 16

*Defined in [src/rlpx/peer.ts:16](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L16)*

___

### BASE\_PROTOCOL\_VERSION

• `Const` **BASE\_PROTOCOL\_VERSION**: 4 = 4

*Defined in [src/rlpx/peer.ts:15](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L15)*

___

### PING\_INTERVAL

• `Const` **PING\_INTERVAL**: number = ms('15s')

*Defined in [src/rlpx/peer.ts:18](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L18)*
