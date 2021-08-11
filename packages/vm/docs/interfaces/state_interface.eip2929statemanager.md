[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / [state/interface](../modules/state_interface.md) / EIP2929StateManager

# Interface: EIP2929StateManager

[state/interface](../modules/state_interface.md).EIP2929StateManager

## Hierarchy

- [`StateManager`](state_interface.StateManager.md)

  ↳ **`EIP2929StateManager`**

## Table of contents

### Methods

- [accountExists](state_interface.EIP2929StateManager.md#accountexists)
- [accountIsEmpty](state_interface.EIP2929StateManager.md#accountisempty)
- [addWarmedAddress](state_interface.EIP2929StateManager.md#addwarmedaddress)
- [addWarmedStorage](state_interface.EIP2929StateManager.md#addwarmedstorage)
- [checkpoint](state_interface.EIP2929StateManager.md#checkpoint)
- [cleanupTouchedAccounts](state_interface.EIP2929StateManager.md#cleanuptouchedaccounts)
- [clearContractStorage](state_interface.EIP2929StateManager.md#clearcontractstorage)
- [clearOriginalStorageCache](state_interface.EIP2929StateManager.md#clearoriginalstoragecache)
- [clearWarmedAccounts](state_interface.EIP2929StateManager.md#clearwarmedaccounts)
- [commit](state_interface.EIP2929StateManager.md#commit)
- [copy](state_interface.EIP2929StateManager.md#copy)
- [deleteAccount](state_interface.EIP2929StateManager.md#deleteaccount)
- [dumpStorage](state_interface.EIP2929StateManager.md#dumpstorage)
- [generateAccessList](state_interface.EIP2929StateManager.md#generateaccesslist)
- [generateCanonicalGenesis](state_interface.EIP2929StateManager.md#generatecanonicalgenesis)
- [generateGenesis](state_interface.EIP2929StateManager.md#generategenesis)
- [getAccount](state_interface.EIP2929StateManager.md#getaccount)
- [getContractCode](state_interface.EIP2929StateManager.md#getcontractcode)
- [getContractStorage](state_interface.EIP2929StateManager.md#getcontractstorage)
- [getOriginalContractStorage](state_interface.EIP2929StateManager.md#getoriginalcontractstorage)
- [getStateRoot](state_interface.EIP2929StateManager.md#getstateroot)
- [hasGenesisState](state_interface.EIP2929StateManager.md#hasgenesisstate)
- [isWarmedAddress](state_interface.EIP2929StateManager.md#iswarmedaddress)
- [isWarmedStorage](state_interface.EIP2929StateManager.md#iswarmedstorage)
- [putAccount](state_interface.EIP2929StateManager.md#putaccount)
- [putContractCode](state_interface.EIP2929StateManager.md#putcontractcode)
- [putContractStorage](state_interface.EIP2929StateManager.md#putcontractstorage)
- [revert](state_interface.EIP2929StateManager.md#revert)
- [setStateRoot](state_interface.EIP2929StateManager.md#setstateroot)
- [touchAccount](state_interface.EIP2929StateManager.md#touchaccount)

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

[StateManager](state_interface.StateManager.md).[accountExists](state_interface.StateManager.md#accountexists)

#### Defined in

[state/interface.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L33)

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

[StateManager](state_interface.StateManager.md).[accountIsEmpty](state_interface.StateManager.md#accountisempty)

#### Defined in

[state/interface.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L32)

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

[state/interface.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L39)

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

[state/interface.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L41)

___

### checkpoint

▸ **checkpoint**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateManager](state_interface.StateManager.md).[checkpoint](state_interface.StateManager.md#checkpoint)

#### Defined in

[state/interface.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L23)

___

### cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateManager](state_interface.StateManager.md).[cleanupTouchedAccounts](state_interface.StateManager.md#cleanuptouchedaccounts)

#### Defined in

[state/interface.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L34)

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

[StateManager](state_interface.StateManager.md).[clearContractStorage](state_interface.StateManager.md#clearcontractstorage)

#### Defined in

[state/interface.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L22)

___

### clearOriginalStorageCache

▸ **clearOriginalStorageCache**(): `void`

#### Returns

`void`

#### Inherited from

[StateManager](state_interface.StateManager.md).[clearOriginalStorageCache](state_interface.StateManager.md#clearoriginalstoragecache)

#### Defined in

[state/interface.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L35)

___

### clearWarmedAccounts

▸ **clearWarmedAccounts**(): `void`

#### Returns

`void`

#### Defined in

[state/interface.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L43)

___

### commit

▸ **commit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateManager](state_interface.StateManager.md).[commit](state_interface.StateManager.md#commit)

#### Defined in

[state/interface.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L24)

___

### copy

▸ **copy**(): [`StateManager`](state_interface.StateManager.md)

#### Returns

[`StateManager`](state_interface.StateManager.md)

#### Inherited from

[StateManager](state_interface.StateManager.md).[copy](state_interface.StateManager.md#copy)

#### Defined in

[state/interface.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L12)

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

[StateManager](state_interface.StateManager.md).[deleteAccount](state_interface.StateManager.md#deleteaccount)

#### Defined in

[state/interface.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L15)

___

### dumpStorage

▸ **dumpStorage**(`address`): `Promise`<[`StorageDump`](state_interface.StorageDump.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<[`StorageDump`](state_interface.StorageDump.md)\>

#### Inherited from

[StateManager](state_interface.StateManager.md).[dumpStorage](state_interface.StateManager.md#dumpstorage)

#### Defined in

[state/interface.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L28)

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

[state/interface.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L44)

___

### generateCanonicalGenesis

▸ **generateCanonicalGenesis**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateManager](state_interface.StateManager.md).[generateCanonicalGenesis](state_interface.StateManager.md#generatecanonicalgenesis)

#### Defined in

[state/interface.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L30)

___

### generateGenesis

▸ **generateGenesis**(`initState`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initState` | `any` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateManager](state_interface.StateManager.md).[generateGenesis](state_interface.StateManager.md#generategenesis)

#### Defined in

[state/interface.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L31)

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

[StateManager](state_interface.StateManager.md).[getAccount](state_interface.StateManager.md#getaccount)

#### Defined in

[state/interface.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L13)

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

[StateManager](state_interface.StateManager.md).[getContractCode](state_interface.StateManager.md#getcontractcode)

#### Defined in

[state/interface.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L18)

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

[StateManager](state_interface.StateManager.md).[getContractStorage](state_interface.StateManager.md#getcontractstorage)

#### Defined in

[state/interface.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L19)

___

### getOriginalContractStorage

▸ **getOriginalContractStorage**(`address`, `key`): `Promise`<`Buffer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Buffer` |

#### Returns

`Promise`<`Buffer`\>

#### Inherited from

[StateManager](state_interface.StateManager.md).[getOriginalContractStorage](state_interface.StateManager.md#getoriginalcontractstorage)

#### Defined in

[state/interface.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L20)

___

### getStateRoot

▸ **getStateRoot**(`force?`): `Promise`<`Buffer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `force?` | `boolean` |

#### Returns

`Promise`<`Buffer`\>

#### Inherited from

[StateManager](state_interface.StateManager.md).[getStateRoot](state_interface.StateManager.md#getstateroot)

#### Defined in

[state/interface.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L26)

___

### hasGenesisState

▸ **hasGenesisState**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Inherited from

[StateManager](state_interface.StateManager.md).[hasGenesisState](state_interface.StateManager.md#hasgenesisstate)

#### Defined in

[state/interface.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L29)

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

[state/interface.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L40)

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

[state/interface.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L42)

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

[StateManager](state_interface.StateManager.md).[putAccount](state_interface.StateManager.md#putaccount)

#### Defined in

[state/interface.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L14)

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

[StateManager](state_interface.StateManager.md).[putContractCode](state_interface.StateManager.md#putcontractcode)

#### Defined in

[state/interface.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L17)

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

[StateManager](state_interface.StateManager.md).[putContractStorage](state_interface.StateManager.md#putcontractstorage)

#### Defined in

[state/interface.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L21)

___

### revert

▸ **revert**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateManager](state_interface.StateManager.md).[revert](state_interface.StateManager.md#revert)

#### Defined in

[state/interface.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L25)

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

[StateManager](state_interface.StateManager.md).[setStateRoot](state_interface.StateManager.md#setstateroot)

#### Defined in

[state/interface.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L27)

___

### touchAccount

▸ **touchAccount**(`address`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`void`

#### Inherited from

[StateManager](state_interface.StateManager.md).[touchAccount](state_interface.StateManager.md#touchaccount)

#### Defined in

[state/interface.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L16)
