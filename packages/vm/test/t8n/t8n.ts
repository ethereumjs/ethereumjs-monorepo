import { Block, createBlock, createBlockHeader } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import {
  createLegacyTxFromBytesArray,
  createTxFromSerializedData,
  createTxFromTxData,
} from '@ethereumjs/tx'
import {
  Account,
  bigIntToHex,
  bytesToHex,
  createAddressFromString,
  hexToBytes,
  setLengthLeft,
  unpadBytes,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { BlockBuilder } from '../../dist/esm/buildBlock.js'
import { VM } from '../../dist/esm/vm.js'
import { getCommon } from '../tester/config.js'
import { makeBlockFromEnv, setupPreConditions } from '../util.js'

import type { PostByzantiumTxReceipt } from '../../dist/esm/types.js'
import type { TypedTransaction, TypedTxData } from '@ethereumjs/tx'
import type { Address, NestedUint8Array, PrefixedHexString } from '@ethereumjs/util'

function normalizeNumbers(input: any) {
  const keys = [
    'currentGasLimit',
    'currentNumber',
    'currentTimestamp',
    'currentRandom',
    'currentDifficulty',
    'parentDifficulty',
    'parentTimestamp',
    'parentBaseFee',
    'parentGasUsed',
    'parentGasLimit',
    'parentBlobGasUsed',
    'parentExcessBlobGas',
  ]

  for (const key of keys) {
    const value = input[key]
    if (value !== undefined) {
      if (value.substring(0, 2) !== '0x') {
        input[key] = BigInt(value)
      }
    }
  }
  return input
}

const args = yargs(hideBin(process.argv))
  .option('state.fork', {
    describe: 'Fork to use',
    type: 'string',
  })
  .option('input.alloc', {
    describe: 'Initial state allocation',
    type: 'string',
  })
  .option('inputs.txs', {
    describe: 'RLP input of txs to run on top of the initial state allocation',
    type: 'string',
  })
  .option('inputs.env', {
    describe: 'Input environment (coinbase, difficulty, etc.)',
    type: 'string',
  })
  .option('output.basedir', {
    describe: 'Base directory to write output to',
    type: 'string',
  })
  .option('output.result', {
    describe: 'File to write output results to (relative to `output.basedir`)',
    type: 'string',
  })
  .option('output.alloc', {
    describe: 'File to write output allocation to (after running the transactions)',
    type: 'string',
  }).argv as any

console.log('ARGS', args)

const alloc = JSON.parse(readFileSync(args.input.alloc).toString())
const txsData = JSON.parse(readFileSync(args.input.txs).toString())
const inputEnv = normalizeNumbers(JSON.parse(readFileSync(args.input.env).toString()))

const common = getCommon(args.state.fork)

let blockchain
if (args.state.fork === 'Merged') {
  const genesisBlockData = {
    gasLimit: 5000,
    difficulty: 0,
    nonce: hexToBytes('0x0000000000000000'),
    extraData: hexToBytes('0x11bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa'),
  }
  const genesis = createBlock({ header: createBlockHeader(genesisBlockData) })
  blockchain = await createBlockchain({ common, genesisBlock: genesis })
}
const vm = blockchain ? await VM.create({ common, blockchain }) : await VM.create({ common })

console.log('ALLOC', alloc)
await setupPreConditions(vm.stateManager, { pre: alloc })

const block = makeBlockFromEnv(inputEnv, { common })

const headerData = block.header.toJSON()
headerData.difficulty = inputEnv.parentDifficulty

const builder = new BlockBuilder(vm, {
  parentBlock: new Block(),
  headerData,
  blockOpts: { putBlockIntoBlockchain: false },
})

const receipts: any = []

let txCounter = 0

vm.events.on('afterTx', async (afterTx, continueFn: any) => {
  const receipt = afterTx.receipt as PostByzantiumTxReceipt
  const pushReceipt = {
    root: '0x',
    status: receipt.status === 0 ? '0x' : '0x1',
    cumulativeGasUsed: '0x' + receipt.cumulativeBlockGasUsed.toString(16),
    logsBloom: bytesToHex(receipt.bitvector),
    transactionHash: bytesToHex(afterTx.transaction.hash()),
    contractAddress: '0x0000000000000000000000000000000000000000',
    gasUsed: '0x' + afterTx.totalGasSpent.toString(16),
    blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    transactionIndex: '0x' + txCounter.toString(16),
  }
  receipts.push(pushReceipt)
  txCounter++
  continueFn!(undefined)
})

console.log(alloc)

// Track the allocation to ensure the output.alloc is correct
const allocTracker: {
  [address: string]: {
    storage: string[]
  }
} = {}

function addAddress(address: string) {
  if (allocTracker[address] === undefined) {
    allocTracker[address] = { storage: [] }
  }
  return allocTracker[address]
}

function addStorage(address: string, storage: string) {
  const storageList = addAddress(address).storage
  if (!storageList.includes(storage)) {
    storageList.push(storage)
  }
}

const originalPutAccount = vm.stateManager.putAccount
const originalPutCode = vm.stateManager.putCode
const originalPutStorage = vm.stateManager.putStorage

vm.stateManager.putAccount = async function (...args: any) {
  const address = <Address>args[0]
  addAddress(address.toString())
  await originalPutAccount.apply(this, args)
}

vm.stateManager.putAccount = async function (...args: any) {
  const address = <Address>args[0]
  console.log('PUTACCOUNT', address.toString())
  addAddress(address.toString())
  return await originalPutAccount.apply(this, args)
}

vm.stateManager.putCode = async function (...args: any) {
  const address = <Address>args[0]
  console.log('PUTCODE', address.toString())
  addAddress(address.toString())
  return await originalPutCode.apply(this, args)
}

vm.stateManager.putStorage = async function (...args: any) {
  const address = <Address>args[0]
  const key = <Uint8Array>args[1]
  console.log('PUTSTORAGE', address.toString(), bytesToHex(key))
  addStorage(address.toString(), bytesToHex(key))
  return await originalPutStorage.apply(this, args)
}

const rejected: any = []

let index = 0

for (const txData of txsData) {
  try {
    if (txData.v !== undefined) {
      txData.yParity = txData.v
    }
    if (txData.gas !== undefined) {
      txData.gasLimit = txData.gas
    }

    if (txData.authorizationList !== undefined) {
      txData.authorizationList.map((e: any) => {
        if (e.yParity === undefined) {
          e.yParity = e.v
        }
      })
    }
    if (txData.input !== undefined) {
      txData.data = txData.input
    }
    const tx = createTxFromTxData(txData, { common })
    await builder.addTransaction(tx)
  } catch (e: any) {
    rejected.push({
      index,
      error: e.message,
    })
  }
  index++
}

await vm.evm.journal.cleanup()

const result = await builder.build()

const output = {
  stateRoot: bytesToHex(result.header.stateRoot),
  txRoot: bytesToHex(result.header.transactionsTrie),
  receiptsRoot: bytesToHex(result.header.receiptTrie),
  logsHash: bytesToHex(keccak256(result.header.logsBloom)),
  logsBloom: bytesToHex(result.header.logsBloom),
  receipts,
  gasUsed: bigIntToHex(builder.gasUsed),
}

if (result.header.baseFeePerGas !== undefined) {
  ;(output as any).currentBaseFee = bigIntToHex(result.header.baseFeePerGas)
}

if (result.header.withdrawalsRoot !== undefined) {
  ;(output as any).withdrawalsRoot = bytesToHex(result.header.withdrawalsRoot)
}

if (rejected.length > 0) {
  ;(output as any).rejected = rejected
}

// Build output alloc

for (const addressString in allocTracker) {
  const address = createAddressFromString(addressString)
  const account = await vm.stateManager.getAccount(address)
  if (account === undefined) {
    delete alloc[addressString]
    continue
  }
  if (alloc[addressString] === undefined) {
    alloc[addressString] = {}
  }
  alloc[addressString].nonce = bigIntToHex(account.nonce)
  alloc[addressString].balance = bigIntToHex(account.balance)
  alloc[addressString].code = bytesToHex(await vm.stateManager.getCode(address))

  const storage = allocTracker[addressString].storage ?? {}
  allocTracker[addressString].storage = storage

  for (const key of storage) {
    const keyBytes = hexToBytes(<PrefixedHexString>key)
    let storageKeyTrimmed = bytesToHex(unpadBytes(keyBytes))
    if (storageKeyTrimmed === '0x') {
      storageKeyTrimmed = '0x00'
    }
    const value = await vm.stateManager.getStorage(address, setLengthLeft(keyBytes, 32))
    if (value.length === 0) {
      delete alloc[addressString].storage[storageKeyTrimmed]
      // To be sure, also delete any keys which are left-padded to 32 bytes
      delete alloc[addressString].storage[key]
      continue
    }
    alloc[addressString].storage[storageKeyTrimmed] = bytesToHex(value)
  }
}

const outputAlloc = alloc

console.log('WRITE', outputAlloc)

const outputResultFilePath = join(args.output.basedir, args.output.result)
const outputAllocFilePath = join(args.output.basedir, args.output.alloc)

writeFileSync(outputResultFilePath, JSON.stringify(output))
writeFileSync(outputAllocFilePath, JSON.stringify(outputAlloc))
