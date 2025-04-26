[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / parseGethGenesis

# Function: parseGethGenesis()

> **parseGethGenesis**(`gethGenesis`, `name?`): `object`

Defined in: [utils.ts:277](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/utils.ts#L277)

Parses a genesis object exported from Geth into parameters for Common instance

## Parameters

### gethGenesis

[`GethGenesis`](../interfaces/GethGenesis.md)

GethGenesis object

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

> **consensus**: \{ `algorithm`: `string`; `clique`: \{ `epoch`: `undefined` \| `number`; `period`: `undefined` \| `number`; \}; `ethash?`: `undefined`; `type`: `string`; \} \| \{ `algorithm`: `string`; `clique?`: `undefined`; `ethash`: \{ \}; `type`: `string`; \}

### customHardforks

> **customHardforks**: `undefined` \| [`HardforksDict`](../type-aliases/HardforksDict.md)

### depositContractAddress

> **depositContractAddress**: `undefined` \| `string`

### genesis

> **genesis**: `object`

#### genesis.baseFeePerGas

> **baseFeePerGas**: `undefined` \| `null` \| `number` \| `` `0x${string}` ``

#### genesis.coinbase

> **coinbase**: `undefined` \| `` `0x${string}` ``

#### genesis.difficulty

> **difficulty**: `undefined` \| `` `0x${string}` ``

#### genesis.excessBlobGas

> **excessBlobGas**: `undefined` \| `string`

#### genesis.extraData

> **extraData**: `` `0x${string}` ``

#### genesis.gasLimit

> **gasLimit**: `` `0x${string}` ``

#### genesis.mixHash

> **mixHash**: `undefined` \| `` `0x${string}` ``

#### genesis.nonce

> **nonce**: `` `0x${string}` ``

#### genesis.requestsHash

> **requestsHash**: `undefined` \| `string`

#### genesis.timestamp

> **timestamp**: `` `0x${string}` ``

### hardfork

> **hardfork**: `undefined` \| `string`

### hardforks

> **hardforks**: `ConfigHardfork`[]

### name

> **name**: `undefined` \| `string`
