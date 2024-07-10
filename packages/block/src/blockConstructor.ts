import { RLP } from '@ethereumjs/rlp'
import { Trie } from '@ethereumjs/trie'
import { TransactionFactory } from '@ethereumjs/tx'
import {
  CLRequestFactory,
  ConsolidationRequest,
  DepositRequest,
  Withdrawal,
  WithdrawalRequest,
  bigIntToHex,
  fetchFromProvider,
  getProvider,
  intToHex,
  isHexString,
} from '@ethereumjs/util'
import { bytesToHex, bytesToUtf8, equalsBytes, hexToBytes } from 'ethereum-cryptography/utils'

import { blockFromRpc } from './from-rpc.js'
import { genRequestsTrieRoot, genTransactionsTrieRoot, genWithdrawalsTrieRoot } from './helpers.js'

import { Block, BlockHeader, executionPayloadFromBeaconPayload } from './index.js'

import type { BeaconPayloadJson } from './from-beacon-payload'
import type {
  BlockBytes,
  BlockData,
  BlockOptions,
  ExecutionPayload,
  ExecutionWitnessBytes,
  HeaderData,
  JsonRpcBlock,
  RequestsBytes,
  WithdrawalsBytes,
} from './types'
import type { TxOptions } from '@ethereumjs/tx'
import type {
  CLRequest,
  CLRequestType,
  EthersProvider,
  PrefixedHexString,
  RequestBytes,
  WithdrawalBytes,
} from '@ethereumjs/util'

/**
 * Static constructor to create a block from a block data dictionary
 *
 * @param blockData
 * @param opts
 */
export function blockFromBlockData(blockData: BlockData = {}, opts?: BlockOptions) {
  const {
    header: headerData,
    transactions: txsData,
    uncleHeaders: uhsData,
    withdrawals: withdrawalsData,
    executionWitness: executionWitnessData,
    requests: clRequests,
  } = blockData

  const header = BlockHeader.fromHeaderData(headerData, opts)

  // parse transactions
  const transactions = []
  for (const txData of txsData ?? []) {
    const tx = TransactionFactory.fromTxData(txData, {
      ...opts,
      // Use header common in case of setHardfork being activated
      common: header.common,
    } as TxOptions)
    transactions.push(tx)
  }

  // parse uncle headers
  const uncleHeaders = []
  const uncleOpts: BlockOptions = {
    ...opts,
    // Use header common in case of setHardfork being activated
    common: header.common,
    // Disable this option here (all other options carried over), since this overwrites the provided Difficulty to an incorrect value
    calcDifficultyFromHeader: undefined,
  }
  // Uncles are obsolete post-merge, any hardfork by option implies setHardfork
  if (opts?.setHardfork !== undefined) {
    uncleOpts.setHardfork = true
  }
  for (const uhData of uhsData ?? []) {
    const uh = BlockHeader.fromHeaderData(uhData, uncleOpts)
    uncleHeaders.push(uh)
  }

  const withdrawals = withdrawalsData?.map(Withdrawal.fromWithdrawalData)
  // The witness data is planned to come in rlp serialized bytes so leave this
  // stub till that time
  const executionWitness = executionWitnessData

  return new Block(
    header,
    transactions,
    uncleHeaders,
    withdrawals,
    opts,
    clRequests,
    executionWitness
  )
}

/**
 * Static constructor to create a block from an array of Bytes values
 *
 * @param values
 * @param opts
 */
