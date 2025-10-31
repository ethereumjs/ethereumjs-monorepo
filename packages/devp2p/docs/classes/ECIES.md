[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / ECIES

# Class: ECIES

Defined in: [packages/devp2p/src/rlpx/ecies.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L61)

## Constructors

### Constructor

> **new ECIES**(`privateKey`, `id`, `remoteId`, `common?`): `ECIES`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L90)

#### Parameters

##### privateKey

`Uint8Array`

##### id

`Uint8Array`

##### remoteId

`Uint8Array`

##### common?

`Common`

#### Returns

`ECIES`

## Methods

### \_decryptMessage()

> **\_decryptMessage**(`data`, `sharedMacData`): `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L133)

#### Parameters

##### data

`Uint8Array`

##### sharedMacData

`Uint8Array`\<`ArrayBufferLike`\> | `null`

#### Returns

`Uint8Array`

***

### \_encryptMessage()

> **\_encryptMessage**(`data`, `sharedMacData`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L104)

#### Parameters

##### data

`Uint8Array`

##### sharedMacData

`Uint8Array`\<`ArrayBufferLike`\> | `null`

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### \_setupFrame()

> **\_setupFrame**(`remoteData`, `incoming`): `void`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L168)

#### Parameters

##### remoteData

`Uint8Array`

##### incoming

`boolean`

#### Returns

`void`

***

### createAckEIP8()

> **createAckEIP8**(): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L303)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### createAckOld()

> **createAckOld**(): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:320](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L320)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### createAuthEIP8()

> **createAuthEIP8**(): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L192)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### createAuthNonEIP8()

> **createAuthNonEIP8**(): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L219)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### createBlockHeader()

> **createBlockHeader**(`size`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:366](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L366)

#### Parameters

##### size

`number`

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### createBody()

> **createBody**(`data`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:397](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L397)

#### Parameters

##### data

`Uint8Array`

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### parseAckEIP8()

> **parseAckEIP8**(`data`): `void`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:360](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L360)

#### Parameters

##### data

`Uint8Array`

#### Returns

`void`

***

### parseAckPlain()

> **parseAckPlain**(`data`, `sharedMacData`): `void`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:330](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L330)

#### Parameters

##### data

`Uint8Array`

##### sharedMacData

`Uint8Array`\<`ArrayBufferLike`\> | `null`

#### Returns

`void`

***

### parseAuthEIP8()

> **parseAuthEIP8**(`data`): `void`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:297](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L297)

#### Parameters

##### data

`Uint8Array`

#### Returns

`void`

***

### parseAuthPlain()

> **parseAuthPlain**(`data`, `sharedMacData`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L237)

#### Parameters

##### data

`Uint8Array`

##### sharedMacData

`Uint8Array`\<`ArrayBufferLike`\> | `null`

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### parseBody()

> **parseBody**(`data`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:408](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L408)

#### Parameters

##### data

`Uint8Array`

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### parseHeader()

> **parseHeader**(`data`): `number` \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:381](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L381)

#### Parameters

##### data

`Uint8Array`

#### Returns

`number` \| `undefined`
