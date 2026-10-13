import type { ParamsDict } from '@ethereumjs/common'

/**
 * Transaction-related EIP parameters keyed by EIP number.
 *
 * Passed to {@link @ethereumjs/common!Common} via {@link TxOptions.params} to override gas costs and limits.
 */
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
   * `txGas` is TX_BASE. Recipient/value/log extras are also intrinsic
   * (self-transfers skip them) and anchor the EIP-7623 calldata floor
   * together with TX_BASE / CREATE_ACCESS. Charge constants are mirrored
   * on `@ethereumjs/evm` `paramsEVM[2780]` for the EVM Common. New-account
   * state gas stays an access-time charge in the EVM.
   */
  2780: {
    txGas: 12000, // TX_BASE: base sender cost per transaction (down from 21000)
    txValueCost: 6000, // TX_VALUE_COST: recipient balance write + EIP-7708 transfer log (folded since glamsterdam-devnet v8)
    transferLogCost: 1756, // TRANSFER_LOG_COST: in-EVM EIP-7708 emission sites only (not tx-level intrinsic since v8)
    txRecipientAccessGas: 3000, // Recipient cost for a non-self-transfer call (= COLD_ACCOUNT_ACCESS under EIP-8038)
  },
  /**
   * Access list data pricing (Amsterdam, experimental).
   * Repriced to match COLD_ACCOUNT_ACCESS / COLD_STORAGE_ACCESS under EIP-8038
   * before v8. EIP-8038 then sets intrinsic to cold minus WARM_ACCESS (2900).
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
  /**
   * State-access gas cost update — access-list intrinsic repriced to
   * `COLD_*_ACCESS - WARM_ACCESS` (2900 per address, 2000 per storage key
   * under v8.1.0). Overrides EIP-7981's 3000/3000 execution component; the
   * 7981 floor-token charge on access-list bytes is unchanged.
   */
  8038: {
    accessListStorageKeyGas: 2000, // COLD_STORAGE_ACCESS - WARM_ACCESS (2100 - 100)
    accessListAddressGas: 2900, // COLD_ACCOUNT_ACCESS - WARM_ACCESS (3000 - 100)
    accountWriteGas: 9000, // ACCOUNT_WRITE (overrides 8037's 8000)
    txCreationGas: 12000, // CREATE_ACCESS = ACCOUNT_WRITE + COLD_ACCOUNT_ACCESS
  },
}
