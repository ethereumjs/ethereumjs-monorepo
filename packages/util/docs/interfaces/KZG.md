[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / KZG

# Interface: KZG

Defined in: [packages/util/src/kzg.ts:4](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L4)

Interface for an externally provided kzg library used when creating blob transactions

## Methods

### blobToKzgCommitment()

> **blobToKzgCommitment**(`blob`): `string`

Defined in: [packages/util/src/kzg.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L6)

#### Parameters

##### blob

`string`

#### Returns

`string`

***

### computeBlobProof()

> **computeBlobProof**(`blob`, `commitment`): `string`

Defined in: [packages/util/src/kzg.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L7)

#### Parameters

##### blob

`string`

##### commitment

`string`

#### Returns

`string`

***

### computeCells()

> **computeCells**(`blob`): `string`[]

Defined in: [packages/util/src/kzg.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L15)

#### Parameters

##### blob

`string`

#### Returns

`string`[]

***

### computeCellsAndProofs()

> **computeCellsAndProofs**(`blob`): \[`string`[], `string`[]\]

Defined in: [packages/util/src/kzg.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L16)

#### Parameters

##### blob

`string`

#### Returns

\[`string`[], `string`[]\]

***

### recoverCellsAndProofs()

> **recoverCellsAndProofs**(`indices`, `cells`): \[`string`[], `string`[]\]

Defined in: [packages/util/src/kzg.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L17)

#### Parameters

##### indices

`number`[]

##### cells

`string`[]

#### Returns

\[`string`[], `string`[]\]

***

### verifyBlobProofBatch()

> **verifyBlobProofBatch**(`blobs`, `expectedKZGCommitments`, `KZGProofs`): `boolean`

Defined in: [packages/util/src/kzg.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L9)

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

### verifyCellKzgProofBatch()

> **verifyCellKzgProofBatch**(`commitments`, `indices`, `cells`, `proofs`): `boolean`

Defined in: [packages/util/src/kzg.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L18)

#### Parameters

##### commitments

`string`[]

##### indices

`number`[]

##### cells

`string`[]

##### proofs

`string`[]

#### Returns

`boolean`

***

### verifyProof()

> **verifyProof**(`polynomialKZG`, `z`, `y`, `KZGProof`): `boolean`

Defined in: [packages/util/src/kzg.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L8)

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
