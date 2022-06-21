import * as tape from 'tape'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { Account, Address, MAX_UINT64, padToEven } from '@ethereumjs/util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../src'
import { ERROR } from '../../src/exceptions'
import EVM from '../../src'
import { getEEI } from '../utils'

// Non-protected Create2Address generator. Does not check if buffers have the right padding.
function create2address(sourceAddress: Address, codeHash: Buffer, salt: Buffer): Address {
  const rlp_proc_buffer = Buffer.from('ff', 'hex')
  const hashBuffer = Buffer.concat([rlp_proc_buffer, sourceAddress.buf, salt, codeHash])
  return new Address(Buffer.from(keccak256(hashBuffer)).slice(12))
}

/*
    This test:
        Setups a contract at address 0x00..ff 
        Instantiates the VM at the Constantinople fork
        Calls the address with various arguments (callvalue is used as argument). VMs `runCall` is used.
        The CREATE2 address which the contract creates is checked against the expected CREATE2 value.
*/

tape('Constantinople: EIP-1014 CREATE2 creates the right contract address', async (t) => {
  // setup the accounts for this test
  const caller = new Address(Buffer.from('00000000000000000000000000000000000000ee', 'hex')) // caller addres
  const contractAddress = new Address(
    Buffer.from('00000000000000000000000000000000000000ff', 'hex')
  ) // contract address
  // setup the vm
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Constantinople })
  const eei = await getEEI()
  const evm = await EVM.create({ common, eei })
  const code = '3460008080F560005260206000F3'
  /*
      code:             remarks: (top of the stack is at the zero index)
        CALLVALUE
        PUSH1 0x00
        DUP1
        DUP1
        CREATE2         [0, 0, 0, CALLVALUE]
        PUSH1 0x00
        MSTORE          [0x00, <created address>]
        PUSH1 0x20
        PUSH1 0x00
        RETURN          [0x00, 0x20]
    */

  await eei.state.putContractCode(contractAddress, Buffer.from(code, 'hex')) // setup the contract code
  await eei.state.putAccount(caller, new Account(BigInt(0), BigInt(0x11111111))) // give the calling account a big balance so we don't run out of funds
  const codeHash = Buffer.from(keccak256(Buffer.from('')))
  for (let value = 0; value <= 1000; value += 20) {
    // setup the call arguments
    const runCallArgs = {
      caller: caller, // call address
      gasLimit: BigInt(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
      to: contractAddress, // call to the contract address
      value: BigInt(value), // call with this value (the value is used in the contract as an argument, see above's code)
    }

    const hexString = padToEven(value.toString(16))
    let valueBuffer = Buffer.from(hexString, 'hex')
    // pad buffer
    if (valueBuffer.length < 32) {
      const diff = 32 - valueBuffer.length
      valueBuffer = Buffer.concat([Buffer.alloc(diff), valueBuffer])
    }
    // calculate expected CREATE2 address
    const expectedAddress = create2address(contractAddress, codeHash, valueBuffer)
    // run the actual call
    const res = await evm.runCall(runCallArgs)
    // retrieve the return value and convert it to an address (remove the first 12 bytes from the 32-byte return value)
    const executionReturnValue = new Address(res.execResult.returnValue.slice(12))
    if (!expectedAddress.equals(executionReturnValue)) {
      t.fail('contract address not equal')
    }
  }

  t.pass('CREATE2 creates (empty) contracts at the expected address')

  t.end()
})

