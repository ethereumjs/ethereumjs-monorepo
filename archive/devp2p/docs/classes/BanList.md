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

Defined in: [packages/devp2p/src/dpt/ban-list.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/ban-list.ts#L21)

#### Parameters

##### obj

`string` \| `Uint8Array`\<`ArrayBufferLike`\> \| [`PeerInfo`](../interfaces/PeerInfo.md)

##### maxAge?

`number`

#### Returns

`void`

***

### has()

> **has**(`obj`): `boolean`

Defined in: [packages/devp2p/src/dpt/ban-list.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/ban-list.ts#L30)

#### Parameters

##### obj

`string` \| `Uint8Array`\<`ArrayBufferLike`\> \| [`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`boolean`
