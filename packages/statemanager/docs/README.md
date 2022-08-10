@ethereumjs/statemanager

# @ethereumjs/statemanager

## Table of contents

### Classes

- [BaseStateManager](classes/BaseStateManager.md)
- [DefaultStateManager](classes/DefaultStateManager.md)

### Interfaces

- [StateAccess](interfaces/StateAccess.md)
- [StateManager](interfaces/StateManager.md)

### Type Aliases

- [AccountFields](README.md#accountfields)
- [Proof](README.md#proof)

## Type Aliases

### AccountFields

Ƭ **AccountFields**: `Partial`<`Pick`<`Account`, ``"nonce"`` \| ``"balance"`` \| ``"stateRoot"`` \| ``"codeHash"``\>\>

#### Defined in

[interface.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L12)

___

### Proof

Ƭ **Proof**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `accountProof` | `PrefixedHexString`[] |
| `address` | `PrefixedHexString` |
| `balance` | `PrefixedHexString` |
| `codeHash` | `PrefixedHexString` |
| `nonce` | `PrefixedHexString` |
| `storageHash` | `PrefixedHexString` |
| `storageProof` | `StorageProof`[] |

#### Defined in

[stateManager.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L31)
