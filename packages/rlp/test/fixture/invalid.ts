export const invalidData = {
  source: 'https://github.com/ethereum/tests/blob/develop/RLPTests/invalidRLPTest.json',
  version: 'ethereum/tests v7.0.1',
  commit: '7693364be004b4a00f0efd8c1cba77becf2f87e0',
  date: '2019-06-23',
  tests: {
    int32Overflow: {
      in: 'INVALID',
      out: '0xbf0f000000000000021111',
    },

    int32Overflow2: {
      in: 'INVALID',
      out: '0xff0f000000000000021111',
    },

    wrongSizeList: {
      in: 'INVALID',
      out: '0xf80180',
    },

    wrongSizeList2: {
      in: 'INVALID',
      out: '0xf80100',
    },

    incorrectLengthInArray: {
      in: 'INVALID',
      out: '0xb9002100dc2b275d0f74e8a53e6f4ec61b27f24278820be3f82ea2110e582081b0565df0',
    },

    randomRLP: {
      in: 'INVALID',
      out: '0xf861f83eb9002100dc2b275d0f74e8a53e6f4ec61b27f24278820be3f82ea2110e582081b0565df027b90015002d5ef8325ae4d034df55d4b58d0dfba64d61ddd17be00000b9001a00dae30907045a2f66fa36f2bb8aa9029cbb0b8a7b3b5c435ab331',
    },

    bytesShouldBeSingleByte00: {
      in: 'INVALID',
      out: '0x8100',
    },

    bytesShouldBeSingleByte01: {
      in: 'INVALID',
      out: '0x8101',
    },

    bytesShouldBeSingleByte7F: {
      in: 'INVALID',
      out: '0x817F',
    },

    leadingZerosInLongLengthArray1: {
      in: 'INVALID',
      out: 'b90040000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f',
    },

    leadingZerosInLongLengthArray2: {
      in: 'INVALID',
      out: 'b800',
    },

    leadingZerosInLongLengthList1: {
      in: 'INVALID',
      out: 'fb00000040000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f',
    },

    leadingZerosInLongLengthList2: {
      in: 'INVALID',
      out: 'f800',
    },

    nonOptimalLongLengthArray1: {
      in: 'INVALID',
      out: 'b81000112233445566778899aabbccddeeff',
    },

    nonOptimalLongLengthArray2: {
      in: 'INVALID',
      out: 'b801ff',
    },

    nonOptimalLongLengthList1: {
      in: 'INVALID',
      out: 'f810000102030405060708090a0b0c0d0e0f',
    },

    nonOptimalLongLengthList2: {
      in: 'INVALID',
      out: 'f803112233',
    },

    lessThanShortLengthArray1: {
      in: 'INVALID',
      out: '81',
    },

    lessThanShortLengthArray2: {
      in: 'INVALID',
      out: 'a0000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e',
    },

    lessThanShortLengthList1: {
      in: 'INVALID',
      out: 'c5010203',
    },

    lessThanShortLengthList2: {
      in: 'INVALID',
      out: 'e201020304050607',
    },

    lessThanLongLengthArray1: {
      in: 'INVALID',
      out: 'ba010000aabbccddeeff',
    },

    lessThanLongLengthArray2: {
      in: 'INVALID',
      out: 'b840ffeeddccbbaa99887766554433221100',
    },

    lessThanLongLengthList1: {
      in: 'INVALID',
      out: 'f90180',
    },

    lessThanLongLengthList2: {
      in: 'INVALID',
      out: 'ffffffffffffffffff0001020304050607',
    },
  },
}
