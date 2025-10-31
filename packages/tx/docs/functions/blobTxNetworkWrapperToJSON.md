[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / blobTxNetworkWrapperToJSON

# Function: blobTxNetworkWrapperToJSON()

> **blobTxNetworkWrapperToJSON**(`serialized`, `opts?`): [`JSONBlobTxNetworkWrapper`](../type-aliases/JSONBlobTxNetworkWrapper.md)

Defined in: [4844/constructors.ts:450](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L450)

Returns the EIP 4844 transaction network wrapper in JSON format similar to toJSON, including
blobs, commitments, and proofs fields

## Parameters

### serialized

`Uint8Array`

a buffer representing a serialized BlobTransactionNetworkWrapper

### opts?

[`TxOptions`](../interfaces/TxOptions.md)

any TxOptions defined

## Returns

[`JSONBlobTxNetworkWrapper`](../type-aliases/JSONBlobTxNetworkWrapper.md)

JSONBlobTxNetworkWrapper with blobs, KZG commitments, and KZG proofs fields
