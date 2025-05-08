[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EOFContainer

# Class: EOFContainer

Defined in: [eof/container.ts:438](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eof/container.ts#L438)

Main constructor for the EOFContainer

## Constructors

### Constructor

> **new EOFContainer**(`buf`, `eofMode`, `dataSectionAllowedSmaller`): `EOFContainer`

Defined in: [eof/container.ts:450](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eof/container.ts#L450)

#### Parameters

##### buf

`Uint8Array`

Entire container buffer

##### eofMode

`EOFContainerMode` = `EOFContainerMode.Default`

Container mode to validate the container on

##### dataSectionAllowedSmaller

`boolean` = `false`

`true` if the data section is allowed to be smaller than the data section size in the header

#### Returns

`EOFContainer`

## Properties

### body

> **body**: `EOFBody`

Defined in: [eof/container.ts:440](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eof/container.ts#L440)

***

### buffer

> **buffer**: `Uint8Array`

Defined in: [eof/container.ts:441](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eof/container.ts#L441)

***

### eofMode

> **eofMode**: `EOFContainerMode`

Defined in: [eof/container.ts:442](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eof/container.ts#L442)

***

### header

> **header**: `EOFHeader`

Defined in: [eof/container.ts:439](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eof/container.ts#L439)
