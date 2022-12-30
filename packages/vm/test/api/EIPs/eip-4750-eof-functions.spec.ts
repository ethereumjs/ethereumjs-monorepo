import { ERROR } from '@ethereumjs/evm/dist/exceptions'
import * as tape from 'tape'

import { eip_util } from './eipUtils'

import type { eipTestCase } from './eipUtils'

tape('EIP 4750 tests', (t) => {
  t.test('test CALLF errors', async (st) => {
    const vm = await eip_util.setUpVM([3540, 5450, 3860, 5450, 4200, 4750, 3670])
    let nonce = 0

    const cases: [string, number[], [number, number, number?][], string][] = [
      ['B00000', [3], [[0, 0]], ERROR.CALLF_RETURN_STACK_FULL],
    ]

    for (const testCase of cases) {
      const code = eip_util.getEOFCode(testCase[0], testCase[1], testCase[2])
      const { result } = await eip_util.runTx(vm, code, nonce++)
      st.equal(
        result.execResult.exceptionError?.error,
        testCase[3],
        'EIP 4750: ' + testCase[0] + ' failed: ' + testCase[3]
      )
    }
  })

  t.test('test CALLF/RETF execution', async (st) => {
    const vm = await eip_util.setUpVM([3540, 5450, 3860, 5450, 4200, 4750, 3670])
    let nonce = 0

    // ADD RETF
    const codeAdd: [string, number, number, number] = ['01B1', 2, 1, 1]
    // function which has output 5
    const output5: [string, number, number, number] = ['6005B1', 0, 1, 1]

    const cases: eipTestCase[] = [
      {
        code: [
          [
            eip_util.callFunc(2) + eip_util.callFunc(2) + eip_util.callFunc(1) + '60005500',
            0,
            0,
            2,
          ],
          codeAdd,
          output5,
        ],
        expect: '0a', // 10
        name: 'simple add test',
      },
      {
        code: [
          [
            eip_util.callFunc(1) + eip_util.callFunc(1) + eip_util.callFunc(2) + '60005500',
            0,
            0,
            2,
          ],
          output5,
          codeAdd,
        ],
        expect: '0a', // 10
        name: 'simple add test (functions now in different order)',
      },
    ]

    for (const testCase of cases) {
      const code = eip_util.createEOFCode(testCase.code)
      const { result } = await eip_util.runTx(vm, code, nonce++)
      const value = await vm.stateManager.getContractStorage(
        result.createdAddress!,
        Buffer.from('00'.repeat(32), 'hex')
      )
      st.equals(value.toString('hex'), testCase.expect, testCase.name)
    }
  })
})
