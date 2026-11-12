import { assert, describe, it } from 'vitest'

import { getCommandAvailability } from '../src/domains/commandAvailability.ts'
import { createSpine, setPhase } from '../src/spine/createSpine.ts'
import { buildDomainHelpWidget } from '../src/tools/help.ts'
import { DIM } from '../src/tui/ansi.ts'
import { renderDomainHelpUIComponent } from '../src/tui/components/DomainHelpUIComponent.ts'

describe('[Ethy/Domains]: command availability', () => {
  it('/live is locked before blocks and ready at head', () => {
    const spine = createSpine('sepolia', 11155111n)
    assert.equal(getCommandAvailability('/live', spine).status, 'locked')
    assert.equal(getCommandAvailability('/live', spine).shortTag, 'awaiting blocks')
    setPhase(spine, 'HEAD_FOLLOWING')
    assert.equal(getCommandAvailability('/live', spine).status, 'ready')
  })

  it('/pause is locked after snap completes (HEAD_FOLLOWING)', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'HEAD_FOLLOWING')
    const avail = getCommandAvailability('/pause', spine)
    assert.equal(avail.status, 'locked')
    assert.equal(avail.shortTag, 'snap complete')
  })

  it('/contract with address is ready while list row stays locked', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'HEAD_FOLLOWING')
    spine.totalAccountsSynced = 50_000
    assert.equal(getCommandAvailability('/contract', spine).status, 'locked')
    assert.equal(
      getCommandAvailability('/contract', spine, { args: '0x' + 'ab'.repeat(20) }).status,
      'ready',
    )
  })

  it('/rpc is always ready for the status microscope', () => {
    const spine = createSpine('sepolia', 11155111n)
    assert.equal(getCommandAvailability('/rpc', spine).status, 'ready')
    spine.rpc = { enabled: false, listening: false } as typeof spine.rpc
    assert.equal(getCommandAvailability('/rpc', spine).status, 'ready')
  })

  it('domain help greys locked economy rows when no blocks', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'P2P_WARMUP')
    spine.economy = { hasBlocks: false, topContracts: [], recentBlocks: [] }
    const widget = buildDomainHelpWidget(spine, 'economy')
    assert.equal(widget.kind, 'domain_help')
    if (widget.kind !== 'domain_help') return
    const lines = renderDomainHelpUIComponent(widget, 80, 40, spine)
    const joined = lines.join('\n')
    assert.include(joined, '/economy')
    assert.include(joined, DIM)
  })
})
