import { unlink, writeFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { join } from 'node:path'

import { CommandDispatcher } from './commandDispatcher.ts'
import { loadLabNode } from './labDir.ts'
import { NodeSession } from './nodeSession.ts'

export async function runNodeDaemon(opts: {
  labRoot: string
  nodeName: string
  eventsNdjson: boolean
  control: 'socket' | 'stdin' | 'none'
}) {
  const loaded = await loadLabNode(opts.labRoot, opts.nodeName)
  const session = new NodeSession({
    name: opts.nodeName,
    nodeDir: loaded.nodeDir,
    privateKey: loaded.privateKey,
    nodeConfig: loaded.nodeConfig,
    common: loaded.common,
  })
  session.eventBus.setNdjson(opts.eventsNdjson)
  const dispatcher = new CommandDispatcher(session)

  await writeFile(session.pidPath(), `${process.pid}\n`)

  const shutdown = async () => {
    session.destroy()
    try {
      await unlink(session.controlSocketPath())
    } catch {
      /* ignore */
    }
    process.exit(0)
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  if (opts.control === 'stdin') {
    process.stdin.setEncoding('utf8')
    let buffer = ''
    process.stdin.on('data', async (chunk) => {
      buffer += chunk
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        if (!line.trim()) continue
        const req = JSON.parse(line) as { cmd: string }
        const res = await dispatcher.dispatch(req)
        process.stdout.write(`${JSON.stringify(res)}\n`)
      }
    })
  }

  if (opts.control === 'socket') {
    const sockPath = session.controlSocketPath()
    try {
      await unlink(sockPath)
    } catch {
      /* ignore */
    }
    const server = createServer((conn) => {
      let buffer = ''
      conn.setEncoding('utf8')
      conn.on('data', async (chunk) => {
        buffer += chunk
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const req = JSON.parse(line) as { cmd: string }
            const res = await dispatcher.dispatch(req)
            conn.write(`${JSON.stringify(res)}\n`)
          } catch (e: unknown) {
            conn.write(`${JSON.stringify({ ok: false, error: (e as Error).message })}\n`)
          }
        }
      })
    })
    server.listen(sockPath)
  }

  session.eventBus.log(
    `node ${opts.nodeName} listening udp=${loaded.nodeConfig.udpPort} tcp=${loaded.nodeConfig.tcpPort}`,
    opts.nodeName,
  )
  await new Promise(() => {
    /* run until signal */
  })
}

export async function stopNode(labRoot: string, nodeName: string) {
  const pidPath = join(labRoot, nodeName, 'node.pid')
  const { readFile } = await import('node:fs/promises')
  const pid = Number((await readFile(pidPath, 'utf8')).trim())
  process.kill(pid, 'SIGTERM')
}
