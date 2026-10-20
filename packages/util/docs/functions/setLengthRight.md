[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / setLengthRight

# Function: setLengthRight()

> **setLengthRight**(`msg`, `length`, `opts?`): `Uint8Array`

Defined in: [packages/util/src/bytes.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L171)

Right-pad bytes with trailing zeros to the target length.

## Parameters

### msg

`Uint8Array`

### length

`number`

### opts?

[`SetLengthOpts`](../interfaces/SetLengthOpts.md) = `{}`

## Returns

`Uint8Array`

## Throws

If the input exceeds the target length unless [SetLengthOpts.allowTruncate](../interfaces/SetLengthOpts.md#allowtruncate) is set
