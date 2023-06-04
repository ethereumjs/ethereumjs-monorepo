import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { EVMErrorMessage } from '@ethereumjs/evm'
import { Transaction } from '@ethereumjs/tx'
import {
  Account,
  Address,
  bigIntToBytes,
  bytesToBigInt,
  concatBytesNoTypeCheck,
  ecsign,
  privateToAddress,
  setLengthLeft,
  toBytes,
  zeros,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { VM } from '../../../src/vm'

import type { InterpreterStep } from '@ethereumjs/evm'
import type { ECDSASignature } from '@ethereumjs/util'

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.London,
  eips: [3074],
})

// setup the accounts for this test
const privateKey = hexToBytes('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109')
const authAddress = new Address(privateToAddress(privateKey))

const block = Block.fromBlockData(
  {
    header: {
      baseFeePerGas: BigInt(7),
    },
  },
  { common }
)

const callerPrivateKey = hexToBytes('44'.repeat(32))
const callerAddress = new Address(privateToAddress(callerPrivateKey))
const PREBALANCE = BigInt(10000000)

const address = new Address(privateToAddress(privateKey))
const contractAddress = new Address(hexToBytes('ff'.repeat(20)))
const contractStorageAddress = new Address(hexToBytes('ee'.repeat(20)))

// Bytecode to exit call frame and return the topmost stack item
const RETURNTOP = hexToBytes('60005260206000F3')
//Bytecode to exit call frame and return the current memory size
const RETURNMEMSIZE = hexToBytes('5960005260206000F3')
// Bytecode to store CALLER in slot 0 and GAS in slot 1 and the first 32 bytes of the input in slot 2
// Returns the entire input as output
const STORECALLER = hexToBytes('5A60015533600055600035600255366000600037366000F3')

/**
 * This signs a message to be used for AUTH opcodes
 * @param commitUnpadded - The commit which we want to sign
 * @param address - The contract address we are using AUTH on
 * @param privateKey - The private key of the account to sign
 * @returns The signed message
 */
function signMessage(commitUnpadded: Uint8Array, address: Address, privateKey: Uint8Array) {
  const commit = setLengthLeft(commitUnpadded, 32)
  const paddedInvokerAddress = setLengthLeft(address.bytes, 32)
  const chainId = setLengthLeft(bigIntToBytes(common.chainId()), 32)
  const message = concatBytesNoTypeCheck(hexToBytes('03'), chainId, paddedInvokerAddress, commit)
  const msgHash = keccak256(message)
  return ecsign(msgHash, privateKey)
}

/**
 * This method returns the bytecode in order to set AUTH
 * @param commitUnpadded - The commit
 * @param signature - The signature as obtained by `signMessage`
 * @param address - The address which signed the commit
 * @param msizeBytes - Optional: memory size buffUint8Arrayer, defaults to `0x80` (128 bytes)
 */
