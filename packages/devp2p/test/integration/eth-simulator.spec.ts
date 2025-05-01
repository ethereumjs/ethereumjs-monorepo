import { Common, Hardfork, Mainnet, Sepolia } from '@ethereumjs/common'
import { hexToBytes, intToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import * as devp2p from '../../src/index.ts'
import { ETH, EthMessageCodes } from '../../src/index.ts'

import * as util from './util.ts'

import type { Peer } from '../../src/index.ts'

const GENESIS_TD = 17179869184
const GENESIS_HASH = hexToBytes(
  '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
)

const capabilities = [devp2p.ETH.eth68]

const status = {
  td: intToBytes(GENESIS_TD),
  bestHash: GENESIS_HASH,
  genesisHash: GENESIS_HASH,
}

describe('ETH simulator tests', () => {
  it('ETH: send status message (successful)', async () => {
    await new Promise((resolve) => {
      const rlpxs = util.getTestRLPXs(2, 2, 21762, capabilities)
      rlpxs[0].events.once('peer:added', (peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        protocol.sendStatus(status)
      })
      rlpxs[1].events.once('peer:added', (peer: Peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        protocol.events.on('message', (code) => {
          switch (code) {
            case EthMessageCodes.STATUS:
              assert.isTrue(true, 'should receive initial status message')
              protocol.sendStatus(status)
              util.destroyRLPXs(rlpxs)
              resolve(undefined)
          }
        })
      })
      const peer = { address: util.localhost, udpPort: 21762, tcpPort: 21762 }
      void rlpxs[1]['_dpt']!.addPeer(peer)
    })
  })

  it('ETH: send status message (NetworkId mismatch)', async () => {
    const c1 = new Common({ chain: Mainnet, hardfork: Hardfork.London })
    const c2 = new Common({ chain: Sepolia, hardfork: Hardfork.London })

    await new Promise((resolve) => {
      const rlpxs = util.getTestRLPXs(2, 2, 27126, capabilities, [c1, c2])
      rlpxs[0].events.once('peer:added', (peer: Peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        protocol.sendStatus(status)
      })
      rlpxs[1].events.once('peer:added', (peer: Peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        protocol.events.on('message', (code) => {
          switch (code) {
            case EthMessageCodes.STATUS: // (-> 1)
              try {
                protocol.sendStatus(status)
                assert.fail('should have thrown')
              } catch (err: any) {
                assert.strictEqual(err.message, 'NetworkId mismatch: 0xaa36a7 / 0x01')
              }
              util.destroyRLPXs(rlpxs)
              resolve(undefined)
          }
        })
      })
      const peer = { address: util.localhost, udpPort: 27126, tcpPort: 27126 }
      void rlpxs[1]['_dpt']!.addPeer(peer)
    })
  })

  it('ETH: send status message (Genesis block mismatch)', async () => {
    const status1 = Object.assign({}, status)
    status1.genesisHash = new Uint8Array(32)
    await new Promise((resolve) => {
      const rlpxs = util.getTestRLPXs(2, 2, 27126, capabilities)
      rlpxs[0].events.once('peer:added', (peer: Peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        protocol.sendStatus(status)
      })
      rlpxs[1].events.once('peer:added', (peer: Peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        protocol.events.on('message', (code) => {
          switch (code) {
            case EthMessageCodes.STATUS: // (-> 1)
              try {
                protocol.sendStatus(status1)
                assert.fail('should have thrown')
              } catch (err: any) {
                assert.strictEqual(
                  err.message,
                  'Genesis block mismatch: 0x0000000000000000000000000000000000000000000000000000000000000000 / 0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
                )
              }
              util.destroyRLPXs(rlpxs)
              resolve(undefined)
          }
        })
      })
      const peer = { address: util.localhost, udpPort: 27126, tcpPort: 27126 }
      void rlpxs[1]['_dpt']!.addPeer(peer)
    })
  })

  it('ETH: should use latest protocol version on default', async () => {
    await new Promise((resolve) => {
      const rlpxs = util.getTestRLPXs(2, 2, 21762, capabilities)
      rlpxs[0].events.once('peer:added', (peer: Peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        protocol.sendStatus(status)
        protocol.events.on('message', (code) => {
          switch (code) {
            case EthMessageCodes.STATUS:
              assert.strictEqual(protocol.getVersion(), 68)
              util.destroyRLPXs(rlpxs)
              resolve(undefined)
          }
        })
      })
      rlpxs[1].events.once('peer:added', (peer: Peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        protocol.events.on('message', (code) => {
          switch (code) {
            case EthMessageCodes.STATUS:
              protocol.sendStatus(status)
          }
        })
      })
      const peer = { address: util.localhost, udpPort: 21762, tcpPort: 21762 }
      void rlpxs[1]['_dpt']!.addPeer(peer)
    })
  })

  it('ETH -> Eth65 -> sendStatus(): should throw on non-matching latest block provided', async () => {
    const status0: any = Object.assign({}, status)
    status0['latestBlock'] = intToBytes(100000)
    const cap = [devp2p.ETH.eth65]
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Byzantium })
    await new Promise((resolve) => {
      const rlpxs = util.getTestRLPXs(2, 2, 50505, cap, common)
      rlpxs[0].events.once('peer:added', (peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        assert.throws(() => {
          protocol.sendStatus(status0)
        }, /latest block provided is not matching the HF setting/)
        util.destroyRLPXs(rlpxs)
        resolve(undefined)
      })
      const peer = { address: util.localhost, udpPort: 50505, tcpPort: 50505 }
      void rlpxs[1]['_dpt']!.addPeer(peer)
    })
  })

  it('ETH: send not-allowed eth68', async () => {
    await new Promise((resolve) => {
      const rlpxs = util.getTestRLPXs(2, 2, 21762, capabilities)
      rlpxs[0].events.once('peer:added', (peer: Peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        protocol.sendStatus(status)
      })
      rlpxs[1].events.once('peer:added', (peer: Peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        protocol.events.on('message', (code) => {
          switch (code) {
            case EthMessageCodes.STATUS:
              protocol.sendStatus(status)
              assert.throws(
                () => protocol.sendMessage(EthMessageCodes.GET_NODE_DATA, []),
                /Code 13 not allowed with version 68/,
              )
              assert.throws(
                () => protocol.sendMessage(EthMessageCodes.NODE_DATA, []),
                /Code 14 not allowed with version 68/,
              )
              util.destroyRLPXs(rlpxs)
              resolve(undefined)
          }
        })
      })
      const peer = { address: util.localhost, udpPort: 21762, tcpPort: 21762 }
      void rlpxs[1]['_dpt']!.addPeer(peer)
    })
  })

  it('ETH -> Eth65 -> ForkId validation 1a)', async () => {
    const status0: any = Object.assign({}, status)
    status0['latestBlock'] = intToBytes(1906009000)
    const cap = [devp2p.ETH.eth65]
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Byzantium })
    await new Promise((resolve) => {
      const rlpxs = util.getTestRLPXs(2, 2, 37812, cap, common)

      rlpxs[1].events.once('peer:added', (peer: Peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        protocol.sendStatus(status)
      })

      rlpxs[0].events.on('peer:added', (peer: Peer) => {
        ;(rlpxs[0].getPeers()[0] as Peer).events.on('error', (err: Error) => {
          assert.strictEqual(err.message, 'Remote is advertising a future fork that passed locally')
          util.destroyRLPXs(rlpxs)
          resolve(undefined)
        })
        const protocol = peer.getProtocols()[0] as ETH
        protocol.sendStatus(status0)
      })
      const peer = { address: util.localhost, udpPort: 37812, tcpPort: 37812 }
      void rlpxs[1]['_dpt']!.addPeer(peer)
    })
  })

  it('ETH: send unknown message code', async () => {
    await new Promise((resolve) => {
      const rlpxs = util.getTestRLPXs(2, 2, 12439, capabilities)
      rlpxs[0].events.once('peer:added', (peer: Peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        protocol.sendStatus(status)
      })
      rlpxs[1].events.once('peer:added', (peer: Peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        protocol.events.on('message', (code) => {
          switch (code) {
            case EthMessageCodes.STATUS:
              protocol.sendStatus(status)
              // @ts-expect-error -- Testing unknown code
              assert.throws(() => protocol.sendMessage(0x55, []), /Unknown code 85/)
              util.destroyRLPXs(rlpxs)
              resolve(undefined)
          }
        })
      })
      const peer = { address: util.localhost, udpPort: 12439, tcpPort: 12439 }
      void rlpxs[1]['_dpt']!.addPeer(peer)
    })
  })

  it('ETH: invalid status send', async () => {
    const status1 = Object.assign({}, status)
    status1.genesisHash = new Uint8Array(32)
    await new Promise((resolve) => {
      const rlpxs = util.getTestRLPXs(2, 2, 12437, capabilities)
      rlpxs[0].events.once('peer:added', (peer: Peer) => {
        const protocol = peer.getProtocols()[0] as ETH
        assert.throws(
          () => protocol.sendMessage(devp2p.EthMessageCodes.STATUS, []),
          /Please send status message through .sendStatus/,
        )
        util.destroyRLPXs(rlpxs)
        resolve(undefined)
      })
      const peer = { address: util.localhost, udpPort: 12437, tcpPort: 12437 }
      void rlpxs[1]['_dpt']!.addPeer(peer)
    })
  })

  it('RLPX: verify that snappy compression is not used with an RLPX peer that only supports devp2p 4', async () => {
    await new Promise((resolve) => {
      const rlpxs = util.getTestRLPXs(2, 2, 19601, capabilities)
      rlpxs[0].events.on('peer:added', function (peer: Peer) {
        const protocol = peer.getProtocols()[0] as ETH
        const v4Hello = {
          protocolVersion: 4,
          clientId: 'fakePeer',
          capabilities: [ETH.eth66],
          port: 19601,
          id: new Uint8Array(12),
        }
        // Set peer's devp2p protocol version to 4
        protocol['_peer']['_hello'] = v4Hello
        protocol.sendStatus(status)
        peer.events.on('error', (err: Error) => {
          assert.fail(`Unexpected peer 0 error: ${err}`)
        })
      })

      rlpxs[1].events.on('peer:added', function (peer: Peer) {
        const protocol = peer.getProtocols()[0] as ETH
        protocol.events.once('message', (code) => {
          switch (code) {
            case EthMessageCodes.STATUS:
              assert.fail('should not have been able to process status message')
              break
          }
        })
        peer.events.once('error', (err) => {
          assert.strictEqual(
            err.message,
            'Invalid Snappy bitstream',
            'unable to process snappy compressed message',
          )
          util.destroyRLPXs(rlpxs)
          resolve(undefined)
        })
      })
      const peer = { address: util.localhost, udpPort: 19601, tcpPort: 19601 }
      void rlpxs[1]['_dpt']!.addPeer(peer)
    })
  })
})
