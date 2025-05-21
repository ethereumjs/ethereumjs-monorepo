[**@ethereumjs/verkle**](../README.md)

***

[@ethereumjs/verkle](../README.md) / dumpNodeHashes

# Function: dumpNodeHashes()

> **dumpNodeHashes**(`tree`, `startingNode`): `Promise`\<`undefined` \| \[`` `0x${string}` ``, `` `0x${string}` ``\][]\>

Defined in: [util.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util.ts#L55)

Recursively walks down the tree from a given starting node and returns all the node paths and hashes

## Parameters

### tree

[`VerkleTree`](../classes/VerkleTree.md)

The verkle tree

### startingNode

`Uint8Array`

The starting node

## Returns

`Promise`\<`undefined` \| \[`` `0x${string}` ``, `` `0x${string}` ``\][]\>

An array of key-value pairs containing the tree paths and associated hashes
