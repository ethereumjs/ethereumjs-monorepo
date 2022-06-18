import * as tape from 'tape'
import { Address, AddressLike, BigIntLike, BufferLike, toBuffer } from '@ethereumjs/util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { Transaction } from '../src'

// @returns: Array with subtypes of the AddressLike type for a given address
function generateAddressLikeValues(address: string): AddressLike[] {
  return [address, toBuffer(address), new Address(toBuffer(address))]
}

// @returns: Array with subtypes of the BigIntLike type for a given number
function generateBigIntLikeValues(value: number): BigIntLike[] {
  return [value, BigInt(value), `0x${value.toString(16)}`, toBuffer(value)]
}

// @returns: Array with subtypes of the BufferLike type for a given string
function generateBufferLikeValues(value: string): BufferLike[] {
  return [value, toBuffer(value)]
}

interface GenerateCombinationsArgs {
  options: { [x: string]: any }
  optionIndex?: number
  results?: { [x: string]: any }[]
  current?: { [x: string]: any }
}

export function generateCombinations({
  options,
  optionIndex = 0,
  results = [],
  current = {},
}: GenerateCombinationsArgs) {
  const allKeys = Object.keys(options)
  const optionKey = allKeys[optionIndex]
  const values = options[optionKey]

  for (let i = 0; i < values.length; i++) {
    current[optionKey] = values[i]

    if (optionIndex + 1 < allKeys.length) {
      generateCombinations({ options, optionIndex: optionIndex + 1, results, current })
    } else {
      // Clone the object
      const res = { ...current }
      results.push(res)
    }
  }

  return results
}

// Deterministic pseudorandom number generator
function mulberry32(seed: number) {
  let t = (seed += 0x6d2b79f5)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function getRandomSubarray<TArrayItem>(array: TArrayItem[], size: number) {
  const shuffled = array.slice(0)
  let seed = 1559
  let index: number
  let length = array.length
  let temp: TArrayItem
  while (length > 0) {
    index = Math.floor((length + 1) * mulberry32(seed))
    temp = shuffled[index]
    shuffled[index] = shuffled[length]
    shuffled[length] = temp
    seed++
    length--
  }
  return shuffled.slice(0, size)
}

const baseTxValues = {
  data: generateBufferLikeValues('0x65'),
  gasLimit: generateBigIntLikeValues(100000),
  nonce: generateBigIntLikeValues(0),
  to: generateAddressLikeValues('0x0000000000000000000000000000000000000000'),
  r: generateBigIntLikeValues(100),
  s: generateBigIntLikeValues(100),
  value: generateBigIntLikeValues(10),
}

const legacyTxValues = {
  gasPrice: generateBigIntLikeValues(100),
}

const accessListEip2930TxValues = {
  chainId: generateBigIntLikeValues(4),
}

const eip1559TxValues = {
  maxFeePerGas: generateBigIntLikeValues(100),
  maxPriorityFeePerGas: generateBigIntLikeValues(50),
}

tape('[Transaction Input Values]', function (t) {
  t.test('Legacy Transaction Values', function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Homestead })
    const options = { ...baseTxValues, ...legacyTxValues, type: '0' }
    const legacyTxData = generateCombinations({
      options,
    })
    const randomSample = getRandomSubarray(legacyTxData, 100)
    for (const txData of randomSample) {
      const tx = Transaction.fromTxData(txData, { common })
      t.throws(() => tx.hash(), 'tx.hash() throws if tx is unsigned')
    }
    st.end()
  })

  t.test('EIP-1559 Transaction Values', function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
    const options = {
      ...baseTxValues,
      ...accessListEip2930TxValues,
      ...eip1559TxValues,
      type: '2',
    }
    const eip1559TxData = generateCombinations({
      options,
    })
    const randomSample = getRandomSubarray(eip1559TxData, 100)

    for (const txData of randomSample) {
      const tx = Transaction.fromTxData(txData, { common })
      t.throws(() => tx.hash(), 'tx.hash() should throw if unsigned')
    }
    st.end()
  })
})
