const tape = require('tape')
const utils = require('ethereumjs-util')
const FakeTransaction = require('../fake.js')

// Use private key 0x0000000000000000000000000000000000000000000000000000000000000001 as 'from' Account
var txData = {
  data: '0x7cf5dab00000000000000000000000000000000000000000000000000000000000000005',
  gasLimit: '0x15f90',
  gasPrice: '0x1',
  nonce: '0x01',
  to: '0xd9024df085d09398ec76fbed18cac0e1149f50dc',
  value: '0x0',
  from: '0x7e5f4552091a69125d5dfcb7b8c2659029395bdf',
  v: '0x1c',
  r: '0x25641558260ac737ea6d800906c6d085a801e5e0f0952bf93978d6fa468fbdfe',
  s: '0x5d0904b8f9cfc092805df0cde2574d25e2c5fc28907a9a4741b3e857b68b0778'
}

tape('[FakeTransaction]: Basic functions', function (t) {
  t.test('instantiate with from / create a hash', function (st) {
    st.plan(3)
    var tx = new FakeTransaction(txData)
    var hash = tx.hash()
    var cmpHash = Buffer.from('f74b039f6361c4351a99a7c6a10867369fe6701731d85dc07c15671ac1c1b648', 'hex')
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
    var cmpHash = Buffer.from('80a2ca70509414908881f718502e6bbb3bc67f416abdf972ea7c0888579be7b9', 'hex')
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

  t.test('should retrieve "from" from signature if transaction is signed', function (st) {
    var txDataNoFrom = Object.assign({}, txData)
    delete txDataNoFrom['from']
    st.plan(1)

    var tx = new FakeTransaction(txDataNoFrom)
    st.equal(utils.bufferToHex(tx.from), txData.from)
  })
})
