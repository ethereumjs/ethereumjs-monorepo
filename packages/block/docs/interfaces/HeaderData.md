[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / HeaderData

# Interface: HeaderData

Defined in: [types.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L87)

A block header's data.

## Properties

### baseFeePerGas?

> `optional` **baseFeePerGas?**: `BigIntLike`

Defined in: [types.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L119)

EIP-1559 base fee per gas; required from London activation block onward.

***

### blobGasUsed?

> `optional` **blobGasUsed?**: `BigIntLike`

Defined in: [types.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L123)

Total blob gas consumed in this block (EIP-4844).

***

### blockAccessListHash?

> `optional` **blockAccessListHash?**: `BytesLike`

Defined in: [types.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L135)

32-byte `keccak256(rlp(bal))` commitment when [EIP-7928](https://eips.ethereum.org/EIPS/eip-7928) is active.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### coinbase?

> `optional` **coinbase?**: `AddressLike`

Defined in: [types.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L93)

Beneficiary address (miner/coinbase).

***

### difficulty?

> `optional` **difficulty?**: `BigIntLike`

Defined in: [types.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L103)

Block difficulty (PoW) or Clique turn indicator (PoA).

***

### excessBlobGas?

> `optional` **excessBlobGas?**: `BigIntLike`

Defined in: [types.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L125)

Running excess blob gas after this block (EIP-4844).

***

### extraData?

> `optional` **extraData?**: `BytesLike`

Defined in: [types.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L113)

Arbitrary extra data (Clique seal lives here on PoA chains).

***

### gasLimit?

> `optional` **gasLimit?**: `BigIntLike`

Defined in: [types.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L107)

Maximum gas allowed in this block.

***

### gasUsed?

> `optional` **gasUsed?**: `BigIntLike`

Defined in: [types.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L109)

Total gas used by all transactions.

***

### logsBloom?

> `optional` **logsBloom?**: `BytesLike`

Defined in: [types.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L101)

Bloom filter of block logs.

***

### mixHash?

> `optional` **mixHash?**: `BytesLike`

Defined in: [types.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L115)

Mix hash / prevRandao (PoW mix digest or post-merge randomness).

***

### nonce?

> `optional` **nonce?**: `BytesLike`

Defined in: [types.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L117)

PoW nonce (8 bytes) or Clique vote nonce.

***

### number?

> `optional` **number?**: `BigIntLike`

Defined in: [types.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L105)

Canonical block height.

***

### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot?**: `BytesLike`

Defined in: [types.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L127)

Parent beacon block root (EIP-4788).

***

### parentHash?

> `optional` **parentHash?**: `BytesLike`

Defined in: [types.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L89)

Hash of the parent block header.

***

### receiptTrie?

> `optional` **receiptTrie?**: `BytesLike`

Defined in: [types.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L99)

Receipts trie root.

***

### requestsHash?

> `optional` **requestsHash?**: `BytesLike`

Defined in: [types.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L129)

Requests trie root (EIP-7685).

***

### slotNumber?

> `optional` **slotNumber?**: `BigIntLike`

Defined in: [types.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L141)

Consensus slot number when [EIP-7843](https://eips.ethereum.org/EIPS/eip-7843) is active.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### stateRoot?

> `optional` **stateRoot?**: `BytesLike`

Defined in: [types.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L95)

State trie root after executing this block.

***

### timestamp?

> `optional` **timestamp?**: `BigIntLike`

Defined in: [types.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L111)

Unix timestamp when the block was collated.

***

### transactionsTrie?

> `optional` **transactionsTrie?**: `BytesLike`

Defined in: [types.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L97)

Transactions trie root.

***

### uncleHash?

> `optional` **uncleHash?**: `BytesLike`

Defined in: [types.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L91)

Keccak256 hash of the uncle headers list.

***

### withdrawalsRoot?

> `optional` **withdrawalsRoot?**: `BytesLike`

Defined in: [types.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L121)

Withdrawals trie root (EIP-4895).
