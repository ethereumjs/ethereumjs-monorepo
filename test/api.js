const tape = require('tape')
const utils = require('ethereumjs-util')
const rlp = utils.rlp
const Transaction = require('../index.js')
const txFixtures = require('./txs.json')
const txFixturesEip155 = require('./ttTransactionTestEip155VitaliksTests.json')
tape('[Transaction]: Basic functions', function (t) {
  var transactions = []

  t.test('should decode transactions', function (st) {
    txFixtures.slice(0, 3).forEach(function (tx) {
      var pt = new Transaction(tx.raw)
      st.equal('0x' + pt.nonce.toString('hex'), tx.raw[0])
      st.equal('0x' + pt.gasPrice.toString('hex'), tx.raw[1])
      st.equal('0x' + pt.gasLimit.toString('hex'), tx.raw[2])
      st.equal('0x' + pt.to.toString('hex'), tx.raw[3])
      st.equal('0x' + pt.value.toString('hex'), tx.raw[4])
      st.equal('0x' + pt.v.toString('hex'), tx.raw[6])
      st.equal('0x' + pt.r.toString('hex'), tx.raw[7])
      st.equal('0x' + pt.s.toString('hex'), tx.raw[8])
      st.equal('0x' + pt.data.toString('hex'), tx.raw[5])
      transactions.push(pt)
    })
    st.end()
  })

  t.test('should serialize', function (st) {
    transactions.forEach(function (tx) {
      st.deepEqual(tx.serialize(), rlp.encode(tx.raw))
    })
    st.end()
  })

  t.test('should hash', function (st) {
    var tx = new Transaction(txFixtures[2].raw)
    st.deepEqual(tx.hash(), new Buffer('375a8983c9fc56d7cfd118254a80a8d7403d590a6c9e105532b67aca1efb97aa', 'hex'))
    st.deepEqual(tx.hash(false), new Buffer('61e1ec33764304dddb55348e7883d4437426f44ab3ef65e6da1e025734c03ff0', 'hex'))
    st.deepEqual(tx.hash(true), new Buffer('375a8983c9fc56d7cfd118254a80a8d7403d590a6c9e105532b67aca1efb97aa', 'hex'))
    st.end()
  })

  t.test('should hash with defined chainId', function (st) {
    var tx = new Transaction(txFixtures[3].raw)
    st.equal(tx.hash().toString('hex'), '0f09dc98ea85b7872f4409131a790b91e7540953992886fc268b7ba5c96820e4')
    st.equal(tx.hash(true).toString('hex'), '0f09dc98ea85b7872f4409131a790b91e7540953992886fc268b7ba5c96820e4')
    st.equal(tx.hash(false).toString('hex'), 'f97c73fdca079da7652dbc61a46cd5aeef804008e057be3e712c43eac389aaf0')
    st.end()
  })

  t.test('should verify Signatures', function (st) {
    transactions.forEach(function (tx) {
      st.equals(tx.verifySignature(), true)
    })
    st.end()
  })

  t.test('should not verify Signatures', function (st) {
    transactions.forEach(function (tx) {
      tx.s = utils.zeros(32)
      st.equals(tx.verifySignature(), false)
    })
    st.end()
  })

  t.test('should give a string about not verifing Signatures', function (st) {
    transactions.forEach(function (tx) {
      st.equals(tx.validate(true).slice(0, 53), 'Invalid Signature gas limit is to low. Need at least ')
    })
    st.end()
  })

  t.test('should validate', function (st) {
    transactions.forEach(function (tx) {
      st.equals(tx.validate(), false)
    })
    st.end()
  })

  t.test('should sign tx', function (st) {
    transactions.forEach(function (tx, i) {
      if (txFixtures[i].privateKey) {
        var privKey = new Buffer(txFixtures[i].privateKey, 'hex')
        tx.sign(privKey)
      }
    })
    st.end()
  })

  t.test("should get sender's address after signing it", function (st) {
    transactions.forEach(function (tx, i) {
      if (txFixtures[i].privateKey) {
        st.equals(tx.getSenderAddress().toString('hex'), txFixtures[i].sendersAddress)
      }
    })
    st.end()
  })

  t.test("should get sender's public key after signing it", function (st) {
    transactions.forEach(function (tx, i) {
      if (txFixtures[i].privateKey) {
        st.equals(tx.getSenderPublicKey().toString('hex'),
          utils.privateToPublic(new Buffer(txFixtures[i].privateKey, 'hex')).toString('hex'))
      }
    })
    st.end()
  })

  t.test("should get sender's address after signing it (second call should be cached)", function (st) {
    transactions.forEach(function (tx, i) {
      if (txFixtures[i].privateKey) {
        st.equals(tx.getSenderAddress().toString('hex'), txFixtures[i].sendersAddress)
        st.equals(tx.getSenderAddress().toString('hex'), txFixtures[i].sendersAddress)
      }
    })
    st.end()
  })

  t.test('should verify signing it', function (st) {
    transactions.forEach(function (tx, i) {
      if (txFixtures[i].privateKey) {
        st.equals(tx.verifySignature(), true)
      }
    })
    st.end()
  })

  t.test('should validate with string option', function (st) {
    transactions.forEach(function (tx) {
      tx.gasLimit = 30000
      st.equals(tx.validate(true), '')
    })
    st.end()
  })

  t.test('should round trip decode a tx', function (st) {
    var tx = new Transaction()
    tx.value = 5000
    var s1 = tx.serialize().toString('hex')
    var tx2 = new Transaction(s1)
    var s2 = tx2.serialize().toString('hex')
    st.equals(s1, s2)
    st.end()
  })

  t.test('should accept lesser r values', function (st) {
    var tx = new Transaction()
    tx.r = '0x0005'
    st.equals(tx.r.toString('hex'), '05')
    st.end()
  })

  t.test('should return data fee', function (st) {
    var tx = new Transaction()
    st.equals(tx.getDataFee().toNumber(), 0)

    tx = new Transaction(txFixtures[2].raw)
    st.equals(tx.getDataFee().toNumber(), 2496)

    st.end()
  })

  t.test('should return base fee', function (st) {
    var tx = new Transaction()
    st.equals(tx.getBaseFee().toNumber(), 53000)
    st.end()
  })

  t.test('should return upfront cost', function (st) {
    var tx = new Transaction({
      gasPrice: 1000,
      gasLimit: 10000000,
      value: 42
    })
    st.equals(tx.getUpfrontCost().toNumber(), 10000000042)
    st.end()
  })

  t.test('Verify EIP155 Signature based on Vitalik\'s tests', function (st) {
    txFixturesEip155.forEach(function (tx) {
      var pt = new Transaction(tx.rlp)
      st.equal(pt.hash(false).toString('hex'), tx.hash)
      st.equal('0x' + pt.serialize().toString('hex'), tx.rlp)
      st.equal(pt.getSenderAddress().toString('hex'), tx.sender)
    })
    st.end()
  })

  t.test('sign tx with chainId specified in params', function (st) {
    var tx = new Transaction({ chainId: 42 })
    st.equal(tx.getChainId(), 42)
    var privKey = new Buffer(txFixtures[0].privateKey, 'hex')
    tx.sign(privKey)
    var serialized = tx.serialize()
    var reTx = new Transaction(serialized)
    st.equal(reTx.verifySignature(), true)
    st.equal(reTx.getChainId(), 42)
    st.end()
  })
})
