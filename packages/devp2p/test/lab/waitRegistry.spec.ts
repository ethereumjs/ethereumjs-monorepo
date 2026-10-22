import { describe, expect, it } from 'vitest'

import { EventBus } from '../../src/lab/eventBus.ts'
import { WaitRegistry, matchWaitEvent } from '../../src/lab/waitRegistry.ts'

describe('[Devp2p/Lab]: WaitRegistry', () => {
  it('resolves wait when the matching event already happened', async () => {
    const bus = new EventBus()
    const registry = new WaitRegistry()
    registry.attach(bus)

    const waitPromise = registry.wait(
      (record) => matchWaitEvent('peer.added', record, 'alice'),
      1000,
    )
    bus.emit({
      node: 'alice',
      dir: 'in',
      layer: 'rlpx',
      name: 'peer:added',
      peer: '127.0.0.1:30302',
    })

    const ev = await waitPromise
    expect(ev.name).toBe('peer:added')
    expect(ev.layer).toBe('rlpx')
  })

  it('does not replay peer.added from before wait was registered', async () => {
    const bus = new EventBus()
    const registry = new WaitRegistry()
    registry.attach(bus)

    bus.emit({
      node: 'alice',
      dir: 'in',
      layer: 'rlpx',
      name: 'peer:added',
      peer: '127.0.0.1:30302',
    })

    await expect(
      registry.wait((record) => matchWaitEvent('peer.added', record, 'alice'), 50),
    ).rejects.toThrow(/Wait timeout/)
  })
})
