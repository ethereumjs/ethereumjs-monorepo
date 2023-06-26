@ethereumjs/statemanager

# @ethereumjs/statemanager

## Table of contents

### Classes

- [BaseStateManager](classes/BaseStateManager.md)
- [DefaultStateManager](classes/DefaultStateManager.md)
- [EthersStateManager](classes/EthersStateManager.md)

### Interfaces

- [EthersStateManagerOpts](interfaces/EthersStateManagerOpts.md)
- [StateAccess](interfaces/StateAccess.md)
- [StateManager](interfaces/StateManager.md)

### Type Aliases

- [AccountFields](README.md#accountfields)
- [Proof](README.md#proof)

### Variables

- [CODEHASH\_PREFIX](README.md#codehash_prefix)

## Type Aliases

### AccountFields

Ƭ **AccountFields**: `Partial`<`Pick`<`Account`, ``"nonce"`` \| ``"balance"`` \| ``"storageRoot"`` \| ``"codeHash"``\>\>

#### Defined in

[interface.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L11)

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

[stateManager.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L29)

## Variables

### CODEHASH\_PREFIX

• `Const` **CODEHASH\_PREFIX**: `Buffer`

Prefix to distinguish between a contract deployed with code `0x80`
and `RLP([])` (also having the value `0x80`).

Otherwise the creation of the code hash for the `0x80` contract
will be the same as the hash of the empty trie which leads to
misbehaviour in the underlying trie library.

#### Defined in

[stateManager.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L47)
