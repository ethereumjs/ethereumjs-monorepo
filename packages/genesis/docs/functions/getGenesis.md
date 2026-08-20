[**@ethereumjs/genesis**](../README.md)

***

[@ethereumjs/genesis](../README.md) / getGenesis

# Function: getGenesis()

> **getGenesis**(`chainId`): [`GenesisState`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/interfaces/GenesisState.md) \| `undefined`

Defined in: [index.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/genesis/src/index.ts#L16)

Returns the genesis state for a well-known Ethereum network.

## Parameters

### chainId

`number`

Numeric chain identifier (see [Chain](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/variables/Chain.md) in `@ethereumjs/common`)

## Returns

[`GenesisState`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/interfaces/GenesisState.md) \| `undefined`

Genesis state map keyed by address, or `undefined` if the chain is not supported
