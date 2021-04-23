@ethereumjs/devp2p

# @ethereumjs/devp2p

## Table of contents

### Namespaces

- [ETH](modules/eth.md)
- [LES](modules/les.md)

### Enumerations

- [DISCONNECT\_REASONS](enums/disconnect_reasons.md)
- [PREFIXES](enums/prefixes.md)

### Classes

- [BanList](classes/banlist.md)
- [DNS](classes/dns.md)
- [DPT](classes/dpt.md)
- [Deferred](classes/deferred.md)
- [ECIES](classes/ecies.md)
- [ENR](classes/enr.md)
- [ETH](classes/eth.md)
- [KBucket](classes/kbucket.md)
- [LES](classes/les.md)
- [MAC](classes/mac.md)
- [Peer](classes/peer.md)
- [RLPx](classes/rlpx.md)
- [Server](classes/server.md)

### Interfaces

- [Capabilities](interfaces/capabilities.md)
- [CustomContact](interfaces/customcontact.md)
- [DPTOptions](interfaces/dptoptions.md)
- [DPTServerOptions](interfaces/dptserveroptions.md)
- [Hello](interfaces/hello.md)
- [PeerInfo](interfaces/peerinfo.md)
- [ProtocolConstructor](interfaces/protocolconstructor.md)
- [ProtocolDescriptor](interfaces/protocoldescriptor.md)
- [RLPxOptions](interfaces/rlpxoptions.md)

### Type aliases

