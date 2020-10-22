[@ethereumjs/vm](../README.md) › ["lib/evm/opcodes/EIP2929"](_lib_evm_opcodes_eip2929_.md)

# Module: "lib/evm/opcodes/EIP2929"

## Index

### Functions

* [accessAddressEIP2929](_lib_evm_opcodes_eip2929_.md#accessaddresseip2929)
* [accessStorageEIP2929](_lib_evm_opcodes_eip2929_.md#accessstorageeip2929)
* [adjustSstoreGasEIP2929](_lib_evm_opcodes_eip2929_.md#adjustsstoregaseip2929)

## Functions

###  accessAddressEIP2929

▸ **accessAddressEIP2929**(`runState`: RunState, `address`: Address, `baseFee?`: undefined | number): *void*

*Defined in [lib/evm/opcodes/EIP2929.ts:13](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/EIP2929.ts#L13)*

Adds address to accessedAddresses set if not already included.
Adjusts cost incurred for executing opcode based on whether address read
is warm/cold. (EIP 2929)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`runState` | RunState | - |
`address` | Address |   |
`baseFee?` | undefined &#124; number | - |

**Returns:** *void*

___

###  accessStorageEIP2929

▸ **accessStorageEIP2929**(`runState`: RunState, `key`: Buffer, `isSstore`: boolean): *void*

*Defined in [lib/evm/opcodes/EIP2929.ts:42](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/EIP2929.ts#L42)*

Adds (address, key) to accessedStorage tuple set if not already included.
Adjusts cost incurred for executing opcode based on whether storage read
is warm/cold. (EIP 2929)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`runState` | RunState | - |
`key` | Buffer | (to storage slot)  |
`isSstore` | boolean | - |

**Returns:** *void*

___

###  adjustSstoreGasEIP2929

▸ **adjustSstoreGasEIP2929**(`runState`: RunState, `key`: Buffer, `defaultCost`: number, `costName`: string): *number*

*Defined in [lib/evm/opcodes/EIP2929.ts:74](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/EIP2929.ts#L74)*

Adjusts cost of SSTORE_RESET_GAS or SLOAD (aka sstorenoop) (EIP-2200) downward when storage
location is already warm

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`runState` | RunState | - |
`key` | Buffer | storage slot |
`defaultCost` | number | SSTORE_RESET_GAS / SLOAD |
`costName` | string | parameter name ('reset' or 'noop') |

**Returns:** *number*

adjusted cost
