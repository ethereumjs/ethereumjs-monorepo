import type { ParamsDict } from '@ethereumjs/common'

export const paramsBlock: ParamsDict = {
  /**
   * Frontier/Chainstart
   */
  1: {
    // gasConfig
    minGasLimit: 5000, // Minimum the gas limit may ever be
    gasLimitBoundDivisor: 1024, // The bound divisor of the gas limit, used in update calculations
    targetBlobGasPerBlock: 0, // Base value needed here since called pre-4844 in BlockHeader.calcNextExcessBlobGas()
    blobGasPerBlob: 0,
    maxblobGasPerBlock: 0,
    // format
    maxExtraDataSize: 32, // Maximum size extra data may be after Genesis
    // pow
    minimumDifficulty: 131072, // The minimum that the difficulty may ever be
    difficultyBoundDivisor: 2048, // The bound divisor of the difficulty, used in the update calculations
    durationLimit: 13, // The decision boundary on the blocktime duration used to determine whether difficulty should go up or not
    epochDuration: 30000, // Duration between proof-of-work epochs
    timebombPeriod: 100000, // Exponential difficulty timebomb period
    difficultyBombDelay: 0, // the amount of blocks to delay the difficulty bomb with
  },
  /**
.  * Byzantium HF Meta EIP
.  */
  609: {
    // pow
    difficultyBombDelay: 3000000, // the amount of blocks to delay the difficulty bomb with
  },
  /**
.  * Constantinope HF Meta EIP
.  */
  1013: {
    // pow
    difficultyBombDelay: 5000000, // the amount of blocks to delay the difficulty bomb with
  },
  /**
.  * MuirGlacier HF Meta EIP
.  */
  2384: {
    // pow
    difficultyBombDelay: 9000000, // the amount of blocks to delay the difficulty bomb with
  },
  /**
.  * Fee market change for ETH 1.0 chain
.  */
  1559: {
    // gasConfig
    baseFeeMaxChangeDenominator: 8, // Maximum base fee change denominator
    elasticityMultiplier: 2, // Maximum block gas target elasticity
    initialBaseFee: 1000000000, // Initial base fee on first EIP1559 block
  },
  /**
.  * Difficulty Bomb Delay to December 1st 2021
.  */
  3554: {
    // pow
    difficultyBombDelay: 9500000, // the amount of blocks to delay the difficulty bomb with
  },
  /**
.  * Difficulty Bomb Delay to June 2022
.  */
  4345: {
    // pow
    difficultyBombDelay: 10700000, // the amount of blocks to delay the difficulty bomb with
  },
  /**
.  * Shard Blob Transactions
.  */
  4844: {
    // gasConfig
    targetBlobGasPerBlock: 393216, // The target blob gas consumed per block
    blobGasPerBlob: 131072, // The base fee for blob gas per blob
    maxblobGasPerBlock: 786432, // The max blob gas allowable per block
    blobGasPriceUpdateFraction: 3338477, // The denominator used in the exponential when calculating a blob gas price
    // gasPrices
    simplePerBlobGas: 12000, // The basic gas fee for each blob
    minBlobGas: 1, // The minimum fee per blob gas
  },
  /**
   * Delaying Difficulty Bomb to mid-September 2022
   */
  5133: {
    // pow
    difficultyBombDelay: 11400000, // the amount of blocks to delay the difficulty bomb with
  },
}
