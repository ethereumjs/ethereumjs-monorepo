[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / MCLBLS

# Class: MCLBLS

Defined in: [precompiles/bls12\_381/mcl.ts:210](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/mcl.ts#L210)

Implementation of the `EVMBLSInterface` using the `mcl-wasm` WASM `mcl` wrapper library,
see https://github.com/herumi/mcl-wasm.

This can be optionally used to replace the build-in Noble implementation (`NobleBLS`) with
a more performant WASM variant. See EVM `bls` constructor option on how to use.

## Implements

- [`EVMBLSInterface`](../type-aliases/EVMBLSInterface.md)

## Constructors

### Constructor

> **new MCLBLS**(`mcl`): `MCLBLS`

Defined in: [precompiles/bls12\_381/mcl.ts:213](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/mcl.ts#L213)

#### Parameters

##### mcl

`any`

#### Returns

`MCLBLS`

## Methods

### addG1()

> **addG1**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/mcl.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/mcl.ts#L223)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.addG1`

***

### addG2()

> **addG2**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/mcl.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/mcl.ts#L237)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.addG2`

***

### init()

> **init**(): `void`

Defined in: [precompiles/bls12\_381/mcl.ts:217](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/mcl.ts#L217)

#### Returns

`void`

#### Implementation of

`EVMBLSInterface.init`

***

### mapFP2toG2()

> **mapFP2toG2**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/mcl.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/mcl.ts#L260)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.mapFP2toG2`

***

### mapFPtoG1()

> **mapFPtoG1**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/mcl.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/mcl.ts#L251)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.mapFPtoG1`

***

### msmG1()

> **msmG1**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/mcl.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/mcl.ts#L269)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.msmG1`

***

### msmG2()

> **msmG2**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/mcl.ts:295](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/mcl.ts#L295)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.msmG2`

***

### pairingCheck()

> **pairingCheck**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/mcl.ts:320](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/mcl.ts#L320)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.pairingCheck`
