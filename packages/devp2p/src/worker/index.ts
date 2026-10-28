import { pathToFileURL } from 'node:url'
import { MessageChannel, Worker } from 'node:worker_threads'

import { Devp2pWorkerClient } from './client.ts'
import { Devp2pWorkerHost } from './host.ts'
import {
  resolveThreadedNetworkModuleUrl,
  resolveWorkerEntryPath,
  workerExecArgv,
} from './resolveEntry.ts'

import type { ThreadedNetworkInitOptions } from './protocol.ts'

function defaultWorkerModuleUrl(): string | undefined {
  const filename = (globalThis as { __filename?: string }).__filename
  if (filename === undefined) return undefined
  return pathToFileURL(filename).href
}

export { Devp2pWorkerClient } from './client.ts'
export { Devp2pWorkerHost } from './host.ts'
export { resolveThreadedNetworkModuleUrl } from './resolveEntry.ts'
export type {
  ThreadedEthStatusFields,
  ThreadedNetworkInitOptions,
  WorkerChainId,
  WorkerDiagnosticEntry,
  WorkerDiscoverySnapshot,
  WorkerPeerSnapshot,
  WorkerTelemetrySnapshot,
} from './protocol.ts'

export type CreateThreadedNetworkOptions = ThreadedNetworkInitOptions & {
  /** Run host on a MessageChannel instead of a Worker (CI-friendly). */
  inProcess?: boolean
}

/**
 * Spawn a dedicated networking worker (or in-process host) and return the main-thread client.
 *
 * @param moduleUrl Pass `import.meta.url` from the caller when spawning a real `Worker` under ESM.
 */
export async function createThreadedNetwork(
  options: CreateThreadedNetworkOptions,
  moduleUrl?: string,
): Promise<Devp2pWorkerClient> {
  const { inProcess, ...initOptions } = options
  let client: Devp2pWorkerClient

  if (inProcess === true) {
    const channel = new MessageChannel()
    new Devp2pWorkerHost(channel.port1)
    client = new Devp2pWorkerClient(channel.port2)
  } else {
    const resolvedUrl = moduleUrl ?? defaultWorkerModuleUrl()
    if (resolvedUrl === undefined) {
      throw new Error(
        'createThreadedNetwork requires moduleUrl (import.meta.url) when spawning a Worker',
      )
    }
    const entry = resolveWorkerEntryPath(resolvedUrl)
    const worker = new Worker(entry, {
      execArgv: workerExecArgv(entry, resolvedUrl),
    })
    client = new Devp2pWorkerClient(worker)
  }

  const ready = new Promise<void>((resolve, reject) => {
    client.events.once('ready', () => resolve())
    client.events.once('error', (err) => reject(err))
  })

  client.init(initOptions)
  await client.start()
  await ready
  return client
}
