const tape = require('tape')
const utils = require('ethereumjs-util')
const FakeTransaction = require('../fake.js')

var txData = {
  data: '0x7cf5dab00000000000000000000000000000000000000000000000000000000000000005',
  gasLimit: '0x15f90',
  gasPrice: '0x1',
  nonce: '0x01',
  to: '0xd9024df085d09398ec76fbed18cac0e1149f50dc',
  value: '0x0',
  from: '0x1111111111111111111111111111111111111111'
}

tape('[FakeTransaction]: Basic functions', function (t) {
  t.test('instantiate with from / create a hash', function (st) {
    st.plan(3)
    var tx = new FakeTransaction(txData)
    var hash = tx.hash()
    var cmpHash = Buffer.from('f0327c058946be12609d2afc0c45e8e1fffe57acbbff0e9c252e8fab61c3b2b9', 'hex')
    st.deepEqual(hash, cmpHash, 'should create hash with includeSignature=true (default)')
    var hash2 = tx.hash(false)
    var cmpHash2 = Buffer.from('0401bf740d698674be321d0064f92cd6ebba5d73d1e5e5189c0bebbda33a85fe', 'hex')
    st.deepEqual(hash2, cmpHash2, 'should create hash with includeSignature=false')
    st.notDeepEqual(hash, hash2, 'previous hashes should be different')
  })

  t.test('instantiate without from / create a hash', function (st) {
    var txDataNoFrom = Object.assign({}, txData)
    delete txDataNoFrom['from']
    st.plan(3)
    var tx = new FakeTransaction(txDataNoFrom)
    var hash = tx.hash()
    var cmpHash = Buffer.from('7521eb94880840a93e2105f064cec3fe605f0159778a420b9b529c2f3d3b4e37', 'hex')
    st.deepEqual(hash, cmpHash, 'should create hash with includeSignature=true (default)')
    var hash2 = tx.hash(false)
    var cmpHash2 = Buffer.from('0401bf740d698674be321d0064f92cd6ebba5d73d1e5e5189c0bebbda33a85fe', 'hex')
    st.deepEqual(hash2, cmpHash2, 'should create hash with includeSignature=false')
    st.notDeepEqual(hash, hash2, 'previous hashes should be different')
  })

  t.test('should not produce hash collsions for different senders', function (st) {
    st.plan(1)
    var txDataModFrom = Object.assign({}, txData, { from: '0x2222222222222222222222222222222222222222' })
    var tx = new FakeTransaction(txData)
    var txModFrom = new FakeTransaction(txDataModFrom)
    var hash = utils.bufferToHex(tx.hash())
    var hashModFrom = utils.bufferToHex(txModFrom.hash())
    st.notEqual(hash, hashModFrom, 'FakeTransactions with different `from` addresses but otherwise identical data should have different hashes')
  })
})