export function blockFromValuesArray(values: BlockBytes, opts?: BlockOptions) {
  if (values.length > 5) {
    throw new Error(`invalid  More values=${values.length} than expected were received (at most 5)`)
  }

  // First try to load header so that we can use its common (in case of setHardfork being activated)
  // to correctly make checks on the hardforks
  const [headerData, txsData, uhsData, ...valuesTail] = values
  const header = BlockHeader.fromValuesArray(headerData, opts)

  // conditional assignment of rest of values and splicing them out from the valuesTail
  const withdrawalBytes = header.common.isActivatedEIP(4895)
    ? (valuesTail.splice(0, 1)[0] as WithdrawalsBytes)
    : undefined
  const requestBytes = header.common.isActivatedEIP(7685)
    ? (valuesTail.splice(0, 1)[0] as RequestsBytes)
    : undefined
  // if witness bytes are not present that we should assume that witness has not been provided
  // in that scenario pass null as undefined is used for default witness assignment
  const executionWitnessBytes = header.common.isActivatedEIP(6800)
    ? (valuesTail.splice(0, 1)[0] as ExecutionWitnessBytes)
    : null

  if (
    header.common.isActivatedEIP(4895) &&
    (withdrawalBytes === undefined || !Array.isArray(withdrawalBytes))
  ) {
    throw new Error(
      'Invalid serialized block input: EIP-4895 is active, and no withdrawals were provided as array'
    )
  }

  if (
    header.common.isActivatedEIP(7685) &&
    (requestBytes === undefined || !Array.isArray(requestBytes))
  ) {
    throw new Error(
      'Invalid serialized block input: EIP-7685 is active, and no requestBytes were provided as array'
    )
  }

  if (header.common.isActivatedEIP(6800) && executionWitnessBytes === undefined) {
    throw new Error(
      'Invalid serialized block input: EIP-6800 is active, and execution witness is undefined'
    )
  }

  // parse transactions
  const transactions = []
  for (const txData of txsData ?? []) {
    transactions.push(
      TransactionFactory.fromBlockBodyData(txData, {
        ...opts,
        // Use header common in case of setHardfork being activated
        common: header.common,
      })
    )
  }

  // parse uncle headers
  const uncleHeaders = []
  const uncleOpts: BlockOptions = {
    ...opts,
    // Use header common in case of setHardfork being activated
    common: header.common,
    // Disable this option here (all other options carried over), since this overwrites the provided Difficulty to an incorrect value
    calcDifficultyFromHeader: undefined,
  }
  // Uncles are obsolete post-merge, any hardfork by option implies setHardfork
  if (opts?.setHardfork !== undefined) {
    uncleOpts.setHardfork = true
  }
  for (const uncleHeaderData of uhsData ?? []) {
    uncleHeaders.push(BlockHeader.fromValuesArray(uncleHeaderData, uncleOpts))
  }

  const withdrawals = (withdrawalBytes as WithdrawalBytes[])
    ?.map(([index, validatorIndex, address, amount]) => ({
      index,
      validatorIndex,
      address,
      amount,
    }))
    ?.map(Withdrawal.fromWithdrawalData)

  let requests
  if (header.common.isActivatedEIP(7685)) {
    requests = (requestBytes as RequestBytes[]).map((bytes) =>
      CLRequestFactory.fromSerializedRequest(bytes)
    )
  }
  // executionWitness are not part of the EL fetched blocks via eth_ bodies method
  // they are currently only available via the engine api constructed blocks
  let executionWitness
  if (header.common.isActivatedEIP(6800)) {
    if (executionWitnessBytes !== undefined) {
      executionWitness = JSON.parse(bytesToUtf8(RLP.decode(executionWitnessBytes) as Uint8Array))
    } else if (opts?.executionWitness !== undefined) {
      executionWitness = opts.executionWitness
    } else {
      // don't assign default witness if eip 6800 is implemented as it leads to incorrect
      // assumptions while executing the  if not present in input implies its unavailable
      executionWitness = null
    }
  }

  return new Block(
    header,
    transactions,
    uncleHeaders,
    withdrawals,
    opts,
    requests,
    executionWitness
  )
}

/**
 * Static constructor to create a block from a RLP-serialized block
 *
 * @param serialized
 * @param opts
 */
export function blockFromRLPSerializedBlock(serialized: Uint8Array, opts?: BlockOptions) {
  const values = RLP.decode(Uint8Array.from(serialized)) as BlockBytes

  if (!Array.isArray(values)) {
    throw new Error('Invalid serialized block input. Must be array')
  }

  return blockFromValuesArray(values, opts)
}

/**
 * Creates a new block object from Ethereum JSON RPC.
 *
 * @param blockParams - Ethereum JSON RPC of block (eth_getBlockByNumber)
 * @param uncles - Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)
 * @param opts - An object describing the blockchain
 */
export function blockFromRPC(blockData: JsonRpcBlock, uncles?: any[], opts?: BlockOptions) {
  return blockFromRpc(blockData, uncles, opts)
}

/**
 *  Method to retrieve a block from a JSON-RPC provider and format as a {@link Block}
 * @param provider either a url for a remote provider or an Ethers JsonRpcProvider object
 * @param blockTag block hash or block number to be run
 * @param opts {@link BlockOptions}
 * @returns the block specified by `blockTag`
 */
export const blockFromJsonRpcProvider = async (
  provider: string | EthersProvider,
  blockTag: string | bigint,
  opts: BlockOptions
) => {
  let blockData
  const providerUrl = getProvider(provider)

  if (typeof blockTag === 'string' && blockTag.length === 66) {
    blockData = await fetchFromProvider(providerUrl, {
      method: 'eth_getBlockByHash',
      params: [blockTag, true],
    })
  } else if (typeof blockTag === 'bigint') {
    blockData = await fetchFromProvider(providerUrl, {
      method: 'eth_getBlockByNumber',
      params: [bigIntToHex(blockTag), true],
    })
  } else if (
    isHexString(blockTag) ||
    blockTag === 'latest' ||
    blockTag === 'earliest' ||
    blockTag === 'pending' ||
    blockTag === 'finalized' ||
    blockTag === 'safe'
  ) {
    blockData = await fetchFromProvider(providerUrl, {
      method: 'eth_getBlockByNumber',
      params: [blockTag, true],
    })
  } else {
    throw new Error(
      `expected blockTag to be block hash, bigint, hex prefixed string, or earliest/latest/pending; got ${blockTag}`
    )
  }

  if (blockData === null) {
    throw new Error('No block data returned from provider')
  }

  const uncleHeaders = []
  if (blockData.uncles.length > 0) {
    for (let x = 0; x < blockData.uncles.length; x++) {
      const headerData = await fetchFromProvider(providerUrl, {
        method: 'eth_getUncleByBlockHashAndIndex',
        params: [blockData.hash, intToHex(x)],
      })
      uncleHeaders.push(headerData)
    }
  }

  return blockFromRpc(blockData, uncleHeaders, opts)
}

