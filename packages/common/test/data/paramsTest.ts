import type { ParamsDict } from '@ethereumjs/common'

export const paramsTest: ParamsDict = {
  /**
   * Frontier/Chainstart
   */
  1: {
    // pow
    minerReward: '5000000000000000000', // the amount a miner get rewarded for mining a block
  },
  /**
   * Byzantium HF Meta EIP
   */
  609: {
    // gasPrices
    ecAddGas: 500, // Gas costs for curve addition precompile
    // pow
    minerReward: '3000000000000000000', // the amount a miner get rewarded for mining a block
  },
  /**
.  * Constantinope HF Meta EIP
.  */
  1013: {
    // gasPrices
    netSstoreNoopGas: 200, // Once per SSTORE operation if the value doesn't change
    // pow
    minerReward: '2000000000000000000', // The amount a miner gets rewarded for mining a block
  },
  /**
.  * Petersburg HF Meta EIP
.  */
  1716: {
    // gasPrices
    netSstoreNoopGas: null, // Removed along EIP-1283
  },
  /**
   * Istanbul HF Meta EIP
   */
  1679: {
    // gasPrices
    ecAddGas: 150, // Gas costs for curve addition precompile
  },
  /**
   * BLS12-381 precompiles
   */
  2537: {
    // gasPrices
    Bls12381G1AddGas: 500, // Gas cost of a single BLS12-381 G1 addition precompile-call
  },
}
