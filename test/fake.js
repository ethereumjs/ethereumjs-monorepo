const tape = require('tape')
const utils = require('ethereumjs-util')
const FakeTransaction = require('../fake.js')
tape('[FakeTransaction]: Basic functions', function (t) {
  t.test('should not produce hash collsions for different senders', function (st) {
    st.plan(1)
    var baseTxData = {
      data: '0x7cf5dab00000000000000000000000000000000000000000000000000000000000000005',
      gasLimit: '0x15f90',
      gasPrice: '0x1',
      nonce: '0x01',
      to: '0xd9024df085d09398ec76fbed18cac0e1149f50dc',
      value: '0x0',
      from: '0x1111111111111111111111111111111111111111'
    }
    var modifiedFromFieldTxData = Object.assign({}, baseTxData, { from: '0x2222222222222222222222222222222222222222' })
    var baseTx = new FakeTransaction(baseTxData)
    var modifiedFromFieldTx = new FakeTransaction(modifiedFromFieldTxData)
    var baseTxHash = utils.bufferToHex(baseTx.hash(true))
    var modifiedFromFieldTxHash = utils.bufferToHex(modifiedFromFieldTx.hash(true))
    st.notEqual(baseTxHash, modifiedFromFieldTxHash, 'FakeTransactions with different `from` addresses but otherwise identical data should have different hashes')
  })
})
