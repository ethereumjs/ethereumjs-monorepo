import { Common, Hardfork, Mainnet, Sepolia } from '@ethereumjs/common'

import { DPT, ETH, RLPx, genPrivateKey } from '../index.ts'

import type { RLPx as RLPxType } from '../rlpx/rlpx.ts'

import { LOCALHOST } from './constants.ts'
import { rlpxDpt } from './rlpxAccess.ts'

export { LOCALHOST }
import { resolveCapabilities } from './capabilities.ts'

import type { Common as CommonType } from '@ethereumjs/common'
import type { Capabilities } from '../types.ts'

export const delay = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export type ChainSpec = {
  chain: 'mainnet' | 'sepolia'
  hardfork?: string
}

export function commonFromSpec(spec: ChainSpec): CommonType {
  const chain = spec.chain === 'sepolia' ? Sepolia : Mainnet
  const hardfork = (spec.hardfork ?? 'london') as Hardfork
  return new Common({ chain, hardfork })
}

export function getTestDPTs(numDPTs: number, basePort: number, privateKeys?: Uint8Array[]) {
  const dpts: DPT[] = []

  for (let i = 0; i < numDPTs; ++i) {
    const key = privateKeys?.[i] ?? genPrivateKey()
    const dpt = new DPT(key, {
      endpoint: {
        address: LOCALHOST,
        udpPort: basePort + i,
        tcpPort: basePort + i,
      },
      shouldFindNeighbours: false,
      revalidatePeers: false,
    })
    dpt.bind(basePort + i)
    dpts.push(dpt)
  }
  return dpts
}

export function destroyDPTs(dpts: DPT[]) {
  for (const dpt of dpts) dpt.destroy()
}

export function getTestRLPXs(
  numRLPXs: number,
  maxPeers: number = 10,
  basePort: number,
  capabilities?: Capabilities[],
  common?: CommonType | CommonType[],
  privateKeys?: Uint8Array[],
) {
  const rlpxs: RLPx[] = []
  if (typeof capabilities === 'undefined') {
    capabilities = [ETH.eth66, ETH.eth65, ETH.eth64, ETH.eth63, ETH.eth62]
  }
  const defaultCommon = new Common({ chain: Mainnet, hardfork: Hardfork.London })
  const dpts = getTestDPTs(numRLPXs, basePort, privateKeys)

  for (let i = 0; i < numRLPXs; ++i) {
    const commonInst = Array.isArray(common) ? common[i] : (common ?? defaultCommon)
    const rlpx = new RLPx(dpts[i]['_privateKey'], {
      dpt: dpts[i],
      maxPeers,
      capabilities,
      common: commonInst,
      listenPort: basePort + i,
    })
    rlpx.listen(basePort + i)
    rlpxs.push(rlpx)
  }
  return rlpxs
}

export function destroyRLPXs(rlpxs: RLPx[]) {
  for (const rlpx of rlpxs) {
    rlpxDpt(rlpx).destroy()
    rlpx.destroy()
  }
}

export type MeshNodeSpec = {
  id: string
  basePort: number
  maxPeers?: number
  capabilities?: string[]
  common?: ChainSpec | ChainSpec[]
  dptOnly?: boolean
}

export type LabMeshNode = {
  id: string
  dpt: DPT
  rlpx?: RLPx
  basePort: number
}

/** In-process node with DPT only (discovery tests). */
export function createDptNode(id: string, basePort: number, privateKey?: Uint8Array): LabMeshNode {
  const key = privateKey ?? genPrivateKey()
  const dpt = new DPT(key, {
    endpoint: {
      address: LOCALHOST,
      udpPort: basePort,
      tcpPort: basePort,
    },
    timeout: 100,
    shouldFindNeighbours: false,
  })
  dpt.bind(basePort)
  return { id, dpt, basePort }
}

/** In-process RLPx node. */
export function createRlpxNode(
  config: MeshNodeSpec,
  index: number,
  privateKey?: Uint8Array,
): LabMeshNode {
  const caps = resolveCapabilities(config.capabilities ?? ['eth68'])
  const commonSpec = config.common
  let common: CommonType | CommonType[] | undefined
  if (Array.isArray(commonSpec)) {
    common = commonSpec.map((s) => commonFromSpec(s))
  } else if (commonSpec) {
    common = commonFromSpec(commonSpec)
  }
  const rlpxs = getTestRLPXs(
    1,
    config.maxPeers ?? 10,
    config.basePort,
    caps,
    common,
    privateKey ? [privateKey] : undefined,
  )
  return { id: config.id, dpt: rlpxDpt(rlpxs[0]), rlpx: rlpxs[0], basePort: config.basePort }
}

export function peerEndpoint(basePort: number, address: string = LOCALHOST) {
  return { address, udpPort: basePort, tcpPort: basePort }
}

export function initTwoPeerDPTSetup(basePort: number) {
  const dpts = getTestDPTs(2, basePort)
  const peer = { address: LOCALHOST, udpPort: basePort + 1 }
  dpts[0].addPeer(peer).catch(() => {
    /* Silently catch rejections here since not an actual test error */
  })
  return dpts
}

export function initTwoPeerRLPXSetup(
  maxPeers?: number,
  capabilities?: Capabilities[],
  common?: CommonType | CommonType[],
  basePort = 30306,
) {
  const rlpxs = getTestRLPXs(2, maxPeers, basePort, capabilities, common)
  const peer = { address: LOCALHOST, udpPort: basePort + 1, tcpPort: basePort + 1 }
  return { rlpxs, peer }
}

export function twoPeerMsgExchangeFromLab(
  opts: {
    sendMessage: (rlpxs: RLPxType[], protocol: unknown) => void
    receiveMessage: (rlpxs: RLPxType[], protocol: unknown, code: unknown, payload: unknown) => void
    onPeerError1?: false | ((err: Error, rlpxs: RLPxType[]) => void)
  },
  capabilities?: Capabilities[],
  common?: CommonType | CommonType[],
  basePort = 30306,
) {
  const { rlpxs, peer } = initTwoPeerRLPXSetup(undefined, capabilities, common, basePort)
  rlpxDpt(rlpxs[0])
    .addPeer(peer)
    .catch(() => {
      throw new Error('Peering failed')
    })
  rlpxs[0].events.on('peer:added', (peerConn) => {
    const protocol = peerConn.getProtocols()[0]
    opts.sendMessage(rlpxs, protocol)
  })

  rlpxs[1].events.on('peer:added', (peerConn) => {
    const protocol = peerConn.getProtocols()[0]
    protocol.events.on('message', async (code: unknown, payload: unknown) => {
      opts.receiveMessage(rlpxs, protocol, code, payload)
    })
    peerConn.events.on('error', (err: Error) => {
      if (opts.onPeerError1 !== false) {
        opts.onPeerError1?.(err, rlpxs)
      } else {
        throw new Error(`Unexpected peer 1 error: ${err}`)
      }
    })
  })
}
