[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / createBlob4844TxFromSerializedNetworkWrapper

# Function: createBlob4844TxFromSerializedNetworkWrapper()

> **createBlob4844TxFromSerializedNetworkWrapper**(`serialized`, `opts?`): [`Blob4844Tx`](../classes/Blob4844Tx.md)

Defined in: [4844/constructors.ts:266](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L266)

Instantiate a [Blob4844Tx](../classes/Blob4844Tx.md) from a network-wrapper RLP payload (blobs + KZG proofs).

EIP-4844: `0x03 || rlp([tx_values, blobs, kzg_commitments, kzg_proofs])`
EIP-7594: `0x03 || rlp([tx_values, network_wrapper_version, blobs, kzg_commitments, kzg_proofs])`

## Parameters

### serialized

`Uint8Array`

### opts?

[`TxOptions`](../interfaces/TxOptions.md)

## Returns

[`Blob4844Tx`](../classes/Blob4844Tx.md)

## Throws

If [TxOptions.common](../interfaces/TxOptions.md#common) is missing

## Throws

If `customCrypto.kzg` is not initialized

## Throws

If the leading type byte is not `0x03`

## Throws

If the wrapper has other than 4 or 5 RLP elements

## Throws

If the decoded tx has no `to` address

## Throws

If the network wrapper version is invalid

## Throws

If KZG proof verification fails

## Throws

If versioned hashes do not match commitments
