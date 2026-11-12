import { assert, describe, it } from 'vitest'

import { createEthyNode } from '../src/core/createEthyNode.ts'
import { advanceDemo } from '../src/demo/advanceDemo.ts'
import type { InteractionHistoryEntry } from '../src/spine/types.ts'
import { activateHistoryEntry } from '../src/tui/viewHistory.ts'

describe('[Ethy/WP-08b]: headless tool + frozen history', () => {
  it('executeTool /simulate returns Gas used widget', async () => {
    const node = createEthyNode({
      headless: true,
      demo: true,
      network: 'sepolia',
      chainId: 11155111n,
    })
    advanceDemo(node.spine, 11_000)
    const to = '0x5555555555555555555555555555555555555555'
    const res = await node.executeTool(`/simulate ${to} 0x602a6000526001601ff3`)
    assert.equal(res.widget.kind, 'key_value')
    const entries = (res.widget as { entries: { key: string; value: string }[] }).entries
    assert.isTrue(entries.some((e) => e.key === 'Gas used'))
    assert.isDefined(res.frozenSlashWidget)
  })

  it('activateHistoryEntry serves frozenWidget without re-dispatch', () => {
    const node = createEthyNode({
      headless: true,
      demo: true,
      network: 'sepolia',
      chainId: 11155111n,
    })
    const frozen = {
      kind: 'key_value' as const,
      title: '/simulate',
      entries: [{ key: 'Gas used', value: '21000' }],
    }
    const entry: InteractionHistoryEntry = {
      kind: 'slash',
      command: '/simulate 0x55…',
      label: '/simulate 0x55…',
      page: 'main',
      frozenWidget: frozen,
    }
    const out = activateHistoryEntry(entry, node.spine, {
      spine: node.spine,
      stateManager: node.stateManager,
    })
    assert.deepEqual(out.activeWidget, frozen)
  })
})
