import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

import { DPT, ETH, RLPx, genPrivateKey } from '../../src/index.js'
import { testData } from '../testdata.js'

import type { Capabilities } from '../../src/index.js'

export const delay = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export const localhost = '127.0.0.1'

export function getTestDPTs(numDPTs: number, basePort: number) {
  const dpts = []

  for (let i = 0; i < numDPTs; ++i) {
    const dpt = new DPT(genPrivateKey(), {
      endpoint: {
        address: localhost,
        udpPort: basePort + i,
        tcpPort: basePort + i,
      },
      timeout: 100,
      shouldFindNeighbours: false, // Disable findNeighbors since only needed for bootstrap test
    })
    dpt.bind(basePort + i)
    dpts.push(dpt)
  }
  return dpts
}

export function getTestDPTsWithDns(numDPTs: number, basePort: number) {
  const dpts = []

  for (let i = 0; i < numDPTs; ++i) {
    const dpt = new DPT(genPrivateKey(), {
      endpoint: {
        address: localhost,
        udpPort: basePort + i,
        tcpPort: basePort + i,
      },
      timeout: 1000,
      refreshInterval: 400,
      dnsNetworks: [testData.dns.enrTree],
      shouldFindNeighbours: false,
      shouldGetDnsPeers: true,
    })
    dpt.bind(basePort + i)
    dpts.push(dpt)
  }
  return dpts
}

export function initTwoPeerDPTSetup(basePort: number) {
  const dpts = getTestDPTs(2, basePort)
  const peer = { address: localhost, udpPort: basePort + 1 }
  dpts[0].addPeer(peer).catch(() => {
    /* Silently catch rejections here since not an actual test error */
  })
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
  common?: Object | Common,
) {
  const rlpxs = []
  if (typeof capabilities === 'undefined') {
    capabilities = [ETH.eth66, ETH.eth65, ETH.eth64, ETH.eth63, ETH.eth62]
  }
  if (!common) {
    common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
  }
  const dpts = getTestDPTs(numRLPXs, basePort)

  for (let i = 0; i < numRLPXs; ++i) {
    const rlpx = new RLPx(dpts[i]['_privateKey'], {
      dpt: dpts[i],
      maxPeers,
      capabilities,
      common: common.constructor === Array ? common[i] : (common as Common),
      listenPort: basePort + i,
    })
    rlpx.listen(basePort + i)
    rlpxs.push(rlpx)
  }
  return rlpxs
}

export function initTwoPeerRLPXSetup(
  maxPeers?: any,
  capabilities?: any,
  common?: Object | Common,
  basePort = 30306,
): RLPx[] {
  const rlpxs = getTestRLPXs(2, maxPeers, basePort, capabilities, common)
  const peer = { address: localhost, udpPort: basePort + 1, tcpPort: basePort + 1 }
  rlpxs[0]['_dpt']!.addPeer(peer).catch(() => {
    /* Silently catch rejections here since not an actual test error */
  })
  return rlpxs
}

export function destroyRLPXs(rlpxs: any) {
  for (const rlpx of rlpxs) {
    // FIXME: Call destroy() on dpt instance from the rlpx.destroy() method
    rlpx._dpt.destroy()
    rlpx.destroy()
  }
}
