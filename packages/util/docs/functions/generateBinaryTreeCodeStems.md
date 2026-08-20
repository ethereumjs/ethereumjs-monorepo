[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / generateBinaryTreeCodeStems

# Function: generateBinaryTreeCodeStems()

> **generateBinaryTreeCodeStems**(`numChunks`, `address`, `hashFunction`): `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [packages/util/src/binaryTree.ts:312](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L312)

Helper method for generating the code stems necessary for putting code

## Parameters

### numChunks

`number`

the number of code chunks to be put

### address

[`Address`](../classes/Address.md)

the address of the account getting the code

### hashFunction

(`input`) => `Uint8Array`

Keccak/Blake3 (or compatible) hash used for stem generation

## Returns

`Uint8Array`\<`ArrayBufferLike`\>[]

an array of stems for putting code
