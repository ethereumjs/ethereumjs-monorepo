import tape from 'tape'
import VM from '../../../src'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { InterpreterStep } from '../../../src/evm/interpreter'
import { ERROR } from '../../../src/exceptions'

tape('EIP 3541 tests', (t) => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart, eips: [3855] })
  const commonNoEIP3855 = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.Chainstart,
    eips: [],
  })

  t.test('should correctly use push0 opcode', async (st) => {
    const vm = await VM.create({ common })
    let stack: bigint[]

    vm.on('step', (e: InterpreterStep) => {
      if (stack) {
        st.fail('should only do PUSH0 once')
      }
      stack = e.stack
    })

    const result = await vm.evm.runCode({
      code: Buffer.from('5F', 'hex'),
      gasLimit: BigInt(10),
    })

    st.ok(stack!.length == 1)
    st.equal(stack![0], BigInt(0))
    st.equal(result.gasUsed, common.param('gasPrices', 'push0'))
    st.end()
  })

  t.test('should correctly use push0 to create a stack with stack limit length', async (st) => {
    const vm = await VM.create({ common })
    let stack: bigint[] = []

    vm.on('step', (e: InterpreterStep) => {
      stack = e.stack
    })

    const depth = Number(common.param('vm', 'stackLimit'))

    const result = await vm.evm.runCode({
      code: Buffer.from('5F'.repeat(depth), 'hex'),
      gasLimit: BigInt(10000),
    })

    st.ok(stack.length == depth)
    stack.forEach((elem: bigint) => {
      if (elem !== BigInt(0)) {
        st.fail('stack element is not 0')
      }
    })
    st.equal(result.gasUsed, common.param('gasPrices', 'push0')! * BigInt(depth))
    st.end()
  })

  t.test('should correctly use push0 to create a stack with stack limit + 1 length', async (st) => {
    const vm = await VM.create({ common })

    const depth = Number(common.param('vm', 'stackLimit')!) + 1

    const result = await vm.evm.runCode({
      code: Buffer.from('5F'.repeat(depth), 'hex'),
      gasLimit: BigInt(10000),
    })

    st.equal(result.exceptionError?.error, ERROR.STACK_OVERFLOW)
    st.end()
  })

  t.test('push0 is not available if EIP3855 is not activated', async (st) => {
    const vm = await VM.create({ common: commonNoEIP3855 })

    const result = await vm.evm.runCode({
      code: Buffer.from('5F', 'hex'),
      gasLimit: BigInt(10000),
    })

    st.equal(result.exceptionError!.error, ERROR.INVALID_OPCODE)
  })
})
