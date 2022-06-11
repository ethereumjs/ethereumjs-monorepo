import tape from 'tape'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { BlockHeader } from '../src/header'
import { Block } from '../src/block'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'

// Test data from Besu (retrieved via Discord)
// Older version at https://github.com/abdelhamidbakhta/besu/blob/bf54b6c0b40d3015fc85ff9b078fbc26592d80c0/ethereum/core/src/test/resources/org/hyperledger/besu/ethereum/core/fees/basefee-test.json
const eip1559BaseFee = require('./testdata/eip1559baseFee.json')

const common = new Common({
  eips: [1559],
  chain: Chain.Mainnet,
  hardfork: Hardfork.London,
})

const genesis = Block.fromBlockData({})

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
  t.test('Header -> Initialization', function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    st.throws(() => {
      BlockHeader.fromHeaderData(
        {
          number: BigInt(1),
          parentHash: genesis.hash(),
          timestamp: BigInt(1),
          gasLimit: genesis.header.gasLimit * BigInt(2), // Special case on EIP-1559 transition block
          baseFeePerGas: BigInt(5),
        },
        {
          common,
        }
      ),
        'should throw when setting baseFeePerGas with EIP1559 not being activated'
    })
    st.end()
  })

  t.test('Header -> validate() -> tx', async (st) => {
    const transaction = FeeMarketEIP1559Transaction.fromTxData(
      {
        maxFeePerGas: BigInt(0),
        maxPriorityFeePerGas: BigInt(0),
      },
      { common }
    ).sign(Buffer.from('46'.repeat(32), 'hex'))
    const block = Block.fromBlockData(
      {
        header: {
          number: BigInt(1),
          parentHash: genesis.hash(),
          gasLimit: genesis.header.gasLimit * BigInt(2), // Special case on EIP-1559 transition block
          timestamp: BigInt(1),
          baseFeePerGas: common.param('gasConfig', 'initialBaseFee'),
        },
        transactions: [
          {
            maxFeePerGas: BigInt(0),
            maxPriorityFeePerGas: BigInt(0),
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
      await block.validateData(true)
      st.fail('should throw')
    } catch (e: any) {
      st.ok(
        e.message.includes('unable to pay base fee'),
        'should throw if transaction is unable to pay base fee'
      )
    }

    st.end()
  })

  t.test('Header -> calcNextBaseFee()', function (st) {
    for (let index = 0; index < eip1559BaseFee.length; index++) {
      const item = eip1559BaseFee[index]
      const result = BlockHeader.fromHeaderData(
        {
          baseFeePerGas: BigInt(item.parentBaseFee),
          gasUsed: BigInt(item.parentGasUsed),
          gasLimit: BigInt(item.parentTargetGasUsed) * BigInt(2),
        },
        { common }
      ).calcNextBaseFee()
      const expected = BigInt(item.expectedBaseFee)
      st.equal(expected, result, 'base fee correct')
    }
    st.end()
  })

  t.test('Header -> toJSON()', function (st) {
    const header = BlockHeader.fromHeaderData(
      {
        number: BigInt(1),
        parentHash: genesis.hash(),
        timestamp: BigInt(1),
        gasLimit: genesis.header.gasLimit,
        baseFeePerGas: BigInt(5),
      },
      {
        common,
      }
    )
    st.equal(header.toJSON().baseFeePerGas, '0x5')
    st.end()
  })
})
