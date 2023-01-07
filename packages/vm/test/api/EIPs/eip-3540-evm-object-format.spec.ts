import * as tape from 'tape'

import { eip_util } from './utils'

import type { IeipTestCase, evmFunction } from './utils'

tape('EIP 3540 requires other EIPs', async (st) => {
  try {
    await eip_util.setUpVM([3540])
  } catch (e) {
    st.equal(
      (e as any).message,
      '3540 requires EIP 3860, but is not included in the EIP list',
      'EIP 3540 requires EIP 3860'
    )
    try {
      await eip_util.setUpVM([3540, 3860])
    } catch (e) {
      st.equal(
        (e as any).message,
        '3540 requires EIP 4750, but is not included in the EIP list',
        'EIP 3540 requires EIP 4750'
      )
      try {
        await eip_util.setUpVM([3540, 3860, 4750])
      } catch (e) {
        st.equal(
          (e as any).message,
          '3540 requires EIP 5450, but is not included in the EIP list',
          'EIP 3540 requires EIP 5450'
        )
        await eip_util.setUpVM([3540, 3860, 4750, 5450, 3670, 4200])
      }
    }
  }
})
/**
 * TODO add tests:
    Legacy init code
      Returns valid EOF1 code
      Returns invalid EOF1 code
    Valid EOF1 init code
      Returns legacy code (INVALID)
      Returns valid EOF1 code
      Returns invalid EOF1 code
    Invalid EOF1 init code
    

    These tests:
      On a create transaction, if either initcode or th created address is invalid, consume ALL gas
      On a CREATE(2) opcode, if either initcode or the returned data is invalid (i.e. it is legacy or invalid EOF) consume only execution gas
 */

const offset = '13'
const CREATEDeploy = '0x60' + offset + '380360' + offset + '60003960' + offset + '380360006000F000'

const create2offset = '15'
const CREATE2Deploy =
  '0x600060' +
  create2offset +
  '380360' +
  create2offset +
  '60003960' +
  create2offset +
  '380360006000F500'

function deployCreateCode(initcode: string) {
  return CREATEDeploy + initcode
}

function deployCreate2Code(initcode: string) {
  return CREATE2Deploy + initcode
}

tape('ensure invalid EOF initcode in EIP-3540 does not consume all gas', (t) => {
  // ADD RETF
  const codeAdd: evmFunction = { function: '01B1', inputs: 2, outputs: 1, maxStackHeight: 2 }
  // function which has output 5
  const output5: evmFunction = { function: '6005B1', inputs: 0, outputs: 1, maxStackHeight: 1 }
  const cases: IeipTestCase[] = [
    {
      code: [
        {
          function: eip_util.callFunc(2) + eip_util.callFunc(2) + eip_util.callFunc(1) + '60005500',
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
  ]
  const code = eip_util.createEOFCode(cases[0].code)
  const bad_code = code.slice(0, -2)
  t.test('case: tx', async (st) => {
    const vm = await eip_util.setUpVM([3540, 3860, 4750, 5450, 3670, 4200])
    const vm2 = await eip_util.setUpVM([3540, 3860, 4750, 5450, 3670, 4200])
    let nonce = 0
    let nonce2 = 0

    const res = await eip_util.runTx(vm, code, nonce++)
    st.ok(res.result.createdAddress !== undefined, 'succesfully created EOF contract using tx')
    const bad_res = await eip_util.runTx(vm2, bad_code, nonce2++)
    st.ok(
      res.result.totalGasSpent < bad_res.result.totalGasSpent,
      `Invalid EOF contract creation tx which contained an EOF contract consumed all gas: ${bad_res.result.totalGasSpent}/${res.result.totalGasSpent}`
    )
    st.end()
  })
  t.test('case: create', async (st) => {
    const vm = await eip_util.setUpVM([3540, 3860, 4750, 5450, 3670, 4200])

    let data = deployCreateCode(code.slice(2))
    const res = await eip_util.runTx(vm, data, 0)

    data = deployCreateCode(bad_code.slice(2))
    const res2 = await eip_util.runTx(vm, data, 1)
    st.ok(
      res.result.totalGasSpent > res2.result.totalGasSpent,
      'invalid initcode did not consume all gas'
    )
    st.end()
  })

  t.test('case: create2', async (st) => {
    const vm = await eip_util.setUpVM([3540, 3860, 4750, 5450, 3670, 4200])

    let data = deployCreate2Code(code.slice(2))
    const res = await eip_util.runTx(vm, data, 0)

    data = deployCreate2Code(bad_code.slice(2))
    const res2 = await eip_util.runTx(vm, data, 1)
    st.ok(
      res.result.totalGasSpent > res2.result.totalGasSpent,
      'invalid initcode did not consume all gas'
    )
    st.end()
  })

  t.end()
})
