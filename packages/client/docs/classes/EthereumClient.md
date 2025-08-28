[**@ethereumjs/client**](../README.md)

***

[@ethereumjs/client](../README.md) / EthereumClient

# Class: EthereumClient

Defined in: [client.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L67)

Represents the top-level ethereum node, and is responsible for managing the
lifecycle of included services.

## Memberof

module:node

## Properties

### chain

> **chain**: `Chain`

Defined in: [client.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L69)

***

### config

> **config**: [`Config`](Config.md)

Defined in: [client.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L68)

***

### opened

> **opened**: `boolean`

Defined in: [client.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L72)

***

### service

> **service**: `FullEthereumService`

Defined in: [client.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L70)

***

### started

> **started**: `boolean`

Defined in: [client.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L73)

## Methods

### open()

> **open**(): `Promise`\<`undefined` \| `false`\>

Defined in: [client.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L106)

Open node. Must be called before node is started

#### Returns

`Promise`\<`undefined` \| `false`\>

***

### server()

> **server**(): `undefined` \| `RlpxServer`

Defined in: [client.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L165)

#### Returns

`undefined` \| `RlpxServer`

the RLPx server (if it exists)

***

### start()

> **start**(): `Promise`\<`undefined` \| `false`\>

Defined in: [client.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L134)

Starts node and all services and network servers.

#### Returns

`Promise`\<`undefined` \| `false`\>

***

### stop()

> **stop**(): `Promise`\<`undefined` \| `false`\>

Defined in: [client.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L151)

Stops node and all services and network servers.

#### Returns

`Promise`\<`undefined` \| `false`\>

***

### create()

> `static` **create**(`options`): `Promise`\<`EthereumClient`\>

Defined in: [client.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L81)

Main entrypoint for client initialization.

Safe creation of a Chain object awaiting the initialization
of the underlying Blockchain object.

#### Parameters

##### options

`EthereumClientOptions`

#### Returns

`Promise`\<`EthereumClient`\>
