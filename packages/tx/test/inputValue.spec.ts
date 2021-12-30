import { Address, AddressLike, BN, BNLike, BufferLike } from 'ethereumjs-util'

// @returns: Array with all subtypes of the AddressLike type for a given address
function generateAddressLikeValues(address: string): AddressLike[] {
  return [
    new Address(Buffer.from(Buffer.from(address.slice(2), 'hex'))),
    Buffer.from(address.slice(2)),
    address,
  ]
}

// @returns: Array with all subtypes of the BNLike type for a given number
function generateBNLikeValues(value: number): BNLike[] {
  return [
    new BN(value),
    value,
    value.toString(),
    `0x${value.toString(16)}`,
    Buffer.from(value.toString(16), 'hex'),
  ]
}

// @returns: Array with all subtypes of the BufferLike type for a given string
function generateBufferLikeValues(value: string): BufferLike[] {
  return [Buffer.from(value.slice(2)), parseInt(value), new BN(value), value]
}

const baseTxValues = {
  data: [...generateBufferLikeValues('0x0'), ...generateBufferLikeValues('0x123abc')],
  gasLimit: generateBNLikeValues(100000),
  nonce: [...generateBNLikeValues(0), ...generateBNLikeValues(100)],
  to: generateAddressLikeValues('0xab5801a7d398351b8be11c439e05c5b3259aec9b'),
  v: generateBNLikeValues(100),
  r: generateBNLikeValues(100),
  s: generateBNLikeValues(100),
  type: [generateBNLikeValues(0), generateBNLikeValues(1), generateBNLikeValues(2)],
}

const legacyTxValues = {
  gasPrice: generateBNLikeValues(100),
}

// TODO: AccessList
const accessListEip2930TxValues = {
  chainId: generateBNLikeValues(1),
}

const eip1559TxValues = {
  maxFeePerGas: generateBNLikeValues(100),
  maxPriorityFeePerGas: generateBNLikeValues(50),
}
