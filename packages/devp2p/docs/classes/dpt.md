[@ethereumjs/devp2p](../README.md) / DPT

# Class: DPT

## Hierarchy

* *EventEmitter*

  ↳ **DPT**

## Table of contents

### Constructors

- [constructor](dpt.md#constructor)

### Properties

- [banlist](dpt.md#banlist)
- [dns](dpt.md#dns)
- [privateKey](dpt.md#privatekey)

### Methods

- [\_addPeerBatch](dpt.md#_addpeerbatch)
- [\_onKBucketPing](dpt.md#_onkbucketping)
- [addPeer](dpt.md#addpeer)
- [banPeer](dpt.md#banpeer)
- [bind](dpt.md#bind)
- [bootstrap](dpt.md#bootstrap)
- [destroy](dpt.md#destroy)
- [getClosestPeers](dpt.md#getclosestpeers)
- [getDnsPeers](dpt.md#getdnspeers)
- [getPeer](dpt.md#getpeer)
- [getPeers](dpt.md#getpeers)
- [refresh](dpt.md#refresh)
- [removePeer](dpt.md#removepeer)

## Constructors

### constructor

\+ **new DPT**(`privateKey`: *Buffer*, `options`: [*DPTOptions*](../interfaces/dptoptions.md)): [*DPT*](dpt.md)

#### Parameters:

Name | Type |
:------ | :------ |
`privateKey` | *Buffer* |
`options` | [*DPTOptions*](../interfaces/dptoptions.md) |

**Returns:** [*DPT*](dpt.md)

Overrides: void

Defined in: [dpt/dpt.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L100)

## Properties

### banlist

• **banlist**: [*BanList*](banlist.md)

Defined in: [dpt/dpt.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L88)

___

### dns

• **dns**: [*DNS*](dns.md)

Defined in: [dpt/dpt.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L89)

___

### privateKey

• **privateKey**: *Buffer*

Defined in: [dpt/dpt.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L87)

## Methods

### \_addPeerBatch

▸ **_addPeerBatch**(`peers`: [*PeerInfo*](../interfaces/peerinfo.md)[]): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`peers` | [*PeerInfo*](../interfaces/peerinfo.md)[] |

**Returns:** *void*

Defined in: [dpt/dpt.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L173)

___

### \_onKBucketPing

▸ **_onKBucketPing**(`oldPeers`: [*PeerInfo*](../interfaces/peerinfo.md)[], `newPeer`: [*PeerInfo*](../interfaces/peerinfo.md)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`oldPeers` | [*PeerInfo*](../interfaces/peerinfo.md)[] |
`newPeer` | [*PeerInfo*](../interfaces/peerinfo.md) |

**Returns:** *void*

Defined in: [dpt/dpt.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L152)

___

### addPeer

▸ **addPeer**(`obj`: [*PeerInfo*](../interfaces/peerinfo.md)): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | [*PeerInfo*](../interfaces/peerinfo.md) |

**Returns:** *Promise*<any\>

Defined in: [dpt/dpt.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L199)

___

### banPeer

▸ **banPeer**(`obj`: *string* \| *Buffer* \| [*PeerInfo*](../interfaces/peerinfo.md), `maxAge?`: *number*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | *string* \| *Buffer* \| [*PeerInfo*](../interfaces/peerinfo.md) |
`maxAge?` | *number* |

**Returns:** *void*

Defined in: [dpt/dpt.ts:235](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L235)

___

### bind

▸ **bind**(...`args`: *any*[]): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`...args` | *any*[] |

**Returns:** *void*

Defined in: [dpt/dpt.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L143)

___

### bootstrap

▸ **bootstrap**(`peer`: [*PeerInfo*](../interfaces/peerinfo.md)): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`peer` | [*PeerInfo*](../interfaces/peerinfo.md) |

**Returns:** *Promise*<void\>

Defined in: [dpt/dpt.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L186)

___

### destroy

▸ **destroy**(...`args`: *any*[]): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`...args` | *any*[] |

**Returns:** *void*

Defined in: [dpt/dpt.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L147)

___

### getClosestPeers

▸ **getClosestPeers**(`id`: *string*): [*PeerInfo*](../interfaces/peerinfo.md)[]

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** [*PeerInfo*](../interfaces/peerinfo.md)[]

Defined in: [dpt/dpt.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L227)

___

### getDnsPeers

▸ **getDnsPeers**(): *Promise*<[*PeerInfo*](../interfaces/peerinfo.md)[]\>

**Returns:** *Promise*<[*PeerInfo*](../interfaces/peerinfo.md)[]\>

Defined in: [dpt/dpt.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L240)

___

### getPeer

▸ **getPeer**(`obj`: *string* \| *Buffer* \| [*PeerInfo*](../interfaces/peerinfo.md)): *null* \| [*PeerInfo*](../interfaces/peerinfo.md)

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | *string* \| *Buffer* \| [*PeerInfo*](../interfaces/peerinfo.md) |

**Returns:** *null* \| [*PeerInfo*](../interfaces/peerinfo.md)

Defined in: [dpt/dpt.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L219)

___

### getPeers

▸ **getPeers**(): [*PeerInfo*](../interfaces/peerinfo.md)[]

**Returns:** [*PeerInfo*](../interfaces/peerinfo.md)[]

Defined in: [dpt/dpt.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L223)

___

### refresh

▸ **refresh**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [dpt/dpt.ts:244](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L244)

___

### removePeer

▸ **removePeer**(`obj`: *any*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | *any* |

**Returns:** *void*

Defined in: [dpt/dpt.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L231)
