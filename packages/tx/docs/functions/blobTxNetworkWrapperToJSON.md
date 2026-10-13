[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / blobTxNetworkWrapperToJSON

# Function: blobTxNetworkWrapperToJSON()

> **blobTxNetworkWrapperToJSON**(`serialized`, `opts?`): [`JSONBlobTxNetworkWrapper`](../type-aliases/JSONBlobTxNetworkWrapper.md)

Defined in: [4844/constructors.ts:383](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/4844/constructors.ts#L383)

Decode a blob network wrapper and return its JSON representation including blobs and proofs.

## Parameters

### serialized

`Uint8Array`

### opts?

[`TxOptions`](../interfaces/TxOptions.md)

## Returns

[`JSONBlobTxNetworkWrapper`](../type-aliases/JSONBlobTxNetworkWrapper.md)

## Throws

If [createBlob4844TxFromSerializedNetworkWrapper](createBlob4844TxFromSerializedNetworkWrapper.md) validation fails
