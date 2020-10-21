[@ethereumjs/vm](../README.md) › ["lib/evm/opcodes/EIP2200"](_lib_evm_opcodes_eip2200_.md)

# Module: "lib/evm/opcodes/EIP2200"

## Index

### Functions

* [updateSstoreGasEIP2200](_lib_evm_opcodes_eip2200_.md#updatesstoregaseip2200)

## Functions

###  updateSstoreGasEIP2200

▸ **updateSstoreGasEIP2200**(`runState`: RunState, `found`: any, `value`: Buffer, `key`: Buffer): *void*

*Defined in [lib/evm/opcodes/EIP2200.ts:14](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/EIP2200.ts#L14)*

Adjusts gas usage and refunds of SStore ops per EIP-2200 (Istanbul)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`runState` | RunState | - |
`found` | any | - |
`value` | Buffer |   |
`key` | Buffer | - |

**Returns:** *void*
