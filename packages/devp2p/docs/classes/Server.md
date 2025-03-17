[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / Server

# Class: Server

Defined in: [packages/devp2p/src/dpt/server.ts:22](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L22)

## Constructors

### new Server()

> **new Server**(`dpt`, `privateKey`, `options`): [`Server`](Server.md)

Defined in: [packages/devp2p/src/dpt/server.ts:37](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L37)

#### Parameters

##### dpt

[`DPT`](DPT.md)

##### privateKey

`Uint8Array`

##### options

[`DPTServerOptions`](../interfaces/DPTServerOptions.md)

#### Returns

[`Server`](Server.md)

## Properties

### events

> **events**: `EventEmitter`\<[`ServerEvent`](../interfaces/ServerEvent.md)\>

Defined in: [packages/devp2p/src/dpt/server.ts:23](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L23)

## Methods

### \_handler()

> **\_handler**(`msg`, `rinfo`): `void`

Defined in: [packages/devp2p/src/dpt/server.ts:154](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L154)

#### Parameters

##### msg

`Uint8Array`

##### rinfo

`RemoteInfo`

#### Returns

`void`

***

### \_isAliveCheck()

> **\_isAliveCheck**(): `void`

Defined in: [packages/devp2p/src/dpt/server.ts:133](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L133)

#### Returns

`void`

***

### \_send()

> **\_send**(`peer`, `typename`, `data`): `Uint8Array`

Defined in: [packages/devp2p/src/dpt/server.ts:137](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L137)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

##### typename

`string`

##### data

`any`

#### Returns

`Uint8Array`

***

### bind()

> **bind**(...`args`): `void`

Defined in: [packages/devp2p/src/dpt/server.ts:69](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L69)

#### Parameters

##### args

...`any`[]

#### Returns

`void`

***

### destroy()

> **destroy**(...`args`): `void`

Defined in: [packages/devp2p/src/dpt/server.ts:78](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L78)

#### Parameters

##### args

...`any`[]

#### Returns

`void`

***

### findneighbours()

> **findneighbours**(`peer`, `id`): `void`

Defined in: [packages/devp2p/src/dpt/server.ts:128](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L128)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

##### id

`Uint8Array`

#### Returns

`void`

***

### ping()

> **ping**(`peer`): `Promise`\<`any`\>

Defined in: [packages/devp2p/src/dpt/server.ts:90](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L90)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`Promise`\<`any`\>
