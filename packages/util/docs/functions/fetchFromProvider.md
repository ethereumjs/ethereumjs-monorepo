[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / fetchFromProvider

# Function: fetchFromProvider()

> **fetchFromProvider**(`url`, `params`): `Promise`\<`any`\>

Defined in: [packages/util/src/provider.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/provider.ts#L26)

Makes a simple RPC call to a remote Ethereum JSON-RPC provider and passes through the response.
No parameter or response validation is done.

## Parameters

### url

`string`

the URL for the JSON RPC provider

### params

`rpcParams`

the parameters for the JSON-RPC method - refer to
https://ethereum.org/en/developers/docs/apis/json-rpc/ for details on RPC methods

## Returns

`Promise`\<`any`\>

the `result` field from the JSON-RPC response

## Example

```ts
const provider = 'https://mainnet.infura.io/v3/...'
const params = {
  method: 'eth_getBlockByNumber',
  params: ['latest', false],
}
const block = await fetchFromProvider(provider, params)
```
