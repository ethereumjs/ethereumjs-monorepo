[@ethereumjs/vm](../README.md) › ["tests/api/utils"](_tests_api_utils_.md)

# Module: "tests/api/utils"

## Index

### Functions

* [createAccount](_tests_api_utils_.md#createaccount)
* [setupVM](_tests_api_utils_.md#setupvm)

## Functions

###  createAccount

▸ **createAccount**(`nonce`: BN, `balance`: BN): *Account‹›*

*Defined in [tests/api/utils.ts:8](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/api/utils.ts#L8)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`nonce` | BN | new BN(0) |
`balance` | BN | new BN(0xfff384) |

**Returns:** *Account‹›*

___

###  setupVM

▸ **setupVM**(`opts`: [VMOpts](../interfaces/_lib_index_.vmopts.md)): *[VM](../classes/_lib_index_.vm.md)‹›*

*Defined in [tests/api/utils.ts:12](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/api/utils.ts#L12)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`opts` | [VMOpts](../interfaces/_lib_index_.vmopts.md) | {} |

**Returns:** *[VM](../classes/_lib_index_.vm.md)‹›*
