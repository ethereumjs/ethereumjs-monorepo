import { runPrecompile } from './util.ts'

const main = async () => {
  // BLS12_G1ADD precompile (address 0xb)
  // Data taken from test/eips/precompiles/bls/add_G1_bls.json
  // Input: G1 and G2 points (each 128 bytes = 256 hex characters)
  const g1Point =
    '0000000000000000000000000000000017f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb0000000000000000000000000000000008b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1'
  const g2Point =
    '00000000000000000000000000000000112b98340eee2777cc3c14163dea3ec97977ac3dc5c70da32e6e87578f44912e902ccef9efe28d4a78b8999dfbca942600000000000000000000000000000000186b28d92356c4dfec4b5201ad099dbdede3781f8998ddf929b4cd7756192185ca7b8f4ef7088f813270ac3d48868a21'
  const data = `0x${g1Point}${g2Point}`

  await runPrecompile('BLS12_G1ADD', '0xb', data)
}

void main()
