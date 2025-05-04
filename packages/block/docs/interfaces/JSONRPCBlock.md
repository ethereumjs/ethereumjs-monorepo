[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / JSONRPCBlock

# Interface: JSONRPCBlock

Defined in: [types.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L200)

## Properties

### baseFeePerGas?

> `optional` **baseFeePerGas**: `` `0x${string}` ``

Defined in: [types.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L221)

***

### blobGasUsed?

> `optional` **blobGasUsed**: `` `0x${string}` ``

Defined in: [types.ts:224](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L224)

***

### difficulty

> **difficulty**: `` `${number}` `` \| `` `0x${string}` ``

Defined in: [types.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L212)

***

### excessBlobGas?

> `optional` **excessBlobGas**: `` `0x${string}` ``

Defined in: [types.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L225)

***

### executionWitness?

> `optional` **executionWitness**: `null` \| `VerkleExecutionWitness`

Defined in: [types.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L227)

***

### extraData

> **extraData**: `` `0x${string}` ``

Defined in: [types.ts:214](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L214)

***

### gasLimit

> **gasLimit**: `` `0x${string}` ``

Defined in: [types.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L216)

***

### gasUsed

> **gasUsed**: `` `0x${string}` ``

Defined in: [types.ts:217](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L217)

***

### hash

> **hash**: `` `0x${string}` ``

Defined in: [types.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L202)

***

### logsBloom

> **logsBloom**: `` `0x${string}` ``

Defined in: [types.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L207)

***

### miner

> **miner**: `` `0x${string}` ``

Defined in: [types.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L211)

***

### mixHash?

> `optional` **mixHash**: `` `0x${string}` ``

Defined in: [types.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L204)

***

### nonce

> **nonce**: `` `0x${string}` ``

Defined in: [types.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L205)

***

### number

> **number**: `` `0x${string}` ``

Defined in: [types.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L201)

***

### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

Defined in: [types.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L226)

***

### parentHash

> **parentHash**: `` `0x${string}` ``

Defined in: [types.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L203)

***

### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

Defined in: [types.ts:210](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L210)

***

### requestsHash?

> `optional` **requestsHash**: `` `0x${string}` ``

Defined in: [types.ts:228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L228)

***

### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

Defined in: [types.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L206)

***

### size

> **size**: `` `0x${string}` ``

Defined in: [types.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L215)

***

### stateRoot

> **stateRoot**: `` `0x${string}` ``

Defined in: [types.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L209)

***

### timestamp

> **timestamp**: `` `0x${string}` ``

Defined in: [types.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L218)

***

### totalDifficulty?

> `optional` **totalDifficulty**: `` `0x${string}` ``

Defined in: [types.ts:213](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L213)

***

### transactions

> **transactions**: (`` `0x${string}` `` \| `JSONRPCTx`)[]

Defined in: [types.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L219)

***

### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

Defined in: [types.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L208)

***

### uncles

> **uncles**: `` `0x${string}` ``[]

Defined in: [types.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L220)

***

### withdrawals?

> `optional` **withdrawals**: `JSONRPCWithdrawal`[]

Defined in: [types.ts:222](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L222)

***

### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

Defined in: [types.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L223)
