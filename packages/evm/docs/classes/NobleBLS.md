[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / NobleBLS

# Class: NobleBLS

Defined in: [precompiles/bls12\_381/noble.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/noble.ts#L174)

Implementation of the `EVMBLSInterface` using the `ethereum-cryptography (`@noble/curves`)
JS library, see https://github.com/ethereum/js-ethereum-cryptography.

This is the EVM default implementation.

## Implements

- [`EVMBLSInterface`](../type-aliases/EVMBLSInterface.md)

## Constructors

### Constructor

> **new NobleBLS**(): `NobleBLS`

#### Returns

`NobleBLS`

## Methods

### addG1()

> **addG1**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/noble.ts:175](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/noble.ts#L175)

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

Defined in: [precompiles/bls12\_381/noble.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/noble.ts#L200)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.addG2`

***

### mapFP2toG2()

> **mapFP2toG2**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/noble.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/noble.ts#L232)

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

Defined in: [precompiles/bls12\_381/noble.ts:224](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/noble.ts#L224)

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

Defined in: [precompiles/bls12\_381/noble.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/noble.ts#L240)

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

Defined in: [precompiles/bls12\_381/noble.ts:272](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/noble.ts#L272)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.msmG2`

***

### mulG1()

> **mulG1**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/noble.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/noble.ts#L188)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.mulG1`

***

### mulG2()

> **mulG2**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/noble.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/noble.ts#L212)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.mulG2`

***

### pairingCheck()

> **pairingCheck**(`input`): `Uint8Array`

Defined in: [precompiles/bls12\_381/noble.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/bls12_381/noble.ts#L304)

#### Parameters

##### input

`Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`EVMBLSInterface.pairingCheck`