function getAuthCode(
  commitUnpadded: Uint8Array,
  signature: ECDSASignature,
  address: Address,
  msizeBuffer?: Uint8Array
) {
  const commit = setLengthLeft(commitUnpadded, 32)
  let v: Uint8Array
  if (signature.v === BigInt(27)) {
    v = setLengthLeft(hexToBytes('00'), 32)
  } else if (signature.v === BigInt(28)) {
    v = setLengthLeft(hexToBytes('01'), 32)
  } else {
    v = setLengthLeft(toBytes(signature.v), 32)
  }

  const PUSH32 = hexToBytes('7F')
  const AUTH = hexToBytes('F6')
  const MSTORE = hexToBytes('52')
  const mslot0 = zeros(32)
  const mslot1 = concatBytesNoTypeCheck(zeros(31), hexToBytes('20'))
  const mslot2 = concatBytesNoTypeCheck(zeros(31), hexToBytes('40'))
  const mslot3 = concatBytesNoTypeCheck(zeros(31), hexToBytes('60'))
  const addressBuffer = setLengthLeft(address.bytes, 32)
  // This bytecode setups the stack to be used for AUTH
  return concatBytesNoTypeCheck(
    PUSH32,
    signature.s,
    PUSH32,
    mslot2,
    MSTORE,
    PUSH32,
    signature.r,
    PUSH32,
    mslot1,
    MSTORE,
    PUSH32,
    v,
    PUSH32,
    mslot0,
    MSTORE,
    PUSH32,
    commit,
    PUSH32,
    mslot3,
    MSTORE,
    hexToBytes('60'),
    msizeBuffer ?? hexToBytes('80'),
    hexToBytes('6000'),
    PUSH32,
    addressBuffer,
    AUTH
  )
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
function MSTORE(position: Uint8Array, value: Uint8Array) {
  return concatBytesNoTypeCheck(
    hexToBytes('7F'),
    setLengthLeft(value, 32),
    hexToBytes('7F'),
    setLengthLeft(position, 32),
    hexToBytes('52')
  )
}

/**
 * This method returns the bytecode to invoke AUTHCALL with the desired data
 * @param data - The data to be use for AUTHCALL, anything not present will be zeroed out
 * @returns - The bytecode to execute AUTHCALL
 */
function getAuthCallCode(data: AuthcallData) {
  const gasLimitBuffer = setLengthLeft(bigIntToBytes(data.gasLimit ?? BigInt(0)), 32)
  const addressBuffer = setLengthLeft(data.address.bytes, 32)
  const valueBuffer = setLengthLeft(bigIntToBytes(data.value ?? BigInt(0)), 32)
  const valueExtBuffer = setLengthLeft(bigIntToBytes(data.valueExt ?? BigInt(0)), 32)
  const argsOffsetBuffer = setLengthLeft(bigIntToBytes(data.argsOffset ?? BigInt(0)), 32)
  const argsLengthBuffer = setLengthLeft(bigIntToBytes(data.argsLength ?? BigInt(0)), 32)
  const retOffsetBuffer = setLengthLeft(bigIntToBytes(data.retOffset ?? BigInt(0)), 32)
  const retLengthBuffer = setLengthLeft(bigIntToBytes(data.retLength ?? BigInt(0)), 32)
  const PUSH32 = hexToBytes('7f')
  const AUTHCALL = hexToBytes('f7')
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
  order.map((e: Uint8Array) => {
    bufferList.push(PUSH32)
    bufferList.push(e)
  })
  bufferList.push(AUTHCALL)
  return concatBytesNoTypeCheck(...bufferList)
}

// This flips the signature: the result is a signature which has the same public key upon key recovery,
// But the s-value is now > N_DIV_2
function flipSignature(signature: any) {
  const s = bytesToBigInt(signature.s)
  const flipped = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n - s

  if (signature.v === 27) {
    signature.v = 28
  } else {
    signature.v = 27
  }
  signature.s = setLengthLeft(bigIntToBytes(flipped), 32)
  return signature
}

tape('EIP-3074 AUTH', (t) => {
  t.test('Should execute AUTH correctly', async (st) => {
    const vm = await VM.create({ common })
    const message = hexToBytes('01')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = concatBytesNoTypeCheck(getAuthCode(message, signature, authAddress), RETURNTOP)

    await vm.stateManager.putContractCode(contractAddress, code)
    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    await vm.stateManager.putAccount(callerAddress, new Account())
    const account = await vm.stateManager.getAccount(callerAddress)
    account!.balance = BigInt(10000000)
    await vm.stateManager.putAccount(callerAddress, account!)

    const result = await vm.runTx({ tx, block, skipHardForkValidation: true })
    const buf = result.execResult.returnValue.slice(31)
    st.deepEquals(buf, hexToBytes('01'), 'auth should return 1')
  })

  t.test('Should not set AUTH if signature is invalid', async (st) => {
    const vm = await VM.create({ common })
    const message = hexToBytes('01')
    const signature = signMessage(message, contractAddress, privateKey)
    signature.r = signature.s
    const code = concatBytesNoTypeCheck(getAuthCode(message, signature, authAddress), RETURNTOP)

    await vm.stateManager.putContractCode(contractAddress, code)
    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    await vm.stateManager.putAccount(callerAddress, new Account())
    const account = await vm.stateManager.getAccount(callerAddress)
    account!.balance = BigInt(10000000)
    await vm.stateManager.putAccount(callerAddress, account!)

    const result = await vm.runTx({ tx, block, skipHardForkValidation: true })
    const buf = result.execResult.returnValue
    st.deepEquals(buf, zeros(32), 'auth puts 0 on stack on invalid signature')
  })

  t.test('Should not set AUTH if reported address is invalid', async (st) => {
    const vm = await VM.create({ common })
    const message = hexToBytes('01')
    const signature = signMessage(message, contractAddress, privateKey)
    signature.r = signature.s
    // use the contractAddress instead of authAddress for the expected address (this should fail)
    const code = concatBytesNoTypeCheck(getAuthCode(message, signature, contractAddress), RETURNTOP)

    await vm.stateManager.putContractCode(contractAddress, code)
    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    await vm.stateManager.putAccount(callerAddress, new Account())
    const account = await vm.stateManager.getAccount(callerAddress)
    account!.balance = BigInt(10000000)
    await vm.stateManager.putAccount(callerAddress, account!)

    const result = await vm.runTx({ tx, block, skipHardForkValidation: true })
    const buf = result.execResult.returnValue
    st.deepEquals(buf, zeros(32), 'auth puts 0')
  })

  t.test('Should throw if signature s > N_DIV_2', async (st) => {
    const vm = await VM.create({ common })
    const message = hexToBytes('01')
    const signature = flipSignature(signMessage(message, contractAddress, privateKey))
    const code = concatBytesNoTypeCheck(getAuthCode(message, signature, authAddress), RETURNTOP)

    await vm.stateManager.putContractCode(contractAddress, code)
    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    await vm.stateManager.putAccount(callerAddress, new Account())
    const account = await vm.stateManager.getAccount(callerAddress)
    account!.balance = BigInt(10000000)
    await vm.stateManager.putAccount(callerAddress, account!)

    const result = await vm.runTx({ tx, block, skipHardForkValidation: true })
    st.equal(
      result.execResult.exceptionError?.error,
      EVMErrorMessage.AUTH_INVALID_S,
      'threw correct error'
    )
  })

  t.test('Should be able to call AUTH multiple times', async (st) => {
    const vm = await VM.create({ common })
    const message = hexToBytes('01')
    const signature = signMessage(message, contractAddress, privateKey)
    const signature2 = signMessage(message, contractAddress, callerPrivateKey)
    const code = concatBytesNoTypeCheck(
      getAuthCode(message, signature, authAddress),
      getAuthCode(message, signature2, callerAddress),
      RETURNTOP
    )

    await vm.stateManager.putContractCode(contractAddress, code)
    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    await vm.stateManager.putAccount(callerAddress, new Account())
    const account = await vm.stateManager.getAccount(callerAddress)
    account!.balance = BigInt(10000000)
    await vm.stateManager.putAccount(callerAddress, account!)

    const result = await vm.runTx({ tx, block, skipHardForkValidation: true })
    const buf = result.execResult.returnValue.slice(31)
    st.deepEquals(buf, hexToBytes('01'), 'auth returned right address')
  })

  t.test('Should use zeros in case that memory size < 128', async (st) => {
    const vm = await VM.create({ common })
    const message = hexToBytes('00')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = concatBytesNoTypeCheck(
      getAuthCode(message, signature, authAddress, hexToBytes('60')),
      RETURNTOP
    )

    await vm.stateManager.putContractCode(contractAddress, code)
    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    await vm.stateManager.putAccount(callerAddress, new Account())
    const account = await vm.stateManager.getAccount(callerAddress)
    account!.balance = BigInt(10000000)
    await vm.stateManager.putAccount(callerAddress, account!)

    const result = await vm.runTx({ tx, block, skipHardForkValidation: true })
    const buf = result.execResult.returnValue.slice(31)
    st.deepEquals(buf, hexToBytes('01'), 'auth returned right address')
  })

  t.test('Should charge memory expansion gas if the memory size > 128', async (st) => {
    const vm = await VM.create({ common })
    const message = hexToBytes('00')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = concatBytesNoTypeCheck(getAuthCode(message, signature, authAddress), RETURNMEMSIZE)

    await vm.stateManager.putContractCode(contractAddress, code)
    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    await vm.stateManager.putAccount(callerAddress, new Account())
    const account = await vm.stateManager.getAccount(callerAddress)
    account!.balance = BigInt(20000000)
    await vm.stateManager.putAccount(callerAddress, account!)

    const result = await vm.runTx({ tx, block, skipHardForkValidation: true })

    st.deepEquals(
      result.execResult.returnValue.slice(31),
      hexToBytes('80'),
      'reported msize is correct'
    )
    const gas = result.execResult.executionGasUsed

    const code2 = concatBytesNoTypeCheck(
      getAuthCode(message, signature, authAddress, hexToBytes('90')),
      RETURNMEMSIZE
    )

    await vm.stateManager.putContractCode(contractAddress, code2)
    const tx2 = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
      nonce: 1,
    }).sign(callerPrivateKey)

    const result2 = await vm.runTx({ tx: tx2, block, skipHardForkValidation: true })

    // the memory size in AUTH is 0x90 (so extra 16 bytes), but memory expands with words (32 bytes)
    // so the correct amount of msize is 0xa0, not 0x90
    st.deepEquals(
      result2.execResult.returnValue.slice(31),
      hexToBytes('a0'),
      'reported msize is correct'
    )
    st.ok(result2.execResult.executionGasUsed > gas, 'charged more gas for memory expansion')
    st.end()
  })
})

