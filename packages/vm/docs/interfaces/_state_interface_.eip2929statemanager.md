[@ethereumjs/vm](../README.md) › ["state/interface"](../modules/_state_interface_.md) › [EIP2929StateManager](_state_interface_.eip2929statemanager.md)

# Interface: EIP2929StateManager

## Hierarchy

* [StateManager](_state_index_.statemanager.md)

  ↳ **EIP2929StateManager**

## Index

### Methods

* [accountExists](_state_interface_.eip2929statemanager.md#accountexists)
* [accountIsEmpty](_state_interface_.eip2929statemanager.md#accountisempty)
* [addWarmedAddress](_state_interface_.eip2929statemanager.md#addwarmedaddress)
* [addWarmedStorage](_state_interface_.eip2929statemanager.md#addwarmedstorage)
* [checkpoint](_state_interface_.eip2929statemanager.md#checkpoint)
* [cleanupTouchedAccounts](_state_interface_.eip2929statemanager.md#cleanuptouchedaccounts)
* [clearContractStorage](_state_interface_.eip2929statemanager.md#clearcontractstorage)
* [clearOriginalStorageCache](_state_interface_.eip2929statemanager.md#clearoriginalstoragecache)
* [clearWarmedAccounts](_state_interface_.eip2929statemanager.md#clearwarmedaccounts)
* [commit](_state_interface_.eip2929statemanager.md#commit)
* [copy](_state_interface_.eip2929statemanager.md#copy)
* [deleteAccount](_state_interface_.eip2929statemanager.md#deleteaccount)
* [dumpStorage](_state_interface_.eip2929statemanager.md#dumpstorage)
* [generateAccessList](_state_interface_.eip2929statemanager.md#optional-generateaccesslist)
* [generateCanonicalGenesis](_state_interface_.eip2929statemanager.md#generatecanonicalgenesis)
* [generateGenesis](_state_interface_.eip2929statemanager.md#generategenesis)
* [getAccount](_state_interface_.eip2929statemanager.md#getaccount)
* [getContractCode](_state_interface_.eip2929statemanager.md#getcontractcode)
* [getContractStorage](_state_interface_.eip2929statemanager.md#getcontractstorage)
* [getOriginalContractStorage](_state_interface_.eip2929statemanager.md#getoriginalcontractstorage)
* [getStateRoot](_state_interface_.eip2929statemanager.md#getstateroot)
* [hasGenesisState](_state_interface_.eip2929statemanager.md#hasgenesisstate)
* [isWarmedAddress](_state_interface_.eip2929statemanager.md#iswarmedaddress)
* [isWarmedStorage](_state_interface_.eip2929statemanager.md#iswarmedstorage)
* [putAccount](_state_interface_.eip2929statemanager.md#putaccount)
* [putContractCode](_state_interface_.eip2929statemanager.md#putcontractcode)
* [putContractStorage](_state_interface_.eip2929statemanager.md#putcontractstorage)
* [revert](_state_interface_.eip2929statemanager.md#revert)
* [setStateRoot](_state_interface_.eip2929statemanager.md#setstateroot)
* [touchAccount](_state_interface_.eip2929statemanager.md#touchaccount)

## Methods

###  accountExists

▸ **accountExists**(`address`: Address): *Promise‹boolean›*

*Inherited from [StateManager](_state_index_.statemanager.md).[accountExists](_state_index_.statemanager.md#accountexists)*

*Defined in [state/interface.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L33)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹boolean›*

___

###  accountIsEmpty

▸ **accountIsEmpty**(`address`: Address): *Promise‹boolean›*

*Inherited from [StateManager](_state_index_.statemanager.md).[accountIsEmpty](_state_index_.statemanager.md#accountisempty)*

*Defined in [state/interface.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹boolean›*

___

###  addWarmedAddress

▸ **addWarmedAddress**(`address`: Buffer): *void*

*Defined in [state/interface.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L39)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |

**Returns:** *void*

___

###  addWarmedStorage

▸ **addWarmedStorage**(`address`: Buffer, `slot`: Buffer): *void*

*Defined in [state/interface.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L41)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |
`slot` | Buffer |

**Returns:** *void*

___

###  checkpoint

▸ **checkpoint**(): *Promise‹void›*

*Inherited from [StateManager](_state_index_.statemanager.md).[checkpoint](_state_index_.statemanager.md#checkpoint)*

*Defined in [state/interface.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L23)*

**Returns:** *Promise‹void›*

___

###  cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(): *Promise‹void›*

*Inherited from [StateManager](_state_index_.statemanager.md).[cleanupTouchedAccounts](_state_index_.statemanager.md#cleanuptouchedaccounts)*

*Defined in [state/interface.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L34)*

**Returns:** *Promise‹void›*

___

###  clearContractStorage

▸ **clearContractStorage**(`address`: Address): *Promise‹void›*

*Inherited from [StateManager](_state_index_.statemanager.md).[clearContractStorage](_state_index_.statemanager.md#clearcontractstorage)*

*Defined in [state/interface.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L22)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹void›*

___

###  clearOriginalStorageCache

▸ **clearOriginalStorageCache**(): *void*

*Inherited from [StateManager](_state_index_.statemanager.md).[clearOriginalStorageCache](_state_index_.statemanager.md#clearoriginalstoragecache)*

*Defined in [state/interface.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L35)*

**Returns:** *void*

___

###  clearWarmedAccounts

▸ **clearWarmedAccounts**(): *void*

*Defined in [state/interface.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L43)*

**Returns:** *void*

___

###  commit

▸ **commit**(): *Promise‹void›*

*Inherited from [StateManager](_state_index_.statemanager.md).[commit](_state_index_.statemanager.md#commit)*

*Defined in [state/interface.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L24)*

**Returns:** *Promise‹void›*

___

###  copy

▸ **copy**(): *[StateManager](_state_index_.statemanager.md)*

*Inherited from [StateManager](_state_index_.statemanager.md).[copy](_state_index_.statemanager.md#copy)*

*Defined in [state/interface.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L12)*

**Returns:** *[StateManager](_state_index_.statemanager.md)*

___

###  deleteAccount

▸ **deleteAccount**(`address`: Address): *Promise‹void›*

*Inherited from [StateManager](_state_index_.statemanager.md).[deleteAccount](_state_index_.statemanager.md#deleteaccount)*

*Defined in [state/interface.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹void›*

___

###  dumpStorage

▸ **dumpStorage**(`address`: Address): *Promise‹[StorageDump](_state_interface_.storagedump.md)›*

*Inherited from [StateManager](_state_index_.statemanager.md).[dumpStorage](_state_index_.statemanager.md#dumpstorage)*

*Defined in [state/interface.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹[StorageDump](_state_interface_.storagedump.md)›*

___

### `Optional` generateAccessList

▸ **generateAccessList**(`addressesRemoved`: Address[], `addressesOnlyStorage`: Address[]): *AccessList*

*Defined in [state/interface.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`addressesRemoved` | Address[] |
`addressesOnlyStorage` | Address[] |

**Returns:** *AccessList*

___

###  generateCanonicalGenesis

▸ **generateCanonicalGenesis**(): *Promise‹void›*

*Inherited from [StateManager](_state_index_.statemanager.md).[generateCanonicalGenesis](_state_index_.statemanager.md#generatecanonicalgenesis)*

*Defined in [state/interface.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L30)*

**Returns:** *Promise‹void›*

___

###  generateGenesis

▸ **generateGenesis**(`initState`: any): *Promise‹void›*

*Inherited from [StateManager](_state_index_.statemanager.md).[generateGenesis](_state_index_.statemanager.md#generategenesis)*

*Defined in [state/interface.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`initState` | any |

**Returns:** *Promise‹void›*

___

###  getAccount

▸ **getAccount**(`address`: Address): *Promise‹Account›*

*Inherited from [StateManager](_state_index_.statemanager.md).[getAccount](_state_index_.statemanager.md#getaccount)*

*Defined in [state/interface.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹Account›*

___

###  getContractCode

▸ **getContractCode**(`address`: Address): *Promise‹Buffer›*

*Inherited from [StateManager](_state_index_.statemanager.md).[getContractCode](_state_index_.statemanager.md#getcontractcode)*

*Defined in [state/interface.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹Buffer›*

___

###  getContractStorage

▸ **getContractStorage**(`address`: Address, `key`: Buffer): *Promise‹Buffer›*

*Inherited from [StateManager](_state_index_.statemanager.md).[getContractStorage](_state_index_.statemanager.md#getcontractstorage)*

*Defined in [state/interface.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |
`key` | Buffer |

**Returns:** *Promise‹Buffer›*

___

###  getOriginalContractStorage

▸ **getOriginalContractStorage**(`address`: Address, `key`: Buffer): *Promise‹Buffer›*

*Inherited from [StateManager](_state_index_.statemanager.md).[getOriginalContractStorage](_state_index_.statemanager.md#getoriginalcontractstorage)*

*Defined in [state/interface.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |
`key` | Buffer |

**Returns:** *Promise‹Buffer›*

___

###  getStateRoot

▸ **getStateRoot**(`force?`: undefined | false | true): *Promise‹Buffer›*

*Inherited from [StateManager](_state_index_.statemanager.md).[getStateRoot](_state_index_.statemanager.md#getstateroot)*

*Defined in [state/interface.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`force?` | undefined &#124; false &#124; true |

**Returns:** *Promise‹Buffer›*

___

###  hasGenesisState

▸ **hasGenesisState**(): *Promise‹boolean›*

*Inherited from [StateManager](_state_index_.statemanager.md).[hasGenesisState](_state_index_.statemanager.md#hasgenesisstate)*

*Defined in [state/interface.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L29)*

**Returns:** *Promise‹boolean›*

___

###  isWarmedAddress

▸ **isWarmedAddress**(`address`: Buffer): *boolean*

*Defined in [state/interface.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |

**Returns:** *boolean*

___

###  isWarmedStorage

▸ **isWarmedStorage**(`address`: Buffer, `slot`: Buffer): *boolean*

*Defined in [state/interface.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |
`slot` | Buffer |

**Returns:** *boolean*

___

###  putAccount

▸ **putAccount**(`address`: Address, `account`: Account): *Promise‹void›*

*Inherited from [StateManager](_state_index_.statemanager.md).[putAccount](_state_index_.statemanager.md#putaccount)*

*Defined in [state/interface.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |
`account` | Account |

**Returns:** *Promise‹void›*

___

###  putContractCode

▸ **putContractCode**(`address`: Address, `value`: Buffer): *Promise‹void›*

*Inherited from [StateManager](_state_index_.statemanager.md).[putContractCode](_state_index_.statemanager.md#putcontractcode)*

*Defined in [state/interface.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |
`value` | Buffer |

**Returns:** *Promise‹void›*

___

###  putContractStorage

▸ **putContractStorage**(`address`: Address, `key`: Buffer, `value`: Buffer): *Promise‹void›*

*Inherited from [StateManager](_state_index_.statemanager.md).[putContractStorage](_state_index_.statemanager.md#putcontractstorage)*

*Defined in [state/interface.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |
`key` | Buffer |
`value` | Buffer |

**Returns:** *Promise‹void›*

___

###  revert

▸ **revert**(): *Promise‹void›*

*Inherited from [StateManager](_state_index_.statemanager.md).[revert](_state_index_.statemanager.md#revert)*

*Defined in [state/interface.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L25)*

**Returns:** *Promise‹void›*

___

###  setStateRoot

▸ **setStateRoot**(`stateRoot`: Buffer): *Promise‹void›*

*Inherited from [StateManager](_state_index_.statemanager.md).[setStateRoot](_state_index_.statemanager.md#setstateroot)*

*Defined in [state/interface.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`stateRoot` | Buffer |

**Returns:** *Promise‹void›*

___

###  touchAccount

▸ **touchAccount**(`address`: Address): *void*

*Inherited from [StateManager](_state_index_.statemanager.md).[touchAccount](_state_index_.statemanager.md#touchaccount)*

*Defined in [state/interface.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/state/interface.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *void*
