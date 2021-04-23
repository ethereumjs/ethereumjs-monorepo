[@ethereumjs/devp2p](../README.md) / LES

# Class: LES

## Hierarchy

* *EventEmitter*

  ↳ **LES**

## Table of contents

### Constructors

- [constructor](les.md#constructor)

### Properties

- [\_peer](les.md#_peer)
- [\_peerStatus](les.md#_peerstatus)
- [\_send](les.md#_send)
- [\_status](les.md#_status)
- [\_statusTimeoutId](les.md#_statustimeoutid)
- [\_version](les.md#_version)
- [les2](les.md#les2)

### Methods

- [\_getStatusString](les.md#_getstatusstring)
- [\_handleMessage](les.md#_handlemessage)
- [\_handleStatus](les.md#_handlestatus)
- [getMsgPrefix](les.md#getmsgprefix)
- [getVersion](les.md#getversion)
- [sendMessage](les.md#sendmessage)
- [sendStatus](les.md#sendstatus)

## Constructors

### constructor

\+ **new LES**(`version`: *number*, `peer`: [*Peer*](peer.md), `send`: *any*): [*LES*](les.md)

#### Parameters:

Name | Type |
:------ | :------ |
`version` | *number* |
`peer` | [*Peer*](peer.md) |
`send` | *any* |

**Returns:** [*LES*](les.md)

Overrides: void

Defined in: [les/index.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L19)

## Properties

### \_peer

• **\_peer**: [*Peer*](peer.md)

Defined in: [les/index.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L15)

___

### \_peerStatus

• **\_peerStatus**: *null* \| [*Status*](../interfaces/les.status.md)

Defined in: [les/index.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L18)

___

### \_send

• **\_send**: *any*

Defined in: [les/index.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L16)

___

### \_status

• **\_status**: *null* \| [*Status*](../interfaces/les.status.md)

Defined in: [les/index.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L17)

___

### \_statusTimeoutId

• **\_statusTimeoutId**: *Timeout*

Defined in: [les/index.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L19)

___

### \_version

• **\_version**: *any*

Defined in: [les/index.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L14)

___

### les2

▪ `Static` **les2**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`constructor` | *typeof* [*LES*](les.md) |
`length` | *number* |
`name` | *string* |
`version` | *number* |

Defined in: [les/index.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L34)

## Methods

### \_getStatusString

▸ **_getStatusString**(`status`: [*Status*](../interfaces/les.status.md)): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`status` | [*Status*](../interfaces/les.status.md) |

**Returns:** *string*

Defined in: [les/index.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L117)

___

### \_handleMessage

▸ **_handleMessage**(`code`: [*MESSAGE\_CODES*](../enums/les.message_codes.md), `data`: *any*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`code` | [*MESSAGE\_CODES*](../enums/les.message_codes.md) |
`data` | *any* |

**Returns:** *void*

Defined in: [les/index.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L36)

___

### \_handleStatus

▸ **_handleStatus**(): *void*

**Returns:** *void*

Defined in: [les/index.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L93)

___

### getMsgPrefix

▸ **getMsgPrefix**(`msgCode`: [*MESSAGE\_CODES*](../enums/les.message_codes.md)): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`msgCode` | [*MESSAGE\_CODES*](../enums/les.message_codes.md) |

**Returns:** *string*

Defined in: [les/index.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L208)

___

### getVersion

▸ **getVersion**(): *any*

**Returns:** *any*

Defined in: [les/index.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L113)

___

### sendMessage

▸ **sendMessage**(`code`: [*MESSAGE\_CODES*](../enums/les.message_codes.md), `payload`: *any*): *void*

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`code` | [*MESSAGE\_CODES*](../enums/les.message_codes.md) | Message code   |
`payload` | *any* | Payload (including reqId, e.g. `[1, [437000, 1, 0, 0]]`)    |

**Returns:** *void*

Defined in: [les/index.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L166)

___

### sendStatus

▸ **sendStatus**(`status`: [*Status*](../interfaces/les.status.md)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`status` | [*Status*](../interfaces/les.status.md) |

**Returns:** *void*

Defined in: [les/index.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/les/index.ts#L135)
