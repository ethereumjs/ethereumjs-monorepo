import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { bytesToHex, zeros } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { BlockHeader } from '../src/header.js'
import { Block } from '../src/index.js'

describe('EIP4788 header tests', () => {
  it('should work', () => {
    const earlyCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Cancun, eips: [4788] })

    assert.throws(
      () => {
        BlockHeader.fromHeaderData(
          {
            parentBeaconBlockRoot: zeros(32),
          },
          {
            common: earlyCommon,
          }
        )
      },
      'A parentBeaconBlockRoot for a header can only be provided with EIP4788 being activated',
      undefined,
      'should throw when setting parentBeaconBlockRoot with EIP4788 not being activated'
    )

    assert.throws(
      () => {
        BlockHeader.fromHeaderData(
          {
            blobGasUsed: 1n,
          },
          {
            common: earlyCommon,
          }
        )
      },
      'blob gas used can only be provided with EIP4844 activated',
      undefined,
      'should throw when setting blobGasUsed with EIP4844 not being activated'
    )
    assert.doesNotThrow(() => {
      BlockHeader.fromHeaderData(
        {
          excessBlobGas: 0n,
          blobGasUsed: 0n,
          parentBeaconBlockRoot: zeros(32),
        },
        {
          common,
          skipConsensusFormatValidation: true,
        }
      )
    }, 'correctly instantiates an EIP4788 block header')

    const block = Block.fromBlockData(
      {
        header: BlockHeader.fromHeaderData({}, { common }),
      },
      { common, skipConsensusFormatValidation: true }
    )
    assert.equal(
      block.toJSON().header?.parentBeaconBlockRoot,
      bytesToHex(zeros(32)),
      'JSON output includes excessBlobGas'
    )
  })
})
