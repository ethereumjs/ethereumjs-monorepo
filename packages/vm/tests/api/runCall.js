const tape = require('tape')
const BN = require('bn.js')
const VM = require('../../dist/index').default
const { createAccount } = require('./utils')
const { keccak256, padToEven } = require('ethereumjs-util')
const Common = require('@ethereumjs/common').default

// Non-protected Create2Address generator. Does not check if buffers have the right padding. Returns a 32-byte buffer which contains the address.
function create2address(sourceAddress, codeHash, salt) {
    let rlp_proc_buffer = Buffer.from('ff', 'hex')
    let hashBuffer = Buffer.concat([rlp_proc_buffer, sourceAddress, salt, codeHash])
    return keccak256(hashBuffer).slice(12)
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
    const caller =          Buffer.from('00000000000000000000000000000000000000ee', 'hex')                   // caller addres
    const contractAddress = Buffer.from('00000000000000000000000000000000000000ff', 'hex')          // contract address 
    // setup the vm
    const vm = new VM({ chain: 'mainnet', hardfork: 'constantinople'})                                   
    const code = "3460008080F560005260206000F3"
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

    await vm.stateManager.putContractCode(contractAddress, Buffer.from(code, 'hex'))                // setup the contract code

    let codeHash = keccak256(Buffer.from(''))
    for (let value = 0; value <= 1000; value+=20) {
        // setup the call arguments
        let runCallArgs = {
            caller: caller,                     // call address
            gasLimit: new BN(0xffffffffff),     // ensure we pass a lot of gas, so we do not run out of gas
            to: contractAddress,                // call to the contract address
            value: new BN(value)                // call with this value (the value is used in the contract as an argument, see above's code)
        }

        let hexString = padToEven(value.toString(16));
        let valueBuffer = Buffer.from(hexString, 'hex')
        // pad buffer
        if (valueBuffer.length < 32) {
            let diff = 32 - valueBuffer.length 
            valueBuffer = Buffer.concat([Buffer.alloc(diff), valueBuffer])
        }
        // calculate expected CREATE2 address
        let expectedAddress = create2address(contractAddress, codeHash, valueBuffer)
        // run the actual call
        const res = await vm.runCall(runCallArgs)
        // retrieve the return value and convert it to an address (remove the first 12 bytes from the 32-byte return value)
        const executionReturnValue = res.execResult.returnValue.slice(12)
        if (!expectedAddress.equals(executionReturnValue)) {
            console.log('not equal')
            t.fail("contract address not equal")
        }
    }

    t.pass('CREATE2 creates (empty) contracts at the expected address')

    t.end()
})

tape('Byzantium cannot access Constantinople opcodes', async (t) => {
    t.plan(2)
    // setup the accounts for this test
    const caller =          Buffer.from('00000000000000000000000000000000000000ee', 'hex')                   // caller addres
    const contractAddress = Buffer.from('00000000000000000000000000000000000000ff', 'hex')          // contract address 
    // setup the vm
    const vmByzantium = new VM({ chain: 'mainnet', hardfork: 'byzantium'})      
    const vmConstantinople = new VM({ chain: 'mainnet', hardfork: 'constantinople'})                                   
    const code = "600160011B00"
    /*
      code:             remarks: (top of the stack is at the zero index)
        PUSH1 0x01  
        PUSH1 0x01
        SHL
        STOP
    */

    await vmByzantium.stateManager.putContractCode(contractAddress, Buffer.from(code, 'hex'))                // setup the contract code
    await vmConstantinople.stateManager.putContractCode(contractAddress, Buffer.from(code, 'hex'))                // setup the contract code

    const runCallArgs = {
        caller: caller,                     // call address
        gasLimit: new BN(0xffffffffff),     // ensure we pass a lot of gas, so we do not run out of gas
        to: contractAddress,                // call to the contract address
    }

    const byzantiumResult = await vmByzantium.runCall(runCallArgs)
    const constantinopleResult = await vmConstantinople.runCall(runCallArgs)

    t.assert(byzantiumResult.execResult.exceptionError && byzantiumResult.execResult.exceptionError.error === 'invalid opcode', 'byzantium cannot accept constantinople opcodes (SHL)')
    t.assert(!constantinopleResult.execResult.exceptionError, 'constantinople can access the SHL opcode')

    t.end()
})