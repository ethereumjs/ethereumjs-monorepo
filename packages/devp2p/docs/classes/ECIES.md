[@ethereumjs/devp2p](../README.md) / ECIES

# Class: ECIES

## Table of contents

### Constructors

- [constructor](ECIES.md#constructor)

### Properties

- [\_bodySize](ECIES.md#_bodysize)
- [\_egressAes](ECIES.md#_egressaes)
- [\_egressMac](ECIES.md#_egressmac)
- [\_ephemeralPrivateKey](ECIES.md#_ephemeralprivatekey)
- [\_ephemeralPublicKey](ECIES.md#_ephemeralpublickey)
- [\_ephemeralSharedSecret](ECIES.md#_ephemeralsharedsecret)
- [\_gotEIP8Ack](ECIES.md#_goteip8ack)
- [\_gotEIP8Auth](ECIES.md#_goteip8auth)
- [\_ingressAes](ECIES.md#_ingressaes)
- [\_ingressMac](ECIES.md#_ingressmac)
- [\_initMsg](ECIES.md#_initmsg)
- [\_nonce](ECIES.md#_nonce)
- [\_privateKey](ECIES.md#_privatekey)
- [\_publicKey](ECIES.md#_publickey)
- [\_remoteEphemeralPublicKey](ECIES.md#_remoteephemeralpublickey)
- [\_remoteInitMsg](ECIES.md#_remoteinitmsg)
- [\_remoteNonce](ECIES.md#_remotenonce)
- [\_remotePublicKey](ECIES.md#_remotepublickey)

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
| `privateKey` | `Buffer` |
| `id` | `Buffer` |
| `remoteId` | `Buffer` |

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L77)

## Properties

### \_bodySize

• **\_bodySize**: ``null`` \| `number` = `null`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L75)

___

### \_egressAes

• **\_egressAes**: ``null`` \| `Decipher` = `null`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L68)

___

### \_egressMac

• **\_egressMac**: ``null`` \| [`MAC`](MAC.md) = `null`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L70)

___

### \_ephemeralPrivateKey

• **\_ephemeralPrivateKey**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L71)

___

### \_ephemeralPublicKey

• **\_ephemeralPublicKey**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L72)

___

### \_ephemeralSharedSecret

• **\_ephemeralSharedSecret**: ``null`` \| `Buffer` = `null`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L74)

___

### \_gotEIP8Ack

• **\_gotEIP8Ack**: `boolean` = `false`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L66)

___

### \_gotEIP8Auth

• **\_gotEIP8Auth**: `boolean` = `false`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L65)

___

### \_ingressAes

• **\_ingressAes**: ``null`` \| `Decipher` = `null`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L67)

___

### \_ingressMac

• **\_ingressMac**: ``null`` \| [`MAC`](MAC.md) = `null`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L69)

___

### \_initMsg

• **\_initMsg**: `undefined` \| ``null`` \| `Buffer` = `null`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L63)

___

### \_nonce

• **\_nonce**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L61)

___

### \_privateKey

• **\_privateKey**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L58)

___

### \_publicKey

• **\_publicKey**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L59)

___

### \_remoteEphemeralPublicKey

• **\_remoteEphemeralPublicKey**: ``null`` \| `Buffer` = `null`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L73)

___

### \_remoteInitMsg

• **\_remoteInitMsg**: ``null`` \| `Buffer` = `null`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L64)

___

### \_remoteNonce

• **\_remoteNonce**: ``null`` \| `Buffer` = `null`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L62)

___

### \_remotePublicKey

• **\_remotePublicKey**: ``null`` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L60)

## Methods

### \_decryptMessage

▸ **_decryptMessage**(`data`, `sharedMacData?`): `Buffer`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `Buffer` | `undefined` |
| `sharedMacData` | ``null`` \| `Buffer` | `null` |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L114)

___

### \_encryptMessage

▸ **_encryptMessage**(`data`, `sharedMacData?`): `undefined` \| `Buffer`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `Buffer` | `undefined` |
| `sharedMacData` | ``null`` \| `Buffer` | `null` |

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L87)

___

### \_setupFrame

▸ **_setupFrame**(`remoteData`, `incoming`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `remoteData` | `Buffer` |
| `incoming` | `boolean` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L149)

___

### createAckEIP8

▸ **createAckEIP8**(): `undefined` \| `Buffer`

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:273](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L273)

___

### createAckOld

▸ **createAckOld**(): `undefined` \| `Buffer`

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:290](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L290)

___

### createAuthEIP8

▸ **createAuthEIP8**(): `undefined` \| `Buffer`

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L173)

___

### createAuthNonEIP8

▸ **createAuthNonEIP8**(): `undefined` \| `Buffer`

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L196)

___

### createBody

▸ **createBody**(`data`): `undefined` \| `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Buffer` |

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:367](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L367)

___

### createHeader

▸ **createHeader**(`size`): `undefined` \| `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:336](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L336)

___

### parseAckEIP8

▸ **parseAckEIP8**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:330](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L330)

___

### parseAckPlain

▸ **parseAckPlain**(`data`, `sharedMacData?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `Buffer` | `undefined` |
| `sharedMacData` | ``null`` \| `Buffer` | `null` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:300](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L300)

___

### parseAuthEIP8

▸ **parseAuthEIP8**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L267)

___

### parseAuthPlain

▸ **parseAuthPlain**(`data`, `sharedMacData?`): `undefined` \| `Buffer`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `Buffer` | `undefined` |
| `sharedMacData` | ``null`` \| `Buffer` | `null` |

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:213](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L213)

___

### parseBody

▸ **parseBody**(`data`): `undefined` \| `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Buffer` |

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:378](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L378)

___

### parseHeader

▸ **parseHeader**(`data`): `undefined` \| `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Buffer` |

#### Returns

`undefined` \| `number`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:351](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L351)
