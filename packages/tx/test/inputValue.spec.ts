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

export function generateCombinations(
  options: { [x: string]: any },
  optionIndex = 0,
  results: { [x: string]: any }[] = [],
  current: { [x: string]: any } = {}
) {
  const allKeys = Object.keys(options)
  const optionKey = allKeys[optionIndex]

  const vals = options[optionKey]

  for (let i = 0; i < vals.length; i++) {
    current[optionKey] = vals[i]

    if (optionIndex + 1 < allKeys.length) {
      generateCombinations(options, optionIndex + 1, results, current)
    } else {
      results.push(current)
    }
  }

  return results
}

const baseTxValues = {
  data: generateBufferLikeValues('0x0'),
  gasLimit: generateBNLikeValues(100000),
  nonce: generateBNLikeValues(0),
  to: generateAddressLikeValues('0x0000000000000000000000000000000000000000'),
  v: generateBNLikeValues(100),
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
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Homestead })

  t.test('Legacy Transaction Values', function (st) {
    const legacyTxData = generateCombinations({ ...baseTxValues, ...legacyTxValues, type: '0' })
    const expectedHash = Transaction.fromTxData(legacyTxData[0]).hash
    for (const txData of legacyTxData) {
      const tx = Transaction.fromTxData(txData, { common })

      st.deepEqual(tx.hash, expectedHash), 'correct tx hash'
    }
    st.end()
  })

  t.test('EIP-1559 Transaction Values', function (st) {
    const eip1559TxData = generateCombinations({
      ...baseTxValues,
      ...accessListEip2930TxValues,
      ...eip1559TxValues,
      type: '2',
    })
    // console.log(legacyTxData)
    const expectedHash = Transaction.fromTxData(eip1559TxData[0]).hash
    for (const txData of eip1559TxData) {
      const tx = Transaction.fromTxData(txData, { common })

      st.deepEqual(tx.hash, expectedHash), 'correct tx hash'
    }
    st.end()
  })
})
