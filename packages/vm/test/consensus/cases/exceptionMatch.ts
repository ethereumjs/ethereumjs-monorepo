/**
 * Maps execution-spec-tests expectException labels to substrings in thrown Error.message.
 * Matching uses message only (not stack) so anchored patterns apply to the throw text.
 */
export const EXCEPTION_MESSAGES: Record<string, RegExp> = {
  'TransactionException.GAS_ALLOWANCE_EXCEEDED':
    /(?:tx has a higher gas limit than the block|tx unable to pay base fee)/,
  'TransactionException.GAS_LIMIT_EXCEEDS_MAXIMUM':
    /Transaction gas limit \d+ exceeds the maximum (?:allowed by EIP-7825|total gas limit) \(\d+\)/,
  'TransactionException.INITCODE_SIZE_EXCEEDED':
    /the initcode size of this transaction is too large/,
  'TransactionException.INSUFFICIENT_ACCOUNT_FUNDS': /sender doesn't have enough funds to send tx/,
  'TransactionException.INSUFFICIENT_MAX_FEE_PER_BLOB_GAS':
    /Transaction's maxFeePerBlobGas \d+\) is less than block blobGasPrice \(\d+\)/,
  'TransactionException.INSUFFICIENT_MAX_FEE_PER_GAS': /tx unable to pay base fee/,
  'TransactionException.INTRINSIC_GAS_BELOW_FLOOR_GAS_COST':
    /gasLimit is too low|INTRINSIC_GAS_TOO_LOW|exceeds the EIP-7825 cap/,
  'TransactionException.INTRINSIC_GAS_TOO_LOW':
    /gasLimit is too low|INTRINSIC_GAS_TOO_LOW|exceeds the EIP-7825 cap/,
  'TransactionException.NONCE_MISMATCH_TOO_LOW': /the tx doesn't have the correct nonce/,
  'TransactionException.PRIORITY_GREATER_THAN_MAX_FEE_PER_GAS':
    /maxFeePerGas cannot be less than maxPriorityFeePerGas/,
  'TransactionException.SENDER_NOT_EOA': /invalid sender address, address is not EOA/,
  'TransactionException.INVALID_SIGNATURE_VRS':
    /Invalid Signature|Legacy txs need either v|s-values greater than secp256k1n|The y-parity of the transaction should either be 0 or 1|Invalid EIP-7702 transaction: authorization list is empty/i,
  'TransactionException.INVALID_CHAINID':
    /Common chain ID|not matching the derived chain ID|Incompatible EIP155-based V|Legacy txs need either v/i,
  'TransactionException.NONCE_MISMATCH_TOO_HIGH': /the tx doesn't have the correct nonce/,
  'TransactionException.NONCE_IS_MAX': /nonce cannot equal or exceed MAX_UINT64/,
  'TransactionException.GASLIMIT_PRICE_PRODUCT_OVERFLOW':
    /gas limit \* gasPrice cannot exceed MAX_INTEGER/,
  'TransactionException.TYPE_1_TX_PRE_FORK': /EIP-2930 not enabled on Common/,
  'TransactionException.TYPE_2_TX_PRE_FORK': /EIP-1559 not enabled on Common/,
  'TransactionException.TYPE_3_TX_BLOB_COUNT_EXCEEDED':
    /\d+ blobs exceeds max \d+ blobs per tx \(EIP-7594\)/,
  'TransactionException.TYPE_3_TX_CONTRACT_CREATION':
    /tx should have a "to" field and cannot be used to create contracts/,
  'TransactionException.TYPE_3_TX_INVALID_BLOB_VERSIONED_HASH':
    /versioned hash does not start with KZG commitment version/,
  'TransactionException.TYPE_3_TX_MAX_BLOB_GAS_ALLOWANCE_EXCEEDED':
    /(?:invalid transactions: errors at tx \d+: )?tx causes total blob gas of \d+ to exceed maximum blob gas per block of \d+/,
  'TransactionException.TYPE_3_TX_PRE_FORK': /EIP-4844 not enabled on Common/,
  'TransactionException.TYPE_3_TX_WITH_FULL_BLOBS': /Invalid EIP-4844 transaction/,
  'TransactionException.TYPE_3_TX_ZERO_BLOBS': /tx should contain at least one blob/,
  'TransactionException.TYPE_4_EMPTY_AUTHORIZATION_LIST': /authorization list is empty/,
  'TransactionException.TYPE_4_TX_CONTRACT_CREATION':
    /tx should have a "to" field and cannot be used to create contracts/,
  'TransactionException.TYPE_4_TX_PRE_FORK': /EIP-7702 not enabled on Common/,
  'BlockException.GAS_USED_OVERFLOW': /tx has a higher gas limit than the block/,
  'BlockException.INCORRECT_BLOB_GAS_USED': /invalid blobGasUsed/,
  'BlockException.INCORRECT_BLOCK_FORMAT':
    /(?:blob gas used can only be provided with EIP4844 activated|invalid header)/,
  'BlockException.INCORRECT_EXCESS_BLOB_GAS': /expected blob gas: \d+, got: \d+/,
  'BlockException.INVALID_BASEFEE_PER_GAS': /Invalid block: base fee not correct/,
  'BlockException.INVALID_DEPOSIT_EVENT_LAYOUT': /invalid deposit log: unsupported data layout/,
  'BlockException.INVALID_REQUESTS': /invalid requestsHash/,
  'BlockException.INVALID_BAL_HASH': /invalid block access list hash/,
  'BlockException.INVALID_BLOCK_HASH': /invalid block access list hash/,
  'BlockException.INVALID_BLOCK_ACCESS_LIST': /invalid block access list/,
  'BlockException.BLOCK_ACCESS_LIST_GAS_LIMIT_EXCEEDED': /block access list gas limit exceeded/,
  'BlockException.INVALID_WITHDRAWALS_ROOT': /invalid withdrawals trie/,
  'BlockException.SYSTEM_CONTRACT_CALL_FAILED':
    /system contract call failed|invalid requestsHash|invalid block.*requestsHash/i,
  'BlockException.SYSTEM_CONTRACT_EMPTY': /system contract empty/i,
  'BlockException.INVALID_GASLIMIT': /gas limit/,
  'BlockException.INVALID_GAS_USED': /invalid gasUsed/,
  'BlockException.RLP_BLOCK_LIMIT_EXCEEDED':
    /Block size exceeds (?:limit|maximum RLP block size limit)/,
}

export function thrownMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

export function exceptionLabelMatches(label: string, message: string): boolean {
  const pattern = EXCEPTION_MESSAGES[label]
  if (pattern === undefined) return false
  return pattern.test(message)
}

export function expectExceptionMatches(expectException: string, error: unknown): boolean {
  const message = thrownMessage(error)
  if (!expectException.includes('|')) {
    return exceptionLabelMatches(expectException, message)
  }
  for (const candidate of expectException.split('|')) {
    if (exceptionLabelMatches(candidate.trim(), message)) return true
  }
  return false
}
