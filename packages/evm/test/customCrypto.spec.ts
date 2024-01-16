import { Chain, Common } from '@ethereumjs/common'
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
    const evm = new EVM({ common })
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
})
