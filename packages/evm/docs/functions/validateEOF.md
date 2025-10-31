[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / validateEOF

# Function: validateEOF()

> **validateEOF**(`input`, `evm`, `containerMode`, `eofMode`): [`EOFContainer`](../classes/EOFContainer.md)

Defined in: [eof/container.ts:476](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eof/container.ts#L476)

This method validates the EOF. It also performs deeper validation of the body, such as stack/opcode validation
This is ONLY necessary when trying to deploy contracts from a transaction: these can submit containers which are invalid
Since all deployed EOF containers are valid by definition, `validateEOF` does not need to be called each time an EOF contract is called

## Parameters

### input

`Uint8Array`

Full container buffer

### evm

[`EVM`](../classes/EVM.md)

EVM, to read opcodes from

### containerMode

`ContainerSectionType` = `ContainerSectionType.RuntimeCode`

Container mode to validate on

### eofMode

`EOFContainerMode` = `EOFContainerMode.Default`

EOF mode to run in

## Returns

[`EOFContainer`](../classes/EOFContainer.md)
