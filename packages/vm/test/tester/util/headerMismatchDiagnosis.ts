/**
 * EST-only diagnosis for post-execution header mismatches.
 *
 * `runBlock` throws `invalid receiptTrie` / `invalid bloom` / `invalid gasUsed`
 * (and then reverts state) before returning computed fields. Each tx still
 * emitted `afterTx` with the receipt preimage. This helper rebuilds header
 * fields from that buffer and formats a classification + per-tx summary.
 *
 * The VM error `message` is never modified. The runner attaches the text as
 * {@link HEADER_DIAGNOSIS_PROP} and prints it from `throwCombinedFailure`.
 */
import type { Block } from '@ethereumjs/block'
import type { Common } from '@ethereumjs/common'
import { MerklePatriciaTrie } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import { BIGINT_0, KECCAK256_RLP, bytesToHex, equalsBytes } from '@ethereumjs/util'

import { Bloom, encodeReceipt } from '../../../src/index.ts'
import type { AfterTxEvent, PostByzantiumTxReceipt, TxReceipt } from '../../../src/index.ts'

/** Extra property set on the original VM Error (message unchanged). */
export const HEADER_DIAGNOSIS_PROP = 'headerDiagnosis'

const HEADER_MISMATCH_RE =
  /invalid receiptTrie|invalid bloom|invalid gasUsed|invalid block stateRoot/

export type HeaderMismatchClass =
  | 'gas accounting'
  | 'gas accounting (header vs receipt split)'
  | 'logs (address/topics)'
  | 'status, encoding, or log data'
  | 'logs bloom (receipts root matched)'
  | 'mixed execution'
  | 'receipts match (header gas/bloom/root elsewhere)'
  | 'incomplete (block threw during tx execution)'

export function isHeaderMismatchError(message: string): boolean {
  return HEADER_MISMATCH_RE.test(message)
}

export function foldHeaderGasUsed(txs: AfterTxEvent[], eip8037: boolean): bigint {
  if (eip8037 === false) {
    let gasUsed = BIGINT_0
    for (const tx of txs) {
      gasUsed += tx.blockGasSpent
    }
    return gasUsed
  }

  let blockRegularGasUsed = BIGINT_0
  let blockStateGasUsed = BIGINT_0
  let gasUsed = BIGINT_0
  for (const tx of txs) {
    if (tx.txRegularGas !== undefined) {
      blockRegularGasUsed += tx.txRegularGas
      blockStateGasUsed += tx.txStateGas ?? BIGINT_0
      gasUsed = blockRegularGasUsed > blockStateGasUsed ? blockRegularGasUsed : blockStateGasUsed
    } else {
      gasUsed += tx.blockGasSpent
    }
  }
  return gasUsed
}

export function foldLogsBloom(txs: AfterTxEvent[], common: Common): Uint8Array {
  const bloom = new Bloom(undefined, common)
  for (const tx of txs) {
    bloom.or(tx.bloom)
  }
  return bloom.bitvector
}

export async function computeReceiptsRoot(
  txs: AfterTxEvent[],
  common: Common,
): Promise<Uint8Array> {
  if (txs.length === 0) {
    return KECCAK256_RLP
  }
  const trie = new MerklePatriciaTrie({ common })
  for (let i = 0; i < txs.length; i++) {
    const encoded = encodeReceipt(txs[i].receipt, txs[i].transaction.type)
    await trie.put(RLP.encode(i), encoded)
  }
  return trie.root()
}

export function classifyHeaderMismatch(opts: {
  receiptMismatch: boolean
  gasMismatch: boolean
  bloomMismatch: boolean
  incomplete: boolean
}): HeaderMismatchClass {
  if (opts.incomplete === true) {
    return 'incomplete (block threw during tx execution)'
  }
  if (
    opts.receiptMismatch === false &&
    opts.gasMismatch === false &&
    opts.bloomMismatch === false
  ) {
    return 'receipts match (header gas/bloom/root elsewhere)'
  }
  if (opts.receiptMismatch === true && opts.gasMismatch === true && opts.bloomMismatch === false) {
    return 'gas accounting'
  }
  if (opts.receiptMismatch === true && opts.gasMismatch === false && opts.bloomMismatch === true) {
    return 'logs (address/topics)'
  }
  if (opts.receiptMismatch === true && opts.gasMismatch === false && opts.bloomMismatch === false) {
    return 'status, encoding, or log data'
  }
  if (opts.receiptMismatch === false && opts.gasMismatch === true && opts.bloomMismatch === false) {
    return 'gas accounting (header vs receipt split)'
  }
  if (opts.receiptMismatch === false && opts.bloomMismatch === true) {
    return 'logs bloom (receipts root matched)'
  }
  return 'mixed execution'
}

