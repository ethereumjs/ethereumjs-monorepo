import { type ChildProcess, spawn } from 'node:child_process'
import { access } from 'node:fs/promises'
import { join } from 'node:path'

import { parseReplLine } from '../lab/commandParse.ts'
import { socketCommand } from '../lab/controlClient.ts'
import { isNodeDaemonRunning, listLabNodeNames, loadLabNode } from '../lab/labDir.ts'
import { stopNode } from '../lab/nodeDaemon.ts'

import type { LabEventRecord } from '../lab/eventBus.ts'

import {
  appendLocalReply,
  applyPeerListStatus,
  commandLayer,
  createPaneState,
  formatCommandReply,
  reduceLabEvent,
} from './model.ts'

import {
  emptyCursor,
  moveHistory,
  pushHistoryLine,
  readHistoryFile,
  writeHistoryFile,
} from './history.ts'
import { pushKey } from './keys.ts'
import type { TranscriptLine } from './model.ts'
import { computeLayout, renderTui } from './render.ts'

import type { HistoryCursor, HistoryFile } from './history.ts'

export type TuiOptions = {
  labRoot: string
  leftNode: string
  rightNode?: string
  remote?: string
  dir?: string
  /** Path to `bin/devp2p.cjs` (defaults to `process.argv[1]`). */
  devp2pBin?: string
  /** Show RLPx PING / PONG. Hidden by default. */
  showPings?: boolean
}

type PaneRuntime = {
  nodeName: string
  controlPath: string
  spawned: boolean
  child?: ChildProcess
  peerFilter?: string
  remoteViewLabel?: string
}

