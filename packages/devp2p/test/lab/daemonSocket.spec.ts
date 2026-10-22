import { type ChildProcess, spawn } from 'node:child_process'
import { access, mkdtemp, rm } from 'node:fs/promises'
import { connect } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { defaultNetwork, initLabDir, loadLabNode } from '../../src/lab/labDir.ts'

const bin = join(import.meta.dirname, '../../bin/devp2p.cjs')

function sockCmd(sockPath: string, req: Record<string, unknown>) {
  return new Promise<Record<string, unknown>>((resolve, reject) => {
    const c = connect(sockPath)
    let out = ''
    c.setEncoding('utf8')
    c.on('error', reject)
    c.on('data', (d) => {
      out += d
      if (out.includes('\n')) {
        c.end()
        resolve(JSON.parse(out.trim()) as Record<string, unknown>)
      }
    })
    c.write(`${JSON.stringify(req)}\n`)
  })
}

function startDaemon(labRoot: string, node: string): ChildProcess {
  return spawn(
    'node',
    [bin, 'node', 'run', '--dir', labRoot, '--node', node, '--control', 'socket'],
    {
      cwd: join(import.meta.dirname, '../..'),
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )
}

async function waitForSocket(sockPath: string, ms = 15000) {
  const start = Date.now()
  while (Date.now() - start < ms) {
    try {
      await access(sockPath)
      return
    } catch {
      await new Promise((r) => setTimeout(r, 50))
    }
  }
  throw new Error(`Timeout waiting for socket ${sockPath}`)
}

describe('[Devp2p/Lab]: daemon control socket', () => {
  const children: ChildProcess[] = []
  let root = ''

  afterEach(async () => {
    for (const c of children.splice(0)) {
      c.kill('SIGTERM')
    }
    if (root) await rm(root, { recursive: true, force: true }).catch(() => {})
    root = ''
  })

  it('peer add --wait, list, eth sendStatus over socket', async () => {
    root = await mkdtemp(join(tmpdir(), 'devp2p-daemon-'))
    const base = 50800 + Math.floor(Math.random() * 400)
    await initLabDir(root, ['alice', 'bob'], base, defaultNetwork())
    const bobCfg = await loadLabNode(root, 'bob')

    const bob = startDaemon(root, 'bob')
    const alice = startDaemon(root, 'alice')
    children.push(bob, alice)

    await waitForSocket(join(root, 'bob', 'control.sock'))
    await waitForSocket(join(root, 'alice', 'control.sock'))

    const aliceSock = join(root, 'alice', 'control.sock')

    const add = await sockCmd(aliceSock, {
      cmd: 'peer.add',
      host: '127.0.0.1',
      udpPort: bobCfg.nodeConfig.udpPort,
      tcpPort: bobCfg.nodeConfig.tcpPort,
      waitEvent: 'peer.added',
      waitTimeoutMs: 15000,
    })
    expect(add.ok).toBe(true)

    const list = await sockCmd(aliceSock, { cmd: 'peer.list' })
    expect(list.ok).toBe(true)
    expect((list.data as unknown[]).length).toBe(1)

    await new Promise((r) => setTimeout(r, 6500))

    const list2 = await sockCmd(aliceSock, { cmd: 'peer.list' })
    expect((list2.data as unknown[]).length, JSON.stringify(list2)).toBe(1)

    const status = await sockCmd(aliceSock, {
      cmd: 'eth.sendStatus',
      peerIndex: 0,
      status: {
        td: '0x040000000000',
        bestHash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
        genesisHash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
      },
    })
    expect(status, JSON.stringify(status)).toEqual(expect.objectContaining({ ok: true }))
  }, 45000)
})
