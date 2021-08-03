[@ethereumjs/vm](../README.md) / [Exports](../modules.md) / [state/interface](../modules/state_interface.md) / StateManager

# Interface: StateManager

[state/interface](../modules/state_interface.md).StateManager

## Hierarchy

- **`StateManager`**

  ↳ [`EIP2929StateManager`](state_interface.EIP2929StateManager.md)

## Implemented by

- [`default`](../classes/state_stateManager.default.md)

## Table of contents

### Methods

- [accountExists](state_interface.StateManager.md#accountexists)
- [accountIsEmpty](state_interface.StateManager.md#accountisempty)
- [checkpoint](state_interface.StateManager.md#checkpoint)
- [cleanupTouchedAccounts](state_interface.StateManager.md#cleanuptouchedaccounts)
- [clearContractStorage](state_interface.StateManager.md#clearcontractstorage)
- [clearOriginalStorageCache](state_interface.StateManager.md#clearoriginalstoragecache)
- [commit](state_interface.StateManager.md#commit)
- [copy](state_interface.StateManager.md#copy)
- [deleteAccount](state_interface.StateManager.md#deleteaccount)
- [dumpStorage](state_interface.StateManager.md#dumpstorage)
- [generateCanonicalGenesis](state_interface.StateManager.md#generatecanonicalgenesis)
- [generateGenesis](state_interface.StateManager.md#generategenesis)
- [getAccount](state_interface.StateManager.md#getaccount)
- [getContractCode](state_interface.StateManager.md#getcontractcode)
- [getContractStorage](state_interface.StateManager.md#getcontractstorage)
- [getOriginalContractStorage](state_interface.StateManager.md#getoriginalcontractstorage)
- [getStateRoot](state_interface.StateManager.md#getstateroot)
- [hasGenesisState](state_interface.StateManager.md#hasgenesisstate)
- [putAccount](state_interface.StateManager.md#putaccount)
- [putContractCode](state_interface.StateManager.md#putcontractcode)
- [putContractStorage](state_interface.StateManager.md#putcontractstorage)
- [revert](state_interface.StateManager.md#revert)
- [setStateRoot](state_interface.StateManager.md#setstateroot)
- [touchAccount](state_interface.StateManager.md#touchaccount)

## Methods

### accountExists

▸ **accountExists**(`address`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`boolean`\>

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

#### Defined in

[state/interface.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L32)

___

### checkpoint

▸ **checkpoint**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[state/interface.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L23)

___

### cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

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

#### Defined in

[state/interface.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L22)

___

### clearOriginalStorageCache

▸ **clearOriginalStorageCache**(): `void`

#### Returns

`void`

#### Defined in

[state/interface.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L35)

___

### commit

▸ **commit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[state/interface.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L24)

___

### copy

▸ **copy**(): [`StateManager`](state_interface.StateManager.md)

#### Returns

[`StateManager`](state_interface.StateManager.md)

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

#### Defined in

[state/interface.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L28)

___

### generateCanonicalGenesis

▸ **generateCanonicalGenesis**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

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

#### Defined in

[state/interface.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L26)

___

### hasGenesisState

▸ **hasGenesisState**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[state/interface.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L29)

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

#### Defined in

[state/interface.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L21)

___

### revert

▸ **revert**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

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

#### Defined in

[state/interface.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/state/interface.ts#L16)
