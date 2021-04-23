[@ethereumjs/devp2p](../README.md) / ETH

# Class: ETH

## Hierarchy

* *EventEmitter*

  ↳ **ETH**

## Table of contents

### Constructors

- [constructor](eth.md#constructor)

### Properties

- [\_forkHash](eth.md#_forkhash)
- [\_hardfork](eth.md#_hardfork)
- [\_latestBlock](eth.md#_latestblock)
- [\_nextForkBlock](eth.md#_nextforkblock)
- [\_peer](eth.md#_peer)
- [\_peerStatus](eth.md#_peerstatus)
- [\_send](eth.md#_send)
- [\_status](eth.md#_status)
- [\_statusTimeoutId](eth.md#_statustimeoutid)
- [\_version](eth.md#_version)
- [eth62](eth.md#eth62)
- [eth63](eth.md#eth63)
- [eth64](eth.md#eth64)
- [eth65](eth.md#eth65)

### Methods

- [\_forkHashFromForkId](eth.md#_forkhashfromforkid)
- [\_getStatusString](eth.md#_getstatusstring)
- [\_handleMessage](eth.md#_handlemessage)
- [\_handleStatus](eth.md#_handlestatus)
- [\_nextForkFromForkId](eth.md#_nextforkfromforkid)
- [\_validateForkId](eth.md#_validateforkid)
- [getMsgPrefix](eth.md#getmsgprefix)
- [getVersion](eth.md#getversion)
- [sendMessage](eth.md#sendmessage)
- [sendStatus](eth.md#sendstatus)

## Constructors

### constructor

\+ **new ETH**(`version`: *number*, `peer`: [*Peer*](peer.md), `send`: SendMethod): [*ETH*](eth.md)

#### Parameters:

Name | Type |
:------ | :------ |
`version` | *number* |
`peer` | [*Peer*](peer.md) |
`send` | SendMethod |

**Returns:** [*ETH*](eth.md)

Overrides: void

Defined in: [eth/index.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L27)

## Properties

### \_forkHash

• **\_forkHash**: *string*= ''

Defined in: [eth/index.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L26)

___

### \_hardfork

• **\_hardfork**: *string*= 'chainstart'

Defined in: [eth/index.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L24)

___

### \_latestBlock

• **\_latestBlock**: *BN*

Defined in: [eth/index.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L25)

___

### \_nextForkBlock

• **\_nextForkBlock**: *BN*

Defined in: [eth/index.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L27)

___

### \_peer

• **\_peer**: [*Peer*](peer.md)

Defined in: [eth/index.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L17)

___

### \_peerStatus

• **\_peerStatus**: *null* \| [*StatusMsg*](../interfaces/eth.statusmsg.md)

Defined in: [eth/index.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L19)

___

### \_send

• **\_send**: SendMethod

Defined in: [eth/index.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L21)

___

### \_status

• **\_status**: *null* \| [*StatusMsg*](../interfaces/eth.statusmsg.md)

Defined in: [eth/index.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L18)

___

### \_statusTimeoutId

• **\_statusTimeoutId**: *Timeout*

Defined in: [eth/index.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L20)

___

### \_version

• **\_version**: *number*

Defined in: [eth/index.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L16)

___

### eth62

▪ `Static` **eth62**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`constructor` | *typeof* [*ETH*](eth.md) |
`length` | *number* |
`name` | *string* |
`version` | *number* |

Defined in: [eth/index.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L55)

___

### eth63

▪ `Static` **eth63**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`constructor` | *typeof* [*ETH*](eth.md) |
`length` | *number* |
`name` | *string* |
`version` | *number* |

Defined in: [eth/index.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L56)

___

### eth64

▪ `Static` **eth64**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`constructor` | *typeof* [*ETH*](eth.md) |
`length` | *number* |
`name` | *string* |
`version` | *number* |

Defined in: [eth/index.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L57)

___

### eth65

▪ `Static` **eth65**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`constructor` | *typeof* [*ETH*](eth.md) |
`length` | *number* |
`name` | *string* |
`version` | *number* |

Defined in: [eth/index.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L58)

## Methods

### \_forkHashFromForkId

▸ **_forkHashFromForkId**(`forkId`: *Buffer*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`forkId` | *Buffer* |

**Returns:** *string*

Defined in: [eth/index.ts:176](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L176)

___

### \_getStatusString

▸ **_getStatusString**(`status`: [*StatusMsg*](../interfaces/eth.statusmsg.md)): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`status` | [*StatusMsg*](../interfaces/eth.statusmsg.md) |

**Returns:** *string*

Defined in: [eth/index.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L184)

___

### \_handleMessage

▸ **_handleMessage**(`code`: [*MESSAGE\_CODES*](../enums/eth.message_codes.md), `data`: *any*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`code` | [*MESSAGE\_CODES*](../enums/eth.message_codes.md) |
`data` | *any* |

**Returns:** *void*

Defined in: [eth/index.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L60)

___

### \_handleStatus

▸ **_handleStatus**(): *void*

**Returns:** *void*

Defined in: [eth/index.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L148)

___

### \_nextForkFromForkId

▸ **_nextForkFromForkId**(`forkId`: *Buffer*): *number*

#### Parameters:

Name | Type |
:------ | :------ |
`forkId` | *Buffer* |

**Returns:** *number*

Defined in: [eth/index.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L180)

___

### \_validateForkId

▸ **_validateForkId**(`forkId`: *Buffer*[]): *void*

Eth 64 Fork ID validation (EIP-2124)

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`forkId` | *Buffer*[] | Remote fork ID    |

**Returns:** *void*

Defined in: [eth/index.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L115)

___

### getMsgPrefix

▸ **getMsgPrefix**(`msgCode`: [*MESSAGE\_CODES*](../enums/eth.message_codes.md)): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`msgCode` | [*MESSAGE\_CODES*](../enums/eth.message_codes.md) |

**Returns:** *string*

Defined in: [eth/index.ts:274](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L274)

___

### getVersion

▸ **getVersion**(): *number*

**Returns:** *number*

Defined in: [eth/index.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L172)

___

### sendMessage

▸ **sendMessage**(`code`: [*MESSAGE\_CODES*](../enums/eth.message_codes.md), `payload`: *any*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`code` | [*MESSAGE\_CODES*](../enums/eth.message_codes.md) |
`payload` | *any* |

**Returns:** *void*

Defined in: [eth/index.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L233)

___

### sendStatus

▸ **sendStatus**(`status`: [*StatusOpts*](../modules/eth.md#statusopts)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`status` | [*StatusOpts*](../modules/eth.md#statusopts) |

**Returns:** *void*

Defined in: [eth/index.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/eth/index.ts#L200)
