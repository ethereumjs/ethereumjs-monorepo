const tape = require('tape')
const async = require('async')
const VM = require('../')
const Account = require('ethereumjs-account')
const testUtil = require('./util')
const Trie = require('merkle-patricia-tree/secure')
const ethUtil = require('ethereumjs-util')
const BN = ethUtil.BN

var testCases = [
  { code: '0x60006000556000600055', usedGas: 412, refund: 0, original: '0x' },
  { code: '0x60006000556001600055', usedGas: 20212, refund: 0, original: '0x' },
  { code: '0x60016000556000600055', usedGas: 20212, refund: 19800, original: '0x' },
  { code: '0x60016000556002600055', usedGas: 20212, refund: 0, original: '0x' },
  { code: '0x60016000556001600055', usedGas: 20212, refund: 0, original: '0x' },
  { code: '0x60006000556000600055', usedGas: 5212, refund: 15000, original: '0x01' },
  { code: '0x60006000556001600055', usedGas: 5212, refund: 4800, original: '0x01' },
  { code: '0x60006000556002600055', usedGas: 5212, refund: 0, original: '0x01' },
  { code: '0x60026000556000600055', usedGas: 5212, refund: 15000, original: '0x01' },
  { code: '0x60026000556003600055', usedGas: 5212, refund: 0, original: '0x01' },
  { code: '0x60026000556001600055', usedGas: 5212, refund: 4800, original: '0x01' },
  { code: '0x60026000556002600055', usedGas: 5212, refund: 0, original: '0x01' },
  { code: '0x60016000556000600055', usedGas: 5212, refund: 15000, original: '0x01' },
  { code: '0x60016000556002600055', usedGas: 5212, refund: 0, original: '0x01' },
  { code: '0x60016000556001600055', usedGas: 412, refund: 0, original: '0x01' },
  { code: '0x600160005560006000556001600055', usedGas: 40218, refund: 19800, original: '0x' },
  { code: '0x600060005560016000556000600055', usedGas: 10218, refund: 19800, original: '0x01' }
]

var testData = {
  'env': {
    'currentCoinbase': '0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba',
    'currentDifficulty': '0x0100',
    'currentGasLimit': '0x0f4240',
    'currentNumber': '0x00',
    'currentTimestamp': '0x01'
  },
  'exec': {
    'address': '0x01',
    'caller': '0xcd1722f3947def4cf144679da39c4c32bdc35681',
    'code': '0x60006000556000600055',
    'data': '0x',
    'gas': '0',
    'gasPrice': '0x5af3107a4000',
    'origin': '0xcd1722f3947def4cf144679da39c4c32bdc35681',
    'value': '0x0de0b6b3a7640000'
  },
  'gas': '0',
  'pre': {
    '0x01': {
      'balance': '0x152d02c7e14af6800000',
      'code': '0x',
      'nonce': '0x00',
      'storage': {
        '0x': '0'
      }
    }
  }
}

tape('test constantinople SSTORE (eip-1283)', function (t) {
  testCases.forEach(function (params, i) {
    t.test('should correctly run eip-1283 test #' + i, function (st) {
      let state = new Trie()
      let results
      let account

      testData.exec.code = params.code
      testData.exec.gas = params.usedGas
      testData.pre['0x01'].storage['0x'] = params.original

      async.series([
        function (done) {
          let acctData = testData.pre[testData.exec.address]
          account = new Account()
          account.nonce = testUtil.format(acctData.nonce)
          account.balance = testUtil.format(acctData.balance)
          testUtil.setupPreConditions(state, testData, done)
        },
        function (done) {
          state.get(Buffer.from(testData.exec.address, 'hex'), function (err, data) {
            let a = new Account(data)
            account.stateRoot = a.stateRoot
            done(err)
          })
        },
        function (done) {
          let block = testUtil.makeBlockFromEnv(testData.env)
          let vm = new VM({state: state, hardfork: 'constantinople'})
          let runCodeData = testUtil.makeRunCodeData(testData.exec, account, block)
          vm.runCode(runCodeData, function (err, r) {
            if (r) {
              results = r
            }
            done(err)
          })
        },
        function (done) {
          if (testData.gas) {
            let actualGas = results.gas.toString()
            let expectedGas = new BN(testUtil.format(testData.gas)).toString()
            t.equal(actualGas, expectedGas, 'valid gas usage')
            t.equals(results.gasRefund.toNumber(), params.refund, 'valid gas refund')
          }
          done()
        }
      ], function (err) {
        t.assert(!err)
        st.end()
      })
    })
  })
})
