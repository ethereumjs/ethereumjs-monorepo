import test from 'tape'
import * as devp2p from '../../src'
import * as util from './util'
import Common from '@ethereumjs/common'
import { ETH } from '../../src'

const GENESIS_TD = 17179869184
const GENESIS_HASH = Buffer.from(
  'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
  'hex'
)

const capabilities = [devp2p.ETH.eth63, devp2p.ETH.eth62]

const status = {
  td: devp2p.int2buffer(GENESIS_TD),
  bestHash: GENESIS_HASH,
  genesisHash: GENESIS_HASH,
}

// FIXME: Handle unhandled promises directly
process.on('unhandledRejection', () => {})

test('ETH: send status message (successful)', async (t) => {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function (rlpxs: any) {
    t.pass('should receive echoing status message and welcome connection')
    util.destroyRLPXs(rlpxs)
    t.end()
  }
  util.twoPeerMsgExchange(t, opts, capabilities)
})

test('ETH: send status message (NetworkId mismatch)', async (t) => {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onPeerError0 = function (err: Error, rlpxs: any) {
    const msg = 'NetworkId mismatch: 01 / 03'
    t.equal(err.message, msg, `should emit error: ${msg}`)
    util.destroyRLPXs(rlpxs)
    t.end()
  }

  const c1 = new Common({ chain: 'mainnet' })
  const c2 = new Common({ chain: 'ropsten' })
  util.twoPeerMsgExchange(t, opts, capabilities, [c1, c2])
})

test('ETH: send status message (Genesis block mismatch)', async (t) => {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  const status1 = Object.assign({}, status)
  status1['genesisHash'] = Buffer.alloc(32)
  opts.status1 = status1
  opts.onPeerError0 = function (err: Error, rlpxs: any) {
    const msg =
      'Genesis block mismatch: d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3 / 0000000000000000000000000000000000000000000000000000000000000000'
    t.equal(err.message, msg, `should emit error: ${msg}`)
    util.destroyRLPXs(rlpxs)
    t.end()
  }
  util.twoPeerMsgExchange(t, opts, capabilities)
})

function sendWithProtocolVersion(t: test.Test, version: number, cap?: Object) {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function (rlpxs: any, eth: any) {
    t.equal(eth.getVersion(), version, `should use eth${version} as protocol version`)
    eth.sendMessage(devp2p.ETH.MESSAGE_CODES.NEW_BLOCK_HASHES, [437000, 1, 0, 0])
    t.pass('should send NEW_BLOCK_HASHES message')
  }
  opts.onOnMsg1 = function (rlpxs: any, eth: any, code: any) {
    if (code === devp2p.ETH.MESSAGE_CODES.NEW_BLOCK_HASHES) {
      t.pass('should receive NEW_BLOCK_HASHES message')
      util.destroyRLPXs(rlpxs)
      t.end()
    }
  }
  util.twoPeerMsgExchange(t, opts, cap)
}

function sendNotAllowed(
  t: test.Test,
  version: number,
  cap: Object,
  expectedCode: ETH.MESSAGE_CODES
) {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function (rlpxs: any, eth: any) {
    try {
      eth.sendMessage(expectedCode, [])
    } catch (err) {
      const msg = `Error: Code ${expectedCode} not allowed with version ${version}`
      t.equal(err.toString(), msg, `should emit error: ${msg}`)
      util.destroyRLPXs(rlpxs)
      t.end()
    }
  }
  util.twoPeerMsgExchange(t, opts, cap)
}

test('ETH: should use latest protocol version on default', async (t) => {
  sendWithProtocolVersion(t, 65)
})

test('ETH -> Eth64 -> sendStatus(): should throw on non-matching latest block provided', async (t) => {
  const cap = [devp2p.ETH.eth65]
  const common = new Common({ chain: 'mainnet', hardfork: 'byzantium' })
  const status0: any = Object.assign({}, status)
  status0['latestBlock'] = 100000 // lower than Byzantium fork block 4370000

  const rlpxs = util.initTwoPeerRLPXSetup(null, cap, common)
  rlpxs[0].on('peer:added', function (peer: any) {
    const protocol = peer.getProtocols()[0]
    t.throws(() => {
      protocol.sendStatus(status0)
    }, /latest block provided is not matching the HF setting/)
    util.destroyRLPXs(rlpxs)
    t.end()
  })
})

test('ETH: should work with allowed eth64', async (t) => {
  const cap = [devp2p.ETH.eth64]
  sendWithProtocolVersion(t, 64, cap)
})

test('ETH: send not-allowed eth64', async (t) => {
  sendNotAllowed(t, 64, [devp2p.ETH.eth64], ETH.MESSAGE_CODES.POOLED_TRANSACTIONS)
})

test('ETH -> Eth64 -> ForkId validation 1a)', async (t) => {
  const opts: any = {}
  const cap = [devp2p.ETH.eth64]
  const common = new Common({ chain: 'mainnet', hardfork: 'byzantium' })
  const status0: any = Object.assign({}, status)
  // Take a latest block > next mainnet fork block (constantinople)
  // to trigger validation condition
  status0['latestBlock'] = 9069000
  opts.status0 = status0
  opts.status1 = Object.assign({}, status)
  opts.onPeerError0 = function (err: Error, rlpxs: any) {
    const msg = 'Remote is advertising a future fork that passed locally'
    t.equal(err.message, msg, `should emit error: ${msg}`)
    util.destroyRLPXs(rlpxs)
    t.end()
  }

  util.twoPeerMsgExchange(t, opts, cap, common)
})

test('ETH: should work with allowed eth63', async (t) => {
  const cap = [devp2p.ETH.eth63]
  sendWithProtocolVersion(t, 63, cap)
})

test('ETH: should work with allowed eth63', async (t) => {
  const cap = [devp2p.ETH.eth63]
  sendWithProtocolVersion(t, 63, cap)
})

test('ETH: work with allowed eth62', async (t) => {
  const cap = [devp2p.ETH.eth62]
  sendWithProtocolVersion(t, 62, cap)
})

test('ETH: send not-allowed eth62', async (t) => {
  sendNotAllowed(t, 62, [devp2p.ETH.eth62], ETH.MESSAGE_CODES.GET_NODE_DATA)
})

test('ETH: send unknown message code', async (t) => {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function (rlpxs: any, eth: any) {
    try {
      eth.sendMessage(0x55, [])
    } catch (err) {
      const msg = 'Error: Unknown code 85'
      t.equal(err.toString(), msg, `should emit error: ${msg}`)
      util.destroyRLPXs(rlpxs)
      t.end()
    }
  }
  util.twoPeerMsgExchange(t, opts, capabilities)
})

test('ETH: invalid status send', async (t) => {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function (rlpxs: any, eth: any) {
    try {
      eth.sendMessage(devp2p.ETH.MESSAGE_CODES.STATUS, [])
    } catch (err) {
      const msg = 'Error: Please send status message through .sendStatus'
      t.equal(err.toString(), msg, `should emit error: ${msg}`)
      util.destroyRLPXs(rlpxs)
      t.end()
    }
  }
  util.twoPeerMsgExchange(t, opts, capabilities)
})
