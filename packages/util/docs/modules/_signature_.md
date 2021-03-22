[ethereumjs-util](../README.md) › ["signature"](_signature_.md)

# Module: "signature"

## Index

### Interfaces

* [ECDSASignature](../interfaces/_signature_.ecdsasignature.md)
* [ECDSASignatureBuffer](../interfaces/_signature_.ecdsasignaturebuffer.md)

### Functions

* [ecrecover](_signature_.md#const-ecrecover)
* [ecsign](_signature_.md#ecsign)
* [fromRpcSig](_signature_.md#const-fromrpcsig)
* [hashPersonalMessage](_signature_.md#const-hashpersonalmessage)
* [isValidSignature](_signature_.md#const-isvalidsignature)
* [toRpcSig](_signature_.md#const-torpcsig)

## Functions

### `Const` ecrecover

▸ **ecrecover**(`msgHash`: Buffer, `v`: [BNLike](_types_.md#bnlike), `r`: Buffer, `s`: Buffer, `chainId?`: [BNLike](_types_.md#bnlike)): *Buffer*

*Defined in [signature.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L65)*

ECDSA public key recovery from signature.

**Parameters:**

Name | Type |
------ | ------ |
`msgHash` | Buffer |
`v` | [BNLike](_types_.md#bnlike) |
`r` | Buffer |
`s` | Buffer |
`chainId?` | [BNLike](_types_.md#bnlike) |

**Returns:** *Buffer*

Recovered public key

___

###  ecsign

▸ **ecsign**(`msgHash`: Buffer, `privateKey`: Buffer, `chainId?`: undefined | number): *[ECDSASignature](../interfaces/_signature_.ecdsasignature.md)*

*Defined in [signature.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L23)*

Returns the ECDSA signature of a message hash.

**Parameters:**

Name | Type |
------ | ------ |
`msgHash` | Buffer |
`privateKey` | Buffer |
`chainId?` | undefined &#124; number |

**Returns:** *[ECDSASignature](../interfaces/_signature_.ecdsasignature.md)*

▸ **ecsign**(`msgHash`: Buffer, `privateKey`: Buffer, `chainId`: [BNLike](_types_.md#bnlike)): *[ECDSASignatureBuffer](../interfaces/_signature_.ecdsasignaturebuffer.md)*

*Defined in [signature.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`msgHash` | Buffer |
`privateKey` | Buffer |
`chainId` | [BNLike](_types_.md#bnlike) |

**Returns:** *[ECDSASignatureBuffer](../interfaces/_signature_.ecdsasignaturebuffer.md)*

___

### `Const` fromRpcSig

▸ **fromRpcSig**(`sig`: string): *[ECDSASignature](../interfaces/_signature_.ecdsasignature.md)*

*Defined in [signature.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L99)*

Convert signature format of the `eth_sign` RPC method to signature parameters
NOTE: all because of a bug in geth: https://github.com/ethereum/go-ethereum/issues/2053

**Parameters:**

Name | Type |
------ | ------ |
`sig` | string |

**Returns:** *[ECDSASignature](../interfaces/_signature_.ecdsasignature.md)*

___

### `Const` hashPersonalMessage

▸ **hashPersonalMessage**(`message`: Buffer): *Buffer*

*Defined in [signature.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L164)*

Returns the keccak-256 hash of `message`, prefixed with the header used by the `eth_sign` RPC call.
The output of this function can be fed into `ecsign` to produce the same signature as the `eth_sign`
call for a given `message`, or fed to `ecrecover` along with a signature to recover the public key
used to produce the signature.

**Parameters:**

Name | Type |
------ | ------ |
`message` | Buffer |

**Returns:** *Buffer*

___

### `Const` isValidSignature

▸ **isValidSignature**(`v`: [BNLike](_types_.md#bnlike), `r`: Buffer, `s`: Buffer, `homesteadOrLater`: boolean, `chainId?`: [BNLike](_types_.md#bnlike)): *boolean*

*Defined in [signature.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L123)*

Validate a ECDSA signature.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`v` | [BNLike](_types_.md#bnlike) | - | - |
`r` | Buffer | - | - |
`s` | Buffer | - | - |
`homesteadOrLater` | boolean | true | Indicates whether this is being used on either the homestead hardfork or a later one  |
`chainId?` | [BNLike](_types_.md#bnlike) | - | - |

**Returns:** *boolean*

___

### `Const` toRpcSig

▸ **toRpcSig**(`v`: [BNLike](_types_.md#bnlike), `r`: Buffer, `s`: Buffer, `chainId?`: [BNLike](_types_.md#bnlike)): *string*

*Defined in [signature.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L85)*

Convert signature parameters into the format of `eth_sign` RPC method.

**Parameters:**

Name | Type |
------ | ------ |
`v` | [BNLike](_types_.md#bnlike) |
`r` | Buffer |
`s` | Buffer |
`chainId?` | [BNLike](_types_.md#bnlike) |

**Returns:** *string*

Signature
