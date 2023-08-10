@ethereumjs/devp2p

# @ethereumjs/devp2p

## Table of contents

### Namespaces

- [ETH](modules/ETH.md)
- [LES](modules/LES.md)
- [SNAP](modules/SNAP.md)

### Enumerations

- [DISCONNECT\_REASON](enums/DISCONNECT_REASON.md)
- [ProtocolType](enums/ProtocolType.md)

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
- [Contact](interfaces/Contact.md)
- [DPTOptions](interfaces/DPTOptions.md)
- [DPTServerOptions](interfaces/DPTServerOptions.md)
- [KBucketOptions](interfaces/KBucketOptions.md)
- [PeerInfo](interfaces/PeerInfo.md)
- [PeerOptions](interfaces/PeerOptions.md)
- [RLPxOptions](interfaces/RLPxOptions.md)

### Type Aliases

- [DNSOptions](README.md#dnsoptions)
- [SendMethod](README.md#sendmethod)

### Variables

- [DEFAULT\_ANNOUNCE\_TYPE](README.md#default_announce_type)

### Functions

- [assertEq](README.md#asserteq)
- [createDeferred](README.md#createdeferred)
- [decode](README.md#decode)
- [devp2pDebug](README.md#devp2pdebug)
- [encode](README.md#encode)
- [formatLogData](README.md#formatlogdata)
- [formatLogId](README.md#formatlogid)
- [genPrivateKey](README.md#genprivatekey)
- [id2pk](README.md#id2pk)
- [ipToBytes](README.md#iptobytes)
- [ipToString](README.md#iptostring)
- [isV4Format](README.md#isv4format)
- [isV6Format](README.md#isv6format)
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

[packages/devp2p/src/types.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L32)

___

### SendMethod

Ƭ **SendMethod**: (`code`: `number`, `data`: `Uint8Array`) => `any`

#### Type declaration

▸ (`code`, `data`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `number` |
| `data` | `Uint8Array` |

##### Returns

`any`

#### Defined in

[packages/devp2p/src/types.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/types.ts#L212)

## Variables

### DEFAULT\_ANNOUNCE\_TYPE

• `Const` **DEFAULT\_ANNOUNCE\_TYPE**: ``1``

#### Defined in

[packages/devp2p/src/protocol/les.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/protocol/les.ts#L21)

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

[packages/devp2p/src/util.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L51)

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

[packages/devp2p/src/util.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L112)

___

### decode

▸ **decode**(`bytes`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `publicKey` | `Uint8Array` |
| `typename` | `string` \| `number` |

#### Defined in

[packages/devp2p/src/dpt/message.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/message.ts#L190)

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

node_modules/@types/debug/index.d.ts:51

___

### encode

▸ **encode**<`T`\>(`typename`, `data`, `privateKey`): `Uint8Array`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `typename` | `string` |
| `data` | `T` |
| `privateKey` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[packages/devp2p/src/dpt/message.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/message.ts#L177)

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

[packages/devp2p/src/util.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L91)

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

[packages/devp2p/src/util.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L82)

___

### genPrivateKey

▸ **genPrivateKey**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[packages/devp2p/src/util.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L19)

___

### id2pk

▸ **id2pk**(`id`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[packages/devp2p/src/util.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L31)

___

### ipToBytes

▸ **ipToBytes**(`ip`, `bytes?`, `offset?`): `Uint8Array`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `ip` | `string` | `undefined` |
| `bytes?` | `Uint8Array` | `undefined` |
| `offset` | `number` | `0` |

#### Returns

`Uint8Array`

#### Defined in

[packages/devp2p/src/util.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L167)

___

### ipToString

▸ **ipToString**(`bytes`, `offset?`, `length?`): `string`

************************* ***********************************************************

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |
| `offset?` | `number` |
| `length?` | `number` |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/util.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L131)

___

### isV4Format

▸ **isV4Format**(`ip`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ip` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/devp2p/src/util.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L159)

___

### isV6Format

▸ **isV6Format**(`ip`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ip` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/devp2p/src/util.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L163)

___

### keccak256

▸ **keccak256**(...`bytes`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...bytes` | `Uint8Array`[] |

#### Returns

`Uint8Array`

#### Defined in

[packages/devp2p/src/util.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L14)

___

### pk2id

▸ **pk2id**(`pk`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pk` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[packages/devp2p/src/util.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L24)

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

[packages/devp2p/src/util.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L123)

___

### unstrictDecode

▸ **unstrictDecode**(`value`): `Uint8Array` \| `NestedUint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Uint8Array` |

#### Returns

`Uint8Array` \| `NestedUint8Array`

#### Defined in

[packages/devp2p/src/util.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L116)

___

### xor

▸ **xor**(`a`, `b`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `Uint8Array` |
| `b` | `any` |

#### Returns

`Uint8Array`

#### Defined in

[packages/devp2p/src/util.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L42)

___

### zfill

▸ **zfill**(`bytes`, `size`, `leftpad?`): `Uint8Array`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | `undefined` |
| `size` | `number` | `undefined` |
| `leftpad` | `boolean` | `true` |

#### Returns

`Uint8Array`

#### Defined in

[packages/devp2p/src/util.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L35)