export function formatTxLine(index: number, tx: AfterTxEvent): string {
  const receipt = tx.receipt
  const parts = [
    `tx${index}`,
    `type=${tx.transaction.type}`,
    formatReceiptStatus(receipt),
    `cum=${receipt.cumulativeBlockGasUsed}`,
    `logs=${receipt.logs.length}`,
    `gasSpent=${tx.totalGasSpent}`,
    `blockGas=${tx.blockGasSpent}`,
  ]
  if (tx.txRegularGas !== undefined) {
    parts.push(`regular=${tx.txRegularGas}`)
  }
  if (tx.txStateGas !== undefined) {
    parts.push(`state=${tx.txStateGas}`)
  }
  const exception = tx.execResult.exceptionError?.error
  if (exception !== undefined) {
    parts.push(`exception=${exception}`)
  }
  return parts.join(' ')
}

function formatReceiptStatus(receipt: TxReceipt): string {
  if ('status' in receipt) {
    return `status=${(receipt as PostByzantiumTxReceipt).status}`
  }
  return `stateRoot=${bytesToHex(receipt.stateRoot)}`
}

function fieldLine(name: string, status: string, extra?: string): string {
  const body = extra === undefined ? '' : ` ${extra}`
  return `  ${name.padEnd(12)} ${status}${body}`
}

export async function formatHeaderMismatchDiagnosis(
  block: Block,
  txs: AfterTxEvent[],
  common: Common,
): Promise<string> {
  const expectedTxs = block.transactions.length
  if (txs.length === 0 && expectedTxs > 0) {
    return [
      'Header execution mismatch (computed from afterTx vs block header):',
      `  class: incomplete (block threw during tx execution)`,
      `  txs captured: 0/${expectedTxs} (threw before any tx completed)`,
    ].join('\n')
  }

  const eip8037 = common.isActivatedEIP(8037)
  const computedReceiptsRoot = await computeReceiptsRoot(txs, common)
  const computedGasUsed = foldHeaderGasUsed(txs, eip8037)
  const computedBloom = foldLogsBloom(txs, common)

  const receiptMismatch = equalsBytes(computedReceiptsRoot, block.header.receiptTrie) === false
  const gasMismatch = computedGasUsed !== block.header.gasUsed
  const bloomMismatch = equalsBytes(computedBloom, block.header.logsBloom) === false
  const incomplete = txs.length !== expectedTxs

  const mismatchClass = classifyHeaderMismatch({
    receiptMismatch,
    gasMismatch,
    bloomMismatch,
    incomplete,
  })

  const lines: string[] = [
    'Header execution mismatch (computed from afterTx vs block header):',
    `  class: ${mismatchClass}`,
    fieldLine(
      'receiptTrie',
      receiptMismatch ? 'mismatch' : 'match',
      receiptMismatch
        ? `got=${bytesToHex(computedReceiptsRoot)} want=${bytesToHex(block.header.receiptTrie)}`
        : undefined,
    ),
    fieldLine(
      'gasUsed',
      gasMismatch ? 'mismatch' : 'match',
      gasMismatch ? `got=${computedGasUsed} want=${block.header.gasUsed}` : undefined,
    ),
    fieldLine('bloom', bloomMismatch ? 'mismatch' : 'match'),
    fieldLine('stateRoot', 'unknown', '(block reverted)'),
  ]

  if (incomplete === true && txs.length > 0) {
    lines.push(`  txs captured: ${txs.length}/${expectedTxs} (block threw during execution)`)
  }

  if (eip8037 === true || common.isActivatedEIP(7778) === true) {
    lines.push(
      '  note: header gasUsed uses EIP-7778/8037 rules; receipt cumulative keeps refund subtraction',
    )
  }

  for (let i = 0; i < txs.length; i++) {
    lines.push(`  ${formatTxLine(i, txs[i])}`)
  }

  return lines.join('\n')
}

export async function attachHeaderDiagnosis(
  error: unknown,
  block: Block,
  txs: AfterTxEvent[],
  common: Common,
): Promise<void> {
  if (error instanceof Error === false) return
  if (isHeaderMismatchError(error.message) === false) return
  const text = await formatHeaderMismatchDiagnosis(block, txs, common)
  ;(error as Error & { [HEADER_DIAGNOSIS_PROP]?: string })[HEADER_DIAGNOSIS_PROP] = text
}

export function getHeaderDiagnosis(error: Error): string | undefined {
  const diagnosis = (error as Error & { [HEADER_DIAGNOSIS_PROP]?: string })[HEADER_DIAGNOSIS_PROP]
  if (diagnosis === undefined || diagnosis.length === 0) return undefined
  return diagnosis
}
