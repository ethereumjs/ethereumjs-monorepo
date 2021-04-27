[@ethereumjs/devp2p](../README.md) / KBucket

# Class: KBucket

## Hierarchy

* *EventEmitter*

  ↳ **KBucket**

## Table of contents

### Constructors

- [constructor](kbucket.md#constructor)

### Properties

- [\_kbucket](kbucket.md#_kbucket)
- [\_peers](kbucket.md#_peers)

### Methods

- [add](kbucket.md#add)
- [closest](kbucket.md#closest)
- [get](kbucket.md#get)
- [getAll](kbucket.md#getall)
- [remove](kbucket.md#remove)
- [getKeys](kbucket.md#getkeys)

## Constructors

### constructor

\+ **new KBucket**(`localNodeId`: *Buffer*): [*KBucket*](kbucket.md)

#### Parameters:

Name | Type |
:------ | :------ |
`localNodeId` | *Buffer* |

**Returns:** [*KBucket*](kbucket.md)

Overrides: void

Defined in: [dpt/kbucket.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L15)

## Properties

### \_kbucket

• **\_kbucket**: *KBucket*<Contact\>

Defined in: [dpt/kbucket.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L15)

___

### \_peers

• **\_peers**: *Map*<string, [*PeerInfo*](../interfaces/peerinfo.md)\>

Defined in: [dpt/kbucket.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L14)

## Methods

### add

▸ **add**(`peer`: [*PeerInfo*](../interfaces/peerinfo.md)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`peer` | [*PeerInfo*](../interfaces/peerinfo.md) |

**Returns:** *void*

Defined in: [dpt/kbucket.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L50)

___

### closest

▸ **closest**(`id`: *string*): [*PeerInfo*](../interfaces/peerinfo.md)[]

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** [*PeerInfo*](../interfaces/peerinfo.md)[]

Defined in: [dpt/kbucket.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L68)

___

### get

▸ **get**(`obj`: *string* \| *Buffer* \| [*PeerInfo*](../interfaces/peerinfo.md)): *null* \| [*PeerInfo*](../interfaces/peerinfo.md)

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | *string* \| *Buffer* \| [*PeerInfo*](../interfaces/peerinfo.md) |

**Returns:** *null* \| [*PeerInfo*](../interfaces/peerinfo.md)

Defined in: [dpt/kbucket.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L55)

___

### getAll

▸ **getAll**(): [*PeerInfo*](../interfaces/peerinfo.md)[]

**Returns:** [*PeerInfo*](../interfaces/peerinfo.md)[]

Defined in: [dpt/kbucket.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L64)

___

### remove

▸ **remove**(`obj`: *string* \| *Buffer* \| [*PeerInfo*](../interfaces/peerinfo.md)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | *string* \| *Buffer* \| [*PeerInfo*](../interfaces/peerinfo.md) |

**Returns:** *void*

Defined in: [dpt/kbucket.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L72)

___

### getKeys

▸ `Static`**getKeys**(`obj`: *string* \| *Buffer* \| [*PeerInfo*](../interfaces/peerinfo.md)): *string*[]

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | *string* \| *Buffer* \| [*PeerInfo*](../interfaces/peerinfo.md) |

**Returns:** *string*[]

Defined in: [dpt/kbucket.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/kbucket.ts#L40)
