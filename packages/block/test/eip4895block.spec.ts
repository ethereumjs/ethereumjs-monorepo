import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { Address, KECCAK256_RLP, Withdrawal, hexStringToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Block } from '../src/block.js'
import { BlockHeader } from '../src/header.js'

import type { WithdrawalBytes, WithdrawalData } from '@ethereumjs/util'

const gethWithdrawals8BlockRlp =
  'f903e1f90213a0fe950635b1bd2a416ff6283b0bbd30176e1b1125ad06fa729da9f3f4c1c61710a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d4934794aa00000000000000000000000000000000000000a07f7510a0cb6203f456e34ec3e2ce30d6c5590ded42c10a9cf3f24784119c5afba056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421b901000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080018401c9c380802f80a0ff0000000000000000000000000000000000000000000000000000000000000088000000000000000007a0b695b29ec7ee934ef6a68838b13729f2d49fffe26718de16a1a9ed94a4d7d06dc0c0f901c6da8082ffff94000000000000000000000000000000000000000080f83b0183010000940100000000000000000000000000000000000000a00100000000000000000000000000000000000000000000000000000000000000f83b0283010001940200000000000000000000000000000000000000a00200000000000000000000000000000000000000000000000000000000000000f83b0383010002940300000000000000000000000000000000000000a00300000000000000000000000000000000000000000000000000000000000000f83b0483010003940400000000000000000000000000000000000000a00400000000000000000000000000000000000000000000000000000000000000f83b0583010004940500000000000000000000000000000000000000a00500000000000000000000000000000000000000000000000000000000000000f83b0683010005940600000000000000000000000000000000000000a00600000000000000000000000000000000000000000000000000000000000000f83b0783010006940700000000000000000000000000000000000000a00700000000000000000000000000000000000000000000000000000000000000'

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Shanghai,
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

describe('EIP4895 tests', () => {
  it('should correctly generate withdrawalsRoot', async () => {
    // get withdwalsArray
    const gethBlockBytesArray = RLP.decode(hexStringToBytes(gethWithdrawals8BlockRlp))
    const withdrawals = (gethBlockBytesArray[3] as WithdrawalBytes[]).map((wa) =>
      Withdrawal.fromValuesArray(wa)
    )
    assert.equal(withdrawals.length, 8, '8 withdrawals should have been found')
    const gethWitdrawalsRoot = (gethBlockBytesArray[0] as Uint8Array[])[16] as Uint8Array
    assert.deepEqual(
      await Block.genWithdrawalsTrieRoot(withdrawals),
      gethWitdrawalsRoot,
      'withdrawalsRoot should be valid'
    )
  })

  it('Header tests', () => {
    const earlyCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    assert.throws(
      () => {
        BlockHeader.fromHeaderData(
          {
            withdrawalsRoot: hexStringToBytes('00'.repeat(32)),
          },
          {
            common: earlyCommon,
          }
        )
      },
      undefined,
      undefined,
      'should throw when setting withdrawalsRoot with EIP4895 not being activated'
    )
    assert.doesNotThrow(() => {
      BlockHeader.fromHeaderData(
        {},
        {
          common,
        }
      )
    }, 'should not throw when withdrawalsRoot is undefined with EIP4895 being activated')
    assert.doesNotThrow(() => {
      BlockHeader.fromHeaderData(
        {
          withdrawalsRoot: hexStringToBytes('00'.repeat(32)),
        },
        {
          common,
        }
      )
    }, 'correctly instantiates an EIP4895 block header')
  })
  it('Block tests', async () => {
    const earlyCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    assert.throws(
      () => {
        Block.fromBlockData(
          {
            withdrawals: [],
          },
          {
            common: earlyCommon,
          }
        )
      },
      undefined,
      undefined,
      'should throw when setting withdrawals with EIP4895 not being activated'
    )
    assert.doesNotThrow(() => {
      Block.fromBlockData(
        {},
        {
          common,
        }
      )
    }, 'should not throw when withdrawals is undefined with EIP4895 being activated')
    assert.doesNotThrow(() => {
      Block.fromBlockData(
        {
          header: {
            withdrawalsRoot: hexStringToBytes('00'.repeat(32)),
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
          withdrawalsRoot: hexStringToBytes('00'.repeat(32)),
        },
        withdrawals: [],
      },
      {
        common,
      }
    )
    assert.notOk(
      await block.validateWithdrawalsTrie(),
      'should invalidate the empty withdrawals root'
    )
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
    assert.ok(await validBlock.validateWithdrawalsTrie(), 'should validate empty withdrawals root')

    const withdrawal = <WithdrawalData>{
      index: BigInt(0),
      validatorIndex: BigInt(0),
      address: new Address(hexStringToBytes('20'.repeat(20))),
      amount: BigInt(1000),
    }

    const validBlockWithWithdrawal = Block.fromBlockData(
      {
        header: {
          withdrawalsRoot: hexStringToBytes(
            '897ca49edcb278aecab2688bcc2b7b7ee43524cc489672534fee332a172f1718'
          ),
        },
        withdrawals: [withdrawal],
      },
      {
        common,
      }
    )
    assert.ok(
      await validBlockWithWithdrawal.validateWithdrawalsTrie(),
      'should validate withdrawals root'
    )

    const withdrawal2 = <WithdrawalData>{
      index: BigInt(1),
      validatorIndex: BigInt(11),
      address: new Address(hexStringToBytes('30'.repeat(20))),
      amount: BigInt(2000),
    }

    const validBlockWithWithdrawal2 = Block.fromBlockData(
      {
        header: {
          withdrawalsRoot: hexStringToBytes(
            '3b514862c42008079d461392e29d5b6775dd5ed370a6c4441ccb8ab742bf2436'
          ),
        },
        withdrawals: [withdrawal, withdrawal2],
      },
      {
        common,
      }
    )
    assert.ok(
      await validBlockWithWithdrawal2.validateWithdrawalsTrie(),
      'should validate withdrawals root'
    )
    assert.doesNotThrow(() => {
      validBlockWithWithdrawal.hash()
    }, 'hashed block with withdrawals')
    assert.doesNotThrow(() => {
      validBlockWithWithdrawal2.hash()
    }, 'hashed block with withdrawals')
  })
  it('should throw if no withdrawal array is provided', () => {
    const blockWithWithdrawals = Block.fromBlockData({}, { common })
    const rlp = blockWithWithdrawals.serialize()
    const rlpDecoded = RLP.decode(rlp) as Uint8Array[]
    // remove withdrawals root
    rlpDecoded[0] = rlpDecoded[0].slice(0, 16)
    // RLP encode the serialized array, but do not encode the empty withdrawals array
    const rlpWithoutWithdrawals = RLP.encode(rlpDecoded.slice(0, 3))
    // throw check if withdrawals array is not provided in the rlp
    assert.throws(
      () => {
        Block.fromRLPSerializedBlock(rlpWithoutWithdrawals, { common })
      },
      undefined,
      undefined,
      'should provide withdrawals array when 4895 is active'
    )
  })
})
