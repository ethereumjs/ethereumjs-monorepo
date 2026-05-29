[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / BlockLevelAccessList

# Class: BlockLevelAccessList

Defined in: [packages/util/src/bal/index.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L117)

In-memory [EIP-7928](https://eips.ethereum.org/EIPS/eip-7928) block access list with
canonical RLP/JSON encoding, checkpointing, and mutation helpers used by the VM during execution.

## Remarks

Experimental (Amsterdam): public API and behaviour may change on patch releases.
See `@ethereumjs/vm` README section `Amsterdam hardfork (experimental)` for release ↔ spec tracking.

## Constructors

### Constructor

> **new BlockLevelAccessList**(`accesses`): `BlockLevelAccessList`

Defined in: [packages/util/src/bal/index.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L128)

#### Parameters

##### accesses

[`Accesses`](../type-aliases/Accesses.md) = `{}`

#### Returns

`BlockLevelAccessList`

## Properties

### accesses

> **accesses**: [`Accesses`](../type-aliases/Accesses.md)

Defined in: [packages/util/src/bal/index.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L119)

Account-level access entries keyed by address.

***

### blockAccessIndex

> **blockAccessIndex**: `number`

Defined in: [packages/util/src/bal/index.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L121)

Current block access index (transaction or system phase) for new change records.

## Methods

### addAddress()

> **addAddress**(`address`): `void`

Defined in: [packages/util/src/bal/index.ts:287](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L287)

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`void`

***

### addBalanceChange()

> **addBalanceChange**(`address`, `balance`, `blockAccessIndex`, `originalBalance?`): `void`

Defined in: [packages/util/src/bal/index.ts:378](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L378)

#### Parameters

##### address

`` `0x${string}` ``

##### balance

`bigint`

##### blockAccessIndex

`number`

##### originalBalance?

`bigint`

#### Returns

`void`

***

### addCodeChange()

> **addCodeChange**(`address`, `code`, `blockAccessIndex`, `originalCode?`): `void`

Defined in: [packages/util/src/bal/index.ts:435](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L435)

#### Parameters

##### address

`` `0x${string}` ``

##### code

`BALByteCodeBytes`

##### blockAccessIndex

`number`

##### originalCode?

`BALByteCodeBytes`

#### Returns

`void`

***

### addNonceChange()

> **addNonceChange**(`address`, `nonce`, `blockAccessIndex`): `void`

Defined in: [packages/util/src/bal/index.ts:424](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L424)

#### Parameters

##### address

`` `0x${string}` ``

##### nonce

`bigint`

##### blockAccessIndex

`number`

#### Returns

`void`

***

### addStorageRead()

> **addStorageRead**(`address`, `storageKey`): `void`

Defined in: [packages/util/src/bal/index.ts:366](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L366)

#### Parameters

##### address

`` `0x${string}` ``

##### storageKey

`BALStorageKeyBytes`

#### Returns

`void`

***

### addStorageWrite()

> **addStorageWrite**(`address`, `storageKey`, `value`, `blockAccessIndex`, `originalValue?`): `void`

Defined in: [packages/util/src/bal/index.ts:300](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L300)

#### Parameters

##### address

`` `0x${string}` ``

##### storageKey

`BALStorageKeyBytes`

##### value

`BALStorageValueBytes`

##### blockAccessIndex

`number`

##### originalValue?

`BALStorageValueBytes`

#### Returns

`void`

***

### checkpoint()

> **checkpoint**(): `void`

Defined in: [packages/util/src/bal/index.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L151)

#### Returns

`void`

***

### cleanupNetZeroBalanceChanges()

> **cleanupNetZeroBalanceChanges**(): `void`

Defined in: [packages/util/src/bal/index.ts:402](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L402)

EIP-7928: Remove balance changes for addresses where final balance equals first balance.
Call this at the end of each transaction to clean up net-zero balance changes.

#### Returns

`void`

***

### cleanupSelfdestructed()

> **cleanupSelfdestructed**(`addresses`): `void`

Defined in: [packages/util/src/bal/index.ts:551](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L551)

For selfdestructed accounts, drop state changes while preserving read footprints.
Any `storageChanges` are converted to `storageReads`. Per EIP-7928, a positive
pre-transaction balance reduced to zero via `SELFDESTRUCT` keeps the balance change.

#### Parameters

##### addresses

`` `0x${string}` ``[]

#### Returns

`void`

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### commit()

> **commit**(): `void`

Defined in: [packages/util/src/bal/index.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L158)

#### Returns

`void`

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [packages/util/src/bal/index.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L147)

Header commitment `keccak256(serialize())` used as `blockAccessListHash`.

#### Returns

`Uint8Array`

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### raw()

> **raw**(): `BALRawBlockAccessList`

Defined in: [packages/util/src/bal/index.ts:234](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L234)

Canonical sorted tuple view used for RLP and validation.

#### Returns

`BALRawBlockAccessList`

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### revert()

> **revert**(): `void`

Defined in: [packages/util/src/bal/index.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L164)

#### Returns

`void`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [packages/util/src/bal/index.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L138)

Canonical RLP encoding of the access list (`RLP.encode(raw())`).

#### Returns

`Uint8Array`

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### toJSON()

> **toJSON**(): [`BALJSONBlockAccessList`](../type-aliases/BALJSONBlockAccessList.md)

Defined in: [packages/util/src/bal/index.ts:485](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L485)

Converts the internal representation to JSON fixture / Engine API form.
Inverse of [createBlockLevelAccessListFromJSON](../functions/createBlockLevelAccessListFromJSON.md).

#### Returns

[`BALJSONBlockAccessList`](../type-aliases/BALJSONBlockAccessList.md)

#### Remarks

Experimental (Amsterdam): may change on patch releases.
