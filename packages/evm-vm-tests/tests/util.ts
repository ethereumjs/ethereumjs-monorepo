import { Block, BlockHeader } from '@ethereumjs/block'
import { RLP } from '@ethereumjs/rlp'
import {
  AccessListEIP2930Transaction,
  FeeMarketEIP1559Transaction,
  Transaction,
} from '@ethereumjs/tx'
import {
  Account,
  Address,
  bigIntToBuffer,
  bufferToBigInt,
  isHexPrefixed,
  setLengthLeft,
  stripHexPrefix,
  toBuffer,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { bytesToHex } from 'ethereum-cryptography/utils'

import type { BlockOptions } from '@ethereumjs/block'
import type { TxOptions } from '@ethereumjs/tx'
import type { VmState } from '@ethereumjs/vm'
import type * as tape from 'tape'

export function format(a: any, toZero: boolean = false, isHex: boolean = false): Buffer {
  if (a === '') {
    return Buffer.alloc(0)
  }

  if (typeof a === 'string' && isHexPrefixed(a)) {
    a = a.slice(2)
    if (a.length % 2) a = '0' + a
    a = Buffer.from(a, 'hex')
  } else if (!isHex) {
    try {
      a = bigIntToBuffer(BigInt(a))
    } catch {
      // pass
    }
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
 * Make a tx using JSON from tests repo
 * @param {Object} txData The tx object from tests repo
 * @param {TxOptions} opts Tx opts that can include an @ethereumjs/common object
 * @returns {FeeMarketEIP1559Transaction | AccessListEIP2930Transaction | Transaction} Transaction to be passed to VM.runTx function
 */
export function makeTx(
  txData: any,
  opts?: TxOptions
): FeeMarketEIP1559Transaction | AccessListEIP2930Transaction | Transaction {
  let tx
  if (txData.maxFeePerGas !== undefined) {
    tx = FeeMarketEIP1559Transaction.fromTxData(txData, opts)
  } else if (txData.accessLists !== undefined) {
    tx = AccessListEIP2930Transaction.fromTxData(txData, opts)
  } else {
    tx = Transaction.fromTxData(txData, opts)
  }

  if (txData.secretKey !== undefined) {
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
      const hash = bytesToHex(keccak256(Buffer.from(stripHexPrefix(key), 'hex')))
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

      if (testData !== undefined) {
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
        `Expected balance of ${bufferToBigInt(format(acctData.balance, true))}, but got ${
          account.balance
        }`
      )
    }
    if (!format(account.nonce, true).equals(format(acctData.nonce, true))) {
      t.comment(
        `Expected nonce of ${bufferToBigInt(format(acctData.nonce, true))}, but got ${
          account.nonce
        }`
      )
    }

    // validate storage
    const origRoot = state.root()

    const hashedStorage: any = {}
    for (const key in acctData.storage) {
      hashedStorage[bytesToHex(keccak256(setLengthLeft(Buffer.from(key.slice(2), 'hex'), 32)))] =
        acctData.storage[key]
    }

    state.root(account.storageRoot)
    const rs = state.createReadStream()
    rs.on('data', function (data: any) {
      let key = data.key.toString('hex')
      const val = '0x' + Buffer.from(RLP.decode(data.value) as Uint8Array).toString('hex')

      if (key === '0x') {
        key = '0x00'
        acctData.storage['0x00'] = acctData.storage['0x00'] ?? acctData.storage['0x']
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

      state.root(origRoot)
      resolve()
    })
  })
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
    currentRandom,
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
  if (opts?.common && opts.common.gteHardfork('merge')) {
    headerData['mixHash'] = currentRandom
    headerData['difficulty'] = 0
  }
  return BlockHeader.fromHeaderData(headerData, opts)
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
export async function setupPreConditions(state: VmState, testData: any) {
  await state.checkpoint()
  for (const addressStr of Object.keys(testData.pre)) {
    const { nonce, balance, code, storage } = testData.pre[addressStr]

    const addressBuf = format(addressStr)
    const address = new Address(addressBuf)

    const codeBuf = format(code)
    const codeHash = keccak256(codeBuf)

    // Set contract storage
    for (const storageKey of Object.keys(storage)) {
      const val = format(storage[storageKey])
      if (['', '00'].includes(val.toString('hex'))) {
        continue
      }
      const key = setLengthLeft(format(storageKey), 32)
      await state.putContractStorage(address, key, val)
    }

    // Put contract code
    await state.putContractCode(address, codeBuf)

    const storageRoot = (await state.getAccount(address)).storageRoot

    if (testData.exec?.address === addressStr) {
      testData.root(storageRoot)
    }

    // Put account data
    const account = Account.fromAccountData({ nonce, balance, codeHash, storageRoot })
    await state.putAccount(address, account)
  }
  await state.commit()
  // Clear the touched stack, otherwise untouched accounts in the block which are empty (>= SpuriousDragon)
  // will get deleted from the state, resulting in state trie errors
  ;(<any>state)._touched.clear()
}
