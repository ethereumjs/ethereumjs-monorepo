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

tape('TransactionTests', (t) => {
  testing.getTests('TransactionTests', (filename, testName, testData) => {
    let rawTx
    let tx
    t.test(testName, (st) => {
      const rawTx = ethUtil.toBuffer(testData.rlp)
      let tx
      let sender
      let hash
      forkNames.forEach(forkName => {
        try {
          tx = new Tx(rawTx)
          if (forkName !== 'Homestead') {
            tx._homestead = false
          }
          const sender = tx.getSenderAddress().toString('hex')
          const hash = tx.hash().toString('hex')
          st.assert(sender === testData[forkName].sender && hash === testData[forkName].hash, `Sender and hash should be correct on ${forkName}`)
        } catch (e) {
          if (tx !== undefined) {
            st.equal(e.message, 'Invalid Signature', `Transaction signature should be invalid on ${forkName}`)
          } else {
            st.pass(`Transaction should be invalid and should error on creation on ${forkName}`)
          }
        }
      })
      st.end()
    })
  })
  .then(() => {
    t.end()
  })
})
