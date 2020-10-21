[@ethereumjs/vm](../README.md) › ["tests/util"](_tests_util_.md)

# Module: "tests/util"

## Index

### Functions

* [dumpState](_tests_util_.md#dumpstate)
* [getDAOCommon](_tests_util_.md#getdaocommon)
* [getRequiredForkConfigAlias](_tests_util_.md#getrequiredforkconfigalias)
* [isRunningInKarma](_tests_util_.md#isrunninginkarma)
* [makeBlockFromEnv](_tests_util_.md#makeblockfromenv)
* [makeBlockHeader](_tests_util_.md#makeblockheader)
* [makeTx](_tests_util_.md#maketx)
* [setupPreConditions](_tests_util_.md#setuppreconditions)
* [verifyAccountPostConditions](_tests_util_.md#verifyaccountpostconditions)
* [verifyGas](_tests_util_.md#verifygas)
* [verifyLogs](_tests_util_.md#verifylogs)
* [verifyPostConditions](_tests_util_.md#verifypostconditions)

## Functions

###  dumpState

▸ **dumpState**(`state`: any, `cb`: Function): *void*

*Defined in [tests/util.ts:15](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/util.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | any |
`cb` | Function |

**Returns:** *void*

___

###  getDAOCommon

▸ **getDAOCommon**(`activationBlock`: number): *Common‹›*

*Defined in [tests/util.ts:366](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/util.ts#L366)*

Returns a DAO common which has a different activation block than the default block

**Parameters:**

Name | Type |
------ | ------ |
`activationBlock` | number |

**Returns:** *Common‹›*

___

###  getRequiredForkConfigAlias

▸ **getRequiredForkConfigAlias**(`forkConfig`: string): *string*

*Defined in [tests/util.ts:343](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/util.ts#L343)*

Returns an alias for specified hardforks to meet test dependencies requirements/assumptions.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`forkConfig` | string | the name of the hardfork for which an alias should be returned |

**Returns:** *string*

Either an alias of the forkConfig param, or the forkConfig param itself

___

###  isRunningInKarma

▸ **isRunningInKarma**(): *any*

*Defined in [tests/util.ts:359](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/util.ts#L359)*

Checks if in a karma test runner.

**Returns:** *any*

is running in karma

___

###  makeBlockFromEnv

▸ **makeBlockFromEnv**(`env`: any, `opts`: BlockOptions): *Block*

*Defined in [tests/util.ts:288](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/util.ts#L288)*

makeBlockFromEnv - helper to create a block from the env object in tests repo

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`env` | any | - | object from tests repo |
`opts` | BlockOptions | {} | - |

**Returns:** *Block*

the block

___

###  makeBlockHeader

▸ **makeBlockHeader**(`data`: any, `opts`: BlockOptions): *BlockHeader‹›*

*Defined in [tests/util.ts:261](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/util.ts#L261)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`data` | any | - |
`opts` | BlockOptions | {} |

**Returns:** *BlockHeader‹›*

___

###  makeTx

▸ **makeTx**(`txData`: any, `opts`: TxOptions): *Transaction‹›*

*Defined in [tests/util.ts:101](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/util.ts#L101)*

Make a tx using JSON from tests repo

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`txData` | any | - | The tx object from tests repo |
`opts` | TxOptions | {} | Tx opts that can include an @ethereumjs/common object |

**Returns:** *Transaction‹›*

Transaction to be passed to VM.runTx function

___

###  setupPreConditions

▸ **setupPreConditions**(`state`: any, `testData`: any): *Promise‹void›*

*Defined in [tests/util.ts:298](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/util.ts#L298)*

setupPreConditions given JSON testData

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | any | the state DB/trie |
`testData` | any | JSON from tests repo  |

**Returns:** *Promise‹void›*

___

###  verifyAccountPostConditions

▸ **verifyAccountPostConditions**(`state`: any, `address`: string, `account`: Account, `acctData`: any, `t`: Test): *Promise‹unknown›*

*Defined in [tests/util.ts:162](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/util.ts#L162)*

verifyAccountPostConditions using JSON from tests repo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | any | DB/trie |
`address` | string | Account Address |
`account` | Account | to verify |
`acctData` | any | postconditions JSON from tests repo  |
`t` | Test | - |

**Returns:** *Promise‹unknown›*

___

###  verifyGas

▸ **verifyGas**(`results`: any, `testData`: any, `t`: Test): *void*

*Defined in [tests/util.ts:225](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/util.ts#L225)*

verifyGas by computing the difference of coinbase account balance

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`results` | any | to verify |
`testData` | any | from tests repo  |
`t` | Test | - |

**Returns:** *void*

___

###  verifyLogs

▸ **verifyLogs**(`logs`: any, `testData`: any, `t`: Test): *void*

*Defined in [tests/util.ts:248](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/util.ts#L248)*

verifyLogs

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`logs` | any | to verify |
`testData` | any | from tests repo  |
`t` | Test | - |

**Returns:** *void*

___

###  verifyPostConditions

▸ **verifyPostConditions**(`state`: any, `testData`: any, `t`: Test): *Promise‹unknown›*

*Defined in [tests/util.ts:112](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/util.ts#L112)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | any |
`testData` | any |
`t` | Test |

**Returns:** *Promise‹unknown›*
