import { assert, describe, it } from 'vitest'

import { parseEthyArgs } from '../src/cli/args.ts'

describe('[Ethy/CLI]: args', () => {
  it('parseEthyArgs([]) defaults to sepolia', () => {
    const a = parseEthyArgs(['node', 'ethy'])
    assert.equal(a.network, 'sepolia')
    assert.isFalse(a.demo)
    assert.isFalse(a.headless)
  })

  it('parseEthyArgs() reads --demo and --headless', () => {
    const a = parseEthyArgs(['node', 'ethy', 'mainnet', '--demo', '--headless'])
    assert.equal(a.network, 'mainnet')
    assert.isTrue(a.demo)
    assert.isTrue(a.headless)
  })

  it('parseEthyArgs() rejects unknown flags', () => {
    assert.throws(() => parseEthyArgs(['node', 'ethy', '--nope']), /Unknown flag/)
  })
})
