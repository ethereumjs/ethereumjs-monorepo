const Tx = require('../index.js')
const tape = require('tape')
const ethUtil = require('ethereumjs-util')
const argv = require('minimist')(process.argv.slice(2))
const testing = require('ethereumjs-testing')

const forkNames = [
  'Byzantium',
  'Constantinople',
  'EIP150',
  'EIP158',
  'Frontier',
  'Homestead',
]

const forkNameMap = {
  Byzantium: 'byzantium',
  Constantinople: 'constantinople',
  EIP150: 'tangerineWhistle',
  EIP158: 'spuriousDragon',
  Frontier: 'chainstart',
  Homestead: 'homestead',
}

tape('TransactionTests', (t) => {
  const fileFilterRegex = argv.file ? new RegExp(argv.file + '[^\\w]') : undefined

  testing.getTests('TransactionTests', (filename, testName, testData) => {
    let rawTx
    let tx
    t.test(testName, (st) => {
      const rawTx = ethUtil.toBuffer(testData.rlp)

      let tx
      let sender
      let hash
      forkNames.forEach(forkName => {
        const forkTestData = testData[forkName]
        const shouldBeInvalid = Object.keys(forkTestData).length === 0
        try {
          tx = new Tx(rawTx, {
            hardfork: forkNameMap[forkName],
            chain: 1,
          })

          const sender = tx.getSenderAddress().toString('hex')
          const hash = tx.hash().toString('hex')

          const validationErrors = tx.validate(true)
          const transactionIsValid = validationErrors.length === 0
          const hashAndSenderAreCorrect = forkTestData && (sender === forkTestData.sender && hash === forkTestData.hash)

          if (shouldBeInvalid) {
            st.assert(!transactionIsValid, `Transaction should be invalid on ${forkName}`)
          } else {
            st.assert(hashAndSenderAreCorrect && transactionIsValid, `Transaction should be valid on ${forkName}`)
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
  }, fileFilterRegex)
  .then(() => {
    t.end()
  })
})
