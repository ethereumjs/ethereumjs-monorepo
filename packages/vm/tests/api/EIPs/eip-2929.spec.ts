import * as tape from 'tape'
import { BN } from 'ethereumjs-util'
import VM from '../../../lib'
import Common from '@ethereumjs/common'
import { inspect } from 'util'

// Test cases source: https://gist.github.com/holiman/174548cad102096858583c6fbbb0649a
tape('EIP 2929: gas cost tests', (t) => {
  const initialGas = new BN(0xffffffffff)
  const address = Buffer.from('000000000000000000000000636F6E7472616374', 'hex')
  const common = new Common({ chain: 'mainnet', hardfork: 'berlin', eips: [2929] })

  const runTest = async function (test: any, st: tape.Test) {
    let i = 0
    let currentGas = initialGas
    const vm = new VM({ common })

    vm.on('step', function (step: any) {
      const gasUsed = currentGas.sub(step.gasLeft)
      currentGas = step.gasLeft

      if (test.steps.length) {
        st.equal(step.opcode.name, test.steps[i].expectedOpcode)

        // Validates the gas consumption of the (i - 1)th opcode
        // b/c the step event fires before gas is debited.
        // The first opcode of every test should be +/- irrelevant
        // (ex: PUSH) and the last opcode is always STOP
        if (i > 0) {
          st.equal(true, gasUsed.eq(new BN(test.steps[i - 1].expectedGasUsed)))
        }
      }
      i++
    })

    const result = await vm.runCode({
      code: Buffer.from(test.code, 'hex'),
      gasLimit: initialGas,
      address: address,
      origin: address,
    })

    const totalGasUsed = initialGas.sub(currentGas)
    st.equal(true, totalGasUsed.eq(new BN(test.totalGasUsed)))
    return result
  }

  // Checks EXT(codehash,codesize,balance) of precompiles, which should be 100,
  // and later checks the same operations twice against some non-precompiles. Those are
  // cheaper second time they are accessed. Lastly, it checks the BALANCE of origin and this.
  t.test('should charge for warm address loads correctly', async (st) => {
    const test = {
      code:
        '60013f5060023b506003315060f13f5060f23b5060f3315060f23f5060f33b5060f1315032315030315000',
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

    const result = await runTest(test, st)
    st.equal(undefined, result.exceptionError)
    st.end()
  })

  // Checks `extcodecopy( 0xff,0,0,0,0)` twice, (should be expensive first time),
  // and then does `extcodecopy( this,0,0,0,0)`.
  t.test('should charge for extcodecopy correctly', async (st) => {
    const test = {
      code: '60006000600060ff3c60006000600060ff3c600060006000303c00',
      totalGasUsed: 2835,
      steps: [
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'EXTCODECOPY', expectedGasUsed: 2600 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'EXTCODECOPY', expectedGasUsed: 100 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'PUSH1', expectedGasUsed: 3 },
        { expectedOpcode: 'ADDRESS', expectedGasUsed: 2 },
        { expectedOpcode: 'EXTCODECOPY', expectedGasUsed: 100 },
        { expectedOpcode: 'STOP', expectedGasUsed: 0 },
      ],
    }

    const result = await runTest(test, st)
    st.equal(undefined, result.exceptionError)
    st.end()
  })

  // Checks `sload( 0x1)` followed by `sstore(loc: 0x01, val:0x11)`,
  // then 'naked' sstore:`sstore(loc: 0x02, val:0x11)` twice, and `sload(0x2)`, `sload(0x1)`.
  t.test('should charge for sload and sstore correctly )', async (st) => {
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

    const result = await runTest(test, st)
    st.equal(undefined, result.exceptionError)
    st.end()
  })

  // Calls the `identity`-precompile (cheap), then calls an account (expensive)
  // and `staticcall`s the sameaccount (cheap)
  t.test('should charge for pre-compiles and staticcalls correctly', async (st) => {
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

    const result = await runTest(test, st)
    st.equal(undefined, result.exceptionError)
    st.end()
  })
})