// Setups the environment for the VM, puts `code` at contractAddress and also puts the STORECALLER bytecode at the contractStorageAddress
async function setupVM(code: Uint8Array) {
  const vm = await VM.create({ common: common.copy() })
  await vm.stateManager.putContractCode(contractAddress, code)
  await vm.stateManager.putContractCode(contractStorageAddress, STORECALLER)
  await vm.stateManager.putAccount(callerAddress, new Account())
  const account = await vm.stateManager.getAccount(callerAddress)
  account!.balance = PREBALANCE
  await vm.stateManager.modifyAccountFields(callerAddress, { balance: PREBALANCE })
  return vm
}

tape('EIP-3074 AUTHCALL', (t) => {
  t.test('Should execute AUTHCALL correctly', async (st) => {
    const message = hexToBytes('01')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = concatBytesNoTypeCheck(
      getAuthCode(message, signature, authAddress),
      getAuthCallCode({
        address: contractStorageAddress,
      }),
      RETURNTOP
    )
    const vm = await setupVM(code)

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const result = await vm.runTx({ tx, block, skipHardForkValidation: true })

    const buf = result.execResult.returnValue.slice(31)
    st.deepEquals(buf, hexToBytes('01'), 'authcall success')

    const storage = await vm.stateManager.getContractStorage(contractStorageAddress, zeros(32))
    st.deepEquals(storage, address.bytes, 'caller set correctly')
  })

  t.test('Should forward max call gas when gas set to 0', async (st) => {
    const message = hexToBytes('01')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = concatBytesNoTypeCheck(
      getAuthCode(message, signature, authAddress),
      getAuthCallCode({
        address: contractStorageAddress,
      }),
      RETURNTOP
    )
    const vm = await setupVM(code)

    let gas: bigint
    vm.evm.events!.on('step', (e: InterpreterStep) => {
      if (e.opcode.name === 'AUTHCALL') {
        gas = e.gasLeft
      }
    })

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    await vm.runTx({ tx, block, skipHardForkValidation: true })

    const gasUsed = await vm.stateManager.getContractStorage(
      contractStorageAddress,
      hexToBytes('00'.repeat(31) + '01')
    )
    const gasBigInt = bytesToBigInt(gasUsed)
    const preGas =
      gas! -
      common.param('gasPrices', 'warmstorageread')! -
      common.param('gasPrices', 'coldaccountaccess')!
    const expected = preGas - preGas / 64n - 2n
    st.equal(gasBigInt, expected, 'forwarded max call gas')
  })

  t.test('Should forward max call gas when gas set to 0 - warm account', async (st) => {
    const message = hexToBytes('01')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = concatBytesNoTypeCheck(
      getAuthCode(message, signature, authAddress),
      getAuthCallCode({
        address: contractStorageAddress,
      }),
      getAuthCallCode({
        address: contractStorageAddress,
      }),
      RETURNTOP
    )
    const vm = await setupVM(code)

    let gas: bigint
    vm.evm.events!.on('step', async (e: InterpreterStep) => {
      if (e.opcode.name === 'AUTHCALL') {
        gas = e.gasLeft // This thus overrides the first time AUTHCALL is used and thus the gas for the second call is stored
      }
    })

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    await vm.runTx({ tx, block, skipHardForkValidation: true })

    const gasUsed = await vm.stateManager.getContractStorage(
      contractStorageAddress,
      hexToBytes('00'.repeat(31) + '01')
    )
    const gasBigInt = bytesToBigInt(gasUsed)
    const preGas = gas! - common.param('gasPrices', 'warmstorageread')!
    const expected = preGas - preGas / 64n - 2n
    st.equal(gasBigInt, expected, 'forwarded max call gas')
  })

  t.test(
    'Should forward max call gas when gas set to 0 - cold account, nonzero transfer, create new account',
    async (st) => {
      const message = hexToBytes('01')
      const signature = signMessage(message, contractAddress, privateKey)
      const code = concatBytesNoTypeCheck(
        getAuthCode(message, signature, authAddress),
        getAuthCallCode({
          address: new Address(hexToBytes('cc'.repeat(20))),
          value: 1n,
        }),
        RETURNTOP
      )
      const vm = await setupVM(code)

      let gas: bigint
      let gasAfterCall: bigint
      vm.evm.events!.on('step', async (e: InterpreterStep) => {
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

      await vm.runTx({ tx, block, skipHardForkValidation: true })

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
      const message = hexToBytes('01')
      const signature = signMessage(message, contractAddress, privateKey)
      const code = concatBytesNoTypeCheck(
        getAuthCode(message, signature, authAddress),
        getAuthCallCode({
          address: contractStorageAddress,
          value: 1n,
        }),
        RETURNTOP
      )
      const vm = await setupVM(code)

      let gas: bigint
      vm.evm.events!.on('step', (e: InterpreterStep) => {
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

      const result = await vm.runTx({ tx, block, skipHardForkValidation: true })

      const gasUsed = await vm.stateManager.getContractStorage(
        contractStorageAddress,
        hexToBytes('00'.repeat(31) + '01')
      )
      const gasBigInt = bytesToBigInt(gasUsed)
      const preGas =
        gas! -
        common.param('gasPrices', 'warmstorageread')! -
        common.param('gasPrices', 'authcallValueTransfer')! -
        common.param('gasPrices', 'coldaccountaccess')!
      const expected = preGas - preGas / 64n - 2n
      st.equal(gasBigInt, expected, 'forwarded max call gas')

      const expectedBalance = PREBALANCE - result.amountSpent - value
      const account = await vm.stateManager.getAccount(callerAddress)

      st.equal(account!.balance, expectedBalance, 'caller balance ok')

      const contractAccount = await vm.stateManager.getAccount(contractAddress)
      st.equal(contractAccount!.balance, 2n, 'contract balance ok')

      const contractStorageAccount = await vm.stateManager.getAccount(contractStorageAddress)
      st.equal(contractStorageAccount!.balance, 1n, 'storage balance ok')
    }
  )

  t.test('Should throw if AUTH not set', async (st) => {
    const code = concatBytesNoTypeCheck(
      getAuthCallCode({
        address: contractStorageAddress,
      }),
      RETURNTOP
    )
    const vm = await setupVM(code)

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const result = await vm.runTx({ tx, block, skipHardForkValidation: true })
    st.equal(
      result.execResult.exceptionError?.error,
      EVMErrorMessage.AUTHCALL_UNSET,
      'threw with right error'
    )
    st.equal(result.amountSpent, tx.gasPrice * tx.gasLimit, 'spent all gas')
  })

  t.test('Should unset AUTH in case of invalid signature', async (st) => {
    const message = hexToBytes('01')
    const signature = signMessage(message, contractAddress, privateKey)
    const signature2 = {
      v: signature.v,
      r: signature.s,
      s: signature.s,
    }
    const code = concatBytesNoTypeCheck(
      getAuthCode(message, signature, authAddress),
      getAuthCallCode({
        address: contractStorageAddress,
      }),
      getAuthCode(message, signature2, authAddress),
      getAuthCallCode({
        address: contractStorageAddress,
      }),
      RETURNTOP
    )
    const vm = await setupVM(code)

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const result = await vm.runTx({ tx, block, skipHardForkValidation: true })
    st.equal(
      result.execResult.exceptionError?.error,
      EVMErrorMessage.AUTHCALL_UNSET,
      'threw with right error'
    )
    st.equal(result.amountSpent, tx.gasPrice * tx.gasLimit, 'spent all gas')
  })

  t.test('Should throw if not enough gas is available', async (st) => {
    const message = hexToBytes('01')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = concatBytesNoTypeCheck(
      getAuthCode(message, signature, authAddress),
      getAuthCallCode({
        address: contractStorageAddress,
        gasLimit: 10000000n,
      }),
      RETURNTOP
    )
    const vm = await setupVM(code)

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const result = await vm.runTx({ tx, block, skipHardForkValidation: true })
    st.equal(result.amountSpent, tx.gasLimit * tx.gasPrice, 'spent all gas')
    st.equal(
      result.execResult.exceptionError?.error,
      EVMErrorMessage.OUT_OF_GAS,
      'correct error type'
    )
  })

  t.test('Should throw if valueExt is nonzero', async (st) => {
    const message = hexToBytes('01')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = concatBytesNoTypeCheck(
      getAuthCode(message, signature, authAddress),
      getAuthCallCode({
        address: contractStorageAddress,
        valueExt: 1n,
      }),
      RETURNTOP
    )
    const vm = await setupVM(code)

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const result = await vm.runTx({ tx, block, skipHardForkValidation: true })
    st.equal(result.amountSpent, tx.gasLimit * tx.gasPrice, 'spent all gas')
    st.equal(
      result.execResult.exceptionError?.error,
      EVMErrorMessage.AUTHCALL_NONZERO_VALUEEXT,
      'correct error type'
    )
  })

  t.test('Should forward the right amount of gas', async (st) => {
    const message = hexToBytes('01')
    const signature = signMessage(message, contractAddress, privateKey)
    const code = concatBytesNoTypeCheck(
      getAuthCode(message, signature, authAddress),
      getAuthCallCode({
        address: contractStorageAddress,
        gasLimit: 700000n,
      }),
      RETURNTOP
    )
    const vm = await setupVM(code)

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    await vm.runTx({ tx, block, skipHardForkValidation: true })
    const gas = await vm.stateManager.getContractStorage(
      contractStorageAddress,
      hexToBytes('00'.repeat(31) + '01')
    )
    const gasBigInt = bytesToBigInt(gas)
    st.equals(gasBigInt, BigInt(700000 - 2), 'forwarded the right amount of gas') // The 2 is subtracted due to the GAS opcode base fee
  })

  t.test('Should set input and output correctly', async (st) => {
    const message = hexToBytes('01')
    const signature = signMessage(message, contractAddress, privateKey)
    const input = hexToBytes('aa'.repeat(32))
    const code = concatBytesNoTypeCheck(
      getAuthCode(message, signature, authAddress),
      MSTORE(hexToBytes('20'), input),
      getAuthCallCode({
        address: contractStorageAddress,
        argsOffset: 32n,
        argsLength: 32n,
        retOffset: 64n,
        retLength: 32n,
      }),
      hexToBytes('60206040F3') // PUSH 32 PUSH 64 RETURN -> This returns the 32 bytes at memory position 64
    )
    const vm = await setupVM(code)

    const tx = Transaction.fromTxData({
      to: contractAddress,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(callerPrivateKey)

    const result = await vm.runTx({ tx, block, skipHardForkValidation: true })
    const callInput = await vm.stateManager.getContractStorage(
      contractStorageAddress,
      hexToBytes('00'.repeat(31) + '02')
    )
    st.deepEquals(callInput, input, 'authcall input ok')
    st.deepEquals(result.execResult.returnValue, input, 'authcall output ok')
  })
})
