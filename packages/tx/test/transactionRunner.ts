import * as tape from 'tape'
import * as minimist from 'minimist'
import { toBuffer } from '@ethereumjs/util'
import Common from '@ethereumjs/common'
import { TransactionFactory } from '../src'
import { ForkName, ForkNamesMap, OfficialTransactionTestData } from './types'
import { getTests } from './testLoader'

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

const EIPs: any = {
  'London+3860': [3860],
}

tape('TransactionTests', async (t) => {
  const fileFilterRegex = file ? new RegExp(file + '[^\\w]') : undefined
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
          const shouldBeInvalid = !!forkTestData.exception

          try {
            const rawTx = toBuffer(testData.txbytes)
            const hardfork = forkNameMap[forkName]
            const common = new Common({ chain: 1, hardfork })
            const activateEIPs = EIPs[forkName]
            if (activateEIPs) {
              common.setEIPs(activateEIPs)
            }
            const tx = TransactionFactory.fromSerializedData(rawTx, { common })
            const sender = tx.getSenderAddress().toString()
            const hash = tx.hash().toString('hex')
            const txIsValid = tx.validate()
            const senderIsCorrect = forkTestData.sender === sender
            const hashIsCorrect = forkTestData.hash?.slice(2) === hash

            const hashAndSenderAreCorrect = forkTestData && senderIsCorrect && hashIsCorrect
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
