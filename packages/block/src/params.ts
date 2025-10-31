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
    maxBlobGasPerBlock: 0,
    // format
    maxExtraDataSize: 32, // Maximum size extra data may be after Genesis
    // pow
    minimumDifficulty: 131072, // The minimum that the difficulty may ever be
    difficultyBoundDivisor: 2048, // The bound divisor of the difficulty, used in the update calculations
    durationLimit: 13, // The decision boundary on the blocktime duration used to determine whether difficulty should go up or not
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
.  * Constantinople HF Meta EIP
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
    maxBlobGasPerBlock: 786432, // The max blob gas allowable per block
    blobGasPriceUpdateFraction: 3338477, // The denominator used in the exponential when calculating a blob gas price
    // gasPrices
    minBlobGas: 1, // The minimum fee per blob gas
    blobBaseCost: 8192, // EIP-7918: Blob base fee bounded by execution cost (2^13)
  },
  /**
   * Delaying Difficulty Bomb to mid-September 2022
   */
  5133: {
    // pow
    difficultyBombDelay: 11400000, // the amount of blocks to delay the difficulty bomb with
  },
  /**
.  * Blob throughput increase
.  */
  7691: {
    // gasConfig
    targetBlobGasPerBlock: 786432, // The target blob gas consumed per block
    maxBlobGasPerBlock: 1179648, // The max blob gas allowable per block
    blobGasPriceUpdateFraction: 5007716, // The denominator used in the exponential when calculating a blob gas price
  },
  /**
   * EIP-7892
   * Baseline schedule for BPO1: increases blob target to 10 and max to 15
   */
  7892: {
    // gasConfig
    targetBlobGasPerBlock: 1_310_720, // 10 blobs * 131072
    maxBlobGasPerBlock: 1_966_080, // 15 blobs * 131072
    blobGasPriceUpdateFraction: 8_346_193, // Scaled Prague update fraction (≈ 5007716 * 1966080 / 1179648)
  },
  /**
   * Blob Parameter Only 1 (BPO1) - EIP-7892
   * Increases blob target to 10 and max to 15
   */
  bpo1: {
    // gasConfig
    targetBlobGasPerBlock: 1_310_720, // 10 blobs * 131072
    maxBlobGasPerBlock: 1_966_080, // 15 blobs * 131072
    blobGasPriceUpdateFraction: 8_346_193, // Same schedule as baseline BPO1
  },
  /**
   * Blob Parameter Only 2 (BPO2) - EIP-7892
   * Increases blob target to 14 and max to 21
   */
  bpo2: {
    // gasConfig
    targetBlobGasPerBlock: 1_835_008, // 14 blobs * 131072
    maxBlobGasPerBlock: 2_752_512, // 21 blobs * 131072
    blobGasPriceUpdateFraction: 11_684_670, // Scaled Prague update fraction (≈ 5007716 * 2752512 / 1179648)
  },
}
