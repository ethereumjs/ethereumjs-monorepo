import tape from 'tape'
import { Address, BN, keccak256, padToEven } from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../src'
import { ERROR } from '../../src/exceptions'

// Non-protected Create2Address generator. Does not check if buffers have the right padding.
function create2address(sourceAddress: Address, codeHash: Buffer, salt: Buffer): Address {
  const rlp_proc_buffer = Buffer.from('ff', 'hex')
  const hashBuffer = Buffer.concat([rlp_proc_buffer, sourceAddress.buf, salt, codeHash])
  return new Address(keccak256(hashBuffer).slice(12))
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
  const vm = new VM({ common })
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

  await vm.stateManager.putContractCode(contractAddress, Buffer.from(code, 'hex')) // setup the contract code

  const codeHash = keccak256(Buffer.from(''))
  for (let value = 0; value <= 1000; value += 20) {
    // setup the call arguments
    const runCallArgs = {
      caller: caller, // call address
      gasLimit: new BN(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
      to: contractAddress, // call to the contract address
      value: new BN(value), // call with this value (the value is used in the contract as an argument, see above's code)
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
    const res = await vm.runCall(runCallArgs)
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
  // setup the vm
  const vmByzantium = new VM({
    common: new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium }),
  })
  const vmConstantinople = new VM({
    common: new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Constantinople }),
  })
  const code = '600160011B00'
  /*
      code:             remarks: (top of the stack is at the zero index)
        PUSH1 0x01  
        PUSH1 0x01
        SHL
        STOP
    */

  await vmByzantium.stateManager.putContractCode(contractAddress, Buffer.from(code, 'hex')) // setup the contract code
  await vmConstantinople.stateManager.putContractCode(contractAddress, Buffer.from(code, 'hex')) // setup the contract code

  const runCallArgs = {
    caller: caller, // call address
    gasLimit: new BN(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
    to: contractAddress, // call to the contract address
  }

  const byzantiumResult = await vmByzantium.runCall(runCallArgs)
  const constantinopleResult = await vmConstantinople.runCall(runCallArgs)

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

tape('Ensure that precompile activation creates non-empty accounts', async (t) => {
  // setup the accounts for this test
  const caller = new Address(Buffer.from('00000000000000000000000000000000000000ee', 'hex')) // caller addres
  const contractAddress = new Address(
    Buffer.from('00000000000000000000000000000000000000ff', 'hex')
  ) // contract address
  // setup the vm
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
  const vmNotActivated = new VM({ common: common })
  const vmActivated = new VM({ common: common, activatePrecompiles: true })
  const code = '6000808080347300000000000000000000000000000000000000045AF100'
  /*
      idea: call the Identity precompile with nonzero value in order to trigger "callNewAccount" for the non-activated VM and do not deduct this
            when calling from the activated VM. Explicitly check that the difference in gas cost is equal to the common callNewAccount gas.
      code:             remarks: (top of the stack is at the zero index)       
        PUSH1 0x00
        DUP1
        DUP1
        DUP1
        CALLVALUE
        PUSH20 0000000000000000000000000000000000000004
        GAS
        CALL            [gas, 0x00..04, 0, 0, 0, 0, 0]
        STOP
    */

  await vmNotActivated.stateManager.putContractCode(contractAddress, Buffer.from(code, 'hex')) // setup the contract code
  await vmActivated.stateManager.putContractCode(contractAddress, Buffer.from(code, 'hex')) // setup the contract code

  // setup the call arguments
  const runCallArgs = {
    caller: caller, // call address
    gasLimit: new BN(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
    to: contractAddress, // call to the contract address,
    value: new BN(1),
  }

  const resultNotActivated = await vmNotActivated.runCall(runCallArgs)
  const resultActivated = await vmActivated.runCall(runCallArgs)

  const diff = resultNotActivated.gasUsed.sub(resultActivated.gasUsed)
  const expected = common.param('gasPrices', 'callNewAccount')

  t.assert(diff.eq(new BN(expected)), 'precompiles are activated')

  t.end()
})

tape('Ensure that Istanbul sstoreCleanRefundEIP2200 gas is applied correctly', async (t) => {
  // setup the accounts for this test
  const caller = new Address(Buffer.from('00000000000000000000000000000000000000ee', 'hex')) // caller addres
  const address = new Address(Buffer.from('00000000000000000000000000000000000000ff', 'hex'))
  // setup the vm
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
  const vm = new VM({ common: common })
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

  await vm.stateManager.putContractCode(address, Buffer.from(code, 'hex'))
  await vm.stateManager.putContractStorage(
    address,
    Buffer.alloc(32, 0),
    Buffer.from('00'.repeat(31) + '01', 'hex')
  )

  // setup the call arguments
  const runCallArgs = {
    caller: caller, // call address
    to: address,
    gasLimit: new BN(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
  }

  const result = await vm.runCall(runCallArgs)

  t.equal(result.gasUsed.toNumber(), 5812, 'gas used correct')
  t.equal(result.execResult.gasRefund!.toNumber(), 4200, 'gas refund correct')

  t.end()
})

tape('ensure correct gas for pre-constantinople sstore', async (t) => {
  // setup the accounts for this test
  const caller = new Address(Buffer.from('00000000000000000000000000000000000000ee', 'hex')) // caller addres
  const address = new Address(Buffer.from('00000000000000000000000000000000000000ff', 'hex'))
  // setup the vm
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
  const vm = new VM({ common: common })
  // push 1 push 0 sstore stop
  const code = '600160015500'

  await vm.stateManager.putContractCode(address, Buffer.from(code, 'hex'))

  // setup the call arguments
  const runCallArgs = {
    caller: caller, // call address
    to: address,
    gasLimit: new BN(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
  }

  const result = await vm.runCall(runCallArgs)

  t.equal(result.gasUsed.toNumber(), 20006, 'gas used correct')
  t.equal(result.execResult.gasRefund!.toNumber(), 0, 'gas refund correct')

  t.end()
})

tape('ensure correct gas for calling non-existent accounts in homestead', async (t) => {
  // setup the accounts for this test
  const caller = new Address(Buffer.from('00000000000000000000000000000000000000ee', 'hex')) // caller addres
  const address = new Address(Buffer.from('00000000000000000000000000000000000000ff', 'hex'))
  // setup the vm
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Homestead })
  const vm = new VM({ common: common })
  // code to call 0x00..00dd, which does not exist
  const code = '6000600060006000600060DD61FFFF5A03F100'

  await vm.stateManager.putContractCode(address, Buffer.from(code, 'hex'))

  // setup the call arguments
  const runCallArgs = {
    caller: caller, // call address
    to: address,
    gasLimit: new BN(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
  }

  const result = await vm.runCall(runCallArgs)

  // 7x push + gas + sub + call + callNewAccount
  // 7*3 + 2 + 3 + 40 + 25000 = 25066
  t.equal(result.gasUsed.toNumber(), 25066, 'gas used correct')
  t.equal(result.execResult.gasRefund!.toNumber(), 0, 'gas refund correct')

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
    const vm = new VM({ common: common })
    // code to call back into the calling account (0x00..00EE),
    // but using too much memory
    const code = '61FFFF60FF60006000600060EE6000F200'

    await vm.stateManager.putContractCode(address, Buffer.from(code, 'hex'))

    // setup the call arguments
    const runCallArgs = {
      caller: caller, // call address
      to: address,
      gasLimit: new BN(200),
    }

    const result = await vm.runCall(runCallArgs)

    t.ok(runCallArgs.gasLimit.eq(result.gasUsed), 'gas used correct')
    t.equal(result.execResult.gasRefund!.toNumber(), 0, 'gas refund correct')
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
  const vm = new VM({ common: common })
  // code to call 0x00..00fe, with the GAS opcode used as gas
  // this cannot be paid, since we also have to pay for CALL (40 gas)
  // this should thus go OOG
  const code = '60FEFF'

  await vm.stateManager.putContractCode(address, Buffer.from(code, 'hex'))

  // setup the call arguments
  const runCallArgs = {
    caller: caller, // call address
    to: address,
    gasLimit: new BN(0xffffffffff),
  }

  const result = await vm.runCall(runCallArgs)
  // gas: 5000 (selfdestruct) + 25000 (call new account)  + push (1) = 30003
  t.equal(result.gasUsed.toNumber(), 30003, 'gas used correct')
  // selfdestruct refund
  t.equal(result.execResult.gasRefund!.toNumber(), 24000, 'gas refund correct')

  t.end()
})

tape('ensure that sstores pay for the right gas costs pre-byzantium', async (t) => {
  // setup the accounts for this test
  const caller = new Address(Buffer.from('00000000000000000000000000000000000000ee', 'hex')) // caller addres
  const address = new Address(Buffer.from('00000000000000000000000000000000000000ff', 'hex'))
  // setup the vm
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
  const vm = new VM({ common: common })
  // code to call 0x00..00fe, with the GAS opcode used as gas
  // this cannot be paid, since we also have to pay for CALL (40 gas)
  // this should thus go OOG
  const code = '3460005500'

  await vm.stateManager.putContractCode(address, Buffer.from(code, 'hex'))

  const account = await vm.stateManager.getAccount(caller)
  account.balance = new BN(100)
  await vm.stateManager.putAccount(caller, account)

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
      gasLimit: new BN(0xffffffffff),
      value: new BN(callData.value),
    }

    const result = await vm.runCall(runCallArgs)
    t.equal(result.gasUsed.toNumber(), callData.gas, 'gas used correct')
    t.equal(result.execResult.gasRefund?.toNumber(), callData.refund, 'gas refund correct')
  }

  t.end()
})
