[**@ethereumjs/blockchain**](../README.md)

***

[@ethereumjs/blockchain](../README.md) / BlockchainInterface

# Interface: BlockchainInterface

Defined in: [types.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L13)

## Properties

### consensus

> **consensus**: [`Consensus`](Consensus.md) \| `undefined`

Defined in: [types.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L14)

***

### events?

> `optional` **events**: `EventEmitter`\<[`BlockchainEvent`](../type-aliases/BlockchainEvent.md), `any`\>

Defined in: [types.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L91)

Optional events emitter

## Methods

### delBlock()

> **delBlock**(`blockHash`): `Promise`\<`void`\>

Defined in: [types.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L28)

Deletes a block from the blockchain. All child blocks in the chain are
deleted and any encountered heads are set to the parent block.

#### Parameters

##### blockHash

`Uint8Array`

The hash of the block to be deleted

#### Returns

`Promise`\<`void`\>

***

### getBlock()

> **getBlock**(`blockId`): `Promise`\<`Block`\>

Defined in: [types.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L33)

Returns a block by its hash or number.

#### Parameters

##### blockId

`number` | `bigint` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Promise`\<`Block`\>

***

### getCanonicalHeadBlock()

> **getCanonicalHeadBlock**(): `Promise`\<`Block`\>

Defined in: [types.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L86)

Returns the latest full block in the canonical chain.

#### Returns

`Promise`\<`Block`\>

***

### getIteratorHead()

> **getIteratorHead**(`name?`): `Promise`\<`Block`\>

Defined in: [types.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L68)

Returns the specified iterator head.

#### Parameters

##### name?

`string`

Optional name of the iterator head (default: 'vm')

#### Returns

`Promise`\<`Block`\>

***

### getTotalDifficulty()?

> `optional` **getTotalDifficulty**(`hash`, `number?`): `Promise`\<`bigint`\>

Defined in: [types.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L81)

Gets total difficulty for a block specified by hash and number

#### Parameters

##### hash

`Uint8Array`

##### number?

`bigint`

#### Returns

`Promise`\<`bigint`\>

***

### iterator()

> **iterator**(`name`, `onBlock`, `maxBlocks?`, `releaseLockOnCallback?`): `Promise`\<`number`\>

Defined in: [types.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L44)

Iterates through blocks starting at the specified iterator head and calls
the onBlock function on each block.

#### Parameters

##### name

`string`

Name of the state root head

##### onBlock

[`OnBlock`](../type-aliases/OnBlock.md)

Function called on each block with params (block: Block,

##### maxBlocks?

`number`

optional maximum number of blocks to iterate through
reorg: boolean)

##### releaseLockOnCallback?

`boolean`

#### Returns

`Promise`\<`number`\>

***

### putBlock()

> **putBlock**(`block`): `Promise`\<`void`\>

Defined in: [types.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L20)

Adds a block to the blockchain.

#### Parameters

##### block

`Block`

The block to be added to the blockchain.

#### Returns

`Promise`\<`void`\>

***

### setIteratorHead()

> **setIteratorHead**(`tag`, `headHash`): `Promise`\<`void`\>

Defined in: [types.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L76)

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currently stored.

#### Parameters

##### tag

`string`

The tag to save the headHash to

##### headHash

`Uint8Array`

The head hash to save

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(): `BlockchainInterface`

Defined in: [types.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L54)

Returns a shallow copy of the blockchain that may share state with the original

#### Returns

`BlockchainInterface`

***

### validateHeader()

> **validateHeader**(`header`, `height?`): `Promise`\<`void`\>

Defined in: [types.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L61)

Validates a block header, throwing if invalid. It is being validated against the reported `parentHash`.

#### Parameters

##### header

`BlockHeader`

header to be validated

##### height?

`bigint`

If this is an uncle header, this is the height of the block that is including it

#### Returns

`Promise`\<`void`\>
