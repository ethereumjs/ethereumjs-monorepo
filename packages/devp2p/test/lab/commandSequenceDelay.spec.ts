import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { CommandDispatcher } from '../../src/lab/commandDispatcher.ts'
import { MAINNET_STATUS_JSON } from '../../src/lab/inProcessMesh.ts'
import { defaultNetwork, initLabDir, loadLabNode } from '../../src/lab/labDir.ts'
import { NodeSession } from '../../src/lab/nodeSession.ts'

describe('[Devp2p/Lab]: peer stays up between commands', () => {
  it('peer list then eth STATUS after delay', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devp2p-lab-'))
    const base = 50600 + Math.floor(Math.random() * 800)
    await initLabDir(root, ['a', 'b'], base, defaultNetwork())
    const loadedA = await loadLabNode(root, 'a')
    const loadedB = await loadLabNode(root, 'b')
    const sessionA = new NodeSession({
      name: 'a',
      nodeDir: loadedA.nodeDir,
      privateKey: loadedA.privateKey,
      nodeConfig: loadedA.nodeConfig,
      common: loadedA.common,
    })
    const sessionB = new NodeSession({
      name: 'b',
      nodeDir: loadedB.nodeDir,
      privateKey: loadedB.privateKey,
      nodeConfig: loadedB.nodeConfig,
      common: loadedB.common,
    })
    const dispA = new CommandDispatcher(sessionA)
    const dispB = new CommandDispatcher(sessionB)

    try {
      const add = await dispA.dispatch({
        cmd: 'peer.add',
        host: '127.0.0.1',
        udpPort: loadedB.nodeConfig.udpPort,
        tcpPort: loadedB.nodeConfig.tcpPort,
        waitEvent: 'peer.added',
        waitTimeoutMs: 15000,
      })
      expect(add.ok).toBe(true)

      const list1 = await dispA.dispatch({ cmd: 'peer.list' })
      expect(list1.ok).toBe(true)
      expect((list1.data as unknown[]).length).toBe(1)

      await new Promise((r) => setTimeout(r, 2500))

      const list2 = await dispA.dispatch({ cmd: 'peer.list' })
      expect(list2.ok).toBe(true)
      expect((list2.data as unknown[]).length).toBe(1)

      const list3 = await dispA.dispatch({ cmd: 'peer.list' })
      expect((list3.data as unknown[]).length).toBe(1)

      const status = await dispA.dispatch({
        cmd: 'eth.sendStatus',
        peerIndex: 0,
        status: MAINNET_STATUS_JSON,
      })
      expect(status, JSON.stringify(status)).toEqual(expect.objectContaining({ ok: true }))
    } finally {
      sessionA.destroy()
      sessionB.destroy()
      await rm(root, { recursive: true, force: true })
    }
  }, 30000)
})
