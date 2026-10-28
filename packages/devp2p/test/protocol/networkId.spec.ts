import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { assertSameGenesis, assertSameNetworkId } from '../../src/protocol/eth.ts'

describe('[Devp2p/ETH]: network id', () => {
  it('accepts the same chain id with or without a leading zero byte', () => {
    const canonical = hexToBytes('0xaa36a7')
    const padded = hexToBytes('0x00aa36a7')
    assert.doesNotThrow(() => assertSameNetworkId(canonical, padded))
  })

  it('names both chain ids when they differ', () => {
    const sepolia = hexToBytes('0xaa36a7')
    const mainnet = hexToBytes('0x01')
    assert.throws(
      () => assertSameNetworkId(sepolia, mainnet),
      /Network id mismatch: we=11155111 remote=1/,
    )
  })

  it('names a short prefix when genesis hashes differ', () => {
    const ours = hexToBytes('0x25a5cc106eea7138acab33231d7160d69cb777ee0c2c553fcddf5138993e6dd9')
    const remote = hexToBytes(`0x${'11'.repeat(32)}`)
    assert.throws(
      () => assertSameGenesis(ours, remote),
      /Genesis mismatch: we=0x25a5cc10\.\.\. remote=0x11111111\.\.\./,
    )
  })
})
