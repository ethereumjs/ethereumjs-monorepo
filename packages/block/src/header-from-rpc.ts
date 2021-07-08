import { BlockHeader } from './header'
import { BlockOptions } from './types'
import { numberToHex } from './helpers'

/**
 * Creates a new block header object from Ethereum JSON RPC.
 *
 * @param blockParams - Ethereum JSON RPC of block (eth_getBlockByNumber)
 * @param chainOptions - An object describing the blockchain
 */
export default function blockHeaderFromRpc(blockParams: any, options?: BlockOptions) {
  const {
    parentHash,
    sha3Uncles,
    miner,
    stateRoot,
    transactionsRoot,
    receiptRoot,
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
  } = blockParams

  let baseFeePerGas

  // Check if the field baseFeePerGas is present in the block.
  // This field was introduced after: https://eips.ethereum.org/EIPS/eip-1559
  if ('baseFeePerGas' in blockParams) {
    baseFeePerGas = blockParams.baseFeePerGas
  }

  const blockHeader = BlockHeader.fromHeaderData(
    {
      parentHash,
      uncleHash: sha3Uncles,
      coinbase: miner,
      stateRoot,
      transactionsTrie: transactionsRoot,
      receiptTrie: receiptRoot || receiptsRoot,
      bloom: logsBloom,
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
