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
- [getAppliedKey](StateManagerInterface.md#getappliedkey)
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

#### Defined in

[interfaces.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L77)

___

### commit

▸ **commit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

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

#### Defined in

[interfaces.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L71)

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

#### Defined in

[interfaces.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L75)

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

[interfaces.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L83)

___

### getStateRoot

▸ **getStateRoot**(): `Promise`<`Uint8Array`\>

#### Returns

`Promise`<`Uint8Array`\>

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

#### Defined in

[interfaces.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L76)

___

### revert

▸ **revert**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

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

#### Defined in

[interfaces.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L82)

___

### shallowCopy

▸ **shallowCopy**(`downlevelCaches?`): [`StateManagerInterface`](StateManagerInterface.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `downlevelCaches?` | `boolean` |

#### Returns

[`StateManagerInterface`](StateManagerInterface.md)

#### Defined in

[interfaces.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L85)
