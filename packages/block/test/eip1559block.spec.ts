import tape from 'tape'
import Common from '@ethereumjs/common'
import { BlockHeader } from '../src/header'
import { BN } from 'ethereumjs-util'

// Test data from Besu (retrieved via Discord)
// Older version at https://github.com/abdelhamidbakhta/besu/blob/bf54b6c0b40d3015fc85ff9b078fbc26592d80c0/ethereum/core/src/test/resources/org/hyperledger/besu/ethereum/core/fees/basefee-test.json
const eip1559BaseFee = require('./testdata/eip1559baseFee.json')

const common = new Common({
  eips: [1559],
  chain: 'mainnet',
  hardfork: 'berlin',
})

tape('EIP1559 tests', function (t) {
  t.test('Header Data', function (st) {
    const header = BlockHeader.fromHeaderData({}, { common })

    for (let index = 0; index < eip1559BaseFee.length; index++) {
      const item = eip1559BaseFee[index]
      const result = header.getBaseFee(
        new BN(item.parentBaseFee),
        new BN(item.parentGasUsed),
        new BN(item.parentTargetGasUsed)
      )
      const expected = new BN(item.expectedBaseFee)
      st.ok(expected.eq(result), 'base fee correct')
    }
    st.end()
  })
})
