[@ethereumjs/evm](../README.md) / EVMStateAccess

# Interface: EVMStateAccess

API for EVM state access, this extends the base interface from
the `@ethereumjs/statemanager` package and is part of the broader
EEI (see EEI interface).

An implementation of this can be found in the `@ethereumjs/vm` package.

## Hierarchy

- `StateAccess`

  ↳ **`EVMStateAccess`**

  ↳↳ [`EEIInterface`](EEIInterface.md)

## Table of contents

### Methods

- [accountExists](EVMStateAccess.md#accountexists)
- [accountIsEmpty](EVMStateAccess.md#accountisempty)
- [addWarmedAddress](EVMStateAccess.md#addwarmedaddress)
- [addWarmedStorage](EVMStateAccess.md#addwarmedstorage)
- [checkpoint](EVMStateAccess.md#checkpoint)
- [cleanupTouchedAccounts](EVMStateAccess.md#cleanuptouchedaccounts)
- [clearContractStorage](EVMStateAccess.md#clearcontractstorage)
- [clearOriginalStorageCache](EVMStateAccess.md#clearoriginalstoragecache)
- [clearWarmedAccounts](EVMStateAccess.md#clearwarmedaccounts)
- [commit](EVMStateAccess.md#commit)
- [deleteAccount](EVMStateAccess.md#deleteaccount)
- [generateAccessList](EVMStateAccess.md#generateaccesslist)
- [generateCanonicalGenesis](EVMStateAccess.md#generatecanonicalgenesis)
- [getAccount](EVMStateAccess.md#getaccount)
- [getContractCode](EVMStateAccess.md#getcontractcode)
- [getContractStorage](EVMStateAccess.md#getcontractstorage)
- [getProof](EVMStateAccess.md#getproof)
- [getStateRoot](EVMStateAccess.md#getstateroot)
- [hasStateRoot](EVMStateAccess.md#hasstateroot)
- [isWarmedAddress](EVMStateAccess.md#iswarmedaddress)
- [isWarmedStorage](EVMStateAccess.md#iswarmedstorage)
- [modifyAccountFields](EVMStateAccess.md#modifyaccountfields)
- [putAccount](EVMStateAccess.md#putaccount)
- [putContractCode](EVMStateAccess.md#putcontractcode)
- [putContractStorage](EVMStateAccess.md#putcontractstorage)
- [revert](EVMStateAccess.md#revert)
- [setStateRoot](EVMStateAccess.md#setstateroot)
- [verifyProof](EVMStateAccess.md#verifyproof)

## Methods

### accountExists

▸ **accountExists**(`address`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

StateAccess.accountExists

#### Defined in

[packages/evm/src/types.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L251)

___

### accountIsEmpty

▸ **accountIsEmpty**(`address`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

StateAccess.accountIsEmpty

#### Defined in

[packages/evm/src/types.ts:254](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L254)

___

### addWarmedAddress

▸ **addWarmedAddress**(`address`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/evm/src/types.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L43)

___

### addWarmedStorage

▸ **addWarmedStorage**(`address`, `slot`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Buffer` |
| `slot` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/evm/src/types.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L45)

___

### checkpoint

▸ **checkpoint**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

StateAccess.checkpoint

#### Defined in

[packages/evm/src/types.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L262)

___

### cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/evm/src/types.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L50)

___

### clearContractStorage

▸ **clearContractStorage**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`void`\>

#### Inherited from

StateAccess.clearContractStorage

#### Defined in

[packages/evm/src/types.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L261)

___

### clearOriginalStorageCache

▸ **clearOriginalStorageCache**(): `void`

#### Returns

`void`

#### Defined in

[packages/evm/src/types.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L49)

___

### clearWarmedAccounts

▸ **clearWarmedAccounts**(): `void`

#### Returns

`void`

#### Defined in

[packages/evm/src/types.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L47)

___

### commit

▸ **commit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

StateAccess.commit

#### Defined in

[packages/evm/src/types.ts:263](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L263)

___

### deleteAccount

▸ **deleteAccount**(`address`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`void`\>

#### Inherited from

StateAccess.deleteAccount

#### Defined in

[packages/evm/src/types.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L255)

___

### generateAccessList

▸ `Optional` **generateAccessList**(`addressesRemoved`, `addressesOnlyStorage`): `AccessList`

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressesRemoved` | `Address`[] |
| `addressesOnlyStorage` | `Address`[] |

#### Returns

`AccessList`

#### Defined in

[packages/evm/src/types.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L48)

___

### generateCanonicalGenesis

▸ **generateCanonicalGenesis**(`initState`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initState` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/evm/src/types.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L51)

___

### getAccount

▸ **getAccount**(`address`): `Promise`<`Account`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`Account`\>

#### Inherited from

StateAccess.getAccount

#### Defined in

[packages/evm/src/types.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L252)

___

### getContractCode

▸ **getContractCode**(`address`): `Promise`<`Buffer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`Buffer`\>

#### Inherited from

StateAccess.getContractCode

#### Defined in

[packages/evm/src/types.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L258)

___

### getContractStorage

▸ **getContractStorage**(`address`, `key`): `Promise`<`Buffer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Buffer` |

#### Returns

`Promise`<`Buffer`\>

#### Inherited from

StateAccess.getContractStorage

#### Defined in

[packages/evm/src/types.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L259)

___

### getProof

▸ `Optional` **getProof**(`address`, `storageSlots`): `Promise`<`Proof`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `storageSlots` | `Buffer`[] |

#### Returns

`Promise`<`Proof`\>

#### Inherited from

StateAccess.getProof

#### Defined in

[packages/evm/src/types.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L267)

___

### getStateRoot

▸ **getStateRoot**(): `Promise`<`Buffer`\>

#### Returns

`Promise`<`Buffer`\>

#### Inherited from

StateAccess.getStateRoot

#### Defined in

[packages/evm/src/types.ts:265](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L265)

___

### hasStateRoot

▸ **hasStateRoot**(`root`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Buffer` |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

StateAccess.hasStateRoot

#### Defined in

[packages/evm/src/types.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L269)

___

### isWarmedAddress

▸ **isWarmedAddress**(`address`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Buffer` |

#### Returns

`boolean`

#### Defined in

[packages/evm/src/types.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L44)

___

### isWarmedStorage

▸ **isWarmedStorage**(`address`, `slot`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Buffer` |
| `slot` | `Buffer` |

#### Returns

`boolean`

#### Defined in

[packages/evm/src/types.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L46)

___

### modifyAccountFields

▸ **modifyAccountFields**(`address`, `accountFields`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `accountFields` | `Partial`<`Pick`<`Account`, ``"nonce"`` \| ``"balance"`` \| ``"stateRoot"`` \| ``"codeHash"``\>\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

StateAccess.modifyAccountFields

#### Defined in

[packages/evm/src/types.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L256)

___

### putAccount

▸ **putAccount**(`address`, `account`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `account` | `Account` |

#### Returns

`Promise`<`void`\>

#### Inherited from

StateAccess.putAccount

#### Defined in

[packages/evm/src/types.ts:253](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L253)

___

### putContractCode

▸ **putContractCode**(`address`, `value`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `value` | `Buffer` |

#### Returns

`Promise`<`void`\>

#### Inherited from

StateAccess.putContractCode

#### Defined in

[packages/evm/src/types.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L257)

___

### putContractStorage

▸ **putContractStorage**(`address`, `key`, `value`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Buffer` |
| `value` | `Buffer` |

#### Returns

`Promise`<`void`\>

#### Inherited from

StateAccess.putContractStorage

#### Defined in

[packages/evm/src/types.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L260)

___

### revert

▸ **revert**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

StateAccess.revert

#### Defined in

[packages/evm/src/types.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L264)

___

### setStateRoot

▸ **setStateRoot**(`stateRoot`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateRoot` | `Buffer` |

#### Returns

`Promise`<`void`\>

#### Inherited from

StateAccess.setStateRoot

#### Defined in

[packages/evm/src/types.ts:266](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L266)

___

### verifyProof

▸ `Optional` **verifyProof**(`proof`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `proof` | `Proof` |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

StateAccess.verifyProof

#### Defined in

[packages/evm/src/types.ts:268](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L268)
