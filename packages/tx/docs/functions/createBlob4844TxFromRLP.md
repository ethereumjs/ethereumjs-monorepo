[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createBlob4844TxFromRLP

# Function: createBlob4844TxFromRLP()

> **createBlob4844TxFromRLP**(`serialized`, `opts?`): [`Blob4844Tx`](../classes/Blob4844Tx.md)

Defined in: [4844/constructors.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L227)

Instantiate a [Blob4844Tx](../classes/Blob4844Tx.md) from RLP-serialized bytes (canonical form only).

Format: `0x03 || rlp([chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
access_list, max_fee_per_blob_gas, blob_versioned_hashes, y_parity, r, s])`

## Parameters

### serialized

`Uint8Array`

### opts?

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

## Returns

[`Blob4844Tx`](../classes/Blob4844Tx.md)

## Throws

If `customCrypto.kzg` is not initialized on [TxOptions.common](../interfaces/TxOptions.md#common)

## Throws

If the leading type byte is not `0x03`

## Throws

If RLP decode result is not an array

## Throws

If decoded values fail [createBlob4844TxFromBytesArray](createBlob4844TxFromBytesArray.md) checks
