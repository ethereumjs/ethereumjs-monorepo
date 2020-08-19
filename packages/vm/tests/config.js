/**
 * Default hardfork rules to run tests against
 */
const DEFAULT_FORK_CONFIG = 'Istanbul'

/**
 * Tests which should be fixed
 */
const SKIP_BROKEN = [
  'ForkStressTest', // Only BlockchainTest, temporary till fixed (2020-05-23)
  'dynamicAccountOverwriteEmpty', // temporary till fixed (2019-01-30), skipped along constantinopleFix work time constraints
  'ChainAtoChainB', // Only BlockchainTest, temporary, along expectException fixes (2020-05-23)
  'BLOCK_timestamp_TooLarge', // Only BlockchainTest, temporary, along expectException fixes (2020-05-27)
  'sha3_bigOffset', // SHA3: Only BlockchainTest, unclear SHA3 test situation (2020-05-28)
  'sha3_memSizeNoQuadraticCost', // SHA3: See also:
  'sha3_memSizeQuadraticCost', // SHA3: https://github.com/ethereumjs/ethereumjs-vm/pull/743#issuecomment-635116418
  'sha3_bigSize', // SHA3
]

/**
 * Tests skipped due to system specifics / design considerations
 */
const SKIP_PERMANENT = [
  'SuicidesMixingCoinbase', // sucides to the coinbase, since we run a blockLevel we create coinbase account.
  'static_SuicidesMixingCoinbase', // sucides to the coinbase, since we run a blockLevel we create coinbase account.
  'ForkUncle', // Only BlockchainTest, correct behaviour unspecified (?)
  'UncleFromSideChain', // Only BlockchainTest, same as ForkUncle, the TD is the same for two diffent branches so its not clear which one should be the finally chain
]

/**
 * tests running slow (run from time to time)
 */
const SKIP_SLOW = [
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

/**
 * VMTests have been deprecated, see https://github.com/ethereum/tests/issues/593
 * skipVM test list is currently not used but might be useful in the future since VMTests
 * have now been converted to BlockchainTests, see https://github.com/ethereum/tests/pull/680
 */
const SKIP_VM = [
  // slow performance tests
  'loop-mul',
  'loop-add-10M',
  'loop-divadd-10M',
  'loop-divadd-unr100-10M',
  'loop-exp-16b-100k',
  'loop-exp-1b-1M',
  'loop-exp-2b-100k',
  'loop-exp-32b-100k',
  'loop-exp-4b-100k',
  'loop-exp-8b-100k',
  'loop-exp-nop-1M',
  'loop-mulmod-2M',
  'ABAcalls0',
  'ABAcallsSuicide0',
  'ABAcallsSuicide1',
  'sha3_bigSize',
  'CallRecursiveBomb0',
  'CallToNameRegistrator0',
  'CallToPrecompiledContract',
  'CallToReturn1',
  'PostToNameRegistrator0',
  'PostToReturn1',
  'callcodeToNameRegistrator0',
  'callcodeToReturn1',
  'callstatelessToNameRegistrator0',
  'callstatelessToReturn1',
  'createNameRegistrator',
  'randomTest643',
]

/**
 * Returns an alias for specified hardforks to meet test dependencies requirements/assumptions.
 * @param {String} forkConfig - the name of the hardfork for which an alias should be returned
 * @returns {String} Either an alias of the forkConfig param, or the forkConfig param itself
 */
function getRequiredForkConfigAlias(forkConfig) {
  // TangerineWhistle is named EIP150 (attention: misleading name)
  // in the client-independent consensus test suite
  if (String(forkConfig).match(/^tangerineWhistle$/i)) {
    return 'EIP150'
  }
  // SpuriousDragon is named EIP158 (attention: misleading name)
  // in the client-independent consensus test suite
  if (String(forkConfig).match(/^spuriousDragon$/i)) {
    return 'EIP158'
  }
  // Run the Istanbul tests for MuirGlacier since there are no dedicated tests
  if (String(forkConfig).match(/^muirGlacier/i)) {
    return 'Istanbul'
  }
  // Petersburg is named ConstantinopleFix
  // in the client-independent consensus test suite
  if (String(forkConfig).match(/^petersburg$/i)) {
    return 'ConstantinopleFix'
  }
  return forkConfig
}
  
/**
 * Returns an aggregated array with the tests to skip
 * @param {String} choices comma-separated list with skip options, e.g. BROKEN,PERMANENT
 * @param {String} defaultChoice if to use `NONE` or `ALL` as default choice
 * @returns {Array} array with test names
 */
function getSkipTests(choices, defaultChoice) {
  let skipTests = []
  if (!choices) {
    choices = defaultChoice
  }
  choices = choices.toLowerCase()
  if (choices !== 'none') {
    let choicesList = choices.split(',')
    let all = choicesList.includes('all')
    if (all || choicesList.includes('broken')) {
      skipTests = skipTests.concat(SKIP_BROKEN)
    }
    if (all || choicesList.includes('permanent')) {
      skipTests = skipTests.concat(SKIP_PERMANENT)
    }
    if (all || choicesList.includes('slow')) {
      skipTests = skipTests.concat(SKIP_SLOW)
    }
  }
  return skipTests
}

module.exports = {
  DEFAULT_FORK_CONFIG: DEFAULT_FORK_CONFIG,
  SKIP_BROKEN: SKIP_BROKEN,
  SKIP_PERMANENT: SKIP_PERMANENT,
  SKIP_SLOW: SKIP_SLOW,
  getRequiredForkConfigAlias: getRequiredForkConfigAlias,
  getSkipTests: getSkipTests,
}