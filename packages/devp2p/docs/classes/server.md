[@ethereumjs/devp2p](../README.md) / Server

# Class: Server

## Hierarchy

* *EventEmitter*

  ↳ **Server**

## Table of contents

### Constructors

- [constructor](server.md#constructor)

### Properties

- [\_dpt](server.md#_dpt)
- [\_endpoint](server.md#_endpoint)
- [\_parityRequestMap](server.md#_parityrequestmap)
- [\_privateKey](server.md#_privatekey)
- [\_requests](server.md#_requests)
- [\_requestsCache](server.md#_requestscache)
- [\_socket](server.md#_socket)
- [\_timeout](server.md#_timeout)

### Methods

- [\_handler](server.md#_handler)
- [\_isAliveCheck](server.md#_isalivecheck)
- [\_send](server.md#_send)
- [bind](server.md#bind)
- [destroy](server.md#destroy)
- [findneighbours](server.md#findneighbours)
- [ping](server.md#ping)

## Constructors

### constructor

\+ **new Server**(`dpt`: [*DPT*](dpt.md), `privateKey`: *Buffer*, `options`: [*DPTServerOptions*](../interfaces/dptserveroptions.md)): [*Server*](server.md)

#### Parameters:

Name | Type |
:------ | :------ |
`dpt` | [*DPT*](dpt.md) |
`privateKey` | *Buffer* |
`options` | [*DPTServerOptions*](../interfaces/dptserveroptions.md) |

**Returns:** [*Server*](server.md)

Overrides: void

Defined in: [dpt/server.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L47)

## Properties

### \_dpt

• **\_dpt**: [*DPT*](dpt.md)

Defined in: [dpt/server.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L40)

___

### \_endpoint

• **\_endpoint**: [*PeerInfo*](../interfaces/peerinfo.md)

Defined in: [dpt/server.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L43)

___

### \_parityRequestMap

• **\_parityRequestMap**: *Map*<string, string\>

Defined in: [dpt/server.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L45)

___

### \_privateKey

• **\_privateKey**: *Buffer*

Defined in: [dpt/server.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L41)

___

### \_requests

• **\_requests**: *Map*<string, any\>

Defined in: [dpt/server.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L44)

___

### \_requestsCache

• **\_requestsCache**: *LRUCache*<string, Promise<any\>\>

Defined in: [dpt/server.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L46)

___

### \_socket

• **\_socket**: *null* \| *Socket*

Defined in: [dpt/server.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L47)

___

### \_timeout

• **\_timeout**: *number*

Defined in: [dpt/server.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L42)

## Methods

### \_handler

▸ **_handler**(`msg`: *Buffer*, `rinfo`: RemoteInfo): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`msg` | *Buffer* |
`rinfo` | RemoteInfo |

**Returns:** *void*

Defined in: [dpt/server.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L166)

___

### \_isAliveCheck

▸ **_isAliveCheck**(): *void*

**Returns:** *void*

Defined in: [dpt/server.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L135)

___

### \_send

▸ **_send**(`peer`: [*PeerInfo*](../interfaces/peerinfo.md), `typename`: *string*, `data`: *any*): *Buffer*

#### Parameters:

Name | Type |
:------ | :------ |
`peer` | [*PeerInfo*](../interfaces/peerinfo.md) |
`typename` | *string* |
`data` | *any* |

**Returns:** *Buffer*

Defined in: [dpt/server.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L139)

___

### bind

▸ **bind**(...`args`: *any*[]): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`...args` | *any*[] |

**Returns:** *void*

Defined in: [dpt/server.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L77)

___

### destroy

▸ **destroy**(...`args`: *any*[]): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`...args` | *any*[] |

**Returns:** *void*

Defined in: [dpt/server.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L84)

___

### findneighbours

▸ **findneighbours**(`peer`: [*PeerInfo*](../interfaces/peerinfo.md), `id`: *Buffer*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`peer` | [*PeerInfo*](../interfaces/peerinfo.md) |
`id` | *Buffer* |

**Returns:** *void*

Defined in: [dpt/server.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L130)

___

### ping

▸ **ping**(`peer`: [*PeerInfo*](../interfaces/peerinfo.md)): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`peer` | [*PeerInfo*](../interfaces/peerinfo.md) |

**Returns:** *Promise*<any\>

Defined in: [dpt/server.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L94)
