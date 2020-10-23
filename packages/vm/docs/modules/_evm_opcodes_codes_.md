[@ethereumjs/vm](../README.md) › ["evm/opcodes/codes"](_evm_opcodes_codes_.md)

# Module: "evm/opcodes/codes"

## Index

### Classes

* [Opcode](../classes/_evm_opcodes_codes_.opcode.md)

### Type aliases

* [OpcodeList](_evm_opcodes_codes_.md#opcodelist)

### Functions

* [getOpcodesForHF](_evm_opcodes_codes_.md#getopcodesforhf)

## Type aliases

###  OpcodeList

Ƭ **OpcodeList**: *Map‹number, [Opcode](../classes/_evm_opcodes_codes_.opcode.md)›*

*Defined in [evm/opcodes/codes.ts:35](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/codes.ts#L35)*

## Functions

###  getOpcodesForHF

▸ **getOpcodesForHF**(`common`: Common): *[OpcodeList](_evm_opcodes_codes_.md#opcodelist)*

*Defined in [evm/opcodes/codes.ts:267](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/evm/opcodes/codes.ts#L267)*

Get suitable opcodes for the required hardfork.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`common` | Common | Ethereumjs Common metadata object. |

**Returns:** *[OpcodeList](_evm_opcodes_codes_.md#opcodelist)*

Opcodes dictionary object.
