[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / parseGethGenesis

# Function: parseGethGenesis()

> **parseGethGenesis**(`gethGenesis`, `name?`): `object`

Defined in: [utils.ts:281](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/utils.ts#L281)

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

> **consensus**: \{ `algorithm`: `string`; `clique`: \{ `epoch`: `number` \| `undefined`; `period`: `number` \| `undefined`; \}; `ethash?`: `undefined`; `type`: `string`; \} \| \{ `algorithm`: `string`; `clique?`: `undefined`; `ethash`: \{ \}; `type`: `string`; \}

### customHardforks

> **customHardforks**: [`HardforksDict`](../type-aliases/HardforksDict.md) \| `undefined`

### depositContractAddress

> **depositContractAddress**: `string` \| `undefined`

### genesis

> **genesis**: `object`

#### genesis.baseFeePerGas

> **baseFeePerGas**: `number` \| `` `0x${string}` `` \| `null` \| `undefined`

#### genesis.coinbase

> **coinbase**: `` `0x${string}` `` \| `undefined`

#### genesis.difficulty

> **difficulty**: `` `0x${string}` `` \| `undefined`

#### genesis.excessBlobGas

> **excessBlobGas**: `string` \| `undefined`

#### genesis.extraData

> **extraData**: `` `0x${string}` ``

#### genesis.gasLimit

> **gasLimit**: `` `0x${string}` ``

#### genesis.mixHash

> **mixHash**: `` `0x${string}` `` \| `undefined`

#### genesis.nonce

> **nonce**: `` `0x${string}` ``

#### genesis.requestsHash

> **requestsHash**: `string` \| `undefined`

#### genesis.timestamp

> **timestamp**: `` `0x${string}` ``

### hardfork

> **hardfork**: `string` \| `undefined`

### hardforks

> **hardforks**: `ConfigHardfork`[]

### name

> **name**: `string` \| `undefined`
