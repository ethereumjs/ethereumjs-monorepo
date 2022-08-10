[@ethereumjs/statemanager](../README.md) / StateAccess

# Interface: StateAccess

## Hierarchy

- **`StateAccess`**

  ↳ [`StateManager`](StateManager.md)

## Table of contents

### Methods

- [accountExists](StateAccess.md#accountexists)
- [accountIsEmpty](StateAccess.md#accountisempty)
- [checkpoint](StateAccess.md#checkpoint)
- [clearContractStorage](StateAccess.md#clearcontractstorage)
- [commit](StateAccess.md#commit)
- [deleteAccount](StateAccess.md#deleteaccount)
- [getAccount](StateAccess.md#getaccount)
- [getContractCode](StateAccess.md#getcontractcode)
- [getContractStorage](StateAccess.md#getcontractstorage)
- [getProof](StateAccess.md#getproof)
- [getStateRoot](StateAccess.md#getstateroot)
- [hasStateRoot](StateAccess.md#hasstateroot)
- [modifyAccountFields](StateAccess.md#modifyaccountfields)
- [putAccount](StateAccess.md#putaccount)
- [putContractCode](StateAccess.md#putcontractcode)
- [putContractStorage](StateAccess.md#putcontractstorage)
- [revert](StateAccess.md#revert)
- [setStateRoot](StateAccess.md#setstateroot)
- [verifyProof](StateAccess.md#verifyproof)

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

#### Defined in

[interface.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L18)

___

### checkpoint

▸ **checkpoint**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

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

#### Defined in

[interface.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L25)

___

### commit

▸ **commit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[interface.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L27)

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

[interface.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L19)

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

#### Defined in

[interface.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L31)

___

### getStateRoot

▸ **getStateRoot**(): `Promise`<`Buffer`\>

#### Returns

`Promise`<`Buffer`\>

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

#### Defined in

[interface.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L24)

___

### revert

▸ **revert**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

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

#### Defined in

[interface.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/interface.ts#L32)
