import tape from 'tape'
import {
  Address,
  AddressLike,
  BN,
  BNLike,
  BufferLike,
  bufferToHex,
  toBuffer,
} from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { Transaction } from '../src'

// @returns: Array with subtypes of the AddressLike type for a given address
function generateAddressLikeValues(address: string): AddressLike[] {
  return [address, toBuffer(address), new Address(toBuffer(address))]
}

// @returns: Array with subtypes of the BNLike type for a given number
function generateBNLikeValues(value: number): BNLike[] {
  return [value, new BN(value), `0x${value.toString(16)}`, toBuffer(value)]
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
  gasLimit: generateBNLikeValues(100000),
  nonce: generateBNLikeValues(0),
  to: generateAddressLikeValues('0x0000000000000000000000000000000000000000'),
  r: generateBNLikeValues(100),
  s: generateBNLikeValues(100),
  value: generateBNLikeValues(10),
}

const legacyTxValues = {
  gasPrice: generateBNLikeValues(100),
}

const accessListEip2930TxValues = {
  chainId: generateBNLikeValues(4),
}

const eip1559TxValues = {
  maxFeePerGas: generateBNLikeValues(100),
  maxPriorityFeePerGas: generateBNLikeValues(50),
}

tape('[Transaction Input Values]', function (t) {
  t.test('Legacy Transaction Values', function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Homestead })
    const options = { ...baseTxValues, ...legacyTxValues, type: '0' }
    const legacyTxData = generateCombinations({
      options,
    })
    const expectedHash = Transaction.fromTxData(legacyTxData[0]).hash()
    const randomSample = getRandomSubarray(legacyTxData, 100)
    for (const txData of randomSample) {
      const tx = Transaction.fromTxData(txData, { common })
      const hash = tx.hash()
      st.deepEqual(hash, expectedHash, `correct tx hash (0x${bufferToHex(hash)})`)
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
    const expectedHash = Transaction.fromTxData(eip1559TxData[0]).hash()
    const randomSample = getRandomSubarray(eip1559TxData, 100)

    for (const txData of randomSample) {
      const tx = Transaction.fromTxData(txData, { common })
      const hash = tx.hash()

      st.deepEqual(hash, expectedHash, `correct tx hash (0x${bufferToHex(hash)})`)
    }
    st.end()
  })
})
