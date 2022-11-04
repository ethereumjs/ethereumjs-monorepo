import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Address, KECCAK256_RLP } from '@ethereumjs/util'
import * as tape from 'tape'

import { Block } from '../src/block'
import { BlockHeader } from '../src/header'

import type { Withdrawal } from '../src'

const common = new Common({
  eips: [4895],
  chain: Chain.Mainnet,
  hardfork: Hardfork.Merge,
})

// Small hack to hack in the activation block number
// (Otherwise there would be need for a custom chain only for testing purposes)
common.hardforkBlock = function (hardfork: string | undefined) {
  if (hardfork === 'london') {
    return BigInt(1)
  } else if (hardfork === 'dao') {
    // Avoid DAO HF side-effects
    return BigInt(99)
  }
  return BigInt(0)
}

tape('EIP1559 tests', function (t) {
  t.test('Header tests', function (st) {
    const earlyCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    st.throws(() => {
      BlockHeader.fromHeaderData(
        {
          withdrawalsRoot: Buffer.from('00'.repeat(32), 'hex'),
        },
        {
          common: earlyCommon,
        }
      )
    }, 'should throw when setting withdrawalsRoot with EIP4895 not being activated')
    st.throws(() => {
      BlockHeader.fromHeaderData(
        {},
        {
          common,
        }
      )
    }, 'should throw when withdrawalsRoot is undefined with EIP4895 being activated')
    st.doesNotThrow(() => {
      BlockHeader.fromHeaderData(
        {
          withdrawalsRoot: Buffer.from('00'.repeat(32), 'hex'),
        },
        {
          common,
        }
      )
    }, 'correctly instantiates an EIP4895 block header')
    st.end()
  })
  t.test('Block tests', async function (st) {
    const earlyCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    st.throws(() => {
      Block.fromBlockData(
        {
          withdrawals: [],
        },
        {
          common: earlyCommon,
        }
      )
    }, 'should throw when setting withdrawals with EIP4895 not being activated')
    st.throws(() => {
      Block.fromBlockData(
        {},
        {
          common,
        }
      )
    }, 'should throw when withdrawals is undefined with EIP4895 being activated')
    st.doesNotThrow(() => {
      Block.fromBlockData(
        {
          header: {
            withdrawalsRoot: Buffer.from('00'.repeat(32), 'hex'),
          },
          withdrawals: [],
        },
        {
          common,
        }
      )
    })
    const block = Block.fromBlockData(
      {
        header: {
          withdrawalsRoot: Buffer.from('00'.repeat(32), 'hex'),
        },
        withdrawals: [],
      },
      {
        common,
      }
    )
    st.notOk(await block.validateWithdrawalsTrie(), 'should invalidate the withdrawals root')
    const validHeader = BlockHeader.fromHeaderData(
      {
        withdrawalsRoot: KECCAK256_RLP,
      },
      { common }
    )
    const validBlock = Block.fromBlockData(
      {
        header: validHeader,
        withdrawals: [],
      },
      {
        common,
      }
    )
    st.ok(await validBlock.validateWithdrawalsTrie(), 'should validate withdrawals root')

    const withdrawal = <Withdrawal>{
      index: BigInt(0),
      validatorIndex: BigInt(0),
      address: new Address(Buffer.from('20'.repeat(20), 'hex')),
      amount: BigInt(1000),
    }

    const validBlockWithWithdrawal = Block.fromBlockData(
      {
        header: {
          withdrawalsRoot: Buffer.from(
            '69f28913c562b0d38f8dc81e72eb0d99052444d301bf8158dc1f3f94a4526357',
            'hex'
          ),
        },
        withdrawals: [withdrawal],
      },
      {
        common,
      }
    )
    st.ok(
      await validBlockWithWithdrawal.validateWithdrawalsTrie(),
      'should validate withdrawals root'
    )

    const withdrawal2 = <Withdrawal>{
      index: BigInt(1),
      validatorIndex: BigInt(11),
      address: new Address(Buffer.from('30'.repeat(20), 'hex')),
      amount: BigInt(2000),
    }

    const validBlockWithWithdrawal2 = Block.fromBlockData(
      {
        header: {
          withdrawalsRoot: Buffer.from(
            'cb1accdf466a644291e7b5f0374a3d490d7c5545f9a346f8652f65b3960e720e',
            'hex'
          ),
        },
        withdrawals: [withdrawal, withdrawal2],
      },
      {
        common,
      }
    )
    st.ok(
      await validBlockWithWithdrawal2.validateWithdrawalsTrie(),
      'should validate withdrawals root'
    )
    st.doesNotThrow(() => {
      validBlockWithWithdrawal.hash()
    }, 'hashed block with withdrawals')
    st.doesNotThrow(() => {
      validBlockWithWithdrawal2.hash()
    }, 'hashed block with withdrawals')
    st.end()
  })
})
