import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { createInterface } from 'node:readline'
import { parseArgs } from 'node:util'

import { bytesToHex } from '@ethereumjs/util'
import { ENR } from '../dns/enr.ts'
import {
  buildEthSendRequest,
  buildEthWaitRequest,
  buildSnapSendRequest,
  buildSnapWaitRequest,
  buildWaitRequest,
  parseReplLine,
} from '../lab/commandParse.ts'
import { LAB_DEFAULT_DIR, LAB_NODE_ENV } from '../lab/constants.ts'
import { privateKeyToEnode } from '../lab/enode.ts'
import {
  defaultNetwork,
  initLabDir,
  loadLabNode,
  resolveLabNode,
  resolveLabRoot,
  setLabDefaultNode,
} from '../lab/labDir.ts'
import { runNodeDaemon, stopNode } from '../lab/nodeDaemon.ts'
import { runScenarioPath } from '../lab/scenarioRunner.ts'
import { genPrivateKey } from '../util.ts'
import { runSessionRequest, sessionControlPath, socketCommand } from './sessionClient.ts'

function printHelp() {
  console.log(`devp2p — EthereumJS devp2p lab CLI

Lab data defaults to ./${LAB_DEFAULT_DIR} in the current working directory.
Override with --dir path or -l path on init, node, attach, and session commands.

Default node (when --node / -n is omitted): ${LAB_NODE_ENV} → lab/.node (devp2p use) → only node in lab → only running daemon.

Usage:
  devp2p init [--nodes a,b] [--base-port N] [--chain mainnet|sepolia]
  devp2p use <name>              set default node for this lab (writes lab/.node)
  devp2p key generate | key show [--node name]
  devp2p enode show [--node name]
  devp2p node run [--node name] [--events ndjson] [--control socket|stdin|none]
  devp2p node stop [--node name]
  devp2p attach [--node name]

Session commands (require \`node run\` on the chosen node):
  devp2p peer add [--node name] <host> <udpPort> [--tcp N] [--wait] [--timeout-ms N]
  devp2p peer list [--node name]
  devp2p peer disconnect [--node name] [--peer N]
  devp2p dpt ping [--node name] <host> <udpPort>
  devp2p rlpx ping [--node name] [--peer N]
  devp2p wait [--node name] --event peer.added|eth.NAME|snap.NAME|rlpx.PONG [--timeout-ms N]
  devp2p eth send [--node name] [--peer N] --name MSG [--json '{}'] [--rlp '[]']
  devp2p eth wait [--node name] --name MSG [--timeout-ms N]
  devp2p snap send [--node name] [--peer N] --name MSG [--json '{}'] [--rlp '[]']
  devp2p snap wait [--node name] --name MSG [--timeout-ms N]

  devp2p scenario run <file.json>
  devp2p scenario list
  devp2p lab run --spec <file.json>
  devp2p enr decode <base64-or-hex>
  devp2p discovery-v4 ping <host> <udpPort>   (ephemeral; prefer dpt ping on a running node)
`)
}

const labDirOpt = { type: 'string' as const, short: 'l' as const }

const labNodeOpt = { type: 'string' as const, short: 'n' as const }

const sessionDirOpts = {
  dir: labDirOpt,
  node: labNodeOpt,
  peer: { type: 'string' as const },
  'timeout-ms': { type: 'string' as const },
}

