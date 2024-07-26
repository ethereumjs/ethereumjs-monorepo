import type { ParamsDict } from '@ethereumjs/common'

export const paramsTx: ParamsDict = {
  /**
   * Frontier/Chainstart
   */
  1: {
    // gasPrices
    txGas: 21000, // Per transaction. NOTE: Not payable on data of calls between transactions
    txCreationGas: 32000, // The cost of creating a contract via tx
    txDataZeroGas: 4, // Per byte of data attached to a transaction that equals zero. NOTE: Not payable on data of calls between transactions
    txDataNonZeroGas: 68, // Per byte of data attached to a transaction that is not equal to zero. NOTE: Not payable on data of calls between transactions
    accessListStorageKeyGas: 0,
    accessListAddressGas: 0,
  },
  /**
.  * Istanbul HF Meta EIP
.  */
  1679: {
    // gasPrices
    txDataNonZeroGas: 16, // Per byte of data attached to a transaction that is not equal to zero. NOTE: Not payable on data of calls between transactions
  },
  /**
.  * Optional access lists
.  */
  2930: {
    // gasPrices
    accessListStorageKeyGas: 1900, // Gas cost per storage key in an Access List transaction
    accessListAddressGas: 2400, // Gas cost per storage key in an Access List transaction
  },
  /**
.  * Limit and meter initcode
.  */
  3860: {
    // gasPrices
    initCodeWordGas: 2, // Gas to pay for each word (32 bytes) of initcode when creating a contract
    // format
    maxInitCodeSize: 49152, // Maximum length of initialization code when creating a contract
  },
  /**
.  * Shard Blob Transactions
.  */
  4844: {
    blobCommitmentVersionKzg: 1, // The number indicated a versioned hash is a KZG commitment
  },
}
