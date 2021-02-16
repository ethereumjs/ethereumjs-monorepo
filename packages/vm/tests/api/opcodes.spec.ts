import tape from 'tape'
import Common from '@ethereumjs/common'
import VM from '../../lib'

tape('VM -> getActiveOpcodes()', (t) => {
  const CHAINID = 0x46 //istanbul opcode

  t.test('should not expose opcodes from a follow-up HF (istanbul -> petersburg)', (st) => {
    const common = new Common({ chain: 'mainnet', hardfork: 'petersburg' })
    const vm = new VM({ common })
    st.equal(
      vm.getActiveOpcodes().get(CHAINID),
      undefined,
      'istanbul opcode not exposed (HF: < istanbul (petersburg)'
    )
    st.end()
  })

  t.test('should expose opcodes when HF is active (>= istanbul)', (st) => {
    let common = new Common({ chain: 'mainnet', hardfork: 'istanbul' })
    let vm = new VM({ common })
    st.equal(
      vm.getActiveOpcodes().get(CHAINID)!.name,
      'CHAINID',
      'istanbul opcode exposed (HF: istanbul)'
    )

    common = new Common({ chain: 'mainnet', hardfork: 'muirGlacier' })
    vm = new VM({ common })
    st.equal(
      vm.getActiveOpcodes().get(CHAINID)!.name,
      'CHAINID',
      'istanbul opcode exposed (HF: > istanbul (muirGlacier)'
    )

    st.end()
  })

  t.test('should update opcodes on a hardfork change', async (st) => {
    const common = new Common({ chain: 'mainnet', hardfork: 'istanbul' })
    const vm = new VM({ common })

    common.setHardfork('byzantium')
    st.equal(
      vm.getActiveOpcodes().get(CHAINID),
      undefined,
      'opcode not exposed after HF change (-> < istanbul)'
    )

    common.setHardfork('istanbul')
    st.equal(
      vm.getActiveOpcodes().get(CHAINID)!.name,
      'CHAINID',
      'opcode exposed after HF change (-> istanbul)'
    )

    st.end()
  })
})
