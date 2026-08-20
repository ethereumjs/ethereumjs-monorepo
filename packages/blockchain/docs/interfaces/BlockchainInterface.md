[**@ethereumjs/blockchain**](../README.md)

***

[@ethereumjs/blockchain](../README.md) / BlockchainInterface

# Interface: BlockchainInterface

Defined in: [types.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L15)

## Properties

### consensus

> **consensus**: [`Consensus`](Consensus.md) \| `undefined`

Defined in: [types.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L16)

***

### events?

> `optional` **events?**: `EventEmitter`\<[`BlockchainEvent`](../type-aliases/BlockchainEvent.md), `any`\>

Defined in: [types.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L93)

Optional events emitter

## Methods

### delBlock()

> **delBlock**(`blockHash`): `Promise`\<`void`\>

Defined in: [types.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L30)

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

Defined in: [types.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L35)

Returns a block by its hash or number.

#### Parameters

##### blockId

`number` \| `bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Promise`\<`Block`\>

***

### getCanonicalHeadBlock()

> **getCanonicalHeadBlock**(): `Promise`\<`Block`\>

Defined in: [types.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L88)

Returns the latest full block in the canonical chain.

#### Returns

`Promise`\<`Block`\>

***

### getIteratorHead()

> **getIteratorHead**(`name?`): `Promise`\<`Block`\>

Defined in: [types.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L70)

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

Defined in: [types.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L83)

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

Defined in: [types.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L46)

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

Defined in: [types.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L22)

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

Defined in: [types.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L78)

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

Defined in: [types.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L56)

Returns a shallow copy of the blockchain that may share state with the original

#### Returns

`BlockchainInterface`

***

### validateHeader()

> **validateHeader**(`header`, `height?`): `Promise`\<`void`\>

Defined in: [types.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L63)

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
