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
    blobGasPerBlob: 131072, // The base fee for blob gas per blob
    maxBlobGasPerBlock: 786432, // The max blob gas allowable per block
  },
  /**
   * PeerDAS - Peer Data Availability Sampling
   */
  7594: {
    maxBlobsPerTx: 6, // Max number of blobs per tx
  },
  /**
   * Increase calldata cost to reduce maximum block size
   */
  7623: {
    totalCostFloorPerToken: 10,
  },
  /**
   * Reduce intrinsic transaction gas (Amsterdam, experimental).
   * The recipient/value components (COLD_ACCOUNT_ACCESS for plain calls,
   * txValueCost + transferLogCost for value transfers) are added in the
   * intrinsic-gas dimension splitter, which knows the sender (self-transfers
   * skip the recipient and value charges).
   */
  2780: {
    txGas: 12000, // TX_BASE: base sender cost per transaction (down from 21000)
    txValueCost: 4244, // TX_VALUE_COST: extra regular gas for value-bearing non-self-transfer calls
    transferLogCost: 1756, // TRANSFER_LOG_COST: regular gas for the EIP-7708 transfer log of the tx-level value transfer
    txRecipientAccessGas: 3000, // Recipient cost for a non-self-transfer call (= COLD_ACCOUNT_ACCESS under EIP-8038)
  },
  /**
   * Access list data pricing (Amsterdam, experimental).
   * Repriced to match COLD_ACCOUNT_ACCESS / COLD_STORAGE_ACCESS under EIP-8038.
   * The floor-token component (80 tokens/address + 128 tokens/storage key at
   * totalCostFloorPerToken) is added in the access-list data gas calculation.
   */
  7981: {
    accessListStorageKeyGas: 3000, // Gas cost per storage key in an Access List transaction (up from 1900)
    accessListAddressGas: 3000, // Gas cost per address in an Access List transaction (up from 2400)
  },
  /**
.  * Set EOA account code for one transaction
.  */
  7702: {
    // TODO: Set correct minimum hardfork
    // gasPrices
    perAuthBaseGas: 12500, // Gas cost of each authority item, provided the authority exists in the trie
    perEmptyAccountCost: 25000, // Gas cost of each authority item, in case the authority does not exist in the trie
  },
  /**
  .  * Shard Blob Transactions
  .  */
  7691: {
    maxBlobGasPerBlock: 1179648, // The max blob gas allowable per block
  },
  /**
   * Transaction Gas Limit Cap
   */
  7825: {
    maxTransactionGasLimit: 16777216, // Maximum gas limit for a single transaction (2^24)
  },
  /**
   * Increase max contract code size and initcode size
   */
  7954: {
    // format
    maxInitCodeSize: 131072, // EIP-7954: Maximum length of initialization code (2 * maxCodeSize, raised from 48 KiB)
  },
  /**
   * Increase calldata floor cost (uniform 64 gas/byte floor)
   */
  7976: {
    totalCostFloorPerToken: 16,
  },
  /**
   * State Creation Gas Cost Increase — tx-level regular-gas overrides.
   * State-gas portion of the authorization base/empty-account cost and the
   * creation-tx state cost are computed separately from the EIP-8037
   * constants (see evm params block).
   */
  8037: {
    perAuthBaseGas: 7816, // REGULAR_PER_AUTH_BASE_COST: AUTH_TUPLE_BYTES (101) * totalCostFloorPerToken (16) + ecrecover (3000) + cold account access (3000) + 2 * warm access (200)
    perEmptyAccountCost: 0, // Regular gas for empty authority (down from 25000); replaced by accountWriteGas + perAuthBaseGas plus the state-gas portion ((stateBytesPerNewAccount + stateBytesPerAuthBase) * costPerStateByte)
    accountWriteGas: 8000, // ACCOUNT_WRITE: regular gas per authorization for the account write (refunded when the authority account already exists)
    txCreationGas: 11000, // CREATE_ACCESS = ACCOUNT_WRITE (8000) + COLD_STORAGE_ACCESS (3000); state portion = stateBytesPerNewAccount * costPerStateByte
  },
}
