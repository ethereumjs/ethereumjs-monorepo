[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / JSONRPCBlock

# Interface: JSONRPCBlock

Defined in: [types.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L182)

## Properties

### baseFeePerGas?

> `optional` **baseFeePerGas**: `` `0x${string}` ``

Defined in: [types.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L203)

***

### blobGasUsed?

> `optional` **blobGasUsed**: `` `0x${string}` ``

Defined in: [types.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L206)

***

### difficulty

> **difficulty**: `` `${number}` `` \| `` `0x${string}` ``

Defined in: [types.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L194)

***

### excessBlobGas?

> `optional` **excessBlobGas**: `` `0x${string}` ``

Defined in: [types.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L207)

***

### extraData

> **extraData**: `` `0x${string}` ``

Defined in: [types.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L196)

***

### gasLimit

> **gasLimit**: `` `0x${string}` ``

Defined in: [types.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L198)

***

### gasUsed

> **gasUsed**: `` `0x${string}` ``

Defined in: [types.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L199)

***

### hash

> **hash**: `` `0x${string}` ``

Defined in: [types.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L184)

***

### logsBloom

> **logsBloom**: `` `0x${string}` ``

Defined in: [types.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L189)

***

### miner

> **miner**: `` `0x${string}` ``

Defined in: [types.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L193)

***

### mixHash?

> `optional` **mixHash**: `` `0x${string}` ``

Defined in: [types.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L186)

***

### nonce

> **nonce**: `` `0x${string}` ``

Defined in: [types.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L187)

***

### number

> **number**: `` `0x${string}` ``

Defined in: [types.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L183)

***

### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

Defined in: [types.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L208)

***

### parentHash

> **parentHash**: `` `0x${string}` ``

Defined in: [types.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L185)

***

### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

Defined in: [types.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L192)

***

### requestsHash?

> `optional` **requestsHash**: `` `0x${string}` ``

Defined in: [types.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L209)

***

### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

Defined in: [types.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L188)

***

### size

> **size**: `` `0x${string}` ``

Defined in: [types.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L197)

***

### stateRoot

> **stateRoot**: `` `0x${string}` ``

Defined in: [types.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L191)

***

### timestamp

> **timestamp**: `` `0x${string}` ``

Defined in: [types.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L200)

***

### totalDifficulty?

> `optional` **totalDifficulty**: `` `0x${string}` ``

Defined in: [types.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L195)

***

### transactions

> **transactions**: (`` `0x${string}` `` \| `JSONRPCTx`)[]

Defined in: [types.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L201)

***

### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

Defined in: [types.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L190)

***

### uncles

> **uncles**: `` `0x${string}` ``[]

Defined in: [types.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L202)

***

### withdrawals?

> `optional` **withdrawals**: `JSONRPCWithdrawal`[]

Defined in: [types.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L204)

***

### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

Defined in: [types.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L205)
