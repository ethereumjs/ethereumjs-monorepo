[**@ethereumjs/client**](../README.md)

***

[@ethereumjs/client](../README.md) / EthereumClient

# Class: EthereumClient

Defined in: [client.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L61)

Represents the top-level ethereum node, and is responsible for managing the
lifecycle of included services.

## Memberof

module:node

## Properties

### chain

> **chain**: `Chain`

Defined in: [client.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L63)

***

### config

> **config**: [`Config`](Config.md)

Defined in: [client.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L62)

***

### opened

> **opened**: `boolean`

Defined in: [client.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L66)

***

### service

> **service**: `FullEthereumService`

Defined in: [client.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L64)

***

### started

> **started**: `boolean`

Defined in: [client.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L67)

## Methods

### open()

> **open**(): `Promise`\<`false` \| `undefined`\>

Defined in: [client.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L100)

Open node. Must be called before node is started

#### Returns

`Promise`\<`false` \| `undefined`\>

***

### server()

> **server**(): `RlpxServer` \| `undefined`

Defined in: [client.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L159)

#### Returns

`RlpxServer` \| `undefined`

the RLPx server (if it exists)

***

### start()

> **start**(): `Promise`\<`false` \| `undefined`\>

Defined in: [client.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L128)

Starts node and all services and network servers.

#### Returns

`Promise`\<`false` \| `undefined`\>

***

### stop()

> **stop**(): `Promise`\<`false` \| `undefined`\>

Defined in: [client.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L145)

Stops node and all services and network servers.

#### Returns

`Promise`\<`false` \| `undefined`\>

***

### create()

> `static` **create**(`options`): `Promise`\<`EthereumClient`\>

Defined in: [client.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/client.ts#L75)

Main entrypoint for client initialization.

Safe creation of a Chain object awaiting the initialization
of the underlying Blockchain object.

#### Parameters

##### options

`EthereumClientOptions`

#### Returns

`Promise`\<`EthereumClient`\>
