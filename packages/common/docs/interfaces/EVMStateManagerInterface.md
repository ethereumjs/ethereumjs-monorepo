[@ethereumjs/common](../README.md) / EVMStateManagerInterface

# Interface: EVMStateManagerInterface

## Hierarchy

- [`StateManagerInterface`](StateManagerInterface.md)

  ↳ **`EVMStateManagerInterface`**

## Table of contents

### Properties

- [originalStorageCache](EVMStateManagerInterface.md#originalstoragecache)

### Methods

- [checkpoint](EVMStateManagerInterface.md#checkpoint)
- [clearContractStorage](EVMStateManagerInterface.md#clearcontractstorage)
- [commit](EVMStateManagerInterface.md#commit)
- [deleteAccount](EVMStateManagerInterface.md#deleteaccount)
- [dumpStorage](EVMStateManagerInterface.md#dumpstorage)
- [dumpStorageRange](EVMStateManagerInterface.md#dumpstoragerange)
- [generateCanonicalGenesis](EVMStateManagerInterface.md#generatecanonicalgenesis)
- [getAccount](EVMStateManagerInterface.md#getaccount)
- [getAppliedKey](EVMStateManagerInterface.md#getappliedkey)
- [getContractCode](EVMStateManagerInterface.md#getcontractcode)
- [getContractStorage](EVMStateManagerInterface.md#getcontractstorage)
- [getProof](EVMStateManagerInterface.md#getproof)
- [getStateRoot](EVMStateManagerInterface.md#getstateroot)
- [hasStateRoot](EVMStateManagerInterface.md#hasstateroot)
- [modifyAccountFields](EVMStateManagerInterface.md#modifyaccountfields)
- [putAccount](EVMStateManagerInterface.md#putaccount)
- [putContractCode](EVMStateManagerInterface.md#putcontractcode)
- [putContractStorage](EVMStateManagerInterface.md#putcontractstorage)
- [revert](EVMStateManagerInterface.md#revert)
- [setStateRoot](EVMStateManagerInterface.md#setstateroot)
- [shallowCopy](EVMStateManagerInterface.md#shallowcopy)

## Properties

### originalStorageCache

• **originalStorageCache**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `clear` | () => `void` |
| `get` | (`address`: `Address`, `key`: `Uint8Array`) => `Promise`<`Uint8Array`\> |

#### Defined in

[interfaces.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L90)

## Methods

### checkpoint

▸ **checkpoint**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateManagerInterface](StateManagerInterface.md).[checkpoint](StateManagerInterface.md#checkpoint)

#### Defined in

[interfaces.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L78)

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

[StateManagerInterface](StateManagerInterface.md).[clearContractStorage](StateManagerInterface.md#clearcontractstorage)

#### Defined in

[interfaces.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L77)

___

### commit

▸ **commit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateManagerInterface](StateManagerInterface.md).[commit](StateManagerInterface.md#commit)

#### Defined in

[interfaces.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L79)

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

[StateManagerInterface](StateManagerInterface.md).[deleteAccount](StateManagerInterface.md#deleteaccount)

#### Defined in

[interfaces.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L71)

___

### dumpStorage

▸ **dumpStorage**(`address`): `Promise`<[`StorageDump`](StorageDump.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<[`StorageDump`](StorageDump.md)\>

#### Defined in

[interfaces.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L95)

___

### dumpStorageRange

▸ **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`<[`StorageRange`](StorageRange.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `startKey` | `bigint` |
| `limit` | `number` |

#### Returns

`Promise`<[`StorageRange`](StorageRange.md)\>

#### Defined in

[interfaces.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L96)

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

[interfaces.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L97)

___

### getAccount

▸ **getAccount**(`address`): `Promise`<`undefined` \| `Account`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`undefined` \| `Account`\>

#### Inherited from

[StateManagerInterface](StateManagerInterface.md).[getAccount](StateManagerInterface.md#getaccount)

#### Defined in

[interfaces.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L69)

___

### getAppliedKey

▸ `Optional` **getAppliedKey**(`address`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Inherited from

[StateManagerInterface](StateManagerInterface.md).[getAppliedKey](StateManagerInterface.md#getappliedkey)

#### Defined in

[interfaces.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L86)

___

### getContractCode

▸ **getContractCode**(`address`): `Promise`<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`Uint8Array`\>

#### Inherited from

[StateManagerInterface](StateManagerInterface.md).[getContractCode](StateManagerInterface.md#getcontractcode)

#### Defined in

[interfaces.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L74)

___

### getContractStorage

▸ **getContractStorage**(`address`, `key`): `Promise`<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Uint8Array` |

#### Returns

`Promise`<`Uint8Array`\>

#### Inherited from

[StateManagerInterface](StateManagerInterface.md).[getContractStorage](StateManagerInterface.md#getcontractstorage)

#### Defined in

[interfaces.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L75)

___

### getProof

▸ **getProof**(`address`, `storageSlots?`): `Promise`<[`Proof`](../README.md#proof)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `storageSlots?` | `Uint8Array`[] |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

#### Overrides

[StateManagerInterface](StateManagerInterface.md).[getProof](StateManagerInterface.md#getproof)

#### Defined in

[interfaces.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L98)

___

### getStateRoot

▸ **getStateRoot**(): `Promise`<`Uint8Array`\>

#### Returns

`Promise`<`Uint8Array`\>

#### Inherited from

[StateManagerInterface](StateManagerInterface.md).[getStateRoot](StateManagerInterface.md#getstateroot)

#### Defined in

[interfaces.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L81)

___

### hasStateRoot

▸ **hasStateRoot**(`root`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Uint8Array` |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

[StateManagerInterface](StateManagerInterface.md).[hasStateRoot](StateManagerInterface.md#hasstateroot)

#### Defined in

[interfaces.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L84)

___

### modifyAccountFields

▸ **modifyAccountFields**(`address`, `accountFields`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `accountFields` | `Partial`<`Pick`<`Account`, ``"nonce"`` \| ``"balance"`` \| ``"storageRoot"`` \| ``"codeHash"``\>\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateManagerInterface](StateManagerInterface.md).[modifyAccountFields](StateManagerInterface.md#modifyaccountfields)

#### Defined in

[interfaces.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L72)

___

### putAccount

▸ **putAccount**(`address`, `account?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `account?` | `Account` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateManagerInterface](StateManagerInterface.md).[putAccount](StateManagerInterface.md#putaccount)

#### Defined in

[interfaces.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L70)

___

### putContractCode

▸ **putContractCode**(`address`, `value`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `value` | `Uint8Array` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateManagerInterface](StateManagerInterface.md).[putContractCode](StateManagerInterface.md#putcontractcode)

#### Defined in

[interfaces.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L73)

___

### putContractStorage

▸ **putContractStorage**(`address`, `key`, `value`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateManagerInterface](StateManagerInterface.md).[putContractStorage](StateManagerInterface.md#putcontractstorage)

#### Defined in

[interfaces.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L76)

___

### revert

▸ **revert**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateManagerInterface](StateManagerInterface.md).[revert](StateManagerInterface.md#revert)

#### Defined in

[interfaces.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L80)

___

### setStateRoot

▸ **setStateRoot**(`stateRoot`, `clearCache?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateRoot` | `Uint8Array` |
| `clearCache?` | `boolean` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateManagerInterface](StateManagerInterface.md).[setStateRoot](StateManagerInterface.md#setstateroot)

#### Defined in

[interfaces.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L82)

___

### shallowCopy

▸ **shallowCopy**(`downlevelCaches?`): [`EVMStateManagerInterface`](EVMStateManagerInterface.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `downlevelCaches?` | `boolean` |

#### Returns

[`EVMStateManagerInterface`](EVMStateManagerInterface.md)

#### Overrides

[StateManagerInterface](StateManagerInterface.md).[shallowCopy](StateManagerInterface.md#shallowcopy)

#### Defined in

[interfaces.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L100)
