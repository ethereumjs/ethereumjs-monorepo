import { constants, accessSync, readFileSync } from 'node:fs'
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

import { Common, Hardfork, Mainnet, Sepolia } from '@ethereumjs/common'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

import { genPrivateKey } from '../util.ts'

import { LAB_DEFAULT_DIR, LAB_DEFAULT_NODE_FILE, LAB_DIR_ENV, LAB_NODE_ENV } from './constants.ts'
import { privateKeyToEnode } from './enode.ts'

export type LabNetworkConfig = {
  chain: 'mainnet' | 'sepolia'
  hardfork: string
}

export type LabNodeConfig = {
  name: string
  listenAddress: string
  udpPort: number
  tcpPort: number
  capabilities: string[]
  clientId: string
  controlPort?: number
}

export type LabKeyConfig = {
  privateKey: string
}

export function defaultNetwork(): LabNetworkConfig {
  return { chain: 'mainnet', hardfork: 'london' }
}

export function commonFromNetwork(net: LabNetworkConfig) {
  const chain = net.chain === 'sepolia' ? Sepolia : Mainnet
  return new Common({ chain, hardfork: net.hardfork as Hardfork })
}

export async function initLabDir(
  rootDir: string,
  nodeNames: string[],
  basePort: number,
  network: LabNetworkConfig,
): Promise<void> {
  await mkdir(rootDir, { recursive: true })
  const labRootAbs = resolve(rootDir)
  await writeFile(join(rootDir, 'network.json'), `${JSON.stringify(network, null, 2)}\n`)
  await writeFile(join(rootDir, '.root'), `${labRootAbs}\n`)

  for (let i = 0; i < nodeNames.length; i++) {
    const name = nodeNames[i]
    const nodeDir = join(rootDir, name)
    await mkdir(nodeDir, { recursive: true })
    const privateKey = genPrivateKey()
    const udpPort = basePort + i * 2
    const tcpPort = basePort + i * 2
    const listenAddress = '127.0.0.1'
    const keyConfig: LabKeyConfig = { privateKey: bytesToHex(privateKey) }
    const nodeConfig: LabNodeConfig = {
      name,
      listenAddress,
      udpPort,
      tcpPort,
      capabilities: ['eth68', 'snap'],
      clientId: 'ethereumjs-devp2p-lab',
      controlPort: 9200 + i,
    }
    await writeFile(join(nodeDir, 'key.json'), `${JSON.stringify(keyConfig, null, 2)}\n`)
    await writeFile(join(nodeDir, 'node.json'), `${JSON.stringify(nodeConfig, null, 2)}\n`)
    const enode = privateKeyToEnode(privateKey, listenAddress, tcpPort, udpPort)
    await writeFile(join(nodeDir, 'enode.txt'), `${enode}\n`)
  }

  if (nodeNames.length === 1) {
    await writeLabDefaultNode(rootDir, nodeNames[0]!)
  }
}

export async function loadLabNode(rootDir: string, nodeName: string) {
  const nodeDir = join(rootDir, nodeName)
  const network = JSON.parse(
    await readFile(join(rootDir, 'network.json'), 'utf8'),
  ) as LabNetworkConfig
  const nodeConfig = JSON.parse(await readFile(join(nodeDir, 'node.json'), 'utf8')) as LabNodeConfig
  const keyConfig = JSON.parse(await readFile(join(nodeDir, 'key.json'), 'utf8')) as LabKeyConfig
  const privateKey = hexToBytes(keyConfig.privateKey as `0x${string}`)
  const common = commonFromNetwork(network)
  return { rootDir, nodeDir, network, nodeConfig, privateKey, common }
}

function isLabRoot(path: string): boolean {
  try {
    accessSync(join(path, 'network.json'), constants.F_OK)
    return true
  } catch {
    return false
  }
}

/** Resolve lab root: `--dir` / `DEVP2P_LAB` → cwd if already lab → `./lab` under cwd or ancestors → pinned `lab/.root`. */
export function resolveLabRoot(dir?: string): string {
  const explicit = dir?.trim()
  if (explicit) return resolve(explicit)

  const fromEnv = process.env[LAB_DIR_ENV]?.trim()
  if (fromEnv) return resolve(fromEnv)

  const cwd = resolve(process.cwd())
  if (isLabRoot(cwd)) return cwd

  let current = cwd
  for (let i = 0; i < 12; i++) {
    if (isLabRoot(current)) return current
    const nested = join(current, LAB_DEFAULT_DIR)
    if (isLabRoot(nested)) return nested
    const parent = dirname(current)
    if (parent === current) break
    current = parent
  }

  const fallback = join(cwd, LAB_DEFAULT_DIR)
  try {
    const pinned = readFileSync(join(fallback, '.root'), 'utf8').trim()
    if (pinned && isLabRoot(pinned)) return resolve(pinned)
  } catch {
    /* no pin */
  }

  return fallback
}

export async function listLabNodeNames(rootDir: string): Promise<string[]> {
  let entries: Awaited<ReturnType<typeof readdir>>
  try {
    entries = await readdir(rootDir, { withFileTypes: true })
  } catch {
    return []
  }
  const names: string[] = []
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue
    try {
      await access(join(rootDir, entry.name, 'node.json'))
      names.push(entry.name)
    } catch {
      /* not a lab node dir */
    }
  }
  return names.sort()
}

export async function writeLabDefaultNode(rootDir: string, nodeName: string): Promise<void> {
  await writeFile(join(rootDir, LAB_DEFAULT_NODE_FILE), `${nodeName.trim()}\n`)
}

async function readLabDefaultNodeFile(rootDir: string): Promise<string | undefined> {
  try {
    const name = (await readFile(join(rootDir, LAB_DEFAULT_NODE_FILE), 'utf8')).trim()
    return name || undefined
  } catch {
    return undefined
  }
}

function isProcessRunning(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) return false
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

export async function isNodeDaemonRunning(rootDir: string, nodeName: string): Promise<boolean> {
  try {
    const pid = Number((await readFile(join(rootDir, nodeName, 'node.pid'), 'utf8')).trim())
    return isProcessRunning(pid)
  } catch {
    return false
  }
}

/**
 * Default lab node: `--node` → `DEVP2P_NODE` → `lab/.node` → sole configured node → sole running daemon.
 */
export async function resolveLabNode(rootDir: string, node?: string): Promise<string> {
  const explicit = node?.trim()
  if (explicit) return explicit

  const fromEnv = process.env[LAB_NODE_ENV]?.trim()
  if (fromEnv) return fromEnv

  const fromFile = await readLabDefaultNodeFile(rootDir)
  if (fromFile) {
    await loadLabNode(rootDir, fromFile)
    return fromFile
  }

  const configured = await listLabNodeNames(rootDir)
  if (configured.length === 0) {
    throw new Error(`No lab nodes under ${rootDir} — run devp2p init first`)
  }
  if (configured.length === 1) return configured[0]!

  const running: string[] = []
  for (const name of configured) {
    if (await isNodeDaemonRunning(rootDir, name)) running.push(name)
  }
  if (running.length === 1) return running[0]!

  const hint =
    running.length > 1
      ? `several daemons running (${running.join(', ')})`
      : `nodes ${configured.join(', ')}`
  throw new Error(
    `Ambiguous lab node (${hint}) — pass --node, set ${LAB_NODE_ENV}, or run devp2p use <name>`,
  )
}

export async function setLabDefaultNode(rootDir: string, nodeName: string): Promise<void> {
  await loadLabNode(rootDir, nodeName)
  await writeLabDefaultNode(rootDir, nodeName)
}
