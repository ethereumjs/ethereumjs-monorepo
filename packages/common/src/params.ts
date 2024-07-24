import type { ParamsDict } from './types.js'

export const paramsDict: ParamsDict = {
  /**
   * Frontier/Chainstart
   */
  1: {
    // VM, Client, Block
    blobGasPerBlob: 0,

    // Tx gasPrice
    txGas: 21000, // Per transaction. NOTE: Not payable on data of calls between transactions
    txCreationGas: 32000, // The cost of creating a contract via tx
    txDataZeroGas: 4, // Per byte of data attached to a transaction that equals zero. NOTE: Not payable on data of calls between transactions
    txDataNonZeroGas: 68, // Per byte of data attached to a transaction that is not equal to zero. NOTE: Not payable on data of calls between transactions
    accessListStorageKeyGas: 0,
    accessListAddressGas: 0,

    // gasConfig VM (access via EVM?)
    maxRefundQuotient: 2, // Maximum refund quotient; max tx refund is min(tx.gasUsed/maxRefundQuotient, tx.gasRefund)

    // pow VM
    minerReward: BigInt('5000000000000000000'), // the amount a miner get rewarded for mining a block
  },
  /**
.  * Byzantium HF Meta EIP
.  */
  609: {
    // pow VM
    minerReward: BigInt('3000000000000000000'), // the amount a miner get rewarded for mining a block
    // pow Block
    difficultyBombDelay: 3000000, // the amount of blocks to delay the difficulty bomb with
  },
  /**
.  * Constantinope HF Meta EIP
.  */
  1013: {
    // pow VM
    minerReward: BigInt('2000000000000000000'), // The amount a miner gets rewarded for mining a block
  },

  /**
.  * Istanbul HF Meta EIP
.  */
  1679: {
    // gasPrices Tx
    txDataNonZeroGas: 16, // Per byte of data attached to a transaction that is not equal to zero. NOTE: Not payable on data of calls between transactions
  },

  /**
.  * Fee market change for ETH 1.0 chain
.  */
  1559: {
    // Various libraries, closer look
    initialBaseFee: 1000000000, // Initial base fee on first EIP1559 block
    // Block, VM
    elasticityMultiplier: 2, // Maximum block gas target elasticity
  },

  /**
.  * Optional access lists
.  */
  2930: {
    // gasPrices Tx
    accessListStorageKeyGas: 1900, // Gas cost per storage key in an Access List transaction
    accessListAddressGas: 2400, // Gas cost per storage key in an Access List transaction
  },
  /**
   * Save historical block hashes in state (Verkle related usage, UNSTABLE)
   */
  2935: {
    // vm VM (move accesses to EVM?)
    historyStorageAddress: BigInt('0x0aae40965e6800cd9b1f4b05ff21581047e3f91e'), // The address where the historical blockhashes are stored
    historyServeWindow: BigInt(8192), // The amount of blocks to be served by the historical blockhash contract
  },

  /**
.  * Reduction in refunds
.  */
  3529: {
    // gasConfig VM (access via EVM?)
    maxRefundQuotient: 5, // Maximum refund quotient; max tx refund is min(tx.gasUsed/maxRefundQuotient, tx.gasRefund)
  },

  /**
.  * Limit and meter initcode
.  */
  3860: {
    // gasPrices tx
    initCodeWordGas: 2, // Gas to pay for each word (32 bytes) of initcode when creating a contract
    // tx
    maxInitCodeSize: 49152, // Maximum length of initialization code when creating a contract
  },

  /**
.  * Beacon block root in the EVM
.  */
  4788: {
    // vm VM
    historicalRootsLength: 8191, // The modulo parameter of the beaconroot ring buffer in the beaconroot statefull precompile
  },
  /**
.  * Shard Blob Transactions
.  */
  4844: {
    // gasConfig
    // VM, Client, Block
    blobGasPerBlob: 131072, // The base fee for blob gas per blob

    // sharding EVM/Tx
    blobCommitmentVersionKzg: 1, // The number indicated a versioned hash is a KZG commitment
  },

  /**
   * Ethereum state using a unified verkle tree (experimental)
   */
  6800: {
    // vm
    // kaustinen 6 current uses this address, however this will be updated to correct address
    // in next iteration
    // vm VM (move accesses to EVM?)
    historyStorageAddress: BigInt('0xfffffffffffffffffffffffffffffffffffffffe'), // The address where the historical blockhashes are stored
  },
  /**
   * Execution layer triggerable withdrawals (experimental)
   */
  7002: {
    // vm VM (access via EVM?)
    systemAddress: BigInt('0xfffffffffffffffffffffffffffffffffffffffe'), // The system address to perform operations on the withdrawal requests predeploy address
    // vm
    withdrawalRequestPredeployAddress: BigInt('0x00A3ca265EBcb825B45F985A16CEFB49958cE017'), // Address of the validator excess address
  },

  /**
   * Increase the MAX_EFFECTIVE_BALANCE -> Execution layer triggered consolidations (experimental)
   */
  7251: {
    // vm VM (access via EVM?)
    systemAddress: BigInt('0xfffffffffffffffffffffffffffffffffffffffe'), // The system address to perform operations on the consolidation requests predeploy address
    // VM
    consolidationRequestPredeployAddress: BigInt('0x00b42dbF2194e931E80326D950320f7d9Dbeac02'), // Address of the consolidations contract
  },
}
