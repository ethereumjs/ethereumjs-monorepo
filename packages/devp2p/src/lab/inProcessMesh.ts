import { hexToBytes } from '@ethereumjs/util'

import { EthMessageCodes } from '../protocol/eth.ts'
import { SnapMessageCodes } from '../protocol/snap.ts'
import { DISCONNECT_REASON } from '../types.ts'

import { resolveCapabilities } from './capabilities.ts'
import { LOCALHOST } from './constants.ts'
import type { EthStatusFields } from './messages/eth.ts'
import {
  type ChainSpec,
  type LabMeshNode,
  type MeshNodeSpec,
  commonFromSpec,
  createDptNode,
  createRlpxNode,
  destroyDPTs,
  destroyRLPXs,
  getTestRLPXs,
  peerEndpoint,
} from './nodeFactory.ts'
import { rlpxDpt } from './rlpxAccess.ts'

import type { Common } from '@ethereumjs/common'
import type { ETH, Peer, RLPx } from '../index.ts'
import type { Capabilities } from '../types.ts'

export class InProcessMesh {
  nodes = new Map<string, LabMeshNode>()
  rlpxs: RLPx[] = []

  static fromSpecs(specs: MeshNodeSpec[]): InProcessMesh {
    const mesh = new InProcessMesh()
    const dptOnly = specs.filter((s) => s.dptOnly)
    const rlpxSpecs = specs.filter((s) => !s.dptOnly)

    for (const spec of dptOnly) {
      mesh.nodes.set(spec.id, createDptNode(spec.id, spec.basePort))
    }

    if (rlpxSpecs.length === 2) {
      const sorted = [...rlpxSpecs].sort((x, y) => x.basePort - y.basePort)
      const basePort = sorted[0].basePort
      const maxPeers = sorted[0].maxPeers ?? 10
      const caps = resolveCapabilities(sorted[0].capabilities ?? ['eth68'])
      let common: Common | Common[] | undefined
      const c0 = sorted[0].common
      const c1 = sorted[1].common
      if (Array.isArray(c0) || Array.isArray(c1)) {
        common = [
          commonFromSpec(
            Array.isArray(c0) ? c0[0] : (c0 ?? { chain: 'mainnet', hardfork: 'london' }),
          ),
          commonFromSpec(
            Array.isArray(c1) ? c1[0] : (c1 ?? { chain: 'mainnet', hardfork: 'london' }),
          ),
        ]
      } else if (c0) {
        common = commonFromSpec(c0)
      }
      const { mesh: pairMesh } = buildRlpxPair(basePort, caps, common, maxPeers)
      mesh.rlpxs = pairMesh.rlpxs
      sorted.forEach((spec, i) => {
        const node = pairMesh.get(i === 0 ? 'a' : 'b')
        mesh.nodes.set(spec.id, {
          id: spec.id,
          dpt: node.dpt,
          rlpx: node.rlpx!,
          basePort: basePort + i,
        })
      })
    } else {
      for (let i = 0; i < rlpxSpecs.length; i++) {
        const spec = rlpxSpecs[i]
        const node = createRlpxNode(
          {
            id: spec.id,
            basePort: spec.basePort,
            maxPeers: spec.maxPeers,
            capabilities: spec.capabilities,
            common: spec.common,
          },
          i,
        )
        mesh.nodes.set(spec.id, node)
        if (node.rlpx) mesh.rlpxs.push(node.rlpx)
      }
    }
    return mesh
  }

  get(id: string): LabMeshNode {
    const node = this.nodes.get(id)
    if (!node) throw new Error(`Unknown mesh node: ${id}`)
    return node
  }

  getRlpx(id: string): RLPx {
    const rlpx = this.get(id).rlpx
    if (!rlpx) throw new Error(`Node ${id} has no RLPx`)
    return rlpx
  }

  async connect(fromId: string, toId: string) {
    const from = this.get(fromId)
    const to = this.get(toId)
    const target = peerEndpoint(to.basePort)
    const dpt = from.rlpx !== undefined ? rlpxDpt(from.rlpx) : from.dpt
    await dpt.addPeer(target)
  }

  destroy() {
    if (this.rlpxs.length > 0) {
      destroyRLPXs(this.rlpxs)
    } else {
      destroyDPTs([...this.nodes.values()].map((n) => n.dpt))
    }
    this.nodes.clear()
    this.rlpxs = []
  }
}

/** Legacy mesh builder for scenarios using explicit ports (matches old helpers). */
export function buildRlpxPair(
  basePort: number,
  capabilities: Capabilities[],
  common?: Common | Common[],
  maxPeers = 2,
): { mesh: InProcessMesh; a: RLPx; b: RLPx } {
  const rlpxs = getTestRLPXs(2, maxPeers, basePort, capabilities, common)
  const mesh = new InProcessMesh()
  mesh.rlpxs = rlpxs
  mesh.nodes.set('a', { id: 'a', dpt: rlpxDpt(rlpxs[0]), rlpx: rlpxs[0], basePort })
  mesh.nodes.set('b', { id: 'b', dpt: rlpxDpt(rlpxs[1]), rlpx: rlpxs[1], basePort: basePort + 1 })
  return { mesh, a: rlpxs[0], b: rlpxs[1] }
}

export const MAINNET_STATUS_JSON: EthStatusFields = {
  td: '0x040000000000',
  bestHash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
  genesisHash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
}

export { EthMessageCodes, SnapMessageCodes, DISCONNECT_REASON }
export type { ETH, Peer, EthStatusFields }
