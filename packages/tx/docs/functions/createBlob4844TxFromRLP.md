[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createBlob4844TxFromRLP

# Function: createBlob4844TxFromRLP()

> **createBlob4844TxFromRLP**(`serialized`, `opts`): [`Blob4844Tx`](../classes/Blob4844Tx.md)

Defined in: [4844/constructors.ts:278](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L278)

Instantiate a Blob4844Tx transaction from an RLP serialized transaction.
Only canonical format supported, otherwise use `createBlob4844TxFromSerializedNetworkWrapper()`.

## Parameters

### serialized

`Uint8Array`

RLP serialized transaction data as Uint8Array

### opts

[`TxOptions`](../interfaces/TxOptions.md) = `{}`

Transaction options including Common instance with KZG initialized

## Returns

[`Blob4844Tx`](../classes/Blob4844Tx.md)

A new Blob4844Tx instance

## Throws

If KZG is not initialized in Common

## Throws

If serialized data is not a valid EIP-4844 transaction

## Throws

If RLP decoded data is not an array

Format: `0x03 || rlp([chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
access_list, max_fee_per_blob_gas, blob_versioned_hashes, y_parity, r, s])`

Notes:
- Requires a Common instance with `customCrypto.kzg` initialized
- Transaction type byte must be 0x03 (BlobEIP4844)
- RLP payload must decode to an array of transaction fields
- Delegates to `createBlob4844TxFromBytesArray` for actual construction
