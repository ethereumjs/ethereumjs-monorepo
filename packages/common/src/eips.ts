import { Hardfork } from './enums.js'

import type { EIPConfig } from './types.js'

type EIPsDict = {
  [key: string]: EIPConfig
}

export const EIPs: EIPsDict = {
  /**
   * Description : SWAPN, DUPN and EXCHANGE instructions
   * URL         : https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-663.md
   * Status      : Review
   */
  663: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [3540, 5450],
    gasPrices: {
      dupnGas: 3, // Base fee of the DUPN opcode
      swapnGas: 3, // Base fee of the SWAPN opcode
      exchangeGas: 3, // Base fee of the EXCHANGE opcode
    },
  },
  /**
   * Description : Transient storage opcodes
   * URL         : https://eips.ethereum.org/EIPS/eip-1153
   * Status      : Final
   */
  1153: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
    gasPrices: {
      tstoreGas: 100, // Base fee of the TSTORE opcode
      tloadGas: 100, // Base fee of the TLOAD opcode
    },
  },
  /**
   * Description : Fee market change for ETH 1.0 chain
   * URL         : https://eips.ethereum.org/EIPS/eip-1559
   * Status      : Final
   */
  1559: {
    minimumHardfork: Hardfork.Berlin,
    requiredEIPs: [2930],
    gasConfig: {
      baseFeeMaxChangeDenominatorGas: 8, // Maximum base fee change denominator
      elasticityMultiplierGas: 2, // Maximum block gas target elasticity
      initialBaseFeeGas: 1000000000, // Initial base fee on first EIP1559 block
    },
  },
  /**
   * Description : ModExp gas cost
   * URL         : https://eips.ethereum.org/EIPS/eip-2565
   * Status      : Final
   */
  2565: {
    minimumHardfork: Hardfork.Byzantium,
    requiredEIPs: [],
    gasPrices: {
      modexpGquaddivisorGas: 3, // Gquaddivisor from modexp precompile for gas calculation
    },
  },
  /**
   * Description : BLS12-381 precompiles
   * URL         : https://eips.ethereum.org/EIPS/eip-2537
   * Status      : Review
   */
  2537: {
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
  /**
   * Description : Typed Transaction Envelope
   * URL         : https://eips.ethereum.org/EIPS/eip-2718
   * Status      : Final
   */
  2718: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
  },
  /**
   * Description : Gas cost increases for state access opcodes
   * URL         : https://eips.ethereum.org/EIPS/eip-2929
   * Status      : Final
   */
  2929: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
    gasPrices: {
      coldsloadGas: 2100, // Gas cost of the first read of storage from a given location (per transaction)
      coldaccountaccessGas: 2600, // Gas cost of the first read of a given address (per transaction)
      warmstoragereadGas: 100, // Gas cost of reading storage locations which have already loaded 'cold'
      sstoreCleanEIP2200Gas: 2900, // Once per SSTORE operation from clean non-zero to something else
      sstoreNoopEIP2200Gas: 100, // Once per SSTORE operation if the value doesn't change
      sstoreDirtyEIP2200Gas: 100, // Once per SSTORE operation if a dirty value is changed
      sstoreInitRefundEIP2200Gas: 19900, // Once per SSTORE operation for resetting to the original zero value
      sstoreCleanRefundEIP2200Gas: 4900, // Once per SSTORE operation for resetting to the original non-zero value
      callGas: 0, // Base fee of the CALL opcode
      callcodeGas: 0, // Base fee of the CALLCODE opcode
      delegatecallGas: 0, // Base fee of the DELEGATECALL opcode
      staticcallGas: 0, // Base fee of the STATICCALL opcode
      balanceGas: 0, // Base fee of the BALANCE opcode
      extcodesizeGas: 0, // Base fee of the EXTCODESIZE opcode
      extcodecopyGas: 0, // Base fee of the EXTCODECOPY opcode
      extcodehashGas: 0, // Base fee of the EXTCODEHASH opcode
      sloadGas: 0, // Base fee of the SLOAD opcode
      sstoreGas: 0, // Base fee of the SSTORE opcode
    },
  },
  /**
   * Description : Optional access lists
   * URL         : https://eips.ethereum.org/EIPS/eip-2930
   * Status      : Final
   */
  2930: {
    minimumHardfork: Hardfork.Istanbul,
    requiredEIPs: [2718, 2929],
    gasPrices: {
      accessListStorageKeyGas: 1900, // Gas cost per storage key in an Access List transaction
      accessListAddressGas: 2400, // Gas cost per storage key in an Access List transaction
    },
  },
  /**
   * Description : Save historical block hashes in state (Verkle related usage, UNSTABLE)
   * URL         : https://github.com/gballet/EIPs/pull/3/commits/2e9ac09a142b0d9fb4db0b8d4609f92e5d9990c5
   * Status      : Draft
   */
  2935: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
    vm: {
      historyStorageAddress: BigInt('0x0aae40965e6800cd9b1f4b05ff21581047e3f91e'), // The address where the historical blockhashes are stored
      historyServeWindow: BigInt(8192), // The amount of blocks to be served by the historical blockhash contract
    },
  },
  /**
   * Description : AUTH and AUTHCALL opcodes
   * URL         : https://github.com/ethereum/EIPs/commit/eca4416ff3c025fcb6ec8cd4eac481e74e108481
   * Status      : Review
   */
  3074: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
    gasPrices: {
      authGas: 3100, // Gas cost of the AUTH opcode
      authcallGas: 0, // Gas cost of the AUTHCALL opcode
      authcallValueTransferGas: 6700, // Paid for CALL when the value transfer is non-zero
    },
  },
  /**
   * Description : BASEFEE opcode
   * URL         : https://eips.ethereum.org/EIPS/eip-3198
   * Status      : Final
   */
  3198: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
    gasPrices: {
      basefeeGas: 2, // Gas cost of the BASEFEE opcode
    },
  },
  /**
   * Description : Reduction in refunds
   * URL         : https://eips.ethereum.org/EIPS/eip-3529
   * Status      : Final
   */
  3529: {
    minimumHardfork: Hardfork.Berlin,
    requiredEIPs: [2929],
    gasConfig: {
      maxRefundQuotientGas: 5, // Maximum refund quotient; max tx refund is min(tx.gasUsed/maxRefundQuotient, tx.gasRefund)
    },
    gasPrices: {
      selfdestructRefundGas: 0, // Refunded following a selfdestruct operation
      sstoreClearRefundEIP2200Gas: 4800, // Once per SSTORE operation for clearing an originally existing storage slot
    },
  },
  /**
   * Description : EVM Object Format (EOF) v1
   * URL         : https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-3540.md
   * Status      : Review
   */
  3540: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3541, 3860],
  },
  /**
   * Description : Reject new contracts starting with the 0xEF byte
   * URL         : https://eips.ethereum.org/EIPS/eip-3541
   * Status      : Final
   */
  3541: {
    minimumHardfork: Hardfork.Berlin,
    requiredEIPs: [],
  },
  /**
   * Description : Difficulty Bomb Delay to December 1st 2021
   * URL         : https://eips.ethereum.org/EIPS/eip-3554
   * Status      : Final
   */
  3554: {
    minimumHardfork: Hardfork.MuirGlacier,
    requiredEIPs: [],
    pow: {
      difficultyBombDelay: 9500000, // the amount of blocks to delay the difficulty bomb with
    },
  },
  /**
   * Description : Reject transactions from senders with deployed code
   * URL         : https://eips.ethereum.org/EIPS/eip-3607
   * Status      : Final
   */
  3607: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
  },
  /**
   * Description : Warm COINBASE
   * URL         : https://eips.ethereum.org/EIPS/eip-3651
   * Status      : Final
   */
  3651: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [2929],
  },
  /**
   * Description : EOF - Code Validation
   * URL         : https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-3670.md
   * Status      : Review
   */
  3670: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540],
  },
  /**
   * Description : Upgrade consensus to Proof-of-Stake
   * URL         : https://eips.ethereum.org/EIPS/eip-3675
   * Status      : Final
   */
  3675: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
  },
  /**
   * Description : PUSH0 instruction
   * URL         : https://eips.ethereum.org/EIPS/eip-3855
   * Status      : Final
   */
  3855: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [],
    gasPrices: {
      push0Gas: 2, // Base fee of the PUSH0 opcode
    },
  },
  /**
   * Description : Limit and meter initcode
   * URL         : https://eips.ethereum.org/EIPS/eip-3860
   * Status      : Final
   */
  3860: {
    minimumHardfork: Hardfork.SpuriousDragon,
    requiredEIPs: [],
    gasPrices: {
      initCodeWordGas: 2, // Gas to pay for each word (32 bytes) of initcode when creating a contract
    },
    vm: {
      maxInitCodeSize: 49152, // Maximum length of initialization code when creating a contract
    },
  },
  /**
   * Description : EOF - Static relative jumps
   * URL         : https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-4200.md
   * Status      : Review
   */
  4200: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670],
    gasPrices: {
      rjumpGas: 2, // Base fee of the RJUMP opcode
      rjumpiGas: 4, // Base fee of the RJUMPI opcode
      rjumpvGas: 4, // Base fee of the RJUMPV opcode
    },
  },
  /**
   * Description : Difficulty Bomb Delay to June 2022
   * URL         : https://eips.ethereum.org/EIPS/eip-4345
   * Status      : Final
   */
  4345: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
    pow: {
      difficultyBombDelay: 10700000, // the amount of blocks to delay the difficulty bomb with
    },
  },
  /**
   * Description : Supplant DIFFICULTY opcode with PREVRANDAO
   * URL         : https://eips.ethereum.org/EIPS/eip-4399
   * Status      : Final
   */
  4399: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
    gasPrices: {
      prevrandaoGas: 2, // Base fee of the PREVRANDAO opcode (previously DIFFICULTY)
    },
  },
  /**
   * Description : EOF - Functions
   * URL         : https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-4750.md
   * Status      : Review
   */
  4750: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670, 5450],
    gasPrices: {
      callfGas: 5, // Base fee of the CALLF opcode
      retfGas: 3, // Base fee of the RETF opcode
    },
  },
  /**
   * Description : Beacon block root in the EVM
   * URL         : https://eips.ethereum.org/EIPS/eip-4788
   * Status      : Final
   */
  4788: {
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [],
    gasPrices: {},
    vm: {
      historicalRootsLength: 8191, // The modulo parameter of the beaconroot ring buffer in the beaconroot statefull precompile
    },
  },
  /**
   * Description : Shard Blob Transactions
   * URL         : https://eips.ethereum.org/EIPS/eip-4844
   * Status      : Final
   */
  4844: {
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [1559, 2718, 2930, 4895],
    gasConfig: {
      blobGasPerBlob: 131072, // The base fee for blob gas per blob
      targetBlobGasPerBlock: 393216, // The target blob gas consumed per block
      maxblobGasPerBlock: 786432, // The max blob gas allowable per block
      blobGasPriceUpdateFraction: 3338477, // The denominator used in the exponential when calculating a blob gas price
    },
    gasPrices: {
      simplePerBlobGas: 12000, // The basic gas fee for each blob
      minBlobGas: 1, // The minimum fee per blob gas
      kzgPointEvaluationPrecompileGas: 50000, // The fee associated with the point evaluation precompile
      blobhashGas: 3, // Base fee of the BLOBHASH opcode
    },
    sharding: {
      blobCommitmentVersionKzg: 1, // The number indicated a versioned hash is a KZG commitment
      fieldElementsPerBlob: 4096, // The number of field elements allowed per blob
    },
  },
  /**
   * Description : Beacon chain push withdrawals as operations
   * URL         : https://eips.ethereum.org/EIPS/eip-4895
   * Status      : Final
   */
  4895: {
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [],
  },
  /**
   * Description : Delaying Difficulty Bomb to mid-September 2022
   * URL         : https://eips.ethereum.org/EIPS/eip-5133
   * Status      : Final
   */
  5133: {
    minimumHardfork: Hardfork.GrayGlacier,
    requiredEIPs: [],
    pow: {
      difficultyBombDelay: 11400000, // the amount of blocks to delay the difficulty bomb with
    },
  },
  /**
   * Description : EOF - Stack Validation
   * URL         : https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-5450.md
   * Status      : Review
   */
  5450: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670, 4200, 4750],
  },
  /**
   * Description : MCOPY - Memory copying instruction
   * URL         : https://eips.ethereum.org/EIPS/eip-5656
   * Status      : Final
   */
  5656: {
    minimumHardfork: Hardfork.Shanghai,
    requiredEIPs: [],
    gasPrices: {
      mcopyGas: 3, // Base fee of the MCOPY opcode
    },
  },
  /**
   * Description : Supply validator deposits on chain
   * URL         : https://eips.ethereum.org/EIPS/eip-6110
   * Status      : Review
   */
  6110: {
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [7685],
  },
  /**
   * Description : EOF - JUMPF and non-returning functions
   * URL         : https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-6206.md
   * Status      : Review
   */
  6206: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [4750, 5450],
    gasPrices: {
      jumpfGas: 5, // Base fee of the JUMPF opcode
    },
  },
  /**
   * Description : SELFDESTRUCT only in same transaction
   * URL         : https://eips.ethereum.org/EIPS/eip-6780
   * Status      : Final
   */
  6780: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
  },
  /**
   * Description : Ethereum state using a unified verkle tree (experimental)
   * URL         : https://github.com/ethereum/EIPs/pull/6800
   * Status      : Draft
   */
  6800: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [],
    gasPrices: {
      createGas: 1000, // Base fee of the CREATE opcode
      coldsloadGas: 0, // Gas cost of the first read of storage from a given location (per transaction)
    },
    vm: {
      // kaustinen 6 current uses this address, however this will be updated to correct address
      // in next iteration
      historyStorageAddress: BigInt('0xfffffffffffffffffffffffffffffffffffffffe'), // The address where the historical blockhashes are stored
    },
  },
  /**
   * Description : Execution layer triggerable withdrawals (experimental)
   * URL         : https://github.com/ethereum/EIPs/blob/3b5fcad6b35782f8aaeba7d4ac26004e8fbd720f/EIPS/eip-7002.md
   * Status      : Review
   */
  7002: {
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
  /**
   * Description : Revamped CALL instructions
   * URL         : https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-7069.md
   * Status      : Review
   */
  7069: {
    minimumHardfork: Hardfork.Berlin,
    /* Note: per EIP these are the additionally required EIPs:
      EIP 150 - This is the entire Tangerine Whistle hardfork
      EIP 211 - (RETURNDATASIZE / RETURNDATACOPY) - Included in Byzantium
      EIP 214 - (STATICCALL) - Included in Byzantium
    */
    requiredEIPs: [2929],
    gasPrices: {
      extcallGas: 0, // Base fee of the EXTCALL opcode
      extdelegatecallGas: 0, // Base fee of the EXTDELEGATECALL opcode
      extstaticcallGas: 0, // Base fee of the EXTSTATICCALL opcode
      returndataloadGas: 3, // Base fee of the RETURNDATALOAD opcode
      minRetainedGas: 5000, // Minimum gas retained prior to executing an EXT*CALL opcode (this is the minimum gas available after performing the EXT*CALL)
      minCalleeGas: 2300, //Minimum gas available to the the address called by an EXT*CALL opcode
    },
  },
  /**
   * Description : Increase the MAX_EFFECTIVE_BALANCE -> Execution layer triggered consolidations (experimental)
   * URL         : https://eips.ethereum.org/EIPS/eip-7251
   * Status      : Draft
   */
  7251: {
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [7685],
    vm: {
      consolidationRequestType: BigInt(0x02), // The withdrawal request type for EIP-7685
      systemAddress: BigInt('0xfffffffffffffffffffffffffffffffffffffffe'), // The system address to perform operations on the consolidation requests predeploy address
      consolidationRequestPredeployAddress: BigInt('0x00b42dbF2194e931E80326D950320f7d9Dbeac02'), // Address of the consolidations contract
    },
  },
  /**
   * Description : EOF - Data section access instructions
   * URL         : https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-7480.md
   * Status      : Review
   */
  7480: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 3670],
    gasPrices: {
      dataloadGas: 4, // Base fee of the DATALOAD opcode
      dataloadnGas: 3, // Base fee of the DATALOADN opcode
      datasizeGas: 2, // Base fee of the DATASIZE opcode
      datacopyGas: 3, // Base fee of the DATACOPY opcode
    },
  },
  /**
   * Description : BLOBBASEFEE opcode
   * URL         : https://eips.ethereum.org/EIPS/eip-7516
   * Status      : Final
   */
  7516: {
    minimumHardfork: Hardfork.Paris,
    requiredEIPs: [4844],
    gasPrices: {
      blobbasefeeGas: 2, // Gas cost of the BLOBBASEFEE opcode
    },
  },
  /**
   * Description : EOF Contract Creation
   * URL         : https://github.com/ethereum/EIPs/blob/dd32a34cfe4473bce143641bfffe4fd67e1987ab/EIPS/eip-7620.md
   * Status      : Review
   */
  7620: {
    minimumHardfork: Hardfork.London,
    /* Note: per EIP these are the additionally required EIPs:
      EIP 170 - (Max contract size) - Included in Spurious Dragon
    */
    requiredEIPs: [3540, 3541, 3670],
    gasPrices: {
      eofcreateGas: 32000, // Base fee of the EOFCREATE opcode (Same as CREATE/CREATE2)
      returncontractGas: 0, // Base fee of the RETURNCONTRACT opcode
    },
  },
  /**
   * Description : General purpose execution layer requests
   * URL         : https://eips.ethereum.org/EIPS/eip-7685
   * Status      : Review
   */
  7685: {
    // TODO: Set correct minimum hardfork
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [3675],
    gasPrices: {},
  },
  /**
   * Description : EVM Object Format (EOFv1) Meta
   * URL         : https://github.com/ethereum/EIPs/blob/4153e95befd0264082de3c4c2fe3a85cc74d3152/EIPS/eip-7692.md
   * Status      : Draft
   */
  7692: {
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [663, 3540, 3670, 4200, 4750, 5450, 6206, 7069, 7480, 7620, 7698],
    gasPrices: {},
  },
  /**
   * Description : EOF - Creation transaction
   * URL         : https://github.com/ethereum/EIPs/blob/bd421962b4e241aa2b00a85d9cf4e57770bdb954/EIPS/eip-7698.md
   * Status      : Draft
   */
  7698: {
    minimumHardfork: Hardfork.London,
    requiredEIPs: [3540, 7620],
  },
  /**
   * Description : Set EOA account code for one transaction
   * URL         : https://github.com/ethereum/EIPs/blob/62419ca3f45375db00b04a368ea37c0bfb05386a/EIPS/eip-7702.md
   * Status      : Review
   */
  7702: {
    // TODO: Set correct minimum hardfork
    minimumHardfork: Hardfork.Cancun,
    requiredEIPs: [2718, 2929, 2930],
    gasPrices: {
      perAuthBaseGas: 2500, // Gas cost of each authority item
    },
  },
  /**
   * Description : Use historical block hashes saved in state for BLOCKHASH
   * URL         : https://eips.ethereum.org/EIPS/eip-7709
   * Status      : Final
   */
  7709: {
    minimumHardfork: Hardfork.Chainstart,
    requiredEIPs: [2935],
  },
}
