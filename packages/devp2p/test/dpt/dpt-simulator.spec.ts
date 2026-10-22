import { assert, describe, it } from 'vitest'

import { devp2pTestData } from '@ethereumjs/testdata'

import * as util from '../helpers.ts'

/** DPT bootstrap and DNS flows stay here until scenario actions cover them. */
describe('[Devp2p/DPT]: simulator (legacy)', () => {
  it('DPT: simulate bootstrap', async () => {
    const numDPTs = 6
    const basePort = 31251
    const dpts = util.getTestDPTs(numDPTs, basePort)
    for (const dpt of dpts) {
      dpt['_shouldFindNeighbours'] = true
    }
    await util.delay(250)
    await dpts[0].addPeer({ address: util.localhost, udpPort: basePort + 1 })
    await util.delay(100)

    for (const dpt of dpts.slice(2)) {
      await dpt.bootstrap({ address: util.localhost, udpPort: basePort + 1 })
    }

    for (const dpt of dpts) {
      for (let i = 0; i < 10; i++) {
        void dpt.refresh()
      }
      await util.delay(400)
    }

    await util.delay(500)

    for (const dpt of dpts) {
      assert.strictEqual(dpt.getPeers().length, numDPTs, 'Peers should be distributed to all DPTs')
    }
    await util.delay(1000)

    util.destroyDPTs(dpts)
  }, 60000)

  it('DPT: simulate acquiring peers via DNS', async () => {
    const dpts = util.getTestDPTsWithDns(1, 18519)

    const mockDns = {
      resolve: () => {
        return [[devp2pTestData.dns.enr]]
      },
    }
    dpts[0]._addPeerBatch = () => {
      dpts[0].destroy()
      assert.isTrue(true, 'got peer from DNS')
    }
    dpts[0]['_dns'].__setNativeDNSModuleResolve(mockDns)
    await dpts[0].refresh()
  })
})
