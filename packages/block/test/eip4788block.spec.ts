import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { KECCAK256_RLP, bytesToHex, zeros } from '@ethereumjs/util'
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
            beaconRoot: zeros(32),
          },
          {
            common: earlyCommon,
          }
        )
      },
      'A beaconRoot for a header can only be provided with EIP4788 being activated',
      undefined,
      'should throw when setting beaconRoot with EIP4788 not being activated'
    )

    assert.throws(
      () => {
        BlockHeader.fromHeaderData(
          {
            dataGasUsed: 1n,
          },
          {
            common: earlyCommon,
          }
        )
      },
      'data gas used can only be provided with EIP4844 activated',
      undefined,
      'should throw when setting dataGasUsed with EIP4844 not being activated'
    )
    assert.doesNotThrow(() => {
      BlockHeader.fromHeaderData(
        {
          excessDataGas: 0n,
          dataGasUsed: 0n,
          beaconRoot: zeros(32),
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
      block.toJSON().header?.beaconRoot,
      bytesToHex(KECCAK256_RLP),
      'JSON output includes excessDataGas'
    )
  })
})
