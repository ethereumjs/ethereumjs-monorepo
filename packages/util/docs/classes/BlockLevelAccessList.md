[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / BlockLevelAccessList

# Class: BlockLevelAccessList

Defined in: [packages/util/src/bal/index.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L120)

In-memory [EIP-7928](https://eips.ethereum.org/EIPS/eip-7928) block access list with
canonical RLP/JSON encoding, checkpointing, and mutation helpers used by the VM during execution.

## Remarks

Experimental (Amsterdam): public API and behaviour may change on patch releases.
See `@ethereumjs/vm` README section `Amsterdam hardfork (experimental)` for release ↔ spec tracking.

## Constructors

### Constructor

> **new BlockLevelAccessList**(`accesses?`): `BlockLevelAccessList`

Defined in: [packages/util/src/bal/index.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L131)

#### Parameters

##### accesses?

[`Accesses`](../type-aliases/Accesses.md) = `{}`

#### Returns

`BlockLevelAccessList`

## Properties

### accesses

> **accesses**: [`Accesses`](../type-aliases/Accesses.md)

Defined in: [packages/util/src/bal/index.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L122)

Account-level access entries keyed by address.

***

### blockAccessIndex

> **blockAccessIndex**: `number`

Defined in: [packages/util/src/bal/index.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L124)

Current block access index (transaction or system phase) for new change records.

## Methods

### addAddress()

> **addAddress**(`address`): `void`

Defined in: [packages/util/src/bal/index.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L303)

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`void`

***

### addBalanceChange()

> **addBalanceChange**(`address`, `balance`, `blockAccessIndex`, `originalBalance?`): `void`

Defined in: [packages/util/src/bal/index.ts:394](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L394)

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

Defined in: [packages/util/src/bal/index.ts:451](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L451)

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

Defined in: [packages/util/src/bal/index.ts:440](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L440)

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

Defined in: [packages/util/src/bal/index.ts:382](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L382)

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

Defined in: [packages/util/src/bal/index.ts:316](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L316)

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

Defined in: [packages/util/src/bal/index.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L154)

#### Returns

`void`

***

### cleanupNetZeroBalanceChanges()

> **cleanupNetZeroBalanceChanges**(): `void`

Defined in: [packages/util/src/bal/index.ts:418](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L418)

EIP-7928: Remove balance changes for addresses where final balance equals first balance.
Call this at the end of each transaction to clean up net-zero balance changes.

#### Returns

`void`

***

### cleanupSelfdestructed()

> **cleanupSelfdestructed**(`addresses`, `finalBalances?`): `void`

Defined in: [packages/util/src/bal/index.ts:567](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L567)

For selfdestructed accounts, drop state changes while preserving read footprints.
Any `storageChanges` are converted to `storageReads`. Per EIP-7928, a positive
pre-transaction balance reduced to zero via `SELFDESTRUCT` keeps the balance change.

#### Parameters

##### addresses

`` `0x${string}` ``[]

##### finalBalances?

`Map`\<`` `0x${string}` ``, `bigint`\>

#### Returns

`void`

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### commit()

> **commit**(): `void`

Defined in: [packages/util/src/bal/index.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L161)

#### Returns

`void`

***

### get()

> **get**(`address`): [`BALAccountAccess`](../type-aliases/BALAccountAccess.md) \| `undefined`

Defined in: [packages/util/src/bal/index.ts:296](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L296)

Lookup the per-account access entry without walking [toJSON](#tojson).
Address keys are lower-case `0x`-prefixed hex (same as `Address.toString()`).

#### Parameters

##### address

`string` \| [`Address`](Address.md)

#### Returns

[`BALAccountAccess`](../type-aliases/BALAccountAccess.md) \| `undefined`

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [packages/util/src/bal/index.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L150)

Header commitment `keccak256(serialize())` used as `blockAccessListHash`.

#### Returns

`Uint8Array`

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### raw()

> **raw**(): `BALRawBlockAccessList`

Defined in: [packages/util/src/bal/index.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L237)

Canonical sorted tuple view used for RLP and validation.

#### Returns

`BALRawBlockAccessList`

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### revert()

> **revert**(): `void`

Defined in: [packages/util/src/bal/index.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L167)

#### Returns

`void`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [packages/util/src/bal/index.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L141)

Canonical RLP encoding of the access list (`RLP.encode(raw())`).

#### Returns

`Uint8Array`

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### toJSON()

> **toJSON**(): [`BALJSONBlockAccessList`](../type-aliases/BALJSONBlockAccessList.md)

Defined in: [packages/util/src/bal/index.ts:501](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L501)

Converts the internal representation to JSON fixture / Engine API form.
Inverse of [createBlockLevelAccessListFromJSON](../functions/createBlockLevelAccessListFromJSON.md).

#### Returns

[`BALJSONBlockAccessList`](../type-aliases/BALJSONBlockAccessList.md)

#### Remarks

Experimental (Amsterdam): may change on patch releases.
