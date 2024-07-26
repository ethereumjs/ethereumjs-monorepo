import type { ParamsDict } from '@ethereumjs/common'

export const paramsVM: ParamsDict = {
  /**
   * Frontier/Chainstart
   */
  1: {
    // gasConfig
    maxRefundQuotient: 2, // Maximum refund quotient; max tx refund is min(tx.gasUsed/maxRefundQuotient, tx.gasRefund)
    blobGasPerBlob: 0,
    maxblobGasPerBlock: 0,
    // pow
    minerReward: '5000000000000000000', // the amount a miner get rewarded for mining a block
  },
  /**
.  * Byzantium HF Meta EIP
.  */
  609: {
    // pow
    minerReward: '3000000000000000000', // the amount a miner get rewarded for mining a block
  },
  /**
.  * Constantinope HF Meta EIP
.  */
  1013: {
    // pow
    minerReward: '2000000000000000000', // The amount a miner gets rewarded for mining a block
  },
  /**
.  * Fee market change for ETH 1.0 chain
.  */
  1559: {
    // gasConfig
    elasticityMultiplier: 2, // Maximum block gas target elasticity
    initialBaseFee: 1000000000, // Initial base fee on first EIP1559 block
  },
  /**
   * Save historical block hashes in state (Verkle related usage, UNSTABLE)
   */
  2935: {
    // config
    historyStorageAddress: '0x0aae40965e6800cd9b1f4b05ff21581047e3f91e', // The address where the historical blockhashes are stored
    historyServeWindow: 8192, // The amount of blocks to be served by the historical blockhash contract
  },
  /**
.  * Reduction in refunds
.  */
  3529: {
    // gasConfig
    maxRefundQuotient: 5, // Maximum refund quotient; max tx refund is min(tx.gasUsed/maxRefundQuotient, tx.gasRefund)
  },
  /**
.  * Shard Blob Transactions
.  */
  4844: {
    blobGasPerBlob: 131072, // The base fee for blob gas per blob
    maxblobGasPerBlock: 786432, // The max blob gas allowable per block
  },
  /**
.  * Beacon block root in the EVM
.  */
  4788: {
    // config
    historicalRootsLength: 8191, // The modulo parameter of the beaconroot ring buffer in the beaconroot statefull precompile
  },
  /**
   * Ethereum state using a unified verkle tree (experimental)
   */
  6800: {
    // kaustinen 6 current uses this address, however this will be updated to correct address
    // in next iteration
    // config
    historyStorageAddress: '0xfffffffffffffffffffffffffffffffffffffffe', // The address where the historical blockhashes are stored
  },
  /**
   * Execution layer triggerable withdrawals (experimental)
   */
  7002: {
    // config
    systemAddress: '0xfffffffffffffffffffffffffffffffffffffffe', // The system address to perform operations on the withdrawal requests predeploy address
    withdrawalRequestPredeployAddress: '0x00A3ca265EBcb825B45F985A16CEFB49958cE017', // Address of the validator excess address
  },

  /**
   * Increase the MAX_EFFECTIVE_BALANCE -> Execution layer triggered consolidations (experimental)
   */
  7251: {
    // config
    systemAddress: '0xfffffffffffffffffffffffffffffffffffffffe', // The system address to perform operations on the consolidation requests predeploy address
    consolidationRequestPredeployAddress: '0x00b42dbF2194e931E80326D950320f7d9Dbeac02', // Address of the consolidations contract
  },
}
