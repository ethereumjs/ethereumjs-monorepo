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

          try {
            const rawTx = hexToBytes(testData.txbytes as PrefixedHexString)
            const hardfork = forkNameMap[forkName]
            const common = new Common({ chain: Mainnet, hardfork })
            const activateEIPs = EIPs[forkName]
            if (activateEIPs !== undefined) {
              common.setEIPs(activateEIPs)
            }
            const tx = createTxFromRLP(rawTx, { common })
            const sender = tx.getSenderAddress().toString()
            const hash = bytesToHex(tx.hash())
            const txIsValid = tx.isValid()
            const senderIsCorrect = forkTestData.sender === sender
            const hashIsCorrect = forkTestData.hash === hash

            const hashAndSenderAreCorrect = senderIsCorrect && hashIsCorrect
            if (shouldBeInvalid) {
              assert.isFalse(txIsValid, `Transaction should be invalid on ${forkName}`)
            } else {
              assert.isTrue(
                hashAndSenderAreCorrect && txIsValid,
                `Transaction should be valid on ${forkName}`,
              )
            }
          } catch {
            if (shouldBeInvalid) {
              assert.isTrue(shouldBeInvalid, `Transaction should be invalid on ${forkName}`)
            } else {
              assert.fail(`Transaction should be valid on ${forkName}`)
            }
          }
        }
      }, 120000)
    },
    fileFilterRegex,
    undefined,
    'TransactionTests',
  )
})
