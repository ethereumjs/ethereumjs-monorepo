import { join } from 'node:path'

import { socketCommand } from '../lab/controlClient.ts'
import { loadLabNode, resolveLabNode, resolveLabRoot } from '../lab/labDir.ts'

import type { CommandRequest, CommandResponse } from '../lab/commandDispatcher.ts'

export type SessionCommandResult = CommandResponse & { node: string }

export async function sessionControlPath(
  dir: string | undefined,
  node: string | undefined,
): Promise<string> {
  const root = resolveLabRoot(dir)
  const nodeName = await resolveLabNode(root, node)
  const loaded = await loadLabNode(root, nodeName)
  return join(loaded.nodeDir, 'control.sock')
}

export { socketCommand } from '../lab/controlClient.ts'

export async function runSessionRequest(
  dir: string | undefined,
  node: string | undefined,
  req: CommandRequest,
): Promise<SessionCommandResult> {
  const root = resolveLabRoot(dir)
  const nodeName = await resolveLabNode(root, node)
  const sockPath = await sessionControlPath(dir, node)
  const raw = await socketCommand(sockPath, JSON.stringify(req))
  const res = JSON.parse(raw) as CommandResponse
  if (!res.ok) {
    throw new Error(`${res.error ?? 'session command failed'} (node: ${nodeName})`)
  }
  return { ...res, node: nodeName }
}
