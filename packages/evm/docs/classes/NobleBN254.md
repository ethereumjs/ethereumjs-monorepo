[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / NobleBN254

# Class: NobleBN254

Defined in: [precompiles/bn254/noble.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bn254/noble.ts#L122)

Implementation of the `EVMBN254Interface` using the `ethereum-cryptography (`@noble/curves`)
JS library, see https://github.com/ethereum/js-ethereum-cryptography.

This is the EVM default implementation.

## Implements

- [`EVMBN254Interface`](../type-aliases/EVMBN254Interface.md)

## Constructors

### Constructor

> **new NobleBN254**(): `NobleBN254`

#### Returns

`NobleBN254`

## Methods

### add()

> **add**(`input`): `Uint8Array`

Defined in: [precompiles/bn254/noble.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bn254/noble.ts#L123)

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

Defined in: [precompiles/bn254/noble.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bn254/noble.ts#L131)

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

Defined in: [precompiles/bn254/noble.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bn254/noble.ts#L142)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBN254Interface.pairing`
