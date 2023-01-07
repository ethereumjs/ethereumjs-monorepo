import { ERROR } from '@ethereumjs/evm/src/exceptions'
import * as tape from 'tape'

import { eip_util } from './utils'

import type { IeipTestCase, evmFunction } from './utils'
import type { TypeSection } from '@ethereumjs/evm/src/eof/container'

interface IgetEOFCodeOpts {
  function: string
  typeHeaders: TypeSection[]
  sizes: number[]
  result: string
}

tape('EIP 4750 tests', (t) => {
  t.test('test CALLF errors', async (st) => {
    const vm = await eip_util.setUpVM([3540, 5450, 3860, 5450, 4200, 4750, 3670])
    let nonce = 0

    const cases: IgetEOFCodeOpts[] = [
      {
        function: 'B0000000',
        typeHeaders: [
          {
            inputs: 0,
            outputs: 0,
            maxStackHeight: 0,
          },
        ],
        sizes: [4],
        result: ERROR.CALLF_RETURN_STACK_FULL,
      },
    ]

    for (const testCase of cases) {
      const code = eip_util.getEOFCode(testCase.function, testCase.sizes, testCase.typeHeaders)
      const { result } = await eip_util.runTx(vm, code, nonce++)
      st.equal(
        result.execResult.exceptionError?.error.slice(0, testCase.result.length),
        testCase.result,
        'EIP 4750: ' + testCase.function + ' failed: ' + testCase.result
      )
    }
  })

  t.test('test CALLF/RETF execution', async (st) => {
    // ADD RETF
    const codeAdd: evmFunction = {
      function: '01B1',
      inputs: 2,
      outputs: 1,
      maxStackHeight: 2,
    }
    // function which has output 5
    const output5: evmFunction = {
      function: '6005B1',
      inputs: 0,
      outputs: 1,
      maxStackHeight: 1,
    }

    const cases: IeipTestCase[] = [
      {
        code: [
          {
            function:
              eip_util.callFunc(2) + eip_util.callFunc(2) + eip_util.callFunc(1) + '60005500',
            inputs: 0,
            outputs: 0,
            maxStackHeight: 2,
          },
          codeAdd,
          output5,
        ],
        expect: '0a', // 10
        name: 'simple add test',
      },
      {
        code: [
          {
            function:
              eip_util.callFunc(1) + eip_util.callFunc(1) + eip_util.callFunc(2) + '60005500',
            inputs: 0,
            outputs: 0,
            maxStackHeight: 2,
          },
          output5,
          codeAdd,
        ],
        expect: '0a', // 10
        name: 'simple add test (functions now in different order)',
      },
    ]

    for (const testCase of cases) {
      const vm = await eip_util.setUpVM([3540, 5450, 3860, 5450, 4200, 4750, 3670])
      let nonce = 0
      const code = eip_util.createEOFCode(testCase.code)
      const { result } = await eip_util.runTx(vm, code, nonce++)
      const value = await vm.stateManager.getContractStorage(
        result.createdAddress!,
        Buffer.from('00'.repeat(32), 'hex')
      )
      st.equals(value.toString('hex'), testCase.expect, testCase.name)
    }
    st.end()
  })
  t.end()
})
