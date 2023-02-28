import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { toBuffer } from '@ethereumjs/util'
import * as tape from 'tape'

import { Block } from '../src'

import * as testnetVerkleJSON from './testdata/testnetVerkleBeverlyHills.json'
import * as verkleBlockJSON from './testdata/verkleBlock.json'
import * as verkleBlockRawJSON from './testdata/verkleBlockRaw.json'

tape('[VerkleBlock]: Verkle Block Functionality (Fake-EIP-999001)', function (t) {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London, eips: [999001] })
  const verkleBlock = Block.fromBlockData(verkleBlockJSON, { common })

  t.test('should test block initialization', function (st) {
    const key = '0x695921dca3b16c5cc850e94cdd63f573c467669e89cec88935d03474d6bdf901'
    const value = '0xe703c84e676dc11b000000000000000000000000000000000000000000000000'
    st.equal(verkleBlock.header.verklePreState![key], value, 'should read in the verkle state')

    const proofStart = '0x000000000600000008'
    st.equal(
      verkleBlock.header.verkleProof!.slice(0, 20),
      proofStart,
      'should read in the verkle proof'
    )
    st.end()
  })

  t.test('Should create verkle block from array of values ', function (st) {
    const encodedRlp = RLP.encode(verkleBlockRawJSON)

    const block = Block.fromRLPSerializedBlock(toBuffer(encodedRlp), {
      common: new Common({ chain: testnetVerkleJSON, hardfork: Hardfork.London, eips: [999001] }),
    })

    // Should retrieve a verkle preState value
    // TODO: Uncomment this test once the presState is correctly parsed from the array of arrays
    console.log('block.header.verklePreState', block.header.verklePreState)
    st.equal(
      block.header.verklePreState?.[
        '0x41eaf6fa44ecbd8c21b17ea71a56910bd21d550f762636240073e50af15a6b01'
      ],
      '0x844625ead073a1022d1500000000000000000000000000000000000000000000',
      'should retrieve the verkle state'
    )

    // Should retrieve the verkle proof
    st.equal(
      block.header.verkleProof,
      '0x01000000ee26f95e9b27b4c895edfc677c0bf4c52682a6ecb60ca8e67083c5b133825c070000000a080a08080809050000006df0fac7722dd01d6c1e8d22d3173df668d0cc34c29fff3aeb9f70079df8663f4cb35b75def769c5ae0b43fb4ba4c95430623b67f136e9f3c4e0302b28359ba1347d22bdd276b5692e95b5ef18e4cc70ada2b9579b55794d5636bfa469c2ad3648a0e1ad1c5b63380ab0f554d578256f371d982ca56f2a39501f9c1e40cbe60a54e88b0e17c073272b40f626bf42fc88fa72b7a7a2d722ed198b460703c39470712d879f0ab8645f8c9a89255b28123808c3358da8a1eea5c9a697e32f7c4f2931ee740ea125ac30af7f9b25da310d291a2f944a363397bd64e32b8b43171a343966ffb1682fc6aed130d9bfeff275db4f06cd2e79bc5a4acf445e8f58fd0d5445d9a27575c4c9224b1bda2e557d164c0667f2d7a95046e7e3e4ca32cffdbb4e03a5b2cc411efb6384240c964bd314b862ab4144d86a90d59484cfabf247bdbc05032d6d96ba755a749ebd84ea821c9abba4c854b39cfa711ff20cfdc8a7a06318764115cd5ff21caebaf8283ef4d637bf90378d30e99627477cb5739279a7d524146be3a0c2d24f328fd5120125ff488b02dc9e67412081d229ecb5fbd3ca2a7042ea0aa1b96081d03765941c6334a68cedcebed62855f277d389ec16e44eeb24b090bbfe678d6fe871cf84804ab78c2c76dd0e92361e27cae0d4d07b16a7e1094c698081ea85c22d3fd88edd63678e615e0ad48c6727463be48b2f0c551daa4e86c6037fa93c0c596c71b7dfece7da6112c9c96e01a01ea1d71c8e9ace7dbf1c310c5551e1fcc7d88612085d657d7d3767671b51b622e7fa5bc2066b7b30dc45b39ff3a393927b3e6de58d29e13b0374f8e6a561bbb23e471f0563ef8737a3491b9c1e86d7e0b7e3836592dbd3bf2175ef88134b06bcaf129dc926e363d6a51bf9fb767cd5381a4f3ba485b967defc5c650f08f0e13f2915fa6903e25c01a92ba7c4310b2f80d03f69c1ee8fe6614f434785dc7cc6f546954e43b1e3f7ccfcd433b14092741bf3d938120909007258c4091ced8a7dd4ad8c29ba8add26b915',
      'should retrieve the verkle proof'
    )

    st.end()
  })
})
