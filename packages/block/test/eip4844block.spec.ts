import { Chain, Common, Hardfork } from '@ethereumjs/common'
import * as tape from 'tape'

import { BlockHeader } from '../src/header'

const gethGenesis = require('./testdata/post-merge-hardfork.json')
const common = Common.fromGethGenesis(gethGenesis, {
  chain: 'customChain',
  hardfork: Hardfork.ShardingFork,
})

// Small hack to hack in the activation block number
// (Otherwise there would be need for a custom chain only for testing purposes)
common.hardforkBlock = function (hardfork: string | undefined) {
  if (hardfork === 'shardingForkTime') {
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
  const excessDataGas = BlockHeader.fromHeaderData(
    {},
    { common, skipConsensusFormatValidation: true }
  ).excessDataGas
  t.equal(
    excessDataGas,
    0n,
    'instantiates block with reasonable default excess data gas value when not provided'
  )
  t.doesNotThrow(() => {
    BlockHeader.fromHeaderData(
      {
        excessDataGas: 0n,
      },
      {
        common,
        skipConsensusFormatValidation: true,
      }
    )
  }, 'correctly instantiates an EIP4844 block header')
  t.end()
})
