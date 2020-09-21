import * as tape from 'tape'
import Common from '@ethereumjs/common'
import { getOpcodesForHF } from '../../lib/evm/opcodes'

const CHAINID = 0x46

tape('getOpcodesForHF', (t) => {
  t.test('shouldnt apply istanbul opcode changes for petersburg', (st) => {
    const c = new Common({ chain: 'mainnet', hardfork: 'petersburg' })
    const opcodes = getOpcodesForHF(c)
    st.assert(opcodes.get(CHAINID) === undefined)
    st.end()
  })

  t.test('should correctly apply istanbul opcode when hf >= istanbul', (st) => {
    let c = new Common({ chain: 'mainnet', hardfork: 'istanbul' })
    let opcodes = getOpcodesForHF(c)
    st.equal(opcodes.get(CHAINID)!.name, 'CHAINID')

    c = new Common({ chain: 'mainnet', hardfork: 'muirGlacier' })
    opcodes = getOpcodesForHF(c)
    st.equal(opcodes.get(CHAINID)!.name, 'CHAINID')

    st.end()
  })
})
