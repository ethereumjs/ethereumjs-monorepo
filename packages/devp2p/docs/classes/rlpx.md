[@ethereumjs/devp2p](../README.md) / RLPx

# Class: RLPx

## Hierarchy

* *EventEmitter*

  ↳ **RLPx**

## Table of contents

### Constructors

- [constructor](rlpx.md#constructor)

### Properties

- [\_capabilities](rlpx.md#_capabilities)
- [\_clientId](rlpx.md#_clientid)
- [\_common](rlpx.md#_common)
- [\_dpt](rlpx.md#_dpt)
- [\_id](rlpx.md#_id)
- [\_listenPort](rlpx.md#_listenport)
- [\_maxPeers](rlpx.md#_maxpeers)
- [\_peers](rlpx.md#_peers)
- [\_peersLRU](rlpx.md#_peerslru)
- [\_peersQueue](rlpx.md#_peersqueue)
- [\_privateKey](rlpx.md#_privatekey)
- [\_refillIntervalId](rlpx.md#_refillintervalid)
- [\_refillIntervalSelectionCounter](rlpx.md#_refillintervalselectioncounter)
- [\_remoteClientIdFilter](rlpx.md#_remoteclientidfilter)
- [\_server](rlpx.md#_server)
- [\_timeout](rlpx.md#_timeout)

### Methods

- [\_connectToPeer](rlpx.md#_connecttopeer)
- [\_getOpenSlots](rlpx.md#_getopenslots)
- [\_isAlive](rlpx.md#_isalive)
- [\_isAliveCheck](rlpx.md#_isalivecheck)
- [\_onConnect](rlpx.md#_onconnect)
- [\_refillConnections](rlpx.md#_refillconnections)
- [connect](rlpx.md#connect)
- [destroy](rlpx.md#destroy)
- [disconnect](rlpx.md#disconnect)
- [getPeers](rlpx.md#getpeers)
- [listen](rlpx.md#listen)

## Constructors

### constructor

\+ **new RLPx**(`privateKey`: *Buffer*, `options`: [*RLPxOptions*](../interfaces/rlpxoptions.md)): [*RLPx*](rlpx.md)

#### Parameters:

Name | Type |
:------ | :------ |
`privateKey` | *Buffer* |
`options` | [*RLPxOptions*](../interfaces/rlpxoptions.md) |

**Returns:** [*RLPx*](rlpx.md)

Overrides: void

Defined in: [rlpx/rlpx.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L50)

## Properties

### \_capabilities

• **\_capabilities**: [*Capabilities*](../interfaces/capabilities.md)[]

Defined in: [rlpx/rlpx.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L39)

___

### \_clientId

• **\_clientId**: *Buffer*

Defined in: [rlpx/rlpx.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L37)

___

### \_common

• **\_common**: *default*

Defined in: [rlpx/rlpx.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L40)

___

### \_dpt

• **\_dpt**: *null* \| [*DPT*](dpt.md)

Defined in: [rlpx/rlpx.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L42)

___

### \_id

• **\_id**: *Buffer*

Defined in: [rlpx/rlpx.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L33)

___

### \_listenPort

• **\_listenPort**: *null* \| *number*

Defined in: [rlpx/rlpx.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L41)

___

### \_maxPeers

• **\_maxPeers**: *number*

Defined in: [rlpx/rlpx.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L36)

___

### \_peers

• **\_peers**: *Map*<string, [*Peer*](peer.md) \| Socket\>

Defined in: [rlpx/rlpx.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L47)

___

### \_peersLRU

• **\_peersLRU**: *LRUCache*<string, boolean\>

Defined in: [rlpx/rlpx.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L44)

___

### \_peersQueue

• **\_peersQueue**: { `peer`: [*PeerInfo*](../interfaces/peerinfo.md) ; `ts`: *number*  }[]

Defined in: [rlpx/rlpx.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L45)

___

### \_privateKey

• **\_privateKey**: *Buffer*

Defined in: [rlpx/rlpx.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L32)

___

### \_refillIntervalId

• **\_refillIntervalId**: *Timeout*

Defined in: [rlpx/rlpx.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L49)

___

### \_refillIntervalSelectionCounter

• **\_refillIntervalSelectionCounter**: *number*= 0

Defined in: [rlpx/rlpx.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L50)

___

### \_remoteClientIdFilter

• `Optional` **\_remoteClientIdFilter**: *string*[]

Defined in: [rlpx/rlpx.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L38)

___

### \_server

• **\_server**: *null* \| *Server*

Defined in: [rlpx/rlpx.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L46)

___

### \_timeout

• **\_timeout**: *number*

Defined in: [rlpx/rlpx.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L35)

## Methods

### \_connectToPeer

▸ **_connectToPeer**(`peer`: [*PeerInfo*](../interfaces/peerinfo.md)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`peer` | [*PeerInfo*](../interfaces/peerinfo.md) |

**Returns:** *void*

Defined in: [rlpx/rlpx.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L178)

___

### \_getOpenSlots

▸ **_getOpenSlots**(): *number*

**Returns:** *number*

Defined in: [rlpx/rlpx.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L174)

___

### \_isAlive

▸ **_isAlive**(): *boolean*

**Returns:** *boolean*

Defined in: [rlpx/rlpx.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L166)

___

### \_isAliveCheck

▸ **_isAliveCheck**(): *void*

**Returns:** *void*

Defined in: [rlpx/rlpx.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L170)

___

### \_onConnect

▸ **_onConnect**(`socket`: *Socket*, `peerId`: *null* \| *Buffer*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`socket` | *Socket* |
`peerId` | *null* \| *Buffer* |

**Returns:** *void*

Defined in: [rlpx/rlpx.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L187)

___

### \_refillConnections

▸ **_refillConnections**(): *void*

**Returns:** *void*

Defined in: [rlpx/rlpx.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L267)

___

### connect

▸ **connect**(`peer`: [*PeerInfo*](../interfaces/peerinfo.md)): *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`peer` | [*PeerInfo*](../interfaces/peerinfo.md) |

**Returns:** *Promise*<void\>

Defined in: [rlpx/rlpx.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L129)

___

### destroy

▸ **destroy**(...`args`: *any*[]): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`...args` | *any*[] |

**Returns:** *void*

Defined in: [rlpx/rlpx.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L117)

___

### disconnect

▸ **disconnect**(`id`: *Buffer*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *Buffer* |

**Returns:** *void*

Defined in: [rlpx/rlpx.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L161)

___

### getPeers

▸ **getPeers**(): ([*Peer*](peer.md) \| *Socket*)[]

**Returns:** ([*Peer*](peer.md) \| *Socket*)[]

Defined in: [rlpx/rlpx.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L157)

___

### listen

▸ **listen**(...`args`: *any*[]): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`...args` | *any*[] |

**Returns:** *void*

Defined in: [rlpx/rlpx.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/rlpx/rlpx.ts#L110)
