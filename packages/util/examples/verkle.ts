import {
  VerkleLeafType,
  bytesToHex,
  decodeVerkleLeafBasicData,
  getVerkleKey,
  hexToBytes,
} from '@ethereumjs/util'

const state = {
  '0xdf67dea9181141d6255ac05c7ada5a590fb30a375023f16c31223f067319e300':
    '0x0100000001000000000000000000000001000000000000000000000000000000',
  '0xdf67dea9181141d6255ac05c7ada5a590fb30a375023f16c31223f067319e301':
    '0x923672e5275a0104000000000000000000000000000000000000000000000000',
  '0xdf67dea9181141d6255ac05c7ada5a590fb30a375023f16c31223f067319e302':
    '0x2c01000000000000000000000000000000000000000000000000000000000000',
  '0xdf67dea9181141d6255ac05c7ada5a590fb30a375023f16c31223f067319e303':
    '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
  '0xdf67dea9181141d6255ac05c7ada5a590fb30a375023f16c31223f067319e304': null,
}

const stem = hexToBytes('0xdf67dea9181141d6255ac05c7ada5a590fb30a375023f16c31223f067319e3')

const basicDataKey = getVerkleKey(stem, VerkleLeafType.BasicData)
const basicDataRaw = state[bytesToHex(basicDataKey)]
const basicData = decodeVerkleLeafBasicData(hexToBytes(basicDataRaw!))

console.log(basicData) // { version: 1, nonce: 1n, codeSize: 0, balance: 1n }
