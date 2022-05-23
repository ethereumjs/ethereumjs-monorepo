import tape from 'tape'
import { keccak256 } from 'ethereum-cryptography/keccak'
import {
  Address,
  bigIntToBuffer,
  bufferToBigInt,
  ecsign,
  privateToAddress,
  setLengthLeft,
  toBuffer,
  zeros,
} from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../../src'
import { Transaction } from '@ethereumjs/tx'
import { Block } from '@ethereumjs/block'
import { ERROR } from '../../../src/exceptions'
import { InterpreterStep } from '../../../src/evm/interpreter'

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
      baseFeePerGas: BigInt(7),
    },
  },
  { common }
)

const callerPrivateKey = Buffer.from('44'.repeat(32), 'hex')
const callerAddress = new Address(privateToAddress(callerPrivateKey))
const PREBALANCE = BigInt(10000000)

const address = new Address(privateToAddress(privateKey))
const contractAddress = new Address(Buffer.from('ff'.repeat(20), 'hex'))
const contractStorageAddress = new Address(Buffer.from('ee'.repeat(20), 'hex'))

// Bytecode to exit call frame and return the topmost stack item
const RETURNTOP = Buffer.from('60005260206000F3', 'hex')
// Bytecode to store CALLER in slot 0 and GAS in slot 1 and the first 32 bytes of the input in slot 2
// Returns the entire input as output
const STORECALLER = Buffer.from('5A60015533600055600035600255366000600037366000F3', 'hex')

/**
 * This signs a message to be used for AUTH opcodes
 * @param commitUnpadded - The commit which we want to sign
 * @param address - The contract address we are using AUTH on
 * @param privateKey - The private key of the account to sign
 * @returns The signed message
 */
function signMessage(commitUnpadded: Buffer, address: Address, privateKey: Buffer) {
  const commit = setLengthLeft(commitUnpadded, 32)
  const paddedInvokerAddress = setLengthLeft(address.buf, 32)
  const chainId = setLengthLeft(bigIntToBuffer(common.chainId()), 32)
  const message = Buffer.concat([Buffer.from('03', 'hex'), chainId, paddedInvokerAddress, commit])
  const msgHash = Buffer.from(keccak256(message))
  return ecsign(msgHash, privateKey, 0)
}

/**
 * This method returns the bytecode in order to set AUTH
 * @param commitUnpadded - The commit
 * @param signature - The signature as obtained by `signMessage`
 */
function getAuthCode(commitUnpadded: Buffer, signature: any) {
  const commit = setLengthLeft(commitUnpadded, 32)
  let v
  if (signature.v == 27) {
    v = setLengthLeft(Buffer.from('00', 'hex'), 32)
  } else if (signature.v == 28) {
    v = setLengthLeft(Buffer.from('01', 'hex'), 32)
  } else {
    setLengthLeft(toBuffer(signature.v), 32)
  }

  const PUSH32 = Buffer.from('7F', 'hex')
  const AUTH = Buffer.from('F6', 'hex')
  // This bytecode setups the stack to be used for AUTH
  return Buffer.concat([PUSH32, signature.s, PUSH32, signature.r, PUSH32, v, PUSH32, commit, AUTH])
}

// This type has all arguments to be used on AUTHCALL
type AuthcallData = {
  gasLimit?: bigint
  address: Address
  value?: bigint
  valueExt?: bigint
  argsOffset?: bigint
  argsLength?: bigint
  retOffset?: bigint
  retLength?: bigint
}

/**
 * Returns the bytecode to store a `value` at memory slot `position`
 * @param position
 * @param value
 */
function MSTORE(position: Buffer, value: Buffer) {
  return Buffer.concat([
    Buffer.from('7F', 'hex'),
    setLengthLeft(value, 32),
    Buffer.from('7F', 'hex'),
    setLengthLeft(position, 32),
    Buffer.from('52', 'hex'),
  ])
}

