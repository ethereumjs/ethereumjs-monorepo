import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { CommandDispatcher } from '../../src/lab/commandDispatcher.ts'
import { MAINNET_STATUS_JSON } from '../../src/lab/inProcessMesh.ts'
import { defaultNetwork, initLabDir, loadLabNode } from '../../src/lab/labDir.ts'
import { NodeSession } from '../../src/lab/nodeSession.ts'

describe('[Devp2p/Lab]: command sequence', () => {
  it('dials once then sends eth and rlpx follow-ups on the same session', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devp2p-lab-'))
    const base = 50500 + Math.floor(Math.random() * 800)
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
      })
      expect(add.ok).toBe(true)

      const waited = await dispA.dispatch({ cmd: 'wait', event: 'peer.added', timeoutMs: 15000 })
      expect(waited.ok).toBe(true)

      await dispB.dispatch({ cmd: 'wait', event: 'peer.added', timeoutMs: 15000 })

      await dispA.dispatch({ cmd: 'eth.sendStatus', peerIndex: 0, status: MAINNET_STATUS_JSON })
      await dispB.dispatch({ cmd: 'eth.sendStatus', peerIndex: 0, status: MAINNET_STATUS_JSON })

      const headers = await dispA.dispatch({
        cmd: 'eth.send',
        peerIndex: 0,
        name: 'GET_BLOCK_HEADERS',
        json: {
          requestId: '0x01',
          blockHash: MAINNET_STATUS_JSON.bestHash,
          max: 1,
          skip: 0,
          reverse: false,
        },
      })
      expect(headers.ok).toBe(true)
      expect(sessionA.listPeers().length).toBe(1)

      await dispA.dispatch({ cmd: 'rlpx.ping', peerIndex: 0 })
      const pong = await dispA.dispatch({ cmd: 'wait', event: 'rlpx.PONG', timeoutMs: 8000 })
      expect(pong.ok).toBe(true)
      expect((pong.data as { event?: string }).event).toBe('PONG')

      const snapSend = await dispA.dispatch({
        cmd: 'snap.send',
        peerIndex: 0,
        name: 'GET_ACCOUNT_RANGE',
        json: { requestId: 1, root: 437000, limit: 1, offset: 0, bytes: 0 },
      })
      expect(snapSend.ok).toBe(true)
    } finally {
      sessionA.destroy()
      sessionB.destroy()
      await rm(root, { recursive: true, force: true })
    }
  }, 30000)
})
