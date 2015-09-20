var Tx = require('../index.js')
var ethUtil = require('ethereumjs-util')

function addPad (v) {
  if (v.length % 2 === 1) {
    v = '0' + v
  }
  return v
}

function ifZero (v) {
  if (v === '') {
    return '00'
  } else {
    return v
  }
}

module.exports = function txRunner (testData, t, cb) {
  try {
    var tx = new Tx(new Buffer(testData.rlp.slice(2), 'hex'))
  } catch (e) {
    t.equal(tTx, undefined, 'should not have any fields ')
    if (cb) cb()
    return
  }

  var tTx = testData.transaction

  if (tx.validate()) {
    try {
      t.equal(tx.data.toString('hex'), addPad(tTx.data.slice(2)), 'data')
      t.equal(ethUtil.bufferToInt(tx.gasLimit), Number(tTx.gasLimit), 'gasLimit')
      t.equal(ethUtil.bufferToInt(tx.gasPrice), Number(tTx.gasPrice), 'gasPrice')
      t.equal(ethUtil.bufferToInt(tx.nonce), Number(tTx.nonce), 'nonce')
      t.equal(tx.r.toString('hex'), addPad(tTx.r.slice(2)), 'r')
      t.equal(tx.s.toString('hex'), addPad(tTx.s.slice(2)), 's')
      t.equal(ethUtil.bufferToInt(tx.v), Number(tTx.v), 'v')
      if (tTx.to[1] === 'x') {
        tTx.to = tTx.to.slice(2)
      }

      t.equal(tx.to.toString('hex'), tTx.to, 'to')
      t.equal(ifZero(tx.value.toString('hex')), tTx.value.slice(2), 'value')
      t.equal(tx.getSenderAddress().toString('hex'), testData.sender, "sender's address")
    } catch (e) {
      t.fail(e)
    }
  } else {
    t.equal(tTx, undefined, 'should not have any fields ')
  }

  if (cb) {
    cb()
  }
}
