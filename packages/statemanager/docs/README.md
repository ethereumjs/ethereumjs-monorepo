@ethereumjs/statemanager

# @ethereumjs/statemanager

## Table of contents

### Enumerations

- [CacheType](enums/CacheType.md)

### Classes

- [AccountCache](classes/AccountCache.md)
- [DefaultStateManager](classes/DefaultStateManager.md)
- [EthersStateManager](classes/EthersStateManager.md)
- [StorageCache](classes/StorageCache.md)

### Interfaces

- [CacheOpts](interfaces/CacheOpts.md)
- [DefaultStateManagerOpts](interfaces/DefaultStateManagerOpts.md)
- [EthersStateManagerOpts](interfaces/EthersStateManagerOpts.md)

### Type Aliases

- [Proof](README.md#proof)
- [StorageProof](README.md#storageproof)

### Variables

- [CODEHASH\_PREFIX](README.md#codehash_prefix)

## Type Aliases

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
| `storageProof` | [`StorageProof`](README.md#storageproof)[] |

#### Defined in

[stateManager.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L41)

___

### StorageProof

Ƭ **StorageProof**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `key` | `PrefixedHexString` |
| `proof` | `PrefixedHexString`[] |
| `value` | `PrefixedHexString` |

#### Defined in

[stateManager.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L35)

## Variables

### CODEHASH\_PREFIX

• `Const` **CODEHASH\_PREFIX**: `Uint8Array`

Prefix to distinguish between a contract deployed with code `0x80`
and `RLP([])` (also having the value `0x80`).

Otherwise the creation of the code hash for the `0x80` contract
will be the same as the hash of the empty trie which leads to
misbehaviour in the underlying trie library.

#### Defined in

[stateManager.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L102)