/**
 *  Method to retrieve a block from an execution payload
 * @param execution payload constructed from beacon payload
 * @param opts {@link BlockOptions}
 * @returns the block constructed block
 */
export async function blockFromExecutionPayload(
  payload: ExecutionPayload,
  opts?: BlockOptions
): Promise<Block> {
  const {
    blockNumber: number,
    receiptsRoot: receiptTrie,
    prevRandao: mixHash,
    feeRecipient: coinbase,
    transactions,
    withdrawals: withdrawalsData,
    depositRequests,
    withdrawalRequests,
    consolidationRequests,
    executionWitness,
  } = payload

  const txs = []
  for (const [index, serializedTx] of transactions.entries()) {
    try {
      const tx = TransactionFactory.fromSerializedData(
        hexToBytes(serializedTx as PrefixedHexString),
        {
          common: opts?.common,
        }
      )
      txs.push(tx)
    } catch (error) {
      const validationError = `Invalid tx at index ${index}: ${error}`
      throw validationError
    }
  }

  const transactionsTrie = await genTransactionsTrieRoot(txs, new Trie({ common: opts?.common }))
  const withdrawals = withdrawalsData?.map((wData) => Withdrawal.fromWithdrawalData(wData))
  const withdrawalsRoot = withdrawals
    ? await genWithdrawalsTrieRoot(withdrawals, new Trie({ common: opts?.common }))
    : undefined

  const hasDepositRequests = depositRequests !== undefined && depositRequests !== null
  const hasWithdrawalRequests = withdrawalRequests !== undefined && withdrawalRequests !== null
  const hasConsolidationRequests =
    consolidationRequests !== undefined && consolidationRequests !== null

  const requests =
    hasDepositRequests || hasWithdrawalRequests || hasConsolidationRequests
      ? ([] as CLRequest<CLRequestType>[])
      : undefined

  if (depositRequests !== undefined && depositRequests !== null) {
    for (const dJson of depositRequests) {
      requests!.push(DepositRequest.fromJSON(dJson))
    }
  }
  if (withdrawalRequests !== undefined && withdrawalRequests !== null) {
    for (const wJson of withdrawalRequests) {
      requests!.push(WithdrawalRequest.fromJSON(wJson))
    }
  }
  if (consolidationRequests !== undefined && consolidationRequests !== null) {
    for (const cJson of consolidationRequests) {
      requests!.push(ConsolidationRequest.fromJSON(cJson))
    }
  }

  const requestsRoot = requests
    ? await genRequestsTrieRoot(requests, new Trie({ common: opts?.common }))
    : undefined

  const header: HeaderData = {
    ...payload,
    number,
    receiptTrie,
    transactionsTrie,
    withdrawalsRoot,
    mixHash,
    coinbase,
    requestsRoot,
  }

  // we are not setting setHardfork as common is already set to the correct hf
  const block = blockFromBlockData(
    { header, transactions: txs, withdrawals, executionWitness, requests },
    opts
  )
  if (
    block.common.isActivatedEIP(6800) &&
    (executionWitness === undefined || executionWitness === null)
  ) {
    throw Error('Missing executionWitness for EIP-6800 activated executionPayload')
  }
  // Verify blockHash matches payload
  if (!equalsBytes(block.hash(), hexToBytes(payload.blockHash as PrefixedHexString))) {
    const validationError = `Invalid blockHash, expected: ${
      payload.blockHash
    }, received: ${bytesToHex(block.hash())}`
    throw Error(validationError)
  }

  return block
}

/**
 *  Method to retrieve a block from a beacon payload json
 * @param payload json of a beacon beacon fetched from beacon apis
 * @param opts {@link BlockOptions}
 * @returns the block constructed block
 */
export async function fromBeaconPayloadJson(
  payload: BeaconPayloadJson,
  opts?: BlockOptions
): Promise<Block> {
  const executionPayload = executionPayloadFromBeaconPayload(payload)
  return blockFromExecutionPayload(executionPayload, opts)
}