- [DNSOptions](README.md#dnsoptions)
- [HelloMsg](README.md#hellomsg)

### Variables

- [BASE\_PROTOCOL\_LENGTH](README.md#base_protocol_length)
- [BASE\_PROTOCOL\_VERSION](README.md#base_protocol_version)
- [DEFAULT\_ANNOUNCE\_TYPE](README.md#default_announce_type)
- [PING\_INTERVAL](README.md#ping_interval)

### Functions

- [assertEq](README.md#asserteq)
- [buffer2int](README.md#buffer2int)
- [createDeferred](README.md#createdeferred)
- [decode](README.md#decode)
- [encode](README.md#encode)
- [formatLogData](README.md#formatlogdata)
- [formatLogId](README.md#formatlogid)
- [genPrivateKey](README.md#genprivatekey)
- [id2pk](README.md#id2pk)
- [int2buffer](README.md#int2buffer)
- [keccak256](README.md#keccak256)
- [pk2id](README.md#pk2id)
- [toNewUint8Array](README.md#tonewuint8array)
- [unstrictDecode](README.md#unstrictdecode)
- [xor](README.md#xor)
- [zfill](README.md#zfill)

## Type aliases

### DNSOptions

Ƭ **DNSOptions**: *object*

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`dnsServerAddress`? | *string* | ipv4 or ipv6 address of server to pass to native dns.setServers() Sets the IP address of servers to be used when performing DNS resolution.   |

Defined in: [dns/dns.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/dns.ts#L21)

___

### HelloMsg

Ƭ **HelloMsg**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`0` | Buffer |
`1` | Buffer |
`2` | Buffer[][] |
`3` | Buffer |
`4` | Buffer |
`length` | *5* |

Defined in: [rlpx/peer.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L44)

## Variables

### BASE\_PROTOCOL\_LENGTH

• `Const` **BASE\_PROTOCOL\_LENGTH**: *16*= 16

Defined in: [rlpx/peer.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L17)

___

### BASE\_PROTOCOL\_VERSION

• `Const` **BASE\_PROTOCOL\_VERSION**: *4*= 4

Defined in: [rlpx/peer.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L16)

___

### DEFAULT\_ANNOUNCE\_TYPE

• `Const` **DEFAULT\_ANNOUNCE\_TYPE**: *1*= 1

Defined in: [les/index.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L11)

___

### PING\_INTERVAL

• `Const` **PING\_INTERVAL**: *number*

Defined in: [rlpx/peer.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L19)

## Functions

### assertEq

▸ **assertEq**(`expected`: assertInput, `actual`: assertInput, `msg`: *string*, `debug`: Function): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`expected` | assertInput |
`actual` | assertInput |
`msg` | *string* |
`debug` | Function |

**Returns:** *void*

Defined in: [util.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L63)

___

### buffer2int

▸ **buffer2int**(`buffer`: Buffer): *number*

#### Parameters:

Name | Type |
:------ | :------ |
`buffer` | Buffer |

**Returns:** *number*

Defined in: [util.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L39)

___

### createDeferred

▸ **createDeferred**<T\>(): [*Deferred*](classes/deferred.md)<T\>

#### Type parameters:

Name |
:------ |
`T` |

**Returns:** [*Deferred*](classes/deferred.md)<T\>

Defined in: [util.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L117)

___

### decode

▸ **decode**(`buffer`: Buffer): *object*

#### Parameters:

Name | Type |
:------ | :------ |
`buffer` | Buffer |

**Returns:** *object*

Name | Type |
:------ | :------ |
`data` | *any* |
`publicKey` | *Buffer* |
`typename` | *string* \| *number* |

Defined in: [dpt/message.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/message.ts#L181)

___

### encode

▸ **encode**<T\>(`typename`: *string*, `data`: T, `privateKey`: Buffer): *Buffer*

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`typename` | *string* |
`data` | T |
`privateKey` | Buffer |

**Returns:** *Buffer*

Defined in: [dpt/message.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/message.ts#L168)

___

### formatLogData

▸ **formatLogData**(`data`: *string*, `verbose`: *boolean*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | *string* |
`verbose` | *boolean* |

**Returns:** *string*

Defined in: [util.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L96)

___

### formatLogId

▸ **formatLogId**(`id`: *string*, `verbose`: *boolean*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |
`verbose` | *boolean* |

**Returns:** *string*

Defined in: [util.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L87)

___

### genPrivateKey

▸ **genPrivateKey**(): Buffer

**Returns:** Buffer

Defined in: [util.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L14)

___

### id2pk

▸ **id2pk**(`id`: Buffer): Buffer

#### Parameters:

Name | Type |
:------ | :------ |
`id` | Buffer |

**Returns:** Buffer

Defined in: [util.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L26)

___

### int2buffer

▸ **int2buffer**(`v`: *number* \| *null*): Buffer

#### Parameters:

Name | Type |
:------ | :------ |
`v` | *number* \| *null* |

**Returns:** Buffer

Defined in: [util.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L30)

___

### keccak256

▸ **keccak256**(...`buffers`: Buffer[]): *Buffer*

#### Parameters:

Name | Type |
:------ | :------ |
`...buffers` | Buffer[] |

**Returns:** *Buffer*

Defined in: [util.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L9)

___

### pk2id

▸ **pk2id**(`pk`: Buffer): Buffer

#### Parameters:

Name | Type |
:------ | :------ |
`pk` | Buffer |

**Returns:** Buffer

Defined in: [util.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L19)

___

### toNewUint8Array

▸ **toNewUint8Array**(`buf`: Uint8Array): Uint8Array

#### Parameters:

Name | Type |
:------ | :------ |
`buf` | Uint8Array |

**Returns:** Uint8Array

Defined in: [util.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L128)

___

### unstrictDecode

▸ **unstrictDecode**(`value`: Buffer): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`value` | Buffer |

**Returns:** *any*

Defined in: [util.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L121)

___

### xor

▸ **xor**(`a`: Buffer, `b`: *any*): Buffer

#### Parameters:

Name | Type |
:------ | :------ |
`a` | Buffer |
`b` | *any* |

**Returns:** Buffer

Defined in: [util.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L54)

___

### zfill

▸ **zfill**(`buffer`: Buffer, `size`: *number*, `leftpad?`: *boolean*): Buffer

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`buffer` | Buffer | - |
`size` | *number* | - |
`leftpad` | *boolean* | true |

**Returns:** Buffer

Defined in: [util.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L47)
