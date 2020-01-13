import Tx from '../src/transaction'
import * as tape from 'tape'
import { toBuffer } from 'ethereumjs-util'
import * as minimist from 'minimist'
import { ForkName, ForkNamesMap, OfficialTransactionTestData } from './types'

// We use require here because this module doesn't have types and this works better with ts-node.
const testing = require('ethereumjs-testing')

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

tape('TransactionTests', t => {
  const fileFilterRegex = file ? new RegExp(file + '[^\\w]') : undefined

  testing
    .getTests(
      'TransactionTests',
      (_filename: string, testName: string, testData: OfficialTransactionTestData) => {
        t.test(testName, st => {
          forkNames.forEach(forkName => {
            const forkTestData = testData[forkName]
            const shouldBeInvalid = Object.keys(forkTestData).length === 0
            try {
              const rawTx = toBuffer(testData.rlp)
              const tx = new Tx(rawTx, {
                hardfork: forkNameMap[forkName],
                chain: 1,
              })

              const sender = tx.getSenderAddress().toString('hex')
              const hash = tx.hash().toString('hex')

              const validationErrors = tx.validate(true)
              const transactionIsValid = validationErrors.length === 0
              const hashAndSenderAreCorrect =
                forkTestData && sender === forkTestData.sender && hash === forkTestData.hash

              if (shouldBeInvalid) {
                st.assert(!transactionIsValid, `Transaction should be invalid on ${forkName}`)
              } else {
                st.assert(
                  hashAndSenderAreCorrect && transactionIsValid,
                  `Transaction should be valid on ${forkName}`,
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
      fileFilterRegex,
    )
    .then(() => {
      t.end()
    })
})
