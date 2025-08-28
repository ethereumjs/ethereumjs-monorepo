[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createAccessList2930TxFromRLP

# Function: createAccessList2930TxFromRLP()

> **createAccessList2930TxFromRLP**(`serialized`, `opts`): [`AccessList2930Tx`](../classes/AccessList2930Tx.md)

Defined in: [2930/constructors.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/2930/constructors.ts#L76)

Instantiate a transaction from a RLP serialized tx.

Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)])`

## Parameters

### serialized

`Uint8Array`

### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`AccessList2930Tx`](../classes/AccessList2930Tx.md)
