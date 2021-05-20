[@ethereumjs/vm](../README.md) / [state/interface](../modules/state_interface.md) / EIP2929StateManager

# Interface: EIP2929StateManager

[state/interface](../modules/state_interface.md).EIP2929StateManager

## Hierarchy

- [*StateManager*](state_interface.statemanager.md)

  ↳ **EIP2929StateManager**

## Table of contents

### Methods

- [accountExists](state_interface.eip2929statemanager.md#accountexists)
- [accountIsEmpty](state_interface.eip2929statemanager.md#accountisempty)
- [addWarmedAddress](state_interface.eip2929statemanager.md#addwarmedaddress)
- [addWarmedStorage](state_interface.eip2929statemanager.md#addwarmedstorage)
- [checkpoint](state_interface.eip2929statemanager.md#checkpoint)
- [cleanupTouchedAccounts](state_interface.eip2929statemanager.md#cleanuptouchedaccounts)
- [clearContractStorage](state_interface.eip2929statemanager.md#clearcontractstorage)
- [clearOriginalStorageCache](state_interface.eip2929statemanager.md#clearoriginalstoragecache)
- [clearWarmedAccounts](state_interface.eip2929statemanager.md#clearwarmedaccounts)
- [commit](state_interface.eip2929statemanager.md#commit)
- [copy](state_interface.eip2929statemanager.md#copy)
- [deleteAccount](state_interface.eip2929statemanager.md#deleteaccount)
- [dumpStorage](state_interface.eip2929statemanager.md#dumpstorage)
- [generateAccessList](state_interface.eip2929statemanager.md#generateaccesslist)
- [generateCanonicalGenesis](state_interface.eip2929statemanager.md#generatecanonicalgenesis)
- [generateGenesis](state_interface.eip2929statemanager.md#generategenesis)
- [getAccount](state_interface.eip2929statemanager.md#getaccount)
- [getContractCode](state_interface.eip2929statemanager.md#getcontractcode)
- [getContractStorage](state_interface.eip2929statemanager.md#getcontractstorage)
- [getOriginalContractStorage](state_interface.eip2929statemanager.md#getoriginalcontractstorage)
- [getStateRoot](state_interface.eip2929statemanager.md#getstateroot)
- [hasGenesisState](state_interface.eip2929statemanager.md#hasgenesisstate)
- [isWarmedAddress](state_interface.eip2929statemanager.md#iswarmedaddress)
- [isWarmedStorage](state_interface.eip2929statemanager.md#iswarmedstorage)
- [putAccount](state_interface.eip2929statemanager.md#putaccount)
- [putContractCode](state_interface.eip2929statemanager.md#putcontractcode)
- [putContractStorage](state_interface.eip2929statemanager.md#putcontractstorage)
- [revert](state_interface.eip2929statemanager.md#revert)
- [setStateRoot](state_interface.eip2929statemanager.md#setstateroot)
- [touchAccount](state_interface.eip2929statemanager.md#touchaccount)

## Methods

### accountExists

▸ **accountExists**(`address`: *Address*): *Promise*<boolean\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *Promise*<boolean\>

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L33)

___

### accountIsEmpty

▸ **accountIsEmpty**(`address`: *Address*): *Promise*<boolean\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *Promise*<boolean\>

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L32)

___

### addWarmedAddress

▸ **addWarmedAddress**(`address`: *Buffer*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Buffer* |

**Returns:** *void*

Defined in: [state/interface.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L39)

___

### addWarmedStorage

▸ **addWarmedStorage**(`address`: *Buffer*, `slot`: *Buffer*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Buffer* |
| `slot` | *Buffer* |

**Returns:** *void*

Defined in: [state/interface.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L41)

___

### checkpoint

▸ **checkpoint**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L23)

___

### cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L34)

___

### clearContractStorage

▸ **clearContractStorage**(`address`: *Address*): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *Promise*<void\>

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L22)

___

### clearOriginalStorageCache

▸ **clearOriginalStorageCache**(): *void*

**Returns:** *void*

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L35)

___

### clearWarmedAccounts

▸ **clearWarmedAccounts**(): *void*

**Returns:** *void*

Defined in: [state/interface.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L43)

___

### commit

▸ **commit**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L24)

___

### copy

▸ **copy**(): [*StateManager*](state_interface.statemanager.md)

**Returns:** [*StateManager*](state_interface.statemanager.md)

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L12)

___

### deleteAccount

▸ **deleteAccount**(`address`: *Address*): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *Promise*<void\>

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L15)

___

### dumpStorage

▸ **dumpStorage**(`address`: *Address*): *Promise*<[*StorageDump*](state_interface.storagedump.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *Promise*<[*StorageDump*](state_interface.storagedump.md)\>

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L28)

___

### generateAccessList

▸ `Optional` **generateAccessList**(`addressesRemoved`: *Address*[], `addressesOnlyStorage`: *Address*[]): AccessList

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressesRemoved` | *Address*[] |
| `addressesOnlyStorage` | *Address*[] |

**Returns:** AccessList

Defined in: [state/interface.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L44)

___

### generateCanonicalGenesis

▸ **generateCanonicalGenesis**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L30)

___

### generateGenesis

▸ **generateGenesis**(`initState`: *any*): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initState` | *any* |

**Returns:** *Promise*<void\>

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L31)

___

### getAccount

▸ **getAccount**(`address`: *Address*): *Promise*<Account\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *Promise*<Account\>

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L13)

___

### getContractCode

▸ **getContractCode**(`address`: *Address*): *Promise*<Buffer\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *Promise*<Buffer\>

Inherited from: [StateManager](state_interface.statemanager.md)

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

Inherited from: [StateManager](state_interface.statemanager.md)

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

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L20)

___

### getStateRoot

▸ **getStateRoot**(`force?`: *boolean*): *Promise*<Buffer\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `force?` | *boolean* |

**Returns:** *Promise*<Buffer\>

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L26)

___

### hasGenesisState

▸ **hasGenesisState**(): *Promise*<boolean\>

**Returns:** *Promise*<boolean\>

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L29)

___

### isWarmedAddress

▸ **isWarmedAddress**(`address`: *Buffer*): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Buffer* |

**Returns:** *boolean*

Defined in: [state/interface.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L40)

___

### isWarmedStorage

▸ **isWarmedStorage**(`address`: *Buffer*, `slot`: *Buffer*): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Buffer* |
| `slot` | *Buffer* |

**Returns:** *boolean*

Defined in: [state/interface.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L42)

___

### putAccount

▸ **putAccount**(`address`: *Address*, `account`: *Account*): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |
| `account` | *Account* |

**Returns:** *Promise*<void\>

Inherited from: [StateManager](state_interface.statemanager.md)

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

Inherited from: [StateManager](state_interface.statemanager.md)

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

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L21)

___

### revert

▸ **revert**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L25)

___

### setStateRoot

▸ **setStateRoot**(`stateRoot`: *Buffer*): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateRoot` | *Buffer* |

**Returns:** *Promise*<void\>

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L27)

___

### touchAccount

▸ **touchAccount**(`address`: *Address*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *Address* |

**Returns:** *void*

Inherited from: [StateManager](state_interface.statemanager.md)

Defined in: [state/interface.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L16)
