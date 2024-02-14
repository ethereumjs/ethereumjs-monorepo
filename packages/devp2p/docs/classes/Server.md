[@ethereumjs/devp2p](../README.md) / Server

# Class: Server

## Table of contents

### Constructors

- [constructor](Server.md#constructor)

### Properties

- [events](Server.md#events)

### Methods

- [\_handler](Server.md#_handler)
- [\_isAliveCheck](Server.md#_isalivecheck)
- [\_send](Server.md#_send)
- [bind](Server.md#bind)
- [destroy](Server.md#destroy)
- [findneighbours](Server.md#findneighbours)
- [ping](Server.md#ping)

## Constructors

### constructor

• **new Server**(`dpt`, `privateKey`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `dpt` | [`DPT`](DPT.md) |
| `privateKey` | `Uint8Array` |
| `options` | [`DPTServerOptions`](../interfaces/DPTServerOptions.md) |

#### Defined in

[packages/devp2p/src/dpt/server.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L35)

## Properties

### events

• **events**: `EventEmitter`

#### Defined in

[packages/devp2p/src/dpt/server.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L25)

## Methods

### \_handler

▸ **_handler**(`msg`, `rinfo`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `Uint8Array` |
| `rinfo` | `RemoteInfo` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/server.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L139)

___

### \_isAliveCheck

▸ **_isAliveCheck**(): `void`

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/server.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L120)

___

### \_send

▸ **_send**(`peer`, `typename`, `data`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `peer` | [`PeerInfo`](../interfaces/PeerInfo.md) |
| `typename` | `string` |
| `data` | `any` |

#### Returns

`Uint8Array`

#### Defined in

[packages/devp2p/src/dpt/server.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L124)

___

### bind

▸ **bind**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/server.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L62)

___

### destroy

▸ **destroy**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/server.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L69)

___

### findneighbours

▸ **findneighbours**(`peer`, `id`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `peer` | [`PeerInfo`](../interfaces/PeerInfo.md) |
| `id` | `Uint8Array` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/server.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L115)

___

### ping

▸ **ping**(`peer`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `peer` | [`PeerInfo`](../interfaces/PeerInfo.md) |

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/devp2p/src/dpt/server.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L79)
