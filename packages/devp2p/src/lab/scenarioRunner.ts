import { readFile } from 'node:fs/promises'

import { Common, Hardfork, Mainnet, Sepolia } from '@ethereumjs/common'
import { hexToBytes, intToBytes } from '@ethereumjs/util'

import { EthMessageCodes } from '../protocol/eth.ts'
import { SnapMessageCodes } from '../protocol/snap.ts'
import { DISCONNECT_REASON } from '../types.ts'

import { resolveCapabilities } from './capabilities.ts'
import { InProcessMesh, MAINNET_STATUS_JSON, buildRlpxPair } from './inProcessMesh.ts'
import { type EthStatusFields, ethMessageNameToCode, ethStatusFromFields } from './messages/eth.ts'
import { LOCALHOST, delay, getTestDPTs, getTestRLPXs, initTwoPeerRLPXSetup } from './nodeFactory.ts'
import { jsonToRlpInput } from './payloadCodec.ts'
import { rlpxDpt, rlpxPeersQueue } from './rlpxAccess.ts'

import type { ETH, Peer } from '../index.ts'
import type { ScenarioFile, ScenarioStep } from './scenarioTypes.ts'

export class ScenarioRunError extends Error {
  stepIndex: number
  transcript: string[]

  constructor(message: string, stepIndex: number, transcript: string[]) {
    super(message)
    this.stepIndex = stepIndex
    this.transcript = transcript
  }
}

export type ScenarioRunResult = {
  name: string
  ok: boolean
  transcript: string[]
}

function parseScenario(data: unknown): ScenarioFile {
  const file = data as ScenarioFile
  if (file.schema !== 1) {
    throw new Error(`Unsupported scenario schema: ${(file as ScenarioFile).schema}`)
  }
  if (!file.name || !Array.isArray(file.nodes) || !Array.isArray(file.steps)) {
    throw new Error('Invalid scenario file')
  }
  return file
}

export async function loadScenario(path: string): Promise<ScenarioFile> {
  const raw = await readFile(path, 'utf8')
  return parseScenario(JSON.parse(raw))
}

