[@ethereumjs/common](../README.md) / StateManagerInterface

# Interface: StateManagerInterface

## Hierarchy

- **`StateManagerInterface`**

  ↳ [`EVMStateManagerInterface`](EVMStateManagerInterface.md)

## Table of contents

### Methods

- [checkpoint](StateManagerInterface.md#checkpoint)
- [clearContractStorage](StateManagerInterface.md#clearcontractstorage)
- [commit](StateManagerInterface.md#commit)
- [deleteAccount](StateManagerInterface.md#deleteaccount)
- [getAccount](StateManagerInterface.md#getaccount)
- [getContractCode](StateManagerInterface.md#getcontractcode)
- [getContractStorage](StateManagerInterface.md#getcontractstorage)
- [getProof](StateManagerInterface.md#getproof)
- [getStateRoot](StateManagerInterface.md#getstateroot)
- [hasStateRoot](StateManagerInterface.md#hasstateroot)
- [modifyAccountFields](StateManagerInterface.md#modifyaccountfields)
- [putAccount](StateManagerInterface.md#putaccount)
- [putContractCode](StateManagerInterface.md#putcontractcode)
- [putContractStorage](StateManagerInterface.md#putcontractstorage)
- [revert](StateManagerInterface.md#revert)
- [setStateRoot](StateManagerInterface.md#setstateroot)
- [shallowCopy](StateManagerInterface.md#shallowcopy)

## Methods

### checkpoint

▸ **checkpoint**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[interfaces.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L51)

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

[interfaces.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L50)

___

### commit

▸ **commit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[interfaces.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L52)

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

[interfaces.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L44)

___

### getAccount

▸ **getAccount**(`address`): `Promise`<`undefined` \| `Account`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`undefined` \| `Account`\>

#### Defined in

[interfaces.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L42)

___

### getContractCode

▸ **getContractCode**(`address`): `Promise`<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[interfaces.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L47)

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

#### Defined in

[interfaces.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L48)

___

### getProof

▸ `Optional` **getProof**(`address`, `storageSlots`): `Promise`<[`Proof`](../README.md#proof)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `storageSlots` | `Uint8Array`[] |

#### Returns

`Promise`<[`Proof`](../README.md#proof)\>

#### Defined in

[interfaces.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L56)

___

### getStateRoot

▸ **getStateRoot**(): `Promise`<`Uint8Array`\>

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[interfaces.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L54)

___

### hasStateRoot

▸ **hasStateRoot**(`root`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Uint8Array` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[interfaces.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L57)

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

#### Defined in

[interfaces.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L45)

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

#### Defined in

[interfaces.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L43)

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

#### Defined in

[interfaces.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L46)

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

#### Defined in

[interfaces.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L49)

___

### revert

▸ **revert**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[interfaces.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L53)

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

#### Defined in

[interfaces.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L55)

___

### shallowCopy

▸ **shallowCopy**(): [`StateManagerInterface`](StateManagerInterface.md)

#### Returns

[`StateManagerInterface`](StateManagerInterface.md)

#### Defined in

[interfaces.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L58)
