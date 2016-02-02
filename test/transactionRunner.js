const Tx = require('../index.js')
const tape = require('tape')
const ethUtil = require('ethereumjs-util')
const argv = require('minimist')(process.argv.slice(2))
const testing = require('ethereumjs-testing')
const common = require('ethereum-common')

var txTests = testing.getTests('transaction', argv)

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

testing.runTests(function (testData, sst, cb) {
  var tTx = testData.transaction

  try {
    var tx = new Tx(new Buffer(testData.rlp.slice(2), 'hex'))
    if (testData.blocknumber !== String(common.homeSteadForkNumber.v)) {
      tx._homestead = false
    }
  } catch (e) {
    sst.equal(undefined, tTx, 'should not have any fields ')
    cb()
    return
  }

  if (tx.validate()) {
    try {
      sst.equal(tx.data.toString('hex'), addPad(tTx.data.slice(2)), 'data')
      sst.equal(ethUtil.bufferToInt(tx.gasLimit), Number(tTx.gasLimit), 'gasLimit')
      sst.equal(ethUtil.bufferToInt(tx.gasPrice), Number(tTx.gasPrice), 'gasPrice')
      sst.equal(ethUtil.bufferToInt(tx.nonce), Number(tTx.nonce), 'nonce')
      sst.equal(ethUtil.setLength(tx.r, 32).toString('hex'), ethUtil.setLength(tTx.r, 32).toString('hex'), 'r')
      sst.equal(tx.s.toString('hex'), addPad(tTx.s.slice(2)), 's')
      sst.equal(ethUtil.bufferToInt(tx.v), Number(tTx.v), 'v')
      if (tTx.to[1] === 'x') {
        tTx.to = tTx.to.slice(2)
      }

      sst.equal(tx.to.toString('hex'), tTx.to, 'to')
      sst.equal(ifZero(tx.value.toString('hex')), tTx.value.slice(2), 'value')
      sst.equal(tx.getSenderAddress().toString('hex'), testData.sender, "sender's address")
    } catch (e) {
      sst.fail(e)
    }
  } else {
    sst.equal(undefined, tTx, 'should have fields ')
  }
  cb()
}, txTests, tape)
