[@ethereumjs/vm](../README.md) › ["lib/evm/evm"](_lib_evm_evm_.md)

# Module: "lib/evm/evm"

## Index

### Interfaces

* [EVMResult](../interfaces/_lib_evm_evm_.evmresult.md)
* [ExecResult](../interfaces/_lib_evm_evm_.execresult.md)
* [NewContractEvent](../interfaces/_lib_evm_evm_.newcontractevent.md)

### Functions

* [COOGResult](_lib_evm_evm_.md#coogresult)
* [OOGResult](_lib_evm_evm_.md#oogresult)
* [VmErrorResult](_lib_evm_evm_.md#vmerrorresult)

## Functions

###  COOGResult

▸ **COOGResult**(`gasUsedCreateCode`: BN): *[ExecResult](../interfaces/_lib_evm_evm_.execresult.md)*

*Defined in [lib/evm/evm.ts:87](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L87)*

**Parameters:**

Name | Type |
------ | ------ |
`gasUsedCreateCode` | BN |

**Returns:** *[ExecResult](../interfaces/_lib_evm_evm_.execresult.md)*

___

###  OOGResult

▸ **OOGResult**(`gasLimit`: BN): *[ExecResult](../interfaces/_lib_evm_evm_.execresult.md)*

*Defined in [lib/evm/evm.ts:79](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L79)*

**Parameters:**

Name | Type |
------ | ------ |
`gasLimit` | BN |

**Returns:** *[ExecResult](../interfaces/_lib_evm_evm_.execresult.md)*

___

###  VmErrorResult

▸ **VmErrorResult**(`error`: [VmError](../classes/_lib_exceptions_.vmerror.md), `gasUsed`: BN): *[ExecResult](../interfaces/_lib_evm_evm_.execresult.md)*

*Defined in [lib/evm/evm.ts:95](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L95)*

**Parameters:**

Name | Type |
------ | ------ |
`error` | [VmError](../classes/_lib_exceptions_.vmerror.md) |
`gasUsed` | BN |

**Returns:** *[ExecResult](../interfaces/_lib_evm_evm_.execresult.md)*