export async function runTui(opts: TuiOptions): Promise<void> {
  const devp2pBin = opts.devp2pBin ?? process.argv[1]
  if (!devp2pBin) {
    throw new Error('devp2p bin path missing — invoke via npx devp2p tui')
  }
  const leftLoaded = await loadLabNode(opts.labRoot, opts.leftNode)
  const leftListen = `${leftLoaded.nodeConfig.listenAddress}:${leftLoaded.nodeConfig.tcpPort}`

  let rightNode = opts.rightNode
  let remoteFilter: string | undefined
  let remoteLabel: string | undefined
  let rightHasPrompt = true

  if (opts.remote) {
    remoteFilter = opts.remote
    remoteLabel = opts.remote
    rightHasPrompt = false
    rightNode = opts.leftNode
  } else if (!rightNode) {
    const names = await listLabNodeNames(opts.labRoot)
    rightNode = names.find((n) => n !== opts.leftNode) ?? 'bob'
  }

  const rightLoaded =
    opts.remote === undefined ? await loadLabNode(opts.labRoot, rightNode) : leftLoaded
  const rightListen =
    opts.remote === undefined
      ? `${rightLoaded.nodeConfig.listenAddress}:${rightLoaded.nodeConfig.tcpPort}`
      : remoteLabel

  const leftRuntime = await startPaneRuntime(opts.labRoot, opts.leftNode, devp2pBin)
  const rightRuntime: PaneRuntime =
    opts.remote !== undefined
      ? {
          nodeName: opts.leftNode,
          controlPath: leftRuntime.controlPath,
          spawned: false,
          peerFilter: remoteFilter,
          remoteViewLabel: remoteLabel,
        }
      : await startPaneRuntime(opts.labRoot, rightNode, devp2pBin)

  let leftPane = createPaneState(opts.leftNode, { listenLabel: leftListen })
  let rightPane = createPaneState(rightNode, {
    listenLabel: typeof rightListen === 'string' ? rightListen : undefined,
    remoteViewLabel: remoteLabel,
  })

  if (!leftRuntime.spawned) leftPane.status.attachedOnly = true
  if (!rightRuntime.spawned && opts.remote === undefined) rightPane.status.attachedOnly = true

  let leftDraft = ''
  let rightDraft = ''
  let focus: 'left' | 'right' = 'left'
  const historyPath = join(opts.labRoot, '.tui-history.json')
  let historyFile: HistoryFile = await readHistoryFile(historyPath)
  let leftHist = historyFile[opts.leftNode] ?? []
  let rightHist = historyFile[rightNode] ?? []
  let leftCursor: HistoryCursor = emptyCursor(leftHist)
  let rightCursor: HistoryCursor = emptyCursor(rightHist)
  const eventOpts = { showKeepalive: opts.showPings === true }

  const spawnedNodes: string[] = []
  if (leftRuntime.spawned) spawnedNodes.push(opts.leftNode)
  if (rightRuntime.spawned && rightRuntime.nodeName !== opts.leftNode) {
    spawnedNodes.push(rightRuntime.nodeName)
  }

  const onEventLeft = (ev: LabEventRecord) => {
    leftPane = reduceLabEvent(leftPane, ev, eventOpts)
    if (opts.remote) {
      rightPane = reduceLabEvent(rightPane, ev, { ...eventOpts, peerFilter: remoteFilter })
    }
    scheduleDraw()
  }

  const onEventRight = (ev: LabEventRecord) => {
    if (opts.remote) return
    rightPane = reduceLabEvent(rightPane, ev, eventOpts)
    scheduleDraw()
  }

  if (leftRuntime.child) wireNdjson(leftRuntime.child, onEventLeft)
  if (rightRuntime.child && rightRuntime.child !== leftRuntime.child) {
    wireNdjson(rightRuntime.child, onEventRight)
  }

  const pollAttached = async () => {
    const needsPoll =
      leftPane.status.attachedOnly || (opts.remote === undefined && rightPane.status.attachedOnly)
    if (!needsPoll) return
    try {
      const raw = await socketCommand(leftRuntime.controlPath, JSON.stringify({ cmd: 'peer.list' }))
      const res = JSON.parse(raw) as { ok: boolean; data?: Array<{ index: number; addr: string }> }
      if (res.ok && res.data) {
        leftPane = applyPeerListStatus(leftPane, res.data)
        if (opts.remote) {
          rightPane = applyPeerListStatus(rightPane, res.data)
        }
        scheduleDraw()
      }
    } catch {
      /* ignore */
    }
  }

  const pollTimer = setInterval(() => {
    void pollAttached()
  }, 2000)

  if (opts.remote && remoteFilter) {
    const [host, portStr] = parseRemoteHostPort(remoteFilter)
    const udp = Number(portStr)
    void socketCommand(
      leftRuntime.controlPath,
      JSON.stringify({
        cmd: 'peer.add',
        host,
        udpPort: udp,
        tcpPort: udp,
        waitEvent: 'peer.added',
        waitTimeoutMs: 30000,
      }),
    ).catch(() => {
      /* user can retry via prompt */
    })
  } else if (opts.remote === undefined) {
    void crossDialIfNeeded(
      leftRuntime,
      rightRuntime,
      leftLoaded.nodeConfig.udpPort,
      leftLoaded.nodeConfig.tcpPort,
      rightLoaded.nodeConfig.udpPort,
      rightLoaded.nodeConfig.tcpPort,
    ).catch(() => {})
  }

  let drawScheduled = false
  const scheduleDraw = () => {
    if (drawScheduled) return
    drawScheduled = true
    setImmediate(() => {
      drawScheduled = false
      draw()
    })
  }

  const cols = process.stdout.columns ?? 100
  const rows = process.stdout.rows ?? 30
  let layout = computeLayout(cols, rows)

  const draw = () => {
    if (!process.stdout.isTTY) return
    const c = process.stdout.columns ?? layout.cols
    const r = process.stdout.rows ?? layout.rows
    layout = computeLayout(c, r)
    const frame = renderTui(
      {
        left: leftPane,
        right: rightPane,
        leftDraft,
        rightDraft,
        focus,
        rightHasPrompt,
        footerHint: 'Tab focus · ↑ history · Enter send · q quit',
      },
      layout,
    )
    process.stdout.write(`\x1b[H${frame}`)
  }

  const cleanup = async () => {
    clearInterval(pollTimer)
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false)
      process.stdin.pause()
    }
    process.stdout.write('\x1b[?25h')
    for (const name of spawnedNodes) {
      try {
        await stopNode(opts.labRoot, name)
      } catch {
        /* ignore */
      }
    }
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('devp2p tui requires an interactive terminal (TTY)')
  }

  process.stdout.write('\x1b[?25l')
  process.stdin.setRawMode(true)
  process.stdin.resume()
  process.stdin.setEncoding('utf8')

  process.stdout.on('resize', scheduleDraw)
  draw()

  await new Promise<void>((resolve) => {
    let keyBuf = ''
    const recall = (dir: 'up' | 'down') => {
      if (focus === 'left') {
        const moved = moveHistory(leftHist, leftCursor, leftDraft, dir)
        leftCursor = moved.cursor
        leftDraft = moved.draft
      } else if (rightHasPrompt) {
        const moved = moveHistory(rightHist, rightCursor, rightDraft, dir)
        rightCursor = moved.cursor
        rightDraft = moved.draft
      }
      scheduleDraw()
    }
    const remember = (side: 'left' | 'right', line: string) => {
      const nodeName = side === 'left' ? opts.leftNode : rightNode
      if (side === 'left') {
        leftHist = pushHistoryLine(leftHist, line)
        leftCursor = emptyCursor(leftHist)
        historyFile = { ...historyFile, [nodeName]: leftHist }
      } else {
        rightHist = pushHistoryLine(rightHist, line)
        rightCursor = emptyCursor(rightHist)
        historyFile = { ...historyFile, [nodeName]: rightHist }
      }
      void writeHistoryFile(historyPath, historyFile).catch(() => {})
    }
    process.stdin.on('data', (chunk: string) => {
      for (const raw of chunk) {
        const step = pushKey(keyBuf, raw)
        keyBuf = step.buffer
        if (!step.action || step.action.type === 'ignore') continue
        if (step.action.type === 'up' || step.action.type === 'down') {
          recall(step.action.type)
          continue
        }
        const ch = step.action.ch
        const draft = focus === 'left' ? leftDraft : rightDraft
        if (ch === '\u0003' || (ch === 'q' && draft === '')) {
          void cleanup().then(resolve)
          return
        }
        if (ch === '\t') {
          if (rightHasPrompt) focus = focus === 'left' ? 'right' : 'left'
          scheduleDraw()
          continue
        }
        if (ch === '\r' || ch === '\n') {
          const line = focus === 'left' ? leftDraft : rightDraft
          const runtime = focus === 'left' ? leftRuntime : rightRuntime
          if (focus === 'left') leftDraft = ''
          else rightDraft = ''
          scheduleDraw()
          if (line.trim()) {
            const side = focus
            remember(side, line)
            void dispatchReplLine(runtime.controlPath, line, (reply) => {
              let pane = side === 'left' ? leftPane : rightPane
              if (reply.peers) pane = applyPeerListStatus(pane, reply.peers)
              pane = appendLocalReply(pane, reply.line)
              if (side === 'left') leftPane = pane
              else rightPane = pane
              scheduleDraw()
            })
          }
          continue
        }
        if (ch === '\u007f' || ch === '\b') {
          if (focus === 'left') leftDraft = leftDraft.slice(0, -1)
          else rightDraft = rightDraft.slice(0, -1)
          scheduleDraw()
          continue
        }
        if (ch < ' ') continue
        if (focus === 'left') leftDraft += ch
        else rightDraft += ch
        scheduleDraw()
      }
    })
  })
}

