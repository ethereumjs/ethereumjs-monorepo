import { BlockHeader } from './header.js'
import { numberToHex } from './helpers.js'

import type { BlockOptions, JsonRpcBlock } from './types.js'

/**
 * Creates a new block header object from Ethereum JSON RPC.
 *
 * @param blockParams - Ethereum JSON RPC of block (eth_getBlockByNumber)
 * @param options - An object describing the blockchain
 */
export function blockHeaderFromRpc(blockParams: JsonRpcBlock, options?: BlockOptions) {
  const {
    parentHash,
    sha3Uncles,
    miner,
    stateRoot,
    transactionsRoot,
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
    withdrawalsRoot,
    blobGasUsed,
    excessBlobGas,
    parentBeaconBlockRoot,
    requestsRoot,
  } = blockParams

  const blockHeader = BlockHeader.fromHeaderData(
    {
      //@ts-ignore
      parentHash,
      //@ts-ignore
      uncleHash: sha3Uncles,
      //@ts-ignore
      coinbase: miner,
      //@ts-ignore
      stateRoot,
      //@ts-ignore
      transactionsTrie: transactionsRoot,
      //@ts-ignore
      receiptTrie: receiptsRoot,
      //@ts-ignore
      logsBloom,
      difficulty: numberToHex(difficulty),
      //@ts-ignore
      number,
      //@ts-ignore
      gasLimit,
      //@ts-ignore
      gasUsed,
      //@ts-ignore
      timestamp,
      //@ts-ignore
      extraData,
      //@ts-ignore
      mixHash,
      //@ts-ignore
      nonce,
      //@ts-ignore
      baseFeePerGas,
      withdrawalsRoot,
      blobGasUsed,
      excessBlobGas,
      parentBeaconBlockRoot,
      requestsRoot,
    },
    options
  )

  return blockHeader
}
