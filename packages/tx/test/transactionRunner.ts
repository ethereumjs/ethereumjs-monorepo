import tape from 'tape'
import minimist from 'minimist'
import { toBuffer } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { SignedLegacyTransaction } from '../src/'
import { ForkName, ForkNamesMap, OfficialTransactionTestData } from './types'

const testing = require('./testLoader')

const argv = minimist(process.argv.slice(2))
const file: string | undefined = argv.file

const forkNames: ForkName[] = [
  'Istanbul',
  'Byzantium',
  'Constantinople',
  'EIP150',
  'EIP158',
  'Frontier',
  'Homestead',
]

const forkNameMap: ForkNamesMap = {
  Istanbul: 'istanbul',
  Byzantium: 'byzantium',
  Constantinople: 'constantinople',
  EIP150: 'tangerineWhistle',
  EIP158: 'spuriousDragon',
  Frontier: 'chainstart',
  Homestead: 'homestead',
}

tape('TransactionTests', (t) => {
  const fileFilterRegex = file ? new RegExp(file + '[^\\w]') : undefined

  testing
    .getTests(
      'TransactionTests',
      (_filename: string, testName: string, testData: OfficialTransactionTestData) => {
        t.test(testName, (st) => {
          forkNames.forEach((forkName) => {
            const forkTestData = testData[forkName]
            const shouldBeInvalid = Object.keys(forkTestData).length === 0

            try {
              const rawTx = toBuffer(testData.rlp)
              const hardfork = forkNameMap[forkName]
              const common = new Common({ chain: 1, hardfork })
              const tx = SignedLegacyTransaction.fromRlpSerializedTx(rawTx, { common })

              const sender = tx.getSenderAddress().toString()
              const hash = tx.hash().toString('hex')

              const txIsValid = tx.validate()

              const senderIsCorrect = sender === `0x${forkTestData.sender}`
              const hashIsCorrect = hash === forkTestData.hash

              const hashAndSenderAreCorrect = forkTestData && senderIsCorrect && hashIsCorrect

              if (shouldBeInvalid) {
                st.assert(!txIsValid, `Transaction should be invalid on ${forkName}`)
              } else {
                st.assert(
                  hashAndSenderAreCorrect && txIsValid,
                  `Transaction should be valid on ${forkName}`
                )
              }
            } catch (e) {
              if (shouldBeInvalid) {
                st.assert(shouldBeInvalid, `Transaction should be invalid on ${forkName}`)
              } else {
                st.fail(`Transaction should be valid on ${forkName}`)
              }
            }
          })
          st.end()
        })
      },
      fileFilterRegex
    )
    .then(() => {
      t.end()
    })
})
