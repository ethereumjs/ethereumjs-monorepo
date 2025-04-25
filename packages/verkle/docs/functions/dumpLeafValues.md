[**@ethereumjs/verkle**](../README.md)

***

[@ethereumjs/verkle](../README.md) / dumpLeafValues

# Function: dumpLeafValues()

> **dumpLeafValues**(`tree`, `startingNode`): `Promise`\<`undefined` \| \[`` `0x${string}` ``, `` `0x${string}` ``\][]\>

Defined in: [util.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util.ts#L20)

Recursively walks down the tree from a given starting node and returns all the leaf values

## Parameters

### tree

[`VerkleTree`](../classes/VerkleTree.md)

The verkle tree

### startingNode

`Uint8Array`

The starting node

## Returns

`Promise`\<`undefined` \| \[`` `0x${string}` ``, `` `0x${string}` ``\][]\>

An array of key-value pairs containing the tree keys and associated values
