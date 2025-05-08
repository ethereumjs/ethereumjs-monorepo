[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / KZG

# Interface: KZG

Defined in: [packages/util/src/kzg.ts:4](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L4)

Interface for an externally provided kzg library used when creating blob transactions

## Methods

### blobToKzgCommitment()

> **blobToKzgCommitment**(`blob`): `string`

Defined in: [packages/util/src/kzg.ts:5](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L5)

#### Parameters

##### blob

`string`

#### Returns

`string`

***

### computeBlobProof()

> **computeBlobProof**(`blob`, `commitment`): `string`

Defined in: [packages/util/src/kzg.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L6)

#### Parameters

##### blob

`string`

##### commitment

`string`

#### Returns

`string`

***

### verifyBlobProofBatch()

> **verifyBlobProofBatch**(`blobs`, `expectedKZGCommitments`, `KZGProofs`): `boolean`

Defined in: [packages/util/src/kzg.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L8)

#### Parameters

##### blobs

`string`[]

##### expectedKZGCommitments

`string`[]

##### KZGProofs

`string`[]

#### Returns

`boolean`

***

### verifyProof()

> **verifyProof**(`polynomialKZG`, `z`, `y`, `KZGProof`): `boolean`

Defined in: [packages/util/src/kzg.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L7)

#### Parameters

##### polynomialKZG

`string`

##### z

`string`

##### y

`string`

##### KZGProof

`string`

#### Returns

`boolean`
