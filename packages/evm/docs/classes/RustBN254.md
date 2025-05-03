[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / RustBN254

# Class: RustBN254

Defined in: [precompiles/bn254/rustbn.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bn254/rustbn.ts#L12)

Implementation of the `EVMBN254Interface` using a WASM wrapper https://github.com/ethereumjs/rustbn.js
around the Parity fork of the Zcash bn pairing cryptography library.

This can be optionally used to replace the build-in Noble implementation (`NobleBN254`) with
a more performant WASM variant. See EVM `bls` constructor option on how to use.

## Implements

- [`EVMBN254Interface`](../type-aliases/EVMBN254Interface.md)

## Constructors

### Constructor

> **new RustBN254**(`rustbn`): `RustBN254`

Defined in: [precompiles/bn254/rustbn.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bn254/rustbn.ts#L15)

#### Parameters

##### rustbn

`any`

#### Returns

`RustBN254`

## Methods

### add()

> **add**(`input`): `Uint8Array`

Defined in: [precompiles/bn254/rustbn.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bn254/rustbn.ts#L19)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBN254Interface.add`

***

### mul()

> **mul**(`input`): `Uint8Array`

Defined in: [precompiles/bn254/rustbn.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bn254/rustbn.ts#L24)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBN254Interface.mul`

***

### pairing()

> **pairing**(`input`): `Uint8Array`

Defined in: [precompiles/bn254/rustbn.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bn254/rustbn.ts#L28)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBN254Interface.pairing`