type CommandReply = {
  line: TranscriptLine
  peers?: Array<{ index: number; addr: string }>
}

async function dispatchReplLine(
  controlPath: string,
  line: string,
  show: (reply: CommandReply) => void,
) {
  const typed = line.trim()
  try {
    const req = parseReplLine(typed)
    const raw = await socketCommand(controlPath, JSON.stringify(req))
    const res = JSON.parse(raw) as { ok: boolean; error?: string; data?: unknown }
    if (!res.ok) {
      show({
        line: {
          layer: commandLayer(req.cmd),
          dir: 'out',
          name: typed,
          payloadLines: [res.error ?? 'command failed'],
        },
      })
      return
    }
    const payloadLines = formatCommandReply(req.cmd, res.data)
    if (payloadLines === undefined) return
    const peers =
      req.cmd === 'peer.list' && Array.isArray(res.data)
        ? (res.data as Array<{ index: number; addr: string }>)
        : undefined
    show({
      line: {
        layer: commandLayer(req.cmd),
        dir: 'out',
        name: typed,
        payloadLines,
      },
      peers,
    })
  } catch (e: unknown) {
    show({
      line: {
        layer: 'rlpx',
        dir: 'out',
        name: typed,
        payloadLines: [(e as Error).message],
      },
    })
  }
}

