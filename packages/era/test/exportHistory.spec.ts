import { type PrefixedHexString, bytesToBigInt64, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { compressData, formatEntry } from '../src/index.ts'
describe('era1', async () => {
  const test: { compressed: PrefixedHexString; decompressed: PrefixedHexString } = {
    compressed:
      '0xff060000734e6150705900cb0000ec6da9a6970410f90214a0007a010088a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d4934794004a4200f043a0d7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0567a210004b9014a7800fe0100fe0100fe0100b6010004850401f098808213888080a011bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa82ea0120880000000000000042',
    decompressed:
      '0xf90214a00000000000000000000000000000000000000000000000000000000000000000a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347940000000000000000000000000000000000000000a0d7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000850400000000808213888080a011bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82faa00000000000000000000000000000000000000000000000000000000000000000880000000000000042',
  }
  const compressedHeader = Uint8Array.from(await compressData(hexToBytes(test.decompressed)))
  it('should compress header data', () => {
    assert.deepEqual(compressedHeader, hexToBytes(test.compressed))
  })

  const headerEntry = await formatEntry({
    type: new Uint8Array([0x03, 0x00]),
    data: hexToBytes(test.decompressed),
  })

  const typeBytes = headerEntry.slice(0, 2)
  it('first two bytes should be entry type', () => {
    assert.deepEqual(typeBytes, new Uint8Array([0x03, 0x00]))
  })

  const lengthBytes = Uint8Array.from([...headerEntry.slice(2, 8)])

  const compressedHeaderLength = bytesToBigInt64(lengthBytes, true)

  it('should have length bytes', () => {
    assert.deepEqual(lengthBytes, Uint8Array.from([217, 0, 0, 0, 0, 0]))
  })
  it(`length bytes should equal: ${compressedHeader.length}`, () => {
    assert.equal(Number(compressedHeaderLength), compressedHeader.length)
  })
  it('first 8 bytes should match test', () => {
    assert.deepEqual(headerEntry.slice(0, 8), Uint8Array.from([3, 0, 217, 0, 0, 0, 0, 0]))
  })
})
