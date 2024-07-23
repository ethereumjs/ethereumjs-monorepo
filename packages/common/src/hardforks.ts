import type { HardforksDict } from './types.js'

export const hardforks: HardforksDict = {
  /**
   * Description: Start of the Ethereum main chain
   * URL        : -
   * Status     : Final
   */
  chainstart: {
    gasConfig: {
      minGasLimit: 5000, // Minimum the gas limit may ever be
      gasLimitBoundDivisor: 1024, // The bound divisor of the gas limit, used in update calculations
      maxRefundQuotient: 2, // Maximum refund quotient; max tx refund is min(tx.gasUsed/maxRefundQuotient, tx.gasRefund)
    },
    gasPrices: {
      baseGas: 2, // Gas base cost, used e.g. for ChainID opcode (Istanbul)
      expGas: 10, // Base fee of the EXP opcode
      expByteGas: 10, // Times ceil(log256(exponent)) for the EXP instruction
      keccak256Gas: 30, // Base fee of the SHA3 opcode
      keccak256WordGas: 6, // Once per word of the SHA3 operation's data
      sloadGas: 50, // Base fee of the SLOAD opcode
      sstoreSetGas: 20000, // Once per SSTORE operation if the zeroness changes from zero
      sstoreResetGas: 5000, // Once per SSTORE operation if the zeroness does not change from zero
      sstoreRefundGas: 15000, // Once per SSTORE operation if the zeroness changes to zero
      jumpdestGas: 1, // Base fee of the JUMPDEST opcode
      logGas: 375, // Base fee of the LOG opcode
      logDataGas: 8, // Per byte in a LOG* operation's data
      logTopicGas: 375, // Multiplied by the * of the LOG*, per LOG transaction. e.g. LOG0 incurs 0 * c_txLogTopicGas, LOG4 incurs 4 * c_txLogTopicGas
      createGas: 32000, // Base fee of the CREATE opcode
      callGas: 40, // Base fee of the CALL opcode
      callStipendGas: 2300, // Free gas given at beginning of call
      callValueTransferGas: 9000, // Paid for CALL when the value transfor is non-zero
      callNewAccountGas: 25000, // Paid for CALL when the destination address didn't exist prior
      selfdestructRefundGas: 24000, // Refunded following a selfdestruct operation
      memoryGas: 3, // Times the address of the (highest referenced byte in memory + 1). NOTE: referencing happens on read, write and in instructions such as RETURN and CALL
      quadCoeffDivGas: 512, // Divisor for the quadratic particle of the memory cost equation
      createDataGas: 200, //
      txGas: 21000, // Per transaction. NOTE: Not payable on data of calls between transactions
      txCreationGas: 32000, // The cost of creating a contract via tx
      txDataZeroGas: 4, // Per byte of data attached to a transaction that equals zero. NOTE: Not payable on data of calls between transactions
      txDataNonZeroGas: 68, // Per byte of data attached to a transaction that is not equal to zero. NOTE: Not payable on data of calls between transactions
      copyGas: 3, // Multiplied by the number of 32-byte words that are copied (round up) for any *COPY operation and added
      ecRecoverGas: 3000,
      sha256Gas: 60,
      sha256WordGas: 12,
      ripemd160Gas: 600,
      ripemd160WordGas: 120,
      identityGas: 15,
      identityWordGas: 3,
      stopGas: 0, // Base fee of the STOP opcode
      addGas: 3, // Base fee of the ADD opcode
      mulGas: 5, // Base fee of the MUL opcode
      subGas: 3, // Base fee of the SUB opcode
      divGas: 5, // Base fee of the DIV opcode
      sdivGas: 5, // Base fee of the SDIV opcode
      modGas: 5, // Base fee of the MOD opcode
      smodGas: 5, // Base fee of the SMOD opcode
      addmodGas: 8, // Base fee of the ADDMOD opcode
      mulmodGas: 8, // Base fee of the MULMOD opcode
      signextendGas: 5, // Base fee of the SIGNEXTEND opcode
      ltGas: 3, // Base fee of the LT opcode
      gtGas: 3, // Base fee of the GT opcode
      sltGas: 3, // Base fee of the SLT opcode
      sgtGas: 3, // Base fee of the SGT opcode
      eqGas: 3, // Base fee of the EQ opcode
      iszeroGas: 3, // Base fee of the ISZERO opcode
      andGas: 3, // Base fee of the AND opcode
      orGas: 3, // Base fee of the OR opcode
      xorGas: 3, // Base fee of the XOR opcode
      notGas: 3, // Base fee of the NOT opcode
      byteGas: 3, // Base fee of the BYTE opcode
      addressGas: 2, // Base fee of the ADDRESS opcode
      balanceGas: 20, // Base fee of the BALANCE opcode
      originGas: 2, // Base fee of the ORIGIN opcode
      callerGas: 2, // Base fee of the CALLER opcode
      callvalueGas: 2, // Base fee of the CALLVALUE opcode
      calldataloadGas: 3, // Base fee of the CALLDATALOAD opcode
      calldatasizeGas: 2, // Base fee of the CALLDATASIZE opcode
      calldatacopyGas: 3, // Base fee of the CALLDATACOPY opcode
      codesizeGas: 2, // Base fee of the CODESIZE opcode
      codecopyGas: 3, // Base fee of the CODECOPY opcode
      gaspriceGas: 2, // Base fee of the GASPRICE opcode
      extcodesizeGas: 20, // Base fee of the EXTCODESIZE opcode
      extcodecopyGas: 20, // Base fee of the EXTCODECOPY opcode
      blockhashGas: 20, // Base fee of the BLOCKHASH opcode
      coinbaseGas: 2, // Base fee of the COINBASE opcode
      timestampGas: 2, // Base fee of the TIMESTAMP opcode
      numberGas: 2, // Base fee of the NUMBER opcode
      difficultyGas: 2, // Base fee of the DIFFICULTY opcode
      gaslimitGas: 2, // Base fee of the GASLIMIT opcode
      popGas: 2, // Base fee of the POP opcode
      mloadGas: 3, // Base fee of the MLOAD opcode
      mstoreGas: 3, // Base fee of the MSTORE opcode
      mstore8Gas: 3, // Base fee of the MSTORE8 opcode
      sstoreGas: 0, // Base fee of the SSTORE opcode
      jumpGas: 8, // Base fee of the JUMP opcode
      jumpiGas: 10, // Base fee of the JUMPI opcode
      pcGas: 2, // Base fee of the PC opcode
      msizeGas: 2, // Base fee of the MSIZE opcode
      gasGas: 2, // Base fee of the GAS opcode
      pushGas: 3, // Base fee of the PUSH opcode
      dupGas: 3, // Base fee of the DUP opcode
      swapGas: 3, // Base fee of the SWAP opcode
      callcodeGas: 40, // Base fee of the CALLCODE opcode
      returnGas: 0, // Base fee of the RETURN opcode
      invalidGas: 0, // Base fee of the INVALID opcode
      selfdestructGas: 0, // Base fee of the SELFDESTRUCT opcode
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
  /**
   * Description: Homestead hardfork with protocol and network changes
   * URL        : https://eips.ethereum.org/EIPS/eip-606
   * Status     : Final
   */
  homestead: {
    gasPrices: {
      delegatecallGas: 40, // Base fee of the DELEGATECALL opcode
    },
  },
  /**
   * Description: DAO rescue hardfork
   * URL        : https://eips.ethereum.org/EIPS/eip-779
   * Status     : Final
   */
  dao: {},
  /**
   * Description: Hardfork with gas cost changes for IO-heavy operations
   * URL        : https://eips.ethereum.org/EIPS/eip-608
   * Status     : Final
   */
  tangerineWhistle: {
    gasPrices: {
      sloadGas: 200, // Once per SLOAD operation
      callGas: 700, // Once per CALL operation & message call transaction
      extcodesizeGas: 700, // Base fee of the EXTCODESIZE opcode
      extcodecopyGas: 700, // Base fee of the EXTCODECOPY opcode
      balanceGas: 400, // Base fee of the BALANCE opcode
      delegatecallGas: 700, // Base fee of the DELEGATECALL opcode
      callcodeGas: 700, // Base fee of the CALLCODE opcode
      selfdestructGas: 5000, // Base fee of the SELFDESTRUCT opcode
    },
  },
  /**
   * Description: HF with EIPs for simple replay attack protection, EXP cost increase, state trie clearing, contract code size limit
   * URL        : https://eips.ethereum.org/EIPS/eip-607
   * Status     : Final
   */
  spuriousDragon: {
    gasPrices: {
      expByteGas: 50, // Times ceil(log256(exponent)) for the EXP instruction
    },
    vm: {
      maxCodeSize: 24576, // Maximum length of contract code
    },
  },
  /**
   * Description: Hardfork with new precompiles, instructions and other protocol changes
   * URL        : https://eips.ethereum.org/EIPS/eip-609
   * Status     : Final
   */
  byzantium: {
    gasPrices: {
      modexpGquaddivisorGas: 20, // Gquaddivisor from modexp precompile for gas calculation
      ecAddGas: 500, // Gas costs for curve addition precompile
      ecMulGas: 40000, // Gas costs for curve multiplication precompile
      ecPairingGas: 100000, // Base gas costs for curve pairing precompile
      ecPairingWordGas: 80000, // Gas costs regarding curve pairing precompile input length
      revertGas: 0, // Base fee of the REVERT opcode
      staticcallGas: 700, // Base fee of the STATICCALL opcode
      returndatasizeGas: 2, // Base fee of the RETURNDATASIZE opcode
      returndatacopyGas: 3, // Base fee of the RETURNDATACOPY opcode
    },
    pow: {
      minerReward: BigInt('3000000000000000000'), // the amount a miner get rewarded for mining a block
      difficultyBombDelay: 3000000, // the amount of blocks to delay the difficulty bomb with
    },
  },
  /**
   * Description: Postponed hardfork including EIP-1283 (SSTORE gas metering changes)
   * URL        : https://eips.ethereum.org/EIPS/eip-1013
   * Status     : Final
   */
  constantinople: {
    gasPrices: {
      netSstoreNoopGas: 200, // Once per SSTORE operation if the value doesn't change
      netSstoreInitGas: 20000, // Once per SSTORE operation from clean zero
      netSstoreCleanGas: 5000, // Once per SSTORE operation from clean non-zero
      netSstoreDirtyGas: 200, // Once per SSTORE operation from dirty
      netSstoreClearRefundGas: 15000, // Once per SSTORE operation for clearing an originally existing storage slot
      netSstoreResetRefundGas: 4800, // Once per SSTORE operation for resetting to the original non-zero value
      netSstoreResetClearRefundGas: 19800, // Once per SSTORE operation for resetting to the original zero value
      shlGas: 3, // Base fee of the SHL opcode
      shrGas: 3, // Base fee of the SHR opcode
      sarGas: 3, // Base fee of the SAR opcode
      extcodehashGas: 400, // Base fee of the EXTCODEHASH opcode
      create2Gas: 32000, // Base fee of the CREATE2 opcode
    },
    pow: {
      minerReward: BigInt('2000000000000000000'), // The amount a miner gets rewarded for mining a block
      difficultyBombDelay: 5000000, // the amount of blocks to delay the difficulty bomb with
    },
  },
  /**
   * Description: Aka constantinopleFix, removes EIP-1283, activate together with or after constantinople
   * URL        : https://eips.ethereum.org/EIPS/eip-1716
   * Status     : Final
   */
  petersburg: {
    gasPrices: {
      netSstoreNoopGas: null, // Removed along EIP-1283
      netSstoreInitGas: null, // Removed along EIP-1283
      netSstoreCleanGas: null, // Removed along EIP-1283
      netSstoreDirtyGas: null, // Removed along EIP-1283
      netSstoreClearRefundGas: null, // Removed along EIP-1283
      netSstoreResetRefundGas: null, // Removed along EIP-1283
      netSstoreResetClearRefundGas: null, // Removed along EIP-1283
    },
  },
  /**
   * Description: HF targeted for December 2019 following the Constantinople/Petersburg HF
   * URL        : https://eips.ethereum.org/EIPS/eip-1679
   * Status     : Final
   */
  istanbul: {
    gasConfig: {},
    gasPrices: {
      blake2RoundGas: 1, // Gas cost per round for the Blake2 F precompile
      ecAddGas: 150, // Gas costs for curve addition precompile
      ecMulGas: 6000, // Gas costs for curve multiplication precompile
      ecPairingGas: 45000, // Base gas costs for curve pairing precompile
      ecPairingWordGas: 34000, // Gas costs regarding curve pairing precompile input length
      txDataNonZeroGas: 16, // Per byte of data attached to a transaction that is not equal to zero. NOTE: Not payable on data of calls between transactions
      sstoreSentryEIP2200Gas: 2300, // Minimum gas required to be present for an SSTORE call, not consumed
      sstoreNoopEIP2200Gas: 800, // Once per SSTORE operation if the value doesn't change
      sstoreDirtyEIP2200Gas: 800, // Once per SSTORE operation if a dirty value is changed
      sstoreInitEIP2200Gas: 20000, // Once per SSTORE operation from clean zero to non-zero
      sstoreInitRefundEIP2200Gas: 19200, // Once per SSTORE operation for resetting to the original zero value
      sstoreCleanEIP2200Gas: 5000, // Once per SSTORE operation from clean non-zero to something else
      sstoreCleanRefundEIP2200Gas: 4200, // Once per SSTORE operation for resetting to the original non-zero value
      sstoreClearRefundEIP2200Gas: 15000, // Once per SSTORE operation for clearing an originally existing storage slot
      balanceGas: 700, // Base fee of the BALANCE opcode
      extcodehashGas: 700, // Base fee of the EXTCODEHASH opcode
      chainidGas: 2, // Base fee of the CHAINID opcode
      selfbalanceGas: 5, // Base fee of the SELFBALANCE opcode
      sloadGas: 800, // Base fee of the SLOAD opcode
    },
  },
  /**
   * Description: HF to delay the difficulty bomb
   * URL        : https://eips.ethereum.org/EIPS/eip-2384
   * Status     : Final
   */
  muirGlacier: {
    pow: {
      difficultyBombDelay: 9000000, // the amount of blocks to delay the difficulty bomb with
    },
  },
  /**
   * Description: HF targeted for July 2020 following the Muir Glacier HF
   * URL        : https://eips.ethereum.org/EIPS/eip-2070
   * Status     : Final
   */
  berlin: {
    eips: [2565, 2929, 2718, 2930],
  },
  /**
   * Description: HF targeted for July 2021 following the Berlin fork
   * URL        : https://github.com/ethereum/eth1.0-specs/blob/master/network-upgrades/mainnet-upgrades/london.md
   * Status     : Final
   */
  london: {
    eips: [1559, 3198, 3529, 3541],
  },
  /**
   * Description: HF to delay the difficulty bomb
   * URL        : https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/arrow-glacier.md
   * Status     : Final
   */
  arrowGlacier: {
    eips: [4345],
  },
  /**
   * Description: Delaying the difficulty bomb to Mid September 2022
   * URL        : https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/gray-glacier.md
   * Status     : Final
   */
  grayGlacier: {
    eips: [5133],
  },
  /**
   * Description: Hardfork to upgrade the consensus mechanism to Proof-of-Stake
   * URL        : https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/merge.md
   * Status     : Final
   */
  paris: {
    consensus: {
      type: 'pos',
      algorithm: 'casper',
      casper: {},
    },
    eips: [3675, 4399],
  },
  /**
   * Description: Pre-merge hardfork to fork off non-upgraded clients
   * URL        : https://eips.ethereum.org/EIPS/eip-3675
   * Status     : Final
   */
  mergeForkIdTransition: {
    eips: [],
  },
  /**
   * Description: Next feature hardfork after the merge hardfork having withdrawals, warm coinbase, push0, limit/meter initcode
   * URL        : https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/shanghai.md
   * Status     : Final
   */
  shanghai: {
    eips: [3651, 3855, 3860, 4895],
  },
  /**
   * Description: Next feature hardfork after shanghai, includes proto-danksharding EIP 4844 blobs
   * (still WIP hence not for production use), transient storage opcodes, parent beacon block root
   * availability in EVM, selfdestruct only in same transaction, and blob base fee opcode
   * URL        : https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/cancun.md
   * Status     : Final
   */
  cancun: {
    eips: [1153, 4844, 4788, 5656, 6780, 7516],
  },
  /**
   * Description: Next feature hardfork after cancun, internally used for pectra testing/implementation (incomplete/experimental)
   * URL        : https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/prague.md
   * Status     : Final
   */
  prague: {
    // TODO update this accordingly to the right devnet setup
    //eips: [663, 3540, 3670, 4200, 4750, 5450, 6206, 7069, 7480, 7620, 7692, 7698], // This is EOF-only
    eips: [2537, 2935, 6110, 7002, 7251, 7685, 7702], // This is current prague without EOF
  },
  /**
   * Description: Next feature hardfork after prague, internally used for verkle testing/implementation (incomplete/experimental)
   * URL        : https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/osaka.md
   * Status     : Final
   */
  osaka: {
    eips: [2935, 6800],
  },
}
