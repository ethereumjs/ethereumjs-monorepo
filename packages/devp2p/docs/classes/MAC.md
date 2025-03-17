[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / MAC

# Class: MAC

Defined in: [packages/devp2p/src/rlpx/mac.ts:8](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L8)

## Constructors

### new MAC()

> **new MAC**(`secret`): [`MAC`](MAC.md)

Defined in: [packages/devp2p/src/rlpx/mac.ts:11](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L11)

#### Parameters

##### secret

`Uint8Array`

#### Returns

[`MAC`](MAC.md)

## Methods

### digest()

> **digest**(): `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/mac.ts:34](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L34)

#### Returns

`Uint8Array`

***

### update()

> **update**(`data`): `void`

Defined in: [packages/devp2p/src/rlpx/mac.ts:16](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L16)

#### Parameters

##### data

`string` | `Uint8Array`

#### Returns

`void`

***

### updateBody()

> **updateBody**(`data`): `void`

Defined in: [packages/devp2p/src/rlpx/mac.ts:26](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L26)

#### Parameters

##### data

`string` | `Uint8Array`

#### Returns

`void`

***

### updateHeader()

> **updateHeader**(`data`): `void`

Defined in: [packages/devp2p/src/rlpx/mac.ts:20](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/mac.ts#L20)

#### Parameters

##### data

`string` | `Uint8Array`

#### Returns

`void`
