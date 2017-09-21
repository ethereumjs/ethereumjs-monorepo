const async = require('async')
const utils = require('ethereumjs-util')
const BN = utils.BN
const rlp = utils.rlp
const Account = require('ethereumjs-account')
const Transaction = require('ethereumjs-tx')
const Block = require('ethereumjs-block')

exports.dumpState = function (state, cb) {
  var rs = state.createReadStream()
  var statedump = {}

  rs.on('data', function (data) {
    var account = new Account(data.value)
    statedump[data.key.toString('hex')] = {
      balance: new BN(account.balance).toString(),
      nonce: new BN(account.nonce).toString(),
      stateRoot: account.stateRoot.toString('hex')
    }
  })

  rs.on('end', function () {
    console.log(statedump)
    cb()
  })
}

var format = exports.format = function (a, toZero, isHex) {
  if (a === '') {
    return Buffer.alloc(0)
  }

  if (a.slice && a.slice(0, 2) === '0x') {
    a = a.slice(2)
    if (a.length % 2) a = '0' + a
    a = Buffer.from(a, 'hex')
  } else if (!isHex) {
    a = Buffer.from(new BN(a).toArray())
  } else {
    if (a.length % 2) a = '0' + a
    a = Buffer.from(a, 'hex')
  }

  if (toZero && a.toString('hex') === '') {
    a = Buffer.from([0])
  }

  return a
}

/**
 * makeTx using JSON from tests repo
 * @param {[type]} txData the transaction object from tests repo
 * @return {Object}        object that will be passed to VM.runTx function
 */
exports.makeTx = function (txData) {
  var tx = new Transaction()
  tx.nonce = format(txData.nonce)
  tx.gasPrice = format(txData.gasPrice)
  tx.gasLimit = format(txData.gasLimit)
  tx.to = format(txData.to, true, true)
  tx.value = format(txData.value)
  tx.data = format(txData.data, false, true) // slice off 0x
  if (txData.secretKey) {
    var privKey = format(txData.secretKey, false, true)
    tx.sign(privKey)
  } else {
    tx.v = Buffer.from(txData.v.slice(2), 'hex')
    tx.r = Buffer.from(txData.r.slice(2), 'hex')
    tx.s = Buffer.from(txData.s.slice(2), 'hex')
  }
  return tx
}

exports.verifyPostConditions = function (state, testData, t, cb) {
  var hashedAccounts = {}
  var keyMap = {}

  for (var key in testData) {
    var hash = utils.sha3(Buffer.from(utils.stripHexPrefix(key), 'hex')).toString('hex')
    hashedAccounts[hash] = testData[key]
    keyMap[hash] = key
  }

  var q = async.queue(function (task, cb2) {
    exports.verifyAccountPostConditions(state, task.address, task.account, task.testData, t, cb2)
  }, 1)

  var stream = state.createReadStream()

  stream.on('data', function (data) {
    var acnt = new Account(rlp.decode(data.value))
    var key = data.key.toString('hex')
    var testData = hashedAccounts[key]
    var address = keyMap[key]
    delete keyMap[key]

    if (testData) {
      q.push({
        address: address,
        account: acnt,
        testData: testData
      })
    } else {
      t.fail('invalid account in the trie: ' + key)
    }
  })

  stream.on('end', function () {
    function onEnd () {
      for (hash in keyMap) {
        t.fail('Missing account!: ' + keyMap[hash])
      }
      cb()
    }

    if (q.length()) {
      q.drain = onEnd
    } else {
      onEnd()
    }
  })
}

/**
 * verifyAccountPostConditions using JSON from tests repo
 * @param {[type]}   state    DB/trie
 * @param {[type]}   string   Account Address
 * @param {[type]}   account  to verify
 * @param {[type]}   acctData postconditions JSON from tests repo
 * @param {Function} cb       completion callback
 */
exports.verifyAccountPostConditions = function (state, address, account, acctData, t, cb) {
  t.comment('Account: ' + address)
  t.equal(format(account.balance, true).toString('hex'), format(acctData.balance, true).toString('hex'), 'correct balance')
  t.equal(format(account.nonce, true).toString('hex'), format(acctData.nonce, true).toString('hex'), 'correct nonce')

  // validate storage
  var origRoot = state.root
  var storageKeys = Object.keys(acctData.storage)

  var hashedStorage = {}
  for (var key in acctData.storage) {
    hashedStorage[utils.sha3(utils.setLength(Buffer.from(key.slice(2), 'hex'), 32)).toString('hex')] = acctData.storage[key]
  }

  if (storageKeys.length > 0) {
    state.root = account.stateRoot
    var rs = state.createReadStream()
    rs.on('data', function (data) {
      var key = data.key.toString('hex')
      var val = '0x' + rlp.decode(data.value).toString('hex')

      if (key === '0x') {
        key = '0x00'
        acctData.storage['0x00'] = acctData.storage['0x00'] ? acctData.storage['0x00'] : acctData.storage['0x']
        delete acctData.storage['0x']
      }

      t.equal(val, hashedStorage[key], 'correct storage value')
      delete hashedStorage[key]
    })

    rs.on('end', function () {
      for (var key in hashedStorage) {
        if (hashedStorage[key] !== '0x00') {
          t.fail('key: ' + key + ' not found in storage')
        }
      }

      state.root = origRoot
      cb()
    })
  } else {
    cb()
  }
}

/**
 * verifyGas by computing the difference of coinbase account balance
 * @param {Object} results  to verify
 * @param {Object} testData from tests repo
 */
