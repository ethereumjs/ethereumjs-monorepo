import { connect } from 'node:net'
import { join } from 'node:path'

import { loadLabNode, resolveLabNode, resolveLabRoot } from '../lab/labDir.ts'

import type { CommandRequest, CommandResponse } from '../lab/commandDispatcher.ts'

export async function sessionControlPath(
  dir: string | undefined,
  node: string | undefined,
): Promise<string> {
  const root = resolveLabRoot(dir)
  const nodeName = await resolveLabNode(root, node)
  const loaded = await loadLabNode(root, nodeName)
  return join(loaded.nodeDir, 'control.sock')
}

export function socketCommand(sockPath: string, payload: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const conn = connect(sockPath)
    let out = ''
    conn.setEncoding('utf8')
    conn.on('error', reject)
    conn.on('data', (d) => {
      out += d
      if (out.includes('\n')) {
        conn.end()
        resolve(out.trim())
      }
    })
    conn.write(`${payload}\n`)
  })
}

export async function runSessionRequest(
  dir: string | undefined,
  node: string | undefined,
  req: CommandRequest,
): Promise<CommandResponse> {
  const sockPath = await sessionControlPath(dir, node)
  const raw = await socketCommand(sockPath, JSON.stringify(req))
  const res = JSON.parse(raw) as CommandResponse
  if (!res.ok) {
    throw new Error(res.error ?? 'session command failed')
  }
  return res
}
