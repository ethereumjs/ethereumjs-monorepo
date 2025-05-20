[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / BanList

# Class: BanList

Defined in: [packages/devp2p/src/dpt/ban-list.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/ban-list.ts#L13)

## Constructors

### Constructor

> **new BanList**(): `BanList`

Defined in: [packages/devp2p/src/dpt/ban-list.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/ban-list.ts#L16)

#### Returns

`BanList`

## Methods

### add()

> **add**(`obj`, `maxAge?`): `void`

Defined in: [packages/devp2p/src/dpt/ban-list.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/ban-list.ts#L22)

#### Parameters

##### obj

`string` | [`PeerInfo`](../interfaces/PeerInfo.md) | `Uint8Array`\<`ArrayBufferLike`\>

##### maxAge?

`number`

#### Returns

`void`

***

### has()

> **has**(`obj`): `boolean`

Defined in: [packages/devp2p/src/dpt/ban-list.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/ban-list.ts#L31)

#### Parameters

##### obj

`string` | [`PeerInfo`](../interfaces/PeerInfo.md) | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`boolean`
