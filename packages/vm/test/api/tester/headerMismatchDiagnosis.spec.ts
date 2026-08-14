import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { KECCAK256_RLP } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Bloom } from '../../../src/index.ts'
import type { AfterTxEvent } from '../../../src/index.ts'
import {
  attachHeaderDiagnosis,
  classifyHeaderMismatch,
  foldHeaderGasUsed,
  formatHeaderMismatchDiagnosis,
  formatTxLine,
  getHeaderDiagnosis,
  isHeaderMismatchError,
} from '../../tester/util/headerMismatchDiagnosis.ts'

const prague = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
const amsterdam = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

function stubTx(overrides: Record<string, unknown> = {}): AfterTxEvent {
  return {
    transaction: { type: 2 },
    receipt: {
      status: 1,
      cumulativeBlockGasUsed: 21000n,
      bitvector: new Uint8Array(256),
      logs: [],
    },
    bloom: new Bloom(),
    totalGasSpent: 21000n,
    blockGasSpent: 21000n,
    execResult: {},
    ...overrides,
  } as unknown as AfterTxEvent
}

describe('headerMismatchDiagnosis', () => {
  describe('isHeaderMismatchError', () => {
    it('matches post-execution header errors', () => {
      assert.isTrue(
        isHeaderMismatchError('invalid receiptTrie (vm hf=amsterdam -> block number=1)'),
      )
      assert.isTrue(isHeaderMismatchError('invalid bloom (vm hf=prague -> block number=1)'))
      assert.isTrue(isHeaderMismatchError('invalid gasUsed (vm hf=cancun -> block number=1)'))
      assert.isTrue(
        isHeaderMismatchError(
          'invalid block stateRoot, got: 0x01, want: 0x02 (vm hf=prague -> block number=1)',
        ),
      )
    })

    it('does not match unrelated errors', () => {
      assert.isFalse(isHeaderMismatchError('invalid blobGasUsed'))
      assert.isFalse(isHeaderMismatchError("the tx doesn't have the correct nonce"))
      assert.isFalse(isHeaderMismatchError('invalid requestsHash'))
    })
  })

  describe('classifyHeaderMismatch', () => {
    it('classifies gas / logs / status / mixed / incomplete', () => {
      assert.equal(
        classifyHeaderMismatch({
          receiptMismatch: true,
          gasMismatch: true,
          bloomMismatch: false,
          incomplete: false,
        }),
        'gas accounting',
      )
      assert.equal(
        classifyHeaderMismatch({
          receiptMismatch: true,
          gasMismatch: false,
          bloomMismatch: true,
          incomplete: false,
        }),
        'logs (address/topics)',
      )
      assert.equal(
        classifyHeaderMismatch({
          receiptMismatch: true,
          gasMismatch: false,
          bloomMismatch: false,
          incomplete: false,
        }),
        'status, encoding, or log data',
      )
      assert.equal(
        classifyHeaderMismatch({
          receiptMismatch: true,
          gasMismatch: true,
          bloomMismatch: true,
          incomplete: false,
        }),
        'mixed execution',
      )
      assert.equal(
        classifyHeaderMismatch({
          receiptMismatch: false,
          gasMismatch: true,
          bloomMismatch: false,
          incomplete: false,
        }),
        'gas accounting (header vs receipt split)',
      )
      assert.equal(
        classifyHeaderMismatch({
          receiptMismatch: false,
          gasMismatch: false,
          bloomMismatch: false,
          incomplete: false,
        }),
        'receipts match (header gas/bloom/root elsewhere)',
      )
      assert.equal(
        classifyHeaderMismatch({
          receiptMismatch: true,
          gasMismatch: true,
          bloomMismatch: true,
          incomplete: true,
        }),
        'incomplete (block threw during tx execution)',
      )
    })
  })

  describe('foldHeaderGasUsed', () => {
    it('sums blockGasSpent when EIP-8037 is inactive', () => {
      const txs = [
        stubTx({ blockGasSpent: 21000n }),
        stubTx({ blockGasSpent: 5000n, totalGasSpent: 4000n }),
      ]
      assert.equal(foldHeaderGasUsed(txs, false), 26000n)
    })

    it('uses max(regular, state) accumulators when EIP-8037 is active', () => {
      const txs = [
        stubTx({ txRegularGas: 100n, txStateGas: 50n, blockGasSpent: 150n }),
        stubTx({ txRegularGas: 20n, txStateGas: 80n, blockGasSpent: 100n }),
      ]
      // regular=120, state=130 → 130
      assert.equal(foldHeaderGasUsed(txs, true), 130n)
    })
  })

  describe('formatTxLine', () => {
    it('includes status, gas, and exception when present', () => {
      const tx = stubTx({
        execResult: { exceptionError: { error: 'out of gas' } },
        receipt: {
          status: 0,
          cumulativeBlockGasUsed: 22000n,
          bitvector: new Uint8Array(256),
          logs: [0],
        },
        txRegularGas: 100n,
        txStateGas: 50n,
      })
      const line = formatTxLine(1, tx)
      assert.include(line, 'tx1')
      assert.include(line, 'type=2')
      assert.include(line, 'status=0')
      assert.include(line, 'cum=22000')
      assert.include(line, 'logs=1')
      assert.include(line, 'exception=out of gas')
      assert.include(line, 'regular=100')
      assert.include(line, 'state=50')
    })
  })

  describe('formatHeaderMismatchDiagnosis', () => {
    it('reports a match matrix for an empty block', async () => {
      const block = createBlock({}, { common: prague, skipConsensusFormatValidation: true })
      const text = await formatHeaderMismatchDiagnosis(block, [], prague)
      assert.include(text, 'class: receipts match (header gas/bloom/root elsewhere)')
      assert.match(text, /receiptTrie\s+match/)
      assert.match(text, /gasUsed\s+match/)
      assert.match(text, /bloom\s+match/)
      assert.match(text, /stateRoot\s+unknown \(block reverted\)/)
      assert.notInclude(text, 'note: header gasUsed uses EIP-7778/8037')
    })

    it('classifies header-vs-receipt gas split and notes 7778/8037 on Amsterdam', async () => {
      const block = createBlock(
        { header: { gasUsed: 1n } },
        { common: amsterdam, skipConsensusFormatValidation: true },
      )
      const text = await formatHeaderMismatchDiagnosis(block, [], amsterdam)
      assert.include(text, 'class: gas accounting (header vs receipt split)')
      assert.match(text, /gasUsed\s+mismatch got=0 want=1/)
      assert.include(text, 'note: header gasUsed uses EIP-7778/8037 rules')
    })

    it('rebuilds receipt root and gas from afterTx and classifies a gas bug', async () => {
      const base = createBlock({}, { common: prague, skipConsensusFormatValidation: true })
      const block = {
        header: base.header,
        transactions: [{}],
      } as unknown as typeof base
      const text = await formatHeaderMismatchDiagnosis(block, [stubTx()], prague)
      assert.include(text, 'class: gas accounting')
      assert.match(text, /receiptTrie\s+mismatch/)
      assert.match(text, /gasUsed\s+mismatch got=21000 want=0/)
      assert.include(text, 'tx0 type=2 status=1 cum=21000 logs=0')
    })

    it('reports incomplete capture when the block has txs but afterTx never fired', async () => {
      const base = createBlock({}, { common: prague, skipConsensusFormatValidation: true })
      const block = {
        header: base.header,
        transactions: [{}],
      } as unknown as typeof base
      const text = await formatHeaderMismatchDiagnosis(block, [], prague)
      assert.include(text, 'class: incomplete (block threw during tx execution)')
      assert.include(text, 'txs captured: 0/1 (threw before any tx completed)')
    })
  })

  describe('attachHeaderDiagnosis', () => {
    it('attaches diagnosis without changing error.message', async () => {
      const block = createBlock(
        { header: { gasUsed: 1n, receiptTrie: KECCAK256_RLP } },
        { common: prague, skipConsensusFormatValidation: true },
      )
      const message = 'invalid receiptTrie (vm hf=prague -> block number=0)'
      const error = new Error(message)
      await attachHeaderDiagnosis(error, block, [], prague)
      assert.equal(error.message, message)
      assert.include(getHeaderDiagnosis(error)!, 'class:')
    })

    it('does not attach on unrelated errors', async () => {
      const block = createBlock({}, { common: prague, skipConsensusFormatValidation: true })
      const error = new Error("the tx doesn't have the correct nonce")
      await attachHeaderDiagnosis(error, block, [], prague)
      assert.isUndefined(getHeaderDiagnosis(error))
    })
  })
})
