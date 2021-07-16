[@ethereumjs/devp2p](../README.md) / [dpt/dpt](../modules/dpt_dpt.md) / DPT

# Class: DPT

[dpt/dpt](../modules/dpt_dpt.md).DPT

## Hierarchy

- `EventEmitter`

  ↳ **DPT**

## Table of contents

### Constructors

- [constructor](dpt_dpt.dpt.md#constructor)

### Properties

- [banlist](dpt_dpt.dpt.md#banlist)
- [dns](dpt_dpt.dpt.md#dns)
- [privateKey](dpt_dpt.dpt.md#privatekey)
- [defaultMaxListeners](dpt_dpt.dpt.md#defaultmaxlisteners)

### Methods

- [\_addPeerBatch](dpt_dpt.dpt.md#_addpeerbatch)
- [\_onKBucketPing](dpt_dpt.dpt.md#_onkbucketping)
- [addListener](dpt_dpt.dpt.md#addlistener)
- [addPeer](dpt_dpt.dpt.md#addpeer)
- [banPeer](dpt_dpt.dpt.md#banpeer)
- [bind](dpt_dpt.dpt.md#bind)
- [bootstrap](dpt_dpt.dpt.md#bootstrap)
- [destroy](dpt_dpt.dpt.md#destroy)
- [emit](dpt_dpt.dpt.md#emit)
- [eventNames](dpt_dpt.dpt.md#eventnames)
- [getClosestPeers](dpt_dpt.dpt.md#getclosestpeers)
- [getDnsPeers](dpt_dpt.dpt.md#getdnspeers)
- [getMaxListeners](dpt_dpt.dpt.md#getmaxlisteners)
- [getPeer](dpt_dpt.dpt.md#getpeer)
- [getPeers](dpt_dpt.dpt.md#getpeers)
- [listenerCount](dpt_dpt.dpt.md#listenercount)
- [listeners](dpt_dpt.dpt.md#listeners)
- [off](dpt_dpt.dpt.md#off)
- [on](dpt_dpt.dpt.md#on)
- [once](dpt_dpt.dpt.md#once)
- [prependListener](dpt_dpt.dpt.md#prependlistener)
- [prependOnceListener](dpt_dpt.dpt.md#prependoncelistener)
- [rawListeners](dpt_dpt.dpt.md#rawlisteners)
- [refresh](dpt_dpt.dpt.md#refresh)
- [removeAllListeners](dpt_dpt.dpt.md#removealllisteners)
- [removeListener](dpt_dpt.dpt.md#removelistener)
- [removePeer](dpt_dpt.dpt.md#removepeer)
- [setMaxListeners](dpt_dpt.dpt.md#setmaxlisteners)
- [listenerCount](dpt_dpt.dpt.md#listenercount)
- [once](dpt_dpt.dpt.md#once)

## Constructors

### constructor

• **new DPT**(`privateKey`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Buffer` |
| `options` | [DPTOptions](../interfaces/dpt_dpt.dptoptions.md) |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L100)

## Properties

### banlist

• **banlist**: [BanList](dpt_ban_list.banlist.md)

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L88)

___

### dns

• **dns**: [DNS](dns_dns.dns.md)

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L89)

___

### privateKey

• **privateKey**: `Buffer`

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L87)

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:20

## Methods

### \_addPeerBatch

▸ **_addPeerBatch**(`peers`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `peers` | [PeerInfo](../interfaces/dpt_dpt.peerinfo.md)[] |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L173)

___

### \_onKBucketPing

▸ **_onKBucketPing**(`oldPeers`, `newPeer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `oldPeers` | [PeerInfo](../interfaces/dpt_dpt.peerinfo.md)[] |
| `newPeer` | [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L152)

___

### addListener

▸ **addListener**(`event`, `listener`): [DPT](dpt_dpt.dpt.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[DPT](dpt_dpt.dpt.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/globals.d.ts:595

___

### addPeer

▸ **addPeer**(`obj`): `Promise`<any\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) |

#### Returns

`Promise`<any\>

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L199)

___

### banPeer

▸ **banPeer**(`obj`, `maxAge?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) \| `Buffer` |
| `maxAge?` | `number` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:235](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L235)

___

### bind

▸ **bind**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L143)

___

### bootstrap

▸ **bootstrap**(`peer`): `Promise`<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `peer` | [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) |

#### Returns

`Promise`<void\>

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L186)

___

### destroy

▸ **destroy**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L147)

___

### emit

▸ **emit**(`event`, ...`args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Inherited from

EventEmitter.emit

#### Defined in

node_modules/@types/node/globals.d.ts:605

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/@types/node/globals.d.ts:610

___

### getClosestPeers

▸ **getClosestPeers**(`id`): [PeerInfo](../interfaces/dpt_dpt.peerinfo.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

[PeerInfo](../interfaces/dpt_dpt.peerinfo.md)[]

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L227)

___

### getDnsPeers

▸ **getDnsPeers**(): `Promise`<[PeerInfo](../interfaces/dpt_dpt.peerinfo.md)[]\>

#### Returns

`Promise`<[PeerInfo](../interfaces/dpt_dpt.peerinfo.md)[]\>

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L240)

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Inherited from

EventEmitter.getMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:602

___

### getPeer

▸ **getPeer**(`obj`): ``null`` \| [PeerInfo](../interfaces/dpt_dpt.peerinfo.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `string` \| [PeerInfo](../interfaces/dpt_dpt.peerinfo.md) \| `Buffer` |

#### Returns

``null`` \| [PeerInfo](../interfaces/dpt_dpt.peerinfo.md)

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L219)

___

### getPeers

▸ **getPeers**(): [PeerInfo](../interfaces/dpt_dpt.peerinfo.md)[]

#### Returns

[PeerInfo](../interfaces/dpt_dpt.peerinfo.md)[]

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L223)

___

### listenerCount

▸ **listenerCount**(`type`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/globals.d.ts:606

___

### listeners

▸ **listeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.listeners

#### Defined in

node_modules/@types/node/globals.d.ts:603

___

### off

▸ **off**(`event`, `listener`): [DPT](dpt_dpt.dpt.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[DPT](dpt_dpt.dpt.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/globals.d.ts:599

___

### on

▸ **on**(`event`, `listener`): [DPT](dpt_dpt.dpt.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[DPT](dpt_dpt.dpt.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/globals.d.ts:596

___

### once

▸ **once**(`event`, `listener`): [DPT](dpt_dpt.dpt.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[DPT](dpt_dpt.dpt.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/globals.d.ts:597

___

### prependListener

▸ **prependListener**(`event`, `listener`): [DPT](dpt_dpt.dpt.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[DPT](dpt_dpt.dpt.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/globals.d.ts:608

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [DPT](dpt_dpt.dpt.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[DPT](dpt_dpt.dpt.md)

#### Inherited from

EventEmitter.prependOnceListener

#### Defined in

node_modules/@types/node/globals.d.ts:609

___

### rawListeners

▸ **rawListeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.rawListeners

#### Defined in

node_modules/@types/node/globals.d.ts:604

___

### refresh

▸ **refresh**(): `Promise`<void\>

#### Returns

`Promise`<void\>

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:244](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L244)

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [DPT](dpt_dpt.dpt.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[DPT](dpt_dpt.dpt.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/globals.d.ts:600

___

### removeListener

▸ **removeListener**(`event`, `listener`): [DPT](dpt_dpt.dpt.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[DPT](dpt_dpt.dpt.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/globals.d.ts:598

___

### removePeer

▸ **removePeer**(`obj`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/dpt/dpt.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/dpt.ts#L231)

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [DPT](dpt_dpt.dpt.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[DPT](dpt_dpt.dpt.md)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:601

___

### listenerCount

▸ `Static` **listenerCount**(`emitter`, `event`): `number`

**`deprecated`** since v4.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` |
| `event` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:17

___

### once

▸ `Static` **once**(`emitter`, `event`): `Promise`<any[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `NodeEventTarget` |
| `event` | `string` \| `symbol` |

#### Returns

`Promise`<any[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:13

▸ `Static` **once**(`emitter`, `event`): `Promise`<any[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `DOMEventTarget` |
| `event` | `string` |

#### Returns

`Promise`<any[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:14
