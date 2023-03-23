import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { decode } from '@ethereumjs/rlp'
import { Address, KECCAK256_RLP, Withdrawal } from '@ethereumjs/util'
import * as tape from 'tape'

import { Block } from '../src/block'
import { BlockHeader } from '../src/header'

import type { WithdrawalBuffer, WithdrawalData } from '@ethereumjs/util'

const gethWithdrawals8BlockRlp =
  'f903e1f90213a0fe950635b1bd2a416ff6283b0bbd30176e1b1125ad06fa729da9f3f4c1c61710a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d4934794aa00000000000000000000000000000000000000a07f7510a0cb6203f456e34ec3e2ce30d6c5590ded42c10a9cf3f24784119c5afba056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421b901000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080018401c9c380802f80a0ff0000000000000000000000000000000000000000000000000000000000000088000000000000000007a0b695b29ec7ee934ef6a68838b13729f2d49fffe26718de16a1a9ed94a4d7d06dc0c0f901c6da8082ffff94000000000000000000000000000000000000000080f83b0183010000940100000000000000000000000000000000000000a00100000000000000000000000000000000000000000000000000000000000000f83b0283010001940200000000000000000000000000000000000000a00200000000000000000000000000000000000000000000000000000000000000f83b0383010002940300000000000000000000000000000000000000a00300000000000000000000000000000000000000000000000000000000000000f83b0483010003940400000000000000000000000000000000000000a00400000000000000000000000000000000000000000000000000000000000000f83b0583010004940500000000000000000000000000000000000000a00500000000000000000000000000000000000000000000000000000000000000f83b0683010005940600000000000000000000000000000000000000a00600000000000000000000000000000000000000000000000000000000000000f83b0783010006940700000000000000000000000000000000000000a00700000000000000000000000000000000000000000000000000000000000000'

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

tape('EIP4895 tests', function (t) {
  t.test('should correctly generate withdrawalsRoot', async function (st) {
    // get withdwalsArray
    const gethBlockBufferArray = decode(Buffer.from(gethWithdrawals8BlockRlp, 'hex'))
    const withdrawals = (gethBlockBufferArray[3] as WithdrawalBuffer[]).map((wa) =>
      Withdrawal.fromValuesArray(wa)
    )
    st.equal(withdrawals.length, 8, '8 withdrawals should have been found')
    const gethWitdrawalsRoot = (gethBlockBufferArray[0] as Buffer[])[16] as Buffer
    st.deepEqual(
      await Block.genWithdrawalsTrieRoot(withdrawals),
      gethWitdrawalsRoot,
      'withdrawalsRoot should be valid'
    )
    st.end()
  })

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
    st.doesNotThrow(() => {
      BlockHeader.fromHeaderData(
        {},
        {
          common,
        }
      )
    }, 'should not throw when withdrawalsRoot is undefined with EIP4895 being activated')
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
    st.doesNotThrow(() => {
      Block.fromBlockData(
        {},
        {
          common,
        }
      )
    }, 'should not throw when withdrawals is undefined with EIP4895 being activated')
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
    st.notOk(await block.validateWithdrawalsTrie(), 'should invalidate the empty withdrawals root')
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
    st.ok(await validBlock.validateWithdrawalsTrie(), 'should validate empty withdrawals root')

    const withdrawal = <WithdrawalData>{
      index: BigInt(0),
      validatorIndex: BigInt(0),
      address: new Address(Buffer.from('20'.repeat(20), 'hex')),
      amount: BigInt(1000),
    }

    const validBlockWithWithdrawal = Block.fromBlockData(
      {
        header: {
          withdrawalsRoot: Buffer.from(
            '897ca49edcb278aecab2688bcc2b7b7ee43524cc489672534fee332a172f1718',
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

    const withdrawal2 = <WithdrawalData>{
      index: BigInt(1),
      validatorIndex: BigInt(11),
      address: new Address(Buffer.from('30'.repeat(20), 'hex')),
      amount: BigInt(2000),
    }

    const validBlockWithWithdrawal2 = Block.fromBlockData(
      {
        header: {
          withdrawalsRoot: Buffer.from(
            '3b514862c42008079d461392e29d5b6775dd5ed370a6c4441ccb8ab742bf2436',
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
