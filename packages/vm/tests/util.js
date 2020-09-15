const { BN, rlp, keccak256, stripHexPrefix, setLengthLeft, toBuffer } = require('ethereumjs-util')
const Account = require('@ethereumjs/account').default
const Transaction = require('@ethereumjs/tx').Transaction
const Block = require('@ethereumjs/block').Block
const Common = require('@ethereumjs/common').default

exports.dumpState = function (state, cb) {
  function readAccounts(state) {
    return new Promise((resolve, reject) => {
      let accounts = []
      const rs = state.createReadStream()
      rs.on('data', function (data) {
        let account = new Account(data.value)
        account.address = data.key
        accounts.push(account)
      })

      rs.on('end', function () {
        resolve(accounts)
      })
    })
  }

  function readStorage(state, account) {
    return new Promise((resolve) => {
      let storage = {}
      let storageTrie = state.copy(false)
      storageTrie.root = account.stateRoot
      let storageRS = storageTrie.createReadStream()

      storageRS.on('data', function (data) {
        storage[data.key.toString('hex')] = data.value.toString('hex')
      })

      storageRS.on('end', function () {
        resolve(storage)
      })
    })
  }

  readAccounts(state).then(async function (accounts) {
    let results = []
    for (let key = 0; key < accounts.length; key++) {
      let result = await readStorage(state, accounts[key])
      results.push(result)
    }
    for (let i = 0; i < results.length; i++) {
      console.log("SHA3'd address: " + results[i].address.toString('hex'))
      console.log('\tstate root: ' + results[i].stateRoot.toString('hex'))
      console.log('\tstorage: ')
      for (let storageKey in results[i].storage) {
        console.log('\t\t' + storageKey + ': ' + results[i].storage[storageKey])
      }
      console.log('\tnonce: ' + new BN(results[i].nonce).toString())
      console.log('\tbalance: ' + new BN(results[i].balance).toString())
    }
    cb()
  })
}

const format = (exports.format = function (a, toZero, isHex) {
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
})

/**
 * makeTx using JSON from tests repo
 * @param {Object} txData the tx object from tests repo
 * @param {Common} common a @ethereumjs/common object
 * @returns {Transaction} transaction to be passed to VM.runTx function
 */
exports.makeTx = function (txData, common) {
  const tx = Transaction.fromTxData(txData, common)

  if (txData.secretKey) {
    const privKey = toBuffer(txData.secretKey)
    return tx.sign(privKey)
  }

  return tx
}

exports.verifyPostConditions = async function (state, testData, t) {
  return new Promise((resolve) => {
    const hashedAccounts = {}
    const keyMap = {}

    for (const key in testData) {
      const hash = keccak256(Buffer.from(stripHexPrefix(key), 'hex')).toString('hex')
      hashedAccounts[hash] = testData[key]
      keyMap[hash] = key
    }

    const queue = []

    const stream = state.createReadStream()

    stream.on('data', function (data) {
      const account = new Account(rlp.decode(data.value))
      const key = data.key.toString('hex')
      const testData = hashedAccounts[key]
      const address = keyMap[key]
      delete keyMap[key]

      if (testData) {
        const promise = exports.verifyAccountPostConditions(state, address, account, testData, t)
        queue.push(promise)
      } else {
        t.fail('invalid account in the trie: ' + key)
      }
    })

    stream.on('end', async function () {
      await Promise.all(queue)

      for (hash in keyMap) {
        t.fail('Missing account!: ' + keyMap[hash])
      }

      resolve()
    })
  })
}

/**
 * verifyAccountPostConditions using JSON from tests repo
 * @param {[type]}   state    DB/trie
 * @param {[type]}   string   Account Address
 * @param {[type]}   account  to verify
 * @param {[type]}   acctData postconditions JSON from tests repo
 */
exports.verifyAccountPostConditions = function (state, address, account, acctData, t) {
  return new Promise((resolve) => {
    t.comment('Account: ' + address)
    t.ok(format(account.balance, true).equals(format(acctData.balance, true)), 'correct balance')
    t.ok(format(account.nonce, true).equals(format(acctData.nonce, true)), 'correct nonce')

    // validate storage
    const origRoot = state.root
    const storageKeys = Object.keys(acctData.storage)

    const hashedStorage = {}
    for (const key in acctData.storage) {
      hashedStorage[
        keccak256(setLengthLeft(Buffer.from(key.slice(2), 'hex'), 32)).toString('hex')
      ] = acctData.storage[key]
    }

    if (storageKeys.length > 0) {
      state.root = account.stateRoot
      const rs = state.createReadStream()
      rs.on('data', function (data) {
        const key = data.key.toString('hex')
        const val = '0x' + rlp.decode(data.value).toString('hex')

        if (key === '0x') {
          key = '0x00'
          acctData.storage['0x00'] = acctData.storage['0x00']
            ? acctData.storage['0x00']
            : acctData.storage['0x']
          delete acctData.storage['0x']
        }

        t.equal(val, hashedStorage[key], 'correct storage value')
        delete hashedStorage[key]
      })

      rs.on('end', function () {
        for (const key in hashedStorage) {
          if (hashedStorage[key] !== '0x00') {
            t.fail('key: ' + key + ' not found in storage')
          }
        }

        state.root = origRoot
        resolve()
      })
    } else {
      resolve()
    }
  })
}

/**
 * verifyGas by computing the difference of coinbase account balance
 * @param {Object} results  to verify
 * @param {Object} testData from tests repo
 */
