[@ethereumjs/devp2p](../README.md) / [rlpx/ecies](../modules/rlpx_ecies.md) / ECIES

# Class: ECIES

[rlpx/ecies](../modules/rlpx_ecies.md).ECIES

## Table of contents

### Constructors

- [constructor](rlpx_ecies.ecies.md#constructor)

### Properties

- [\_bodySize](rlpx_ecies.ecies.md#_bodysize)
- [\_egressAes](rlpx_ecies.ecies.md#_egressaes)
- [\_egressMac](rlpx_ecies.ecies.md#_egressmac)
- [\_ephemeralPrivateKey](rlpx_ecies.ecies.md#_ephemeralprivatekey)
- [\_ephemeralPublicKey](rlpx_ecies.ecies.md#_ephemeralpublickey)
- [\_ephemeralSharedSecret](rlpx_ecies.ecies.md#_ephemeralsharedsecret)
- [\_gotEIP8Ack](rlpx_ecies.ecies.md#_goteip8ack)
- [\_gotEIP8Auth](rlpx_ecies.ecies.md#_goteip8auth)
- [\_ingressAes](rlpx_ecies.ecies.md#_ingressaes)
- [\_ingressMac](rlpx_ecies.ecies.md#_ingressmac)
- [\_initMsg](rlpx_ecies.ecies.md#_initmsg)
- [\_nonce](rlpx_ecies.ecies.md#_nonce)
- [\_privateKey](rlpx_ecies.ecies.md#_privatekey)
- [\_publicKey](rlpx_ecies.ecies.md#_publickey)
- [\_remoteEphemeralPublicKey](rlpx_ecies.ecies.md#_remoteephemeralpublickey)
- [\_remoteInitMsg](rlpx_ecies.ecies.md#_remoteinitmsg)
- [\_remoteNonce](rlpx_ecies.ecies.md#_remotenonce)
- [\_remotePublicKey](rlpx_ecies.ecies.md#_remotepublickey)

### Methods

- [\_decryptMessage](rlpx_ecies.ecies.md#_decryptmessage)
- [\_encryptMessage](rlpx_ecies.ecies.md#_encryptmessage)
- [\_setupFrame](rlpx_ecies.ecies.md#_setupframe)
- [createAckEIP8](rlpx_ecies.ecies.md#createackeip8)
- [createAckOld](rlpx_ecies.ecies.md#createackold)
- [createAuthEIP8](rlpx_ecies.ecies.md#createautheip8)
- [createAuthNonEIP8](rlpx_ecies.ecies.md#createauthnoneip8)
- [createBody](rlpx_ecies.ecies.md#createbody)
- [createHeader](rlpx_ecies.ecies.md#createheader)
- [parseAckEIP8](rlpx_ecies.ecies.md#parseackeip8)
- [parseAckPlain](rlpx_ecies.ecies.md#parseackplain)
- [parseAuthEIP8](rlpx_ecies.ecies.md#parseautheip8)
- [parseAuthPlain](rlpx_ecies.ecies.md#parseauthplain)
- [parseBody](rlpx_ecies.ecies.md#parsebody)
- [parseHeader](rlpx_ecies.ecies.md#parseheader)

## Constructors

### constructor

• **new ECIES**(`privateKey`, `id`, `remoteId`)

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `privateKey` | `Buffer` |
| `id`         | `Buffer` |
| `remoteId`   | `Buffer` |

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L73)

## Properties

### \_bodySize

• **\_bodySize**: `null` \| `number` = null

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L73)

---

### \_egressAes

• **\_egressAes**: `null` \| `Decipher` = null

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L66)

---

### \_egressMac

• **\_egressMac**: `null` \| [MAC](rlpx_mac.mac.md) = null

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L68)

---

### \_ephemeralPrivateKey

• **\_ephemeralPrivateKey**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L69)

---

### \_ephemeralPublicKey

• **\_ephemeralPublicKey**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L70)

---

### \_ephemeralSharedSecret

• **\_ephemeralSharedSecret**: `null` \| `Buffer` = null

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L72)

---

### \_gotEIP8Ack

• **\_gotEIP8Ack**: `boolean` = false

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L64)

---

### \_gotEIP8Auth

• **\_gotEIP8Auth**: `boolean` = false

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L63)

---

### \_ingressAes

• **\_ingressAes**: `null` \| `Decipher` = null

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L65)

---

### \_ingressMac

• **\_ingressMac**: `null` \| [MAC](rlpx_mac.mac.md) = null

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L67)

---

### \_initMsg

• **\_initMsg**: `undefined` \| `null` \| `Buffer` = null

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L61)

---

### \_nonce

• **\_nonce**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L59)

---

### \_privateKey

• **\_privateKey**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L56)

---

### \_publicKey

• **\_publicKey**: `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L57)

---

### \_remoteEphemeralPublicKey

• **\_remoteEphemeralPublicKey**: `null` \| `Buffer` = null

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L71)

---

### \_remoteInitMsg

• **\_remoteInitMsg**: `null` \| `Buffer` = null

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L62)

---

### \_remoteNonce

• **\_remoteNonce**: `null` \| `Buffer` = null

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L60)

---

### \_remotePublicKey

• **\_remotePublicKey**: `null` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L58)

## Methods

### \_decryptMessage

▸ **\_decryptMessage**(`data`, `sharedMacData?`): `Buffer`

#### Parameters

| Name            | Type               | Default value |
| :-------------- | :----------------- | :------------ |
| `data`          | `Buffer`           | `undefined`   |
| `sharedMacData` | `null` \| `Buffer` | null          |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L112)

---

### \_encryptMessage

▸ **\_encryptMessage**(`data`, `sharedMacData?`): `undefined` \| `Buffer`

#### Parameters

| Name            | Type               | Default value |
| :-------------- | :----------------- | :------------ |
| `data`          | `Buffer`           | `undefined`   |
| `sharedMacData` | `null` \| `Buffer` | null          |

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L85)

---

### \_setupFrame

▸ **\_setupFrame**(`remoteData`, `incoming`): `void`

#### Parameters

| Name         | Type      |
| :----------- | :-------- |
| `remoteData` | `Buffer`  |
| `incoming`   | `boolean` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L147)

---

### createAckEIP8

▸ **createAckEIP8**(): `undefined` \| `Buffer`

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L269)

---

### createAckOld

▸ **createAckOld**(): `undefined` \| `Buffer`

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:286](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L286)

---

### createAuthEIP8

▸ **createAuthEIP8**(): `undefined` \| `Buffer`

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L171)

---

### createAuthNonEIP8

▸ **createAuthNonEIP8**(): `undefined` \| `Buffer`

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L194)

---

### createBody

▸ **createBody**(`data`): `undefined` \| `Buffer`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `data` | `Buffer` |

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:363](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L363)

---

### createHeader

▸ **createHeader**(`size`): `undefined` \| `Buffer`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `size` | `number` |

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:333](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L333)

---

### parseAckEIP8

▸ **parseAckEIP8**(`data`): `void`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `data` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:326](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L326)

---

### parseAckPlain

▸ **parseAckPlain**(`data`, `sharedMacData?`): `void`

#### Parameters

| Name            | Type               | Default value |
| :-------------- | :----------------- | :------------ |
| `data`          | `Buffer`           | `undefined`   |
| `sharedMacData` | `null` \| `Buffer` | null          |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:296](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L296)

---

### parseAuthEIP8

▸ **parseAuthEIP8**(`data`): `void`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `data` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:263](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L263)

---

### parseAuthPlain

▸ **parseAuthPlain**(`data`, `sharedMacData?`): `undefined` \| `Buffer`

#### Parameters

| Name            | Type               | Default value |
| :-------------- | :----------------- | :------------ |
| `data`          | `Buffer`           | `undefined`   |
| `sharedMacData` | `null` \| `Buffer` | null          |

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L211)

---

### parseBody

▸ **parseBody**(`data`): `undefined` \| `Buffer`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `data` | `Buffer` |

#### Returns

`undefined` \| `Buffer`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:374](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L374)

---

### parseHeader

▸ **parseHeader**(`data`): `undefined` \| `number`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `data` | `Buffer` |

#### Returns

`undefined` \| `number`

#### Defined in

[packages/devp2p/src/rlpx/ecies.ts:347](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L347)
