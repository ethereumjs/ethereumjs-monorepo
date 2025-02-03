import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM, getActivePrecompiles } from '@ethereumjs/evm'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })

  // Taken from test/eips/precompiles/bls/add_G1_bls.json
  const data = hexToBytes(
    '0x0000000000000000000000000000000017f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb0000000000000000000000000000000008b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e100000000000000000000000000000000112b98340eee2777cc3c14163dea3ec97977ac3dc5c70da32e6e87578f44912e902ccef9efe28d4a78b8999dfbca942600000000000000000000000000000000186b28d92356c4dfec4b5201ad099dbdede3781f8998ddf929b4cd7756192185ca7b8f4ef7088f813270ac3d48868a21',
  )
  const gasLimit = BigInt(5000000)

  const evm = await createEVM({ common })
  const precompile = getActivePrecompiles(common).get('000000000000000000000000000000000000000b')!

  const callData = {
    data,
    gasLimit,
    common,
    _EVM: evm,
  }
  const result = await precompile(callData)
  console.log(`Precompile result:${bytesToHex(result.returnValue)}`)
}

void main()
