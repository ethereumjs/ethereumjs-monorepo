import * as tape from 'tape'
import { BN } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import VM from '../../../../dist'
import { getPrecompile } from '../../../../dist/evm/precompiles'

tape('Precompiles: hardfork availability', (t) => {
  t.test('Test ECPAIRING availability', async (st) => {
    const ECPAIR_Address = '0000000000000000000000000000000000000008'

    // ECPAIR was introduced in Byzantium; check if available from Byzantium.
    const commonByzantium = new Common({ chain: 'mainnet', hardfork: 'byzantium' })

    let ECPAIRING = getPrecompile(ECPAIR_Address, commonByzantium)

    if (!ECPAIRING) {
      st.fail('ECPAIRING is not available in petersburg while it should be available')
    } else {
      st.pass('ECPAIRING available in petersburg')
    }

    let vm = new VM({ common: commonByzantium })
    let result = await vm.runCall({
      caller: Buffer.from('0000000000000000000000000000000000000000', 'hex'),
      gasLimit: new BN(0xffffffffff),
      to: Buffer.from(ECPAIR_Address, 'hex'),
      value: new BN(0),
    })

    st.assert(result.gasUsed.toNumber() == 100000) // check that we are using gas (if address would contain no code we use 0 gas)

    // Check if ECPAIR is available in future hard forks.
    const commonPetersburg = new Common({ chain: 'mainnet', hardfork: 'petersburg' })
    ECPAIRING = getPrecompile(ECPAIR_Address, commonPetersburg)

    if (!ECPAIRING) {
      st.fail('ECPAIRING is not available in petersburg while it should be available')
    } else {
      st.pass('ECPAIRING available in petersburg')
    }

    vm = new VM({ common: commonPetersburg })
    result = await vm.runCall({
      caller: Buffer.from('0000000000000000000000000000000000000000', 'hex'),
      gasLimit: new BN(0xffffffffff),
      to: Buffer.from(ECPAIR_Address, 'hex'),
      value: new BN(0),
    })

    st.assert(result.gasUsed.toNumber() == 100000)

    // Check if ECPAIR is not available in Homestead.
    const commonHomestead = new Common({ chain: 'mainnet', hardfork: 'homestead' })
    ECPAIRING = getPrecompile(ECPAIR_Address, commonHomestead)

    if (!!ECPAIRING) {
      st.fail('ECPAIRING is available in homestead while it should not be available')
    } else {
      st.pass('ECPAIRING not available in homestead')
    }

    vm = new VM({ common: commonHomestead })

    result = await vm.runCall({
      caller: Buffer.from('0000000000000000000000000000000000000000', 'hex'),
      gasLimit: new BN(0xffffffffff),
      to: Buffer.from(ECPAIR_Address, 'hex'),
      value: new BN(0),
    })

    st.assert(result.gasUsed.toNumber() == 0) // check that we use no gas, because we are calling into an address without code.

    st.end()
  })
})
