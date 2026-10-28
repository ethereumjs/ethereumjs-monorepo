import { Common, Mainnet } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import {
  bootstrapBootnodesFromCommon,
  peerInfoFromBootstrapNode,
  resolveWorkerBootnodes,
} from '../../src/worker/bootNodes.ts'

describe('[Devp2p/Worker]: bootNodes', () => {
  it('peerInfoFromBootstrapNode() maps ip, ports, and node id', () => {
    const common = new Common({ chain: Mainnet })
    const node = common.bootstrapNodes()[0]
    assert.ok(node !== undefined)
    const peer = peerInfoFromBootstrapNode(node)
    assert.equal(peer.address, node.ip)
    assert.equal(peer.udpPort, Number(node.port))
    assert.equal(peer.tcpPort, Number(node.port))
    assert.ok(peer.id !== undefined)
    assert.equal(peer.id!.length, 64)
  })

  it('resolveWorkerBootnodes() uses explicit bootnodes including empty array', () => {
    const common = new Common({ chain: Mainnet })
    const explicit: never[] = []
    const resolved = resolveWorkerBootnodes(
      {
        privateKey: new Uint8Array(32),
        chain: 'mainnet',
        bootnodes: explicit,
        shouldFindNeighbours: true,
      },
      common,
    )
    assert.strictEqual(resolved, explicit)
  })

  it('resolveWorkerBootnodes() returns chain bootnodes when discovery on and bootnodes omitted', () => {
    const common = new Common({ chain: Mainnet })
    const resolved = resolveWorkerBootnodes(
      {
        privateKey: new Uint8Array(32),
        chain: 'mainnet',
        shouldFindNeighbours: true,
      },
      common,
    )
    assert.equal(resolved.length, bootstrapBootnodesFromCommon(common).length)
    assert.ok(resolved.length > 0)
  })

  it('resolveWorkerBootnodes() returns no bootnodes when discovery off and bootnodes omitted', () => {
    const common = new Common({ chain: Mainnet })
    const resolved = resolveWorkerBootnodes(
      {
        privateKey: new Uint8Array(32),
        chain: 'mainnet',
        shouldFindNeighbours: false,
      },
      common,
    )
    assert.equal(resolved.length, 0)
  })
})
