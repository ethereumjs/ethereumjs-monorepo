[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / ECIES

# Class: ECIES

Defined in: [packages/devp2p/src/rlpx/ecies.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L55)

## Constructors

### Constructor

> **new ECIES**(`privateKey`, `id`, `remoteId`, `common?`): `ECIES`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L84)

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

> **\_decryptMessage**(`data`, `sharedMacData?`): `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L145)

#### Parameters

##### data

`Uint8Array`

##### sharedMacData?

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

#### Returns

`Uint8Array`

***

### \_encryptMessage()

> **\_encryptMessage**(`data`, `sharedMacData?`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L116)

#### Parameters

##### data

`Uint8Array`

##### sharedMacData?

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### \_setupFrame()

> **\_setupFrame**(`remoteData`, `incoming`): `void`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L180)

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

Defined in: [packages/devp2p/src/rlpx/ecies.ts:309](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L309)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### createAckOld()

> **createAckOld**(): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:326](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L326)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### createAuthEIP8()

> **createAuthEIP8**(): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L204)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### createAuthNonEIP8()

> **createAuthNonEIP8**(): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L227)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### createBlockHeader()

> **createBlockHeader**(`size`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:372](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L372)

#### Parameters

##### size

`number`

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### createBody()

> **createBody**(`data`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:403](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L403)

#### Parameters

##### data

`Uint8Array`

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### parseAckEIP8()

> **parseAckEIP8**(`data`): `void`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:366](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L366)

#### Parameters

##### data

`Uint8Array`

#### Returns

`void`

***

### parseAckPlain()

> **parseAckPlain**(`data`, `sharedMacData?`): `void`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:336](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L336)

#### Parameters

##### data

`Uint8Array`

##### sharedMacData?

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

#### Returns

`void`

***

### parseAuthEIP8()

> **parseAuthEIP8**(`data`): `void`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L303)

#### Parameters

##### data

`Uint8Array`

#### Returns

`void`

***

### parseAuthPlain()

> **parseAuthPlain**(`data`, `sharedMacData?`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:243](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L243)

#### Parameters

##### data

`Uint8Array`

##### sharedMacData?

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### parseBody()

> **parseBody**(`data`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:414](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L414)

#### Parameters

##### data

`Uint8Array`

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

***

### parseHeader()

> **parseHeader**(`data`): `number` \| `undefined`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:387](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L387)

#### Parameters

##### data

`Uint8Array`

#### Returns

`number` \| `undefined`
