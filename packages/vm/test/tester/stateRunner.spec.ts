import type { Common } from '@ethereumjs/common'

import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import * as mcl from 'mcl-wasm'
import minimist from 'minimist'
import { assert, describe, it } from 'vitest'

import { KZG as microEthKZG } from 'micro-eth-signer/kzg'

import {
  type EVMBLSInterface,
  type EVMBN254Interface,
  MCLBLS,
  NobleBLS,
  NobleBN254,
  RustBN254,
} from '@ethereumjs/evm'
import { initRustBN } from 'rustbn-wasm'
import { DEFAULT_FORK_CONFIG, getCommon, getRequiredForkConfigAlias } from './config.ts'
import { runStateTest } from './runners/GeneralStateTestsRunner.ts'

const testDataObject = {
  wrongBlobhashVersion: {
    _info: {
      comment: 'BLOB001',
      'filling-rpc-server': 'evm version 1.14.4-unstable-3d8028a6-20240513',
      'filling-tool-version': 'retesteth-0.3.2-cancun+commit.cae6bc33.Linux.g++',
      generatedTestHash: '121104d3f52ee80ee2f762e750fba7476c87fdaa7e8d48b565e26a68f677d80c',
      lllcversion: 'Version: 0.5.14-develop.2023.7.11+commit.c58ab2c6.mod.Linux.g++',
      solidity: 'Version: 0.8.21+commit.d9974bed.Linux.g++',
      source:
        'src/GeneralStateTestsFiller/Cancun/stEIP4844-blobtransactions/wrongBlobhashVersionFiller.yml',
      sourceHash: '32cfd908b12300b9128770c6c0b944a35d546f25d3ddc2e237cd3cd3395607a5',
    },
    env: {
      currentBaseFee: '0x07',
      currentCoinbase: '0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba',
      currentDifficulty: '0x020000',
      currentExcessBlobGas: '0x00',
      currentGasLimit: '0x1000000000',
      currentNumber: '0x01',
      currentRandom: '0x0000000000000000000000000000000000000000000000000000000000020000',
      currentTimestamp: '0x03e8',
    },
    post: {
      Cancun: [
        {
          expectException: 'TransactionException.TYPE_3_TX_INVALID_BLOB_VERSIONED_HASH',
          hash: '0x66887abd521eb1401e0b8e52014bf6e36346dc786bf9084f3f03ac09b2ffaa2',
          indexes: {
            data: 0,
            gas: 0,
            value: 0,
          },
          logs: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
          txbytes:
            '0x03f9010c01800285012a05f200833d090094095e7baea6a6c7c4c2dfeb977efac326af552d87830186a000f85bf85994095e7baea6a6c7c4c2dfeb977efac326af552d87f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010af842a001a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8a045a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d880a0daa1a9e47f815525ac6e11929160073fea1abf7acee286d4858fd4b1d9611fcda054d245d4a23cf599e6a8611692fdeab9be366108af5ba72554062346fa41a55a',
        },
      ],
    },
    pre: {
      '0x095e7baea6a6c7c4c2dfeb977efac326af552d87': {
        balance: '0x0de0b6b3a7640000',
        code: '0x60004960005500',
        nonce: '0x00',
        storage: {},
      },
      '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b': {
        balance: '0x0de0b6b3a7640000',
        code: '0x',
        nonce: '0x00',
        storage: {},
      },
    },
    transaction: {
      accessLists: [
        [
          {
            address: '0x095e7baea6a6c7c4c2dfeb977efac326af552d87',
            storageKeys: [
              '0x0000000000000000000000000000000000000000000000000000000000000000',
              '0x0000000000000000000000000000000000000000000000000000000000000001',
            ],
          },
        ],
      ],
      blobVersionedHashes: [
        '0x01a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8',
        '0x45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8',
      ],
      data: ['0x00'],
      gasLimit: ['0x3d0900'],
      maxFeePerBlobGas: '0x0a',
      maxFeePerGas: '0x012a05f200',
      maxPriorityFeePerGas: '0x02',
      nonce: '0x00',
      secretKey: '0x45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8',
      sender: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
      to: '0x095e7baea6a6c7c4c2dfeb977efac326af552d87',
      value: ['0x0186a0'],
    },
  },
  createBlobhashTx: {
    _info: {
      comment: 'BLOB002',
      'filling-rpc-server': 'evm version 1.14.4-unstable-3d8028a6-20240513',
      'filling-tool-version': 'retesteth-0.3.2-cancun+commit.cae6bc33.Linux.g++',
      generatedTestHash: '14e2a257401391d59db3660d65588cd10e65eafdeb01efee34ccad42466e7998',
      lllcversion: 'Version: 0.5.14-develop.2023.7.11+commit.c58ab2c6.mod.Linux.g++',
      solidity: 'Version: 0.8.21+commit.d9974bed.Linux.g++',
      source:
        'src/GeneralStateTestsFiller/Cancun/stEIP4844-blobtransactions/createBlobhashTxFiller.yml',
      sourceHash: '57888e10e405e2329fd6d49f955f81fb04136c0bc699ab8c69919ed5e36e5b11',
    },
    env: {
      currentBaseFee: '0x07',
      currentCoinbase: '0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba',
      currentDifficulty: '0x020000',
      currentExcessBlobGas: '0x00',
      currentGasLimit: '0x1000000000',
      currentNumber: '0x01',
      currentRandom: '0x0000000000000000000000000000000000000000000000000000000000020000',
      currentTimestamp: '0x03e8',
    },
    post: {
      Cancun: [
        {
          expectException: 'TransactionException.TYPE_3_TX_CONTRACT_CREATION',
          hash: '0x668817abd521eb1401e0b8e52014bf6e36346dc786bf9084f3f03ac09b2ffaa2',
          indexes: {
            data: 0,
            gas: 0,
            value: 0,
          },
          logs: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
          txbytes:
            '0x03f8d601800285012a05f200833d090080830186a000f85bf85994095e7baea6a6c7c4c2dfeb977efac326af552d87f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010ae1a001a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d880a0fc12b67159a3567f8bdbc49e0be369a2e20e09d57a51c41310543a4128409464a02de0cfe5495c4f58ff60645ceda0afd67a4c90a70bc89fe207269435b35e5b67',
        },
      ],
    },
    pre: {
      '0x095e7baea6a6c7c4c2dfeb977efac326af552d87': {
        balance: '0x0de0b6b3a7640000',
        code: '0x60004960005500',
        nonce: '0x00',
        storage: {},
      },
      '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b': {
        balance: '0x0de0b6b3a7640000',
        code: '0x',
        nonce: '0x00',
        storage: {},
      },
    },
    transaction: {
      accessLists: [
        [
          {
            address: '0x095e7baea6a6c7c4c2dfeb977efac326af552d87',
            storageKeys: [
              '0x0000000000000000000000000000000000000000000000000000000000000000',
              '0x0000000000000000000000000000000000000000000000000000000000000001',
            ],
          },
        ],
      ],
      blobVersionedHashes: ['0x01a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8'],
      data: ['0x00'],
      gasLimit: ['0x3d0900'],
      maxFeePerBlobGas: '0x0a',
      maxFeePerGas: '0x012a05f200',
      maxPriorityFeePerGas: '0x02',
      nonce: '0x00',
      secretKey: '0x45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8',
      sender: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
      to: '',
      value: ['0x0186a0'],
    },
  },
  blobhashListBounds4: {
    _info: {
      comment: 'BLOB006',
      'filling-rpc-server': 'evm version 1.13.11-unstable-765f2904-20240124',
      'filling-tool-version': 'retesteth-0.3.2-cancun+commit.ea13235b.Linux.g++',
      generatedTestHash: '98c5bce6c1b8cd5a8bdafc9333b5d86587efe3a53d0515873d9f27110d3e3935',
      lllcversion: 'Version: 0.5.14-develop.2023.7.11+commit.c58ab2c6.mod.Linux.g++',
      solidity: 'Version: 0.8.21+commit.d9974bed.Linux.g++',
      source:
        'src/GeneralStateTestsFiller/Cancun/stEIP4844-blobtransactions/blobhashListBounds4Filler.yml',
      sourceHash: '5d992d68f3b613a49469fff6db6a6db728dc4526c36b03341da4d165b77b9bca',
    },
    env: {
      currentBaseFee: '0x07',
      currentCoinbase: '0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba',
      currentDifficulty: '0x020000',
      currentExcessBlobGas: '0x00',
      currentGasLimit: '0x1000000000',
      currentNumber: '0x01',
      currentRandom: '0x0000000000000000000000000000000000000000000000000000000000020000',
      currentTimestamp: '0x03e8',
    },
    post: {
      Cancun: [
        {
          hash: '0xdfef0eb2235050b176af2aa3d2b1ce64184bfa1fe5fa598c048a0adb2bbb7d86',
          indexes: {
            data: 0,
            gas: 0,
            value: 0,
          },
          logs: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
          txbytes:
            '0x03f9014e01800285012a05f200833d090094095e7baea6a6c7c4c2dfeb977efac326af552d87830186a000f85bf85994095e7baea6a6c7c4c2dfeb977efac326af552d87f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010af884a001a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065f0001a001a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065f0002a001a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065f0003a001a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065f000401a04050f623a6a761402057018dbe8f7e9581bd8eed6362e7271e81b2861ca4cbdaa0671bf16648962e2435bf04e0e6c4eb9c0bc9971b251771f25d75e32a21fb3a7b',
        },
      ],
    },
    pre: {
      '0x095e7baea6a6c7c4c2dfeb977efac326af552d87': {
        balance: '0x0de0b6b3a7640000',
        code: '0x600a4960005500',
        nonce: '0x00',
        storage: {},
      },
      '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b': {
        balance: '0x0de0b6b3a7640000',
        code: '0x',
        nonce: '0x00',
        storage: {},
      },
    },
    transaction: {
      accessLists: [
        [
          {
            address: '0x095e7baea6a6c7c4c2dfeb977efac326af552d87',
            storageKeys: [
              '0x0000000000000000000000000000000000000000000000000000000000000000',
              '0x0000000000000000000000000000000000000000000000000000000000000001',
            ],
          },
        ],
      ],
      blobVersionedHashes: [
        '0x01a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065f0001',
        '0x01a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065f0002',
        '0x01a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065f0003',
        '0x01a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065f0004',
      ],
      data: ['0x00'],
      gasLimit: ['0x3d0900'],
      maxFeePerBlobGas: '0x0a',
      maxFeePerGas: '0x012a05f200',
      maxPriorityFeePerGas: '0x02',
      nonce: '0x00',
      secretKey: '0x45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8',
      sender: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
      to: '0x095e7baea6a6c7c4c2dfeb977efac326af552d87',
      value: ['0x0186a0'],
    },
  },
}

