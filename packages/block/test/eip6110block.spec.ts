import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { KECCAK256_RLP, hexToBytes, zeros } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Block } from '../src/block.js'
import { BlockHeader } from '../src/header.js'

import type { DepositData } from '@ethereumjs/util'

const common = new Common({
  chain: Chain.Kaustinen,
  hardfork: Hardfork.Prague,
  eips: [6110],
})

describe('EIP6110 tests', () => {
  it('Header tests', () => {
    const earlyCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    assert.throws(
      () => {
        BlockHeader.fromHeaderData(
          {
            depositsRoot: zeros(32),
          },
          {
            common: earlyCommon,
          }
        )
      },
      undefined,
      undefined,
      'should throw when setting depositsRoot with EIP6110 not being activated'
    )
    assert.doesNotThrow(() => {
      BlockHeader.fromHeaderData(
        {},
        {
          common,
        }
      )
    }, 'should not throw when depositsRoot is undefined with EIP6110 being activated')
    assert.doesNotThrow(() => {
      BlockHeader.fromHeaderData(
        {
          depositsRoot: zeros(32),
        },
        {
          common,
        }
      )
    }, 'correctly instantiates an EIP6110 block header')
  })
  it('Block tests', async () => {
    const earlyCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    assert.throws(
      () => {
        Block.fromBlockData(
          {
            deposits: [],
          },
          {
            common: earlyCommon,
          }
        )
      },
      undefined,
      undefined,
      'should throw when setting deposits with EIP6110 not being activated'
    )
    assert.doesNotThrow(() => {
      Block.fromBlockData(
        {},
        {
          common,
        }
      )
    }, 'should not throw when deposits is undefined with EIP6110 being activated')
    assert.doesNotThrow(() => {
      Block.fromBlockData(
        {
          header: {
            depositsRoot: zeros(32),
          },
          deposits: [],
        },
        {
          common,
        }
      )
    })
    const block = Block.fromBlockData(
      {
        header: {
          depositsRoot: zeros(32),
        },
        deposits: [],
      },
      {
        common,
      }
    )
    assert.notOk(await block.depositsTrieIsValid(), 'should invalidate the empty deposits root')
    const validHeader = BlockHeader.fromHeaderData(
      {
        depositsRoot: KECCAK256_RLP,
      },
      { common }
    )
    const validBlock = Block.fromBlockData(
      {
        header: validHeader,
        deposits: [],
      },
      {
        common,
      }
    )
    assert.ok(await validBlock.depositsTrieIsValid(), 'should validate empty deposits root')

    const deposit = <DepositData>{
      pubkey: hexToBytes('0x' + '20'.repeat(48)),
      withdrawalCredentials: hexToBytes('0x' + '20'.repeat(32)),
      amount: BigInt(1000),
      signature: hexToBytes('0x' + '20'.repeat(96)),
      index: BigInt(0),
    }

    const validBlockWithDeposit = Block.fromBlockData(
      {
        header: {
          depositsRoot: hexToBytes(
            '0x897ca49edcb278aecab2688bcc2b7b7ee43524cc489672534fee332a172f1718'
          ),
        },
        deposits: [deposit],
      },
      {
        common,
      }
    )
    assert.ok(
      await validBlockWithDeposit.withdrawalsTrieIsValid(),
      'should validate withdrawals root'
    )

    const deposit2 = <DepositData>{
      pubkey: hexToBytes('0x' + '30'.repeat(48)),
      withdrawalCredentials: hexToBytes('0x' + '30'.repeat(32)),
      amount: BigInt(2000),
      signature: hexToBytes('0x' + '30'.repeat(96)),
      index: BigInt(1),
    }

    const validBlockWithDeposit2 = Block.fromBlockData(
      {
        header: {
          depositsRoot: hexToBytes(
            '0xc066b7e7827bb409aceb52f83de28aa25763816bfa46a578fd3e45752346b1c3'
          ),
        },
        deposits: [deposit, deposit2],
      },
      {
        common,
      }
    )
    assert.ok(await validBlockWithDeposit2.depositsTrieIsValid(), 'should validate deposits root')
    assert.doesNotThrow(() => {
      validBlockWithDeposit.hash()
    }, 'hashed block with deposits')
    assert.doesNotThrow(() => {
      validBlockWithDeposit2.hash()
    }, 'hashed block with deposits')
  })
  it('should throw if no deposit array is provided', () => {
    const blockWithDeposits = Block.fromBlockData({}, { common })
    const rlp = blockWithDeposits.serialize()
    const rlpDecoded = RLP.decode(rlp) as Uint8Array[]
    // remove deposits root
    rlpDecoded[0] = rlpDecoded[0].slice(0, 16)
    // RLP encode the serialized array, but do not encode the empty deposits array
    const rlpWithoutDeposits = RLP.encode(rlpDecoded.slice(0, 3))
    // throw check if deposits array is not provided in the rlp
    assert.throws(
      () => {
        Block.fromRLPSerializedBlock(rlpWithoutDeposits, { common })
      },
      undefined,
      undefined,
      'should provide deposits array when 6110 is active'
    )
  })
})
