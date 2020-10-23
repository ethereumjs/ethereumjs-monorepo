[@ethereumjs/vm](../README.md) › ["evm/evm"](_evm_evm_.md)

# Module: "evm/evm"

## Index

### Interfaces

* [EVMResult](../interfaces/_evm_evm_.evmresult.md)
* [ExecResult](../interfaces/_evm_evm_.execresult.md)
* [NewContractEvent](../interfaces/_evm_evm_.newcontractevent.md)

### Functions

* [COOGResult](_evm_evm_.md#coogresult)
* [OOGResult](_evm_evm_.md#oogresult)
* [VmErrorResult](_evm_evm_.md#vmerrorresult)

## Functions

###  COOGResult

▸ **COOGResult**(`gasUsedCreateCode`: BN): *[ExecResult](../interfaces/_evm_evm_.execresult.md)*

*Defined in [evm/evm.ts:86](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L86)*

**Parameters:**

Name | Type |
------ | ------ |
`gasUsedCreateCode` | BN |

**Returns:** *[ExecResult](../interfaces/_evm_evm_.execresult.md)*

___

###  OOGResult

▸ **OOGResult**(`gasLimit`: BN): *[ExecResult](../interfaces/_evm_evm_.execresult.md)*

*Defined in [evm/evm.ts:78](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L78)*

**Parameters:**

Name | Type |
------ | ------ |
`gasLimit` | BN |

**Returns:** *[ExecResult](../interfaces/_evm_evm_.execresult.md)*

___

###  VmErrorResult

▸ **VmErrorResult**(`error`: [VmError](../classes/_exceptions_.vmerror.md), `gasUsed`: BN): *[ExecResult](../interfaces/_evm_evm_.execresult.md)*

*Defined in [evm/evm.ts:94](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/evm.ts#L94)*

**Parameters:**

Name | Type |
------ | ------ |
`error` | [VmError](../classes/_exceptions_.vmerror.md) |
`gasUsed` | BN |

**Returns:** *[ExecResult](../interfaces/_evm_evm_.execresult.md)*
