import type { ParamsDict } from '@ethereumjs/common'

export const paramsVM: ParamsDict = {
  /**
   * Frontier/Chainstart
   */
  1: {
    // gasConfig
    maxRefundQuotient: 2, // Maximum refund quotient; max tx refund is min(tx.gasUsed/maxRefundQuotient, tx.gasRefund)
    blobGasPerBlob: 0,
    maxBlobGasPerBlock: 0,
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
.  * Constantinople HF Meta EIP
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
    historyStorageAddress: '0x0F792be4B0c0cb4DAE440Ef133E90C0eCD48CCCC', // The address where the historical blockhashes are stored
    historyServeWindow: 8191, // The amount of blocks to be served by the historical blockhash contract
    systemAddress: '0xfffffffffffffffffffffffffffffffffffffffe', // The system address
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
    maxBlobGasPerBlock: 786432, // The max blob gas allowable per block
  },
  /**
.  * Beacon block root in the EVM
.  */
  4788: {
    // config
    historicalRootsLength: 8191, // The modulo parameter of the beaconroot ring buffer in the beaconroot stateful precompile
  },
  /**
   * Ethereum state using a unified verkle tree (experimental)
   */
  6800: {
    // config
    historyStorageAddress: '0x0aae40965e6800cd9b1f4b05ff21581047e3f91e', // The address where the historical blockhashes are stored
  },
  /**
   * Execution layer triggerable withdrawals (experimental)
   */
  7002: {
    // config
    systemAddress: '0xfffffffffffffffffffffffffffffffffffffffe', // The system address to perform operations on the withdrawal requests predeploy address
    // See: https://github.com/ethereum/EIPs/pull/8934/files
    withdrawalRequestPredeployAddress: '0x0c15F14308530b7CDB8460094BbB9cC28b9AaaAA', // Address of the validator excess address
  },

  /**
   * Increase the MAX_EFFECTIVE_BALANCE -> Execution layer triggered consolidations (experimental)
   */
  7251: {
    // config
    systemAddress: '0xfffffffffffffffffffffffffffffffffffffffe', // The system address to perform operations on the consolidation requests predeploy address
    // See: https://github.com/ethereum/EIPs/pull/8934/files
    consolidationRequestPredeployAddress: '0x00431F263cE400f4455c2dCf564e53007Ca4bbBb', // Address of the consolidations contract
  },
  /**
.  * Shard Blob Transactions
.  */
  7691: {
    maxBlobGasPerBlock: 1179648, // The max blob gas allowable per block
  },
}
