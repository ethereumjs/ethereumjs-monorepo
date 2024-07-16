import type { HardforksDict } from './types.js'

export enum Status {
  Draft = 'draft',
  Review = 'review',
  Final = 'final',
}

export const hardforks: HardforksDict = {
  chainstart: {
    name: 'chainstart',
    comment: 'Start of the Ethereum main chain',
    url: '',
    status: Status.Final,
    gasConfig: {
      minGasLimit: 5000, // Minimum the gas limit may ever be
      gasLimitBoundDivisor: 1024, // The bound divisor of the gas limit, used in update calculations
      maxRefundQuotient: 2, // Maximum refund quotient; max tx refund is min(tx.gasUsed/maxRefundQuotient, tx.gasRefund)
    },
    gasPrices: {
      base: 2, // Gas base cost, used e.g. for ChainID opcode (Istanbul)
      exp: 10, // Base fee of the EXP opcode
      expByte: 10, // Times ceil(log256(exponent)) for the EXP instruction
      keccak256: 30, // Base fee of the SHA3 opcode
      keccak256Word: 6, // Once per word of the SHA3 operation's data
      sload: 50, // Base fee of the SLOAD opcode
      sstoreSet: 20000, // Once per SSTORE operation if the zeroness changes from zero
      sstoreReset: 5000, // Once per SSTORE operation if the zeroness does not change from zero
      sstoreRefund: 15000, // Once per SSTORE operation if the zeroness changes to zero
      jumpdest: 1, // Base fee of the JUMPDEST opcode
      log: 375, // Base fee of the LOG opcode
      logData: 8, // Per byte in a LOG* operation's data
      logTopic: 375, // Multiplied by the * of the LOG*, per LOG transaction. e.g. LOG0 incurs 0 * c_txLogTopicGas, LOG4 incurs 4 * c_txLogTopicGas
      create: 32000, // Base fee of the CREATE opcode
      call: 40, // Base fee of the CALL opcode
      callStipend: 2300, // Free gas given at beginning of call
      callValueTransfer: 9000, // Paid for CALL when the value transfor is non-zero
      callNewAccount: 25000, // Paid for CALL when the destination address didn't exist prior
      selfdestructRefund: 24000, // Refunded following a selfdestruct operation
      memory: 3, // Times the address of the (highest referenced byte in memory + 1). NOTE: referencing happens on read, write and in instructions such as RETURN and CALL
      quadCoeffDiv: 512, // Divisor for the quadratic particle of the memory cost equation
      createData: 200, //
      tx: 21000, // Per transaction. NOTE: Not payable on data of calls between transactions
      txCreation: 32000, // The cost of creating a contract via tx
      txDataZero: 4, // Per byte of data attached to a transaction that equals zero. NOTE: Not payable on data of calls between transactions
      txDataNonZero: 68, // Per byte of data attached to a transaction that is not equal to zero. NOTE: Not payable on data of calls between transactions
      copy: 3, // Multiplied by the number of 32-byte words that are copied (round up) for any *COPY operation and added
      ecRecover: 3000,
      sha256: 60,
      sha256Word: 12,
      ripemd160: 600,
      ripemd160Word: 120,
      identity: 15,
      identityWord: 3,
      stop: 0, // Base fee of the STOP opcode
      add: 3, // Base fee of the ADD opcode
      mul: 5, // Base fee of the MUL opcode
      sub: 3, // Base fee of the SUB opcode
      div: 5, // Base fee of the DIV opcode
      sdiv: 5, // Base fee of the SDIV opcode
      mod: 5, // Base fee of the MOD opcode
      smod: 5, // Base fee of the SMOD opcode
      addmod: 8, // Base fee of the ADDMOD opcode
      mulmod: 8, // Base fee of the MULMOD opcode
      signextend: 5, // Base fee of the SIGNEXTEND opcode
      lt: 3, // Base fee of the LT opcode
      gt: 3, // Base fee of the GT opcode
      slt: 3, // Base fee of the SLT opcode
      sgt: 3, // Base fee of the SGT opcode
      eq: 3, // Base fee of the EQ opcode
      iszero: 3, // Base fee of the ISZERO opcode
      and: 3, // Base fee of the AND opcode
      or: 3, // Base fee of the OR opcode
      xor: 3, // Base fee of the XOR opcode
      not: 3, // Base fee of the NOT opcode
      byte: 3, // Base fee of the BYTE opcode
      address: 2, // Base fee of the ADDRESS opcode
      balance: 20, // Base fee of the BALANCE opcode
      origin: 2, // Base fee of the ORIGIN opcode
      caller: 2, // Base fee of the CALLER opcode
      callvalue: 2, // Base fee of the CALLVALUE opcode
      calldataload: 3, // Base fee of the CALLDATALOAD opcode
      calldatasize: 2, // Base fee of the CALLDATASIZE opcode
      calldatacopy: 3, // Base fee of the CALLDATACOPY opcode
      codesize: 2, // Base fee of the CODESIZE opcode
      codecopy: 3, // Base fee of the CODECOPY opcode
      gasprice: 2, // Base fee of the GASPRICE opcode
      extcodesize: 20, // Base fee of the EXTCODESIZE opcode
      extcodecopy: 20, // Base fee of the EXTCODECOPY opcode
      blockhash: 20, // Base fee of the BLOCKHASH opcode
      coinbase: 2, // Base fee of the COINBASE opcode
      timestamp: 2, // Base fee of the TIMESTAMP opcode
      number: 2, // Base fee of the NUMBER opcode
      difficulty: 2, // Base fee of the DIFFICULTY opcode
      gaslimit: 2, // Base fee of the GASLIMIT opcode
      pop: 2, // Base fee of the POP opcode
      mload: 3, // Base fee of the MLOAD opcode
      mstore: 3, // Base fee of the MSTORE opcode
      mstore8: 3, // Base fee of the MSTORE8 opcode
      sstore: 0, // Base fee of the SSTORE opcode
      jump: 8, // Base fee of the JUMP opcode
      jumpi: 10, // Base fee of the JUMPI opcode
      pc: 2, // Base fee of the PC opcode
      msize: 2, // Base fee of the MSIZE opcode
      gas: 2, // Base fee of the GAS opcode
      push: 3, // Base fee of the PUSH opcode
      dup: 3, // Base fee of the DUP opcode
      swap: 3, // Base fee of the SWAP opcode
      callcode: 40, // Base fee of the CALLCODE opcode
      return: 0, // Base fee of the RETURN opcode
      invalid: 0, // Base fee of the INVALID opcode
      selfdestruct: 0, // Base fee of the SELFDESTRUCT opcode
    },
    vm: {
      stackLimit: 1024, // Maximum size of VM stack allowed
      callCreateDepth: 1024, // Maximum depth of call/create stack
      maxExtraDataSize: 32, // Maximum size extra data may be after Genesis
    },
    pow: {
      minimumDifficulty: 131072, // The minimum that the difficulty may ever be
      difficultyBoundDivisor: 2048, // The bound divisor of the difficulty, used in the update calculations
      durationLimit: 13, // The decision boundary on the blocktime duration used to determine whether difficulty should go up or not
      epochDuration: 30000, // Duration between proof-of-work epochs
      timebombPeriod: 100000, // Exponential difficulty timebomb period
      minerReward: BigInt('5000000000000000000'), // the amount a miner get rewarded for mining a block
      difficultyBombDelay: 0, // the amount of blocks to delay the difficulty bomb with
    },
  },
  homestead: {
    name: 'homestead',
    comment: 'Homestead hardfork with protocol and network changes',
    url: 'https://eips.ethereum.org/EIPS/eip-606',
    status: Status.Final,
    gasPrices: {
      delegatecall: 40, // Base fee of the DELEGATECALL opcode
    },
  },
  dao: {
    name: 'dao',
    comment: 'DAO rescue hardfork',
    url: 'https://eips.ethereum.org/EIPS/eip-779',
    status: Status.Final,
  },
  tangerineWhistle: {
    name: 'tangerineWhistle',
    comment: 'Hardfork with gas cost changes for IO-heavy operations',
    url: 'https://eips.ethereum.org/EIPS/eip-608',
    status: Status.Final,
    gasPrices: {
      sload: 200, // Once per SLOAD operation
      call: 700, // Once per CALL operation & message call transaction
      extcodesize: 700, // Base fee of the EXTCODESIZE opcode
      extcodecopy: 700, // Base fee of the EXTCODECOPY opcode
      balance: 400, // Base fee of the BALANCE opcode
      delegatecall: 700, // Base fee of the DELEGATECALL opcode
      callcode: 700, // Base fee of the CALLCODE opcode
      selfdestruct: 5000, // Base fee of the SELFDESTRUCT opcode
    },
  },
  spuriousDragon: {
    name: 'spuriousDragon',
    comment:
      'HF with EIPs for simple replay attack protection, EXP cost increase, state trie clearing, contract code size limit',
    url: 'https://eips.ethereum.org/EIPS/eip-607',
    status: Status.Final,
    gasPrices: {
      expByte: 50, // Times ceil(log256(exponent)) for the EXP instruction
    },
    vm: {
      maxCodeSize: 24576, // Maximum length of contract code
    },
  },
  byzantium: {
    name: 'byzantium',
    comment: 'Hardfork with new precompiles, instructions and other protocol changes',
    url: 'https://eips.ethereum.org/EIPS/eip-609',
    status: Status.Final,
    gasPrices: {
      modexpGquaddivisor: 20, // Gquaddivisor from modexp precompile for gas calculation
      ecAdd: 500, // Gas costs for curve addition precompile
      ecMul: 40000, // Gas costs for curve multiplication precompile
      ecPairing: 100000, // Base gas costs for curve pairing precompile
      ecPairingWord: 80000, // Gas costs regarding curve pairing precompile input length
      revert: 0, // Base fee of the REVERT opcode
      staticcall: 700, // Base fee of the STATICCALL opcode
      returndatasize: 2, // Base fee of the RETURNDATASIZE opcode
      returndatacopy: 3, // Base fee of the RETURNDATACOPY opcode
    },
    pow: {
      minerReward: BigInt('3000000000000000000'), // the amount a miner get rewarded for mining a block
      difficultyBombDelay: 3000000, // the amount of blocks to delay the difficulty bomb with
    },
  },
  constantinople: {
    name: 'constantinople',
    comment: 'Postponed hardfork including EIP-1283 (SSTORE gas metering changes)',
    url: 'https://eips.ethereum.org/EIPS/eip-1013',
    status: Status.Final,
    gasPrices: {
      netSstoreNoopGas: 200, // Once per SSTORE operation if the value doesn't change
      netSstoreInitGas: 20000, // Once per SSTORE operation from clean zero
      netSstoreCleanGas: 5000, // Once per SSTORE operation from clean non-zero
      netSstoreDirtyGas: 200, // Once per SSTORE operation from dirty
      netSstoreClearRefund: 15000, // Once per SSTORE operation for clearing an originally existing storage slot
      netSstoreResetRefund: 4800, // Once per SSTORE operation for resetting to the original non-zero value
      netSstoreResetClearRefund: 19800, // Once per SSTORE operation for resetting to the original zero value
      shl: 3, // Base fee of the SHL opcode
      shr: 3, // Base fee of the SHR opcode
      sar: 3, // Base fee of the SAR opcode
      extcodehash: 400, // Base fee of the EXTCODEHASH opcode
      create2: 32000, // Base fee of the CREATE2 opcode
    },
    pow: {
      minerReward: BigInt('2000000000000000000'), // The amount a miner gets rewarded for mining a block
      difficultyBombDelay: 5000000, // the amount of blocks to delay the difficulty bomb with
    },
  },
  petersburg: {
    name: 'petersburg',
    comment:
      'Aka constantinopleFix, removes EIP-1283, activate together with or after constantinople',
    url: 'https://eips.ethereum.org/EIPS/eip-1716',
    status: Status.Final,
    gasPrices: {
      netSstoreNoopGas: null, // Removed along EIP-1283
      netSstoreInitGas: null, // Removed along EIP-1283
      netSstoreCleanGas: null, // Removed along EIP-1283
      netSstoreDirtyGas: null, // Removed along EIP-1283
      netSstoreClearRefund: null, // Removed along EIP-1283
      netSstoreResetRefund: null, // Removed along EIP-1283
      netSstoreResetClearRefund: null, // Removed along EIP-1283
    },
  },
  istanbul: {
    name: 'istanbul',
    comment: 'HF targeted for December 2019 following the Constantinople/Petersburg HF',
    url: 'https://eips.ethereum.org/EIPS/eip-1679',
    status: Status.Final,
    gasConfig: {},
    gasPrices: {
      blake2Round: 1, // Gas cost per round for the Blake2 F precompile
      ecAdd: 150, // Gas costs for curve addition precompile
      ecMul: 6000, // Gas costs for curve multiplication precompile
      ecPairing: 45000, // Base gas costs for curve pairing precompile
      ecPairingWord: 34000, // Gas costs regarding curve pairing precompile input length
      txDataNonZero: 16, // Per byte of data attached to a transaction that is not equal to zero. NOTE: Not payable on data of calls between transactions
      sstoreSentryGasEIP2200: 2300, // Minimum gas required to be present for an SSTORE call, not consumed
      sstoreNoopGasEIP2200: 800, // Once per SSTORE operation if the value doesn't change
      sstoreDirtyGasEIP2200: 800, // Once per SSTORE operation if a dirty value is changed
      sstoreInitGasEIP2200: 20000, // Once per SSTORE operation from clean zero to non-zero
      sstoreInitRefundEIP2200: 19200, // Once per SSTORE operation for resetting to the original zero value
      sstoreCleanGasEIP2200: 5000, // Once per SSTORE operation from clean non-zero to something else
      sstoreCleanRefundEIP2200: 4200, // Once per SSTORE operation for resetting to the original non-zero value
      sstoreClearRefundEIP2200: 15000, // Once per SSTORE operation for clearing an originally existing storage slot
      balance: 700, // Base fee of the BALANCE opcode
      extcodehash: 700, // Base fee of the EXTCODEHASH opcode
      chainid: 2, // Base fee of the CHAINID opcode
      selfbalance: 5, // Base fee of the SELFBALANCE opcode
      sload: 800, // Base fee of the SLOAD opcode
    },
  },
  muirGlacier: {
    name: 'muirGlacier',
    comment: 'HF to delay the difficulty bomb',
    url: 'https://eips.ethereum.org/EIPS/eip-2384',
    status: Status.Final,
    pow: {
      difficultyBombDelay: 9000000, // the amount of blocks to delay the difficulty bomb with
    },
  },
  berlin: {
    name: 'berlin',
    comment: 'HF targeted for July 2020 following the Muir Glacier HF',
    url: 'https://eips.ethereum.org/EIPS/eip-2070',
    status: Status.Final,
    eips: [2565, 2929, 2718, 2930],
  },
  london: {
    name: 'london',
    comment: 'HF targeted for July 2021 following the Berlin fork',
    url: 'https://github.com/ethereum/eth1.0-specs/blob/master/network-upgrades/mainnet-upgrades/london.md',
    status: Status.Final,
    eips: [1559, 3198, 3529, 3541],
  },
  arrowGlacier: {
    name: 'arrowGlacier',
    comment: 'HF to delay the difficulty bomb',
    url: 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/arrow-glacier.md',
    status: Status.Final,
    eips: [4345],
  },
  grayGlacier: {
    name: 'grayGlacier',
    comment: 'Delaying the difficulty bomb to Mid September 2022',
    url: 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/gray-glacier.md',
    status: Status.Final,
    eips: [5133],
  },
  paris: {
    name: 'paris',
    comment: 'Hardfork to upgrade the consensus mechanism to Proof-of-Stake',
    url: 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/merge.md',
    status: Status.Final,
    consensus: {
      type: 'pos',
      algorithm: 'casper',
      casper: {},
    },
    eips: [3675, 4399],
  },
  mergeForkIdTransition: {
    name: 'mergeForkIdTransition',
    comment: 'Pre-merge hardfork to fork off non-upgraded clients',
    url: 'https://eips.ethereum.org/EIPS/eip-3675',
    status: Status.Final,
    eips: [],
  },
  shanghai: {
    name: 'shanghai',
    comment:
      'Next feature hardfork after the merge hardfork having withdrawals, warm coinbase, push0, limit/meter initcode',
    url: 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/shanghai.md',
    status: Status.Final,
    eips: [3651, 3855, 3860, 4895],
  },
  cancun: {
    name: 'cancun',
    comment:
      'Next feature hardfork after shanghai, includes proto-danksharding EIP 4844 blobs (still WIP hence not for production use), transient storage opcodes, parent beacon block root availability in EVM, selfdestruct only in same transaction, and blob base fee opcode',
    url: 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/cancun.md',
    status: Status.Final,
    eips: [1153, 4844, 4788, 5656, 6780, 7516],
  },
  prague: {
    name: 'prague',
    comment:
      'Next feature hardfork after cancun, internally used for pectra testing/implementation (incomplete/experimental)',
    url: 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/prague.md',
    status: Status.Draft,
    // TODO update this accordingly to the right devnet setup
    //eips: [663, 3540, 3670, 4200, 4750, 5450, 6206, 7069, 7480, 7620, 7692, 7698], // This is EOF-only
    eips: [2537, 2935, 6110, 7002, 7251, 7685, 7702], // This is current prague without EOF
  },
  osaka: {
    name: 'osaka',
    comment:
      'Next feature hardfork after prague, internally used for verkle testing/implementation (incomplete/experimental)',
    url: 'https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/osaka.md',
    status: Status.Draft,
    eips: [2935, 6800],
  },
}
