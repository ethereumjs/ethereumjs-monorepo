[@ethereumjs/evm](../README.md) / EEIInterface

# Interface: EEIInterface

API for an EEI (Ethereum Environment Interface) implementation

This can be used to connect the EVM to different (chain) environments.
An implementation for an EEI to connect to an Ethereum execution chain
environment (`mainnet`, `sepolia`,...) can be found in the
`@ethereumjs/vm` package.

## Hierarchy

- [`EVMStateAccess`](EVMStateAccess.md)

  ↳ **`EEIInterface`**

## Table of contents

### Methods

- [accountExists](EEIInterface.md#accountexists)
- [accountIsEmpty](EEIInterface.md#accountisempty)
- [addWarmedAddress](EEIInterface.md#addwarmedaddress)
- [addWarmedStorage](EEIInterface.md#addwarmedstorage)
- [checkpoint](EEIInterface.md#checkpoint)
- [cleanupTouchedAccounts](EEIInterface.md#cleanuptouchedaccounts)
- [clearContractStorage](EEIInterface.md#clearcontractstorage)
- [clearOriginalStorageCache](EEIInterface.md#clearoriginalstoragecache)
- [clearWarmedAccounts](EEIInterface.md#clearwarmedaccounts)
- [commit](EEIInterface.md#commit)
- [copy](EEIInterface.md#copy)
- [deleteAccount](EEIInterface.md#deleteaccount)
- [generateAccessList](EEIInterface.md#generateaccesslist)
- [generateCanonicalGenesis](EEIInterface.md#generatecanonicalgenesis)
- [getAccount](EEIInterface.md#getaccount)
- [getBlockHash](EEIInterface.md#getblockhash)
- [getContractCode](EEIInterface.md#getcontractcode)
- [getContractStorage](EEIInterface.md#getcontractstorage)
- [getProof](EEIInterface.md#getproof)
- [getStateRoot](EEIInterface.md#getstateroot)
- [hasStateRoot](EEIInterface.md#hasstateroot)
- [isWarmedAddress](EEIInterface.md#iswarmedaddress)
- [isWarmedStorage](EEIInterface.md#iswarmedstorage)
- [modifyAccountFields](EEIInterface.md#modifyaccountfields)
- [putAccount](EEIInterface.md#putaccount)
- [putContractCode](EEIInterface.md#putcontractcode)
- [putContractStorage](EEIInterface.md#putcontractstorage)
- [revert](EEIInterface.md#revert)
- [setStateRoot](EEIInterface.md#setstateroot)
- [storageLoad](EEIInterface.md#storageload)
- [storageStore](EEIInterface.md#storagestore)
- [verifyProof](EEIInterface.md#verifyproof)

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

[EVMStateAccess](EVMStateAccess.md).[accountExists](EVMStateAccess.md#accountexists)

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

[EVMStateAccess](EVMStateAccess.md).[accountIsEmpty](EVMStateAccess.md#accountisempty)

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

#### Inherited from

[EVMStateAccess](EVMStateAccess.md).[addWarmedAddress](EVMStateAccess.md#addwarmedaddress)

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

#### Inherited from

[EVMStateAccess](EVMStateAccess.md).[addWarmedStorage](EVMStateAccess.md#addwarmedstorage)

#### Defined in

[packages/evm/src/types.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L45)

___

### checkpoint

▸ **checkpoint**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[EVMStateAccess](EVMStateAccess.md).[checkpoint](EVMStateAccess.md#checkpoint)

#### Defined in

[packages/evm/src/types.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L262)

___

### cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[EVMStateAccess](EVMStateAccess.md).[cleanupTouchedAccounts](EVMStateAccess.md#cleanuptouchedaccounts)

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

[EVMStateAccess](EVMStateAccess.md).[clearContractStorage](EVMStateAccess.md#clearcontractstorage)

#### Defined in

[packages/evm/src/types.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L261)

___

### clearOriginalStorageCache

▸ **clearOriginalStorageCache**(): `void`

#### Returns

`void`

#### Inherited from

[EVMStateAccess](EVMStateAccess.md).[clearOriginalStorageCache](EVMStateAccess.md#clearoriginalstoragecache)

#### Defined in

[packages/evm/src/types.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L49)

___

### clearWarmedAccounts

▸ **clearWarmedAccounts**(): `void`

#### Returns

`void`

#### Inherited from

[EVMStateAccess](EVMStateAccess.md).[clearWarmedAccounts](EVMStateAccess.md#clearwarmedaccounts)

#### Defined in

[packages/evm/src/types.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L47)

___

### commit

▸ **commit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[EVMStateAccess](EVMStateAccess.md).[commit](EVMStateAccess.md#commit)

#### Defined in

[packages/evm/src/types.ts:263](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L263)

___

### copy

▸ **copy**(): [`EEIInterface`](EEIInterface.md)

#### Returns

[`EEIInterface`](EEIInterface.md)

#### Defined in

[packages/evm/src/types.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L32)

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

[EVMStateAccess](EVMStateAccess.md).[deleteAccount](EVMStateAccess.md#deleteaccount)

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

#### Inherited from

[EVMStateAccess](EVMStateAccess.md).[generateAccessList](EVMStateAccess.md#generateaccesslist)

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

#### Inherited from

[EVMStateAccess](EVMStateAccess.md).[generateCanonicalGenesis](EVMStateAccess.md#generatecanonicalgenesis)

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

[EVMStateAccess](EVMStateAccess.md).[getAccount](EVMStateAccess.md#getaccount)

#### Defined in

[packages/evm/src/types.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L252)

___

### getBlockHash

▸ **getBlockHash**(`num`): `Promise`<`bigint`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `num` | `bigint` |

#### Returns

`Promise`<`bigint`\>

#### Defined in

[packages/evm/src/types.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L29)

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

[EVMStateAccess](EVMStateAccess.md).[getContractCode](EVMStateAccess.md#getcontractcode)

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

[EVMStateAccess](EVMStateAccess.md).[getContractStorage](EVMStateAccess.md#getcontractstorage)

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

[EVMStateAccess](EVMStateAccess.md).[getProof](EVMStateAccess.md#getproof)

#### Defined in

[packages/evm/src/types.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L267)

___

### getStateRoot

▸ **getStateRoot**(): `Promise`<`Buffer`\>

#### Returns

`Promise`<`Buffer`\>

#### Inherited from

[EVMStateAccess](EVMStateAccess.md).[getStateRoot](EVMStateAccess.md#getstateroot)

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

[EVMStateAccess](EVMStateAccess.md).[hasStateRoot](EVMStateAccess.md#hasstateroot)

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

#### Inherited from

[EVMStateAccess](EVMStateAccess.md).[isWarmedAddress](EVMStateAccess.md#iswarmedaddress)

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

#### Inherited from

[EVMStateAccess](EVMStateAccess.md).[isWarmedStorage](EVMStateAccess.md#iswarmedstorage)

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

[EVMStateAccess](EVMStateAccess.md).[modifyAccountFields](EVMStateAccess.md#modifyaccountfields)

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

[EVMStateAccess](EVMStateAccess.md).[putAccount](EVMStateAccess.md#putaccount)

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

[EVMStateAccess](EVMStateAccess.md).[putContractCode](EVMStateAccess.md#putcontractcode)

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

[EVMStateAccess](EVMStateAccess.md).[putContractStorage](EVMStateAccess.md#putcontractstorage)

#### Defined in

[packages/evm/src/types.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L260)

___

### revert

▸ **revert**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[EVMStateAccess](EVMStateAccess.md).[revert](EVMStateAccess.md#revert)

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

[EVMStateAccess](EVMStateAccess.md).[setStateRoot](EVMStateAccess.md#setstateroot)

#### Defined in

[packages/evm/src/types.ts:266](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L266)

___

### storageLoad

▸ **storageLoad**(`address`, `key`, `original`): `Promise`<`Buffer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Buffer` |
| `original` | `boolean` |

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[packages/evm/src/types.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L31)

___

### storageStore

▸ **storageStore**(`address`, `key`, `value`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Buffer` |
| `value` | `Buffer` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/evm/src/types.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L30)

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

[EVMStateAccess](EVMStateAccess.md).[verifyProof](EVMStateAccess.md#verifyproof)

#### Defined in

[packages/evm/src/types.ts:268](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L268)
