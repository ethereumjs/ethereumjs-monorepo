[@ethereumjs/util](../README.md) / Kzg

# Interface: Kzg

Interface for an externally provided kzg library used when creating blob transactions

## Table of contents

### Methods

- [blobToKzgCommitment](Kzg.md#blobtokzgcommitment)
- [computeBlobKzgProof](Kzg.md#computeblobkzgproof)
- [loadTrustedSetup](Kzg.md#loadtrustedsetup)
- [verifyBlobKzgProofBatch](Kzg.md#verifyblobkzgproofbatch)
- [verifyKzgProof](Kzg.md#verifykzgproof)

## Methods

### blobToKzgCommitment

▸ **blobToKzgCommitment**(`blob`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `blob` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[packages/util/src/kzg.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L6)

___

### computeBlobKzgProof

▸ **computeBlobKzgProof**(`blob`, `commitment`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `blob` | `Uint8Array` |
| `commitment` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[packages/util/src/kzg.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L7)

___

### loadTrustedSetup

▸ **loadTrustedSetup**(`filePath?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath?` | `string` |

#### Returns

`void`

#### Defined in

[packages/util/src/kzg.ts:5](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L5)

___

### verifyBlobKzgProofBatch

▸ **verifyBlobKzgProofBatch**(`blobs`, `expectedKzgCommitments`, `kzgProofs`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `blobs` | `Uint8Array`[] |
| `expectedKzgCommitments` | `Uint8Array`[] |
| `kzgProofs` | `Uint8Array`[] |

#### Returns

`boolean`

#### Defined in

[packages/util/src/kzg.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L14)

___

### verifyKzgProof

▸ **verifyKzgProof**(`polynomialKzg`, `z`, `y`, `kzgProof`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `polynomialKzg` | `Uint8Array` |
| `z` | `Uint8Array` |
| `y` | `Uint8Array` |
| `kzgProof` | `Uint8Array` |

#### Returns

`boolean`

#### Defined in

[packages/util/src/kzg.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/kzg.ts#L8)
