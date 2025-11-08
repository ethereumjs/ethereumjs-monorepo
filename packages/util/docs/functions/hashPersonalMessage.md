[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / hashPersonalMessage

# Function: hashPersonalMessage()

> **hashPersonalMessage**(`message`): `Uint8Array`

Defined in: [packages/util/src/signature.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L198)

Returns the keccak-256 hash of `message`, prefixed with the header used by the `eth_sign` RPC call.
The output of this function can be fed into `ecsign` to produce the same signature as the `eth_sign`
call for a given `message`, or fed to `ecrecover` along with a signature to recover the public key
used to produce the signature.

## Parameters

### message

`Uint8Array`

## Returns

`Uint8Array`
