[@ethereumjs/vm](../README.md) › ["lib/evm/opcodes/EIP1283"](_lib_evm_opcodes_eip1283_.md)

# Module: "lib/evm/opcodes/EIP1283"

## Index

### Functions

* [updateSstoreGasEIP1283](_lib_evm_opcodes_eip1283_.md#updatesstoregaseip1283)

## Functions

###  updateSstoreGasEIP1283

▸ **updateSstoreGasEIP1283**(`runState`: RunState, `found`: any, `value`: Buffer, `key`: Buffer): *void*

*Defined in [lib/evm/opcodes/EIP1283.ts:11](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/EIP1283.ts#L11)*

Adjusts gas usage and refunds of SStore ops per EIP-1283 (Constantinople)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`runState` | RunState | - |
`found` | any | - |
`value` | Buffer |   |
`key` | Buffer | - |

**Returns:** *void*
