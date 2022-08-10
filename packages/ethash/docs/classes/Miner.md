[@ethereumjs/ethash](../README.md) / Miner

# Class: Miner

## Table of contents

### Constructors

- [constructor](Miner.md#constructor)

### Properties

- [solution](Miner.md#solution)

### Methods

- [iterate](Miner.md#iterate)
- [mine](Miner.md#mine)
- [stop](Miner.md#stop)

## Constructors

### constructor

• **new Miner**(`mineObject`, `ethash`)

Create a Miner object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mineObject` | `BlockHeader` \| `Block` | The object to mine on, either a `BlockHeader` or a `Block` object |
| `ethash` | [`Ethash`](Ethash.md) | Ethash object to use for mining |

#### Defined in

[index.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L50)

## Properties

### solution

• `Optional` **solution**: [`Solution`](../README.md#solution)

#### Defined in

[index.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L38)

## Methods

### iterate

▸ **iterate**(`iterations?`): `Promise`<`undefined` \| [`Solution`](../README.md#solution)\>

Iterate `iterations` times over nonces to find a valid PoW. Caches solution if one is found

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `iterations` | `number` | `0` | Number of iterations to iterate over. If `-1` is passed, the loop runs until a solution is found |

#### Returns

`Promise`<`undefined` \| [`Solution`](../README.md#solution)\>

- `undefined` if no solution was found, or otherwise a `Solution` object

#### Defined in

[index.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L100)

___

### mine

▸ **mine**(`iterations?`): `Promise`<`undefined` \| `BlockHeader` \| `Block`\>

Iterate `iterations` time over nonces, returns a `BlockHeader` or `Block` if a solution is found, `undefined` otherwise

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `iterations` | `number` | `0` | Number of iterations to iterate over. If `-1` is passed, the loop runs until a solution is found |

#### Returns

`Promise`<`undefined` \| `BlockHeader` \| `Block`\>

- `undefined` if no solution was found within the iterations, or a `BlockHeader` or `Block`
          with valid PoW based upon what was passed in the constructor

#### Defined in

[index.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L77)

___

### stop

▸ **stop**(): `void`

Stop the miner on the next iteration

#### Returns

`void`

#### Defined in

[index.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/ethash/src/index.ts#L67)