/**
 * This method returns the bytecode to invoke AUTHCALL with the desired data
 * @param data - The data to be use for AUTHCALL, anything not present will be zeroed out
 * @returns - The bytecode to execute AUTHCALL
 */
function getAuthCallCode(data: AuthcallData) {
  const ZEROS32 = zeros(32)
  const gasLimitBuffer = setLengthLeft(data.gasLimit ? bigIntToBuffer(data.gasLimit) : ZEROS32, 32)
  const addressBuffer = setLengthLeft(data.address.buf, 32)
  const valueBuffer = setLengthLeft(data.value ? bigIntToBuffer(data.value) : ZEROS32, 32)
  const valueExtBuffer = setLengthLeft(data.valueExt ? bigIntToBuffer(data.valueExt) : ZEROS32, 32)
  const argsOffsetBuffer = setLengthLeft(
    data.argsOffset ? bigIntToBuffer(data.argsOffset) : ZEROS32,
    32
  )
  const argsLengthBuffer = setLengthLeft(
    data.argsLength ? bigIntToBuffer(data.argsLength) : ZEROS32,
    32
  )
  const retOffsetBuffer = setLengthLeft(
    data.retOffset ? bigIntToBuffer(data.retOffset) : ZEROS32,
    32
  )
  const retLengthBuffer = setLengthLeft(
    data.retLength ? bigIntToBuffer(data.retLength) : ZEROS32,
    32
  )
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

// This flips the signature: the result is a signature which has the same public key upon key recovery,
// But the s-value is now > N_DIV_2
function flipSignature(signature: any) {
  const s = bufferToBigInt(signature.s)
  const flipped = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n - s

  if (signature.v == 27) {
    signature.v = 28
  } else {
    signature.v = 27
  }
  signature.s = setLengthLeft(bigIntToBuffer(flipped), 32)
  return signature
}

tape('EIP-3074 AUTH', (t) => {
  t.test('Should execute AUTH correctly', async (st) => {
    const vm = await VM.create({ common })
    const message = Buffer.from('01', 'hex')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = Buffer.concat([getAuthCode(message, signature), RETURNTOP])

    await vm.stateManager.putContractCode(contractAddress, code)
    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const account = await vm.stateManager.getAccount(callerAddress)
    account.balance = BigInt(10000000)
    await vm.stateManager.putAccount(callerAddress, account)

    const result = await vm.runTx({ tx, block })
    const buf = result.execResult.returnValue.slice(12)
    st.ok(buf.equals(address.buf), 'auth returned right address')
  })
  t.test('Should not set AUTH if signature is invalid', async (st) => {
    const vm = await VM.create({ common })
    const message = Buffer.from('01', 'hex')
    const signature = signMessage(message, contractAddress, privateKey)
    signature.r = signature.s
    const code = Buffer.concat([getAuthCode(message, signature), RETURNTOP])

    await vm.stateManager.putContractCode(contractAddress, code)
    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const account = await vm.stateManager.getAccount(callerAddress)
    account.balance = BigInt(10000000)
    await vm.stateManager.putAccount(callerAddress, account)

    const result = await vm.runTx({ tx, block })
    const buf = result.execResult.returnValue
    st.ok(buf.equals(zeros(32)), 'auth puts 0 on stack on invalid signature')
  })

  t.test('Should throw if signature s > N_DIV_2', async (st) => {
    const vm = await VM.create({ common })
    const message = Buffer.from('01', 'hex')
    const signature = flipSignature(signMessage(message, contractAddress, privateKey))
    const code = Buffer.concat([getAuthCode(message, signature), RETURNTOP])

    await vm.stateManager.putContractCode(contractAddress, code)
    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const account = await vm.stateManager.getAccount(callerAddress)
    account.balance = BigInt(10000000)
    await vm.stateManager.putAccount(callerAddress, account)

    const result = await vm.runTx({ tx, block })
    st.equal(result.execResult.exceptionError?.error, ERROR.AUTH_INVALID_S, 'threw correct error')
  })

  t.test('Should be able to call AUTH mutliple times', async (st) => {
    const vm = await VM.create({ common })
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
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const account = await vm.stateManager.getAccount(callerAddress)
    account.balance = BigInt(10000000)
    await vm.stateManager.putAccount(callerAddress, account)

    const result = await vm.runTx({ tx, block })
    const buf = result.execResult.returnValue.slice(12)
    st.ok(buf.equals(callerAddress.buf), 'auth returned right address')
  })
})

// Setups the environment for the VM, puts `code` at contractAddress and also puts the STORECALLER bytecode at the contractStorageAddress
async function setupVM(code: Buffer) {
  const vm = await VM.create({ common })
  await vm.stateManager.putContractCode(contractAddress, code)
  await vm.stateManager.putContractCode(contractStorageAddress, STORECALLER)
  const account = await vm.stateManager.getAccount(callerAddress)
  account.balance = PREBALANCE
  await vm.stateManager.modifyAccountFields(callerAddress, { balance: PREBALANCE })
  return vm
}

tape('EIP-3074 AUTHCALL', (t) => {
  t.test('Should execute AUTHCALL correctly', async (st) => {
    const message = Buffer.from('01', 'hex')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = Buffer.concat([
      getAuthCode(message, signature),
      getAuthCallCode({
        address: contractStorageAddress,
      }),
      RETURNTOP,
    ])
    const vm = await setupVM(code)

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const result = await vm.runTx({ tx, block })

    const buf = result.execResult.returnValue.slice(31)
    st.ok(buf.equals(Buffer.from('01', 'hex')), 'authcall success')

    const storage = await vm.stateManager.getContractStorage(contractStorageAddress, zeros(32))
    st.ok(storage.equals(address.buf), 'caller set correctly')
  })

  t.test('Should forward max call gas when gas set to 0', async (st) => {
    const message = Buffer.from('01', 'hex')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = Buffer.concat([
      getAuthCode(message, signature),
      getAuthCallCode({
        address: contractStorageAddress,
      }),
      RETURNTOP,
    ])
    const vm = await setupVM(code)

    let gas: bigint

    vm.evm.on('step', (e: InterpreterStep) => {
      if (e.opcode.name === 'AUTHCALL') {
        gas = e.gasLeft
      }
    })

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    await vm.runTx({ tx, block })

    const gasUsed = await vm.stateManager.getContractStorage(
      contractStorageAddress,
      Buffer.from('00'.repeat(31) + '01', 'hex')
    )
    const gasBigInt = bufferToBigInt(gasUsed)
    const preGas =
      gas! -
      common.param('gasPrices', 'warmstorageread')! -
      common.param('gasPrices', 'coldaccountaccess')!
    const expected = preGas - preGas / 64n - 2n
    st.equal(gasBigInt, expected, 'forwarded max call gas')
  })

  t.test('Should forward max call gas when gas set to 0 - warm account', async (st) => {
    const message = Buffer.from('01', 'hex')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = Buffer.concat([
      getAuthCode(message, signature),
      getAuthCallCode({
        address: contractStorageAddress,
      }),
      getAuthCallCode({
        address: contractStorageAddress,
      }),
      RETURNTOP,
    ])
    const vm = await setupVM(code)

    let gas: bigint

    vm.evm.on('step', async (e: InterpreterStep) => {
      if (e.opcode.name === 'AUTHCALL') {
        gas = e.gasLeft // This thus overrides the first time AUTHCALL is used and thus the gas for the second call is stored
      }
    })

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    await vm.runTx({ tx, block })

    const gasUsed = await vm.stateManager.getContractStorage(
      contractStorageAddress,
      Buffer.from('00'.repeat(31) + '01', 'hex')
    )
    const gasBigInt = bufferToBigInt(gasUsed)
    const preGas = gas! - common.param('gasPrices', 'warmstorageread')!
    const expected = preGas - preGas / 64n - 2n
    st.equal(gasBigInt, expected, 'forwarded max call gas')
  })

  t.test(
    'Should forward max call gas when gas set to 0 - cold account, nonzero transfer, create new account',
    async (st) => {
      const message = Buffer.from('01', 'hex')
      const signature = signMessage(message, contractAddress, privateKey)
      const code = Buffer.concat([
        getAuthCode(message, signature),
        getAuthCallCode({
          address: new Address(Buffer.from('cc'.repeat(20), 'hex')),
          value: 1n,
        }),
        RETURNTOP,
      ])
      const vm = await setupVM(code)

      let gas: bigint
      let gasAfterCall: bigint

      vm.evm.on('step', async (e: InterpreterStep) => {
        if (gas && gasAfterCall === undefined) {
          gasAfterCall = e.gasLeft
        }
        if (e.opcode.name === 'AUTHCALL') {
          gas = e.gasLeft
        }
      })

      const tx = Transaction.fromTxData({
        to: contractAddress,
        gasLimit: 900000,
        gasPrice: 10,
        value: 1,
      }).sign(callerPrivateKey)

      await vm.runTx({ tx, block })

      const gasBigInt = gas! - gasAfterCall!
      const expected =
        common.param('gasPrices', 'coldaccountaccess')! +
        common.param('gasPrices', 'warmstorageread')! +
        common.param('gasPrices', 'callNewAccount')! +
        common.param('gasPrices', 'authcallValueTransfer')!

      st.equal(gasBigInt, expected, 'forwarded max call gas')
    }
  )

  t.test(
    'Should charge value transfer gas when transferring and transfer from contract, not authcall address',
    async (st) => {
      const message = Buffer.from('01', 'hex')
      const signature = signMessage(message, contractAddress, privateKey)
      const code = Buffer.concat([
        getAuthCode(message, signature),
        getAuthCallCode({
          address: contractStorageAddress,
          value: 1n,
        }),
        RETURNTOP,
      ])
      const vm = await setupVM(code)

      let gas: bigint

      vm.evm.on('step', (e: InterpreterStep) => {
        if (e.opcode.name === 'AUTHCALL') {
          gas = e.gasLeft
        }
      })

      const value = 3n
      const gasPrice = 10n

      const tx = Transaction.fromTxData({
        to: contractAddress,
        gasLimit: PREBALANCE / gasPrice - value * gasPrice,
        gasPrice,
        value,
      }).sign(callerPrivateKey)

      const result = await vm.runTx({ tx, block })

      const gasUsed = await vm.stateManager.getContractStorage(
        contractStorageAddress,
        Buffer.from('00'.repeat(31) + '01', 'hex')
      )
      const gasBigInt = bufferToBigInt(gasUsed)
      const preGas =
        gas! -
        common.param('gasPrices', 'warmstorageread')! -
        common.param('gasPrices', 'authcallValueTransfer')! -
        common.param('gasPrices', 'coldaccountaccess')!
      const expected = preGas - preGas / 64n - 2n
      st.equal(gasBigInt, expected, 'forwarded max call gas')

      const expectedBalance = PREBALANCE - result.amountSpent - value
      const account = await vm.stateManager.getAccount(callerAddress)

      st.equal(account.balance, expectedBalance, 'caller balance ok')

      const contractAccount = await vm.stateManager.getAccount(contractAddress)
      st.equal(contractAccount.balance, 2n, 'contract balance ok')

      const contractStorageAccount = await vm.stateManager.getAccount(contractStorageAddress)
      st.equal(contractStorageAccount.balance, 1n, 'storage balance ok')
    }
  )

  t.test('Should throw if AUTH not set', async (st) => {
    const code = Buffer.concat([
      getAuthCallCode({
        address: contractStorageAddress,
      }),
      RETURNTOP,
    ])
    const vm = await setupVM(code)

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const result = await vm.runTx({ tx, block })
    st.equal(
      result.execResult.exceptionError?.error,
      ERROR.AUTHCALL_UNSET,
      'threw with right error'
    )
    st.equal(result.amountSpent, tx.gasPrice * tx.gasLimit, 'spent all gas')
  })

  t.test('Should unset AUTH in case of invalid signature', async (st) => {
    const message = Buffer.from('01', 'hex')
    const signature = signMessage(message, contractAddress, privateKey)
    const signature2 = {
      v: signature.v,
      r: signature.s,
      s: signature.s,
    }
    const code = Buffer.concat([
      getAuthCode(message, signature),
      getAuthCallCode({
        address: contractStorageAddress,
      }),
      getAuthCode(message, signature2),
      getAuthCallCode({
        address: contractStorageAddress,
      }),
      RETURNTOP,
    ])
    const vm = await setupVM(code)

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const result = await vm.runTx({ tx, block })
    st.equal(
      result.execResult.exceptionError?.error,
      ERROR.AUTHCALL_UNSET,
      'threw with right error'
    )
    st.equal(result.amountSpent, tx.gasPrice * tx.gasLimit, 'spent all gas')
  })

  t.test('Should throw if not enough gas is available', async (st) => {
    const message = Buffer.from('01', 'hex')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = Buffer.concat([
      getAuthCode(message, signature),
      getAuthCallCode({
        address: contractStorageAddress,
        gasLimit: 10000000n,
      }),
      RETURNTOP,
    ])
    const vm = await setupVM(code)

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const result = await vm.runTx({ tx, block })
    st.equal(result.amountSpent, tx.gasLimit * tx.gasPrice, 'spent all gas')
    st.equal(result.execResult.exceptionError?.error, ERROR.OUT_OF_GAS, 'correct error type')
  })

  t.test('Should throw if valueExt is nonzero', async (st) => {
    const message = Buffer.from('01', 'hex')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = Buffer.concat([
      getAuthCode(message, signature),
      getAuthCallCode({
        address: contractStorageAddress,
        valueExt: 1n,
      }),
      RETURNTOP,
    ])
    const vm = await setupVM(code)

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const result = await vm.runTx({ tx, block })
    st.equal(result.amountSpent, tx.gasLimit * tx.gasPrice, 'spent all gas')
    st.equal(
      result.execResult.exceptionError?.error,
      ERROR.AUTHCALL_NONZERO_VALUEEXT,
      'correct error type'
    )
  })

  t.test('Should forward the right amount of gas', async (st) => {
    const message = Buffer.from('01', 'hex')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = Buffer.concat([
      getAuthCode(message, signature),
      getAuthCallCode({
        address: contractStorageAddress,
        gasLimit: 700000n,
      }),
      RETURNTOP,
    ])
    const vm = await setupVM(code)

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    await vm.runTx({ tx, block })
    const gas = await vm.stateManager.getContractStorage(
      contractStorageAddress,
      Buffer.from('00'.repeat(31) + '01', 'hex')
    )
    const gasBigInt = bufferToBigInt(gas)
    st.equals(gasBigInt, BigInt(700000 - 2), 'forwarded the right amount of gas') // The 2 is subtracted due to the GAS opcode base fee
  })

  t.test('Should set input and output correctly', async (st) => {
    const message = Buffer.from('01', 'hex')
    const signature = signMessage(message, contractAddress, privateKey)
    const input = Buffer.from('aa'.repeat(32), 'hex')
    const code = Buffer.concat([
      getAuthCode(message, signature),
      MSTORE(Buffer.from('20', 'hex'), input),
      getAuthCallCode({
        address: contractStorageAddress,
        argsOffset: 32n,
        argsLength: 32n,
        retOffset: 64n,
        retLength: 32n,
      }),
      Buffer.from('60206040F3', 'hex'), // PUSH 32 PUSH 64 RETURN -> This returns the 32 bytes at memory position 64
    ])
    const vm = await setupVM(code)

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const result = await vm.runTx({ tx, block })
    const callInput = await vm.stateManager.getContractStorage(
      contractStorageAddress,
      Buffer.from('00'.repeat(31) + '02', 'hex')
    )
    st.ok(callInput.equals(input), 'authcall input ok')
    st.ok(result.execResult.returnValue.equals(input), 'authcall output ok')
  })
})
