[**@ethereumjs/common**](../README.md)

***

[@ethereumjs/common](../README.md) / StorageRange

# Interface: StorageRange

Defined in: [interfaces.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L21)

Object that can contain a set of storage keys associated with an account.

## Properties

### nextKey

> **nextKey**: `string` \| `null`

Defined in: [interfaces.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L38)

The next (hashed) storage key after the greatest storage key
contained in `storage`.

***

### storage

> **storage**: `object`

Defined in: [interfaces.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L28)

A dictionary where the keys are hashed storage keys, and the values are
objects containing the preimage of the hashed key (in `key`) and the
storage key (in `value`). Currently, there is no way to retrieve preimages,
so they are always `null`.

#### Index Signature

\[`key`: `string`\]: `object`
