[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EOFContainer

# Class: EOFContainer

Defined in: [eof/container.ts:444](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eof/container.ts#L444)

Parsed EOF container (EIP-3540 header + body).

## Constructors

### Constructor

> **new EOFContainer**(`buf`, `eofMode?`, `dataSectionAllowedSmaller?`): `EOFContainer`

Defined in: [eof/container.ts:455](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eof/container.ts#L455)

Parses and validates an EOF container from raw bytes.

#### Parameters

##### buf

`Uint8Array`

##### eofMode?

`EOFContainerMode` = `EOFContainerMode.Default`

##### dataSectionAllowedSmaller?

`boolean` = `false`

When `true`, the body data section may be shorter than the header size (deployment subcontainers).

#### Returns

`EOFContainer`

## Properties

### body

> **body**: `EOFBody`

Defined in: [eof/container.ts:446](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eof/container.ts#L446)

***

### buffer

> **buffer**: `Uint8Array`

Defined in: [eof/container.ts:447](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eof/container.ts#L447)

***

### eofMode

> **eofMode**: `EOFContainerMode`

Defined in: [eof/container.ts:448](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eof/container.ts#L448)

***

### header

> **header**: `EOFHeader`

Defined in: [eof/container.ts:445](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eof/container.ts#L445)