exports.verifyGas = function (results, testData, t) {
  var coinbaseAddr = testData.env.currentCoinbase
  var preBal = testData.pre[coinbaseAddr] ? testData.pre[coinbaseAddr].balance : 0

  if (!testData.post[coinbaseAddr]) {
    return
  }

  var postBal = new BN(testData.post[coinbaseAddr].balance)
  var balance = postBal.sub(preBal).toString()
  if (balance !== '0') {
    var amountSpent = results.gasUsed.mul(testData.transaction.gasPrice)
    t.equal(amountSpent.toString(), balance, 'correct gas')
  } else {
    t.equal(results, undefined)
  }
}

/**
 * verifyLogs
 * @param {Object} results  to verify
 * @param {Object} testData from tests repo
 */
exports.verifyLogs = function (logs, testData, t) {
  if (testData.logs) {
    testData.logs.forEach(function (log, i) {
      var rlog = logs[i]
      t.equal(rlog[0].toString('hex'), log.address, 'log: valid address')
      t.equal('0x' + rlog[2].toString('hex'), log.data, 'log: valid data')
      log.topics.forEach(function (topic, i) {
        t.equal(rlog[1][i].toString('hex'), topic, 'log: invalid topic')
      })
    })
  }
}

/**
 * toDecimal - converts buffer to decimal string, no leading zeroes
 * @param  {Buffer}
 * @return {String}
 */
exports.toDecimal = function (buffer) {
  return new BN(buffer).toString()
}

/**
 * fromDecimal - converts decimal string to buffer
 * @param {String}
 *  @return {Buffer}
 */
exports.fromDecimal = function (string) {
  return Buffer.from(new BN(string).toArray())
}

/**
 * fromAddress - converts hexString address to 256-bit buffer
 * @param  {String} hexString address for example '0x03'
 * @return {Buffer}
 */
exports.fromAddress = function (hexString) {
  return utils.setLength(Buffer.from(new BN(hexString.slice(2), 16).toArray()), 32)
}

/**
 * toCodeHash - applies sha3 to hexCode
 * @param {String} hexCode string from tests repo
 * @return {Buffer}
 */
exports.toCodeHash = function (hexCode) {
  return utils.sha3(Buffer.from(hexCode.slice(2), 'hex'))
}

exports.makeBlockHeader = function (data) {
  var header = {}
  header.timestamp = format(data.currentTimestamp)
  header.gasLimit = format(data.currentGasLimit)
  if (data.previousHash) {
    header.parentHash = format(data.previousHash, false, true)
  }
  header.coinbase = utils.setLength(format(data.currentCoinbase, false, true), 20)
  header.difficulty = format(data.currentDifficulty)
  header.number = format(data.currentNumber)
  return header
}

/**
 * makeBlockFromEnv - helper to create a block from the env object in tests repo
 * @param {Object} env object from tests repo
 * @param {Object} transactions transactions for the block
 * @return {Object}  the block
 */
exports.makeBlockFromEnv = function (env, transactions) {
  return new Block({
    header: exports.makeBlockHeader(env),
    transactions: transactions || {},
    uncleHeaders: []
  })
}

/**
 * makeRunCodeData - helper to create the object for VM.runCode using
 *   the exec object specified in the tests repo
 * @param {Object} exec    object from the tests repo
 * @param {Object} account that the executing code belongs to
 * @param {Object} block   that the transaction belongs to
 * @return {Object}        object that will be passed to VM.runCode function
 */
exports.makeRunCodeData = function (exec, account, block) {
  return {
    account: account,
    origin: format(exec.origin, false, true),
    code: format(exec.code), // slice off 0x
    value: format(exec.value),
    address: format(exec.address, false, true),
    caller: format(exec.caller, false, true),
    data: format(exec.data), // slice off 0x
    gasLimit: format(exec.gas),
    gasPrice: format(exec.gasPrice),
    block: block
  }
}

/**
 * setupPreConditions given JSON testData
 * @param {[type]}   state    - the state DB/trie
 * @param {[type]}   testData - JSON from tests repo
 * @param {Function} done     - callback when function is completed
 */
exports.setupPreConditions = function (state, testData, done) {
  var keysOfPre = Object.keys(testData.pre)

  async.eachSeries(keysOfPre, function (key, callback) {
    var acctData = testData.pre[key]
    var account = new Account()

    account.nonce = format(acctData.nonce)
    account.balance = format(acctData.balance)

    var codeBuf = Buffer.from(acctData.code.slice(2), 'hex')
    var storageTrie = state.copy()
    storageTrie.root = null

    async.series([

      function (cb2) {
        var keys = Object.keys(acctData.storage)

        async.forEachSeries(keys, function (key, cb3) {
          var val = acctData.storage[key]
          val = rlp.encode(Buffer.from(val.slice(2), 'hex'))
          key = utils.setLength(Buffer.from(key.slice(2), 'hex'), 32)

          storageTrie.put(key, val, cb3)
        }, cb2)
      },
      function (cb2) {
        account.setCode(state, codeBuf, cb2)
      },
      function (cb2) {
        account.stateRoot = storageTrie.root

        if (testData.exec && key === testData.exec.address) {
          testData.root = storageTrie.root
        }
        state.put(Buffer.from(utils.stripHexPrefix(key), 'hex'), account.serialize(), function () {
          cb2()
        })
      }
    ], callback)
  }, done)
}
