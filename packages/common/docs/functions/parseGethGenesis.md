[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / parseGethGenesis

# Function: parseGethGenesis()

> **parseGethGenesis**(`json`, `name`?): `object`

Defined in: [utils.ts:290](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/common/src/utils.ts#L290)

Parses a genesis.json exported from Geth into parameters for Common instance

## Parameters

### json

`any`

representing the Geth genesis file

### name?

`string`

optional chain name

## Returns

`object`

parsed params

### bootstrapNodes

> **bootstrapNodes**: `never`[] = `[]`

### chainId

> **chainId**: `number`

### consensus

> **consensus**: \{ `algorithm`: `string`; `clique`: \{ `epoch`: `any`; `period`: `any`; \}; `ethash`: `undefined`; `type`: `string`; \} \| \{ `algorithm`: `string`; `clique`: `undefined`; `ethash`: \{\}; `type`: `string`; \}

### customHardforks

> **customHardforks**: `undefined` \| [`HardforksDict`](../type-aliases/HardforksDict.md)

### depositContractAddress

> **depositContractAddress**: `` `0x${string}` ``

### genesis

> **genesis**: `object`

#### genesis.baseFeePerGas

> **baseFeePerGas**: `` `0x${string}` ``

#### genesis.coinbase

> **coinbase**: `` `0x${string}` ``

#### genesis.difficulty

> **difficulty**: `` `0x${string}` ``

#### genesis.excessBlobGas

> **excessBlobGas**: `` `0x${string}` ``

#### genesis.extraData

> **extraData**: `` `0x${string}` ``

#### genesis.gasLimit

> **gasLimit**: `` `0x${string}` ``

#### genesis.mixHash

> **mixHash**: `` `0x${string}` ``

#### genesis.nonce

> **nonce**: `` `0x${string}` ``

#### genesis.requestsHash

> **requestsHash**: `` `0x${string}` ``

#### genesis.timestamp

> **timestamp**: `` `0x${string}` ``

### hardfork

> **hardfork**: `undefined` \| `string`

### hardforks

> **hardforks**: `ConfigHardfork`[]

### name

> **name**: `string`