function waitFor(
  mesh: InProcessMesh,
  nodeId: string,
  event: string,
  timeoutMs: number,
  ethName?: string,
): Promise<void> {
  const node = mesh.get(nodeId)
  const rlpx = node.rlpx
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Timeout waiting ${event} on ${nodeId}`)),
      timeoutMs,
    )
    const cleanup = () => clearTimeout(timer)

    if (event === 'peer.added') {
      if (!rlpx) {
        reject(new Error(`Node ${nodeId} has no RLPx`))
        return
      }
      rlpx.events.once('peer:added', () => {
        cleanup()
        resolve()
      })
      return
    }
    if (event === 'peer.removed') {
      if (!rlpx) {
        reject(new Error(`Node ${nodeId} has no RLPx`))
        return
      }
      rlpx.events.once('peer:removed', () => {
        cleanup()
        resolve()
      })
      return
    }
    if (event === 'peer.new') {
      node.dpt.events.once('peer:new', () => {
        cleanup()
        resolve()
      })
      return
    }
    if (event === 'peer.added.dpt') {
      node.dpt.events.once('peer:added', () => {
        cleanup()
        resolve()
      })
      return
    }
    if (event === 'peer.removed.dpt') {
      node.dpt.events.once('peer:removed', () => {
        cleanup()
        resolve()
      })
      return
    }
    if (event.startsWith('eth.') && ethName) {
      if (!rlpx) {
        reject(new Error(`Node ${nodeId} has no RLPx`))
        return
      }
      const code = ethMessageNameToCode(ethName)
      const handler = (peer: Peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        protocol.events.once('message', (msgCode) => {
          if (msgCode === code) {
            cleanup()
            resolve()
          }
        })
      }
      rlpx.events.once('peer:added', handler)
      return
    }
    if (event === 'peer.error') {
      if (!rlpx) {
        reject(new Error(`Node ${nodeId} has no RLPx`))
        return
      }
      rlpx.events.once('peer:added', (peer) => {
        peer.events.once('error', () => {
          cleanup()
          resolve()
        })
      })
      return
    }
    reject(new Error(`Unsupported wait event: ${event}`))
  })
}

async function runStep(
  mesh: InProcessMesh,
  step: ScenarioStep,
  index: number,
  transcript: string[],
) {
  if ('connect' in step) {
    await mesh.connect(step.connect.from, step.connect.to)
    await delay(200)
    transcript.push(`step ${index}: connect ${step.connect.from} -> ${step.connect.to}`)
    return
  }
  if ('delay' in step) {
    await delay(step.delay.ms)
    transcript.push(`step ${index}: delay ${step.delay.ms}`)
    return
  }
  if ('wait' in step) {
    const timeout = step.wait.timeoutMs ?? 10000
    await waitFor(mesh, step.wait.node, step.wait.event, timeout, step.wait.eth)
    transcript.push(`step ${index}: wait ${step.wait.event} on ${step.wait.node}`)
    return
  }
  if ('eth' in step) {
    const rlpx = mesh.getRlpx(step.eth.node)
    const peerIndex = step.eth.peerIndex ?? 0
    await new Promise<void>((resolve) => {
      const send = (peer: Peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        if (step.eth.send === 'STATUS' && step.eth.status) {
          protocol.sendStatus(ethStatusFromFields(step.eth.status, protocol.getVersion()))
        } else if (step.eth.rlp !== undefined) {
          const code = ethMessageNameToCode(step.eth.send)
          protocol.sendMessage(code, jsonToRlpInput(step.eth.rlp))
        } else {
          throw new Error('eth step requires status or rlp')
        }
        resolve()
      }
      const peers = rlpx.getPeers()
      if (peers.length > peerIndex) {
        send(peers[peerIndex])
      } else {
        rlpx.events.once('peer:added', send)
      }
    })
    transcript.push(`step ${index}: eth send ${step.eth.send} on ${step.eth.node}`)
    return
  }
  if ('snap' in step) {
    const rlpx = mesh.getRlpx(step.snap.node)
    await new Promise<void>((resolve) => {
      const send = (peer: Peer) => {
        const snap = peer.getProtocols()[0] as ETH
        const code = (SnapMessageCodes as Record<string, number>)[step.snap.send]
        ;(snap as unknown as { sendMessage: (c: number, p: unknown) => void }).sendMessage(
          code,
          jsonToRlpInput(step.snap.rlp),
        )
        resolve()
      }
      rlpx.events.once('peer:added', send)
    })
    transcript.push(`step ${index}: snap send ${step.snap.send}`)
    return
  }
  if ('action' in step) {
    await runAction(mesh, step.action, transcript, index)
    return
  }
  if ('expect' in step) {
    await runExpect(mesh, step.expect, transcript, index)
    return
  }
}

async function runAction(
  mesh: InProcessMesh,
  action: Record<string, unknown>,
  transcript: string[],
  index: number,
) {
  const type = action.type as string
  if (type === 'legacyEthPair') {
    const basePort = action.basePort as number
    const caps = resolveCapabilities((action.capabilities as string[]) ?? ['eth68'])
    const maxPeers = (action.maxPeers as number) ?? 2
    const commons = action.commons as
      | { chain: 'mainnet' | 'sepolia'; hardfork?: string }[]
      | undefined
    let common: Common | Common[] | undefined
    if (commons) {
      common = commons.map(
        (c) =>
          new Common({
            chain: c.chain === 'sepolia' ? Sepolia : Mainnet,
            hardfork: (c.hardfork ?? 'london') as Hardfork,
          }),
      )
    } else if (action.common) {
      const c = action.common as { chain: 'mainnet' | 'sepolia'; hardfork?: string }
      common = new Common({
        chain: c.chain === 'sepolia' ? Sepolia : Mainnet,
        hardfork: (c.hardfork ?? 'london') as Hardfork,
      })
    }
    const rlpxs = getTestRLPXs(2, maxPeers, basePort, caps, common)
    mesh.rlpxs = rlpxs
    mesh.nodes.set('a', { id: 'a', dpt: rlpxDpt(rlpxs[0]), rlpx: rlpxs[0], basePort })
    mesh.nodes.set('b', { id: 'b', dpt: rlpxDpt(rlpxs[1]), rlpx: rlpxs[1], basePort: basePort + 1 })
    const dialFrom = (action.dialFrom as string) ?? 'b'
    const dialer = dialFrom === 'a' ? rlpxs[0] : rlpxs[1]
    const targetPort = dialFrom === 'a' ? basePort + 1 : basePort
    await rlpxDpt(dialer).addPeer({ address: LOCALHOST, udpPort: targetPort, tcpPort: targetPort })
    transcript.push(`step ${index}: legacyEthPair ${basePort}`)
    return
  }
  if (type === 'dptSingleNode') {
    const basePort = action.basePort as number
    const dpts = getTestDPTs(1, basePort)
    mesh.nodes.set('a', { id: 'a', dpt: dpts[0], basePort })
    transcript.push(`step ${index}: dptSingleNode ${basePort}`)
    return
  }
  if (type === 'legacyTwoPeerRlpx') {
    const basePort = action.basePort as number
    const capabilities = action.capabilities
      ? resolveCapabilities(action.capabilities as string[])
      : undefined
    const { rlpxs, peer } = initTwoPeerRLPXSetup(
      action.maxPeers as number | undefined,
      capabilities,
      undefined,
      basePort,
    )
    mesh.rlpxs = rlpxs
    mesh.nodes.set('a', { id: 'a', dpt: rlpxDpt(rlpxs[0]), rlpx: rlpxs[0], basePort })
    mesh.nodes.set('b', { id: 'b', dpt: rlpxDpt(rlpxs[1]), rlpx: rlpxs[1], basePort: basePort + 1 })
    await rlpxDpt(rlpxs[0]).addPeer(peer)
    transcript.push(`step ${index}: legacyTwoPeerRlpx ${basePort}`)
    return
  }
  if (type === 'legacyMultiPeerRlpx') {
    const basePort = action.basePort as number
    const count = (action.count as number) ?? 3
    const maxPeers = (action.maxPeers as number) ?? 10
    const capabilities = action.capabilities
      ? resolveCapabilities(action.capabilities as string[])
      : undefined
    const nodeIds = (action.nodeIds as string[]) ?? ['a', 'b', 'c'].slice(0, count)
    const rlpxs = getTestRLPXs(count, maxPeers, basePort, capabilities)
    mesh.rlpxs = rlpxs
    for (let i = 0; i < count; i++) {
      mesh.nodes.set(nodeIds[i] ?? String(i), {
        id: nodeIds[i] ?? String(i),
        dpt: rlpxDpt(rlpxs[i]),
        rlpx: rlpxs[i],
        basePort: basePort + i,
      })
    }
    transcript.push(`step ${index}: legacyMultiPeerRlpx ${basePort} x${count}`)
    return
  }
  if (type === 'rlpxDisconnectPeer') {
    const rlpx = mesh.getRlpx(action.node as string)
    const peers = rlpx.getPeers()
    if (peers.length === 0) {
      throw new Error(`Node ${action.node} has no connected peer to disconnect`)
    }
    rlpx.disconnect(peers[0].id!)
    transcript.push(`step ${index}: rlpxDisconnectPeer ${action.node}`)
    return
  }
  if (type === 'dptInitTwoPeer') {
    const basePort = action.basePort as number
    const dpts = getTestDPTs(2, basePort)
    mesh.nodes.set('a', { id: 'a', dpt: dpts[0], basePort })
    mesh.nodes.set('b', { id: 'b', dpt: dpts[1], basePort: basePort + 1 })
    mesh.rlpxs = []
    dpts[0].addPeer({ address: LOCALHOST, udpPort: basePort + 1 }).catch(() => {
      /* match initTwoPeerDPTSetup: non-fatal ping rejections */
    })
    transcript.push(`step ${index}: dptInitTwoPeer ${basePort}`)
    return
  }
  if (type === 'legacyDptPeerNew') {
    const basePort = action.basePort as number
    const dpts = getTestDPTs(2, basePort)
    mesh.nodes.set('a', { id: 'a', dpt: dpts[0], basePort })
    mesh.nodes.set('b', { id: 'b', dpt: dpts[1], basePort: basePort + 1 })
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('legacyDptPeerNew timeout')), 15000)
      dpts[0].events.once('peer:new', (peer) => {
        if (peer.address !== LOCALHOST) {
          reject(new Error(`Expected address ${LOCALHOST}, got ${peer.address}`))
          return
        }
        clearTimeout(timer)
        resolve()
      })
      dpts[0].addPeer({ address: LOCALHOST, udpPort: basePort + 1 }).catch(() => {})
    })
    transcript.push(`step ${index}: legacyDptPeerNew ${basePort}`)
    return
  }
  if (type === 'legacyDptPeerAdded') {
    const basePort = action.basePort as number
    const dpts = getTestDPTs(2, basePort)
    mesh.nodes.set('a', { id: 'a', dpt: dpts[0], basePort })
    mesh.nodes.set('b', { id: 'b', dpt: dpts[1], basePort: basePort + 1 })
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('legacyDptPeerAdded timeout')), 15000)
      dpts[0].events.once('peer:added', () => {
        if (dpts[0].getPeers().length !== 1) {
          reject(new Error('Expected 1 peer in k-bucket'))
          return
        }
        clearTimeout(timer)
        resolve()
      })
      dpts[0].addPeer({ address: LOCALHOST, udpPort: basePort + 1 }).catch(() => {})
    })
    transcript.push(`step ${index}: legacyDptPeerAdded ${basePort}`)
    return
  }
  if (type === 'legacyDptRemovePeer') {
    const basePort = action.basePort as number
    const dpts = getTestDPTs(2, basePort)
    mesh.nodes.set('a', { id: 'a', dpt: dpts[0], basePort })
    mesh.nodes.set('b', { id: 'b', dpt: dpts[1], basePort: basePort + 1 })
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('legacyDptRemovePeer timeout')), 15000)
      dpts[0].events.once('peer:added', async (peer) => {
        await delay(400)
        dpts[0].removePeer(peer)
      })
      dpts[0].events.once('peer:removed', () => {
        if (dpts[0].getPeers().length !== 0) {
          reject(new Error('Expected 0 peers after remove'))
          return
        }
        clearTimeout(timer)
        resolve()
      })
      dpts[0].addPeer({ address: LOCALHOST, udpPort: basePort + 1 }).catch(() => {})
    })
    transcript.push(`step ${index}: legacyDptRemovePeer ${basePort}`)
    return
  }
  if (type === 'legacyDptBanPeer') {
    const basePort = action.basePort as number
    const dpts = getTestDPTs(2, basePort)
    mesh.nodes.set('a', { id: 'a', dpt: dpts[0], basePort })
    mesh.nodes.set('b', { id: 'b', dpt: dpts[1], basePort: basePort + 1 })
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('legacyDptBanPeer timeout')), 15000)
      dpts[0].events.once('peer:added', async (peer) => {
        await delay(400)
        dpts[0].banPeer(peer)
      })
      dpts[0].events.once('peer:removed', (peer) => {
        if (!dpts[0]['_banlist'].has(peer)) {
          reject(new Error('ban-list should contain peer'))
          return
        }
        if (dpts[0].getPeers().length !== 0) {
          reject(new Error('Expected 0 peers after ban'))
          return
        }
        clearTimeout(timer)
        resolve()
      })
      dpts[0].addPeer({ address: LOCALHOST, udpPort: basePort + 1 }).catch(() => {})
    })
    transcript.push(`step ${index}: legacyDptBanPeer ${basePort}`)
    return
  }
  if (type === 'dptRemovePeer') {
    const node = mesh.get(action.node as string)
    node.dpt.events.once('peer:added', async (peer) => {
      await delay(400)
      node.dpt.removePeer(peer)
    })
    transcript.push(`step ${index}: dptRemovePeer`)
    return
  }
  if (type === 'dptBanPeer') {
    const node = mesh.get(action.node as string)
    node.dpt.events.once('peer:added', async (peer) => {
      await delay(400)
      node.dpt.banPeer(peer)
    })
    transcript.push(`step ${index}: dptBanPeer`)
    return
  }
  if (type === 'legacyDptKBucketPing') {
    const basePort = action.basePort as number
    const dpts = getTestDPTs(2, basePort)
    mesh.nodes.set('a', { id: 'a', dpt: dpts[0], basePort })
    mesh.nodes.set('b', { id: 'b', dpt: dpts[1], basePort: basePort + 1 })
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('legacyDptKBucketPing timeout')), 15000)
      dpts[0].events.once('peer:added', async (peer) => {
        dpts[0]._onKBucketPing([peer], peer)
        await delay(400)
        if (dpts[0].getPeers().length !== 1) {
          reject(new Error('should still have one peer in k-bucket'))
          return
        }
        clearTimeout(timer)
        resolve()
      })
      dpts[0].addPeer({ address: LOCALHOST, udpPort: basePort + 1 }).catch(() => {})
    })
    transcript.push(`step ${index}: legacyDptKBucketPing ${basePort}`)
    return
  }
  if (type === 'dptKBucketPing') {
    const node = mesh.get(action.node as string)
    node.dpt.events.once('peer:added', (peer) => {
      node.dpt._onKBucketPing([peer], peer)
    })
    transcript.push(`step ${index}: dptKBucketPing`)
    return
  }
  if (type === 'dptAddPeerExpectTimeout') {
    const node = mesh.get(action.node as string)
    const udpPort = action.udpPort as number
    try {
      await node.dpt.addPeer({ address: LOCALHOST, udpPort })
      throw new Error('Expected timeout error')
    } catch (e: unknown) {
      const err = e as Error
      if (err.message !== action.errorMessage) {
        throw new Error(`Expected "${action.errorMessage}", got "${err.message}"`)
      }
    }
    transcript.push(`step ${index}: dptAddPeerExpectTimeout`)
    return
  }
  if (type === 'rlpxInjectPeerNew') {
    const rlpx = mesh.getRlpx(action.node as string)
    const runInject = () => {
      const peer = {
        id: hexToBytes(action.id as `0x${string}`),
        address: action.address as string,
        udpPort: action.udpPort as number,
        tcpPort: action.tcpPort as null,
      }
      const dpt = rlpxDpt(rlpx)
      if (action.assertBanBefore === false) {
        if (dpt['_banlist'].has(peer)) {
          throw new Error('should not be in ban list before bad peer discovered')
        }
      }
      dpt.events.emit('peer:new', peer)
      if (action.assertBanAfter === true) {
        if (!dpt['_banlist'].has(peer)) {
          throw new Error('should be in ban list after bad peer discovered')
        }
      }
    }
    if (rlpx.getPeers().length > 0) {
      runInject()
    } else {
      await new Promise<void>((resolve) => {
        rlpx.events.once('peer:added', () => {
          runInject()
          resolve()
        })
      })
    }
    transcript.push(`step ${index}: rlpxInjectPeerNew`)
    return
  }
  if (type === 'legacyRlpxRemoveNode') {
    const basePort = action.basePort as number
    const { rlpxs, peer } = initTwoPeerRLPXSetup(undefined, undefined, undefined, basePort)
    mesh.rlpxs = rlpxs
    mesh.nodes.set('a', { id: 'a', dpt: rlpxDpt(rlpxs[0]), rlpx: rlpxs[0], basePort })
    mesh.nodes.set('b', { id: 'b', dpt: rlpxDpt(rlpxs[1]), rlpx: rlpxs[1], basePort: basePort + 1 })
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('legacyRlpxRemoveNode timeout')), 15000)
      rlpxs[0].events.once('peer:removed', async (_, reason) => {
        clearTimeout(timer)
        if (reason !== DISCONNECT_REASON.CLIENT_QUITTING) {
          reject(
            new Error(`Expected disconnect ${DISCONNECT_REASON.CLIENT_QUITTING}, got ${reason}`),
          )
          return
        }
        if (rlpxs[0]._getOpenSlots() !== 10) {
          reject(new Error(`Expected open slots 10, got ${rlpxs[0]._getOpenSlots()}`))
          return
        }
        await delay(100)
        resolve()
      })
      rlpxDpt(rlpxs[0])
        .addPeer(peer)
        .then(async (peer1) => {
          await delay(300)
          rlpxs[0].disconnect(peer1.id!)
        })
        .catch((e) => {
          clearTimeout(timer)
          reject(new Error(`Peering failed: ${e}`))
        })
    })
    transcript.push(`step ${index}: legacyRlpxRemoveNode ${basePort}`)
    return
  }
  if (type === 'legacyRlpxPeerQueue') {
    const basePort = action.basePort as number
    const rlpxs = getTestRLPXs(3, 1, basePort)
    mesh.rlpxs = rlpxs
    mesh.nodes.set('a', { id: 'a', dpt: rlpxDpt(rlpxs[0]), rlpx: rlpxs[0], basePort })
    mesh.nodes.set('b', { id: 'b', dpt: rlpxDpt(rlpxs[1]), rlpx: rlpxs[1], basePort: basePort + 1 })
    mesh.nodes.set('c', { id: 'c', dpt: rlpxDpt(rlpxs[2]), rlpx: rlpxs[2], basePort: basePort + 2 })
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('legacyRlpxPeerQueue timeout')), 30000)
      const peer = { address: LOCALHOST, udpPort: basePort + 1, tcpPort: basePort + 1 }
      void rlpxDpt(rlpxs[0]).addPeer(peer)
      rlpxs[0].events.on('peer:added', async (peerConn) => {
        const port = (peerConn['_socket'] as unknown as { _peername: { port: number } })._peername
          .port
        if (port === basePort + 1) {
          if (rlpxPeersQueue(rlpxs[0]).length !== 0) {
            reject(new Error('peers queue should contain no peers'))
            return
          }
          void rlpxDpt(rlpxs[0]).addPeer({
            address: LOCALHOST,
            udpPort: basePort + 2,
            tcpPort: basePort + 2,
          })
          await delay(500)
          if (rlpxPeersQueue(rlpxs[0]).length !== 1) {
            reject(new Error('peers queue should contain one peer'))
            return
          }
        }
        if (port === basePort + 2) {
          if (rlpxPeersQueue(rlpxs[0]).length !== 0) {
            reject(new Error('peers queue should contain no peers after second connect'))
            return
          }
          clearTimeout(timer)
          resolve()
        }
      })
    })
    transcript.push(`step ${index}: legacyRlpxPeerQueue ${basePort}`)
    return
  }
  if (type === 'rlpxDisconnect') {
    const rlpx = mesh.getRlpx(action.node as string)
    const toPort =
      action.to !== undefined ? mesh.get(action.to as string).basePort : (action.toPort as number)
    await rlpxDpt(rlpx)
      .addPeer({ address: LOCALHOST, udpPort: toPort, tcpPort: toPort })
      .then((peer) => {
        rlpx.disconnect(peer.id!)
      })
    transcript.push(`step ${index}: rlpxDisconnect`)
    return
  }
  if (type === 'ethSendStatusOnPeerAdded') {
    const rlpx = mesh.getRlpx(action.node as string)
    const status = (action.status as EthStatusFields | undefined) ?? MAINNET_STATUS_JSON
    rlpx.events.once('peer:added', (peer) => {
      const eth = peer.getProtocols()[0] as ETH
      eth.sendStatus(ethStatusFromFields(status, eth.getVersion()))
    })
    transcript.push(`step ${index}: ethSendStatusOnPeerAdded`)
    return
  }
  if (type === 'ethOnStatusReceive') {
    const rlpx = mesh.getRlpx(action.node as string)
    const status = action.status as EthStatusFields | undefined
    rlpx.events.once('peer:added', (peer) => {
      const protocol = peer.getProtocols()[0] as ETH
      protocol.events.on('message', (code) => {
        if (code === EthMessageCodes.STATUS) {
          if (action.op === 'sendStatus') {
            protocol.sendStatus(
              ethStatusFromFields(status ?? MAINNET_STATUS_JSON, protocol.getVersion()),
            )
          }
          if (action.op === 'sendStatusAndAssertThrowsGetNodeData') {
            protocol.sendStatus(
              ethStatusFromFields(status ?? MAINNET_STATUS_JSON, protocol.getVersion()),
            )
            assertThrows(
              () => protocol.sendMessage(EthMessageCodes.GET_NODE_DATA, []),
              '/Code 13 not allowed with version 68/',
            )
            assertThrows(
              () => protocol.sendMessage(EthMessageCodes.NODE_DATA, []),
              '/Code 14 not allowed with version 68/',
            )
          }
          if (action.op === 'sendStatusThrow') {
            try {
              protocol.sendStatus(
                ethStatusFromFields(status ?? MAINNET_STATUS_JSON, protocol.getVersion()),
              )
              throw new Error('should have thrown')
            } catch (e: unknown) {
              const err = e as Error
              if (err.message !== action.errorMessage) {
                throw new Error(`Expected "${action.errorMessage}", got "${err.message}"`)
              }
            }
          }
          if (action.op === 'sendStatusAndAssertThrowsUnknownCode') {
            protocol.sendStatus(
              ethStatusFromFields(status ?? MAINNET_STATUS_JSON, protocol.getVersion()),
            )
            assertThrows(
              () => (protocol as ETH).sendMessage(0x55 as never, []),
              String(action.messagePattern),
            )
          }
          if (action.op === 'assertThrowsUnknownCode') {
            const fn = () => (protocol as ETH).sendMessage(0x55 as never, [])
            assertThrows(fn, String(action.messagePattern))
          }
          if (action.op === 'assertThrowsSendStatusViaSendMessage') {
            const fn = () => protocol.sendMessage(EthMessageCodes.STATUS, [])
            assertThrows(fn, String(action.messagePattern))
          }
          if (action.op === 'assertThrowsGetNodeData') {
            assertThrows(
              () => protocol.sendMessage(EthMessageCodes.GET_NODE_DATA, []),
              String(action.messagePattern),
            )
            assertThrows(
              () => protocol.sendMessage(EthMessageCodes.NODE_DATA, []),
              String(action.messagePattern),
            )
          }
        }
      })
    })
    transcript.push(`step ${index}: ethOnStatusReceive ${action.op}`)
    return
  }
  if (type === 'ethSendStatusOnPeerAddedThen') {
    const rlpx = mesh.getRlpx(action.node as string)
    const status = (action.status as EthStatusFields | undefined) ?? MAINNET_STATUS_JSON
    rlpx.events.once('peer:added', (peer) => {
      const protocol = peer.getProtocols()[0] as ETH
      protocol.sendStatus(ethStatusFromFields(status, protocol.getVersion()))
      if (action.then === 'assertVersion') {
        protocol.events.once('message', (code) => {
          if (code === EthMessageCodes.STATUS) {
            const v = protocol.getVersion()
            if (v !== action.version) {
              throw new Error(`Expected eth version ${action.version}, got ${v}`)
            }
          }
        })
      }
    })
    transcript.push(`step ${index}: ethSendStatusOnPeerAddedThen`)
    return
  }
  if (type === 'ethPeerErrorExpected') {
    const rlpx = mesh.getRlpx(action.node as string)
    const status = action.status as EthStatusFields
    rlpx.events.once('peer:added', (peer) => {
      peer.events.once('error', (err) => {
        if (err.message !== action.errorMessage) {
          throw new Error(`Expected "${action.errorMessage}", got "${err.message}"`)
        }
      })
      const protocol = peer.getProtocols()[0] as ETH
      protocol.sendStatus(ethStatusFromFields(status, protocol.getVersion()))
    })
    transcript.push(`step ${index}: ethPeerErrorExpected`)
    return
  }
  if (type === 'ethInvalidStatusSendOnPeerAdded') {
    const rlpx = mesh.getRlpx(action.node as string)
    rlpx.events.once('peer:added', (peer) => {
      const protocol = peer.getProtocols()[0] as ETH
      assertThrows(
        () => protocol.sendMessage(EthMessageCodes.STATUS, []),
        String(action.messagePattern),
      )
    })
    transcript.push(`step ${index}: ethInvalidStatusSendOnPeerAdded`)
    return
  }
  if (type === 'ethAssertThrowOnSendStatus') {
    const rlpx = mesh.getRlpx(action.node as string)
    rlpx.events.once('peer:added', (peer) => {
      const protocol = peer.getProtocols()[0] as ETH
      const status = action.status as EthStatusFields
      assertThrows(
        () => protocol.sendStatus(ethStatusFromFields(status, protocol.getVersion())),
        String(action.messagePattern),
      )
    })
    transcript.push(`step ${index}: ethAssertThrowOnSendStatus`)
    return
  }
  if (type === 'ethAssertVersion') {
    const rlpx = mesh.getRlpx(action.node as string)
    rlpx.events.once('peer:added', (peer) => {
      const protocol = peer.getProtocols()[0] as ETH
      protocol.events.once('message', (code) => {
        if (code === EthMessageCodes.STATUS) {
          const v = protocol.getVersion()
          if (v !== action.version) {
            throw new Error(`Expected eth version ${action.version}, got ${v}`)
          }
        }
      })
    })
    transcript.push(`step ${index}: ethAssertVersion`)
    return
  }
  if (type === 'ethSnappyV4') {
    const rlpx0 = mesh.getRlpx('a')
    const rlpx1 = mesh.getRlpx('b')
    rlpx0.events.on('peer:added', (peer) => {
      const protocol = peer.getProtocols()[0] as ETH
      protocol['_peer']['_hello'] = {
        protocolVersion: 4,
        clientId: 'fakePeer',
        capabilities: [],
        port: action.basePort as number,
        id: new Uint8Array(12),
      }
      protocol.sendStatus(ethStatusFromFields(MAINNET_STATUS_JSON, protocol.getVersion()))
    })
    rlpx1.events.on('peer:added', (peer) => {
      peer.events.once('error', (err) => {
        if (err.message !== action.errorMessage) {
          throw new Error(`Expected "${action.errorMessage}", got "${err.message}"`)
        }
      })
    })
    transcript.push(`step ${index}: ethSnappyV4`)
    return
  }
  if (type === 'snapExchange') {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('snapExchange timeout')), 15000)
      const done = () => {
        clearTimeout(timer)
        resolve()
      }
      const sender = mesh.getRlpx(action.sender as string)
      sender.events.once('peer:added', (peer) => {
        const snap = peer.getProtocols()[0] as ETH
        if (action.throwUnknown) {
          try {
            ;(snap as unknown as { sendMessage: (c: number, p: unknown) => void }).sendMessage(
              0x55,
              [1, []],
            )
          } catch (e: unknown) {
            const err = e as Error
            if (String(err) !== action.errorString) {
              reject(new Error(`Expected ${action.errorString}, got ${String(err)}`))
              return
            }
            done()
          }
        } else {
          ;(snap as unknown as { sendMessage: (c: number, p: unknown) => void }).sendMessage(
            SnapMessageCodes.GET_ACCOUNT_RANGE,
            [1, [437000, 1, 0, 0]],
          )
        }
      })
      const receiver = mesh.getRlpx(action.receiver as string)
      receiver.events.once('peer:added', (peer) => {
        const snap = peer.getProtocols()[0] as ETH
        snap.events.once('message', (code) => {
          if (code === SnapMessageCodes.GET_ACCOUNT_RANGE) {
            done()
          }
        })
      })
    })
    transcript.push(`step ${index}: snapExchange`)
    return
  }
  throw new Error(`Unknown action type: ${type}`)
}

function assertThrows(fn: () => void, pattern: string) {
  try {
    fn()
    throw new Error('Expected throw')
  } catch (e: unknown) {
    const err = e as Error
    if (err.message === 'Expected throw') throw err
    if (pattern.startsWith('/') && pattern.endsWith('/')) {
      const re = new RegExp(pattern.slice(1, -1))
      if (!re.test(err.message)) {
        throw new Error(`Pattern ${pattern} did not match: ${err.message}`)
      }
      return
    }
    if (err.message !== pattern && !err.message.includes(pattern)) {
      throw new Error(`Expected "${pattern}", got "${err.message}"`)
    }
  }
}

async function runExpect(
  mesh: InProcessMesh,
  expect: Record<string, unknown>,
  transcript: string[],
  index: number,
) {
  if (expect.disconnectReason !== undefined) {
    const rlpx = mesh.getRlpx(expect.node as string)
    await new Promise<void>((resolve, reject) => {
      rlpx.events.once('peer:removed', (_, reason) => {
        if (reason !== expect.disconnectReason) {
          reject(new Error(`Expected disconnect ${expect.disconnectReason}, got ${reason}`))
          return
        }
        resolve()
      })
    })
  }
  if (expect.rlpxPeerPort !== undefined) {
    const rlpx = mesh.getRlpx(expect.node as string)
    const check = (peer: Peer) => {
      const port = (peer['_socket'] as unknown as { _peername: { port: number } })._peername.port
      if (port !== expect.rlpxPeerPort) {
        throw new Error(`Expected peer port ${expect.rlpxPeerPort}, got ${port}`)
      }
    }
    const peers = rlpx.getPeers()
    if (peers.length > 0) {
      check(peers[0])
    } else {
      await new Promise<void>((resolve) => {
        rlpx.events.once('peer:added', (peer) => {
          check(peer)
          resolve()
        })
      })
    }
  }
  if (expect.openSlots !== undefined) {
    const rlpx = mesh.getRlpx(expect.node as string)
    const slots = rlpx._getOpenSlots()
    if (slots !== expect.openSlots) {
      throw new Error(`Expected open slots ${expect.openSlots}, got ${slots}`)
    }
  }
  if (expect.peerCount !== undefined) {
    const rlpx = mesh.getRlpx(expect.node as string)
    const count = rlpx.getPeers().length
    if (count !== expect.peerCount) {
      throw new Error(`Expected peer count ${expect.peerCount}, got ${count}`)
    }
  }
  if (expect.dptPeerCount !== undefined) {
    const dpt = mesh.get(expect.node as string).dpt
    const count = dpt.getPeers().length
    if (count !== expect.dptPeerCount) {
      throw new Error(`Expected dpt peer count ${expect.dptPeerCount}, got ${count}`)
    }
  }
  if (expect.banlistHas !== undefined) {
    const rlpx = mesh.getRlpx(expect.node as string)
    const has = rlpxDpt(rlpx)['_banlist'].has(expect.banlistHas as never)
    if (has !== expect.banlistHasExpected) {
      throw new Error(`banlist has expected ${expect.banlistHasExpected}, got ${has}`)
    }
  }
  if (expect.peersQueueLength !== undefined) {
    const rlpx = mesh.getRlpx(expect.node as string)
    const len = rlpxPeersQueue(rlpx).length
    if (len !== expect.peersQueueLength) {
      throw new Error(`Expected queue length ${expect.peersQueueLength}, got ${len}`)
    }
  }
  if (expect.peerAddress !== undefined) {
    const dpt = mesh.get(expect.node as string).dpt
    await new Promise<void>((resolve) => {
      dpt.events.once('peer:new', (peer) => {
        if (peer.address !== expect.peerAddress) {
          throw new Error(`Expected address ${expect.peerAddress}, got ${peer.address}`)
        }
        resolve()
      })
    })
  }
  if (expect.dptBanlistOnRemoved !== undefined) {
    const dpt = mesh.get(expect.node as string).dpt
    await new Promise<void>((resolve) => {
      dpt.events.once('peer:removed', (peer) => {
        if (!dpt['_banlist'].has(peer)) {
          throw new Error('ban-list should contain peer')
        }
        resolve()
      })
    })
  }
  transcript.push(`step ${index}: expect ${JSON.stringify(expect)}`)
}

function withPortOffset(file: ScenarioFile): ScenarioFile {
  return file
}

export async function runScenario(file: ScenarioFile): Promise<ScenarioRunResult> {
  const transcript: string[] = []
  let mesh: InProcessMesh | undefined
  const spec = withPortOffset(file)
  try {
    if (spec.nodes.length > 0 && !spec.nodes[0].dptOnly) {
      mesh = InProcessMesh.fromSpecs(spec.nodes)
    } else if (spec.nodes.length > 0 && spec.nodes[0].dptOnly) {
      mesh = InProcessMesh.fromSpecs(spec.nodes)
    } else {
      mesh = new InProcessMesh()
    }
    for (let i = 0; i < spec.steps.length; i++) {
      await runStep(mesh, spec.steps[i], i, transcript)
    }
    return { name: spec.name, ok: true, transcript }
  } catch (e: unknown) {
    const err = e as Error
    throw new ScenarioRunError(err.message, transcript.length, transcript)
  } finally {
    mesh?.destroy()
  }
}

export async function runScenarioPath(path: string): Promise<ScenarioRunResult> {
  const file = await loadScenario(path)
  return runScenario(file)
}

/** Build mesh for legacy port-based scenarios. */
export function scenarioMeshFromPorts(
  basePort: number,
  capNames: string[],
  commons?: Common[],
): InProcessMesh {
  const caps = resolveCapabilities(capNames)
  const { mesh } = buildRlpxPair(basePort, caps, commons)
  return mesh
}

export { Common, Mainnet, Sepolia, Hardfork, intToBytes, DISCONNECT_REASON }
