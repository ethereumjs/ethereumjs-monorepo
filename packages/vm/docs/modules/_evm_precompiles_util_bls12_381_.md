[@ethereumjs/vm](../README.md) › ["evm/precompiles/util/bls12_381"](_evm_precompiles_util_bls12_381_.md)

# Module: "evm/precompiles/util/bls12_381"

## Index

### Functions

* [BLS12_381_FromG1Point](_evm_precompiles_util_bls12_381_.md#bls12_381_fromg1point)
* [BLS12_381_FromG2Point](_evm_precompiles_util_bls12_381_.md#bls12_381_fromg2point)
* [BLS12_381_ToFp2Point](_evm_precompiles_util_bls12_381_.md#bls12_381_tofp2point)
* [BLS12_381_ToFpPoint](_evm_precompiles_util_bls12_381_.md#bls12_381_tofppoint)
* [BLS12_381_ToFrPoint](_evm_precompiles_util_bls12_381_.md#bls12_381_tofrpoint)
* [BLS12_381_ToG1Point](_evm_precompiles_util_bls12_381_.md#bls12_381_tog1point)
* [BLS12_381_ToG2Point](_evm_precompiles_util_bls12_381_.md#bls12_381_tog2point)

## Functions

###  BLS12_381_FromG1Point

▸ **BLS12_381_FromG1Point**(`input`: any): *Buffer*

*Defined in [evm/precompiles/util/bls12_381.ts:51](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/precompiles/util/bls12_381.ts#L51)*

**Parameters:**

Name | Type |
------ | ------ |
`input` | any |

**Returns:** *Buffer*

___

###  BLS12_381_FromG2Point

▸ **BLS12_381_FromG2Point**(`input`: any): *Buffer*

*Defined in [evm/precompiles/util/bls12_381.ts:124](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/precompiles/util/bls12_381.ts#L124)*

**Parameters:**

Name | Type |
------ | ------ |
`input` | any |

**Returns:** *Buffer*

___

###  BLS12_381_ToFp2Point

▸ **BLS12_381_ToFp2Point**(`fpXCoordinate`: Buffer, `fpYCoordinate`: Buffer, `mcl`: any): *any*

*Defined in [evm/precompiles/util/bls12_381.ts:177](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/precompiles/util/bls12_381.ts#L177)*

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

*Defined in [evm/precompiles/util/bls12_381.ts:161](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/precompiles/util/bls12_381.ts#L161)*

**Parameters:**

Name | Type |
------ | ------ |
`fpCoordinate` | Buffer |
`mcl` | any |

**Returns:** *any*

___

###  BLS12_381_ToFrPoint

▸ **BLS12_381_ToFrPoint**(`input`: Buffer, `mcl`: any): *any*

*Defined in [evm/precompiles/util/bls12_381.ts:151](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/precompiles/util/bls12_381.ts#L151)*

**Parameters:**

Name | Type |
------ | ------ |
`input` | Buffer |
`mcl` | any |

**Returns:** *any*

___

###  BLS12_381_ToG1Point

▸ **BLS12_381_ToG1Point**(`input`: Buffer, `mcl`: any): *any*

*Defined in [evm/precompiles/util/bls12_381.ts:14](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/precompiles/util/bls12_381.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`input` | Buffer |
`mcl` | any |

**Returns:** *any*

___

###  BLS12_381_ToG2Point

▸ **BLS12_381_ToG2Point**(`input`: Buffer, `mcl`: any): *any*

*Defined in [evm/precompiles/util/bls12_381.ts:74](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/precompiles/util/bls12_381.ts#L74)*

**Parameters:**

Name | Type |
------ | ------ |
`input` | Buffer |
`mcl` | any |

**Returns:** *any*
