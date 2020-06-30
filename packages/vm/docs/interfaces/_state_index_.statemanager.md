[@ethereumjs/vm](../README.md) › ["state/index"](../modules/_state_index_.md) › [StateManager](_state_index_.statemanager.md)

# Interface: StateManager

## Hierarchy

* **StateManager**

## Implemented by

* [DefaultStateManager](../classes/_state_index_.defaultstatemanager.md)
* [DefaultStateManager](../classes/_state_statemanager_.defaultstatemanager.md)

## Index

### Methods

* [accountIsEmpty](_state_index_.statemanager.md#accountisempty)
* [checkpoint](_state_index_.statemanager.md#checkpoint)
* [cleanupTouchedAccounts](_state_index_.statemanager.md#cleanuptouchedaccounts)
* [clearContractStorage](_state_index_.statemanager.md#clearcontractstorage)
* [commit](_state_index_.statemanager.md#commit)
* [copy](_state_index_.statemanager.md#copy)
* [dumpStorage](_state_index_.statemanager.md#dumpstorage)
* [generateCanonicalGenesis](_state_index_.statemanager.md#generatecanonicalgenesis)
* [generateGenesis](_state_index_.statemanager.md#generategenesis)
* [getAccount](_state_index_.statemanager.md#getaccount)
* [getContractCode](_state_index_.statemanager.md#getcontractcode)
* [getContractStorage](_state_index_.statemanager.md#getcontractstorage)
* [getOriginalContractStorage](_state_index_.statemanager.md#getoriginalcontractstorage)
* [getStateRoot](_state_index_.statemanager.md#getstateroot)
* [hasGenesisState](_state_index_.statemanager.md#hasgenesisstate)
* [putAccount](_state_index_.statemanager.md#putaccount)
* [putContractCode](_state_index_.statemanager.md#putcontractcode)
* [putContractStorage](_state_index_.statemanager.md#putcontractstorage)
* [revert](_state_index_.statemanager.md#revert)
* [setStateRoot](_state_index_.statemanager.md#setstateroot)
* [touchAccount](_state_index_.statemanager.md#touchaccount)

## Methods

###  accountIsEmpty

▸ **accountIsEmpty**(`address`: Buffer): *Promise‹boolean›*

*Defined in [state/interface.ts:30](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |

**Returns:** *Promise‹boolean›*

___

###  checkpoint

▸ **checkpoint**(): *Promise‹void›*

*Defined in [state/interface.ts:21](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L21)*

**Returns:** *Promise‹void›*

___

###  cleanupTouchedAccounts

▸ **cleanupTouchedAccounts**(): *Promise‹void›*

*Defined in [state/interface.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L31)*

**Returns:** *Promise‹void›*

___

###  clearContractStorage

▸ **clearContractStorage**(`address`: Buffer): *Promise‹void›*

*Defined in [state/interface.ts:20](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |

**Returns:** *Promise‹void›*

___

###  commit

▸ **commit**(): *Promise‹void›*

*Defined in [state/interface.ts:22](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L22)*

**Returns:** *Promise‹void›*

___

###  copy

▸ **copy**(): *[StateManager](_state_index_.statemanager.md)*

*Defined in [state/interface.ts:11](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L11)*

**Returns:** *[StateManager](_state_index_.statemanager.md)*

___

###  dumpStorage

▸ **dumpStorage**(`address`: Buffer): *Promise‹[StorageDump](_state_interface_.storagedump.md)›*

*Defined in [state/interface.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |

**Returns:** *Promise‹[StorageDump](_state_interface_.storagedump.md)›*

___

###  generateCanonicalGenesis

▸ **generateCanonicalGenesis**(): *Promise‹void›*

*Defined in [state/interface.ts:28](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L28)*

**Returns:** *Promise‹void›*

___

###  generateGenesis

▸ **generateGenesis**(`initState`: any): *Promise‹void›*

*Defined in [state/interface.ts:29](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`initState` | any |

**Returns:** *Promise‹void›*

___

###  getAccount

▸ **getAccount**(`address`: Buffer): *Promise‹Account›*

*Defined in [state/interface.ts:12](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |

**Returns:** *Promise‹Account›*

___

###  getContractCode

▸ **getContractCode**(`address`: Buffer): *Promise‹Buffer›*

*Defined in [state/interface.ts:16](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |

**Returns:** *Promise‹Buffer›*

___

###  getContractStorage

▸ **getContractStorage**(`address`: Buffer, `key`: Buffer): *Promise‹Buffer›*

*Defined in [state/interface.ts:17](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |
`key` | Buffer |

**Returns:** *Promise‹Buffer›*

___

###  getOriginalContractStorage

▸ **getOriginalContractStorage**(`address`: Buffer, `key`: Buffer): *Promise‹Buffer›*

*Defined in [state/interface.ts:18](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |
`key` | Buffer |

**Returns:** *Promise‹Buffer›*

___

###  getStateRoot

▸ **getStateRoot**(): *Promise‹Buffer›*

*Defined in [state/interface.ts:24](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L24)*

**Returns:** *Promise‹Buffer›*

___

###  hasGenesisState

▸ **hasGenesisState**(): *Promise‹boolean›*

*Defined in [state/interface.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L27)*

**Returns:** *Promise‹boolean›*

___

###  putAccount

▸ **putAccount**(`address`: Buffer, `account`: Account): *Promise‹void›*

*Defined in [state/interface.ts:13](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |
`account` | Account |

**Returns:** *Promise‹void›*

___

###  putContractCode

▸ **putContractCode**(`address`: Buffer, `value`: Buffer): *Promise‹void›*

*Defined in [state/interface.ts:15](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |
`value` | Buffer |

**Returns:** *Promise‹void›*

___

###  putContractStorage

▸ **putContractStorage**(`address`: Buffer, `key`: Buffer, `value`: Buffer): *Promise‹void›*

*Defined in [state/interface.ts:19](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |
`key` | Buffer |
`value` | Buffer |

**Returns:** *Promise‹void›*

___

###  revert

▸ **revert**(): *Promise‹void›*

*Defined in [state/interface.ts:23](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L23)*

**Returns:** *Promise‹void›*

___

###  setStateRoot

▸ **setStateRoot**(`stateRoot`: Buffer): *Promise‹void›*

*Defined in [state/interface.ts:25](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`stateRoot` | Buffer |

**Returns:** *Promise‹void›*

___

###  touchAccount

▸ **touchAccount**(`address`: Buffer): *void*

*Defined in [state/interface.ts:14](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/lib/state/interface.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer |

**Returns:** *void*
