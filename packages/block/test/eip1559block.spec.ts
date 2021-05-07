import tape from 'tape'
import Common from '@ethereumjs/common'
import { BlockHeader } from '../src/header'
import { BN } from 'ethereumjs-util'
import { Mockchain } from './mockchain'
import { Block } from '../src/block'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'

// Test data from Besu (retrieved via Discord)
// Older version at https://github.com/abdelhamidbakhta/besu/blob/bf54b6c0b40d3015fc85ff9b078fbc26592d80c0/ethereum/core/src/test/resources/org/hyperledger/besu/ethereum/core/fees/basefee-test.json
const eip1559BaseFee = require('./testdata/eip1559baseFee.json')

const common = new Common({
  eips: [1559],
  chain: 'mainnet',
  hardfork: 'london',
})

const blockchain = new Mockchain()

const genesis = Block.fromBlockData({})

// Small hack to hack in the activation block number
// (Otherwise there would be need for a custom chain only for testing purposes)
common.getEIPActivationBlockNumber = function (eip: number) {
  if (eip == 1559) {
    return new BN(1)
  }
}

tape('EIP1559 tests', function (t) {
  t.test('Initialize test suite', async function (st) {
    await blockchain.putBlock(genesis)
    st.end()
  })
  t.test('Header Data', function (st) {
    const header = BlockHeader.fromHeaderData({}, { common })

    for (let index = 0; index < eip1559BaseFee.length; index++) {
      const item = eip1559BaseFee[index]
      const result = header.getBaseFee(
        BlockHeader.fromHeaderData(
          {
            baseFeePerGas: new BN(item.parentBaseFee),
            gasUsed: new BN(item.parentGasUsed),
            gasLimit: new BN(item.parentTargetGasUsed),
          },
          { common }
        )
      )
      const expected = new BN(item.expectedBaseFee)
      st.ok(expected.eq(result), 'base fee correct')
    }
    st.end()
  })

  t.test('Header should throw on wrong initial base fee', async function (st) {
    const header = BlockHeader.fromHeaderData(
      {
        baseFeePerGas: new BN(1000),
        number: new BN(1),
        parentHash: genesis.hash(),
        timestamp: new BN(1),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )

    try {
      await header.validate(blockchain)
      st.fail('should throw')
    } catch (e) {
      st.ok(e.message.includes('base fee'), 'threw with right error')
    }
    st.end()
  })

  t.test('Header should throw if base fee is not defined', async function (st) {
    const header = BlockHeader.fromHeaderData(
      {
        number: new BN(1),
        parentHash: genesis.hash(),
        timestamp: new BN(1),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )

    try {
      await header.validate(blockchain)
      st.fail('should throw')
    } catch (e) {
      st.ok(e.message.includes('base fee'), 'threw with right error')
    }
    st.end()
  })

  t.test('Valid initial EIP1559 header should be valid', async function (st) {
    const header = BlockHeader.fromHeaderData(
      {
        number: new BN(1),
        parentHash: genesis.hash(),
        timestamp: new BN(1),
        baseFeePerGas: new BN(common.param('gasConfig', 'initialBaseFee')),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )

    await header.validate(blockchain)
    st.pass('correctly validated header')

    st.end()
  })

  t.test('Header should throw when elasticity is exceeded', async function (st) {
    const header = BlockHeader.fromHeaderData(
      {
        number: new BN(1),
        parentHash: genesis.hash(),
        timestamp: new BN(1),
        gasUsed: genesis.header.gasLimit
          .muln(common.param('gasConfig', 'elasticityMultiplier'))
          .addn(1),
        baseFeePerGas: new BN(common.param('gasConfig', 'initialBaseFee')),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )

    try {
      await header.validate(blockchain)
      st.fail('should throw')
    } catch (e) {
      st.ok(e.message.includes('too much gas used'), 'threw with right error')
    }
    st.end()
  })

  t.test('Header should not throw on when elasticity is exactly matched', async function (st) {
    const header = BlockHeader.fromHeaderData(
      {
        number: new BN(1),
        parentHash: genesis.hash(),
        timestamp: new BN(1),
        gasUsed: genesis.header.gasLimit.muln(common.param('gasConfig', 'elasticityMultiplier')),
        baseFeePerGas: new BN(common.param('gasConfig', 'initialBaseFee')),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )

    await header.validate(blockchain)
    st.pass('correctly validated header')
    st.end()
  })

  t.test('Header should throw if gas limit is increased too much', async function (st) {
    const header = BlockHeader.fromHeaderData(
      {
        number: new BN(1),
        parentHash: genesis.hash(),
        timestamp: new BN(1),
        gasLimit: genesis.header.gasLimit.add(genesis.header.gasLimit.divn(1024)).addn(1),
        baseFeePerGas: new BN(common.param('gasConfig', 'initialBaseFee')),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )

    try {
      await header.validate(blockchain)
      st.fail('should throw')
    } catch (e) {
      st.ok(e.message.includes('invalid gas limit'), 'threw with right error')
    }
    st.end()
  })

  t.test('Header should throw if gas limit is decreased too much', async function (st) {
    const header = BlockHeader.fromHeaderData(
      {
        number: new BN(1),
        parentHash: genesis.hash(),
        timestamp: new BN(1),
        gasLimit: genesis.header.gasLimit.sub(genesis.header.gasLimit.divn(1024)).subn(1),
        baseFeePerGas: new BN(common.param('gasConfig', 'initialBaseFee')),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )

    try {
      await header.validate(blockchain)
      st.fail('should throw')
    } catch (e) {
      st.ok(e.message.includes('invalid gas limit'), 'threw with right error')
    }
    st.end()
  })

  t.test('Header should not throw if gas limit is between bounds', async function (st) {
    const header = BlockHeader.fromHeaderData(
      {
        number: new BN(1),
        parentHash: genesis.hash(),
        timestamp: new BN(1),
        gasLimit: genesis.header.gasLimit.sub(genesis.header.gasLimit.divn(1024)),
        baseFeePerGas: new BN(common.param('gasConfig', 'initialBaseFee')),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )
    const header2 = BlockHeader.fromHeaderData(
      {
        number: new BN(1),
        parentHash: genesis.hash(),
        timestamp: new BN(1),
        gasLimit: genesis.header.gasLimit.add(genesis.header.gasLimit.divn(1024)),
        baseFeePerGas: new BN(common.param('gasConfig', 'initialBaseFee')),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )

    await header.validate(blockchain)
    st.pass('correctly validated block')
    await header2.validate(blockchain)
    st.pass('correctly validated block')
    st.end()
  })

  t.test('Block should throw if transaction is unable to pay base fee', async (st) => {
    const transaction = FeeMarketEIP1559Transaction.fromTxData(
      {
        maxFeePerGas: new BN(0),
        maxInclusionFeePerGas: new BN(0),
      },
      { common }
    ).sign(Buffer.from('46'.repeat(32), 'hex'))
    const block = Block.fromBlockData(
      {
        header: {
          number: new BN(1),
          parentHash: genesis.hash(),
          timestamp: new BN(1),
          baseFeePerGas: new BN(common.param('gasConfig', 'initialBaseFee')),
        },
        transactions: [
          {
            maxFeePerGas: new BN(0),
            maxInclusionFeePerGas: new BN(0),
            type: 2,
            v: transaction.v,
            r: transaction.r,
            s: transaction.s,
            gasLimit: 53000,
          },
        ],
      },
      {
        common,
        calcDifficultyFromHeader: genesis.header,
      }
    )
    try {
      await block.validate(blockchain)
      st.fail('should throw')
    } catch (e) {
      st.ok(e.message.includes('unable to pay base fee'), 'threw with right error')
    }

    st.end()
  })
})
