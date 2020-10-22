[@ethereumjs/vm](../README.md) › ["tests/config"](_tests_config_.md)

# Module: "tests/config"

## Index

### Variables

* [DEFAULT_FORK_CONFIG](_tests_config_.md#const-default_fork_config)
* [SKIP_BROKEN](_tests_config_.md#const-skip_broken)
* [SKIP_PERMANENT](_tests_config_.md#const-skip_permanent)
* [SKIP_SLOW](_tests_config_.md#const-skip_slow)

### Functions

* [getCommon](_tests_config_.md#getcommon)
* [getExpectedTests](_tests_config_.md#getexpectedtests)
* [getRequiredForkConfigAlias](_tests_config_.md#getrequiredforkconfigalias)
* [getSkipTests](_tests_config_.md#getskiptests)
* [getTestDirs](_tests_config_.md#gettestdirs)

## Variables

### `Const` DEFAULT_FORK_CONFIG

• **DEFAULT_FORK_CONFIG**: *"Istanbul"* = "Istanbul"

*Defined in [tests/config.ts:6](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/config.ts#L6)*

Default hardfork rules to run tests against

___

### `Const` SKIP_BROKEN

• **SKIP_BROKEN**: *string[]* = [
  'ForkStressTest', // Only BlockchainTest, temporary till fixed (2020-05-23)
  'ChainAtoChainB', // Only BlockchainTest, temporary, along expectException fixes (2020-05-23)
  'sha3_bigOffset', // SHA3: Only BlockchainTest, unclear SHA3 test situation (2020-05-28) (https://github.com/ethereumjs/ethereumjs-vm/pull/743#issuecomment-635116418)
  'sha3_memSizeNoQuadraticCost', // SHA3: See also:
  'sha3_memSizeQuadraticCost', // SHA3: https://github.com/ethereumjs/ethereumjs-vm/pull/743#issuecomment-635116418
  'sha3_bigSize', // SHA3

  // these tests need "re-org" support in blockchain
  'blockChainFrontierWithLargerTDvsHomesteadBlockchain2_FrontierToHomesteadAt5',
  'blockChainFrontierWithLargerTDvsHomesteadBlockchain_FrontierToHomesteadAt5',
  'HomesteadOverrideFrontier_FrontierToHomesteadAt5',
  'DaoTransactions_HomesteadToDaoAt5',
  'RPC_API_Test',
  'lotsOfBranchesOverrideAtTheEnd',
  'lotsOfBranchesOverrideAtTheMiddle',
  'newChainFrom4Block',
  'newChainFrom5Block',
  'newChainFrom6Block',
  'sideChainWithMoreTransactions',
  'sideChainWithMoreTransactions2',
  'sideChainWithNewMaxDifficultyStartingFromBlock3AfterBlock4',
  'uncleBlockAtBlock3afterBlock4',
]

*Defined in [tests/config.ts:11](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/config.ts#L11)*

Tests which should be fixed

___

### `Const` SKIP_PERMANENT

• **SKIP_PERMANENT**: *string[]* = [
  'SuicidesMixingCoinbase', // sucides to the coinbase, since we run a blockLevel we create coinbase account.
  'static_SuicidesMixingCoinbase', // sucides to the coinbase, since we run a blockLevel we create coinbase account.
  'ForkUncle', // Only BlockchainTest, correct behaviour unspecified (?)
  'UncleFromSideChain', // Only BlockchainTest, same as ForkUncle, the TD is the same for two diffent branches so its not clear which one should be the finally chain
]

*Defined in [tests/config.ts:39](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/config.ts#L39)*

Tests skipped due to system specifics / design considerations

___

### `Const` SKIP_SLOW

• **SKIP_SLOW**: *string[]* = [
  'Call50000',
  'Call50000_ecrec',
  'Call50000_identity',
  'Call50000_identity2',
  'Call50000_sha256',
  'Call50000_rip160',
  'Call50000bytesContract50_1',
  'Call50000bytesContract50_2',
  'Call1MB1024Calldepth',
  'static_Call1MB1024Calldepth',
  'static_Call50000',
  'static_Call50000_ecrec',
  'static_Call50000_identity',
  'static_Call50000_identity2',
  'static_Call50000_rip160',
  'static_Return50000_2',
  'Callcode50000',
  'Return50000',
  'Return50000_2',
  'static_Call50000',
  'static_Call50000_ecrec',
  'static_Call50000_identity',
  'static_Call50000_identity2',
  'static_Call50000_sha256',
  'static_Call50000_rip160',
  'static_Call50000bytesContract50_1',
  'static_Call50000bytesContract50_2',
  'static_Call1MB1024Calldepth',
  'static_Callcode50000',
  'static_Return50000',
  'static_Return50000_2',
  'QuadraticComplexitySolidity_CallDataCopy',
  'CALLBlake2f_MaxRounds',
  'randomStatetest94_Istanbul',
  // vmPerformance tests
  'ackermann',
  'fibonacci',
  'loop-add-10M',
  'loop-divadd-10M',
  'loop-divadd-unr100-10M',
  'loop-exp',
  'loop-mul',
  'manyFunctions100',
]

*Defined in [tests/config.ts:49](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/config.ts#L49)*

tests running slow (run from time to time)

## Functions

###  getCommon

▸ **getCommon**(`network`: string): *Common‹›*

*Defined in [tests/config.ts:256](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/config.ts#L256)*

Returns a Common for the given network (a test parameter)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`network` | string | the network field of a test |

**Returns:** *Common‹›*

the Common which should be used

___

###  getExpectedTests

▸ **getExpectedTests**(`fork`: string, `name`: string): *any*

*Defined in [tests/config.ts:377](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/config.ts#L377)*

Returns the amount of expected tests for a given fork, assuming all tests are ran

**Parameters:**

Name | Type |
------ | ------ |
`fork` | string |
`name` | string |

**Returns:** *any*

___

###  getRequiredForkConfigAlias

▸ **getRequiredForkConfigAlias**(`forkConfig`: string): *string*

*Defined in [tests/config.ts:137](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/config.ts#L137)*

Returns an alias for specified hardforks to meet test dependencies requirements/assumptions.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`forkConfig` | string | the name of the hardfork for which an alias should be returned |

**Returns:** *string*

Either an alias of the forkConfig param, or the forkConfig param itself

___

###  getSkipTests

▸ **getSkipTests**(`choices`: string, `defaultChoice`: string): *string[]*

*Defined in [tests/config.ts:394](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/config.ts#L394)*

Returns an aggregated array with the tests to skip

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`choices` | string | comma-separated list with skip options, e.g. BROKEN,PERMANENT |
`defaultChoice` | string | if to use `NONE` or `ALL` as default choice |

**Returns:** *string[]*

array with test names

___

###  getTestDirs

▸ **getTestDirs**(`network`: string, `testType`: string): *string[]*

*Defined in [tests/config.ts:238](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/vm/tests/config.ts#L238)*

Returns an array of dirs to run tests on

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`network` | string | (fork identifier) |
`testType` | string | - |

**Returns:** *string[]*
