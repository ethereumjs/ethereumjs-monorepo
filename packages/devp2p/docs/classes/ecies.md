[@ethereumjs/devp2p](../README.md) / ECIES

# Class: ECIES

## Table of contents

### Constructors

- [constructor](ecies.md#constructor)

### Properties

- [\_bodySize](ecies.md#_bodysize)
- [\_egressAes](ecies.md#_egressaes)
- [\_egressMac](ecies.md#_egressmac)
- [\_ephemeralPrivateKey](ecies.md#_ephemeralprivatekey)
- [\_ephemeralPublicKey](ecies.md#_ephemeralpublickey)
- [\_ephemeralSharedSecret](ecies.md#_ephemeralsharedsecret)
- [\_gotEIP8Ack](ecies.md#_goteip8ack)
- [\_gotEIP8Auth](ecies.md#_goteip8auth)
- [\_ingressAes](ecies.md#_ingressaes)
- [\_ingressMac](ecies.md#_ingressmac)
- [\_initMsg](ecies.md#_initmsg)
- [\_nonce](ecies.md#_nonce)
- [\_privateKey](ecies.md#_privatekey)
- [\_publicKey](ecies.md#_publickey)
- [\_remoteEphemeralPublicKey](ecies.md#_remoteephemeralpublickey)
- [\_remoteInitMsg](ecies.md#_remoteinitmsg)
- [\_remoteNonce](ecies.md#_remotenonce)
- [\_remotePublicKey](ecies.md#_remotepublickey)

### Methods

- [\_decryptMessage](ecies.md#_decryptmessage)
- [\_encryptMessage](ecies.md#_encryptmessage)
- [\_setupFrame](ecies.md#_setupframe)
- [createAckEIP8](ecies.md#createackeip8)
- [createAckOld](ecies.md#createackold)
- [createAuthEIP8](ecies.md#createautheip8)
- [createAuthNonEIP8](ecies.md#createauthnoneip8)
- [createBody](ecies.md#createbody)
- [createHeader](ecies.md#createheader)
- [parseAckEIP8](ecies.md#parseackeip8)
- [parseAckPlain](ecies.md#parseackplain)
- [parseAuthEIP8](ecies.md#parseautheip8)
- [parseAuthPlain](ecies.md#parseauthplain)
- [parseBody](ecies.md#parsebody)
- [parseHeader](ecies.md#parseheader)

## Constructors

### constructor

\+ **new ECIES**(`privateKey`: *Buffer*, `id`: *Buffer*, `remoteId`: *Buffer*): [*ECIES*](ecies.md)

#### Parameters:

Name | Type |
:------ | :------ |
`privateKey` | *Buffer* |
`id` | *Buffer* |
`remoteId` | *Buffer* |

**Returns:** [*ECIES*](ecies.md)

Defined in: [rlpx/ecies.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L73)

## Properties

### \_bodySize

• **\_bodySize**: *null* \| *number*= null

Defined in: [rlpx/ecies.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L73)

___

### \_egressAes

• **\_egressAes**: *null* \| *Decipher*= null

Defined in: [rlpx/ecies.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L66)

___

### \_egressMac

• **\_egressMac**: *null* \| [*MAC*](mac.md)= null

Defined in: [rlpx/ecies.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L68)

___

### \_ephemeralPrivateKey

• **\_ephemeralPrivateKey**: *Buffer*

Defined in: [rlpx/ecies.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L69)

___

### \_ephemeralPublicKey

• **\_ephemeralPublicKey**: *Buffer*

Defined in: [rlpx/ecies.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L70)

___

### \_ephemeralSharedSecret

• **\_ephemeralSharedSecret**: *null* \| *Buffer*= null

Defined in: [rlpx/ecies.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L72)

___

### \_gotEIP8Ack

• **\_gotEIP8Ack**: *boolean*= false

Defined in: [rlpx/ecies.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L64)

___

### \_gotEIP8Auth

• **\_gotEIP8Auth**: *boolean*= false

Defined in: [rlpx/ecies.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L63)

___

### \_ingressAes

• **\_ingressAes**: *null* \| *Decipher*= null

Defined in: [rlpx/ecies.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L65)

___

### \_ingressMac

• **\_ingressMac**: *null* \| [*MAC*](mac.md)= null

Defined in: [rlpx/ecies.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L67)

___

### \_initMsg

• **\_initMsg**: *undefined* \| *null* \| *Buffer*= null

Defined in: [rlpx/ecies.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L61)

___

### \_nonce

• **\_nonce**: *Buffer*

Defined in: [rlpx/ecies.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L59)

___

### \_privateKey

• **\_privateKey**: *Buffer*

Defined in: [rlpx/ecies.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L56)

___

### \_publicKey

• **\_publicKey**: *Buffer*

Defined in: [rlpx/ecies.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L57)

___

### \_remoteEphemeralPublicKey

• **\_remoteEphemeralPublicKey**: *null* \| *Buffer*= null

Defined in: [rlpx/ecies.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L71)

___

### \_remoteInitMsg

• **\_remoteInitMsg**: *null* \| *Buffer*= null

Defined in: [rlpx/ecies.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L62)

___

### \_remoteNonce

• **\_remoteNonce**: *null* \| *Buffer*= null

Defined in: [rlpx/ecies.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L60)

___

### \_remotePublicKey

• **\_remotePublicKey**: *null* \| *Buffer*

Defined in: [rlpx/ecies.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L58)

## Methods

### \_decryptMessage

▸ **_decryptMessage**(`data`: *Buffer*, `sharedMacData?`: *null* \| *Buffer*): *Buffer*

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`data` | *Buffer* | - |
`sharedMacData` | *null* \| *Buffer* | null |

**Returns:** *Buffer*

Defined in: [rlpx/ecies.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L112)

___

### \_encryptMessage

▸ **_encryptMessage**(`data`: *Buffer*, `sharedMacData?`: *null* \| *Buffer*): *undefined* \| *Buffer*

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`data` | *Buffer* | - |
`sharedMacData` | *null* \| *Buffer* | null |

**Returns:** *undefined* \| *Buffer*

Defined in: [rlpx/ecies.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L85)

___

### \_setupFrame

▸ **_setupFrame**(`remoteData`: *Buffer*, `incoming`: *boolean*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`remoteData` | *Buffer* |
`incoming` | *boolean* |

**Returns:** *void*

Defined in: [rlpx/ecies.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L147)

___

### createAckEIP8

▸ **createAckEIP8**(): *undefined* \| *Buffer*

**Returns:** *undefined* \| *Buffer*

Defined in: [rlpx/ecies.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L269)

___

### createAckOld

▸ **createAckOld**(): *undefined* \| *Buffer*

**Returns:** *undefined* \| *Buffer*

Defined in: [rlpx/ecies.ts:286](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L286)

___

### createAuthEIP8

▸ **createAuthEIP8**(): *undefined* \| *Buffer*

**Returns:** *undefined* \| *Buffer*

Defined in: [rlpx/ecies.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L171)

___

### createAuthNonEIP8

▸ **createAuthNonEIP8**(): *undefined* \| *Buffer*

**Returns:** *undefined* \| *Buffer*

Defined in: [rlpx/ecies.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L194)

___

### createBody

▸ **createBody**(`data`: *Buffer*): *undefined* \| *Buffer*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | *Buffer* |

**Returns:** *undefined* \| *Buffer*

Defined in: [rlpx/ecies.ts:363](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L363)

___

### createHeader

▸ **createHeader**(`size`: *number*): *undefined* \| *Buffer*

#### Parameters:

Name | Type |
:------ | :------ |
`size` | *number* |

**Returns:** *undefined* \| *Buffer*

Defined in: [rlpx/ecies.ts:333](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L333)

___

### parseAckEIP8

▸ **parseAckEIP8**(`data`: *Buffer*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | *Buffer* |

**Returns:** *void*

Defined in: [rlpx/ecies.ts:326](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L326)

___

### parseAckPlain

▸ **parseAckPlain**(`data`: *Buffer*, `sharedMacData?`: *null* \| *Buffer*): *void*

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`data` | *Buffer* | - |
`sharedMacData` | *null* \| *Buffer* | null |

**Returns:** *void*

Defined in: [rlpx/ecies.ts:296](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L296)

___

### parseAuthEIP8

▸ **parseAuthEIP8**(`data`: *Buffer*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | *Buffer* |

**Returns:** *void*

Defined in: [rlpx/ecies.ts:263](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L263)

___

### parseAuthPlain

▸ **parseAuthPlain**(`data`: *Buffer*, `sharedMacData?`: *null* \| *Buffer*): *undefined* \| *Buffer*

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`data` | *Buffer* | - |
`sharedMacData` | *null* \| *Buffer* | null |

**Returns:** *undefined* \| *Buffer*

Defined in: [rlpx/ecies.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L211)

___

### parseBody

▸ **parseBody**(`data`: *Buffer*): *undefined* \| *Buffer*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | *Buffer* |

**Returns:** *undefined* \| *Buffer*

Defined in: [rlpx/ecies.ts:374](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L374)

___

### parseHeader

▸ **parseHeader**(`data`: *Buffer*): *undefined* \| *number*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | *Buffer* |

**Returns:** *undefined* \| *number*

Defined in: [rlpx/ecies.ts:347](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/ecies.ts#L347)
