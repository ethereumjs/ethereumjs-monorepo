[@ethereumjs/vm](../README.md) › ["lib/state/interface"](../modules/_lib_state_interface_.md) › [StateManager](_lib_state_interface_.statemanager.md)

# Interface: StateManager

## Hierarchy

* **StateManager**

## Index

### Methods

* [accountExists](_lib_state_interface_.statemanager.md#accountexists)
* [accountIsEmpty](_lib_state_interface_.statemanager.md#accountisempty)
* [checkpoint](_lib_state_interface_.statemanager.md#checkpoint)
* [cleanupTouchedAccounts](_lib_state_interface_.statemanager.md#cleanuptouchedaccounts)
* [clearContractStorage](_lib_state_interface_.statemanager.md#clearcontractstorage)
* [clearOriginalStorageCache](_lib_state_interface_.statemanager.md#clearoriginalstoragecache)
* [commit](_lib_state_interface_.statemanager.md#commit)
* [copy](_lib_state_interface_.statemanager.md#copy)
* [deleteAccount](_lib_state_interface_.statemanager.md#deleteaccount)
* [dumpStorage](_lib_state_interface_.statemanager.md#dumpstorage)
* [generateCanonicalGenesis](_lib_state_interface_.statemanager.md#generatecanonicalgenesis)
* [generateGenesis](_lib_state_interface_.statemanager.md#generategenesis)
* [getAccount](_lib_state_interface_.statemanager.md#getaccount)
* [getContractCode](_lib_state_interface_.statemanager.md#getcontractcode)
* [getContractStorage](_lib_state_interface_.statemanager.md#getcontractstorage)
* [getOriginalContractStorage](_lib_state_interface_.statemanager.md#getoriginalcontractstorage)
* [getStateRoot](_lib_state_interface_.statemanager.md#getstateroot)
* [hasGenesisState](_lib_state_interface_.statemanager.md#hasgenesisstate)
* [putAccount](_lib_state_interface_.statemanager.md#putaccount)
* [putContractCode](_lib_state_interface_.statemanager.md#putcontractcode)
* [putContractStorage](_lib_state_interface_.statemanager.md#putcontractstorage)
* [revert](_lib_state_interface_.statemanager.md#revert)
* [setStateRoot](_lib_state_interface_.statemanager.md#setstateroot)
* [touchAccount](_lib_state_interface_.statemanager.md#touchaccount)

## Methods

###  accountExists

▸ **accountExists**(`address`: Address): *Promise‹boolean›*

*Defined in [lib/state/interface.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹boolean›*

___

###  accountIsEmpty

▸ **accountIsEmpty**(`address`: Address): *Promise‹boolean›*

*Defined in [lib/state/interface.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹boolean›*

___

###  checkpoint

▸ **checkpoint**(): *Promise‹void›*

*Defined in [lib/state/interface.ts:22](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L22)*

**Returns:** *Promise‹void›*

___

###  cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(): *Promise‹void›*

*Defined in [lib/state/interface.ts:33](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L33)*

**Returns:** *Promise‹void›*

___

###  clearContractStorage

▸ **clearContractStorage**(`address`: Address): *Promise‹void›*

*Defined in [lib/state/interface.ts:21](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹void›*

___

###  clearOriginalStorageCache

▸ **clearOriginalStorageCache**(): *void*

*Defined in [lib/state/interface.ts:34](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L34)*

**Returns:** *void*

___

###  commit

▸ **commit**(): *Promise‹void›*

*Defined in [lib/state/interface.ts:23](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L23)*

**Returns:** *Promise‹void›*

___

###  copy

▸ **copy**(): *[StateManager](_lib_state_index_.statemanager.md)*

*Defined in [lib/state/interface.ts:11](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L11)*

**Returns:** *[StateManager](_lib_state_index_.statemanager.md)*

___

###  deleteAccount

▸ **deleteAccount**(`address`: Address): *Promise‹void›*

*Defined in [lib/state/interface.ts:14](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹void›*

___

###  dumpStorage

▸ **dumpStorage**(`address`: Address): *Promise‹[StorageDump](_lib_state_interface_.storagedump.md)›*

*Defined in [lib/state/interface.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹[StorageDump](_lib_state_interface_.storagedump.md)›*

___

###  generateCanonicalGenesis

▸ **generateCanonicalGenesis**(): *Promise‹void›*

*Defined in [lib/state/interface.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L29)*

**Returns:** *Promise‹void›*

___

###  generateGenesis

▸ **generateGenesis**(`initState`: any): *Promise‹void›*

*Defined in [lib/state/interface.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`initState` | any |

**Returns:** *Promise‹void›*

___

###  getAccount

▸ **getAccount**(`address`: Address): *Promise‹Account›*

*Defined in [lib/state/interface.ts:12](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹Account›*

___

###  getContractCode

▸ **getContractCode**(`address`: Address): *Promise‹Buffer›*

*Defined in [lib/state/interface.ts:17](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *Promise‹Buffer›*

___

###  getContractStorage

▸ **getContractStorage**(`address`: Address, `key`: Buffer): *Promise‹Buffer›*

*Defined in [lib/state/interface.ts:18](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |
`key` | Buffer |

**Returns:** *Promise‹Buffer›*

___

###  getOriginalContractStorage

▸ **getOriginalContractStorage**(`address`: Address, `key`: Buffer): *Promise‹Buffer›*

*Defined in [lib/state/interface.ts:19](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |
`key` | Buffer |

**Returns:** *Promise‹Buffer›*

___

###  getStateRoot

▸ **getStateRoot**(`force?`: undefined | false | true): *Promise‹Buffer›*

*Defined in [lib/state/interface.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`force?` | undefined &#124; false &#124; true |

**Returns:** *Promise‹Buffer›*

___

###  hasGenesisState

▸ **hasGenesisState**(): *Promise‹boolean›*

*Defined in [lib/state/interface.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L28)*

**Returns:** *Promise‹boolean›*

___

###  putAccount

▸ **putAccount**(`address`: Address, `account`: Account): *Promise‹void›*

*Defined in [lib/state/interface.ts:13](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |
`account` | Account |

**Returns:** *Promise‹void›*

___

###  putContractCode

▸ **putContractCode**(`address`: Address, `value`: Buffer): *Promise‹void›*

*Defined in [lib/state/interface.ts:16](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |
`value` | Buffer |

**Returns:** *Promise‹void›*

___

###  putContractStorage

▸ **putContractStorage**(`address`: Address, `key`: Buffer, `value`: Buffer): *Promise‹void›*

*Defined in [lib/state/interface.ts:20](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L20)*

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

*Defined in [lib/state/interface.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L24)*

**Returns:** *Promise‹void›*

___

###  setStateRoot

▸ **setStateRoot**(`stateRoot`: Buffer): *Promise‹void›*

*Defined in [lib/state/interface.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`stateRoot` | Buffer |

**Returns:** *Promise‹void›*

___

###  touchAccount

▸ **touchAccount**(`address`: Address): *void*

*Defined in [lib/state/interface.ts:15](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Address |

**Returns:** *void*
