import { Hardfork } from '@ethereumjs/common'
import { runPrecompile } from './util.ts'

const main = async () => {
  // MODEXP precompile (address 0x05)
  // Calculate: 2^3 mod 5 = 8 mod 5 = 3
  //
  // Input format:
  // - First 32 bytes: base length (0x01 = 1 byte)
  // - Next 32 bytes: exponent length (0x01 = 1 byte)
  // - Next 32 bytes: modulus length (0x01 = 1 byte)
  // - Next 1 byte: base value (0x02 = 2)
  // - Next 1 byte: exponent value (0x03 = 3)
  // - Next 1 byte: modulus value (0x05 = 5)

  const baseLen = '0000000000000000000000000000000000000000000000000000000000000001' // 1 byte
  const expLen = '0000000000000000000000000000000000000000000000000000000000000001' // 1 byte
  const modLen = '0000000000000000000000000000000000000000000000000000000000000001' // 1 byte
  const base = '02' // 2
  const exponent = '03' // 3
  const modulus = '05' // 5

  const data = `0x${baseLen}${expLen}${modLen}${base}${exponent}${modulus}`

  await runPrecompile('MODEXP', '0x05', data)
  await runPrecompile('MODEXP', '0x05', data, Hardfork.Cancun)
}

void main()
