[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createBlob4844TxFromRLP

# Function: createBlob4844TxFromRLP()

> **createBlob4844TxFromRLP**(`serialized`, `opts`): [`Blob4844Tx`](../classes/Blob4844Tx.md)

Defined in: [4844/constructors.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L199)

Instantiate a transaction from a RLP serialized tx.

Format: `0x03 || rlp([chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s])`

## Parameters

### serialized

`Uint8Array`

### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`Blob4844Tx`](../classes/Blob4844Tx.md)
