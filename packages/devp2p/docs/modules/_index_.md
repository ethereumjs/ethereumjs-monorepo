**[ethereumjs-devp2p](../README.md)**

> [Globals](../README.md) / "index"

# Module: "index"

## Index

### Enumerations

* [DISCONNECT\_REASONS](../enums/_index_.disconnect_reasons.md)
* [PREFIXES](../enums/_index_.prefixes.md)

### Classes

* [BanList](../classes/_index_.banlist.md)
* [DPT](../classes/_index_.dpt.md)
* [Deferred](../classes/_index_.deferred.md)
* [ECIES](../classes/_index_.ecies.md)
* [ETH](../classes/_index_.eth.md)
* [KBucket](../classes/_index_.kbucket.md)
* [LES](../classes/_index_.les.md)
* [MAC](../classes/_index_.mac.md)
* [Peer](../classes/_index_.peer.md)
* [RLPx](../classes/_index_.rlpx.md)
* [Server](../classes/_index_.server.md)

### Interfaces

* [Capabilities](../interfaces/_index_.capabilities.md)
* [DptServerOptions](../interfaces/_index_.dptserveroptions.md)
* [Hello](../interfaces/_index_.hello.md)
* [KObj](../interfaces/_index_.kobj.md)
* [PeerInfo](../interfaces/_index_.peerinfo.md)
* [ProtocolConstructor](../interfaces/_index_.protocolconstructor.md)
* [ProtocolDescriptor](../interfaces/_index_.protocoldescriptor.md)
* [RLPxOptions](../interfaces/_index_.rlpxoptions.md)

### Type aliases

* [HelloMsg](_index_.md#hellomsg)

### Variables

* [BASE\_PROTOCOL\_LENGTH](_index_.md#base_protocol_length)
* [BASE\_PROTOCOL\_VERSION](_index_.md#base_protocol_version)
* [DEFAULT\_ANNOUNCE\_TYPE](_index_.md#default_announce_type)
* [PING\_INTERVAL](_index_.md#ping_interval)

### Functions

* [assertEq](_index_.md#asserteq)
* [buffer2int](_index_.md#buffer2int)
* [createDeferred](_index_.md#createdeferred)
* [decode](_index_.md#decode)
* [encode](_index_.md#encode)
* [formatLogData](_index_.md#formatlogdata)
* [formatLogId](_index_.md#formatlogid)
* [genPrivateKey](_index_.md#genprivatekey)
* [id2pk](_index_.md#id2pk)
* [int2buffer](_index_.md#int2buffer)
* [keccak256](_index_.md#keccak256)
* [pk2id](_index_.md#pk2id)
* [xor](_index_.md#xor)
* [zfill](_index_.md#zfill)

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

### DEFAULT\_ANNOUNCE\_TYPE

• `Const` **DEFAULT\_ANNOUNCE\_TYPE**: 1 = 1

*Defined in [src/les/index.ts:11](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/les/index.ts#L11)*

___

### PING\_INTERVAL

• `Const` **PING\_INTERVAL**: number = ms('15s')

*Defined in [src/rlpx/peer.ts:18](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/peer.ts#L18)*

## Functions

### assertEq

▸ **assertEq**(`expected`: any, `actual`: any, `msg`: string, `debug`: any): void

*Defined in [src/util.ts:57](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L57)*

#### Parameters:

Name | Type |
------ | ------ |
`expected` | any |
`actual` | any |
`msg` | string |
`debug` | any |

**Returns:** void

___

### buffer2int

▸ **buffer2int**(`buffer`: Buffer): number

*Defined in [src/util.ts:35](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L35)*

#### Parameters:

Name | Type |
------ | ------ |
`buffer` | Buffer |

**Returns:** number

___

### createDeferred

▸ **createDeferred**\<T>(): [Deferred](../classes/_index_.deferred.md)\<T>

*Defined in [src/util.ts:106](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L106)*

#### Type parameters:

Name |
------ |
`T` |

**Returns:** [Deferred](../classes/_index_.deferred.md)\<T>

___

### decode

▸ **decode**(`buffer`: Buffer): object

*Defined in [src/dpt/message.ts:188](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/message.ts#L188)*

#### Parameters:

Name | Type |
------ | ------ |
`buffer` | Buffer |

**Returns:** object

Name | Type |
------ | ------ |
`data` | any |
`publicKey` | Buffer |
`typename` | string \| number |

___

### encode

▸ **encode**\<T>(`typename`: string, `data`: T, `privateKey`: Buffer): Buffer

*Defined in [src/dpt/message.ts:175](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/message.ts#L175)*

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type |
------ | ------ |
`typename` | string |
`data` | T |
`privateKey` | Buffer |

**Returns:** Buffer

___

### formatLogData

▸ **formatLogData**(`data`: string, `verbose`: boolean): string

*Defined in [src/util.ts:85](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L85)*

#### Parameters:

Name | Type |
------ | ------ |
`data` | string |
`verbose` | boolean |

**Returns:** string

___

### formatLogId

▸ **formatLogId**(`id`: string, `verbose`: boolean): string

*Defined in [src/util.ts:76](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L76)*

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`verbose` | boolean |

**Returns:** string

___

### genPrivateKey

▸ **genPrivateKey**(): Buffer

*Defined in [src/util.ts:13](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L13)*

**Returns:** Buffer

___

### id2pk

▸ **id2pk**(`id`: Buffer): Buffer

*Defined in [src/util.ts:25](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L25)*

#### Parameters:

Name | Type |
------ | ------ |
`id` | Buffer |

**Returns:** Buffer

___

### int2buffer

▸ **int2buffer**(`v`: number): Buffer

*Defined in [src/util.ts:29](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L29)*

#### Parameters:

Name | Type |
------ | ------ |
`v` | number |

**Returns:** Buffer

___

### keccak256

▸ **keccak256**(...`buffers`: Buffer[]): Buffer

*Defined in [src/util.ts:6](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L6)*

#### Parameters:

Name | Type |
------ | ------ |
`...buffers` | Buffer[] |

**Returns:** Buffer

___

### pk2id

▸ **pk2id**(`pk`: Buffer): Buffer

*Defined in [src/util.ts:18](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L18)*

#### Parameters:

Name | Type |
------ | ------ |
`pk` | Buffer |

**Returns:** Buffer

___

### xor

▸ **xor**(`a`: Buffer, `b`: any): Buffer

*Defined in [src/util.ts:50](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L50)*

#### Parameters:

Name | Type |
------ | ------ |
`a` | Buffer |
`b` | any |

**Returns:** Buffer

___

### zfill

▸ **zfill**(`buffer`: Buffer, `size`: number, `leftpad?`: boolean): Buffer

*Defined in [src/util.ts:43](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/util.ts#L43)*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`buffer` | Buffer | - |
`size` | number | - |
`leftpad` | boolean | true |

**Returns:** Buffer
