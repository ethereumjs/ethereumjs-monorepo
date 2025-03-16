import { hexToBytes } from '@ethereumjs/util'
import { publicKeyCreate } from 'ethereum-cryptography/secp256k1-compat.js'
import { assert, describe, it } from 'vitest'

import * as message from '../src/dpt/message.ts'

const privateKey = hexToBytes('0xb71c71a67e1177ad4e901695e1b4b9ee17ae16c6668d313eac2f96dbcda3f291')
const publicKey = publicKeyCreate(privateKey, false)
describe('DPT message tests', () => {
  it('ping packet with version 4, additional list elements', () => {
    const bytes = hexToBytes(
      '0xe9614ccfd9fc3e74360018522d30e1419a143407ffcce748de3e22116b7e8dc92ff74788c0b6663aaa3d67d641936511c8f8d6ad8698b820a7cf9e1be7155e9a241f556658c55428ec0563514365799a4be2be5a685a80971ddcfa80cb422cdd0101ec04cb847f000001820cfa8215a8d790000000000000000000000000000000018208ae820d058443b9a3550102',
    )
    const msg = message.decode(bytes)

    assert.equal(msg.typename, 'ping')
    assert.equal(msg.data.version, 4)
    assert.deepEqual(msg.publicKey, publicKey)
  })

  it('ping packet with version 555, additional list elements and additional random data:', () => {
    const bytes = hexToBytes(
      '0x577be4349c4dd26768081f58de4c6f375a7a22f3f7adda654d1428637412c3d7fe917cadc56d4e5e7ffae1dbe3efffb9849feb71b262de37977e7c7a44e677295680e9e38ab26bee2fcbae207fba3ff3d74069a50b902a82c9903ed37cc993c50001f83e82022bd79020010db83c4d001500000000abcdef12820cfa8215a8d79020010db885a308d313198a2e037073488208ae82823a8443b9a355c5010203040531b9019afde696e582a78fa8d95ea13ce3297d4afb8ba6433e4154caa5ac6431af1b80ba76023fa4090c408f6b4bc3701562c031041d4702971d102c9ab7fa5eed4cd6bab8f7af956f7d565ee1917084a95398b6a21eac920fe3dd1345ec0a7ef39367ee69ddf092cbfe5b93e5e568ebc491983c09c76d922dc3',
    )
    const msg = message.decode(bytes)

    assert.equal(msg.typename, 'ping')
    assert.equal(msg.data.version, 555)
    assert.deepEqual(msg.publicKey, publicKey)
  })

  it('pong packet with additional list elements and additional random data', () => {
    const bytes = hexToBytes(
      '0x09b2428d83348d27cdf7064ad9024f526cebc19e4958f0fdad87c15eb598dd61d08423e0bf66b2069869e1724125f820d851c136684082774f870e614d95a2855d000f05d1648b2d5945470bc187c2d2216fbe870f43ed0909009882e176a46b0102f846d79020010db885a308d313198a2e037073488208ae82823aa0fbc914b16819237dcd8801d7e53f69e9719adecb3cc0e790c57e91ca4461c9548443b9a355c6010203c2040506a0c969a58f6f9095004c0177a6b47f451530cab38966a25cca5cb58f055542124e',
    )
    const msg = message.decode(bytes)

    assert.equal(msg.typename, 'pong')
    assert.deepEqual(msg.publicKey, publicKey)
  })

  it('findnode packet with additional list elements and additional random data', () => {
    const bytes = hexToBytes(
      '0xc7c44041b9f7c7e41934417ebac9a8e1a4c6298f74553f2fcfdcae6ed6fe53163eb3d2b52e39fe91831b8a927bf4fc222c3902202027e5e9eb812195f95d20061ef5cd31d502e47ecb61183f74a504fe04c51e73df81f25c4d506b26db4517490103f84eb840ca634cae0d49acb401d8a4c6b6fe8c55b70d115bf400769cc1400f3258cd31387574077f301b421bc84df7266c44e9e6d569fc56be00812904767bf5ccd1fc7f8443b9a35582999983999999280dc62cc8255c73471e0a61da0c89acdc0e035e260add7fc0c04ad9ebf3919644c91cb247affc82b69bd2ca235c71eab8e49737c937a2c396',
    )
    const msg = message.decode(bytes)

    assert.equal(msg.typename, 'findneighbours')
    assert.deepEqual(msg.publicKey, publicKey)
  })

  it('neighbours packet with additional list elements and additional random data', () => {
    const bytes = hexToBytes(
      '0xc679fc8fe0b8b12f06577f2e802d34f6fa257e6137a995f6f4cbfc9ee50ed3710faf6e66f932c4c8d81d64343f429651328758b47d3dbc02c4042f0fff6946a50f4a49037a72bb550f3a7872363a83e1b9ee6469856c24eb4ef80b7535bcf99c0004f9015bf90150f84d846321163782115c82115db8403155e1427f85f10a5c9a7755877748041af1bcd8d474ec065eb33df57a97babf54bfd2103575fa829115d224c523596b401065a97f74010610fce76382c0bf32f84984010203040101b840312c55512422cf9b8a4097e9a6ad79402e87a15ae909a4bfefa22398f03d20951933beea1e4dfa6f968212385e829f04c2d314fc2d4e255e0d3bc08792b069dbf8599020010db83c4d001500000000abcdef12820d05820d05b84038643200b172dcfef857492156971f0e6aa2c538d8b74010f8e140811d53b98c765dd2d96126051913f44582e8c199ad7c6d6819e9a56483f637feaac9448aacf8599020010db885a308d313198a2e037073488203e78203e8b8408dcab8618c3253b558d459da53bd8fa68935a719aff8b811197101a4b2b47dd2d47295286fc00cc081bb542d760717d1bdd6bec2c37cd72eca367d6dd3b9df738443b9a355010203b525a138aa34383fec3d2719a0',
    )
    const msg = message.decode(bytes)

    assert.equal(msg.typename, 'neighbours')
    assert.deepEqual(msg.publicKey, publicKey)
  })
})
