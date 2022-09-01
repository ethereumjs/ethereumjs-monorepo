import { Common } from '@ethereumjs/common'
import { toBuffer } from '@ethereumjs/util'
import * as minimist from 'minimist'
import * as tape from 'tape'

import { TransactionFactory } from '../src'

import { getTests } from './testLoader'

import type { ForkName, ForkNamesMap, OfficialTransactionTestData } from './types'

const argv = minimist(process.argv.slice(2))
const file: string | undefined = argv.file

const forkNames: ForkName[] = [
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
  'London+3860': 'london',
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

tape('TransactionTests', async (t) => {
  const fileFilterRegex = file !== undefined ? new RegExp(file + '[^\\w]') : undefined
  await getTests(
    (
      _filename: string,
      subDir: string,
      testName: string,
      testData: OfficialTransactionTestData
    ) => {
      t.test(testName, (st) => {
        for (const forkName of forkNames) {
          if (testData.result[forkName] === undefined) {
            continue
          }
          const forkTestData = testData.result[forkName]
          const shouldBeInvalid = forkTestData.exception !== undefined

          try {
            const rawTx = toBuffer(testData.txbytes)
            const hardfork = forkNameMap[forkName]
            const common = new Common({ chain: 1, hardfork })
            const activateEIPs = EIPs[forkName]
            if (activateEIPs !== undefined) {
              common.setEIPs(activateEIPs)
            }
            const tx = TransactionFactory.fromSerializedData(rawTx, { common })
            const sender = tx.getSenderAddress().toString()
            const hash = tx.hash().toString('hex')
            const txIsValid = tx.validate()
            const senderIsCorrect = forkTestData.sender === sender
            const hashIsCorrect = forkTestData.hash?.slice(2) === hash

            const hashAndSenderAreCorrect = senderIsCorrect && hashIsCorrect
            if (shouldBeInvalid) {
              st.assert(!txIsValid, `Transaction should be invalid on ${forkName}`)
            } else {
              st.assert(
                hashAndSenderAreCorrect && txIsValid,
                `Transaction should be valid on ${forkName}`
              )
            }
          } catch (e: any) {
            if (shouldBeInvalid) {
              st.assert(shouldBeInvalid, `Transaction should be invalid on ${forkName}`)
            } else {
              st.fail(`Transaction should be valid on ${forkName}`)
              st.comment(e)
            }
          }
        }
        st.end()
      })
    },
    fileFilterRegex,
    undefined,
    'TransactionTests'
  )
})
