@ethereumjs/devp2p

# @ethereumjs/devp2p

## Table of contents

### Namespaces

- [ETH](modules/ETH.md)
- [LES](modules/LES.md)
- [SNAP](modules/SNAP.md)

### Enumerations

- [DISCONNECT\_REASONS](enums/DISCONNECT_REASONS.md)
- [PREFIXES](enums/PREFIXES.md)

### Classes

- [BanList](classes/BanList.md)
- [DNS](classes/DNS.md)
- [DPT](classes/DPT.md)
- [Deferred](classes/Deferred.md)
- [ECIES](classes/ECIES.md)
- [ENR](classes/ENR.md)
- [ETH](classes/ETH-1.md)
- [KBucket](classes/KBucket.md)
- [LES](classes/LES-1.md)
- [MAC](classes/MAC.md)
- [Peer](classes/Peer.md)
- [RLPx](classes/RLPx.md)
- [SNAP](classes/SNAP-1.md)
- [Server](classes/Server.md)

### Interfaces

- [Capabilities](interfaces/Capabilities.md)
- [CustomContact](interfaces/CustomContact.md)
- [DPTOptions](interfaces/DPTOptions.md)
- [DPTServerOptions](interfaces/DPTServerOptions.md)
- [Hello](interfaces/Hello.md)
- [PeerInfo](interfaces/PeerInfo.md)
- [ProtocolConstructor](interfaces/ProtocolConstructor.md)
- [ProtocolDescriptor](interfaces/ProtocolDescriptor.md)
- [RLPxOptions](interfaces/RLPxOptions.md)

### Type Aliases

- [DNSOptions](README.md#dnsoptions)
- [Hash](README.md#hash)
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
- [devp2pDebug](README.md#devp2pdebug)
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

## Type Aliases

### DNSOptions

Ƭ **DNSOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `dnsServerAddress?` | `string` | ipv4 or ipv6 address of server to pass to native dns.setServers() Sets the IP address of servers to be used when performing DNS resolution. |

#### Defined in

[packages/devp2p/src/dns/dns.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dns/dns.ts#L22)

___

### Hash

Ƭ **Hash**: `ReturnType`<typeof `keccak256.create`\>

#### Defined in

[packages/devp2p/src/rlpx/mac.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L6)

___

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

[packages/devp2p/src/rlpx/peer.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L46)

## Variables

### BASE\_PROTOCOL\_LENGTH

• `Const` **BASE\_PROTOCOL\_LENGTH**: ``16``

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L19)

___

### BASE\_PROTOCOL\_VERSION

• `Const` **BASE\_PROTOCOL\_VERSION**: ``5``

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L18)

___

### DEFAULT\_ANNOUNCE\_TYPE

• `Const` **DEFAULT\_ANNOUNCE\_TYPE**: ``1``

#### Defined in

[packages/devp2p/src/protocol/les.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/les.ts#L10)

___

### PING\_INTERVAL

• `Const` **PING\_INTERVAL**: `number`

#### Defined in

[packages/devp2p/src/rlpx/peer.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/peer.ts#L21)

## Functions

### assertEq

▸ **assertEq**(`expected`, `actual`, `msg`, `debug`, `messageName?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `expected` | `assertInput` |
| `actual` | `assertInput` |
| `msg` | `string` |
| `debug` | `Function` |
| `messageName?` | `string` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/util.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L67)

___

### buffer2int

▸ **buffer2int**(`buffer`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `buffer` | `Buffer` |

#### Returns

`number`

#### Defined in

[packages/devp2p/src/util.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L43)

___

### createDeferred

▸ **createDeferred**<`T`\>(): [`Deferred`](classes/Deferred.md)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Returns

[`Deferred`](classes/Deferred.md)<`T`\>

#### Defined in

[packages/devp2p/src/util.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L127)

___

### decode

▸ **decode**(`buffer`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `buffer` | `Buffer` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `publicKey` | `Buffer` |
| `typename` | `string` \| `number` |

#### Defined in

[packages/devp2p/src/dpt/message.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/message.ts#L186)

___

### devp2pDebug

▸ **devp2pDebug**(`formatter`, ...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `formatter` | `any` |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

node_modules/@types/debug/index.d.ts:44

___

### encode

▸ **encode**<`T`\>(`typename`, `data`, `privateKey`): `Buffer`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `typename` | `string` |
| `data` | `T` |
| `privateKey` | `Buffer` |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/dpt/message.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/message.ts#L170)

___

### formatLogData

▸ **formatLogData**(`data`, `verbose`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` |
| `verbose` | `boolean` |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/util.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L106)

___

### formatLogId

▸ **formatLogId**(`id`, `verbose`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `verbose` | `boolean` |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/util.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L97)

___

### genPrivateKey

▸ **genPrivateKey**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/util.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L18)

___

### id2pk

▸ **id2pk**(`id`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Buffer` |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/util.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L30)

___

### int2buffer

▸ **int2buffer**(`v`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | ``null`` \| `number` |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/util.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L34)

___

### keccak256

▸ **keccak256**(...`buffers`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...buffers` | `Buffer`[] |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/util.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L13)

___

### pk2id

▸ **pk2id**(`pk`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pk` | `Buffer` |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/util.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L23)

___

### toNewUint8Array

▸ **toNewUint8Array**(`buf`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `buf` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[packages/devp2p/src/util.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L138)

___

### unstrictDecode

▸ **unstrictDecode**(`value`): `Buffer` \| `NestedBufferArray`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Buffer` |

#### Returns

`Buffer` \| `NestedBufferArray`

#### Defined in

[packages/devp2p/src/util.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L131)

___

### xor

▸ **xor**(`a`, `b`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `Buffer` |
| `b` | `any` |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/util.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L58)

___

### zfill

▸ **zfill**(`buffer`, `size`, `leftpad?`): `Buffer`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `buffer` | `Buffer` | `undefined` |
| `size` | `number` | `undefined` |
| `leftpad` | `boolean` | `true` |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/util.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L51)
