import tape from 'tape'
import { Address, AddressLike, BN, BNLike, BufferLike, toBuffer } from 'ethereumjs-util'
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
      results.push(current)
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

function getRandomSubarray(array: any[], size: number) {
  const shuffled = array.slice(0),
    seed = 1559
  let index: number,
    i = array.length,
    temp: any[]
  while (i--) {
    index = Math.floor((i + 1) * mulberry32(seed))
    temp = shuffled[index]
    shuffled[index] = shuffled[i]
    shuffled[i] = temp
  }
  return shuffled.slice(0, size)
}

const baseTxValues = {
  data: generateBufferLikeValues('0x12345abcd'),
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

// TODO: AccessList
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
    const legacyTxData = generateCombinations({
      options: { ...baseTxValues, ...legacyTxValues, type: '0' },
    })
    const expectedHash = Transaction.fromTxData(legacyTxData[0]).hash()
    const randomSample = getRandomSubarray(legacyTxData, 1000)
    for (const txData of randomSample) {
      const tx = Transaction.fromTxData(txData, { common })

      st.deepEqual(tx.hash(), expectedHash), 'correct tx hash'
    }
    st.end()
  })

  t.test('EIP-1559 Transaction Values', function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
    const eip1559TxData = generateCombinations({
      options: {
        ...baseTxValues,
        ...accessListEip2930TxValues,
        ...eip1559TxValues,
        type: '2',
      },
    })
    const expectedHash = Transaction.fromTxData(eip1559TxData[0]).hash()
    const randomSample = getRandomSubarray(eip1559TxData, 1000)

    for (const txData of randomSample) {
      const tx = Transaction.fromTxData(txData, { common })

      st.deepEqual(tx.hash(), expectedHash), 'correct tx hash'
    }
    st.end()
  })
})
