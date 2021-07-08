[ethereumjs-util](../README.md) / signature

# Module: signature

## Table of contents

### Interfaces

- [ECDSASignature](../interfaces/signature.ecdsasignature.md)
- [ECDSASignatureBuffer](../interfaces/signature.ecdsasignaturebuffer.md)

### Functions

- [ecrecover](signature.md#ecrecover)
- [ecsign](signature.md#ecsign)
- [fromRpcSig](signature.md#fromrpcsig)
- [hashPersonalMessage](signature.md#hashpersonalmessage)
- [isValidSignature](signature.md#isvalidsignature)
- [toCompactSig](signature.md#tocompactsig)
- [toRpcSig](signature.md#torpcsig)

## Functions

### ecrecover

▸ `Const` **ecrecover**(`msgHash`, `v`, `r`, `s`, `chainId?`): `Buffer`

ECDSA public key recovery from signature.

#### Parameters

| Name | Type |
| :------ | :------ |
| `msgHash` | `Buffer` |
| `v` | [BNLike](types.md#bnlike) |
| `r` | `Buffer` |
| `s` | `Buffer` |
| `chainId?` | `string` \| `number` \| `Buffer` \| [BN](../classes/externals.bn-1.md) |

#### Returns

`Buffer`

Recovered public key

#### Defined in

[packages/util/src/signature.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L66)

___

### ecsign

▸ **ecsign**(`msgHash`, `privateKey`, `chainId?`): [ECDSASignature](../interfaces/signature.ecdsasignature.md)

Returns the ECDSA signature of a message hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `msgHash` | `Buffer` |
| `privateKey` | `Buffer` |
| `chainId?` | `number` |

#### Returns

[ECDSASignature](../interfaces/signature.ecdsasignature.md)

#### Defined in

[packages/util/src/signature.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L24)

▸ **ecsign**(`msgHash`, `privateKey`, `chainId`): [ECDSASignatureBuffer](../interfaces/signature.ecdsasignaturebuffer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `msgHash` | `Buffer` |
| `privateKey` | `Buffer` |
| `chainId` | [BNLike](types.md#bnlike) |

#### Returns

[ECDSASignatureBuffer](../interfaces/signature.ecdsasignaturebuffer.md)

#### Defined in

[packages/util/src/signature.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L25)

___

### fromRpcSig

▸ `Const` **fromRpcSig**(`sig`): [ECDSASignature](../interfaces/signature.ecdsasignature.md)

Convert signature format of the `eth_sign` RPC method to signature parameters
NOTE: all because of a bug in geth: https://github.com/ethereum/go-ethereum/issues/2053

#### Parameters

| Name | Type |
| :------ | :------ |
| `sig` | `string` |

#### Returns

[ECDSASignature](../interfaces/signature.ecdsasignature.md)

#### Defined in

[packages/util/src/signature.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L120)

___

### hashPersonalMessage

▸ `Const` **hashPersonalMessage**(`message`): `Buffer`

Returns the keccak-256 hash of `message`, prefixed with the header used by the `eth_sign` RPC call.
The output of this function can be fed into `ecsign` to produce the same signature as the `eth_sign`
call for a given `message`, or fed to `ecrecover` along with a signature to recover the public key
used to produce the signature.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Buffer` |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/signature.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L197)

___

### isValidSignature

▸ `Const` **isValidSignature**(`v`, `r`, `s`, `homesteadOrLater?`, `chainId?`): `boolean`

Validate a ECDSA signature.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `v` | [BNLike](types.md#bnlike) | `undefined` | - |
| `r` | `Buffer` | `undefined` | - |
| `s` | `Buffer` | `undefined` | - |
| `homesteadOrLater` | `boolean` | true | Indicates whether this is being used on either the homestead hardfork or a later one |
| `chainId?` | `string` \| `number` \| `Buffer` \| [BN](../classes/externals.bn-1.md) | `undefined` | - |

#### Returns

`boolean`

#### Defined in

[packages/util/src/signature.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L156)

___

### toCompactSig

▸ `Const` **toCompactSig**(`v`, `r`, `s`, `chainId?`): `string`

Convert signature parameters into the format of Compact Signature Representation (EIP-2098).

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [BNLike](types.md#bnlike) |
| `r` | `Buffer` |
| `s` | `Buffer` |
| `chainId?` | `string` \| `number` \| `Buffer` \| [BN](../classes/externals.bn-1.md) |

#### Returns

`string`

Signature

#### Defined in

[packages/util/src/signature.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L100)

___

### toRpcSig

▸ `Const` **toRpcSig**(`v`, `r`, `s`, `chainId?`): `string`

Convert signature parameters into the format of `eth_sign` RPC method.

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [BNLike](types.md#bnlike) |
| `r` | `Buffer` |
| `s` | `Buffer` |
| `chainId?` | `string` \| `number` \| `Buffer` \| [BN](../classes/externals.bn-1.md) |

#### Returns

`string`

Signature

#### Defined in

[packages/util/src/signature.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L86)
