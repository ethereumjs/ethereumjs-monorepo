[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / StorageRange

# Interface: StorageRange

Defined in: [interfaces.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L19)

Object that can contain a set of storage keys associated with an account.

## Properties

### nextKey

> **nextKey**: `string` \| `null`

Defined in: [interfaces.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L36)

The next (hashed) storage key after the greatest storage key
contained in `storage`.

***

### storage

> **storage**: `object`

Defined in: [interfaces.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L26)

A dictionary where the keys are hashed storage keys, and the values are
objects containing the preimage of the hashed key (in `key`) and the
storage key (in `value`). Currently, there is no way to retrieve preimages,
so they are always `null`.

#### Index Signature

\[`key`: `string`\]: `object`
