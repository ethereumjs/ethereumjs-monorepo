import { MerklePatriciaTrie } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import type { TxOptions, TypedTransaction } from '@ethereumjs/tx'
import {
  createTx,
  createTxFromBlockBodyData,
  createTxFromRLP,
  normalizeTxParams,
} from '@ethereumjs/tx'
import {
  EthereumJSErrorWithoutCode,
  bigIntToHex,
  bytesToHex,
  createWithdrawal,
  equalsBytes,
  fetchFromProvider,
  getProvider,
  hexToBytes,
  intToHex,
  isHexString,
} from '@ethereumjs/util'

import { generateCliqueBlockExtraData } from '../consensus/clique.ts'
import { genTransactionsTrieRoot, genWithdrawalsTrieRoot } from '../helpers.ts'
import {
  Block,
  createBlockHeader,
  createBlockHeaderFromBytesArray,
  createBlockHeaderFromRPC,
  executionPayloadFromBeaconPayload,
} from '../index.ts'

import type { EthersProvider, WithdrawalBytes } from '@ethereumjs/util'
import type { BeaconPayloadJSON } from '../from-beacon-payload.ts'
import type {
  BlockBytes,
  BlockData,
  BlockOptions,
  ExecutionPayload,
  HeaderData,
  JSONRPCBlock,
  WithdrawalsBytes,
} from '../types.ts'

/**
 * Static constructor to create a block from a block data dictionary
 *
 * @param blockData
 * @param opts
 * @returns a new {@link Block} object
 */
