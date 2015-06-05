const tape = require('tape');
const rlp = require('rlp');
const utils = require('ethereumjs-util');
const Transaction = require('../index.js');
const txFixtures = require('./txs.json');

tape('[Transaction]: Basic functions', function(t) {
  var transactions = [];
  t.test('should decode transactions', function(st) {
    txFixtures.forEach(function(tx) {
      var pt = new Transaction(tx.raw);
      st.equal(pt.nonce.toString('hex'), tx.raw[0]);
      st.equal(pt.gasPrice.toString('hex'), tx.raw[1]);
      st.equal(pt.gasLimit.toString('hex'), tx.raw[2]);
      st.equal(pt.to.toString('hex'), tx.raw[3]);
      st.equal(pt.value.toString('hex'), tx.raw[4]);
      st.equal(pt.v.toString('hex'), tx.raw[6]);
      st.equal(pt.r.toString('hex'), tx.raw[7]);
      st.equal(pt.s.toString('hex'), tx.raw[8]);
      st.equal(pt.data.toString('hex'), tx.raw[5]);
      transactions.push(pt);
    });
    st.end();
  });

  t.test('should serialize', function(st) {
    transactions.forEach(function(tx) {
      st.deepEqual(tx.serialize(), rlp.encode(tx.raw));
    });
    st.end();
  });

  t.test('should verify Signatures', function(st) {
    transactions.forEach(function(tx) {
      st.equals(tx.verifySignature(), true);
    });
    st.end();
  });

  t.test('should  not verify Signatures', function(st) {
    transactions.forEach(function(tx) {
      tx.s = utils.zeros(32);
      st.equals(tx.verifySignature(), false);
    });
    st.end();
  });

  t.test('should sign tx', function(st) {
    transactions.forEach(function(tx, i) {
      if (txFixtures[i].privateKey) {
        var privKey = new Buffer(txFixtures[i].privateKey, 'hex');
        tx.sign(privKey);
      }
    });
    st.end();
  });

  t.test('should get sender\'s address after signing it', function(st) {
    transactions.forEach(function(tx, i) {
      if (txFixtures[i].privateKey) {
        st.equals(tx.getSenderAddress().toString('hex'), txFixtures[i].sendersAddress);
      }
    });
    st.end();
  });

  t.test('should verify signing it', function(st) {
    transactions.forEach(function(tx, i) {
      if (txFixtures[i].privateKey) {
        st.equals(tx.verifySignature(), true);
      }
    });
    st.end();
  });
});
