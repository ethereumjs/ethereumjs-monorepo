import { Chain, Common } from '@ethereumjs/common'
import {
  bytesToHex,
  concatBytes,
  hexToBytes,
  intToBytes,
  randomBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { EVM } from '../src/evm.js'
import { getActivePrecompiles } from '../src/index.js'

describe('custom crypto', () => {
  it('should use custom sha256 function', async () => {
    const customSha256 = (msg: Uint8Array) => {
      msg[0] = 0xff
      return msg
    }
    const customCrypto = {
      sha256: customSha256,
    }
    const msg = Uint8Array.from([0, 1, 2, 3])
    const common = new Common({ chain: Chain.Mainnet, customCrypto })
    const evm = await EVM.create({ common })
    const addressStr = '0000000000000000000000000000000000000002'
    const SHA256 = getActivePrecompiles(common).get(addressStr)!
    const result = await SHA256({
      data: msg,
      gasLimit: 0xfffffn,
      common,
      _EVM: evm,
    })
    assert.equal(result.returnValue[0], 0xff, 'used custom sha256 hashing function')
  })

  it('should use custom ecrecover function', async () => {
    const customEcrecover = (_msg: Uint8Array) => {
      return hexToBytes(
        '0x84b2586da9b582d3cb260e8fd136129c734f3c80453f48a68e8217ea0b81e08342520f318d202f27a548ad8d3f814ca76d0ee621de2cc510c29e2db4d4f39418'
      )
    }
    const customCrypto = {
      ecrecover: customEcrecover,
    }
    const msg = concatBytes(randomBytes(32), setLengthLeft(intToBytes(27), 32), randomBytes(32))
    const common = new Common({ chain: Chain.Mainnet, customCrypto })
    const evm = await EVM.create({ common })
    const addressStr = '0000000000000000000000000000000000000001'
    const ECRECOVER = getActivePrecompiles(common).get(addressStr)!
    const result = await ECRECOVER({
      data: msg,
      gasLimit: 0xfffffn,
      common,
      _EVM: evm,
    })
    assert.equal(
      bytesToHex(result.returnValue),
      '0x00000000000000000000000063304c5c6884567b84b18f5bc5774d829a32d25d',
      'used custom ecrecover hashing function'
    )
  })
})
