import tape from 'tape'
import { Address } from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../../../src'
import { getActivePrecompiles } from '../../../../src/evm/precompiles'

tape('Precompiles: hardfork availability', (t) => {
  t.test('Test ECPAIRING availability', async (st) => {
    const ECPAIR_AddressStr = '0000000000000000000000000000000000000008'
    const ECPAIR_Address = new Address(Buffer.from(ECPAIR_AddressStr, 'hex'))

    // ECPAIR was introduced in Byzantium; check if available from Byzantium.
    const commonByzantium = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium })

    let ECPAIRING = getActivePrecompiles(commonByzantium).get(ECPAIR_AddressStr)

    if (!ECPAIRING) {
      st.fail('ECPAIRING is not available in petersburg while it should be available')
    } else {
      st.pass('ECPAIRING available in petersburg')
    }

    let vm = await VM.create({ common: commonByzantium })
    let result = await vm.evm.runCall({
      caller: Address.zero(),
      gasLimit: BigInt(0xffffffffff),
      to: ECPAIR_Address,
      value: BigInt(0),
    })

    st.equal(result.execResult.gasUsed, BigInt(100000)) // check that we are using gas (if address would contain no code we use 0 gas)

    // Check if ECPAIR is available in future hard forks.
    const commonPetersburg = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Petersburg })
    ECPAIRING = getActivePrecompiles(commonPetersburg).get(ECPAIR_AddressStr)!
    if (!ECPAIRING) {
      st.fail('ECPAIRING is not available in petersburg while it should be available')
    } else {
      st.pass('ECPAIRING available in petersburg')
    }

    vm = await VM.create({ common: commonPetersburg })
    result = await vm.evm.runCall({
      caller: Address.zero(),
      gasLimit: BigInt(0xffffffffff),
      to: ECPAIR_Address,
      value: BigInt(0),
    })

    st.equal(result.execResult.gasUsed, BigInt(100000))

    // Check if ECPAIR is not available in Homestead.
    const commonHomestead = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Homestead })
    ECPAIRING = getActivePrecompiles(commonHomestead).get(ECPAIR_AddressStr)!

    if (ECPAIRING != undefined) {
      st.fail('ECPAIRING is available in homestead while it should not be available')
    } else {
      st.pass('ECPAIRING not available in homestead')
    }

    vm = await VM.create({ common: commonHomestead })

    result = await vm.evm.runCall({
      caller: Address.zero(),
      gasLimit: BigInt(0xffffffffff),
      to: ECPAIR_Address,
      value: BigInt(0),
    })

    st.equal(result.execResult.gasUsed, BigInt(0)) // check that we use no gas, because we are calling into an address without code.

    st.end()
  })
})