const argv = minimist(process.argv.slice(2))

const RUN_PROFILER: boolean = argv.profile ?? false

argv.fork = 'Cancun'

const FORK_CONFIG: string = argv.fork !== undefined ? argv.fork : DEFAULT_FORK_CONFIG
const FORK_CONFIG_TEST_SUITE = getRequiredForkConfigAlias(FORK_CONFIG)

// Examples: Istanbul -> istanbul, MuirGlacier -> muirGlacier
const FORK_CONFIG_VM = FORK_CONFIG.charAt(0).toLowerCase() + FORK_CONFIG.substring(1)

let bls: EVMBLSInterface
if (argv.bls !== undefined && argv.bls.toLowerCase() === 'mcl') {
  await mcl.init(mcl.BLS12_381)
  bls = new MCLBLS(mcl)
  console.log('BLS library used: MCL (WASM)')
} else {
  console.log('BLS library used: Noble (JavaScript)')
  bls = new NobleBLS()
}

let bn254: EVMBN254Interface
if (argv.bn254 !== undefined && argv.bn254.toLowerCase() === 'mcl') {
  const rustBN = await initRustBN()
  bn254 = new RustBN254(rustBN)
  console.log('BN254 (alt_BN128) library used: rustbn.js (WASM)')
} else {
  console.log('BN254 (alt_BN128) library used: Noble (JavaScript)')
  bn254 = new NobleBN254()
}

