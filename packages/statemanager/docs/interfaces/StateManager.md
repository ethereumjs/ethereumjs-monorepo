[@ethereumjs/statemanager](../README.md) / StateManager

# Interface: StateManager

## Hierarchy

- [`StateAccess`](StateAccess.md)

  ↳ **`StateManager`**

## Implemented by

- [`DefaultStateManager`](../classes/DefaultStateManager.md)

## Table of contents

### Methods

- [accountExists](StateManager.md#accountexists)
- [accountIsEmpty](StateManager.md#accountisempty)
- [checkpoint](StateManager.md#checkpoint)
- [clearContractStorage](StateManager.md#clearcontractstorage)
- [commit](StateManager.md#commit)
- [copy](StateManager.md#copy)
- [deleteAccount](StateManager.md#deleteaccount)
- [dumpStorage](StateManager.md#dumpstorage)
- [flush](StateManager.md#flush)
- [getAccount](StateManager.md#getaccount)
- [getContractCode](StateManager.md#getcontractcode)
- [getContractStorage](StateManager.md#getcontractstorage)
- [getProof](StateManager.md#getproof)
- [getStateRoot](StateManager.md#getstateroot)
- [hasStateRoot](StateManager.md#hasstateroot)
- [modifyAccountFields](StateManager.md#modifyaccountfields)
- [putAccount](StateManager.md#putaccount)
- [putContractCode](StateManager.md#putcontractcode)
- [putContractStorage](StateManager.md#putcontractstorage)
- [revert](StateManager.md#revert)
- [setStateRoot](StateManager.md#setstateroot)
- [verifyProof](StateManager.md#verifyproof)

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

[StateAccess](StateAccess.md).[accountExists](StateAccess.md#accountexists)

#### Defined in

[interface.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L15)

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

[StateAccess](StateAccess.md).[accountIsEmpty](StateAccess.md#accountisempty)

#### Defined in

[interface.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L18)

___

### checkpoint

▸ **checkpoint**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateAccess](StateAccess.md).[checkpoint](StateAccess.md#checkpoint)

#### Defined in

[interface.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L26)

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

[StateAccess](StateAccess.md).[clearContractStorage](StateAccess.md#clearcontractstorage)

#### Defined in

[interface.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L25)

___

### commit

▸ **commit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateAccess](StateAccess.md).[commit](StateAccess.md#commit)

#### Defined in

[interface.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L27)

___

### copy

▸ **copy**(): [`StateManager`](StateManager.md)

#### Returns

[`StateManager`](StateManager.md)

#### Defined in

[interface.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L37)

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

[StateAccess](StateAccess.md).[deleteAccount](StateAccess.md#deleteaccount)

#### Defined in

[interface.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L19)

___

### dumpStorage

▸ **dumpStorage**(`address`): `Promise`<`StorageDump`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`StorageDump`\>

#### Defined in

[interface.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L39)

___

### flush

▸ **flush**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[interface.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L38)

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

[StateAccess](StateAccess.md).[getAccount](StateAccess.md#getaccount)

#### Defined in

[interface.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L16)

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

[StateAccess](StateAccess.md).[getContractCode](StateAccess.md#getcontractcode)

#### Defined in

[interface.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L22)

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

[StateAccess](StateAccess.md).[getContractStorage](StateAccess.md#getcontractstorage)

#### Defined in

[interface.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L23)

___

### getProof

▸ `Optional` **getProof**(`address`, `storageSlots`): `Promise`<[`Proof`](../README.md#proof)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `storageSlots` | `Buffer`[] |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

#### Inherited from

[StateAccess](StateAccess.md).[getProof](StateAccess.md#getproof)

#### Defined in

[interface.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L31)

___

### getStateRoot

▸ **getStateRoot**(): `Promise`<`Buffer`\>

#### Returns

`Promise`<`Buffer`\>

#### Inherited from

[StateAccess](StateAccess.md).[getStateRoot](StateAccess.md#getstateroot)

#### Defined in

[interface.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L29)

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

[StateAccess](StateAccess.md).[hasStateRoot](StateAccess.md#hasstateroot)

#### Defined in

[interface.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L33)

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

[StateAccess](StateAccess.md).[modifyAccountFields](StateAccess.md#modifyaccountfields)

#### Defined in

[interface.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L20)

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

[StateAccess](StateAccess.md).[putAccount](StateAccess.md#putaccount)

#### Defined in

[interface.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L17)

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

[StateAccess](StateAccess.md).[putContractCode](StateAccess.md#putcontractcode)

#### Defined in

[interface.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L21)

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

[StateAccess](StateAccess.md).[putContractStorage](StateAccess.md#putcontractstorage)

#### Defined in

[interface.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L24)

___

### revert

▸ **revert**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[StateAccess](StateAccess.md).[revert](StateAccess.md#revert)

#### Defined in

[interface.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L28)

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

[StateAccess](StateAccess.md).[setStateRoot](StateAccess.md#setstateroot)

#### Defined in

[interface.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L30)

___

### verifyProof

▸ `Optional` **verifyProof**(`proof`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `proof` | [`Proof`](../README.md#proof) |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

[StateAccess](StateAccess.md).[verifyProof](StateAccess.md#verifyproof)

#### Defined in

[interface.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L32)
