const tape = require('tape')
const { getOpcodesForHF } = require('../../dist/evm/opcodes')
const Common = require('ethereumjs-common').default

const CHAINID = 0x46

tape('getOpcodesForHF', (t) => {
  t.test('shouldnt apply istanbul opcode changes for petersburg', (st) => {
    const c = new Common('mainnet', 'petersburg')
    const opcodes = getOpcodesForHF(c)
    st.assert(opcodes[CHAINID] === undefined)
    st.end()
  })

  t.test('should correctly apply istanbul opcode when hf >= istanbul', (st) => {
    let c = new Common('mainnet', 'istanbul')
    let opcodes = getOpcodesForHF(c)
    st.equal(opcodes[CHAINID].name, 'CHAINID')

    c = new Common('mainnet', 'muirGlacier')
    opcodes = getOpcodesForHF(c)
    st.equal(opcodes[CHAINID].name, 'CHAINID')

    st.end()
  })
})
