**[ethereumjs-devp2p](../README.md)**

> [Globals](../README.md) / ["rlpx/index"](../modules/_rlpx_index_.md) / ECIES

# Class: ECIES

## Hierarchy

* **ECIES**

## Index

### Constructors

* [constructor](_rlpx_index_.ecies.md#constructor)

### Properties

* [\_bodySize](_rlpx_index_.ecies.md#_bodysize)
* [\_egressAes](_rlpx_index_.ecies.md#_egressaes)
* [\_egressMac](_rlpx_index_.ecies.md#_egressmac)
* [\_ephemeralPrivateKey](_rlpx_index_.ecies.md#_ephemeralprivatekey)
* [\_ephemeralPublicKey](_rlpx_index_.ecies.md#_ephemeralpublickey)
* [\_ephemeralSharedSecret](_rlpx_index_.ecies.md#_ephemeralsharedsecret)
* [\_gotEIP8Ack](_rlpx_index_.ecies.md#_goteip8ack)
* [\_gotEIP8Auth](_rlpx_index_.ecies.md#_goteip8auth)
* [\_ingressAes](_rlpx_index_.ecies.md#_ingressaes)
* [\_ingressMac](_rlpx_index_.ecies.md#_ingressmac)
* [\_initMsg](_rlpx_index_.ecies.md#_initmsg)
* [\_nonce](_rlpx_index_.ecies.md#_nonce)
* [\_privateKey](_rlpx_index_.ecies.md#_privatekey)
* [\_publicKey](_rlpx_index_.ecies.md#_publickey)
* [\_remoteEphemeralPublicKey](_rlpx_index_.ecies.md#_remoteephemeralpublickey)
* [\_remoteInitMsg](_rlpx_index_.ecies.md#_remoteinitmsg)
* [\_remoteNonce](_rlpx_index_.ecies.md#_remotenonce)
* [\_remotePublicKey](_rlpx_index_.ecies.md#_remotepublickey)

### Methods

* [\_decryptMessage](_rlpx_index_.ecies.md#_decryptmessage)
* [\_encryptMessage](_rlpx_index_.ecies.md#_encryptmessage)
* [\_setupFrame](_rlpx_index_.ecies.md#_setupframe)
* [createAckEIP8](_rlpx_index_.ecies.md#createackeip8)
* [createAckOld](_rlpx_index_.ecies.md#createackold)
* [createAuthEIP8](_rlpx_index_.ecies.md#createautheip8)
* [createAuthNonEIP8](_rlpx_index_.ecies.md#createauthnoneip8)
* [createBody](_rlpx_index_.ecies.md#createbody)
* [createHeader](_rlpx_index_.ecies.md#createheader)
* [parseAckEIP8](_rlpx_index_.ecies.md#parseackeip8)
* [parseAckPlain](_rlpx_index_.ecies.md#parseackplain)
* [parseAuthEIP8](_rlpx_index_.ecies.md#parseautheip8)
* [parseAuthPlain](_rlpx_index_.ecies.md#parseauthplain)
* [parseBody](_rlpx_index_.ecies.md#parsebody)
* [parseHeader](_rlpx_index_.ecies.md#parseheader)

## Constructors

### constructor

\+ **new ECIES**(`privateKey`: Buffer, `id`: Buffer, `remoteId`: Buffer): [ECIES](_rlpx_index_.ecies.md)

*Defined in [src/rlpx/ecies.ts:78](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L78)*

#### Parameters:

Name | Type |
------ | ------ |
`privateKey` | Buffer |
`id` | Buffer |
`remoteId` | Buffer |

**Returns:** [ECIES](_rlpx_index_.ecies.md)

## Properties

### \_bodySize

•  **\_bodySize**: number \| null = null

*Defined in [src/rlpx/ecies.ts:78](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L78)*

___

### \_egressAes

•  **\_egressAes**: Decipher \| null = null

*Defined in [src/rlpx/ecies.ts:71](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L71)*

___

### \_egressMac

•  **\_egressMac**: [MAC](_index_.mac.md) \| null = null

*Defined in [src/rlpx/ecies.ts:73](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L73)*

___

### \_ephemeralPrivateKey

•  **\_ephemeralPrivateKey**: Buffer

*Defined in [src/rlpx/ecies.ts:74](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L74)*

___

### \_ephemeralPublicKey

•  **\_ephemeralPublicKey**: Buffer

*Defined in [src/rlpx/ecies.ts:75](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L75)*

___

### \_ephemeralSharedSecret

•  **\_ephemeralSharedSecret**: Buffer \| null = null

*Defined in [src/rlpx/ecies.ts:77](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L77)*

___

### \_gotEIP8Ack

•  **\_gotEIP8Ack**: boolean = false

*Defined in [src/rlpx/ecies.ts:69](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L69)*

___

### \_gotEIP8Auth

•  **\_gotEIP8Auth**: boolean = false

*Defined in [src/rlpx/ecies.ts:68](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L68)*

___

### \_ingressAes

•  **\_ingressAes**: Decipher \| null = null

*Defined in [src/rlpx/ecies.ts:70](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L70)*

___

### \_ingressMac

•  **\_ingressMac**: [MAC](_index_.mac.md) \| null = null

*Defined in [src/rlpx/ecies.ts:72](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L72)*

___

### \_initMsg

•  **\_initMsg**: Buffer \| null \| undefined = null

*Defined in [src/rlpx/ecies.ts:66](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L66)*

___

### \_nonce

•  **\_nonce**: Buffer

*Defined in [src/rlpx/ecies.ts:64](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L64)*

___

### \_privateKey

•  **\_privateKey**: Buffer

*Defined in [src/rlpx/ecies.ts:61](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L61)*

___

### \_publicKey

•  **\_publicKey**: Buffer

*Defined in [src/rlpx/ecies.ts:62](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L62)*

___

### \_remoteEphemeralPublicKey

•  **\_remoteEphemeralPublicKey**: Buffer \| null = null

*Defined in [src/rlpx/ecies.ts:76](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L76)*

___

### \_remoteInitMsg

•  **\_remoteInitMsg**: Buffer \| null = null

*Defined in [src/rlpx/ecies.ts:67](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L67)*

___

### \_remoteNonce

•  **\_remoteNonce**: Buffer \| null = null

*Defined in [src/rlpx/ecies.ts:65](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L65)*

___

### \_remotePublicKey

•  **\_remotePublicKey**: Buffer \| null

*Defined in [src/rlpx/ecies.ts:63](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L63)*

## Methods

### \_decryptMessage

▸ **_decryptMessage**(`data`: Buffer, `sharedMacData?`: Buffer \| null): Buffer

*Defined in [src/rlpx/ecies.ts:120](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L120)*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`data` | Buffer | - |
`sharedMacData` | Buffer \| null | null |

**Returns:** Buffer

___

### \_encryptMessage

▸ **_encryptMessage**(`data`: Buffer, `sharedMacData?`: Buffer \| null): Buffer \| undefined

*Defined in [src/rlpx/ecies.ts:90](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L90)*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`data` | Buffer | - |
`sharedMacData` | Buffer \| null | null |

**Returns:** Buffer \| undefined

___

### \_setupFrame

▸ **_setupFrame**(`remoteData`: Buffer, `incoming`: boolean): void

*Defined in [src/rlpx/ecies.ts:158](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L158)*

#### Parameters:

Name | Type |
------ | ------ |
`remoteData` | Buffer |
`incoming` | boolean |

**Returns:** void

___

### createAckEIP8

▸ **createAckEIP8**(): Buffer \| undefined

*Defined in [src/rlpx/ecies.ts:280](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L280)*

**Returns:** Buffer \| undefined

___

### createAckOld

▸ **createAckOld**(): Buffer \| undefined

*Defined in [src/rlpx/ecies.ts:297](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L297)*

**Returns:** Buffer \| undefined

___

### createAuthEIP8

▸ **createAuthEIP8**(): undefined \| Buffer

*Defined in [src/rlpx/ecies.ts:182](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L182)*

**Returns:** undefined \| Buffer

___

### createAuthNonEIP8

▸ **createAuthNonEIP8**(): Buffer \| undefined

*Defined in [src/rlpx/ecies.ts:205](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L205)*

**Returns:** Buffer \| undefined

___

### createBody

▸ **createBody**(`data`: Buffer): Buffer \| undefined

*Defined in [src/rlpx/ecies.ts:374](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L374)*

#### Parameters:

Name | Type |
------ | ------ |
`data` | Buffer |

**Returns:** Buffer \| undefined

___

### createHeader

▸ **createHeader**(`size`: number): Buffer \| undefined

*Defined in [src/rlpx/ecies.ts:344](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L344)*

#### Parameters:

Name | Type |
------ | ------ |
`size` | number |

**Returns:** Buffer \| undefined

___

### parseAckEIP8

▸ **parseAckEIP8**(`data`: Buffer): void

*Defined in [src/rlpx/ecies.ts:337](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L337)*

#### Parameters:

Name | Type |
------ | ------ |
`data` | Buffer |

**Returns:** void

___

### parseAckPlain

▸ **parseAckPlain**(`data`: Buffer, `sharedMacData?`: Buffer \| null): void

*Defined in [src/rlpx/ecies.ts:307](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L307)*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`data` | Buffer | - |
`sharedMacData` | Buffer \| null | null |

**Returns:** void

___

### parseAuthEIP8

▸ **parseAuthEIP8**(`data`: Buffer): void

*Defined in [src/rlpx/ecies.ts:274](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L274)*

#### Parameters:

Name | Type |
------ | ------ |
`data` | Buffer |

**Returns:** void

___

### parseAuthPlain

▸ **parseAuthPlain**(`data`: Buffer, `sharedMacData?`: Buffer \| null): Buffer \| undefined

*Defined in [src/rlpx/ecies.ts:222](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L222)*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`data` | Buffer | - |
`sharedMacData` | Buffer \| null | null |

**Returns:** Buffer \| undefined

___

### parseBody

▸ **parseBody**(`data`: Buffer): Buffer \| undefined

*Defined in [src/rlpx/ecies.ts:385](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L385)*

#### Parameters:

Name | Type |
------ | ------ |
`data` | Buffer |

**Returns:** Buffer \| undefined

___

### parseHeader

▸ **parseHeader**(`data`: Buffer): number \| undefined

*Defined in [src/rlpx/ecies.ts:358](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/rlpx/ecies.ts#L358)*

#### Parameters:

Name | Type |
------ | ------ |
`data` | Buffer |

**Returns:** number \| undefined
