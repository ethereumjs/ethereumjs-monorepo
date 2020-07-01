import test from 'tape'
import * as devp2p from '../../src'
import * as util from './util'
import Common from 'ethereumjs-common'

const GENESIS_TD = 17179869184
const GENESIS_HASH = Buffer.from(
  'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
  'hex'
)

const capabilities = [devp2p.ETH.eth63, devp2p.ETH.eth62]

const status = {
  td: devp2p.int2buffer(GENESIS_TD),
  bestHash: GENESIS_HASH,
  genesisHash: GENESIS_HASH
}

// FIXME: Handle unhandled promises directly
process.on('unhandledRejection', () => {})

test('ETH: send status message (successful)', async t => {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function(rlpxs: any) {
    t.pass('should receive echoing status message and welcome connection')
    util.destroyRLPXs(rlpxs)
    t.end()
  }
  util.twoPeerMsgExchange(t, opts, capabilities)
})

test('ETH: send status message (NetworkId mismatch)', async t => {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onPeerError0 = function(err: Error, rlpxs: any) {
    const msg = 'NetworkId mismatch: 01 / 03'
    t.equal(err.message, msg, `should emit error: ${msg}`)
    util.destroyRLPXs(rlpxs)
    t.end()
  }

  const c1 = new Common('mainnet')
  const c2 = new Common('ropsten')
  util.twoPeerMsgExchange(t, opts, capabilities, [c1, c2])
})

test('ETH: send status message (Genesis block mismatch)', async t => {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  const status1 = Object.assign({}, status)
  status1['genesisHash'] = Buffer.alloc(32)
  opts.status1 = status1
  opts.onPeerError0 = function(err: Error, rlpxs: any) {
    const msg =
      'Genesis block mismatch: d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3 / 0000000000000000000000000000000000000000000000000000000000000000'
    t.equal(err.message, msg, `should emit error: ${msg}`)
    util.destroyRLPXs(rlpxs)
    t.end()
  }
  util.twoPeerMsgExchange(t, opts, capabilities)
})

test('ETH: send allowed eth63', async t => {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function(rlpxs: any, eth: any) {
    t.equal(eth.getVersion(), 63, 'should use eth63 as protocol version')
    eth.sendMessage(devp2p.ETH.MESSAGE_CODES.NEW_BLOCK_HASHES, [437000, 1, 0, 0])
    t.pass('should send NEW_BLOCK_HASHES message')
  }
  opts.onOnMsg1 = function(rlpxs: any, eth: any, code: any) {
    if (code === devp2p.ETH.MESSAGE_CODES.NEW_BLOCK_HASHES) {
      t.pass('should receive NEW_BLOCK_HASHES message')
      util.destroyRLPXs(rlpxs)
      t.end()
    }
  }
  util.twoPeerMsgExchange(t, opts, capabilities)
})

test('ETH: send allowed eth62', async t => {
  const cap = [devp2p.ETH.eth62]
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function(rlpxs: any, eth: any) {
    eth.sendMessage(devp2p.ETH.MESSAGE_CODES.NEW_BLOCK_HASHES, [437000, 1, 0, 0])
    t.pass('should send NEW_BLOCK_HASHES message')
  }
  opts.onOnMsg1 = function(rlpxs: any, eth: any, code: any) {
    if (code === devp2p.ETH.MESSAGE_CODES.NEW_BLOCK_HASHES) {
      t.pass('should receive NEW_BLOCK_HASHES message')
      util.destroyRLPXs(rlpxs)
      t.end()
    }
  }
  util.twoPeerMsgExchange(t, opts, cap)
})

test('ETH: send not-allowed eth62', async t => {
  const cap = [devp2p.ETH.eth62]
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function(rlpxs: any, eth: any) {
    try {
      eth.sendMessage(devp2p.ETH.MESSAGE_CODES.GET_NODE_DATA, [])
    } catch (err) {
      const msg = 'Error: Code 13 not allowed with version 62'
      t.equal(err.toString(), msg, `should emit error: ${msg}`)
      util.destroyRLPXs(rlpxs)
      t.end()
    }
  }
  util.twoPeerMsgExchange(t, opts, cap)
})

test('ETH: send unknown message code', async t => {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function(rlpxs: any, eth: any) {
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

test('ETH: invalid status send', async t => {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function(rlpxs: any, eth: any) {
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
