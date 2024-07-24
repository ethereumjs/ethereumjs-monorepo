import type { ParamsDict } from './types.js'

export const paramsDict: ParamsDict = {
  /**
   * Frontier/Chainstart
   */
  1: {
    // VM, Client, Block
    blobGasPerBlob: 0,
  },

  /**
.  * Fee market change for ETH 1.0 chain
.  */
  1559: {
    // Various libraries, closer look
    initialBaseFee: 1000000000, // Initial base fee on first EIP1559 block
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
}