tape('Byzantium cannot access Constantinople opcodes', async (t) => {
  t.plan(2)
  // setup the accounts for this test
  const caller = new Address(Buffer.from('00000000000000000000000000000000000000ee', 'hex')) // caller addres
  const contractAddress = new Address(
    Buffer.from('00000000000000000000000000000000000000ff', 'hex')
  ) // contract address
  // setup the evm
  const eeiByzantium = await getEEI()
  const eeiConstantinople = await getEEI()
  const evmByzantium = await EVM.create({
    common: new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium }),
    eei: eeiByzantium,
  })
  const evmConstantinople = await EVM.create({
    common: new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Constantinople }),
    eei: eeiConstantinople,
  })
  const code = '600160011B00'
  /*
      code:             remarks: (top of the stack is at the zero index)
        PUSH1 0x01  
        PUSH1 0x01
        SHL
        STOP
    */

  await eeiByzantium.state.putContractCode(contractAddress, Buffer.from(code, 'hex')) // setup the contract code
  await eeiConstantinople.state.putContractCode(contractAddress, Buffer.from(code, 'hex')) // setup the contract code

  const runCallArgs = {
    caller: caller, // call address
    gasLimit: BigInt(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
    to: contractAddress, // call to the contract address
  }

  const byzantiumResult = await evmByzantium.runCall(runCallArgs)
  const constantinopleResult = await evmConstantinople.runCall(runCallArgs)

  t.assert(
    byzantiumResult.execResult.exceptionError &&
      byzantiumResult.execResult.exceptionError.error === 'invalid opcode',
    'byzantium cannot accept constantinople opcodes (SHL)'
  )
  t.assert(
    !constantinopleResult.execResult.exceptionError,
    'constantinople can access the SHL opcode'
  )

  t.end()
})

tape('Ensure that Istanbul sstoreCleanRefundEIP2200 gas is applied correctly', async (t) => {
  // setup the accounts for this test
  const caller = new Address(Buffer.from('00000000000000000000000000000000000000ee', 'hex')) // caller addres
  const address = new Address(Buffer.from('00000000000000000000000000000000000000ff', 'hex'))
  // setup the vm
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
  const eei = await getEEI()
  const evm = await VM.create({ common, eei })
  const code = '61000260005561000160005500'
  /*
      idea: store the original value in the storage slot, except it is now a 1-length buffer instead of a 32-length buffer
      code:             
        PUSH2 0x0002
        PUSH1 0x00
        SSTORE              -> make storage slot 0 "dirty"
        PUSH2 0x0001
        PUSH1 0x00          
        SSTORE              -> -> restore it to the original storage value (refund sstoreCleanRefundEIP2200)
        STOP
      gas cost: 
        4x PUSH                                         12
        2x SSTORE (slot is nonzero, so charge 5000): 10000
        net                                          10012
      gas refund 
        sstoreCleanRefundEIP2200                      4200
      gas used
                                                     10012 - 4200 = 5812

    */

  await eei.state.putContractCode(address, Buffer.from(code, 'hex'))
  await eei.state.putContractStorage(
    address,
    Buffer.alloc(32, 0),
    Buffer.from('00'.repeat(31) + '01', 'hex')
  )

  // setup the call arguments
  const runCallArgs = {
    caller: caller, // call address
    to: address,
    gasLimit: BigInt(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
  }

  const result = await evm.runCall(runCallArgs)

  t.equal(result.execResult.executionGasUsed, BigInt(5812), 'gas used correct')
  t.equal(result.execResult.gasRefund, BigInt(4200), 'gas refund correct')

  t.end()
})

tape('ensure correct gas for pre-constantinople sstore', async (t) => {
  // setup the accounts for this test
  const caller = new Address(Buffer.from('00000000000000000000000000000000000000ee', 'hex')) // caller addres
  const address = new Address(Buffer.from('00000000000000000000000000000000000000ff', 'hex'))
  // setup the vm
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
  const eei = await getEEI()
  const evm = await VM.create({ common, eei })
  // push 1 push 0 sstore stop
  const code = '600160015500'

  await eei.state.putContractCode(address, Buffer.from(code, 'hex'))

  // setup the call arguments
  const runCallArgs = {
    caller: caller, // call address
    to: address,
    gasLimit: BigInt(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
  }

  const result = await evm.runCall(runCallArgs)

  t.equal(result.execResult.executionGasUsed, BigInt(20006), 'gas used correct')
  t.equal(result.execResult.gasRefund, BigInt(0), 'gas refund correct')

  t.end()
})

tape('ensure correct gas for calling non-existent accounts in homestead', async (t) => {
  // setup the accounts for this test
  const caller = new Address(Buffer.from('00000000000000000000000000000000000000ee', 'hex')) // caller addres
  const address = new Address(Buffer.from('00000000000000000000000000000000000000ff', 'hex'))
  // setup the vm
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Homestead })
  const eei = await getEEI()
  const evm = await EVM.create({ common, eei })
  // code to call 0x00..00dd, which does not exist
  const code = '6000600060006000600060DD61FFFF5A03F100'

  await eei.state.putContractCode(address, Buffer.from(code, 'hex'))

  // setup the call arguments
  const runCallArgs = {
    caller: caller, // call address
    to: address,
    gasLimit: BigInt(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
  }

  const result = await evm.runCall(runCallArgs)

  // 7x push + gas + sub + call + callNewAccount
  // 7*3 + 2 + 3 + 40 + 25000 = 25066
  t.equal(result.execResult.executionGasUsed, BigInt(25066), 'gas used correct')
  t.equal(result.execResult.gasRefund, BigInt(0), 'gas refund correct')

  t.end()
})

tape(
  'ensure callcode goes OOG if the gas argument is more than the gas left in the homestead fork',
  async (t) => {
    // setup the accounts for this test
    const caller = new Address(Buffer.from('00000000000000000000000000000000000000ee', 'hex')) // caller addres
    const address = new Address(Buffer.from('00000000000000000000000000000000000000ff', 'hex'))
    // setup the vm
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Homestead })
    const eei = await getEEI()
    const evm = await VM.create({ common, eei })
    // code to call back into the calling account (0x00..00EE),
    // but using too much memory
    const code = '61FFFF60FF60006000600060EE6000F200'

    await eei.state.putContractCode(address, Buffer.from(code, 'hex'))

    // setup the call arguments
    const runCallArgs = {
      caller: caller, // call address
      to: address,
      gasLimit: BigInt(200),
    }

    const result = await evm.runCall(runCallArgs)

    t.equal(runCallArgs.gasLimit, result.execResult.executionGasUsed, 'gas used correct')
    t.equal(result.execResult.gasRefund, BigInt(0), 'gas refund correct')
    t.ok(result.execResult.exceptionError!.error == ERROR.OUT_OF_GAS, 'call went out of gas')

    t.end()
  }
)

