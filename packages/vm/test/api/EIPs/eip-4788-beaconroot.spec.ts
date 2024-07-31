/**
 * EIP 4788 beaconroot specs
 *
 * Test cases:
 * - Beaconroot precompile call, timestamp matches
 * - Beaconroot precompile call, timestamp does not match
 * - Beaconroot precompile call, timestamp matches:
 *      - Input length > 32 bytes
 *      - Input length < 32 bytes (reverts)
 */

import { createBlock, createHeader } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { type TransactionType, type TxData, createTxFromTxData } from '@ethereumjs/tx'
import {
  bigIntToBytes,
  bytesToBigInt,
  createAddressFromString,
  hexToBytes,
  setLengthLeft,
  setLengthRight,
  zeros,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { VM, runBlock as runBlockVM } from '../../../src/index.js'

import type { Block } from '@ethereumjs/block'
import type { BigIntLike, PrefixedHexString } from '@ethereumjs/util'

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Cancun,
  eips: [4788],
})

const pkey = hexToBytes(`0x${'20'.repeat(32)}`)
const contractAddress = createAddressFromString('0x' + 'c0de'.repeat(10))

function beaconrootBlock(
  blockroot: bigint,
  timestamp: BigIntLike,
  transactions: Array<TxData[TransactionType]>,
) {
  const newTxData = []

  for (const txData of transactions) {
    const tx = createTxFromTxData({
      gasPrice: 7,
      gasLimit: 100000,
      ...txData,
      type: 0,
      to: contractAddress,
    })
    newTxData.push(tx.sign(pkey))
  }

  const root = setLengthLeft(bigIntToBytes(blockroot), 32)
  const header = createHeader(
    {
      parentBeaconBlockRoot: root,
      timestamp,
    },
    { common, freeze: false },
  )
  const block = createBlock(
    {
      header,
      transactions: newTxData,
    },
    {
      common,
      freeze: false,
    },
  )
  return block
}

/**
 * This code:
 * CALLDATACOPYs the calldata into memory
 * CALLS with this calldata into 0x0B (beaconroot precompile)
 * Stores the CALL-return field (either 0 or 1 depending if it reverts or not) at storage slot 0
 * Then it returns the data the precompile returns
 */

const BROOT_AddressString = '000F3df6D732807Ef1319fB7B8bB8522d0Beac02'
const CODE = ('0x365F5F375F5F365F5F' +
  // push broot contract address on stack
  '73' +
  BROOT_AddressString +
  // remaining contract
  '5AF15F553D5F5F3E3D5FF3') as PrefixedHexString
const BROOT_CODE =
  '0x3373fffffffffffffffffffffffffffffffffffffffe14604d57602036146024575f5ffd5b5f35801560495762001fff810690815414603c575f5ffd5b62001fff01545f5260205ff35b5f5ffd5b62001fff42064281555f359062001fff015500'
const BROOT_Address = createAddressFromString(`0x${BROOT_AddressString}`)

/**
 * Run a block inside a 4788 VM
 * @param block Block to run
 * @returns Two fields: block return status, and callStatus (field saved in the contract)
 */
async function runBlock(block: Block) {
  const vm = await VM.create({
    common,
  })

  await vm.stateManager.putCode(contractAddress, hexToBytes(CODE))
  await vm.stateManager.putCode(BROOT_Address, hexToBytes(BROOT_CODE))
  return {
    vmResult: await runBlockVM(vm, {
      block,
      skipBalance: true,
      skipBlockValidation: true,
      generate: true,
    }),
    callStatus: await getCallStatus(vm),
  }
}

/**
 * Get call status saved in the contract
 */
async function getCallStatus(vm: VM) {
  const stat = await vm.stateManager.getStorage(contractAddress, zeros(32))
  return bytesToBigInt(stat)
}

/**
 * Run block test
 * @param input
 */
async function runBlockTest(input: {
  timestamp: bigint // Timestamp as input to our contract which calls into the precompile
  timestampBlock: bigint // Timestamp of the block (this is saved in the precompile)
  blockRoot: bigint // Blockroot of the block (also saved in the precompile)
  extLeft?: number // Extend length left of the input (defaults to 32)
  extRight?: number // Extend lenght right of the input (defaults to 32) - happens after extendLeft
  expRet: bigint // Expected return value
  expCallStatus: bigint // Expected call status (either 0 or 1)
}) {
  const { timestamp, blockRoot, timestampBlock, expRet, expCallStatus } = input

  const data = setLengthRight(
    setLengthLeft(bigIntToBytes(timestamp), input.extLeft ?? 32),
    input.extRight ?? 32,
  )
  const block = beaconrootBlock(blockRoot, timestampBlock, [
    {
      data,
    },
  ])

  const ret = await runBlock(block)
  const bigIntReturn = bytesToBigInt(ret.vmResult.results[0].execResult.returnValue)
  assert.equal(bigIntReturn, expRet, 'blockRoot ok')
  assert.equal(ret.callStatus, expCallStatus, 'call status ok')
}

describe('should run beaconroot precompile correctly', async () => {
  it('should run precompile with known timestamp', async () => {
    await runBlockTest({
      timestamp: BigInt(12),
      timestampBlock: BigInt(12),
      blockRoot: BigInt(1),
      expRet: BigInt(1),
      expCallStatus: BigInt(1),
    })
  })
  it('should run precompile with unknown timestamp', async () => {
    await runBlockTest({
      timestamp: BigInt(12),
      timestampBlock: BigInt(11),
      blockRoot: BigInt(1),
      expRet: BigInt(0),
      expCallStatus: BigInt(0),
    })
  })
  it('should run precompile with known timestamp, input length > 32 bytes', async () => {
    await runBlockTest({
      timestamp: BigInt(12),
      timestampBlock: BigInt(12),
      blockRoot: BigInt(1),
      extLeft: 32,
      extRight: 320,
      expRet: BigInt(0),
      expCallStatus: BigInt(0),
    })
  })
  it('should run precompile with known timestamp, input length < 32 bytes', async () => {
    await runBlockTest({
      timestamp: BigInt(12),
      timestampBlock: BigInt(12),
      blockRoot: BigInt(1),
      extLeft: 31,
      extRight: 31,
      expRet: BigInt(0),
      expCallStatus: BigInt(0),
    })
  })
})
