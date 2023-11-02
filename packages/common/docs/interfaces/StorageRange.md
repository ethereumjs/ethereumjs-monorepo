[@ethereumjs/common](../README.md) / StorageRange

# Interface: StorageRange

Object that can contain a set of storage keys associated with an account.

## Table of contents

### Properties

- [nextKey](StorageRange.md#nextkey)
- [storage](StorageRange.md#storage)

## Properties

### nextKey

• **nextKey**: ``null`` \| `string`

The next (hashed) storage key after the greatest storage key
contained in `storage`.

#### Defined in

[interfaces.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L31)

___

### storage

• **storage**: `Object`

A dictionary where the keys are hashed storage keys, and the values are
objects containing the preimage of the hashed key (in `key`) and the
storage key (in `value`). Currently, there is no way to retrieve preimages,
so they are always `null`.

#### Index signature

▪ [key: `string`]: { `key`: `string` \| ``null`` ; `value`: `string`  }

#### Defined in

[interfaces.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L21)
