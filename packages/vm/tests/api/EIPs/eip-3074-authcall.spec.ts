import tape from 'tape'
import {
  Address,
  BN,
  ecsign,
  keccak256,
  privateToAddress,
  setLengthLeft,
  zeros,
} from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../../src'
import { Transaction } from '@ethereumjs/tx'
import { Block } from '@ethereumjs/block'
import { ERROR } from '../../../src/exceptions'

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.London,
  eips: [3074],
})

// setup the accounts for this test
const privateKey = Buffer.from(
  'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
  'hex'
)

const block = Block.fromBlockData(
  {
    header: {
      baseFeePerGas: new BN(7),
    },
  },
  { common }
)

const callerPrivateKey = Buffer.from('44'.repeat(32), 'hex')
const callerAddress = new Address(privateToAddress(callerPrivateKey))

const address = new Address(privateToAddress(privateKey))
const contractAddress = new Address(Buffer.from('ff'.repeat(20), 'hex'))
const contractStorageAddress = new Address(Buffer.from('ee'.repeat(20), 'hex'))

function signMessage(commitUnpadded: Buffer, address: Address, privateKey: Buffer) {
  const commit = setLengthLeft(commitUnpadded, 32)
  const paddedInvokerAddress = setLengthLeft(address.buf, 32)
  const chainId = setLengthLeft(common.chainIdBN().toBuffer(), 32)
  const message = Buffer.concat([Buffer.from('03', 'hex'), chainId, paddedInvokerAddress, commit])
  const msgHash = keccak256(message)
  return ecsign(msgHash, privateKey, 0)
}

function getAuthCode(commitUnpadded: Buffer, signature: any) {
  const commit = setLengthLeft(commitUnpadded, 32)
  let v
  if (signature.v == 27) {
    v = setLengthLeft(new BN(0).toBuffer(), 32)
  } else if (signature.v == 28) {
    v = setLengthLeft(new BN(1).toBuffer(), 32)
  } else {
    setLengthLeft(new BN(signature.v).toBuffer(), 32)
  }

  const PUSH32 = Buffer.from('7F', 'hex')
  const AUTH = Buffer.from('F6', 'hex')
  return Buffer.concat([PUSH32, signature.s, PUSH32, signature.r, PUSH32, v, PUSH32, commit, AUTH])
}

type AuthcallData = {
  gasLimit?: BN
  address: Address
  value?: BN
  valueExt?: BN
  argsOffset?: BN
  argsLength?: BN
  retOffset?: BN
  retLength?: BN
}

function getAuthCallCode(data: AuthcallData) {
  const ZEROS32 = zeros(32)
  const gasLimitBuffer = setLengthLeft(data.gasLimit ? data.gasLimit.toBuffer() : ZEROS32, 32)
  const addressBuffer = setLengthLeft(data.address.buf, 32)
  const valueBuffer = setLengthLeft(data.value ? data.value.toBuffer() : ZEROS32, 32)
  const valueExtBuffer = setLengthLeft(data.valueExt ? data.valueExt.toBuffer() : ZEROS32, 32)
  const argsOffsetBuffer = setLengthLeft(data.argsOffset ? data.argsOffset.toBuffer() : ZEROS32, 32)
  const argsLengthBuffer = setLengthLeft(data.argsLength ? data.argsLength.toBuffer() : ZEROS32, 32)
  const retOffsetBuffer = setLengthLeft(data.retOffset ? data.retOffset.toBuffer() : ZEROS32, 32)
  const retLengthBuffer = setLengthLeft(data.retLength ? data.retLength.toBuffer() : ZEROS32, 32)
  const PUSH32 = Buffer.from('7f', 'hex')
  const AUTHCALL = Buffer.from('f7', 'hex')
  const order = [
    retLengthBuffer,
    retOffsetBuffer,
    argsLengthBuffer,
    argsOffsetBuffer,
    valueExtBuffer,
    valueBuffer,
    addressBuffer,
    gasLimitBuffer,
  ]
  const bufferList = []
  order.map((e: Buffer) => {
    bufferList.push(PUSH32)
    bufferList.push(e)
  })
  bufferList.push(AUTHCALL)
  return Buffer.concat(bufferList)
}

// Bytecode to exit call frame and return the topmost stack item
const RETURNTOP = Buffer.from('60005260206000F3', 'hex')
// Bytecode to store CALLER in slot 0
const STORECALLER = Buffer.from('3360005500', 'hex')

