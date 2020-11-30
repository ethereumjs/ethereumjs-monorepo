**[ethereumjs-devp2p](../README.md)**

> [Globals](../README.md) / "rlpx/index"

# Module: "rlpx/index"

## Index

### Enumerations

* [DISCONNECT\_REASONS](../enums/_rlpx_index_.disconnect_reasons.md)
* [PREFIXES](../enums/_rlpx_index_.prefixes.md)

### Classes

* [ECIES](../classes/_rlpx_index_.ecies.md)
* [MAC](../classes/_rlpx_index_.mac.md)
* [Peer](../classes/_rlpx_index_.peer.md)
* [RLPx](../classes/_rlpx_index_.rlpx.md)

### Interfaces

* [Capabilities](../interfaces/_rlpx_index_.capabilities.md)
* [Hello](../interfaces/_rlpx_index_.hello.md)
* [ProtocolConstructor](../interfaces/_rlpx_index_.protocolconstructor.md)
* [ProtocolDescriptor](../interfaces/_rlpx_index_.protocoldescriptor.md)
* [RLPxOptions](../interfaces/_rlpx_index_.rlpxoptions.md)

### Type aliases

* [HelloMsg](_rlpx_index_.md#hellomsg)

### Variables

* [BASE\_PROTOCOL\_LENGTH](_rlpx_index_.md#base_protocol_length)
* [BASE\_PROTOCOL\_VERSION](_rlpx_index_.md#base_protocol_version)
* [PING\_INTERVAL](_rlpx_index_.md#ping_interval)

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
