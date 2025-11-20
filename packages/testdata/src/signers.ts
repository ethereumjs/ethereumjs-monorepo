import { Address, hexToBytes } from '@ethereumjs/util'

/**
 * Common set of Signers for internal test construction.
 * Sets of privateKeys, publicKeys, and addresses
 * Use these signers in test construction instead of hardcoding or constructing new signers.
 */

export type Signer = {
  address: Address
  privateKey: Uint8Array
  publicKey: Uint8Array
}

export const SIGNER_A: Signer = {
  address: new Address(hexToBytes('0x0b90087d864e82a284dca15923f3776de6bb016f')),
  privateKey: hexToBytes('0x64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993'),
  publicKey: hexToBytes(
    '0x40b2ebdf4b53206d2d3d3d59e7e2f13b1ea68305aec71d5d24cefe7f24ecae886d241f9267f04702d7f693655eb7b4aa23f30dcd0c3c5f2b970aad7c8a828195',
  ),
}

export const SIGNER_B: Signer = {
  address: new Address(hexToBytes('0x6f62d8382bf2587361db73ceca28be91b2acb6df')),
  privateKey: hexToBytes('0x2a6e9ad5a6a8e4f17149b8bc7128bf090566a11dbd63c30e5a0ee9f161309cd6'),
  publicKey: hexToBytes(
    '0xca0a55f6e81cb897aee6a1c390aa83435c41048faa0564b226cfc9f3df48b73e846377fb0fd606df073addc7bd851f22547afbbdd5c3b028c91399df802083a2',
  ),
}

export const SIGNER_C: Signer = {
  address: new Address(hexToBytes('0x83c30730d1972baa09765a1ac72a43db27fedce5')),
  privateKey: hexToBytes('0xf216ddcf276079043c52b5dd144aa073e6b272ad4bfeaf4fbbc044aa478d1927'),
  publicKey: hexToBytes(
    '0x555b19a5cbe6dd082a4a1e1e0520dd52a82ba24fd5598ea31f0f31666c40905ed319314c5fb06d887b760229e1c0e616294e7b1cb5dfefb71507c9112132ce56',
  ),
}

export const SIGNER_D: Signer = {
  address: new Address(hexToBytes('0x8458f408106c4875c96679f3f556a511beabe138')),
  privateKey: hexToBytes('0x159e95d07a6c64ddbafa6036cdb7b8114e6e8cdc449ca4b0468a6d0c955f991b'),
  publicKey: hexToBytes(
    '0xf02724341e2df54cf53515f079b1354fa8d437e79c5b091b8d8cc7cbcca00fd8ad854cb3b3a85b06c44ecb7269404a67be88b561f2224c94d133e5fc21be915c',
  ),
}

export const SIGNER_E: Signer = {
  address: new Address(hexToBytes('0xab80a948c661aa32d09952d2a6c4ad77a4c947be')),
  privateKey: hexToBytes('0x48ec5a6c4a7fc67b10a9d4c8a8f594a81ae42e41ed061fa5218d96abb6012344'),
  publicKey: hexToBytes(
    '0xadefb82b9f54e80aa3532263e4478739de16fcca6828f4ae842f8a07941c347fa59d2da1300569237009f0f122dc1fd6abb0db8fcb534280aa94948a5cc95f94',
  ),
}

export const SIGNER_F: Signer = {
  address: new Address(hexToBytes('0xdc7bc81ddf67d037d7439f8e6ff12f3d2a100f71')),
  privateKey: hexToBytes('0x86b0ff7b6cf70786f29f297c57562905ab0b6c32d69e177a46491e56da9e486e'),
  publicKey: hexToBytes(
    '0xd3e3d2b722e325bfc085ff5638a112b4e7e88ff13f92fc7f6cfc14b5a25e8d1545a2f27d8537b96e8919949d5f8c139ae7fc81aea7cf7fe5d43d7faaa038e35b',
  ),
}

export const SIGNER_G: Signer = {
  address: new Address(hexToBytes('0xbe862ad9abfe6f22bcb087716c7d89a26051f74c')),
  privateKey: hexToBytes('0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109'),
  publicKey: hexToBytes(
    '0x6d9038945ff8f4669201ba1e806c9a46a5034a578e4d52c031521985380392944efd6c702504d9130573bb939f5c124af95d38168546cc7207a7e0baf14172ff',
  ),
}

export const SIGNER_H: Signer = {
  address: new Address(hexToBytes('0x610adc49ecd66cbf176a8247ebd59096c031bd9f')),
  privateKey: hexToBytes('0x9c9996335451aab4fc4eac58e31a8c300e095cdbcee532d53d09280e83360355'),
  publicKey: hexToBytes(
    '0x678d3562f47faf8d305839317f188d003bb11313de8665af185469c902bc781b7988d05ec4a8af919ae12d8f97ad6ff183c310abd915125bb1a4b510621287ab',
  ),
}
