import { assert, describe, it } from 'vitest'

import { parseEthyArgs } from '../src/cli/args.ts'

describe('[Ethy/CLI]: args', () => {
  it('parseEthyArgs([]) defaults to sepolia', () => {
    const a = parseEthyArgs(['node', 'ethy'])
    assert.equal(a.network, 'sepolia')
    assert.isFalse(a.demo)
    assert.isFalse(a.headless)
    assert.isFalse(a.fresh)
    assert.equal(a.custodyCount, 2)
    assert.isFalse(a.snapBootstrap)
  })

  it('parseEthyArgs() reads custody and snap-bootstrap', () => {
    const a = parseEthyArgs(['node', 'ethy', '--custody', '4', '--snap-bootstrap'])
    assert.equal(a.custodyCount, 4)
    assert.isTrue(a.snapBootstrap)
    const full = parseEthyArgs(['node', 'ethy', '--full'])
    assert.equal(full.custodyCount, 16)
    assert.isTrue(full.fullCustody)
  })

  it('parseEthyArgs() reads --demo and --headless', () => {
    const a = parseEthyArgs(['node', 'ethy', 'mainnet', '--demo', '--headless'])
    assert.equal(a.network, 'mainnet')
    assert.isTrue(a.demo)
    assert.isTrue(a.headless)
  })

  it('parseEthyArgs() reads --fresh', () => {
    const a = parseEthyArgs(['node', 'ethy', '--fresh'])
    assert.isTrue(a.fresh)
  })

  it('parseEthyArgs() reads --datadir', () => {
    const a = parseEthyArgs(['node', 'ethy', '--datadir', '/tmp/ethy-data'])
    assert.equal(a.dataDir, '/tmp/ethy-data')
  })

  it('parseEthyArgs() rejects unknown flags', () => {
    assert.throws(() => parseEthyArgs(['node', 'ethy', '--nope']), /Unknown flag/)
  })

  it('parseEthyArgs() reads --port and --connect', () => {
    const a = parseEthyArgs([
      'node',
      'ethy',
      '--port',
      '30304',
      '--connect',
      'enode://' + 'aa'.repeat(64) + '@127.0.0.1:30303',
    ])
    assert.equal(a.listenPort, 30304)
    assert.equal(a.connectEnodeUrls.length, 1)
  })

  it('parseEthyArgs() accepts --data-dir alias', () => {
    const a = parseEthyArgs(['node', 'ethy', '--data-dir', '/tmp/x'])
    assert.equal(a.dataDir, '/tmp/x')
  })

  it('parseEthyArgs() disables rpc on demo unless forced', () => {
    const demoOnly = parseEthyArgs(['node', 'ethy', '--demo'])
    assert.equal(demoOnly.rpcEnabled, false)
    const demoRpc = parseEthyArgs(['node', 'ethy', '--demo', '--rpc'])
    assert.equal(demoRpc.rpcEnabled, true)
    const noRpc = parseEthyArgs(['node', 'ethy', '--no-rpc'])
    assert.equal(noRpc.rpcEnabled, false)
  })

  it('parseEthyArgs() reads wp-10a ai flags', () => {
    const a = parseEthyArgs(['node', 'ethy', '--no-ai', '--ai-save', '--llm-model', 'foo'])
    assert.isTrue(a.noAi)
    assert.isTrue(a.aiSave)
    assert.equal(a.llmModel, 'foo')
  })

  it('parseEthyArgs() reads llm and ai-memory flags', () => {
    const a = parseEthyArgs([
      'node',
      'ethy',
      '--llm-url',
      'http://127.0.0.1:8080',
      '--no-ai-history',
    ])
    assert.equal(a.llmUrl, 'http://127.0.0.1:8080')
    assert.equal(a.aiMemory, 'off')
  })
})
