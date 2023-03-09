import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { Withdrawal, ssz } from '../src'
const withdrawalsData = [
  {
    index: BigInt(0),
    validatorIndex: BigInt(65535),
    address: hexToBytes('0000000000000000000000000000000000000000', 'hex'),
    amount: BigInt('0'),
  },
  {
    index: BigInt(1),
    validatorIndex: BigInt(65536),
    address: hexToBytes('0100000000000000000000000000000000000000', 'hex'),
    amount: BigInt('04523128485832663883'),
  },
  {
    index: BigInt(2),
    validatorIndex: BigInt(65537),
    address: hexToBytes('0200000000000000000000000000000000000000', 'hex'),
    amount: BigInt('09046256971665327767'),
  },
  {
    index: BigInt(4),
    validatorIndex: BigInt(65538),
    address: hexToBytes('0300000000000000000000000000000000000000', 'hex'),
    amount: BigInt('13569385457497991651'),
  },
  {
    index: BigInt(4),
    validatorIndex: BigInt(65539),
    address: hexToBytes('0400000000000000000000000000000000000000', 'hex'),
    amount: BigInt('18446744073709551615'),
  },
  {
    index: BigInt(5),
    validatorIndex: BigInt(65540),
    address: hexToBytes('0500000000000000000000000000000000000000', 'hex'),
    amount: BigInt('02261564242916331941'),
  },
  {
    index: BigInt(6),
    validatorIndex: BigInt(65541),
    address: hexToBytes('0600000000000000000000000000000000000000', 'hex'),
    amount: BigInt('02713877091499598330'),
  },
  {
    index: BigInt(7),
    validatorIndex: BigInt(65542),
    address: hexToBytes('0700000000000000000000000000000000000000', 'hex'),
    amount: BigInt('03166189940082864718'),
  },
]

tape('ssz', (t) => {
  t.test('withdrawals', (st) => {
    const withdrawals = withdrawalsData.map((wt) => Withdrawal.fromWithdrawalData(wt))
    const withdrawalsValue = withdrawals.map((wt) => wt.toValue())
    const sszValues = ssz.Withdrawals.toViewDU(withdrawalsData).toValue()

    st.deepEqual(sszValues, withdrawalsValue, 'sszValues should be same as withdrawalsValue')
    const withdrawalsRoot = ssz.Withdrawals.hashTreeRoot(withdrawalsValue)
    st.equal(
      bytesToHex(withdrawalsRoot),
      'bd97f65e513f870484e85927510acb291fcfb3e593c05ab7f21f206921264946',
      'ssz root should match'
    )
    st.end()
  })

  const specWithdrawals = [
    // https://github.com/ethereum/consensus-spec-tests/tree/v1.3.0-rc.1/tests/mainnet/capella/ssz_static/Withdrawal/ssz_random/case_0
    {
      index: BigInt('17107150653359250726'),
      validatorIndex: BigInt('1906681273455760070'),
      address: hexToBytes('02ab1379b6334b58df82c85d50ff1214663cba20'),
      amount: BigInt('5055030296454530815'),
    },
  ]

  t.test('match spec v1.3.0-rc.1', (st) => {
    const withdrawalsRoot = ssz.Withdrawal.hashTreeRoot(specWithdrawals[0])
    st.equal(
      bytesToHex(withdrawalsRoot),
      'ed9cec6fb8ee22b146059d02c38940cca1dd22a00d0132b000999b983fceff95',
      'ssz root should match'
    )
    st.end()
  })
})
