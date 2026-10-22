import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { CommandDispatcher } from '../../src/lab/commandDispatcher.ts'
import { MAINNET_STATUS_JSON } from '../../src/lab/inProcessMesh.ts'
import { defaultNetwork, initLabDir, loadLabNode } from '../../src/lab/labDir.ts'
import { NodeSession } from '../../src/lab/nodeSession.ts'

describe('[Devp2p/Lab]: back-to-back CLI-shaped commands', () => {
  it('peer add --wait, peer list, eth sendStatus', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devp2p-lab-'))
    const base = 50700 + Math.floor(Math.random() * 800)
    await initLabDir(root, ['alice', 'bob'], base, defaultNetwork())
    const loadedA = await loadLabNode(root, 'alice')
    const loadedB = await loadLabNode(root, 'bob')
    const sessionA = new NodeSession({
      name: 'alice',
      nodeDir: loadedA.nodeDir,
      privateKey: loadedA.privateKey,
      nodeConfig: loadedA.nodeConfig,
      common: loadedA.common,
    })
    const sessionB = new NodeSession({
      name: 'bob',
      nodeDir: loadedB.nodeDir,
      privateKey: loadedB.privateKey,
      nodeConfig: loadedB.nodeConfig,
      common: loadedB.common,
    })
    const dispA = new CommandDispatcher(sessionA)

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

      const list = await dispA.dispatch({ cmd: 'peer.list' })
      expect((list.data as unknown[]).length).toBe(1)

      const req = {
        cmd: 'eth.sendStatus',
        peerIndex: 0,
        status: MAINNET_STATUS_JSON,
      }
      const status = await dispA.dispatch(req)
      expect(status, JSON.stringify(status)).toEqual(expect.objectContaining({ ok: true }))
    } finally {
      sessionA.destroy()
      sessionB.destroy()
      await rm(root, { recursive: true, force: true })
    }
  }, 30000)
})
