[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createBlob4844TxFromSerializedNetworkWrapper

# Function: createBlob4844TxFromSerializedNetworkWrapper()

> **createBlob4844TxFromSerializedNetworkWrapper**(`serialized`, `opts?`): [`Blob4844Tx`](../classes/Blob4844Tx.md)

Defined in: [4844/constructors.ts:330](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L330)

Creates a Blob4844Tx transaction from the network encoding of a blob transaction wrapper.
This function handles the "Network Wrapper" format that includes blobs, commitments, and proofs.

## Parameters

### serialized

`Uint8Array`

Serialized BlobTransactionNetworkWrapper as Uint8Array

### opts?

[`TxOptions`](../interfaces/TxOptions.md)

Transaction options including Common instance with KZG initialized

## Returns

[`Blob4844Tx`](../classes/Blob4844Tx.md)

A new Blob4844Tx instance with network wrapper data

## Throws

If Common instance is not provided

## Throws

If KZG is not initialized in Common

## Throws

If serialized data is not a valid EIP-4844 transaction

## Throws

If network wrapper has invalid number of values (not 4 or 5)

## Throws

If transaction has no valid `to` address

## Throws

If network wrapper version is invalid

## Throws

If KZG verification fails

## Throws

If versioned hashes don't match commitments

Network Wrapper Formats:
- EIP-4844: `0x03 || rlp([tx_values, blobs, kzg_commitments, kzg_proofs])` (4 values)
- EIP-7594: `0x03 || rlp([tx_values, network_wrapper_version, blobs, kzg_commitments, kzg_proofs])` (5 values)

Notes:
- Requires a Common instance with `customCrypto.kzg` initialized
- Validates KZG proofs against blobs and commitments
- Verifies versioned hashes match computed commitments
- Supports both EIP-4844 and EIP-7594 network wrapper formats
- Transaction is frozen by default unless `opts.freeze` is set to false
