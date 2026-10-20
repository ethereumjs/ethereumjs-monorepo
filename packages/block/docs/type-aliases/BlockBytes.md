[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / BlockBytes

# Type Alias: BlockBytes

> **BlockBytes** = \[[`BlockHeaderBytes`](BlockHeaderBytes.md), [`TransactionsBytes`](TransactionsBytes.md), [`UncleHeadersBytes`](UncleHeadersBytes.md)\] \| \[[`BlockHeaderBytes`](BlockHeaderBytes.md), [`TransactionsBytes`](TransactionsBytes.md), [`UncleHeadersBytes`](UncleHeadersBytes.md), [`WithdrawalsBytes`](WithdrawalsBytes.md)\] \| \[[`BlockHeaderBytes`](BlockHeaderBytes.md), [`TransactionsBytes`](TransactionsBytes.md), [`UncleHeadersBytes`](UncleHeadersBytes.md), [`WithdrawalsBytes`](WithdrawalsBytes.md)\]

Defined in: [types.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L161)

Full block RLP tuple: header, transactions, uncles, and optional withdrawals.
