[**@ethereumjs/genesis**](../README.md)

***

[@ethereumjs/genesis](../README.md) / getGenesis

# Function: getGenesis()

> **getGenesis**(`chainId`): `GenesisState` \| `undefined`

Defined in: [index.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/genesis/src/index.ts#L16)

Returns the genesis state for a well-known Ethereum network.

## Parameters

### chainId

`number`

Numeric chain identifier (see Chain in `@ethereumjs/common`)

## Returns

`GenesisState` \| `undefined`

Genesis state map keyed by address, or `undefined` if the chain is not supported