export function createBlock(blockData: BlockData = {}, opts?: BlockOptions): Block {
  const {
    header: headerData,
    transactions: txsData,
    uncleHeaders: uhsData,
    withdrawals: withdrawalsData,
  } = blockData

  const header = createBlockHeader(headerData, opts)

  // parse transactions
  const transactions = []
  for (const txData of txsData ?? []) {
    const tx = createTx(txData, {
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
    const uh = createBlockHeader(uhData, uncleOpts)
    uncleHeaders.push(uh)
  }

  const withdrawals = withdrawalsData?.map(createWithdrawal)

  return new Block(header, transactions, uncleHeaders, withdrawals, opts)
}

/**
 * Simple static constructor if only an empty block is needed
 * (tree shaking advantages since it does not draw all the tx constructors in)
 *
 * @param headerData
 * @param opts
 * @returns a new {@link Block} object
 */
export function createEmptyBlock(headerData: HeaderData, opts?: BlockOptions): Block {
  const header = createBlockHeader(headerData, opts)
  return new Block(header)
}

/**
 * Static constructor to create a block from an array of Bytes values
 *
 * @param values
 * @param opts
 * @returns a new {@link Block} object
 */
export function createBlockFromBytesArray(values: BlockBytes, opts?: BlockOptions): Block {
  if (values.length > 5) {
    throw EthereumJSErrorWithoutCode(
      `invalid  More values=${values.length} than expected were received (at most 5)`,
    )
  }

  // First try to load header so that we can use its common (in case of setHardfork being activated)
  // to correctly make checks on the hardforks
  const [headerData, txsData, uhsData, ...valuesTail] = values
  const header = createBlockHeaderFromBytesArray(headerData, opts)

  // conditional assignment of rest of values and splicing them out from the valuesTail
  const withdrawalBytes = header.common.isActivatedEIP(4895)
    ? (valuesTail.splice(0, 1)[0] as WithdrawalsBytes)
    : undefined

  if (
    header.common.isActivatedEIP(4895) &&
    (withdrawalBytes === undefined || !Array.isArray(withdrawalBytes))
  ) {
    throw EthereumJSErrorWithoutCode(
      'Invalid serialized block input: EIP-4895 is active, and no withdrawals were provided as array',
    )
  }

  // parse transactions
  const transactions = []
  for (const txData of txsData ?? []) {
    transactions.push(
      createTxFromBlockBodyData(txData, {
        ...opts,
        // Use header common in case of setHardfork being activated
        common: header.common,
      }),
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
    uncleHeaders.push(createBlockHeaderFromBytesArray(uncleHeaderData, uncleOpts))
  }

  const withdrawals = (withdrawalBytes as WithdrawalBytes[])
    ?.map(([index, validatorIndex, address, amount]) => ({
      index,
      validatorIndex,
      address,
      amount,
    }))
    ?.map(createWithdrawal)

  return new Block(header, transactions, uncleHeaders, withdrawals, opts)
}

/**
 * Static constructor to create a block from a RLP-serialized block
 *
 * @param serialized
 * @param opts
 * @returns a new {@link Block} object
 */
export function createBlockFromRLP(serialized: Uint8Array, opts?: BlockOptions): Block {
  if (opts?.common?.isActivatedEIP(7934) === true) {
    const maxRlpBlockSize = opts.common.param('maxRlpBlockSize')
    if (serialized.length > maxRlpBlockSize) {
      throw EthereumJSErrorWithoutCode(
        `Block size exceeds limit: ${serialized.length} > ${maxRlpBlockSize}`,
      )
    }
  }
  const values = RLP.decode(Uint8Array.from(serialized)) as BlockBytes

  if (!Array.isArray(values)) {
    throw EthereumJSErrorWithoutCode('Invalid serialized block input. Must be array')
  }

  return createBlockFromBytesArray(values, opts)
}

/**
 * Creates a new block object from Ethereum JSON RPC.
 *
 * @param blockParams - Ethereum JSON RPC of block (eth_getBlockByNumber)
 * @param uncles - Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)
 * @param opts - An object describing the blockchain
 * @returns a new {@link Block} object
 */
export function createBlockFromRPC(
  blockParams: JSONRPCBlock,
  uncles: any[] = [],
  options?: BlockOptions,
): Block {
  const header = createBlockHeaderFromRPC(blockParams, options)

  const transactions: TypedTransaction[] = []
  const opts = { common: header.common }
  for (const _txParams of blockParams.transactions ?? []) {
    const txParams = normalizeTxParams(_txParams)
    const tx = createTx(txParams, opts)
    transactions.push(tx)
  }

  const uncleHeaders = uncles.map((uh) => createBlockHeaderFromRPC(uh, options))

  return createBlock(
    { header, transactions, uncleHeaders, withdrawals: blockParams.withdrawals },
    options,
  )
}

/**
 *  Method to retrieve a block from a JSON-RPC provider and format as a {@link Block}
 * @param provider either a url for a remote provider or an Ethers JSONRPCProvider object
 * @param blockTag block hash or block number to be run
 * @param opts {@link BlockOptions}
 * @returns a new {@link Block} object specified by `blockTag`
 */
export const createBlockFromJSONRPCProvider = async (
  provider: string | EthersProvider,
  blockTag: string | bigint,
  opts: BlockOptions,
): Promise<Block> => {
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
    throw EthereumJSErrorWithoutCode(
      `expected blockTag to be block hash, bigint, hex prefixed string, or earliest/latest/pending; got ${blockTag}`,
    )
  }

  if (blockData === null) {
    throw EthereumJSErrorWithoutCode('No block data returned from provider')
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

  return createBlockFromRPC(blockData, uncleHeaders, opts)
}

/**
 *  Method to retrieve a block from an execution payload
 * @param payload Execution payload constructed from beacon payload data
 * @param opts {@link BlockOptions}
 * @returns The constructed {@link Block} object
 */
export async function createBlockFromExecutionPayload(
  payload: ExecutionPayload,
  opts?: BlockOptions,
): Promise<Block> {
  const {
    blockNumber: number,
    receiptsRoot: receiptTrie,
    prevRandao: mixHash,
    feeRecipient: coinbase,
    transactions,
    withdrawals: withdrawalsData,
  } = payload

  const txs = []
  for (const [index, serializedTx] of transactions.entries()) {
    try {
      const tx = createTxFromRLP(hexToBytes(serializedTx), {
        common: opts?.common,
      })
      txs.push(tx)
    } catch (error) {
      const validationError = `Invalid tx at index ${index}: ${error}`
      throw validationError
    }
  }

  const transactionsTrie = await genTransactionsTrieRoot(
    txs,
    new MerklePatriciaTrie({ common: opts?.common }),
  )
  const withdrawals = withdrawalsData?.map((wData) => createWithdrawal(wData))
  const withdrawalsRoot = withdrawals
    ? await genWithdrawalsTrieRoot(withdrawals, new MerklePatriciaTrie({ common: opts?.common }))
    : undefined

  const header: HeaderData = {
    ...payload,
    number,
    receiptTrie,
    transactionsTrie,
    withdrawalsRoot,
    mixHash,
    coinbase,
  }

  // we are not setting setHardfork as common is already set to the correct hf
  const block = createBlock({ header, transactions: txs, withdrawals }, opts)
  // Verify blockHash matches payload
  if (!equalsBytes(block.hash(), hexToBytes(payload.blockHash))) {
    const validationError = `Invalid blockHash, expected: ${
      payload.blockHash
    }, received: ${bytesToHex(block.hash())}`
    throw Error(validationError)
  }

  return block
}

/**
 *  Method to retrieve a block from a beacon payload JSON
 * @param payload JSON of a beacon block fetched from beacon APIs
 * @param opts {@link BlockOptions}
 * @returns The constructed {@link Block} object
 */
export async function createBlockFromBeaconPayloadJSON(
  payload: BeaconPayloadJSON,
  opts?: BlockOptions,
): Promise<Block> {
  const executionPayload = executionPayloadFromBeaconPayload(payload)
  return createBlockFromExecutionPayload(executionPayload, opts)
}

/**
 * Creates a block for Clique networks with the seal applied during instantiation.
 * @param blockData Block fields used to build the block
 * @param cliqueSigner Private key bytes used to sign the header
 * @param opts {@link BlockOptions}
 * @returns A sealed Clique {@link Block} object
 */
export function createSealedCliqueBlock(
  blockData: BlockData = {},
  cliqueSigner: Uint8Array,
  opts: BlockOptions = {},
): Block {
  const sealedCliqueBlock = createBlock(blockData, {
    ...opts,
    ...{ freeze: false, skipConsensusFormatValidation: true },
  })
  ;(sealedCliqueBlock.header.extraData as any) = generateCliqueBlockExtraData(
    sealedCliqueBlock.header,
    cliqueSigner,
  )
  if (opts?.freeze === true) {
    // We have to freeze here since we can't freeze the block when constructing it since we are overwriting `extraData`
    Object.freeze(sealedCliqueBlock)
  }
  if (opts?.skipConsensusFormatValidation === false) {
    // We need to validate the consensus format here since we skipped it when constructing the block
    sealedCliqueBlock.header['_consensusFormatValidation']()
  }
  return sealedCliqueBlock
}
