import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createEVM, getActivePrecompiles } from '../../src/index.ts'

describe('Precompiles: BN254PAIRING', () => {
  it('BN254PAIRING', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Petersburg })
    const evm = await createEVM({
      common,
    })
    const addressStr = '0000000000000000000000000000000000000008'
    const BN254PAIRING = getActivePrecompiles(common).get(addressStr)!
    const result = await BN254PAIRING({
      data: hexToBytes(
        '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c21800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa000000000000000000000000000000000000000000000000000000000000000130644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd45198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c21800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa',
      ),
      gasLimit: BigInt(0xffffff),
      common,
      _EVM: evm,
    })

    assert.deepEqual(
      result.executionGasUsed,
      BigInt(260000),
      'should use petersburg gas costs (k ^= 2 pairings)',
    )
  })
})
