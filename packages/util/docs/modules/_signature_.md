[ethereumjs-util](../README.md) › ["signature"](_signature_.md)

# Module: "signature"

## Index

### Interfaces

* [ECDSASignature](../interfaces/_signature_.ecdsasignature.md)

### Functions

* [ecrecover](_signature_.md#const-ecrecover)
* [ecsign](_signature_.md#const-ecsign)
* [fromRpcSig](_signature_.md#const-fromrpcsig)
* [hashPersonalMessage](_signature_.md#const-hashpersonalmessage)
* [isValidSignature](_signature_.md#const-isvalidsignature)
* [toRpcSig](_signature_.md#const-torpcsig)

## Functions

### `Const` ecrecover

▸ **ecrecover**(`msgHash`: Buffer, `v`: number, `r`: Buffer, `s`: Buffer, `chainId?`: undefined | number): *Buffer*

*Defined in [signature.ts:37](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L37)*

ECDSA public key recovery from signature.

**Parameters:**

Name | Type |
------ | ------ |
`msgHash` | Buffer |
`v` | number |
`r` | Buffer |
`s` | Buffer |
`chainId?` | undefined &#124; number |

**Returns:** *Buffer*

Recovered public key

___

### `Const` ecsign

▸ **ecsign**(`msgHash`: Buffer, `privateKey`: Buffer, `chainId?`: undefined | number): *[ECDSASignature](../interfaces/_signature_.ecdsasignature.md)*

*Defined in [signature.ts:16](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L16)*

Returns the ECDSA signature of a message hash.

**Parameters:**

Name | Type |
------ | ------ |
`msgHash` | Buffer |
`privateKey` | Buffer |
`chainId?` | undefined &#124; number |

**Returns:** *[ECDSASignature](../interfaces/_signature_.ecdsasignature.md)*

___

### `Const` fromRpcSig

▸ **fromRpcSig**(`sig`: string): *[ECDSASignature](../interfaces/_signature_.ecdsasignature.md)*

*Defined in [signature.ts:71](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L71)*

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

*Defined in [signature.ts:137](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L137)*

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

▸ **isValidSignature**(`v`: number, `r`: Buffer, `s`: Buffer, `homesteadOrLater`: boolean, `chainId?`: undefined | number): *boolean*

*Defined in [signature.ts:96](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L96)*

Validate a ECDSA signature.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`v` | number | - | - |
`r` | Buffer | - | - |
`s` | Buffer | - | - |
`homesteadOrLater` | boolean | true | Indicates whether this is being used on either the homestead hardfork or a later one  |
`chainId?` | undefined &#124; number | - | - |

**Returns:** *boolean*

___

### `Const` toRpcSig

▸ **toRpcSig**(`v`: number, `r`: Buffer, `s`: Buffer, `chainId?`: undefined | number): *string*

*Defined in [signature.ts:57](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L57)*

Convert signature parameters into the format of `eth_sign` RPC method.

**Parameters:**

Name | Type |
------ | ------ |
`v` | number |
`r` | Buffer |
`s` | Buffer |
`chainId?` | undefined &#124; number |

**Returns:** *string*

Signature
