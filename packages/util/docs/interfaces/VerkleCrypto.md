[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / VerkleCrypto

# Interface: VerkleCrypto

Defined in: [packages/util/src/verkle.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L23)

Verkle related constants and helper functions

Experimental (do not use in production!)

## Properties

### commitToScalars()

> **commitToScalars**: (`vector`) => `Uint8Array`

Defined in: [packages/util/src/verkle.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L38)

#### Parameters

##### vector

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Uint8Array`

***

### createProof()

> **createProof**: (`bytes`) => `Uint8Array`

Defined in: [packages/util/src/verkle.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L36)

#### Parameters

##### bytes

[`ProverInput`](ProverInput.md)[]

#### Returns

`Uint8Array`

***

### getTreeKey()

> **getTreeKey**: (`address`, `treeIndex`, `subIndex`) => `Uint8Array`

Defined in: [packages/util/src/verkle.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L24)

#### Parameters

##### address

`Uint8Array`

##### treeIndex

`Uint8Array`

##### subIndex

`number`

#### Returns

`Uint8Array`

***

### getTreeKeyHash()

> **getTreeKeyHash**: (`address`, `treeIndexLE`) => `Uint8Array`

Defined in: [packages/util/src/verkle.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L25)

#### Parameters

##### address

`Uint8Array`

##### treeIndexLE

`Uint8Array`

#### Returns

`Uint8Array`

***

### hashCommitment()

> **hashCommitment**: (`commitment`) => `Uint8Array`

Defined in: [packages/util/src/verkle.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L34)

#### Parameters

##### commitment

`Uint8Array`

#### Returns

`Uint8Array`

***

### serializeCommitment()

> **serializeCommitment**: (`commitment`) => `Uint8Array`

Defined in: [packages/util/src/verkle.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L35)

#### Parameters

##### commitment

`Uint8Array`

#### Returns

`Uint8Array`

***

### updateCommitment()

> **updateCommitment**: (`commitment`, `commitmentIndex`, `oldScalarValue`, `newScalarValue`) => `Uint8Array`

Defined in: [packages/util/src/verkle.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L26)

#### Parameters

##### commitment

`Uint8Array`

##### commitmentIndex

`number`

##### oldScalarValue

`Uint8Array`

##### newScalarValue

`Uint8Array`

#### Returns

`Uint8Array`

***

### verifyExecutionWitnessPreState()

> **verifyExecutionWitnessPreState**: (`prestateRoot`, `execution_witness_json`) => `boolean`

Defined in: [packages/util/src/verkle.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L33)

#### Parameters

##### prestateRoot

`string`

##### execution\_witness\_json

`string`

#### Returns

`boolean`

***

### verifyProof()

> **verifyProof**: (`proof`, `verifierInput`) => `boolean`

Defined in: [packages/util/src/verkle.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L37)

#### Parameters

##### proof

`Uint8Array`

##### verifierInput

[`VerifierInput`](VerifierInput.md)[]

#### Returns

`boolean`

***

### zeroCommitment

> **zeroCommitment**: `Uint8Array`

Defined in: [packages/util/src/verkle.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L32)
