[@ethereumjs/vm](../README.md) / [state/interface](../modules/state_interface.md) / StateManager

# Interface: StateManager

[state/interface](../modules/state_interface.md).StateManager

## Hierarchy

- **StateManager**

  ↳ [*EIP2929StateManager*](state_interface.eip2929statemanager.md)

## Implemented by

- [*default*](../classes/state_statemanager.default.md)

## Table of contents

### Methods

- [accountExists](state_interface.statemanager.md#accountexists)
- [accountIsEmpty](state_interface.statemanager.md#accountisempty)
- [checkpoint](state_interface.statemanager.md#checkpoint)
- [cleanupTouchedAccounts](state_interface.statemanager.md#cleanuptouchedaccounts)
- [clearContractStorage](state_interface.statemanager.md#clearcontractstorage)
- [clearOriginalStorageCache](state_interface.statemanager.md#clearoriginalstoragecache)
- [commit](state_interface.statemanager.md#commit)
- [copy](state_interface.statemanager.md#copy)
- [deleteAccount](state_interface.statemanager.md#deleteaccount)
- [dumpStorage](state_interface.statemanager.md#dumpstorage)
- [generateCanonicalGenesis](state_interface.statemanager.md#generatecanonicalgenesis)
- [generateGenesis](state_interface.statemanager.md#generategenesis)
- [getAccount](state_interface.statemanager.md#getaccount)
- [getContractCode](state_interface.statemanager.md#getcontractcode)
- [getContractStorage](state_interface.statemanager.md#getcontractstorage)
- [getOriginalContractStorage](state_interface.statemanager.md#getoriginalcontractstorage)
- [getStateRoot](state_interface.statemanager.md#getstateroot)
- [hasGenesisState](state_interface.statemanager.md#hasgenesisstate)
- [putAccount](state_interface.statemanager.md#putaccount)
- [putContractCode](state_interface.statemanager.md#putcontractcode)
- [putContractStorage](state_interface.statemanager.md#putcontractstorage)
- [revert](state_interface.statemanager.md#revert)
- [setStateRoot](state_interface.statemanager.md#setstateroot)
- [touchAccount](state_interface.statemanager.md#touchaccount)

## Methods

### accountExists

▸ **accountExists**(`address`: *Address*): *Promise*<boolean\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *Promise*<boolean\>

Defined in: [state/interface.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L33)

___

### accountIsEmpty

▸ **accountIsEmpty**(`address`: *Address*): *Promise*<boolean\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *Promise*<boolean\>

Defined in: [state/interface.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L32)

___

### checkpoint

▸ **checkpoint**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [state/interface.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L23)

___

### cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [state/interface.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L34)

___

### clearContractStorage

▸ **clearContractStorage**(`address`: *Address*): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *Promise*<void\>

Defined in: [state/interface.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L22)

___

### clearOriginalStorageCache

▸ **clearOriginalStorageCache**(): *void*

**Returns:** *void*

Defined in: [state/interface.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L35)

___

### commit

▸ **commit**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [state/interface.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L24)

___

### copy

▸ **copy**(): [*StateManager*](state_interface.statemanager.md)

**Returns:** [*StateManager*](state_interface.statemanager.md)

Defined in: [state/interface.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L12)

___

### deleteAccount

▸ **deleteAccount**(`address`: *Address*): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *Promise*<void\>

Defined in: [state/interface.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L15)

___

### dumpStorage

▸ **dumpStorage**(`address`: *Address*): *Promise*<[*StorageDump*](state_interface.storagedump.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *Promise*<[*StorageDump*](state_interface.storagedump.md)\>

Defined in: [state/interface.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L28)

___

### generateCanonicalGenesis

▸ **generateCanonicalGenesis**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [state/interface.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L30)

___

### generateGenesis

▸ **generateGenesis**(`initState`: *any*): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initState` | *any* |

**Returns:** *Promise*<void\>

Defined in: [state/interface.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L31)

___

### getAccount

▸ **getAccount**(`address`: *Address*): *Promise*<Account\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *Promise*<Account\>

Defined in: [state/interface.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L13)

___

### getContractCode

▸ **getContractCode**(`address`: *Address*): *Promise*<Buffer\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *Promise*<Buffer\>

Defined in: [state/interface.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L18)

___

### getContractStorage

▸ **getContractStorage**(`address`: *Address*, `key`: *Buffer*): *Promise*<Buffer\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |
| `key` | *Buffer* |

**Returns:** *Promise*<Buffer\>

Defined in: [state/interface.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L19)

___

### getOriginalContractStorage

▸ **getOriginalContractStorage**(`address`: *Address*, `key`: *Buffer*): *Promise*<Buffer\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |
| `key` | *Buffer* |

**Returns:** *Promise*<Buffer\>

Defined in: [state/interface.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L20)

___

### getStateRoot

▸ **getStateRoot**(`force?`: *boolean*): *Promise*<Buffer\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `force?` | *boolean* |

**Returns:** *Promise*<Buffer\>

Defined in: [state/interface.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L26)

___

### hasGenesisState

▸ **hasGenesisState**(): *Promise*<boolean\>

**Returns:** *Promise*<boolean\>

Defined in: [state/interface.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L29)

___

### putAccount

▸ **putAccount**(`address`: *Address*, `account`: *Account*): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |
| `account` | *Account* |

**Returns:** *Promise*<void\>

Defined in: [state/interface.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L14)

___

### putContractCode

▸ **putContractCode**(`address`: *Address*, `value`: *Buffer*): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |
| `value` | *Buffer* |

**Returns:** *Promise*<void\>

Defined in: [state/interface.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L17)

___

### putContractStorage

▸ **putContractStorage**(`address`: *Address*, `key`: *Buffer*, `value`: *Buffer*): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |
| `key` | *Buffer* |
| `value` | *Buffer* |

**Returns:** *Promise*<void\>

Defined in: [state/interface.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L21)

___

### revert

▸ **revert**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [state/interface.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L25)

___

### setStateRoot

▸ **setStateRoot**(`stateRoot`: *Buffer*): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateRoot` | *Buffer* |

**Returns:** *Promise*<void\>

Defined in: [state/interface.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L27)

___

### touchAccount

▸ **touchAccount**(`address`: *Address*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *void*

Defined in: [state/interface.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L16)
