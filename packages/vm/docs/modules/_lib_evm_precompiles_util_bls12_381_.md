[@ethereumjs/vm](../README.md) › ["lib/evm/precompiles/util/bls12_381"](_lib_evm_precompiles_util_bls12_381_.md)

# Module: "lib/evm/precompiles/util/bls12_381"

## Index

### Functions

* [BLS12_381_FromG1Point](_lib_evm_precompiles_util_bls12_381_.md#bls12_381_fromg1point)
* [BLS12_381_FromG2Point](_lib_evm_precompiles_util_bls12_381_.md#bls12_381_fromg2point)
* [BLS12_381_ToFp2Point](_lib_evm_precompiles_util_bls12_381_.md#bls12_381_tofp2point)
* [BLS12_381_ToFpPoint](_lib_evm_precompiles_util_bls12_381_.md#bls12_381_tofppoint)
* [BLS12_381_ToFrPoint](_lib_evm_precompiles_util_bls12_381_.md#bls12_381_tofrpoint)
* [BLS12_381_ToG1Point](_lib_evm_precompiles_util_bls12_381_.md#bls12_381_tog1point)
* [BLS12_381_ToG2Point](_lib_evm_precompiles_util_bls12_381_.md#bls12_381_tog2point)

## Functions

###  BLS12_381_FromG1Point

▸ **BLS12_381_FromG1Point**(`input`: any): *Buffer*

*Defined in [lib/evm/precompiles/util/bls12_381.ts:52](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/precompiles/util/bls12_381.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`input` | any |

**Returns:** *Buffer*

___

###  BLS12_381_FromG2Point

▸ **BLS12_381_FromG2Point**(`input`: any): *Buffer*

*Defined in [lib/evm/precompiles/util/bls12_381.ts:125](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/precompiles/util/bls12_381.ts#L125)*

**Parameters:**

Name | Type |
------ | ------ |
`input` | any |

**Returns:** *Buffer*

___

###  BLS12_381_ToFp2Point

▸ **BLS12_381_ToFp2Point**(`fpXCoordinate`: Buffer, `fpYCoordinate`: Buffer, `mcl`: any): *any*

*Defined in [lib/evm/precompiles/util/bls12_381.ts:178](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/precompiles/util/bls12_381.ts#L178)*

**Parameters:**

Name | Type |
------ | ------ |
`fpXCoordinate` | Buffer |
`fpYCoordinate` | Buffer |
`mcl` | any |

**Returns:** *any*

___

###  BLS12_381_ToFpPoint

▸ **BLS12_381_ToFpPoint**(`fpCoordinate`: Buffer, `mcl`: any): *any*

*Defined in [lib/evm/precompiles/util/bls12_381.ts:162](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/precompiles/util/bls12_381.ts#L162)*

**Parameters:**

Name | Type |
------ | ------ |
`fpCoordinate` | Buffer |
`mcl` | any |

**Returns:** *any*

___

###  BLS12_381_ToFrPoint

▸ **BLS12_381_ToFrPoint**(`input`: Buffer, `mcl`: any): *any*

*Defined in [lib/evm/precompiles/util/bls12_381.ts:152](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/precompiles/util/bls12_381.ts#L152)*

**Parameters:**

Name | Type |
------ | ------ |
`input` | Buffer |
`mcl` | any |

**Returns:** *any*

___

###  BLS12_381_ToG1Point

▸ **BLS12_381_ToG1Point**(`input`: Buffer, `mcl`: any): *any*

*Defined in [lib/evm/precompiles/util/bls12_381.ts:15](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/precompiles/util/bls12_381.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`input` | Buffer |
`mcl` | any |

**Returns:** *any*

___

###  BLS12_381_ToG2Point

▸ **BLS12_381_ToG2Point**(`input`: Buffer, `mcl`: any): *any*

*Defined in [lib/evm/precompiles/util/bls12_381.ts:75](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/precompiles/util/bls12_381.ts#L75)*

**Parameters:**

Name | Type |
------ | ------ |
`input` | Buffer |
`mcl` | any |

**Returns:** *any*
