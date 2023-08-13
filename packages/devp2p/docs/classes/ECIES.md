[@ethereumjs/devp2p](../README.md) / ECIES

# Class: ECIES

## Table of contents

### Constructors

- [constructor](ECIES.md#constructor)

### Methods

- [\_decryptMessage](ECIES.md#_decryptmessage)
- [\_encryptMessage](ECIES.md#_encryptmessage)
- [\_setupFrame](ECIES.md#_setupframe)
- [createAckEIP8](ECIES.md#createackeip8)
- [createAckOld](ECIES.md#createackold)
- [createAuthEIP8](ECIES.md#createautheip8)
- [createAuthNonEIP8](ECIES.md#createauthnoneip8)
- [createBody](ECIES.md#createbody)
- [createHeader](ECIES.md#createheader)
- [parseAckEIP8](ECIES.md#parseackeip8)
- [parseAckPlain](ECIES.md#parseackplain)
- [parseAuthEIP8](ECIES.md#parseautheip8)
- [parseAuthPlain](ECIES.md#parseauthplain)
- [parseBody](ECIES.md#parsebody)
- [parseHeader](ECIES.md#parseheader)

## Constructors

### constructor

• **new ECIES**(`privateKey`, `id`, `remoteId`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Uint8Array` |
| `id` | `Uint8Array` |
| `remoteId` | `Uint8Array` |

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L80)

## Methods

### \_decryptMessage

▸ **_decryptMessage**(`data`, `sharedMacData?`): `Uint8Array`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | `undefined` |
| `sharedMacData` | ``null`` \| `Uint8Array` | `null` |

#### Returns

`Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L119)

___

### \_encryptMessage

▸ **_encryptMessage**(`data`, `sharedMacData?`): `undefined` \| `Uint8Array`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | `undefined` |
| `sharedMacData` | ``null`` \| `Uint8Array` | `null` |

#### Returns

`undefined` \| `Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L90)

___

### \_setupFrame

▸ **_setupFrame**(`remoteData`, `incoming`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `remoteData` | `Uint8Array` |
| `incoming` | `boolean` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L154)

___

### createAckEIP8

▸ **createAckEIP8**(): `undefined` \| `Uint8Array`

#### Returns

`undefined` \| `Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:284](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L284)

___

### createAckOld

▸ **createAckOld**(): `undefined` \| `Uint8Array`

#### Returns

`undefined` \| `Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:301](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L301)

___

### createAuthEIP8

▸ **createAuthEIP8**(): `undefined` \| `Uint8Array`

#### Returns

`undefined` \| `Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L178)

___

### createAuthNonEIP8

▸ **createAuthNonEIP8**(): `undefined` \| `Uint8Array`

#### Returns

`undefined` \| `Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L201)

___

### createBody

▸ **createBody**(`data`): `undefined` \| `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Uint8Array` |

#### Returns

`undefined` \| `Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:378](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L378)

___

### createHeader

▸ **createHeader**(`size`): `undefined` \| `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`undefined` \| `Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:347](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L347)

___

### parseAckEIP8

▸ **parseAckEIP8**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Uint8Array` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:341](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L341)

___

### parseAckPlain

▸ **parseAckPlain**(`data`, `sharedMacData?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | `undefined` |
| `sharedMacData` | ``null`` \| `Uint8Array` | `null` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:311](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L311)

___

### parseAuthEIP8

▸ **parseAuthEIP8**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Uint8Array` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:278](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L278)

___

### parseAuthPlain

▸ **parseAuthPlain**(`data`, `sharedMacData?`): `undefined` \| `Uint8Array`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | `undefined` |
| `sharedMacData` | ``null`` \| `Uint8Array` | `null` |

#### Returns

`undefined` \| `Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L218)

___

### parseBody

▸ **parseBody**(`data`): `undefined` \| `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Uint8Array` |

#### Returns

`undefined` \| `Uint8Array`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:389](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L389)

___

### parseHeader

▸ **parseHeader**(`data`): `undefined` \| `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Uint8Array` |

#### Returns

`undefined` \| `number`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:362](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L362)
