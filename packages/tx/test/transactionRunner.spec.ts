import { Common, Mainnet } from '@ethereumjs/common'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'
import minimist from 'minimist'
import { assert, describe, it } from 'vitest'

import { createTxFromRLP } from '../src/transactionFactory.ts'

import { getTests } from './testLoader.ts'

import type { PrefixedHexString } from '@ethereumjs/util'
import type { ForkName, ForkNamesMap, OfficialTransactionTestData } from './types.ts'

const argv = minimist(process.argv.slice(2))
const file: string | undefined = argv.file

const forkNames: ForkName[] = [
  'Prague',
  'Cancun',
  'Shanghai',
  'Paris',
  'London+3860',
  'London',
  'Berlin',
  'Istanbul',
  'Byzantium',
  'ConstantinopleFix',
  'Constantinople',
  'EIP150',
  'EIP158',
  'Frontier',
  'Homestead',
]

const forkNameMap: ForkNamesMap = {
  Prague: 'prague',
  'London+3860': 'london',
  Cancun: 'cancun',
  Shanghai: 'shanghai',
  Paris: 'paris',
  London: 'london',
  Berlin: 'berlin',
  Istanbul: 'istanbul',
  Byzantium: 'byzantium',
  ConstantinopleFix: 'petersburg',
  Constantinople: 'constantinople',
  EIP150: 'tangerineWhistle',
  EIP158: 'spuriousDragon',
  Frontier: 'chainstart',
  Homestead: 'homestead',
}

const EIPs: Record<string, number[] | undefined> = {
  'London+3860': [3860],
}

describe('TransactionTests', async () => {
  const fileFilterRegex = file !== undefined ? new RegExp(file + '[^\\w]') : undefined
  await getTests(
    (
      _filename: string,
      subDir: string,
      testName: string,
      testData: OfficialTransactionTestData,
    ) => {
      it(testName, () => {
        for (const forkName of forkNames) {
          if (testData.result[forkName] === undefined) {
            continue
          }
          const forkTestData = testData.result[forkName]
          const shouldBeInvalid = forkTestData.exception !== undefined

          const rawTx = hexToBytes(testData.txbytes as PrefixedHexString)
          const hardfork = forkNameMap[forkName]
          const common = new Common({ chain: Mainnet, hardfork })
          const activateEIPs = EIPs[forkName]
          if (activateEIPs !== undefined) {
            common.setEIPs(activateEIPs)
          }

          let maybeTx
          try {
            maybeTx = createTxFromRLP(rawTx, { common })
          } catch {
            if (!shouldBeInvalid) {
              assert.fail('Tx creation threw an error, but should be valid')
            }
            // Tx is correctly marked as "invalid", so test has passed
            return
          }

          const tx = maybeTx!
          const sender = tx.getSenderAddress().toString()
          const hash = bytesToHex(tx.hash())
          const txIsValid = tx.isValid()
          const senderIsCorrect = forkTestData.sender === sender
          const hashIsCorrect = forkTestData.hash === hash

          if (shouldBeInvalid) {
            assert.isFalse(txIsValid)
          } else {
            assert.isTrue(txIsValid, 'tx is valid')
            assert.isTrue(senderIsCorrect, 'sender is correct')
            assert.isTrue(hashIsCorrect, 'hash is correct')
          }
        }
      }, 120000)
    },
    fileFilterRegex,
    undefined,
    'TransactionTests',
  )
})
