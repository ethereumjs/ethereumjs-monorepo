import { Chain, Common, Hardfork } from '@ethereumjs/common'
import * as tape from 'tape'

import { BlockHeader } from '../src/header'

const common = new Common({
  eips: [4844],
  chain: Chain.Mainnet,
  hardfork: Hardfork.Merge,
})

// Small hack to hack in the activation block number
// (Otherwise there would be need for a custom chain only for testing purposes)
common.hardforkBlock = function (hardfork: string | undefined) {
  if (hardfork === 'merge') {
    return BigInt(1)
  } else if (hardfork === 'dao') {
    // Avoid DAO HF side-effects
    return BigInt(99)
  }
  return BigInt(0)
}

tape('EIP4844 header tests', function (t) {
  const earlyCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
  t.throws(
    () => {
      BlockHeader.fromHeaderData(
        {
          excessDataGas: 1n,
        },
        {
          common: earlyCommon,
        }
      )
    },
    (err: any) => {
      return (
        err.message.toString() === 'excess data gas can only be provided with EIP4844 activated'
      )
    },
    'should throw when setting excessDataGas with EIP4844 not being activated'
  )
  t.throws(
    () => {
      BlockHeader.fromHeaderData(
        {},
        {
          common,
        }
      )
    },
    (err: any) =>
      err.message.toString() === 'excessDataGas value must be provided with EIP4844 activated',
    'should throw when excessDatGas is undefined with EIP4844 being activated'
  )
  t.doesNotThrow(() => {
    BlockHeader.fromHeaderData(
      {
        excessDataGas: 0n,
      },
      {
        common,
      }
    )
  }, 'correctly instantiates an EIP4844 block header')
  t.end()
})
