import { Block, createBlockHeader } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet, createCustomCommon } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import {
  createAccessList2930Tx,
  createBlob4844Tx,
  createEOACode7702Tx,
  createFeeMarket1559Tx,
  createLegacyTx,
} from '@ethereumjs/tx'
import {
  Account,
  Address,
  TypeOutput,
  bigIntToBytes,
  bytesToBigInt,
  bytesToHex,
  createAccountFromRLP,
  createPartialAccount,
  equalsBytes,
  hexToBytes,
  isHexString,
  setLengthLeft,
  toBytes,
  toType,
  unpadBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import type { BlockOptions } from '@ethereumjs/block'
import type { StateManagerInterface } from '@ethereumjs/common'
import type {
  AccessList2930Tx,
  Blob4844Tx,
  EOACode7702Tx,
  FeeMarket1559Tx,
  LegacyTx,
  TxOptions,
} from '@ethereumjs/tx'
import type { assert } from 'vitest'

// Use Vitest assert type directly
function logComment(t: typeof assert, message: string): void {
  // Vitest doesn't have comments, use console.log
  console.log(`[TEST] ${message}`)
}

export function format(a: any, toZero: boolean = false, isHex: boolean = false): Uint8Array {
  if (a === '') {
    return new Uint8Array()
  }

  if (typeof a === 'string' && isHexString(a)) {
    a = a.slice(2)
    if (a.length % 2) a = '0' + a
    a = hexToBytes(`0x${a}`)
  } else if (!isHex) {
    try {
      a = bigIntToBytes(BigInt(a))
    } catch {
      // pass
    }
  } else {
    if (a.length % 2) a = '0' + a
    a = hexToBytes(`0x${a}`)
  }

  if (toZero && bytesToHex(a) === '0x') {
    a = Uint8Array.from([0])
  }

  return a
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
  t: typeof assert,
) {
  return new Promise<void>((resolve) => {
    logComment(t, 'Account: ' + address)
    if (!equalsBytes(format(account.balance, true), format(acctData.balance, true))) {
      logComment(
        t,
        `Expected balance of ${bytesToBigInt(format(acctData.balance, true))}, but got ${
          account.balance
        }`,
      )
    }
    if (!equalsBytes(format(account.nonce, true), format(acctData.nonce, true))) {
      logComment(
        t,
        `Expected nonce of ${bytesToBigInt(format(acctData.nonce, true))}, but got ${account.nonce}`,
      )
    }

    // validate storage
    const origRoot = state.root()

    const hashedStorage: any = {}
    for (const key in acctData.storage) {
      hashedStorage[
        bytesToHex(keccak_256(setLengthLeft(hexToBytes(isHexString(key) ? key : `0x${key}`), 32)))
      ] = acctData.storage[key]
    }

    state.root(account.storageRoot)
    const rs = state.createReadStream()
    rs.on('data', function (data: any) {
      let key = bytesToHex(data.key)
      const val = bytesToHex(RLP.decode(data.value) as Uint8Array)

      if (key === '0x') {
        key = '0x00'
        acctData.storage['0x00'] = acctData.storage['0x00'] ?? acctData.storage['0x']
        delete acctData.storage['0x']
      }

      if (val !== hashedStorage[key]) {
        logComment(
          t,
          `Expected storage key ${bytesToHex(data.key)} at address ${address} to have value ${
            hashedStorage[key] ?? '0x'
          }, but got ${val}}`,
        )
      }
      delete hashedStorage[key]
    })

    rs.on('end', function () {
      for (const key in hashedStorage) {
        if (hashedStorage[key] !== '0x00') {
          logComment(t, `key: ${key} not found in storage at address ${address}`)
        }
      }

      state.root(origRoot)
      resolve()
    })
  })
}

export function dumpState(state: any, cb: Function) {
  function readAccounts(state: any) {
    return new Promise((resolve) => {
      const accounts: Account[] = []
      const rs = state.createReadStream()
      rs.on('data', function (data: any) {
        const rlp = data.value
        const account = createAccountFromRLP(rlp)
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
      storageTrie.root(account.storageRoot)
      const storageRS = storageTrie.createReadStream()

      storageRS.on('data', function (data: any) {
        storage[bytesToHex(data.key)] = bytesToHex(data.value)
      })

      storageRS.on('end', function () {
        resolve(storage)
      })
    })
  }

  readAccounts(state).then(async function (accounts: any) {
    const results: any = []
    for (let key = 0; key < accounts.length; key++) {
      const result = await readStorage(state, accounts[key])
      results.push(result)
    }
    for (let i = 0; i < results.length; i++) {
      console.log('Hashed address: ' + bytesToHex(results[i].address))
      console.log('\tstorage root: ' + bytesToHex(results[i].storageRoot))
      console.log('\tstorage: ')
      for (const storageKey in results[i].storage) {
        console.log('\t\t' + storageKey + ': ' + results[i].storage[storageKey])
      }
      console.log('\tnonce: ' + BigInt(results[i].nonce))
      console.log('\tbalance: ' + BigInt(results[i].balance))
    }
    cb()
  })
}

/**
 * Make a tx using JSON from tests repo
 * @param {Object} txData The tx object from tests repo
 * @param {TxOptions} opts Tx opts that can include an @ethereumjs/common object
 * @returns {Blob4844Tx | FeeMarket1559Tx | AccessList2930Transaction | LegacyTx} Transaction to be passed to runTx() function
 */
export function makeTx(
  txData: any,
  opts?: TxOptions,
): EOACode7702Tx | Blob4844Tx | FeeMarket1559Tx | AccessList2930Tx | LegacyTx {
  let tx
  if (txData.authorizationList !== undefined) {
    // Convert `v` keys to `yParity`
    for (const signature of txData.authorizationList) {
      if (signature.v !== undefined) {
        signature.yParity = bytesToHex(unpadBytes(hexToBytes(signature.v)))
      }
      if (signature.r !== undefined) {
        signature.r = bytesToHex(unpadBytes(hexToBytes(signature.r)))
      }
      if (signature.s !== undefined) {
        signature.s = bytesToHex(unpadBytes(hexToBytes(signature.s)))
      }
      if (signature.chainId !== undefined) {
        signature.chainId = bytesToHex(unpadBytes(hexToBytes(signature.chainId)))
      }
      if (signature.nonce !== undefined && signature.nonce === '0x00') {
        signature.nonce = '0x'
      }
    }
    tx = createEOACode7702Tx(txData, opts)
  } else if (txData.blobVersionedHashes !== undefined) {
    tx = createBlob4844Tx(txData, opts)
  } else if (txData.maxFeePerGas !== undefined) {
    tx = createFeeMarket1559Tx(txData, opts)
  } else if (txData.accessLists !== undefined) {
    tx = createAccessList2930Tx(txData, opts)
  } else {
    tx = createLegacyTx(txData, opts)
  }

  if (txData.secretKey !== undefined) {
    const privKey = toBytes(txData.secretKey)
    return tx.sign(privKey)
  }

  return tx
}

export async function verifyPostConditions(state: any, testData: any, t: typeof assert) {
  return new Promise<void>((resolve) => {
    const hashedAccounts: any = {}
    const keyMap: any = {}

    for (const key in testData) {
      const hash = bytesToHex(keccak_256(hexToBytes(isHexString(key) ? key : `0x${key}`)))
      hashedAccounts[hash] = testData[key]
      keyMap[hash] = key
    }

    const queue: any = []

    const stream = state.createReadStream()

    stream.on('data', function (data: any) {
      const rlp = data.value
      const account = createAccountFromRLP(rlp)
      const key = bytesToHex(data.key)
      const testData = hashedAccounts[key]
      const address = keyMap[key]
      delete keyMap[key]

      if (testData !== undefined) {
        const promise = verifyAccountPostConditions(state, address, account, testData, t)
        queue.push(promise)
      } else {
        logComment(t, 'invalid account in the trie: ' + key)
      }
    })

    stream.on('end', async function () {
      await Promise.all(queue)
      for (const [_key, address] of Object.entries(keyMap)) {
        logComment(t, `Missing account!: ${address}`)
      }
      resolve()
    })
  })
}

export function makeParentBlockHeader(data: any, opts: BlockOptions) {
  const {
    parentGasLimit,
    parentGasUsed,
    parentBaseFee,
    parentDifficulty,
    parentTimestamp,
    parentUncleHash,
    parentBlobGasUsed,
    parentExcessBlobGas,
    parentBeaconBlockRoot,
  } = data
  return createBlockHeader(
    {
      gasLimit: parentGasLimit,
      gasUsed: parentGasUsed,
      baseFeePerGas: parentBaseFee,
      difficulty: parentDifficulty,
      timestamp: parentTimestamp,
      uncleHash: parentUncleHash,
      blobGasUsed: parentBlobGasUsed,
      excessBlobGas: parentExcessBlobGas,
      parentBeaconBlockRoot,
    },
    { common: opts.common },
  )
}

export function makeBlockHeader(data: any, opts?: BlockOptions) {
  const {
    currentTimestamp,
    currentGasLimit,
    previousHash,
    parentHash,
    currentCoinbase,
    currentDifficulty,
    currentExcessBlobGas,
    currentNumber,
    currentBaseFee,
    currentRandom,
  } = data
  const headerData: any = {
    number: currentNumber,
    coinbase: currentCoinbase,
    parentHash: previousHash ?? parentHash,
    difficulty: currentDifficulty,
    gasLimit: currentGasLimit,
    timestamp: currentTimestamp,
  }
  const parentBlockHeader = makeParentBlockHeader(data, { common: opts?.common })
  if (opts?.common && opts.common.gteHardfork('london')) {
    headerData['baseFeePerGas'] = currentBaseFee
    if (currentBaseFee === undefined) {
      headerData['baseFeePerGas'] = parentBlockHeader.calcNextBaseFee()
    }
  }
  if (opts?.common && opts.common.gteHardfork('paris')) {
    headerData['mixHash'] = setLengthLeft(
      toType(currentRandom, TypeOutput.Uint8Array)!,
      32,
    ) as Uint8Array
    headerData['difficulty'] = 0
  }
  if (opts?.common && opts.common.gteHardfork('cancun')) {
    headerData['excessBlobGas'] = currentExcessBlobGas
    if (currentExcessBlobGas === undefined) {
      headerData['excessBlobGas'] = parentBlockHeader.calcNextExcessBlobGas(opts.common)
    }
  }
  return createBlockHeader(headerData, opts)
}

/**
 * makeBlockFromEnv - helper to create a block from the env object in tests repo
 * @param env object from tests repo
 * @param opts block options (optional)
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
export async function setupPreConditions(state: StateManagerInterface, testData: any) {
  await state.checkpoint()
  for (const addressStr of Object.keys(testData.pre)) {
    const { nonce, balance, code, storage } = testData.pre[addressStr]

    const addressBuf = format(addressStr)
    const address = new Address(addressBuf)
    await state.putAccount(address, new Account())

    const codeBuf = format(code)
    const codeHash = keccak_256(codeBuf)

    // Set contract storage
    for (const storageKey of Object.keys(storage)) {
      const val = format(storage[storageKey])
      if (['0x', '0x00'].includes(bytesToHex(val))) {
        continue
      }
      const key = setLengthLeft(format(storageKey), 32)
      await state.putStorage(address, key, val)
    }

    // Put contract code
    await state.putCode(address, codeBuf)

    const storageRoot = (await state.getAccount(address))!.storageRoot

    if (testData.exec?.address === addressStr) {
      testData.root(storageRoot)
    }

    // Put account data
    const account = createPartialAccount({
      nonce,
      balance,
      codeHash,
      storageRoot,
      codeSize: codeBuf.byteLength,
    })
    await state.putAccount(address, account)
  }
  await state.commit()
}

/**
 * Returns a DAO common which has a different activation block than the default block
 */
export function getDAOCommon(activationBlock: number) {
  // here: get the default fork list of mainnet and only edit the DAO fork block (thus copy the rest of the "default" hardfork settings)
  const defaultDAOCommon = new Common({ chain: Mainnet, hardfork: Hardfork.Dao })
  // retrieve the hard forks list from defaultCommon...
  const forks = defaultDAOCommon.hardforks()
  const editedForks = []
  // explicitly edit the "dao" block number:
  for (const fork of forks) {
    if (fork.name === Hardfork.Dao) {
      editedForks.push({
        name: Hardfork.Dao,
        forkHash: fork.forkHash,
        block: activationBlock,
      })
    } else {
      editedForks.push(fork)
    }
  }
  const DAOCommon = createCustomCommon(
    {
      hardforks: editedForks,
    },
    Mainnet,
    {
      hardfork: Hardfork.Dao,
    },
  )
  return DAOCommon
}
