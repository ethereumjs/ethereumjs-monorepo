[**@ethereumjs/ethash**](../README.md)

***

[@ethereumjs/ethash](../README.md) / Miner

# Class: Miner

Defined in: [index.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L47)

## Constructors

### Constructor

> **new Miner**(`mineObject`, `ethash`): `Miner`

Defined in: [index.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L64)

Create a Miner object

#### Parameters

##### mineObject

The object to mine on, either a `BlockHeader` or a `Block` object

`BlockHeader` | `Block`

##### ethash

[`Ethash`](Ethash.md)

Ethash object to use for mining

#### Returns

`Miner`

## Properties

### solution?

> `optional` **solution**: [`Solution`](../type-aliases/Solution.md)

Defined in: [index.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L52)

## Methods

### iterate()

> **iterate**(`iterations`): `Promise`\<[`Solution`](../type-aliases/Solution.md) \| `undefined`\>

Defined in: [index.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L114)

Iterate `iterations` times over nonces to find a valid PoW. Caches solution if one is found

#### Parameters

##### iterations

`number` = `0`

Number of iterations to iterate over. If `-1` is passed, the loop runs until a solution is found

#### Returns

`Promise`\<[`Solution`](../type-aliases/Solution.md) \| `undefined`\>

- `undefined` if no solution was found, or otherwise a `Solution` object

***

### mine()

> **mine**(`iterations`): `Promise`\<`BlockHeader` \| `Block` \| `undefined`\>

Defined in: [index.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L91)

Iterate `iterations` time over nonces, returns a `BlockHeader` or `Block` if a solution is found, `undefined` otherwise

#### Parameters

##### iterations

`number` = `0`

Number of iterations to iterate over. If `-1` is passed, the loop runs until a solution is found

#### Returns

`Promise`\<`BlockHeader` \| `Block` \| `undefined`\>

- `undefined` if no solution was found within the iterations, or a `BlockHeader` or `Block`
          with valid PoW based upon what was passed in the constructor

***

### stop()

> **stop**(): `void`

Defined in: [index.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L81)

Stop the miner on the next iteration

#### Returns

`void`
