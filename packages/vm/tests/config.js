const { Err } = require('typedoc/dist/lib/utils/result')

const Common = require('@ethereumjs/common').default

/**
 * Default hardfork rules to run tests against
 */
const DEFAULT_FORK_CONFIG = 'Istanbul'

/**
 * Tests which should be fixed
 */
const SKIP_BROKEN = [
  'ForkStressTest', // Only BlockchainTest, temporary till fixed (2020-05-23)
  'ChainAtoChainB', // Only BlockchainTest, temporary, along expectException fixes (2020-05-23)
  'sha3_bigOffset', // SHA3: Only BlockchainTest, unclear SHA3 test situation (2020-05-28) (https://github.com/ethereumjs/ethereumjs-vm/pull/743#issuecomment-635116418)
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
  // Chainstart is also called Frontier and is called as such in the tests
  if (String(forkConfig).match(/^chainstart$/i)) {
    return 'Frontier'
  }
  // DAO fork is named HomesteadToDaoAt5 in the tests.
  if (String(forkConfig).toLowerCase().match(/^dao$/i)) {
    return 'HomesteadToDaoAt5'
  }
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

const normalHardforks = [
  'chainstart',
  'homestead',
  'tangerineWhistle',
  'spuriousDragon',
  'byzantium',
  'constantinople',
  'petersburg',
  'istanbul',
  'muirGlacier',
  'berlin',
]

const transitionNetworks = {
  ByzantiumToConstantinopleFixAt5: {
    byzantium: 0, 
    constantinople: 5,
    petersburg: 5,
    dao: null,
    finalSupportedFork: 'petersburg',
    startFork: 'byzantium'
  },
  EIP158ToByzantiumAt5: {
    spuriousDragon: 0,
    byzantium: 5,
    dao: null,
    finalSupportedFork: 'byzantium',
    startFork: 'spuriousDragon'
  },
  FrontierToHomesteadAt5: {
    frontier: 0,
    homestead: 5,
    dao: null,
    finalSupportedFork: 'homestead',
    startFork: 'frontier'
  },
  HomesteadToDaoAt5: {
    homestead: 0,
    dao: 5,
    finalSupportedFork: 'dao',
    startFork: 'homestead'
  },
  HomesteadToEIP150At5 : {
    homestead: 0,
    tangerineWhistle: 5,
    dao: null,
    finalSupportedFork: 'tangerineWhistle',
    startFork: 'homestead'
  }
}
  
/**
 * Returns a Common for the given network (a test parameter)
 * @param {String} network - the network field of a test
 * @returns {Common} the Common which should be used
 */
function getCommon(network) {
  const networkLowercase = network.toLowerCase()
  if (normalHardforks.map((str) => str.toLowerCase()).includes(networkLowercase)) {
    // normal hard fork, return the common with this hard fork
    // find the right upper/lowercased version
    const hfName = normalHardforks.reduce((previousValue, currentValue) => (currentValue.toLowerCase() == networkLowercase) ? currentValue : previousValue)
    const mainnetCommon = new Common('mainnet', hfName)
    const hardforks = mainnetCommon.hardforks()
    const testHardforks = []
    for (const hf of hardforks) {
      // check if we enable this hf 
      // disable dao hf by default (if enabled at block 0 forces the first 10 blocks to have dao-hard-fork in extraData of block header)
      if (mainnetCommon.gteHardfork(hf.name) && hf.name != "dao") {
        // this hardfork should be activated at block 0
        testHardforks.push({
          name: hf.name,
          forkHash: hf.forkHash,
          block: 0
        })
      } else {
        // disable hardforks newer than the test hardfork (but do add "support" for it, it just never gets activated)
        testHardforks.push({
          name: hf.name,
          forkHash: hf.forkHash,
          block: null
        })
      }
    }
    return Common.forCustomChain('mainnet', {
      hardforks: testHardforks
    }, hfName)
  } else {
    // this is not a "default fork" network, but it is a "transition" network. we will test the VM if it transitions the right way
    const transitionForks = transitionNetworks[network]
    if (!transitionForks) {
      throw(new Error("network not supported: " + network))
    }
    const mainnetCommon = new Common('mainnet', transitionForks.finalSupportedFork)
    const hardforks = mainnetCommon.hardforks()
    const testHardforks = []
    for (const hf of hardforks) {
      if (mainnetCommon.gteHardfork(hf.name)) {
        // this hardfork should be activated at block 0
        const forkBlockNumber = transitionForks[hf.name]
        testHardforks.push({
          name: hf.name,
          forkHash: hf.forkHash,
          block: (forkBlockNumber === null) ? null : forkBlockNumber || 0 // if forkBlockNumber is defined as null, disable it, otherwise use block number or 0 (if its undefined)
        })
      } else {
        // disable the hardfork
        testHardforks.push({
          name: hf.name,
          forkHash: hf.forkHash,
          block: null
        })
      }
    }
    return Common.forCustomChain('mainnet', {
      hardforks: testHardforks
    }, transitionForks.startFork)
  }



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
  getCommon: getCommon
}