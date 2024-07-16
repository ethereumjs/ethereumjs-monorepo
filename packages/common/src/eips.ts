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
  663: {
    comment: 'SWAPN, DUPN and EXCHANGE instructions',
    url: 'https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-663.md',
    status: Status.Review,
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [3540, 5450],
    gasPrices: {
      dupn: {
        v: 3,
        d: 'Base fee of the DUPN opcode',
      },
      swapn: {
        v: 3,
        d: 'Base fee of the SWAPN opcode',
      },
      exchange: {
        v: 3,
        d: 'Base fee of the EXCHANGE opcode',
      },
    },
  },
  1153: {
    comment: 'Transient storage opcodes',
    url: 'https://eips.ethereum.org/EIPS/eip-1153',
    status: Status.Review,
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
    gasPrices: {
      tstore: 100, // Base fee of the TSTORE opcode
      tload: 100, // Base fee of the TLOAD opcode
    },
  },
  1559: {
    comment: 'Fee market change for ETH 1.0 chain',
    url: 'https://eips.ethereum.org/EIPS/eip-1559',
    status: Status.Final,
    minimumHardfork: Hardfork.Berlin,
    requiredEIPs: [2930],
    gasConfig: {
      baseFeeMaxChangeDenominator: 8, // Maximum base fee change denominator
      elasticityMultiplier: 2, // Maximum block gas target elasticity
      initialBaseFee: 1000000000, // Initial base fee on first EIP1559 block
    },
  },
  2565: {
    comment: 'ModExp gas cost',
    url: 'https://eips.ethereum.org/EIPS/eip-2565',
    status: Status.Final,
    minimumHardfork: Hardfork.Byzantium,
    requiredEIPs: [],
    gasPrices: {
      modexpGquaddivisor: 3, // Gquaddivisor from modexp precompile for gas calculation
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
      Bls12381G1AddGas: 500, // Gas cost of a single BLS12-381 G1 addition precompile-call
      Bls12381G1MulGas: 12000, // Gas cost of a single BLS12-381 G1 multiplication precompile-call
      Bls12381G2AddGas: 800, // Gas cost of a single BLS12-381 G2 addition precompile-call
      Bls12381G2MulGas: 45000, // Gas cost of a single BLS12-381 G2 multiplication precompile-call
      Bls12381PairingBaseGas: 65000, // Base gas cost of BLS12-381 pairing check
      Bls12381PairingPerPairGas: 43000, // Per-pair gas cost of BLS12-381 pairing check
      Bls12381MapG1Gas: 5500, // Gas cost of BLS12-381 map field element to G1
      Bls12381MapG2Gas: 75000, // Gas cost of BLS12-381 map field element to G2
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
      coldsload: 2100, // Gas cost of the first read of storage from a given location (per transaction)
      coldaccountaccess: 2600, // Gas cost of the first read of a given address (per transaction)
      warmstorageread: 100, // Gas cost of reading storage locations which have already loaded 'cold'
      sstoreCleanGasEIP2200: 2900, // Once per SSTORE operation from clean non-zero to something else
      sstoreNoopGasEIP2200: 100, // Once per SSTORE operation if the value doesn't change
      sstoreDirtyGasEIP2200: 100, // Once per SSTORE operation if a dirty value is changed
      sstoreInitRefundEIP2200: 19900, // Once per SSTORE operation for resetting to the original zero value
      sstoreCleanRefundEIP2200: 4900, // Once per SSTORE operation for resetting to the original non-zero value
      call: 0, // Base fee of the CALL opcode
      callcode: 0, // Base fee of the CALLCODE opcode
      delegatecall: 0, // Base fee of the DELEGATECALL opcode
      staticcall: 0, // Base fee of the STATICCALL opcode
      balance: 0, // Base fee of the BALANCE opcode
      extcodesize: 0, // Base fee of the EXTCODESIZE opcode
      extcodecopy: 0, // Base fee of the EXTCODECOPY opcode
      extcodehash: 0, // Base fee of the EXTCODEHASH opcode
      sload: 0, // Base fee of the SLOAD opcode
      sstore: 0, // Base fee of the SSTORE opcode
    },
  },
  2930: {
    comment: 'Optional access lists',
    url: 'https://eips.ethereum.org/EIPS/eip-2930',
    status: Status.Final,
    minimumHardfork: Hardfork.Istanbul,
    requiredEIPs: [2718, 2929],
    gasPrices: {
      accessListStorageKeyCost: 1900, // Gas cost per storage key in an Access List transaction
      accessListAddressCost: 2400, // Gas cost per storage key in an Access List transaction
    },
  },
  2935: {
    comment: 'Save historical block hashes in state (Verkle related usage, UNSTABLE)',
    url: 'https://github.com/gballet/EIPs/pull/3/commits/2e9ac09a142b0d9fb4db0b8d4609f92e5d9990c5',
    status: Status.Draft,
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
    vm: {
      historyStorageAddress: BigInt('0x0aae40965e6800cd9b1f4b05ff21581047e3f91e'), // The address where the historical blockhashes are stored
      historyServeWindow: BigInt(8192), // The amount of blocks to be served by the historical blockhash contract
    },
  },
  3074: {
    comment: 'AUTH and AUTHCALL opcodes',
    url: 'https://github.com/ethereum/EIPs/commit/eca4416ff3c025fcb6ec8cd4eac481e74e108481',
    status: Status.Review,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
    gasPrices: {
      auth: 3100, // Gas cost of the AUTH opcode
      authcall: 0, // Gas cost of the AUTHCALL opcode
      authcallValueTransfer: 6700, // Paid for CALL when the value transfer is non-zero
    },
  },
  3198: {
    comment: 'BASEFEE opcode',
    url: 'https://eips.ethereum.org/EIPS/eip-3198',
    status: Status.Final,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
    gasPrices: {
      basefee: 2, // Gas cost of the BASEFEE opcode
    },
  },
  3529: {
    comment: 'Reduction in refunds',
    url: 'https://eips.ethereum.org/EIPS/eip-3529',
    status: Status.Final,
    minimumHardfork: Hardfork.Berlin,
    requiredEIPs: [2929],
    gasConfig: {
      maxRefundQuotient: 5, // Maximum refund quotient; max tx refund is min(tx.gasUsed/maxRefundQuotient, tx.gasRefund)
    },
    gasPrices: {
      selfdestructRefund: 0, // Refunded following a selfdestruct operation
      sstoreClearRefundEIP2200: 4800, // Once per SSTORE operation for clearing an originally existing storage slot
    },
  },
  3540: {
    comment: 'EOF - EVM Object Format v1',
    url: 'https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-3540.md',
    status: Status.Review,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3541, 3860],
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
      difficultyBombDelay: 9500000, // the amount of blocks to delay the difficulty bomb with
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
    url: 'https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-3670.md',
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
      push0: 2, // Base fee of the PUSH0 opcode
    },
  },
  3860: {
    comment: 'Limit and meter initcode',
    url: 'https://eips.ethereum.org/EIPS/eip-3860',
    status: Status.Review,
    minimumHardfork: Hardfork.SpuriousDragon,
    requiredEIPs: [],
    gasPrices: {
      initCodeWordCost: 2, // Gas to pay for each word (32 bytes) of initcode when creating a contract
    },
    vm: {
      maxInitCodeSize: 49152, // Maximum length of initialization code when creating a contract
    },
  },
  4200: {
    comment: 'EOF - Static relative jumps',
    url: 'https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-4200.md',
    status: Status.Review,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670],
    gasPrices: {
      rjump: {
        v: 2,
        d: 'Base fee of the RJUMP opcode',
      },
      rjumpi: {
        v: 4,
        d: 'Base fee of the RJUMPI opcode',
      },
      rjumpv: {
        v: 4,
        d: 'Base fee of the RJUMPV opcode',
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
      difficultyBombDelay: 10700000, // the amount of blocks to delay the difficulty bomb with
    },
  },
  4399: {
    comment: 'Supplant DIFFICULTY opcode with PREVRANDAO',
    url: 'https://eips.ethereum.org/EIPS/eip-4399',
    status: Status.Review,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
    gasPrices: {
      prevrandao: 2, // Base fee of the PREVRANDAO opcode (previously DIFFICULTY)
    },
  },
  4750: {
    comment: 'EOF - Functions',
    url: 'https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-4750.md',
    status: Status.Review,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670, 5450],
    gasPrices: {
      callf: {
        v: 5,
        d: 'Base fee of the CALLF opcode',
      },
      retf: {
        v: 3,
        d: 'Base fee of the RETF opcode',
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
      historicalRootsLength: 8191, // The modulo parameter of the beaconroot ring buffer in the beaconroot statefull precompile
    },
  },
  4844: {
    comment: 'Shard Blob Transactions',
    url: 'https://eips.ethereum.org/EIPS/eip-4844',
    status: Status.Draft,
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [1559, 2718, 2930, 4895],
    gasConfig: {
      blobGasPerBlob: 131072, // The base fee for blob gas per blob
      targetBlobGasPerBlock: 393216, // The target blob gas consumed per block
      maxblobGasPerBlock: 786432, // The max blob gas allowable per block
      blobGasPriceUpdateFraction: 3338477, // The denominator used in the exponential when calculating a blob gas price
    },
    gasPrices: {
      simpleGasPerBlob: 12000, // The basic gas fee for each blob
      minBlobGasPrice: 1, // The minimum fee per blob gas
      kzgPointEvaluationGasPrecompilePrice: 50000, // The fee associated with the point evaluation precompile
      blobhash: 3, // Base fee of the BLOBHASH opcode
    },
    sharding: {
      blobCommitmentVersionKzg: 1, // The number indicated a versioned hash is a KZG commitment
      fieldElementsPerBlob: 4096, // The number of field elements allowed per blob
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
      difficultyBombDelay: 11400000, // the amount of blocks to delay the difficulty bomb with
    },
  },
  5450: {
    comment: 'EOF - Stack Validation',
    url: 'https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-5450.md',
    status: Status.Review,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670, 4200, 4750],
  },
  5656: {
    comment: 'MCOPY - Memory copying instruction',
    url: 'https://eips.ethereum.org/EIPS/eip-5656',
    status: Status.Draft,
    minimumHardfork: Hardfork.Shanghai,
    requiredEIPs: [],
    gasPrices: {
      mcopy: 3, // Base fee of the MCOPY opcode
    },
  },
  6110: {
    comment: 'Supply validator deposits on chain',
    url: 'https://eips.ethereum.org/EIPS/eip-6110',
    status: Status.Draft,
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [7685],
  },
  6206: {
    comment: 'EOF - JUMPF and non-returning functions',
    url: 'https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-6206.md',
    status: Status.Review,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [4750, 5450],
    gasPrices: {
      jumpf: {
        v: 5,
        d: 'Base fee of the JUMPF opcode',
      },
    },
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
      create: 1000, // Base fee of the CREATE opcode
      coldsload: 0, // Gas cost of the first read of storage from a given location (per transaction)
    },
    vm: {
      // kaustinen 6 current uses this address, however this will be updated to correct address
      // in next iteration
      historyStorageAddress: BigInt('0xfffffffffffffffffffffffffffffffffffffffe'), // The address where the historical blockhashes are stored
    },
  },
  7002: {
    comment: 'Execution layer triggerable withdrawals (experimental)',
    url: 'https://github.com/ethereum/EIPs/blob/3b5fcad6b35782f8aaeba7d4ac26004e8fbd720f/EIPS/eip-7002.md',
    status: Status.Draft,
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [7685],
    vm: {
      withdrawalRequestType: BigInt(0x01), // The withdrawal request type for EIP-7685
      excessWithdrawalsRequestStorageSlot: BigInt(0), // The storage slot of the excess withdrawals
      withdrawalsRequestCountStorage: BigInt(1), // The storage slot of the withdrawal request count
      withdrawalsRequestQueueHeadStorageSlot: BigInt(2), // The storage slot of the withdrawal request head of the queue
      withdrawalsRequestTailHeadStorageSlot: BigInt(3), // The storage slot of the withdrawal request tail of the queue
      withdrawalsRequestQueueStorageOffset: BigInt(4), // The storage slot of the withdrawal request queue offset
      maxWithdrawalRequestsPerBlock: BigInt(16), // The max withdrawal requests per block
      targetWithdrawalRequestsPerBlock: BigInt(2), // The target withdrawal requests per block
      minWithdrawalRequestFee: BigInt(1), // The minimum withdrawal request fee (in wei)
      withdrawalRequestFeeUpdateFraction: BigInt(17), // The withdrawal request fee update fraction (used in the fake exponential)
      systemAddress: BigInt('0xfffffffffffffffffffffffffffffffffffffffe'), // The system address to perform operations on the withdrawal requests predeploy address
      withdrawalRequestPredeployAddress: BigInt('0x00A3ca265EBcb825B45F985A16CEFB49958cE017'), // Address of the validator excess address
    },
  },
  7069: {
    comment: 'Revamped CALL instructions',
    url: 'https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-7069.md',
    status: Status.Review,
    minimumHardfork: Hardfork.Berlin,
    /* Note: per EIP these are the additionally required EIPs:
      EIP 150 - This is the entire Tangerine Whistle hardfork
      EIP 211 - (RETURNDATASIZE / RETURNDATACOPY) - Included in Byzantium
      EIP 214 - (STATICCALL) - Included in Byzantium
    */
    requiredEIPs: [2929],
    gasPrices: {
      extcall: {
        v: 0,
        d: 'Base fee of the EXTCALL opcode',
      },
      extdelegatecall: {
        v: 0,
        d: 'Base fee of the EXTDELEGATECALL opcode',
      },
      extstaticcall: {
        v: 0,
        d: 'Base fee of the EXTSTATICCALL opcode',
      },
      returndataload: {
        v: 3,
        d: 'Base fee of the RETURNDATALOAD opcode',
      },
      minRetainedGas: {
        v: 5000,
        d: 'Minimum gas retained prior to executing an EXT*CALL opcode (this is the minimum gas available after performing the EXT*CALL)',
      },
      minCalleeGas: {
        v: 2300,
        d: 'Minimum gas available to the the address called by an EXT*CALL opcode',
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
      consolidationRequestType: BigInt(0x02), // The withdrawal request type for EIP-7685
      systemAddress: BigInt('0xfffffffffffffffffffffffffffffffffffffffe'), // The system address to perform operations on the consolidation requests predeploy address
      consolidationRequestPredeployAddress: BigInt('0x00b42dbF2194e931E80326D950320f7d9Dbeac02'), // Address of the consolidations contract
    },
  },
  7480: {
    comment: 'EOF - Data section access instructions',
    url: 'https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-7480.md',
    status: Status.Review,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670],
    gasPrices: {
      dataload: {
        v: 4,
        d: 'Base fee of the DATALOAD opcode',
      },
      dataloadn: {
        v: 3,
        d: 'Base fee of the DATALOADN opcode',
      },
      datasize: {
        v: 2,
        d: 'Base fee of the DATASIZE opcode',
      },
      datacopy: {
        v: 3,
        d: 'Base fee of the DATACOPY opcode',
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
      blobbasefee: 2, // Gas cost of the BLOBBASEFEE opcode
    },
  },
  7620: {
    comment: 'EOF Contract Creation',
    url: 'https://github.com/ethereum/EIPs/blob/dd32a34cfe4473bce143641bfffe4fd67e1987ab/EIPS/eip-7620.md',
    status: Status.Review,
    minimumHardfork: Hardfork.London,
    /* Note: per EIP these are the additionally required EIPs:
      EIP 170 - (Max contract size) - Included in Spurious Dragon
    */
    requiredEIPs: [3540, 3541, 3670],
    gasPrices: {
      eofcreate: {
        v: 32000, // Same as CREATE/CREATE2
        d: 'Base fee of the EOFCREATE opcode',
      },
      returncontract: {
        v: 0,
        d: 'Base fee of the RETURNCONTRACT opcode',
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
  7692: {
    comment: 'EVM Object Format (EOFv1) Meta',
    url: 'https://github.com/ethereum/EIPs/blob/4153e95befd0264082de3c4c2fe3a85cc74d3152/EIPS/eip-7692.md',
    status: Status.Draft,
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [663, 3540, 3670, 4200, 4750, 5450, 6206, 7069, 7480, 7620, 7698],
    gasPrices: {},
  },
  7698: {
    comment: 'EOF - Creation transaction',
    url: 'https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-7698.md',
    status: Status.Draft,
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 7620],
  },
  7702: {
    comment: 'Set EOA account code for one transaction',
    url: 'https://github.com/ethereum/EIPs/blob/62419ca3f45375db00b04a368ea37c0bfb05386a/EIPS/eip-7702.md',
    status: Status.Review,
    // TODO: Set correct minimum hardfork
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [2718, 2929, 2930],
    gasPrices: {
      perAuthBaseCost: 2500, // Gas cost of each authority item
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