// This flips the signature: the result is a signature which has the same public key upon key recovery,
// But the s-value is now > N_DIV_2
function flipSignature(signature: any) {
  const s = new BN(signature.s)
  const flipped = new BN(
    Buffer.from('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 'hex')
  ).isub(s)
  if (signature.v == 27) {
    signature.v = 28
  } else {
    signature.v = 27
  }
  signature.s = setLengthLeft(flipped.toBuffer(), 32)
  return signature
}

tape('EIP-3074 AUTHCALL', (t) => {
  t.test('Should execute AUTH correctly', async (st) => {
    const vm = new VM({ common })
    const message = Buffer.from('01', 'hex')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = Buffer.concat([getAuthCode(message, signature), RETURNTOP])

    await vm.stateManager.putContractCode(contractAddress, code)
    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 100000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const account = await vm.stateManager.getAccount(callerAddress)
    account.balance = new BN(1000000)
    await vm.stateManager.putAccount(callerAddress, account)

    const result = await vm.runTx({ tx, block })
    const buf = result.execResult.returnValue.slice(12)
    st.ok(buf.equals(address.buf), 'auth returned right address')
  })
  t.test('Should not set AUTH if signature is invalid', async (st) => {
    const vm = new VM({ common })
    const message = Buffer.from('01', 'hex')
    const signature = signMessage(message, contractAddress, privateKey)
    signature.r = signature.s
    const code = Buffer.concat([getAuthCode(message, signature), RETURNTOP])

    await vm.stateManager.putContractCode(contractAddress, code)
    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 100000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const account = await vm.stateManager.getAccount(callerAddress)
    account.balance = new BN(1000000)
    await vm.stateManager.putAccount(callerAddress, account)

    const result = await vm.runTx({ tx, block })
    const buf = result.execResult.returnValue
    st.ok(buf.equals(zeros(32)), 'auth puts 0 on stack on invalid signature')
  })

  t.test('Should throw if signature s > N_DIV_2', async (st) => {
    const vm = new VM({ common })
    const message = Buffer.from('01', 'hex')
    const signature = flipSignature(signMessage(message, contractAddress, privateKey))
    const code = Buffer.concat([getAuthCode(message, signature), RETURNTOP])

    await vm.stateManager.putContractCode(contractAddress, code)
    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 100000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const account = await vm.stateManager.getAccount(callerAddress)
    account.balance = new BN(1000000)
    await vm.stateManager.putAccount(callerAddress, account)

    const result = await vm.runTx({ tx, block })
    st.ok(result.execResult.exceptionError?.error === ERROR.AUTH_INVALID_S, 'threw correct error')
  })

  t.test('Should be able to call AUTH mutliple times', async (st) => {
    const vm = new VM({ common })
    const message = Buffer.from('01', 'hex')
    const signature = signMessage(message, contractAddress, privateKey)
    const signature2 = signMessage(message, contractAddress, callerPrivateKey)
    const code = Buffer.concat([
      getAuthCode(message, signature),
      getAuthCode(message, signature2),
      RETURNTOP,
    ])

    await vm.stateManager.putContractCode(contractAddress, code)
    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 100000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const account = await vm.stateManager.getAccount(callerAddress)
    account.balance = new BN(1000000)
    await vm.stateManager.putAccount(callerAddress, account)

    const result = await vm.runTx({ tx, block })
    const buf = result.execResult.returnValue.slice(12)
    st.ok(buf.equals(callerAddress.buf), 'auth returned right address')
  })
})

/*
  Test cases AUTHCALL
  AUTH not set
  AUTH, INVALID AUTH, AUTHCALL
  AUTH AUTHCALL
  AUTH AUTH AUTHCALL
  AUTH AUTHCALL AUTHCALL
  Not enough gas
  Gas param set to 0
  Verify AUTHCALL sets the right CALLER values when executing contract
  Gas costs
  -> cold address
  -> nonzero transfer
  -> create account
  Check returnvalues / input values
  Check value is deducted from current contract, not the AUTH account
*/

tape('EIP-3074 AUTHCALL', (t) => {
  t.test('Should execute AUTH correctly', async (st) => {
    const vm = new VM({ common })
    const message = Buffer.from('01', 'hex')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = Buffer.concat([
      getAuthCode(message, signature),
      getAuthCallCode({
        address: contractStorageAddress,
      }),
      RETURNTOP,
    ])

    await vm.stateManager.putContractCode(contractAddress, code)
    await vm.stateManager.putContractCode(contractStorageAddress, STORECALLER)
    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 100000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const account = await vm.stateManager.getAccount(callerAddress)
    account.balance = new BN(1000000)
    await vm.stateManager.putAccount(callerAddress, account)

    const result = await vm.runTx({ tx, block })
    const buf = result.execResult.returnValue.slice(31)
    st.ok(buf.equals(Buffer.from('01', 'hex')), 'authcall success')

    const storage = await vm.stateManager.getContractStorage(contractStorageAddress, zeros(32))
    st.ok(storage.equals(address.buf), 'caller set correctly')
  })
})
