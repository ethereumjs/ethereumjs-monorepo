const tape = require('tape')
const utils = require('ethereumjs-util')
const rlp = utils.rlp
const Transaction = require('../index.js')
const txFixtures = require('./ttTransactionTestEip155VitaliksTests.json')
tape('[Transaction]: EIP155 Test', function (t) {
  t.test('Verify EIP155 Signature based on Vitalik\'s tests', function (st) {
    txFixtures.forEach(function (tx) {
      var pt = new Transaction(tx.rlp,1)
      st.equal(pt.hash(false).toString('hex'), tx.hash)
      st.equal('0x' + pt.serialize().toString('hex'), tx.rlp)
      st.equal(pt.getSenderAddress().toString('hex'), tx.sender)
    })
    st.end()
  })
})