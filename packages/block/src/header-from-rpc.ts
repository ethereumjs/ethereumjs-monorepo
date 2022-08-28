import { BlockHeader } from './header'
import { numberToHex } from './helpers'

import type { BlockOptions, JsonRpcBlock } from './types'

/**
 * Creates a new block header object from Ethereum JSON RPC.
 *
 * @param blockParams - Ethereum JSON RPC of block (eth_getBlockByNumber)
 * @param options - An object describing the blockchain
 */
export function blockHeaderFromRpc(
  blockParams: Omit<JsonRpcBlock, 'receiptsRoot'> & { receiptRoot?: string; receiptsRoot?: string },
  options?: BlockOptions
) {
  const {
    parentHash,
    sha3Uncles,
    miner,
    stateRoot,
    transactionsRoot,
    receiptRoot, // TODO: Investigate dual receiptRoot/receiptsRoot usage.
    receiptsRoot,
    logsBloom,
    difficulty,
    number,
    gasLimit,
    gasUsed,
    timestamp,
    extraData,
    mixHash,
    nonce,
    baseFeePerGas,
  } = blockParams

  const blockHeader = BlockHeader.fromHeaderData(
    {
      parentHash,
      uncleHash: sha3Uncles,
      coinbase: miner,
      stateRoot,
      transactionsTrie: transactionsRoot,
      receiptTrie: receiptRoot ?? receiptsRoot,
      logsBloom,
      difficulty: numberToHex(difficulty),
      number,
      gasLimit,
      gasUsed,
      timestamp,
      extraData,
      mixHash,
      nonce,
      baseFeePerGas,
    },
    options
  )

  return blockHeader
}
