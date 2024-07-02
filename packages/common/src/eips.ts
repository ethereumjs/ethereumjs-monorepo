import { Hardfork } from './enums.js'

import type { EIPConfig } from './types.js'

type EIPsDict = {
  [key: string]: EIPConfig
}

enum Status {
  Stagnant = 'stagnant',
  Draft = 'draft',
  Review = 'review',
  Final = 'final',
}

export const EIPs: EIPsDict = {
  1153: {
    comment: 'Transient storage opcodes',
    url: 'https://eips.ethereum.org/EIPS/eip-1153',
    status: Status.Review,
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
    gasPrices: {
      tstore: {
        v: 100,
        d: 'Base fee of the TSTORE opcode',
      },
      tload: {
        v: 100,
        d: 'Base fee of the TLOAD opcode',
      },
    },
  },
  1559: {
    comment: 'Fee market change for ETH 1.0 chain',
    url: 'https://eips.ethereum.org/EIPS/eip-1559',
    status: Status.Final,
    minimumHardfork: Hardfork.Berlin,
    requiredEIPs: [2930],
    gasConfig: {
      baseFeeMaxChangeDenominator: {
        v: 8,
        d: 'Maximum base fee change denominator',
      },
      elasticityMultiplier: {
        v: 2,
        d: 'Maximum block gas target elasticity',
      },
      initialBaseFee: {
        v: 1000000000,
        d: 'Initial base fee on first EIP1559 block',
      },
    },
  },
  2565: {
    comment: 'ModExp gas cost',
    url: 'https://eips.ethereum.org/EIPS/eip-2565',
    status: Status.Final,
    minimumHardfork: Hardfork.Byzantium,
    requiredEIPs: [],
    gasPrices: {
      modexpGquaddivisor: {
        v: 3,
        d: 'Gquaddivisor from modexp precompile for gas calculation',
      },
    },
  },
  2537: {
    comment: 'BLS12-381 precompiles',
    url: 'https://eips.ethereum.org/EIPS/eip-2537',
    status: 'Draft',
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
    gasConfig: {},
    gasPrices: {
      Bls12381G1AddGas: {
        v: 500,
        d: 'Gas cost of a single BLS12-381 G1 addition precompile-call',
      },
      Bls12381G1MulGas: {
        v: 12000,
        d: 'Gas cost of a single BLS12-381 G1 multiplication precompile-call',
      },
      Bls12381G2AddGas: {
        v: 800,
        d: 'Gas cost of a single BLS12-381 G2 addition precompile-call',
      },
      Bls12381G2MulGas: {
        v: 45000,
        d: 'Gas cost of a single BLS12-381 G2 multiplication precompile-call',
      },
      Bls12381PairingBaseGas: {
        v: 65000,
        d: 'Base gas cost of BLS12-381 pairing check',
      },
      Bls12381PairingPerPairGas: {
        v: 43000,
        d: 'Per-pair gas cost of BLS12-381 pairing check',
      },
      Bls12381MapG1Gas: {
        v: 5500,
        d: 'Gas cost of BLS12-381 map field element to G1',
      },
      Bls12381MapG2Gas: {
        v: 75000,
        d: 'Gas cost of BLS12-381 map field element to G2',
      },
    },
    vm: {},
    pow: {},
  },
  2718: {
    comment: 'Typed Transaction Envelope',
    url: 'https://eips.ethereum.org/EIPS/eip-2718',
    status: Status.Final,
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
  },
  2929: {
    comment: 'Gas cost increases for state access opcodes',
    url: 'https://eips.ethereum.org/EIPS/eip-2929',
    status: Status.Final,
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
    gasPrices: {
      coldsload: {
        v: 2100,
        d: 'Gas cost of the first read of storage from a given location (per transaction)',
      },
      coldaccountaccess: {
        v: 2600,
        d: 'Gas cost of the first read of a given address (per transaction)',
      },
      warmstorageread: {
        v: 100,
        d: "Gas cost of reading storage locations which have already loaded 'cold'",
      },
      sstoreCleanGasEIP2200: {
        v: 2900,
        d: 'Once per SSTORE operation from clean non-zero to something else',
      },
      sstoreNoopGasEIP2200: {
        v: 100,
        d: "Once per SSTORE operation if the value doesn't change",
      },
      sstoreDirtyGasEIP2200: {
        v: 100,
        d: 'Once per SSTORE operation if a dirty value is changed',
      },
      sstoreInitRefundEIP2200: {
        v: 19900,
        d: 'Once per SSTORE operation for resetting to the original zero value',
      },
      sstoreCleanRefundEIP2200: {
        v: 4900,
        d: 'Once per SSTORE operation for resetting to the original non-zero value',
      },
      call: {
        v: 0,
        d: 'Base fee of the CALL opcode',
      },
      callcode: {
        v: 0,
        d: 'Base fee of the CALLCODE opcode',
      },
      delegatecall: {
        v: 0,
        d: 'Base fee of the DELEGATECALL opcode',
      },
      staticcall: {
        v: 0,
        d: 'Base fee of the STATICCALL opcode',
      },
      balance: {
        v: 0,
        d: 'Base fee of the BALANCE opcode',
      },
      extcodesize: {
        v: 0,
        d: 'Base fee of the EXTCODESIZE opcode',
      },
      extcodecopy: {
        v: 0,
        d: 'Base fee of the EXTCODECOPY opcode',
      },
      extcodehash: {
        v: 0,
        d: 'Base fee of the EXTCODEHASH opcode',
      },
      sload: {
        v: 0,
        d: 'Base fee of the SLOAD opcode',
      },
      sstore: {
        v: 0,
        d: 'Base fee of the SSTORE opcode',
      },
    },
  },
  2930: {
    comment: 'Optional access lists',
    url: 'https://eips.ethereum.org/EIPS/eip-2930',
    status: Status.Final,
    minimumHardfork: Hardfork.Istanbul,
    requiredEIPs: [2718, 2929],
    gasPrices: {
      accessListStorageKeyCost: {
        v: 1900,
        d: 'Gas cost per storage key in an Access List transaction',
      },
      accessListAddressCost: {
        v: 2400,
        d: 'Gas cost per storage key in an Access List transaction',
      },
    },
  },
  2935: {
    comment: 'Save historical block hashes in state (Verkle related usage, UNSTABLE)',
    url: 'https://github.com/gballet/EIPs/pull/3/commits/2e9ac09a142b0d9fb4db0b8d4609f92e5d9990c5',
    status: Status.Draft,
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
    vm: {
      historyStorageAddress: {
        v: BigInt('0x0aae40965e6800cd9b1f4b05ff21581047e3f91e'),
        d: 'The address where the historical blockhashes are stored',
      },
      historyServeWindow: {
        v: BigInt(8192),
        d: 'The amount of blocks to be served by the historical blockhash contract',
      },
    },
  },
  3074: {
    comment: 'AUTH and AUTHCALL opcodes',
    url: 'https://github.com/ethereum/EIPs/commit/eca4416ff3c025fcb6ec8cd4eac481e74e108481',
    status: Status.Review,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
    gasPrices: {
      auth: {
        v: 3100,
        d: 'Gas cost of the AUTH opcode',
      },
      authcall: {
        v: 0,
        d: 'Gas cost of the AUTHCALL opcode',
      },
      authcallValueTransfer: {
        v: 6700,
        d: 'Paid for CALL when the value transfer is non-zero',
      },
    },
  },
  3198: {
    comment: 'BASEFEE opcode',
    url: 'https://eips.ethereum.org/EIPS/eip-3198',
    status: Status.Final,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
    gasPrices: {
      basefee: {
        v: 2,
        d: 'Gas cost of the BASEFEE opcode',
      },
    },
  },
  3529: {
    comment: 'Reduction in refunds',
    url: 'https://eips.ethereum.org/EIPS/eip-3529',
    status: Status.Final,
    minimumHardfork: Hardfork.Berlin,
    requiredEIPs: [2929],
    gasConfig: {
      maxRefundQuotient: {
        v: 5,
        d: 'Maximum refund quotient; max tx refund is min(tx.gasUsed/maxRefundQuotient, tx.gasRefund)',
      },
    },
    gasPrices: {
      selfdestructRefund: {
        v: 0,
        d: 'Refunded following a selfdestruct operation',
      },
      sstoreClearRefundEIP2200: {
        v: 4800,
        d: 'Once per SSTORE operation for clearing an originally existing storage slot',
      },
    },
  },
  3540: {
    comment: 'EVM Object Format (EOF) v1',
    url: 'https://eips.ethereum.org/EIPS/eip-3540',
    status: Status.Review,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3541],
  },
  3541: {
    comment: 'Reject new contracts starting with the 0xEF byte',
    url: 'https://eips.ethereum.org/EIPS/eip-3541',
    status: Status.Final,
    minimumHardfork: Hardfork.Berlin,
    requiredEIPs: [],
  },
  3554: {
    comment: 'Difficulty Bomb Delay to December 1st 2021',
    url: 'https://eips.ethereum.org/EIPS/eip-3554',
    status: Status.Final,
    minimumHardfork: Hardfork.MuirGlacier,
    requiredEIPs: [],
    pow: {
      difficultyBombDelay: {
        v: 9500000,
        d: 'the amount of blocks to delay the difficulty bomb with',
      },
    },
  },
  3607: {
    comment: 'Reject transactions from senders with deployed code',
    url: 'https://eips.ethereum.org/EIPS/eip-3607',
    status: Status.Final,
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
  },
  3651: {
    comment: 'Warm COINBASE',
    url: 'https://eips.ethereum.org/EIPS/eip-3651',
    status: Status.Review,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [2929],
  },
  3670: {
    comment: 'EOF - Code Validation',
    url: 'https://eips.ethereum.org/EIPS/eip-3670',
    status: 'Review',
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540],
    gasConfig: {},
    gasPrices: {},
    vm: {},
    pow: {},
  },
  3675: {
    comment: 'Upgrade consensus to Proof-of-Stake',
    url: 'https://eips.ethereum.org/EIPS/eip-3675',
    status: Status.Final,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
  },
  3855: {
    comment: 'PUSH0 instruction',
    url: 'https://eips.ethereum.org/EIPS/eip-3855',
    status: Status.Review,
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
    gasPrices: {
      push0: {
        v: 2,
        d: 'Base fee of the PUSH0 opcode',
      },
    },
  },
  3860: {
    comment: 'Limit and meter initcode',
    url: 'https://eips.ethereum.org/EIPS/eip-3860',
    status: Status.Review,
    minimumHardfork: Hardfork.SpuriousDragon,
    requiredEIPs: [],
    gasPrices: {
      initCodeWordCost: {
        v: 2,
        d: 'Gas to pay for each word (32 bytes) of initcode when creating a contract',
      },
    },
    vm: {
      maxInitCodeSize: {
        v: 49152,
        d: 'Maximum length of initialization code when creating a contract',
      },
    },
  },
  4345: {
    comment: 'Difficulty Bomb Delay to June 2022',
    url: 'https://eips.ethereum.org/EIPS/eip-4345',
    status: Status.Final,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
    pow: {
      difficultyBombDelay: {
        v: 10700000,
        d: 'the amount of blocks to delay the difficulty bomb with',
      },
    },
  },
  4399: {
    comment: 'Supplant DIFFICULTY opcode with PREVRANDAO',
    url: 'https://eips.ethereum.org/EIPS/eip-4399',
    status: Status.Review,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
    gasPrices: {
      prevrandao: {
        v: 2,
        d: 'Base fee of the PREVRANDAO opcode (previously DIFFICULTY)',
      },
    },
  },
  4788: {
    comment: 'Beacon block root in the EVM',
    url: 'https://eips.ethereum.org/EIPS/eip-4788',
    status: Status.Draft,
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [],
    gasPrices: {},
    vm: {
      historicalRootsLength: {
        v: 8191,
        d: 'The modulo parameter of the beaconroot ring buffer in the beaconroot statefull precompile',
      },
    },
  },
  4844: {
    comment: 'Shard Blob Transactions',
    url: 'https://eips.ethereum.org/EIPS/eip-4844',
    status: Status.Draft,
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [1559, 2718, 2930, 4895],
    gasConfig: {
      blobGasPerBlob: {
        v: 131072,
        d: 'The base fee for blob gas per blob',
      },
      targetBlobGasPerBlock: {
        v: 393216,
        d: 'The target blob gas consumed per block',
      },
      maxblobGasPerBlock: {
        v: 786432,
        d: 'The max blob gas allowable per block',
      },
      blobGasPriceUpdateFraction: {
        v: 3338477,
        d: 'The denominator used in the exponential when calculating a blob gas price',
      },
    },
    gasPrices: {
      simpleGasPerBlob: {
        v: 12000,
        d: 'The basic gas fee for each blob',
      },
      minBlobGasPrice: {
        v: 1,
        d: 'The minimum fee per blob gas',
      },
      kzgPointEvaluationGasPrecompilePrice: {
        v: 50000,
        d: 'The fee associated with the point evaluation precompile',
      },
      blobhash: {
        v: 3,
        d: 'Base fee of the BLOBHASH opcode',
      },
    },
    sharding: {
      blobCommitmentVersionKzg: {
        v: 1,
        d: 'The number indicated a versioned hash is a KZG commitment',
      },
      fieldElementsPerBlob: {
        v: 4096,
        d: 'The number of field elements allowed per blob',
      },
    },
  },
  4895: {
    comment: 'Beacon chain push withdrawals as operations',
    url: 'https://eips.ethereum.org/EIPS/eip-4895',
    status: Status.Review,
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [],
  },
  5133: {
    comment: 'Delaying Difficulty Bomb to mid-September 2022',
    url: 'https://eips.ethereum.org/EIPS/eip-5133',
    status: Status.Draft,
    minimumHardfork: Hardfork.GrayGlacier,
    requiredEIPs: [],
    pow: {
      difficultyBombDelay: {
        v: 11400000,
        d: 'the amount of blocks to delay the difficulty bomb with',
      },
    },
  },
  5656: {
    comment: 'MCOPY - Memory copying instruction',
    url: 'https://eips.ethereum.org/EIPS/eip-5656',
    status: Status.Draft,
    minimumHardfork: Hardfork.Shanghai,
    requiredEIPs: [],
    gasPrices: {
      mcopy: {
        v: 3,
        d: 'Base fee of the MCOPY opcode',
      },
    },
  },
  6110: {
    comment: 'Supply validator deposits on chain',
    url: 'https://eips.ethereum.org/EIPS/eip-6110',
    status: Status.Draft,
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [7685],
  },
  6780: {
    comment: 'SELFDESTRUCT only in same transaction',
    url: 'https://eips.ethereum.org/EIPS/eip-6780',
    status: Status.Draft,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
  },
  6800: {
    comment: 'Ethereum state using a unified verkle tree (experimental)',
    url: 'https://github.com/ethereum/EIPs/pull/6800',
    status: Status.Draft,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
    gasPrices: {
      create: {
        v: 1000,
        d: 'Base fee of the CREATE opcode',
      },
      coldsload: {
        v: 0,
        d: 'Gas cost of the first read of storage from a given location (per transaction)',
      },
    },
    vm: {
      // kaustinen 6 current uses this address, however this will be updated to correct address
      // in next iteration
      historyStorageAddress: {
        v: BigInt('0xfffffffffffffffffffffffffffffffffffffffe'),
        d: 'The address where the historical blockhashes are stored',
      },
    },
  },
  7002: {
    comment: 'Execution layer triggerable withdrawals (experimental)',
    url: 'https://github.com/ethereum/EIPs/blob/3b5fcad6b35782f8aaeba7d4ac26004e8fbd720f/EIPS/eip-7002.md',
    status: Status.Draft,
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [7685],
    vm: {
      withdrawalRequestType: {
        v: BigInt(0x01),
        d: 'The withdrawal request type for EIP-7685',
      },
      excessWithdrawalsRequestStorageSlot: {
        v: BigInt(0),
        d: 'The storage slot of the excess withdrawals',
      },
      withdrawalsRequestCountStorage: {
        v: BigInt(1),
        d: 'The storage slot of the withdrawal request count',
      },
      withdrawalsRequestQueueHeadStorageSlot: {
        v: BigInt(2),
        d: 'The storage slot of the withdrawal request head of the queue',
      },
      withdrawalsRequestTailHeadStorageSlot: {
        v: BigInt(3),
        d: 'The storage slot of the withdrawal request tail of the queue',
      },
      withdrawalsRequestQueueStorageOffset: {
        v: BigInt(4),
        d: 'The storage slot of the withdrawal request queue offset',
      },
      maxWithdrawalRequestsPerBlock: {
        v: BigInt(16),
        d: 'The max withdrawal requests per block',
      },
      targetWithdrawalRequestsPerBlock: {
        v: BigInt(2),
        d: 'The target withdrawal requests per block',
      },
      minWithdrawalRequestFee: {
        v: BigInt(1),
        d: 'The minimum withdrawal request fee (in wei)',
      },
      withdrawalRequestFeeUpdateFraction: {
        v: BigInt(17),
        d: 'The withdrawal request fee update fraction (used in the fake exponential)',
      },
      systemAddress: {
        v: BigInt('0xfffffffffffffffffffffffffffffffffffffffe'),
        d: 'The system address to perform operations on the withdrawal requests predeploy address',
      },
      withdrawalRequestPredeployAddress: {
        v: BigInt('0x00A3ca265EBcb825B45F985A16CEFB49958cE017'),
        d: 'Address of the validator excess address',
      },
    },
  },
  7251: {
    comment: 'Execution layer triggered consolidations (experimental)',
    url: 'https://eips.ethereum.org/EIPS/eip-7251',
    status: Status.Draft,
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [7685],
    vm: {
      consolidationRequestType: {
        v: BigInt(0x02),
        d: 'The withdrawal request type for EIP-7685',
      },
      systemAddress: {
        v: BigInt('0xfffffffffffffffffffffffffffffffffffffffe'),
        d: 'The system address to perform operations on the consolidation requests predeploy address',
      },
      consolidationRequestPredeployAddress: {
        v: BigInt('0x00b42dbF2194e931E80326D950320f7d9Dbeac02'),
        d: 'Address of the consolidations contract',
      },
    },
  },
  7516: {
    comment: 'BLOBBASEFEE opcode',
    url: 'https://eips.ethereum.org/EIPS/eip-7516',
    status: Status.Draft,
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [4844],
    gasPrices: {
      blobbasefee: {
        v: 2,
        d: 'Gas cost of the BLOBBASEFEE opcode',
      },
    },
  },
  7685: {
    comment: 'General purpose execution layer requests',
    url: 'https://eips.ethereum.org/EIPS/eip-7685',
    status: Status.Draft,
    // TODO: Set correct minimum hardfork
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [3675],
    gasPrices: {},
  },
  7702: {
    comment: 'Set EOA account code for one transaction',
    url: 'https://github.com/ethereum/EIPs/blob/62419ca3f45375db00b04a368ea37c0bfb05386a/EIPS/eip-7702.md',
    status: Status.Review,
    // TODO: Set correct minimum hardfork
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [2718, 2929, 2930],
    gasPrices: {
      perAuthBaseCost: {
        v: 2500,
        d: 'Gas cost of each authority item',
      },
    },
  },
  7709: {
    comment: 'Use historical block hashes saved in state for BLOCKHASH',
    url: 'https://eips.ethereum.org/EIPS/eip-7709',
    status: Status.Draft,
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [2935],
  },
}