async function startPaneRuntime(
  labRoot: string,
  nodeName: string,
  devp2pBin: string,
): Promise<PaneRuntime> {
  const loaded = await loadLabNode(labRoot, nodeName)
  const controlPath = join(loaded.nodeDir, 'control.sock')
  const running = await isNodeDaemonRunning(labRoot, nodeName)
  if (running) {
    try {
      await access(controlPath)
      return { nodeName, controlPath, spawned: false }
    } catch {
      /* fall through to spawn */
    }
  }
  const child = spawn(
    process.execPath,
    [
      devp2pBin,
      'node',
      'run',
      '--dir',
      labRoot,
      '--node',
      nodeName,
      '--events',
      'ndjson',
      '--control',
      'socket',
    ],
    {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
    },
  )
  await waitForControlSocket(controlPath)
  return { nodeName, controlPath, spawned: true, child }
}

function wireNdjson(child: ChildProcess, onEvent: (ev: LabEventRecord) => void) {
  let buffer = ''
  child.stdout?.setEncoding('utf8')
  child.stdout?.on('data', (chunk: string) => {
    buffer += chunk
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const ev = JSON.parse(line) as LabEventRecord
        if (ev.t === 'event') onEvent(ev)
      } catch {
        /* ignore non-json */
      }
    }
  })
  child.stderr?.on('data', () => {
    /* daemon logs on stderr */
  })
}

async function waitForControlSocket(sockPath: string, ms = 20000) {
  const start = Date.now()
  while (Date.now() - start < ms) {
    try {
      await access(sockPath)
      return
    } catch {
      await new Promise((r) => setTimeout(r, 50))
    }
  }
  throw new Error(`Timed out waiting for control socket ${sockPath}`)
}

function parseRemoteHostPort(remote: string): [string, string] {
  const trimmed = remote.trim()
  if (trimmed.startsWith('[')) {
    const end = trimmed.indexOf(']')
    if (end > 0) {
      const host = trimmed.slice(1, end)
      const port = trimmed.slice(end + 1).replace(/^:/, '')
      return [host, port]
    }
  }
  const idx = trimmed.lastIndexOf(':')
  if (idx <= 0) throw new Error(`Invalid --remote ${remote} (expected host:port)`)
  return [trimmed.slice(0, idx), trimmed.slice(idx + 1)]
}

async function crossDialIfNeeded(
  left: PaneRuntime,
  right: PaneRuntime,
  leftUdp: number,
  leftTcp: number,
  rightUdp: number,
  rightTcp: number,
) {
  const raw = await socketCommand(left.controlPath, JSON.stringify({ cmd: 'peer.list' }))
  const res = JSON.parse(raw) as { ok: boolean; data?: Array<{ addr: string }> }
  if (res.ok && res.data && res.data.length > 0) return
  await socketCommand(
    left.controlPath,
    JSON.stringify({
      cmd: 'peer.add',
      host: '127.0.0.1',
      udpPort: rightUdp,
      tcpPort: rightTcp,
      waitEvent: 'peer.added',
      waitTimeoutMs: 15000,
    }),
  )
  await socketCommand(
    right.controlPath,
    JSON.stringify({
      cmd: 'peer.add',
      host: '127.0.0.1',
      udpPort: leftUdp,
      tcpPort: leftTcp,
      waitEvent: 'peer.added',
      waitTimeoutMs: 15000,
    }),
  )
}
