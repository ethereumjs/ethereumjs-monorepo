const BN = require('bn.js')
const tape = require('tape')
const Common = require('@ethereumjs/common').default
const util = require('ethereumjs-util')
const VM = require('../../../../dist/index').default
const { getPrecompile } = require('../../../../dist/evm/precompiles')

tape('Precompiles: hardfork availability', (t) => {
    t.test('Test ECPAIRING availability', async (st) => {
      const ECPAIR_Address = "0000000000000000000000000000000000000008"

      // ECPAIR was introduced in Byzantium; check if available from Byzantium.
      const commonByzantium = new Common('mainnet', 'byzantium')
      let ECPAIRING = getPrecompile(ECPAIR_Address, commonByzantium)
        
      if (!ECPAIRING) {
        st.fail("ECPAIRING is not available in petersburg while it should be available")
      } else {
        st.pass("ECPAIRING available in petersburg")
      }

      let vm = new VM({ common: commonByzantium })
      let result = await vm.runCall({
            caller: Buffer.from('0000000000000000000000000000000000000000', 'hex'),
            gasLimit: new BN(0xffffffffff),
            to: Buffer.from(ECPAIR_Address, 'hex'),
            value: new BN(0)
      })
      st.assert(result.gasUsed.toNumber() == 100000) // check that we are using gas (if address would contain no code we use 0 gas)


      // Check if ECPAIR is available in future hard forks.
      const commonPetersburg = new Common('mainnet', 'petersburg')
      ECPAIRING = getPrecompile(ECPAIR_Address, commonPetersburg)
        
      if (!ECPAIRING) {
        st.fail("ECPAIRING is not available in petersburg while it should be available")
      } else {
        st.pass("ECPAIRING available in petersburg")
      }

      vm = new VM({ common: commonPetersburg })
      result = await vm.runCall({
            caller: Buffer.from('0000000000000000000000000000000000000000', 'hex'),
            gasLimit: new BN(0xffffffffff),
            to: Buffer.from(ECPAIR_Address, 'hex'),
            value: new BN(0)
      })
      st.assert(result.gasUsed.toNumber() == 100000)
        

      // Check if ECPAIR is not available in Homestead.
      const commonHomestead = new Common('mainnet', 'homestead')
      ECPAIRING = getPrecompile(ECPAIR_Address, commonHomestead)

      if (ECPAIRING) {
        st.fail("ECPAIRING is available in homestead while it should not be available")
      } else {
        st.pass("ECPAIRING not available in homestead")
      }

      vm = new VM({ common: commonHomestead })
      result = await vm.runCall({
            caller: Buffer.from('0000000000000000000000000000000000000000', 'hex'),
            gasLimit: new BN(0xffffffffff),
            to: Buffer.from(ECPAIR_Address, 'hex'),
            value: new BN(0)
      })
      st.assert(result.gasUsed.toNumber() == 0) // check that we use no gas, because we are calling into an address without code.

      st.end()
    })
  })