exports.verifyGas = function (results, testData, t) {
  const coinbaseAddr = testData.env.currentCoinbase
  const preBal = testData.pre[coinbaseAddr] ? testData.pre[coinbaseAddr].balance : 0

  if (!testData.post[coinbaseAddr]) {
    return
  }

  const postBal = new BN(testData.post[coinbaseAddr].balance)
  const balance = postBal.sub(preBal).toString()
  if (balance !== '0') {
    const amountSpent = results.gasUsed.mul(testData.transaction.gasPrice)
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
      const rlog = logs[i]
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
 * @returns {String}
 */
exports.toDecimal = function (buffer) {
  return new BN(buffer).toString()
}

/**
 * fromDecimal - converts decimal string to buffer
 * @param {String}
 *  @returns {Buffer}
 */
exports.fromDecimal = function (string) {
  return Buffer.from(new BN(string).toArray())
}

/**
 * fromAddress - converts hexString address to 256-bit buffer
 * @param  {String} hexString address for example '0x03'
 * @returns {Buffer}
 */
exports.fromAddress = function (hexString) {
  return setLengthLeft(Buffer.from(new BN(hexString.slice(2), 16).toArray()), 32)
}

/**
 * toCodeHash - applies keccak256 to hexCode
 * @param {String} hexCode string from tests repo
 * @returns {Buffer}
 */
exports.toCodeHash = function (hexCode) {
  return keccak256(Buffer.from(hexCode.slice(2), 'hex'))
}

exports.makeBlockHeader = function (data) {
  const header = {}
  header.timestamp = format(data.currentTimestamp)
  header.gasLimit = format(data.currentGasLimit)
  if (data.previousHash) {
    header.parentHash = format(data.previousHash, false, true)
  }
  header.coinbase = setLengthLeft(format(data.currentCoinbase, false, true), 20)
  header.difficulty = format(data.currentDifficulty)
  header.number = format(data.currentNumber)
  return header
}

/**
 * makeBlockFromEnv - helper to create a block from the env object in tests repo
 * @param {Object} env object from tests repo
 * @param {Object} transactions transactions for the block
 * @returns {Object} the block
 */
exports.makeBlockFromEnv = function (env, transactions) {
  return new Block({
    header: exports.makeBlockHeader(env),
    transactions: transactions || {},
    uncleHeaders: [],
  })
}

/**
 * makeRunCodeData - helper to create the object for VM.runCode using
 *   the exec object specified in the tests repo
 * @param {Object} exec    object from the tests repo
 * @param {Object} account that the executing code belongs to
 * @param {Object} block   that the transaction belongs to
 * @returns {Object}       object that will be passed to VM.runCode function
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
    block: block,
  }
}

/**
 * setupPreConditions given JSON testData
 * @param state - the state DB/trie
 * @param testData - JSON from tests repo
 */
exports.setupPreConditions = async function (state, testData) {
  await state.checkpoint()
  for (const address of Object.keys(testData.pre)) {
    const { nonce, balance, code, storage } = testData.pre[address]

    const addressBuf = format(address)
    const codeBuf = format(code)
    const codeHash = keccak256(codeBuf)

    const storageTrie = state.copy(false)
    storageTrie.root = null

    // Set contract storage
    for (const storageKey of Object.keys(storage)) {
      const valBN = new BN(format(storage[storageKey]), 16)
      if (valBN.isZero()) {
        continue
      }
      const val = rlp.encode(valBN.toArrayLike(Buffer, 'be'))
      const key = setLengthLeft(format(storageKey), 32)

      await storageTrie.put(key, val)
    }

    const stateRoot = storageTrie.root

    if (testData.exec && testData.exec.address === address) {
      testData.root = storageTrie.root
    }

    const account = new Account({ nonce, balance, codeHash, stateRoot })
    await state._mainDB.put(codeHash, codeBuf)
    await state.put(addressBuf, account.serialize())
  }
  await state.commit()
}

/**
 * Returns an alias for specified hardforks to meet test dependencies requirements/assumptions.
 * @param {String} forkConfig - the name of the hardfork for which an alias should be returned
 * @returns {String} Either an alias of the forkConfig param, or the forkConfig param itself
 */
exports.getRequiredForkConfigAlias = function (forkConfig) {
  // Run the Istanbul tests for MuirGlacier since there are no dedicated tests
  if (String(forkConfig).match(/^muirGlacier/i)) {
    return 'Istanbul'
  }
  // Petersburg is named ConstantinopleFix in the client-independent consensus test suite
  if (String(forkConfig).match(/^petersburg$/i)) {
    return 'ConstantinopleFix'
  }
  return forkConfig
}

/**
 * Checks if in a karma test runner.
 * @returns {bool} is running in karma
 */
exports.isRunningInKarma = () => {
  return typeof window !== 'undefined' && window.__karma__
}

/**
 * Returns a DAO common which has a different activation block than the default block
 */
exports.getDAOCommon = function (activationBlock) {
  // here: get the default fork list of mainnet and only edit the DAO fork block (thus copy the rest of the "default" hardfork settings)
  const defaultDAOCommon = new Common({ chain: 'mainnet', hardfork: 'dao' })
  // retrieve the hard forks list from defaultCommon...
  let forks = defaultDAOCommon.hardforks()
  let editedForks = []
  // explicitly edit the "dao" block number:
  for (let fork of forks) {
    if (fork.name == 'dao') {
      editedForks.push({
        name: 'dao',
        forkHash: fork.forkHash,
        block: activationBlock,
      })
    } else {
      editedForks.push(fork)
    }
  }
  const DAOCommon = Common.forCustomChain(
    'mainnet',
    {
      hardforks: editedForks,
    },
    'dao',
  )
  return DAOCommon
}