async function main(argv: string[]) {
  if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') {
    printHelp()
    return
  }
  const cmd = argv[0]
  const rest = argv.slice(1)

  if (cmd === 'init') {
    const { values } = parseArgs({
      args: rest,
      options: {
        dir: labDirOpt,
        nodes: { type: 'string', default: 'alice,bob' },
        'base-port': { type: 'string', default: '30300' },
        chain: { type: 'string', default: 'mainnet' },
      },
      allowPositionals: false,
    })
    const root = resolveLabRoot(values.dir)
    const names = (values.nodes as string).split(',').map((s) => s.trim())
    const network = defaultNetwork()
    network.chain = values.chain === 'sepolia' ? 'sepolia' : 'mainnet'
    await initLabDir(root, names, Number(values['base-port']), network)
    console.log(`Initialized lab (${names.join(', ')})`)
    if (names.length > 1) {
      console.log(
        `Tip: devp2p use ${names[0]} (or export ${LAB_NODE_ENV}=${names[0]}) before session commands`,
      )
    }
    return
  }

  if (cmd === 'use') {
    const { values, positionals } = parseArgs({
      args: rest,
      options: { dir: labDirOpt },
      allowPositionals: true,
    })
    const name = positionals[0]
    if (!name) throw new Error('use requires a node name')
    const root = resolveLabRoot(values.dir)
    await setLabDefaultNode(root, name)
    console.log(`Default node: ${name}`)
    return
  }

  if (cmd === 'key') {
    const sub = rest[0]
    if (sub === 'generate') {
      console.log(bytesToHex(genPrivateKey()))
      return
    }
    if (sub === 'show') {
      const { values } = parseArgs({
        args: rest.slice(1),
        options: { dir: labDirOpt, node: labNodeOpt },
      })
      const root = resolveLabRoot(values.dir)
      const nodeName = await resolveLabNode(root, values.node)
      const loaded = await loadLabNode(root, nodeName)
      console.log(bytesToHex(loaded.privateKey))
      return
    }
  }

  if (cmd === 'enode' && rest[0] === 'show') {
    const { values } = parseArgs({
      args: rest.slice(1),
      options: { dir: labDirOpt, node: labNodeOpt },
    })
    const root = resolveLabRoot(values.dir)
    const nodeName = await resolveLabNode(root, values.node)
    const loaded = await loadLabNode(root, nodeName)
    const n = loaded.nodeConfig
    console.log(privateKeyToEnode(loaded.privateKey, n.listenAddress, n.tcpPort, n.udpPort))
    return
  }

  if (cmd === 'node') {
    const sub = rest[0]
    const { values } = parseArgs({
      args: rest.slice(1),
      options: {
        dir: labDirOpt,
        node: labNodeOpt,
        events: { type: 'string' },
        control: { type: 'string', default: 'socket' },
      },
    })
    const root = resolveLabRoot(values.dir)
    const nodeName = await resolveLabNode(root, values.node)
    if (sub === 'run') {
      await runNodeDaemon({
        labRoot: root,
        nodeName,
        eventsNdjson: values.events === 'ndjson',
        control: (values.control as 'socket' | 'stdin' | 'none') ?? 'socket',
      })
      return
    }
    if (sub === 'stop') {
      await stopNode(root, nodeName)
      console.log(`Stopped ${nodeName}`)
      return
    }
  }

  if (cmd === 'attach') {
    const { values } = parseArgs({
      args: rest,
      options: { dir: labDirOpt, node: labNodeOpt },
    })
    const root = resolveLabRoot(values.dir)
    const nodeName = await resolveLabNode(root, values.node)
    const sockPath = await sessionControlPath(values.dir, nodeName)
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `devp2p/${nodeName}> `,
    })
    rl.prompt()
    rl.on('line', (line) => {
      void (async () => {
        const trimmed = line.trim()
        if (!trimmed) {
          rl.prompt()
          return
        }
        if (trimmed === 'exit' || trimmed === 'quit') {
          rl.close()
          return
        }
        try {
          const req = parseReplLine(trimmed)
          const res = await socketCommand(sockPath, JSON.stringify(req))
          console.log(res)
        } catch (e: unknown) {
          console.error((e as Error).message)
        }
        rl.prompt()
      })()
    })
    return
  }

  if (cmd === 'peer') {
    const sub = rest[0]
    if (sub === 'add') {
      const { values, positionals } = parseArgs({
        args: rest.slice(1),
        options: {
          ...sessionDirOpts,
          tcp: { type: 'string' },
          wait: { type: 'boolean', default: false },
          'timeout-ms': { type: 'string' },
        },
        allowPositionals: true,
      })
      const host = positionals[0]
      const udp = Number(positionals[1])
      const tcpFromFlag = values.tcp !== undefined ? Number(values.tcp) : undefined
      const tcpFromPos = positionals[2] !== undefined ? Number(positionals[2]) : undefined
      const tcp = tcpFromFlag ?? tcpFromPos
      if (!host || !udp) throw new Error('peer add <host> <udpPort> [--tcp N]')
      const res = await runSessionRequest(values.dir, values.node, {
        cmd: 'peer.add',
        host,
        udpPort: udp,
        tcpPort: tcp,
        ...(values.wait
          ? {
              waitEvent: 'peer.added',
              waitTimeoutMs: Number(values['timeout-ms'] ?? 30000),
            }
          : {}),
      })
      console.log(JSON.stringify(res))
      return
    }
    const { values, positionals } = parseArgs({
      args: rest.slice(1),
      options: sessionDirOpts,
      allowPositionals: true,
    })
    if (sub === 'list') {
      const res = await runSessionRequest(values.dir, values.node, { cmd: 'peer.list' })
      console.log(JSON.stringify(res))
      return
    }
    if (sub === 'disconnect') {
      const res = await runSessionRequest(values.dir, values.node, {
        cmd: 'peer.disconnect',
        peerIndex: Number(values.peer ?? 0),
      })
      console.log(JSON.stringify(res))
      return
    }
  }

  if (cmd === 'wait') {
    const { values } = parseArgs({
      args: rest,
      options: { ...sessionDirOpts, event: { type: 'string' } },
    })
    const req = buildWaitRequest({
      event: values.event as string,
      timeoutMs: Number(values['timeout-ms'] ?? 30000),
    })
    const res = await runSessionRequest(values.dir, values.node, req)
    console.log(JSON.stringify(res))
    return
  }

  if (cmd === 'dpt' && rest[0] === 'ping') {
    const { values, positionals } = parseArgs({
      args: rest.slice(1),
      options: sessionDirOpts,
      allowPositionals: true,
    })
    const host = positionals[0]
    const udp = Number(positionals[1])
    if (!host || !udp) throw new Error('dpt ping <host> <udpPort>')
    const res = await runSessionRequest(values.dir, values.node, {
      cmd: 'dpt.ping',
      host,
      udpPort: udp,
    })
    console.log(JSON.stringify(res))
    return
  }

  if (cmd === 'rlpx' && rest[0] === 'ping') {
    const { values } = parseArgs({ args: rest.slice(1), options: sessionDirOpts })
    const res = await runSessionRequest(values.dir, values.node, {
      cmd: 'rlpx.ping',
      peerIndex: Number(values.peer ?? 0),
    })
    console.log(JSON.stringify(res))
    return
  }

  if (cmd === 'eth') {
    const sub = rest[0]
    const { values } = parseArgs({
      args: rest.slice(1),
      options: {
        ...sessionDirOpts,
        name: { type: 'string' },
        json: { type: 'string' },
        rlp: { type: 'string' },
      },
    })
    if (sub === 'send') {
      const req = buildEthSendRequest({
        name: values.name as string,
        peer: values.peer as string,
        json: values.json as string,
        rlp: values.rlp as string,
      })
      const res = await runSessionRequest(values.dir, values.node, req)
      console.log(JSON.stringify(res))
      return
    }
    if (sub === 'wait') {
      const req = buildEthWaitRequest({
        name: values.name as string,
        timeoutMs: Number(values['timeout-ms'] ?? 30000),
      })
      const res = await runSessionRequest(values.dir, values.node, req)
      console.log(JSON.stringify(res))
      return
    }
  }

  if (cmd === 'snap') {
    const sub = rest[0]
    const { values } = parseArgs({
      args: rest.slice(1),
      options: {
        ...sessionDirOpts,
        name: { type: 'string' },
        json: { type: 'string' },
        rlp: { type: 'string' },
      },
    })
    if (sub === 'send') {
      const req = buildSnapSendRequest({
        name: values.name as string,
        peer: values.peer as string,
        json: values.json as string,
        rlp: values.rlp as string,
      })
      const res = await runSessionRequest(values.dir, values.node, req)
      console.log(JSON.stringify(res))
      return
    }
    if (sub === 'wait') {
      const req = buildSnapWaitRequest({
        name: values.name as string,
        timeoutMs: Number(values['timeout-ms'] ?? 30000),
      })
      const res = await runSessionRequest(values.dir, values.node, req)
      console.log(JSON.stringify(res))
      return
    }
  }

  if (cmd === 'scenario') {
    const sub = rest[0]
    if (sub === 'run') {
      const file = rest[1]
      if (!file) throw new Error('scenario run requires a file path')
      const result = await runScenarioPath(file)
      console.log(JSON.stringify(result, null, 2))
      return
    }
    if (sub === 'list') {
      const scenariosDir = join(__dirname, '../../../scenarios')
      const files = await readdir(scenariosDir)
      for (const f of files.filter((x) => x.endsWith('.json'))) {
        console.log(join(scenariosDir, f))
      }
      return
    }
  }

  if (cmd === 'lab' && rest[0] === 'run') {
    const { values, positionals } = parseArgs({
      args: rest.slice(1),
      options: { spec: { type: 'string' } },
      allowPositionals: true,
    })
    const spec = values.spec ?? positionals[0]
    if (!spec) throw new Error('lab run requires --spec')
    const result = await runScenarioPath(spec as string)
    console.log(JSON.stringify(result, null, 2))
    return
  }

  if (cmd === 'enr' && rest[0] === 'decode') {
    const input = rest[1]
    if (!input) throw new Error('enr decode requires ENR text')
    const peer = ENR.parseAndVerifyRecord(input.startsWith('enr:') ? input : `enr:${input}`)
    console.log(JSON.stringify(peer, null, 2))
    return
  }

  if (cmd === 'discovery-v4' && rest[0] === 'ping') {
    const host = rest[1]
    const port = Number(rest[2])
    if (!host || !port) throw new Error('discovery-v4 ping <host> <udpPort>')
    const { DPT } = await import('../index.ts')
    const dpt = new DPT(genPrivateKey(), {
      endpoint: { address: '0.0.0.0', udpPort: null, tcpPort: null },
      timeout: 3000,
      shouldFindNeighbours: false,
    })
    try {
      await dpt.addPeer({ address: host, udpPort: port })
      console.log(JSON.stringify({ ok: true, peer: `${host}:${port}` }))
    } catch (e: unknown) {
      console.log(JSON.stringify({ ok: false, error: (e as Error).message }))
      process.exitCode = 1
    } finally {
      dpt.destroy()
    }
    return
  }

  throw new Error(`Unknown command: ${cmd}. Use devp2p --help`)
}

main(process.argv.slice(2)).catch((err) => {
  console.error(err.message ?? err)
  process.exit(1)
})
