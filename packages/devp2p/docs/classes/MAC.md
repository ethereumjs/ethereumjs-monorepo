[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / MAC

# Class: MAC

Defined in: [packages/devp2p/src/rlpx/mac.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L9)

## Constructors

### Constructor

> **new MAC**(`secret`): `MAC`

Defined in: [packages/devp2p/src/rlpx/mac.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L12)

#### Parameters

##### secret

`Uint8Array`

#### Returns

`MAC`

## Methods

### digest()

> **digest**(): `Uint8Array`\<`ArrayBuffer`\>

Defined in: [packages/devp2p/src/rlpx/mac.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L35)

#### Returns

`Uint8Array`\<`ArrayBuffer`\>

***

### update()

> **update**(`data`): `void`

Defined in: [packages/devp2p/src/rlpx/mac.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L17)

#### Parameters

##### data

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`void`

***

### updateBody()

> **updateBody**(`data`): `void`

Defined in: [packages/devp2p/src/rlpx/mac.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L27)

#### Parameters

##### data

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`void`

***

### updateHeader()

> **updateHeader**(`data`): `void`

Defined in: [packages/devp2p/src/rlpx/mac.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L21)

#### Parameters

##### data

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`void`