tape('ensure selfdestruct pays for creating new accounts', async (t) => {
  // setup the accounts for this test
  const caller = new Address(Buffer.from('00000000000000000000000000000000000000ee', 'hex')) // caller addres
  const address = new Address(Buffer.from('00000000000000000000000000000000000000ff', 'hex'))
  // setup the vm
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.TangerineWhistle })
  const eei = await getEEI()
  const evm = await VM.create({ common, eei })
  // code to call 0x00..00fe, with the GAS opcode used as gas
  // this cannot be paid, since we also have to pay for CALL (40 gas)
  // this should thus go OOG
  const code = '60FEFF'

  await eei.state.putContractCode(address, Buffer.from(code, 'hex'))

  // setup the call arguments
  const runCallArgs = {
    caller: caller, // call address
    to: address,
    gasLimit: BigInt(0xffffffffff),
  }

  const result = await evm.runCall(runCallArgs)
  // gas: 5000 (selfdestruct) + 25000 (call new account)  + push (1) = 30003
  t.equal(result.execResult.executionGasUsed, BigInt(30003), 'gas used correct')
  // selfdestruct refund
  t.equal(result.execResult.gasRefund, BigInt(24000), 'gas refund correct')

  t.end()
})

tape('ensure that sstores pay for the right gas costs pre-byzantium', async (t) => {
  // setup the accounts for this test
  const caller = new Address(Buffer.from('00000000000000000000000000000000000000ee', 'hex')) // caller addres
  const address = new Address(Buffer.from('00000000000000000000000000000000000000ff', 'hex'))
  // setup the vm
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
  const eei = await getEEI()
  const evm = await VM.create({ common, eei })
  // code to call 0x00..00fe, with the GAS opcode used as gas
  // this cannot be paid, since we also have to pay for CALL (40 gas)
  // this should thus go OOG
  const code = '3460005500'

  await eei.state.putContractCode(address, Buffer.from(code, 'hex'))

  const account = await eei.state.getAccount(caller)
  account.balance = BigInt(100)
  await eei.state.putAccount(caller, account)

  /*
    Situation:
    Storage slot changes from 0 -> 0 (reset cost, 5000)
    Changes 0 -> 1 (set cost, 20000)
    Changes 1 -> 2 ("reset" cost, 5000)
    Changes 2 -> 0 ("reset" cost, 5000 + 15000 refund)
  */

  const data = [
    {
      value: 0,
      gas: 5005,
      refund: 0,
    },
    {
      value: 1,
      gas: 20005,
      refund: 0,
    },
    {
      value: 2,
      gas: 5005,
      refund: 0,
    },
    {
      value: 0,
      gas: 5005,
      refund: 15000,
    },
  ]

  for (const callData of data) {
    // setup the call arguments
    const runCallArgs = {
      caller: caller, // call address
      to: address,
      gasLimit: BigInt(0xffffffffff),
      value: BigInt(callData.value),
    }

    const result = await evm.runCall(runCallArgs)
    t.equal(result.execResult.executionGasUsed, BigInt(callData.gas), 'gas used correct')
    t.equal(result.execResult.gasRefund, BigInt(callData.refund), 'gas refund correct')
  }

  t.end()
})

