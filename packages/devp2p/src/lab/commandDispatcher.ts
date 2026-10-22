import { WaitRegistry, matchWaitEvent } from './waitRegistry.ts'

import type { LabEventRecord } from './eventBus.ts'
import type { EthStatusFields } from './messages/eth.ts'
import type { NodeSession } from './nodeSession.ts'

export type CommandRequest = {
  cmd: string
  [key: string]: unknown
}

export type CommandResponse = {
  ok: boolean
  error?: string
  data?: unknown
}

export class CommandDispatcher {
  private waitRegistry = new WaitRegistry()
  private session: NodeSession
  trace = false

  constructor(session: NodeSession) {
    this.session = session
    this.waitRegistry.attach(this.session.eventBus)
  }

  async dispatch(req: CommandRequest): Promise<CommandResponse> {
    try {
      const data = await this.run(req)
      return { ok: true, data }
    } catch (e: unknown) {
      const err = e as Error
      return { ok: false, error: err.message }
    }
  }

  private async run(req: CommandRequest): Promise<unknown> {
    switch (req.cmd) {
      case 'peer.add': {
        const host = String(req.host ?? req.address ?? '127.0.0.1')
        const udp = Number(req.udpPort ?? req.port)
        const tcp = req.tcpPort !== undefined ? Number(req.tcpPort) : udp
        const waitEvent = req.waitEvent !== undefined ? String(req.waitEvent) : undefined
        const waitTimeoutMs = Number(req.waitTimeoutMs ?? 30000)
        const waitPromise = waitEvent
          ? this.waitRegistry.wait(
              (record) => matchWaitEvent(waitEvent, record, this.session.name),
              waitTimeoutMs,
            )
          : undefined
        await this.session.addPeer(host, udp, tcp)
        const rlpxPeers = this.session.listPeers()
        if (waitPromise) {
          const ev = await waitPromise
          const afterWait = this.session.listPeers()
          if (afterWait.length === 0) {
            throw new Error(
              `RLPx handshake event received but no peer is connected — check both daemons and ports (udp/tcp ${udp}/${tcp})`,
            )
          }
          return { added: `${host}:${udp}`, connected: eventSummary(ev), rlpxPeers: afterWait }
        }
        return { added: `${host}:${udp}`, rlpxPeers }
      }
      case 'peer.list':
        return this.session.listPeers()
      case 'peer.disconnect': {
        const index = Number(req.index ?? req.peerIndex ?? 0)
        const peer = this.session.getPeer(index)
        this.session.rlpx.disconnect(peer.id!)
        return { disconnected: index }
      }
      case 'dpt.ping': {
        const host = String(req.host ?? req.address ?? '127.0.0.1')
        const udp = Number(req.udpPort ?? req.port)
        await this.session.dptPing(host, udp)
        return { ping: `${host}:${udp}` }
      }
      case 'rlpx.ping': {
        const index = Number(req.peerIndex ?? req.peer ?? 0)
        this.session.sendRlpxPing(index)
        return { sent: 'PING', peerIndex: index }
      }
      case 'eth.sendStatus': {
        const index = Number(req.peerIndex ?? 0)
        this.session.sendEthStatus(index, req.status as EthStatusFields)
        return { sent: 'STATUS' }
      }
      case 'eth.send': {
        const index = Number(req.peerIndex ?? 0)
        const name = String(req.name ?? req.message)
        if (name === 'STATUS') {
          this.session.sendEthStatus(index, req.status as EthStatusFields)
        } else {
          this.session.sendEthMessage(index, name, req.json as Record<string, unknown>, req.rlp)
        }
        return { sent: name }
      }
      case 'eth.wait':
      case 'snap.wait':
      case 'wait': {
        const timeoutMs = Number(req.timeoutMs ?? 30000)
        const event = String(req.event)
        const ev = await this.waitRegistry.wait(
          (record) => matchWaitEvent(event, record, this.session.name),
          timeoutMs,
        )
        return eventSummary(ev)
      }
      case 'snap.send': {
        const index = Number(req.peerIndex ?? 0)
        const name = String(req.name)
        this.session.sendSnapMessage(
          index,
          name,
          req.json as Record<string, unknown> | undefined,
          req.rlp,
        )
        return { sent: name }
      }
      case 'trace.on':
        this.trace = true
        return { trace: true }
      case 'trace.off':
        this.trace = false
        return { trace: false }
      default:
        throw new Error(`Unknown command: ${req.cmd}`)
    }
  }
}

function eventSummary(ev: LabEventRecord) {
  return {
    event: ev.name,
    layer: ev.layer,
    peer: ev.peer,
    dir: ev.dir,
    payload: ev.payload,
    message: ev.message,
  }
}
