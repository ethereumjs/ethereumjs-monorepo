import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import { Account, Address } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import { VM } from '../../../src/vm'

// Test cases source: https://gist.github.com/holiman/174548cad102096858583c6fbbb0649a
describe('EIP 2929: gas cost tests', () => {
  const initialGas = BigInt(0xffffffffff)
  const address = new Address(hexToBytes('000000000000000000000000636F6E7472616374'))
  const senderKey = hexToBytes('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109')
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin, eips: [2929] })

  const runTest = async function (test: any) {
    let i = 0
    let currentGas = initialGas
    const vm = await VM.create({ common })
    vm.evm.events!.on('step', function (step: any) {
      const gasUsed = currentGas - step.gasLeft
      currentGas = step.gasLeft

      if (test.steps.length > 0) {
        assert.equal(
          step.opcode.name,
          test.steps[i].expectedOpcode,
          `Expected Opcode: ${test.steps[i].expectedOpcode}`
        )

        // Validates the gas consumption of the (i - 1)th opcode
        // b/c the step event fires before gas is debited.
        // The first opcode of every test should be +/- irrelevant
        // (ex: PUSH) and the last opcode is always STOP
        if (i > 0) {
          const expectedGasUsed = BigInt(test.steps[i - 1].expectedGasUsed)
          assert.equal(
            true,
            gasUsed === expectedGasUsed,
            `Opcode: ${
              test.steps[i - 1].expectedOpcode
            }, Gas Used: ${gasUsed}, Expected: ${expectedGasUsed}`
          )
        }
      }
      i++
    })

    await vm.stateManager.putContractCode(address, hexToBytes(test.code))

    const unsignedTx = LegacyTransaction.fromTxData({
      gasLimit: initialGas, // ensure we pass a lot of gas, so we do not run out of gas
      to: address, // call to the contract address,
    })

    const tx = unsignedTx.sign(senderKey)

    const result = await vm.runTx({ tx, skipHardForkValidation: true })

    const totalGasUsed = initialGas - currentGas
    assert.equal(true, totalGasUsed === BigInt(test.totalGasUsed) + BigInt(21000)) // Add tx upfront cost.
    return result
  }

  const runCodeTest = async function (code: string, expectedGasUsed: bigint) {
    // setup the accounts for this test
    const privateKey = hexToBytes(
      'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109'
    )
    const contractAddress = new Address(hexToBytes('00000000000000000000000000000000000000ff'))

    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin, eips: [2929] })
    const vm = await VM.create({ common })

    await vm.stateManager.putContractCode(contractAddress, hexToBytes(code)) // setup the contract code

    // setup the call arguments
    const unsignedTx = LegacyTransaction.fromTxData({
      gasLimit: BigInt(21000 + 9000), // ensure we pass a lot of gas, so we do not run out of gas
      to: contractAddress, // call to the contract address,
      value: BigInt(1),
    })

    const tx = unsignedTx.sign(privateKey)

    const address = Address.fromPrivateKey(privateKey)
    const initialBalance = BigInt(10) ** BigInt(18)

    const account = await vm.stateManager.getAccount(address)
    await vm.stateManager.putAccount(
      address,
      Account.fromAccountData({ ...account, balance: initialBalance })
    )

    const result = await vm.runTx({ tx, skipHardForkValidation: true })

    assert.equal(result.totalGasSpent, expectedGasUsed)
  }

  // Checks EXT(codehash,codesize,balance) of precompiles, which should be 100,
  // and later checks the same operations twice against some non-precompiles. Those are
  // cheaper second time they are accessed. Lastly, it checks the BALANCE of origin and this.
  it('should charge for warm address loads correctly', async () => {
    const test = {
      code: '60013f5060023b506003315060f13f5060f23b5060f3315060f23f5060f33b5060f1315032315030315000',
      totalGasUsed: 8653,
      steps: [
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'EXTCODEHASH', expectedGasUsed: 100 },
        { expectedOpcode: 'POP', expectedGasUsed: 2 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'EXTCODESIZE', expectedGasUsed: 100 },
        { expectedOpcode: 'POP', expectedGasUsed: 2 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'BALANCE', expectedGasUsed: 100 },
        { expectedOpcode: 'POP', expectedGasUsed: 2 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'EXTCODEHASH', expectedGasUsed: 2600 },
        { expectedOpcode: 'POP', expectedGasUsed: 2 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'EXTCODESIZE', expectedGasUsed: 2600 },
        { expectedOpcode: 'POP', expectedGasUsed: 2 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'BALANCE', expectedGasUsed: 2600 },
        { expectedOpcode: 'POP', expectedGasUsed: 2 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'EXTCODEHASH', expectedGasUsed: 100 },
        { expectedOpcode: 'POP', expectedGasUsed: 2 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'EXTCODESIZE', expectedGasUsed: 100 },
        { expectedOpcode: 'POP', expectedGasUsed: 2 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'BALANCE', expectedGasUsed: 100 },
        { expectedOpcode: 'POP', expectedGasUsed: 2 },
        { expectedOpcode: 'ORIGIN', expectedGasUsed: 2 },
        { expectedOpcode: 'BALANCE', expectedGasUsed: 100 },
        { expectedOpcode: 'POP', expectedGasUsed: 2 },
        { expectedOpcode: 'ADDRESS', expectedGasUsed: 2 },
        { expectedOpcode: 'BALANCE', expectedGasUsed: 100 },
        { expectedOpcode: 'POP', expectedGasUsed: 2 },
        { expectedOpcode: 'STOP', expectedGasUsed: 0 },
      ],
    }

    const result = await runTest(test)
    assert.equal(undefined, result.execResult.exceptionError)
  })

  // Checks `extcodecopy( 0xff,0,0,0,0)` twice, (should be expensive first time),
  // and then does `extcodecopy( this,0,0,0,0)`.
  it('should charge for extcodecopy correctly', async () => {
    const test = {
      code: '60006000600060ff3c60006000600060ff3c600060006000303c00',
      totalGasUsed: BigInt(2835),
      steps: [
        { expectedOpcode: 'PUSH1', expectedGasUsed: BigInt(3) },
        { expectedOpcode: 'PUSH1', expectedGasUsed: BigInt(3) },
        { expectedOpcode: 'PUSH1', expectedGasUsed: BigInt(3) },
        { expectedOpcode: 'PUSH1', expectedGasUsed: BigInt(3) },
        { expectedOpcode: 'EXTCODECOPY', expectedGasUsed: BigInt(2600) },
        { expectedOpcode: 'PUSH1', expectedGasUsed: BigInt(3) },
        { expectedOpcode: 'PUSH1', expectedGasUsed: BigInt(3) },
        { expectedOpcode: 'PUSH1', expectedGasUsed: BigInt(3) },
        { expectedOpcode: 'PUSH1', expectedGasUsed: BigInt(3) },
        { expectedOpcode: 'EXTCODECOPY', expectedGasUsed: BigInt(100) },
        { expectedOpcode: 'PUSH1', expectedGasUsed: BigInt(3) },
        { expectedOpcode: 'PUSH1', expectedGasUsed: BigInt(3) },
        { expectedOpcode: 'PUSH1', expectedGasUsed: BigInt(3) },
        { expectedOpcode: 'ADDRESS', expectedGasUsed: BigInt(2) },
        { expectedOpcode: 'EXTCODECOPY', expectedGasUsed: BigInt(100) },
        { expectedOpcode: 'STOP', expectedGasUsed: BigInt(0) },
      ],
    }

    const result = await runTest(test)
    assert.equal(undefined, result.execResult.exceptionError)
  })

  // Checks `sload( 0x1)` followed by `sstore(loc: 0x01, val:0x11)`,
  // then 'naked' sstore:`sstore(loc: 0x02, val:0x11)` twice, and `sload(0x2)`, `sload(0x1)`.
  it('should charge for sload and sstore correctly )', async () => {
    const test = {
      code: '6001545060116001556011600255601160025560025460015400',
      totalGasUsed: 44529,
      steps: [
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'SLOAD', expectedGasUsed: 2100 },
        { expectedOpcode: 'POP', expectedGasUsed: 2 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'SSTORE', expectedGasUsed: 20000 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'SSTORE', expectedGasUsed: 22100 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'SSTORE', expectedGasUsed: 100 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'SLOAD', expectedGasUsed: 100 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'SLOAD', expectedGasUsed: 100 },
        { expectedOpcode: 'STOP', expectedGasUsed: 0 },
      ],
    }

    const result = await runTest(test)
    assert.equal(undefined, result.execResult.exceptionError)
  })

  // Calls the `identity`-precompile (cheap), then calls an account (expensive)
  // and `staticcall`s the sameaccount (cheap)
  it('should charge for pre-compiles and staticcalls correctly', async () => {
    const test = {
      code: '60008080808060046000f15060008080808060ff6000f15060008080808060ff6000fa5000',
      totalGasUsed: 2869,
      steps: [
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3 },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3 },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3 },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'CALL', expectedGasUsed: 100 },
        { expectedOpcode: 'POP', expectedGasUsed: 2 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3 },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3 },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3 },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'CALL', expectedGasUsed: 2600 },
        { expectedOpcode: 'POP', expectedGasUsed: 2 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3 },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3 },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3 },
        { expectedOpcode: 'DUP1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'STATICCALL', expectedGasUsed: 100 },
        { expectedOpcode: 'POP', expectedGasUsed: 2 },
        { expectedOpcode: 'STOP', expectedGasUsed: 0 },
      ],
    }

    const result = await runTest(test)
    assert.equal(undefined, result.execResult.exceptionError)
  })

  it('ensure warm addresses/slots are tracked transaction-wide', async () => {
    // Note: these tests were manually analyzed to check if these are correct.
    // The gas cost has been taken from these tests.

    // What is covered:
    // The called address is warm.
    // (1) Warm storage slots are kept warm during inner calls
    // (2) If a slot is marked warm, and the inner call reverts, and originally it was cold
    // then it is still cold.
    // (1) and (2) are also checked for accounts.
    // These are manually explicitly checked to ensure the right gas costs are used on
    // SLOAD or CALL operations.

    // load same storage slot twice (also in inner call)
    await runCodeTest('60005460003415601357600080808080305AF15B00', BigInt(23369))
    // call to contract, load slot 0, revert inner call. load slot 0 in outer call.
    await runCodeTest('341515600D57600054600080FD5B600080808080305AF160005400', BigInt(25374))

    // call to address 0xFFFF..FF
    const callFF = '6000808080806000195AF1'
    // call address 0xFF..FF, now call same contract again, call 0xFF..FF again (it is now warm)
    await runCodeTest(callFF + '60003415601B57600080808080305AF15B00', BigInt(23909))
    // call to contract, call 0xFF..FF, revert, call 0xFF..FF (should be cold)
    await runCodeTest(
      '341515601557' + callFF + '600080FD5B600080808080305AF1' + callFF + '00',
      BigInt(26414)
    )
  })
})