/**
 * Run-time configuration
 */
const kzg = new microEthKZG(trustedSetup)
const runnerArgs: {
  forkConfigVM: string
  forkConfigTestSuite: string
  common: Common
  jsontrace?: boolean
  dist?: boolean
  data?: number
  gasLimit?: number
  value?: number
  debug?: boolean
  reps?: number
  profile: boolean
  bls: EVMBLSInterface
  bn254: EVMBN254Interface
  stateManager: string
} = {
  forkConfigVM: FORK_CONFIG_VM,
  forkConfigTestSuite: FORK_CONFIG_TEST_SUITE,
  common: getCommon(FORK_CONFIG_VM, kzg),
  jsontrace: argv.jsontrace,
  dist: argv.dist,
  data: argv.data, // GeneralStateTests
  gasLimit: argv.gas, // GeneralStateTests
  value: argv.value, // GeneralStateTests
  debug: argv.debug, // BlockchainTests
  reps: argv.reps, // test repetitions
  bls,
  profile: RUN_PROFILER,
  bn254,
  stateManager: argv.stateManager,
}

// bloat tests to see how long it takes to run all tests
// for (let i = 0; i < 1000; i++) {
//   testDataObject[`${i}`] = {
//     "_info" : {
//         "comment" : "BLOB001",
//         "filling-rpc-server" : "evm version 1.14.4-unstable-3d8028a6-20240513",
//         "filling-tool-version" : "retesteth-0.3.2-cancun+commit.cae6bc33.Linux.g++",
//         "generatedTestHash" : "121104d3f52ee80ee2f762e750fba7476c87fdaa7e8d48b565e26a68f677d80c",
//         "lllcversion" : "Version: 0.5.14-develop.2023.7.11+commit.c58ab2c6.mod.Linux.g++",
//         "solidity" : "Version: 0.8.21+commit.d9974bed.Linux.g++",
//         "source" : "src/GeneralStateTestsFiller/Cancun/stEIP4844-blobtransactions/wrongBlobhashVersionFiller.yml",
//         "sourceHash" : "32cfd908b12300b9128770c6c0b944a35d546f25d3ddc2e237cd3cd3395607a5"
//     },
//     "env" : {
//         "currentBaseFee" : "0x07",
//         "currentCoinbase" : "0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba",
//         "currentDifficulty" : "0x020000",
//         "currentExcessBlobGas" : "0x00",
//         "currentGasLimit" : "0x1000000000",
//         "currentNumber" : "0x01",
//         "currentRandom" : "0x0000000000000000000000000000000000000000000000000000000000020000",
//         "currentTimestamp" : "0x03e8"
//     },
//     "post" : {
//         "Cancun" : [
//             {
//                 "expectException" : "TransactionException.TYPE_3_TX_INVALID_BLOB_VERSIONED_HASH",
//                 "hash" : "0x668817abd521eb1401e0b8e52014bf6e36346dc786bf9084f3f03ac09b2ffaa2",
//                 "indexes" : {
//                     "data" : 0,
//                     "gas" : 0,
//                     "value" : 0
//                 },
//                 "logs" : "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
//                 "txbytes" : "0x03f9010c01800285012a05f200833d090094095e7baea6a6c7c4c2dfeb977efac326af552d87830186a000f85bf85994095e7baea6a6c7c4c2dfeb977efac326af552d87f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010af842a001a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8a045a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d880a0daa1a9e47f815525ac6e11929160073fea1abf7acee286d4858fd4b1d9611fcda054d245d4a23cf599e6a8611692fdeab9be366108af5ba72554062346fa41a55a"
//             }
//         ]
//     },
//     "pre" : {
//         "0x095e7baea6a6c7c4c2dfeb977efac326af552d87" : {
//             "balance" : "0x0de0b6b3a7640000",
//             "code" : "0x60004960005500",
//             "nonce" : "0x00",
//             "storage" : {
//             }
//         },
//         "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b" : {
//             "balance" : "0x0de0b6b3a7640000",
//             "code" : "0x",
//             "nonce" : "0x00",
//             "storage" : {
//             }
//         }
//     },
//     "transaction" : {
//         "accessLists" : [
//             [
//                 {
//                     "address" : "0x095e7baea6a6c7c4c2dfeb977efac326af552d87",
//                     "storageKeys" : [
//                         "0x0000000000000000000000000000000000000000000000000000000000000000",
//                         "0x0000000000000000000000000000000000000000000000000000000000000001"
//                     ]
//                 }
//             ]
//         ],
//         "blobVersionedHashes" : [
//             "0x01a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8",
//             "0x45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8"
//         ],
//         "data" : [
//             "0x00"
//         ],
//         "gasLimit" : [
//             "0x3d0900"
//         ],
//         "maxFeePerBlobGas" : "0x0a",
//         "maxFeePerGas" : "0x012a05f200",
//         "maxPriorityFeePerGas" : "0x02",
//         "nonce" : "0x00",
//         "secretKey" : "0x45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8",
//         "sender" : "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "to" : "0x095e7baea6a6c7c4c2dfeb977efac326af552d87",
//         "value" : [
//             "0x0186a0"
//         ]
//     }
//   }
// }

describe('TransactionTests', async () => {
  for (const [testName, testDataRaw] of Object.entries(testDataObject)) {
    const forkName = 'Cancun'
    it(`${testName} - [${forkName}]`, async () => {
      await runStateTest(runnerArgs, testDataRaw, assert)
    }, 120000)
  }
})
