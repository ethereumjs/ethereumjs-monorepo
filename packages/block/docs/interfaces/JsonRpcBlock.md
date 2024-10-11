[@ethereumjs/block](../README.md) / JsonRpcBlock

# Interface: JsonRpcBlock

## Table of contents

### Properties

- [baseFeePerGas](JsonRpcBlock.md#basefeepergas)
- [blobGasUsed](JsonRpcBlock.md#blobgasused)
- [difficulty](JsonRpcBlock.md#difficulty)
- [excessBlobGas](JsonRpcBlock.md#excessblobgas)
- [executionWitness](JsonRpcBlock.md#executionwitness)
- [extraData](JsonRpcBlock.md#extradata)
- [gasLimit](JsonRpcBlock.md#gaslimit)
- [gasUsed](JsonRpcBlock.md#gasused)
- [hash](JsonRpcBlock.md#hash)
- [logsBloom](JsonRpcBlock.md#logsbloom)
- [miner](JsonRpcBlock.md#miner)
- [mixHash](JsonRpcBlock.md#mixhash)
- [nonce](JsonRpcBlock.md#nonce)
- [number](JsonRpcBlock.md#number)
- [parentBeaconBlockRoot](JsonRpcBlock.md#parentbeaconblockroot)
- [parentHash](JsonRpcBlock.md#parenthash)
- [receiptsRoot](JsonRpcBlock.md#receiptsroot)
- [sha3Uncles](JsonRpcBlock.md#sha3uncles)
- [size](JsonRpcBlock.md#size)
- [stateRoot](JsonRpcBlock.md#stateroot)
- [timestamp](JsonRpcBlock.md#timestamp)
- [totalDifficulty](JsonRpcBlock.md#totaldifficulty)
- [transactions](JsonRpcBlock.md#transactions)
- [transactionsRoot](JsonRpcBlock.md#transactionsroot)
- [uncles](JsonRpcBlock.md#uncles)
- [withdrawals](JsonRpcBlock.md#withdrawals)
- [withdrawalsRoot](JsonRpcBlock.md#withdrawalsroot)

## Properties

### baseFeePerGas

• `Optional` **baseFeePerGas**: `string`

#### Defined in

[types.ts:245](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L245)

___

### blobGasUsed

• `Optional` **blobGasUsed**: `string`

#### Defined in

[types.ts:248](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L248)

___

### difficulty

• **difficulty**: `string`

#### Defined in

[types.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L236)

___

### excessBlobGas

• `Optional` **excessBlobGas**: `string`

#### Defined in

[types.ts:249](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L249)

___

### executionWitness

• `Optional` **executionWitness**: ``null`` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

#### Defined in

[types.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L251)

___

### extraData

• **extraData**: `string`

#### Defined in

[types.ts:238](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L238)

___

### gasLimit

• **gasLimit**: `string`

#### Defined in

[types.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L240)

___

### gasUsed

• **gasUsed**: `string`

#### Defined in

[types.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L241)

___

### hash

• **hash**: `string`

#### Defined in

[types.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L226)

___

### logsBloom

• **logsBloom**: `string`

#### Defined in

[types.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L231)

___

### miner

• **miner**: `string`

#### Defined in

[types.ts:235](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L235)

___

### mixHash

• `Optional` **mixHash**: `string`

#### Defined in

[types.ts:228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L228)

___

### nonce

• **nonce**: `string`

#### Defined in

[types.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L229)

___

### number

• **number**: `string`

#### Defined in

[types.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L225)

___

### parentBeaconBlockRoot

• `Optional` **parentBeaconBlockRoot**: `string`

#### Defined in

[types.ts:250](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L250)

___

### parentHash

• **parentHash**: `string`

#### Defined in

[types.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L227)

___

### receiptsRoot

• **receiptsRoot**: `string`

#### Defined in

[types.ts:234](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L234)

___

### sha3Uncles

• **sha3Uncles**: `string`

#### Defined in

[types.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L230)

___

### size

• **size**: `string`

#### Defined in

[types.ts:239](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L239)

___

### stateRoot

• **stateRoot**: `string`

#### Defined in

[types.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L233)

___

### timestamp

• **timestamp**: `string`

#### Defined in

[types.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L242)

___

### totalDifficulty

• **totalDifficulty**: `string`

#### Defined in

[types.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L237)

___

### transactions

• **transactions**: (`string` \| `JsonRpcTx`)[]

#### Defined in

[types.ts:243](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L243)

___

### transactionsRoot

• **transactionsRoot**: `string`

#### Defined in

[types.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L232)

___

### uncles

• **uncles**: `string`[]

#### Defined in

[types.ts:244](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L244)

___

### withdrawals

• `Optional` **withdrawals**: `JsonRpcWithdrawal`[]

#### Defined in

[types.ts:246](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L246)

___

### withdrawalsRoot

• `Optional` **withdrawalsRoot**: `string`

#### Defined in

[types.ts:247](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L247)
