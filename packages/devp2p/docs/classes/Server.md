[**@ethereumjs/devp2p**](../README.md)

***

[@ethereumjs/devp2p](../README.md) / Server

# Class: Server

Defined in: [packages/devp2p/src/dpt/server.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L22)

## Constructors

### Constructor

> **new Server**(`dpt`, `privateKey`, `options`): `Server`

Defined in: [packages/devp2p/src/dpt/server.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L37)

#### Parameters

##### dpt

[`DPT`](DPT.md)

##### privateKey

`Uint8Array`

##### options

[`DPTServerOptions`](../interfaces/DPTServerOptions.md)

#### Returns

`Server`

## Properties

### events

> **events**: `EventEmitter`\<[`ServerEvent`](../interfaces/ServerEvent.md)\>

Defined in: [packages/devp2p/src/dpt/server.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L23)

## Methods

### \_handler()

> **\_handler**(`msg`, `rinfo`): `void`

Defined in: [packages/devp2p/src/dpt/server.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L156)

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

Defined in: [packages/devp2p/src/dpt/server.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L135)

#### Returns

`void`

***

### \_send()

> **\_send**(`peer`, `typename`, `data`): `Uint8Array`\<`ArrayBuffer`\>

Defined in: [packages/devp2p/src/dpt/server.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L139)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

##### typename

`string`

##### data

`any`

#### Returns

`Uint8Array`\<`ArrayBuffer`\>

***

### bind()

> **bind**(...`args`): `void`

Defined in: [packages/devp2p/src/dpt/server.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L69)

#### Parameters

##### args

...`any`[]

#### Returns

`void`

***

### destroy()

> **destroy**(...`args`): `void`

Defined in: [packages/devp2p/src/dpt/server.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L78)

#### Parameters

##### args

...`any`[]

#### Returns

`void`

***

### findneighbours()

> **findneighbours**(`peer`, `id`): `void`

Defined in: [packages/devp2p/src/dpt/server.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L130)

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

Defined in: [packages/devp2p/src/dpt/server.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/dpt/server.ts#L90)

#### Parameters

##### peer

[`PeerInfo`](../interfaces/PeerInfo.md)

#### Returns

`Promise`\<`any`\>
