export const EIPs = {
  1153: {
    comment: 'Transient storage opcodes',
    url: 'https://eips.ethereum.org/EIPS/eip-1153',
    status: 'Review',
    minimumHardfork: 'chainstart',
    requiredEIPs: [],
    gasConfig: {},
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
    vm: {},
    pow: {},
  },
  1559: {
    comment: 'Fee market change for ETH 1.0 chain',
    url: 'https://eips.ethereum.org/EIPS/eip-1559',
    status: 'Final',
    minimumHardfork: 'berlin',
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
    gasPrices: {},
    vm: {},
    pow: {},
  },
  2315: {
    comment: 'Simple subroutines for the EVM',
    url: 'https://eips.ethereum.org/EIPS/eip-2315',
    status: 'Draft',
    minimumHardfork: 'istanbul',
    gasConfig: {},
    gasPrices: {
      beginsub: {
        v: 2,
        d: 'Base fee of the BEGINSUB opcode',
      },
      returnsub: {
        v: 5,
        d: 'Base fee of the RETURNSUB opcode',
      },
      jumpsub: {
        v: 10,
        d: 'Base fee of the JUMPSUB opcode',
      },
    },
    vm: {},
    pow: {},
  },
  2565: {
    comment: 'ModExp gas cost',
    url: 'https://eips.ethereum.org/EIPS/eip-2565',
    status: 'Final',
    minimumHardfork: 'byzantium',
    gasConfig: {},
    gasPrices: {
      modexpGquaddivisor: {
        v: 3,
        d: 'Gquaddivisor from modexp precompile for gas calculation',
      },
    },
    vm: {},
    pow: {},
  },
  2718: {
    comment: 'Typed Transaction Envelope',
    url: 'https://eips.ethereum.org/EIPS/eip-2718',
    status: 'Final',
    minimumHardfork: 'chainstart',
    gasConfig: {},
    gasPrices: {},
    vm: {},
    pow: {},
  },
  2929: {
    comment: 'Gas cost increases for state access opcodes',
    url: 'https://eips.ethereum.org/EIPS/eip-2929',
    status: 'Final',
    minimumHardfork: 'chainstart',
    gasConfig: {},
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
    vm: {},
    pow: {},
  },
  2930: {
    comment: 'Optional access lists',
    url: 'https://eips.ethereum.org/EIPS/eip-2930',
    status: 'Final',
    minimumHardfork: 'istanbul',
    requiredEIPs: [2718, 2929],
    gasConfig: {},
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
    vm: {},
    pow: {},
  },
  3074: {
    comment: 'AUTH and AUTHCALL opcodes',
    url: 'https://eips.ethereum.org/EIPS/eip-3074',
    status: 'Review',
    minimumHardfork: 'london',
    gasConfig: {},
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
    vm: {},
    pow: {},
  },
  3198: {
    comment: 'BASEFEE opcode',
    url: 'https://eips.ethereum.org/EIPS/eip-3198',
    status: 'Final',
    minimumHardfork: 'london',
    gasConfig: {},
    gasPrices: {
      basefee: {
        v: 2,
        d: 'Gas cost of the BASEFEE opcode',
      },
    },
    vm: {},
    pow: {},
  },
  3529: {
    comment: 'Reduction in refunds',
    url: 'https://eips.ethereum.org/EIPS/eip-3529',
    status: 'Final',
    minimumHardfork: 'berlin',
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
    vm: {},
    pow: {},
  },
  3540: {
    comment: 'EVM Object Format (EOF) v1',
    url: 'https://eips.ethereum.org/EIPS/eip-3540',
    status: 'Review',
    minimumHardfork: 'london',
    requiredEIPs: [3541],
    gasConfig: {},
    gasPrices: {},
    vm: {},
    pow: {},
  },
  3541: {
    comment: 'Reject new contracts starting with the 0xEF byte',
    url: 'https://eips.ethereum.org/EIPS/eip-3541',
    status: 'Final',
    minimumHardfork: 'berlin',
    requiredEIPs: [],
    gasConfig: {},
    gasPrices: {},
    vm: {},
    pow: {},
  },
  3554: {
    comment: 'Reduction in refunds',
    url: 'Difficulty Bomb Delay to December 1st 2021',
    status: 'Final',
    minimumHardfork: 'muirGlacier',
    requiredEIPs: [],
    gasConfig: {},
    gasPrices: {},
    vm: {},
    pow: {
      difficultyBombDelay: {
        v: 9500000,
        d: 'the amount of blocks to delay the difficulty bomb with',
      },
    },
  },
  3670: {
    comment: 'Reject transactions from senders with deployed code',
    url: 'https://eips.ethereum.org/EIPS/eip-3607',
    status: 'Final',
    minimumHardfork: 'chainstart',
    requiredEIPs: [],
    gasConfig: {},
    gasPrices: {},
    vm: {},
    pow: {},
  },
  3675: {
    comment: 'Upgrade consensus to Proof-of-Stake',
    url: 'https://eips.ethereum.org/EIPS/eip-3675',
    status: 'Final',
    minimumHardfork: 'london',
    requiredEIPs: [],
    gasConfig: {},
    gasPrices: {},
    vm: {},
    pow: {},
  },
  3855: {
    comment: 'PUSH0 instruction',
    url: 'https://eips.ethereum.org/EIPS/eip-3855',
    status: 'Review',
    minimumHardfork: 'chainstart',
    requiredEIPs: [],
    gasConfig: {},
    gasPrices: {
      push0: {
        v: 2,
        d: 'Base fee of the PUSH0 opcode',
      },
    },
    vm: {},
    pow: {},
  },
  3860: {
    comment: 'Limit and meter initcode',
    url: 'https://eips.ethereum.org/EIPS/eip-3860',
    status: 'Review',
    minimumHardfork: 'spuriousDragon',
    requiredEIPs: [],
    gasConfig: {},
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
    pow: {},
  },
  4345: {
    comment: 'Difficulty Bomb Delay to June 2022',
    url: 'https://eips.ethereum.org/EIPS/eip-4345',
    status: 'Final',
    minimumHardfork: 'london',
    gasConfig: {},
    gasPrices: {},
    vm: {},
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
    status: 'Review',
    minimumHardfork: 'london',
    requiredEIPs: [],
    gasConfig: {},
    gasPrices: {
      prevrandao: {
        v: 2,
        d: 'Base fee of the PREVRANDAO opcode (previously DIFFICULTY)',
      },
    },
    vm: {},
    pow: {},
  },
  4788: {
    comment: 'Beacon block root in the EVM',
    url: 'https://eips.ethereum.org/EIPS/eip-4788',
    status: 'Draft',
    minimumHardfork: 'cancun',
    requiredEIPs: [],
    gasConfig: {},
    gasPrices: {
      beaconrootCost: {
        v: 4200,
        d: 'Gas cost when calling the beaconroot stateful precompile',
      },
    },
    vm: {
      historicalRootsLength: {
        v: 98304,
        d: 'The modulo parameter of the beaconroot ring buffer in the beaconroot statefull precompile',
      },
    },
    pow: {},
  },
  4844: {
    comment: 'Shard Blob Transactions',
    url: 'https://eips.ethereum.org/EIPS/eip-4844',
    status: 'Draft',
    minimumHardfork: 'paris',
    requiredEIPs: [1559, 2718, 2930, 4895],
    gasConfig: {
      dataGasPerBlob: {
        v: 131072,
        d: 'The base fee for data gas per blob',
      },
      targetDataGasPerBlock: {
        v: 393216,
        d: 'The target data gas consumed per block',
      },
      maxDataGasPerBlock: {
        v: 786432,
        d: 'The max data gas allowable per block',
      },
      dataGasPriceUpdateFraction: {
        v: 3338477,
        d: 'The denominator used in the exponential when calculating a data gas price',
      },
    },
    gasPrices: {
      simpleGasPerBlob: {
        v: 12000,
        d: 'The basic gas fee for each blob',
      },
      minDataGasPrice: {
        v: 1,
        d: 'The minimum fee per data gas',
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
    vm: {},
    pow: {},
  },
  4895: {
    comment: 'Beacon chain push withdrawals as operations',
    url: 'https://eips.ethereum.org/EIPS/eip-4895',
    status: 'Review',
    minimumHardfork: 'paris',
    requiredEIPs: [],
    gasConfig: {},
    gasPrices: {},
    vm: {},
    pow: {},
  },
  5133: {
    comment: 'Delaying Difficulty Bomb to mid-September 2022',
    url: 'https://eips.ethereum.org/EIPS/eip-5133',
    status: 'Draft',
    minimumHardfork: 'grayGlacier',
    gasConfig: {},
    gasPrices: {},
    vm: {},
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
    status: 'Draft',
    minimumHardfork: 'shanghai',
    gasConfig: {},
    gasPrices: {
      mcopy: {
        v: 3,
        d: 'Base fee of the MCOPY opcode',
      },
    },
    vm: {},
    pow: {},
  },
  6780: {
    comment: 'SELFDESTRUCT only in same transaction',
    url: 'https://eips.ethereum.org/EIPS/eip-6780',
    status: 'Draft',
    minimumHardfork: 'london',
    gasConfig: {},
    gasPrices: {},
    vm: {},
    pow: {},
  },
}
