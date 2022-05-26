import tape from 'tape'
import { Block, BlockHeader, BlockOptions } from '@ethereumjs/block'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import {
  AccessListEIP2930Transaction,
  FeeMarketEIP1559Transaction,
  Transaction,
  TxOptions,
} from '@ethereumjs/tx'
import {
  Account,
  BN,
  rlp,
  keccak256,
  stripHexPrefix,
  setLengthLeft,
  toBuffer,
} from 'ethereumjs-util'

export function dumpState(state: any, cb: Function) {
  function readAccounts(state: any) {
    return new Promise((resolve) => {
      const accounts: Account[] = []
      const rs = state.createReadStream()
      rs.on('data', function (data: any) {
        const rlp = data.value
        const account = Account.fromRlpSerializedAccount(rlp)
        accounts.push(account)
      })
      rs.on('end', function () {
        resolve(accounts)
      })
    })
  }

  function readStorage(state: any, account: Account) {
    return new Promise((resolve) => {
      const storage: any = {}
      const storageTrie = state.copy(false)
      storageTrie.root = account.stateRoot
      const storageRS = storageTrie.createReadStream()

      storageRS.on('data', function (data: any) {
        storage[data.key.toString('hex')] = data.value.toString('hex')
      })

      storageRS.on('end', function () {
        resolve(storage)
      })
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  readAccounts(state).then(async function (accounts: any) {
    const results: any = []
    for (let key = 0; key < accounts.length; key++) {
      const result = await readStorage(state, accounts[key])
      results.push(result)
    }
    for (let i = 0; i < results.length; i++) {
      console.log("SHA3'd address: " + <string>results[i].address.toString('hex'))
      console.log('\tstate root: ' + <string>results[i].stateRoot.toString('hex'))
      console.log('\tstorage: ')
      for (const storageKey in results[i].storage) {
        console.log('\t\t' + storageKey + ': ' + <string>results[i].storage[storageKey])
      }
      console.log('\tnonce: ' + new BN(results[i].nonce).toString())
      console.log('\tbalance: ' + new BN(results[i].balance).toString())
    }
    cb()
  })
}

export function format(a: any, toZero: boolean = false, isHex: boolean = false): Buffer {
  if (a === '') {
    return Buffer.alloc(0)
  }

  if (a.slice && a.slice(0, 2) === '0x') {
    a = a.slice(2)
    if (a.length % 2) a = '0' + <string>a
    a = Buffer.from(a, 'hex')
  } else if (!isHex) {
    a = Buffer.from(new BN(a).toArray())
  } else {
    if (a.length % 2) a = '0' + <string>a
    a = Buffer.from(a, 'hex')
  }

  if (toZero && a.toString('hex') === '') {
    a = Buffer.from([0])
  }

  return a
}

/**
 * Make a tx using JSON from tests repo
 * @param {Object} txData The tx object from tests repo
 * @param {TxOptions} opts Tx opts that can include an @ethereumjs/common object
 * @returns {Transaction} Transaction to be passed to VM.runTx function
 */
export function makeTx(txData: any, opts?: TxOptions) {
  let tx
  if (txData.maxFeePerGas) {
    tx = FeeMarketEIP1559Transaction.fromTxData(txData, opts)
  } else if (txData.accessLists) {
    tx = AccessListEIP2930Transaction.fromTxData(txData, opts)
  } else {
    tx = Transaction.fromTxData(txData, opts)
  }

  if (txData.secretKey) {
    const privKey = toBuffer(txData.secretKey)
    return tx.sign(privKey)
  }

  return tx
}

export async function verifyPostConditions(state: any, testData: any, t: tape.Test) {
  return new Promise<void>((resolve) => {
    const hashedAccounts: any = {}
    const keyMap: any = {}

    for (const key in testData) {
      const hash = keccak256(Buffer.from(stripHexPrefix(key), 'hex')).toString('hex')
      hashedAccounts[hash] = testData[key]
      keyMap[hash] = key
    }

    const queue: any = []

    const stream = state.createReadStream()

    stream.on('data', function (data: any) {
      const rlp = data.value
      const account = Account.fromRlpSerializedAccount(rlp)
      const key = data.key.toString('hex')
      const testData = hashedAccounts[key]
      const address = keyMap[key]
      delete keyMap[key]

      if (testData) {
        const promise = verifyAccountPostConditions(state, address, account, testData, t)
        queue.push(promise)
      } else {
        t.comment('invalid account in the trie: ' + <string>key)
      }
    })

    stream.on('end', async function () {
      await Promise.all(queue)
      for (const [_key, address] of Object.entries(keyMap)) {
        t.comment(`Missing account!: ${address}`)
      }
      resolve()
    })
  })
}

/**
 * verifyAccountPostConditions using JSON from tests repo
 * @param state    DB/trie
 * @param address   Account Address
 * @param account  to verify
 * @param acctData postconditions JSON from tests repo
 */
export function verifyAccountPostConditions(
  state: any,
  address: string,
  account: Account,
  acctData: any,
  t: tape.Test
) {
  return new Promise<void>((resolve) => {
    t.comment('Account: ' + address)
    if (!format(account.balance, true).equals(format(acctData.balance, true))) {
      t.comment(
        `Expected balance of ${new BN(format(acctData.balance, true))}, but got ${account.balance}`
      )
    }
    if (!format(account.nonce, true).equals(format(acctData.nonce, true))) {
      t.comment(
        `Expected nonce of ${new BN(format(acctData.nonce, true))}, but got ${account.nonce}`
      )
    }

    // validate storage
    const origRoot = state.root

    const hashedStorage: any = {}
    for (const key in acctData.storage) {
      hashedStorage[
        keccak256(setLengthLeft(Buffer.from(key.slice(2), 'hex'), 32)).toString('hex')
      ] = acctData.storage[key]
    }

    state.root = account.stateRoot
    const rs = state.createReadStream()
    rs.on('data', function (data: any) {
      let key = data.key.toString('hex')
      const val = '0x' + rlp.decode(data.value).toString('hex')

      if (key === '0x') {
        key = '0x00'
        acctData.storage['0x00'] = acctData.storage['0x00']
          ? acctData.storage['0x00']
          : acctData.storage['0x']
        delete acctData.storage['0x']
      }

      if (val !== hashedStorage[key]) {
        t.comment(
          `Expected storage key 0x${data.key.toString('hex')} at address ${address} to have value ${
            hashedStorage[key] ?? '0x'
          }, but got ${val}}`
        )
      }
      delete hashedStorage[key]
    })

    rs.on('end', function () {
      for (const key in hashedStorage) {
        if (hashedStorage[key] !== '0x00') {
          t.comment(`key: ${key} not found in storage at address ${address}`)
        }
      }

      state.root = origRoot
      resolve()
    })
  })
}

/**
 * verifyGas by computing the difference of coinbase account balance
 * @param {Object} results  to verify
 * @param {Object} testData from tests repo
 */
export function verifyGas(results: any, testData: any, t: tape.Test) {
  const coinbaseAddr = testData.env.currentCoinbase
  const preBal = testData.pre[coinbaseAddr] ? testData.pre[coinbaseAddr].balance : 0

  if (!testData.post[coinbaseAddr]) {
    return
  }

  const postBal = new BN(testData.post[coinbaseAddr].balance)
  const balance = postBal.sub(preBal)
  if (!balance.isZero()) {
    const amountSpent = results.gasUsed.mul(testData.transaction.gasPrice)
    t.ok(amountSpent.eq(balance), 'correct gas')
  } else {
    t.equal(results, undefined)
  }
}

/**
 * verifyLogs
 * @param logs  to verify
 * @param testData from tests repo
 */
export function verifyLogs(logs: any, testData: any, t: tape.Test) {
  if (testData.logs) {
    testData.logs.forEach(function (log: any, i: number) {
      const rlog = logs[i]
      t.equal(rlog[0].toString('hex'), log.address, 'log: valid address')
      t.equal('0x' + <string>rlog[2].toString('hex'), log.data, 'log: valid data')
      log.topics.forEach(function (topic: string, i: number) {
        t.equal(rlog[1][i].toString('hex'), topic, 'log: invalid topic')
      })
    })
  }
}

export function makeBlockHeader(data: any, opts?: BlockOptions) {
  const {
    currentTimestamp,
    currentGasLimit,
    previousHash,
    currentCoinbase,
    currentDifficulty,
    currentNumber,
    currentBaseFee,
  } = data
  const headerData: any = {
    number: currentNumber,
    coinbase: currentCoinbase,
    parentHash: previousHash,
    difficulty: currentDifficulty,
    gasLimit: currentGasLimit,
    timestamp: currentTimestamp,
  }
  if (opts?.common && opts.common.gteHardfork('london')) {
    headerData['baseFeePerGas'] = currentBaseFee
  }
  return BlockHeader.fromHeaderData(headerData, opts)
}

/**
 * makeBlockFromEnv - helper to create a block from the env object in tests repo
 * @param env object from tests repo
 * @param transactions transactions for the block (optional)
 * @param uncleHeaders uncle headers for the block (optional)
 * @returns the block
 */
export function makeBlockFromEnv(env: any, opts?: BlockOptions): Block {
  const header = makeBlockHeader(env, opts)
  return new Block(header)
}

/**
 * setupPreConditions given JSON testData
 * @param state - the state DB/trie
 * @param testData - JSON from tests repo
 */
export async function setupPreConditions(state: any, testData: any) {
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

    // Put contract code
    await state.db.put(codeHash, codeBuf)

    // Put account data
    const account = Account.fromAccountData({ nonce, balance, codeHash, stateRoot })
    await state.put(addressBuf, account.serialize())
  }
  await state.commit()
}

/**
 * Returns an alias for specified hardforks to meet test dependencies requirements/assumptions.
 * @param forkConfig - the name of the hardfork for which an alias should be returned
 * @returns Either an alias of the forkConfig param, or the forkConfig param itself
 */
export function getRequiredForkConfigAlias(forkConfig: string): string {
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
 * @returns boolean whether running in karma
 */
export function isRunningInKarma(): Boolean {
  // eslint-disable-next-line no-undef
  return typeof (<any>globalThis).window !== 'undefined' && (<any>globalThis).window.__karma__
}

/**
 * Returns a DAO common which has a different activation block than the default block
 */
export function getDAOCommon(activationBlock: number) {
  // here: get the default fork list of mainnet and only edit the DAO fork block (thus copy the rest of the "default" hardfork settings)
  const defaultDAOCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Dao })
  // retrieve the hard forks list from defaultCommon...
  const forks = defaultDAOCommon.hardforks()
  const editedForks = []
  // explicitly edit the "dao" block number:
  for (const fork of forks) {
    if (fork.name == Hardfork.Dao) {
      editedForks.push({
        name: Hardfork.Dao,
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
    Hardfork.Dao
  )
  return DAOCommon
}