tape(
  'Ensure that contracts cannot exceed nonce of MAX_UINT64 when creating new contracts (EIP-2681)',
  async (t) => {
    // setup the accounts for this test
    const caller = new Address(Buffer.from('00000000000000000000000000000000000000ee', 'hex')) // caller addres
    const address = new Address(Buffer.from('00000000000000000000000000000000000000ff', 'hex'))
    const slot = Buffer.from('00'.repeat(32), 'hex')
    const emptyBuffer = Buffer.from('')
    // setup the vm
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
    const eei = await getEEI()
    const evm = await VM.create({ common, eei })
    const code = '60008080F060005500'
    /*
      This simple code tries to create an empty contract and then stores the address of the contract in the zero slot.
        CODE:
          PUSH 0 
          DUP1
          DUP1
          CREATE -> Stack is now [0,0,0] ([value, offset, length])
          PUSH 0
          SSTORE -> stack is now [0, <Created Address>], so this stores the <Created Address> at slot 0
          STOP
    */

    await eei.state.putContractCode(address, Buffer.from(code, 'hex'))

    const account = await eei.state.getAccount(address)
    account.nonce = MAX_UINT64 - BigInt(1)
    await eei.state.putAccount(address, account)

    // setup the call arguments
    const runCallArgs = {
      caller: caller, // call address
      to: address,
      gasLimit: BigInt(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
    }

    await evm.runCall(runCallArgs)
    let storage = await eei.state.getContractStorage(address, slot)

    // The nonce is MAX_UINT64 - 1, so we are allowed to create a contract (nonce of creating contract is now MAX_UINT64)
    t.ok(!storage.equals(emptyBuffer), 'succesfully created contract')

    await evm.runCall(runCallArgs)

    // The nonce is MAX_UINT64, so we are NOT allowed to create a contract (nonce of creating contract is now MAX_UINT64)
    storage = await eei.state.getContractStorage(address, slot)
    t.ok(
      storage.equals(emptyBuffer),
      'failed to create contract; nonce of creating contract is too high (MAX_UINT64)'
    )

    t.end()
  }
)

tape('Ensure that IDENTITY precompile copies the memory', async (t) => {
  // This test replays the Geth chain split; https://etherscan.io/tx/0x1cb6fb36633d270edefc04d048145b4298e67b8aa82a9e5ec4aa1435dd770ce4
  // Exploit post-mortem: https://github.com/ethereum/go-ethereum/blob/master/docs/postmortems/2021-08-22-split-postmortem.md
  // Permalink: https://github.com/ethereum/go-ethereum/blob/90987db7334c1d10eb866ca550efedb66dea8a20/docs/postmortems/2021-08-22-split-postmortem.md
  // setup the accounts for this test
  const caller = new Address(Buffer.from('1a02a619e51cc5f8a2a61d2a60f6c80476ee8ead', 'hex')) // caller addres
  // setup the vm
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
  const eei = await getEEI()
  const evm = await VM.create({ common, eei })
  const code = '3034526020600760203460045afa602034343e604034f3'

  const account = await eei.state.getAccount(caller)
  account.nonce = BigInt(1) // ensure nonce for contract is correct
  account.balance = BigInt(10000000000000000)
  await eei.state.putAccount(caller, account)

  // setup the call arguments
  const runCallArgs = {
    caller: caller, // call address
    gasLimit: BigInt(150000),
    data: Buffer.from(code, 'hex'),
    gasPrice: BigInt(70000000000),
  }

  const result = await evm.runCall(runCallArgs)

  const expectedAddress = Buffer.from('8eae784e072e961f76948a785b62c9a950fb17ae', 'hex')
  const expectedCode = Buffer.from(
    '0000000000000000000000008eae784e072e961f76948a785b62c9a950fb17ae62c9a950fb17ae00000000000000000000000000000000000000000000000000',
    'hex'
  )

  t.ok(result.createdAddress?.buf.equals(expectedAddress), 'created address correct')
  const deployedCode = await eei.state.getContractCode(result.createdAddress!)
  t.ok(deployedCode.equals(expectedCode), 'deployed code correct')

  t.end()
})

tape('Throws on negative call value', async (t) => {
  // setup the vm
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
  const eei = await getEEI()
  const evm = await VM.create({ common, eei })

  // setup the call arguments
  const runCallArgs = {
    to: Address.zero(),
    value: BigInt(-10),
  }

  try {
    await evm.runCall(runCallArgs)
    t.fail('should not accept a negative call value')
  } catch (err: any) {
    t.ok(err.message.includes('value field cannot be negative'), 'throws on negative call value')
  }

  t.end()
})

tape('runCall() -> skipBalance behavior', async (t) => {
  t.plan(7)
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin })
  const eei = await getEEI()
  const evm = await VM.create({ common, eei })

  // runCall against a contract to reach `_reduceSenderBalance`
  const contractCode = Buffer.from('00', 'hex') // 00: STOP
  const contractAddress = Address.fromString('0x000000000000000000000000636F6E7472616374')
  await eei.state.putContractCode(contractAddress, contractCode)
  const senderKey = Buffer.from(
    'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
    'hex'
  )
  const sender = Address.fromPrivateKey(senderKey)

  const runCallArgs = {
    gasLimit: BigInt(21000),
    value: BigInt(6),
    from: sender,
    to: contractAddress,
    skipBalance: true,
  }

  for (const balance of [undefined, BigInt(5)]) {
    await eei.state.modifyAccountFields(sender, { nonce: BigInt(0), balance })
    const res = await evm.runCall(runCallArgs)
    t.pass('runCall should not throw with no balance and skipBalance')
    const senderBalance = (await eei.state.getAccount(sender)).balance
    t.equal(
      senderBalance,
      balance ?? BigInt(0),
      'sender balance should be the same before and after call execution with skipBalance'
    )
    t.equal(res.execResult.exceptionError, undefined, 'no exceptionError with skipBalance')
  }

  const res2 = await evm.runCall({ ...runCallArgs, skipBalance: false })
  t.equal(
    res2.execResult.exceptionError?.error,
    'insufficient balance',
    'runCall reverts when insufficient sender balance and skipBalance is false'
  )
})
