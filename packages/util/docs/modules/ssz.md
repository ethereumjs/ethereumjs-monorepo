[@ethereumjs/util](../README.md) / ssz

# Namespace: ssz

SSZ containers

## Table of contents

### Variables

- [Bytes20](ssz.md#bytes20)
- [UintBigInt64](ssz.md#uintbigint64)
- [UintNum64](ssz.md#uintnum64)
- [Withdrawal](ssz.md#withdrawal)
- [Withdrawals](ssz.md#withdrawals)

## Variables

### Bytes20

• `Const` **Bytes20**: `ByteVectorType`

#### Defined in

[packages/util/src/ssz.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/ssz.ts#L13)

___

### UintBigInt64

• `Const` **UintBigInt64**: `UintBigintType`

#### Defined in

[packages/util/src/ssz.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/ssz.ts#L12)

___

### UintNum64

• `Const` **UintNum64**: `UintNumberType`

#### Defined in

[packages/util/src/ssz.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/ssz.ts#L11)

___

### Withdrawal

• `Const` **Withdrawal**: `ContainerType`<{ `address`: `ByteVectorType` = Bytes20; `amount`: `UintBigintType` = UintBigInt64; `index`: `UintBigintType` = UintBigInt64; `validatorIndex`: `UintBigintType` = UintBigInt64 }\>

#### Defined in

[packages/util/src/ssz.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/ssz.ts#L15)

___

### Withdrawals

• `Const` **Withdrawals**: `ListCompositeType`<`ContainerType`<{ `address`: `ByteVectorType` = Bytes20; `amount`: `UintBigintType` = UintBigInt64; `index`: `UintBigintType` = UintBigInt64; `validatorIndex`: `UintBigintType` = UintBigInt64 }\>\>

#### Defined in

[packages/util/src/ssz.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/ssz.ts#L24)
