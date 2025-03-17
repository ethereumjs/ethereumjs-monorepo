[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / ECIES

# Class: ECIES

Defined in: [packages/devp2p/src/rlpx/ecies.ts:53](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L53)

## Constructors

### new ECIES()

> **new ECIES**(`privateKey`, `id`, `remoteId`, `common`?): [`ECIES`](ECIES.md)

Defined in: [packages/devp2p/src/rlpx/ecies.ts:88](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L88)

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

[`ECIES`](ECIES.md)

## Methods

### \_decryptMessage()

> **\_decryptMessage**(`data`, `sharedMacData`): `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:131](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L131)

#### Parameters

##### data

`Uint8Array`

##### sharedMacData

`null` | `Uint8Array`

#### Returns

`Uint8Array`

***

### \_encryptMessage()

> **\_encryptMessage**(`data`, `sharedMacData`): `undefined` \| `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:102](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L102)

#### Parameters

##### data

`Uint8Array`

##### sharedMacData

`null` | `Uint8Array`

#### Returns

`undefined` \| `Uint8Array`

***

### \_setupFrame()

> **\_setupFrame**(`remoteData`, `incoming`): `void`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:166](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L166)

#### Parameters

##### remoteData

`Uint8Array`

##### incoming

`boolean`

#### Returns

`void`

***

### createAckEIP8()

> **createAckEIP8**(): `undefined` \| `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:296](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L296)

#### Returns

`undefined` \| `Uint8Array`

***

### createAckOld()

> **createAckOld**(): `undefined` \| `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:313](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L313)

#### Returns

`undefined` \| `Uint8Array`

***

### createAuthEIP8()

> **createAuthEIP8**(): `undefined` \| `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:190](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L190)

#### Returns

`undefined` \| `Uint8Array`

***

### createAuthNonEIP8()

> **createAuthNonEIP8**(): `undefined` \| `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:213](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L213)

#### Returns

`undefined` \| `Uint8Array`

***

### createBlockHeader()

> **createBlockHeader**(`size`): `undefined` \| `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:359](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L359)

#### Parameters

##### size

`number`

#### Returns

`undefined` \| `Uint8Array`

***

### createBody()

> **createBody**(`data`): `undefined` \| `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:390](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L390)

#### Parameters

##### data

`Uint8Array`

#### Returns

`undefined` \| `Uint8Array`

***

### parseAckEIP8()

> **parseAckEIP8**(`data`): `void`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:353](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L353)

#### Parameters

##### data

`Uint8Array`

#### Returns

`void`

***

### parseAckPlain()

> **parseAckPlain**(`data`, `sharedMacData`): `void`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:323](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L323)

#### Parameters

##### data

`Uint8Array`

##### sharedMacData

`null` | `Uint8Array`

#### Returns

`void`

***

### parseAuthEIP8()

> **parseAuthEIP8**(`data`): `void`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:290](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L290)

#### Parameters

##### data

`Uint8Array`

#### Returns

`void`

***

### parseAuthPlain()

> **parseAuthPlain**(`data`, `sharedMacData`): `undefined` \| `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:230](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L230)

#### Parameters

##### data

`Uint8Array`

##### sharedMacData

`null` | `Uint8Array`

#### Returns

`undefined` \| `Uint8Array`

***

### parseBody()

> **parseBody**(`data`): `undefined` \| `Uint8Array`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:401](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L401)

#### Parameters

##### data

`Uint8Array`

#### Returns

`undefined` \| `Uint8Array`

***

### parseHeader()

> **parseHeader**(`data`): `undefined` \| `number`

Defined in: [packages/devp2p/src/rlpx/ecies.ts:374](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L374)

#### Parameters

##### data

`Uint8Array`

#### Returns

`undefined` \| `number`
