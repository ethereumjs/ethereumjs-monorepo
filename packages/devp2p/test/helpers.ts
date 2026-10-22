import { devp2pTestData } from '@ethereumjs/testdata'

import { DPT, genPrivateKey } from '../src/index.ts'
import {
  delay,
  destroyDPTs,
  destroyRLPXs,
  getTestDPTs,
  getTestRLPXs,
  initTwoPeerDPTSetup,
  initTwoPeerRLPXSetup,
  LOCALHOST as localhost,
  twoPeerMsgExchangeFromLab,
} from '../src/lab/nodeFactory.ts'

import type { it } from 'vitest'

export {
  delay,
  destroyDPTs,
  destroyRLPXs,
  getTestDPTs,
  getTestRLPXs,
  initTwoPeerDPTSetup,
  initTwoPeerRLPXSetup,
  localhost,
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
      dnsNetworks: [devp2pTestData.dns.enrTree],
      shouldFindNeighbours: false,
      shouldGetDnsPeers: true,
    })
    dpt.bind(basePort + i)
    dpts.push(dpt)
  }
  return dpts
}

export function twoPeerMsgExchange3(
  _t: typeof it,
  opts: Parameters<typeof twoPeerMsgExchangeFromLab>[0],
  capabilities?: Parameters<typeof twoPeerMsgExchangeFromLab>[1],
  common?: Parameters<typeof twoPeerMsgExchangeFromLab>[2],
  basePort = 30306,
) {
  twoPeerMsgExchangeFromLab(opts, capabilities, common, basePort)
}
