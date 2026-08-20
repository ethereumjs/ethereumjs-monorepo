[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / validateEOF

# Function: validateEOF()

> **validateEOF**(`input`, `evm`, `containerMode?`, `eofMode?`): [`EOFContainer`](../classes/EOFContainer.md)

Defined in: [eof/container.ts:481](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eof/container.ts#L481)

Validates an EOF container for deployment (header, body, opcode/stack rules, subcontainers).

Call before accepting transaction-submitted containers; on-chain deployed EOF code is already valid.

## Parameters

### input

`Uint8Array`

### evm

[`EVM`](../classes/EVM.md)

### containerMode?

`ContainerSectionType` = `ContainerSectionType.RuntimeCode`

Whether the container is runtime, init, or deployment code.

### eofMode?

`EOFContainerMode` = `EOFContainerMode.Default`

## Returns

[`EOFContainer`](../classes/EOFContainer.md)

Parsed [EOFContainer](../classes/EOFContainer.md) when validation succeeds.

## Throws

On header, body, opcode, stack, or subcontainer validation failures.
