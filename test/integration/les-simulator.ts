const test = require('tape')
const devp2p = require('../../src')
const util = require('./util.js')

const CHAIN_ID = 1

const GENESIS_TD = 17179869184
const GENESIS_HASH = Buffer.from('d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3', 'hex')

var capabilities = [
  devp2p.LES.les2
]

const status = {
  networkId: CHAIN_ID,
  headTd: devp2p._util.int2buffer(GENESIS_TD), // total difficulty in genesis block
  headHash: GENESIS_HASH,
  headNum: devp2p._util.int2buffer(0),
  genesisHash: GENESIS_HASH
}

// FIXME: Handle unhandled promises directly
process.on('unhandledRejection', (reason, p) => {})

test('LES: send status message (successful)', async (t) => {
  let opts = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function (rlpxs, eth) {
    t.pass('should receive echoing status message and welcome connection')
    util.destroyRLPXs(rlpxs)
    t.end()
  }
  util.twoPeerMsgExchange(t, capabilities, opts)
})

test('LES: send status message (modified announceType)', async (t) => {
  let opts = {}
  opts.status0 = Object.assign({}, status)
  opts.status0['announceType'] = 0
  opts.status1 = Object.assign({}, status)
  opts.status1['announceType'] = 0
  opts.onOnceStatus0 = function (rlpxs, eth) {
    t.pass('should receive echoing status message and welcome connection')
    util.destroyRLPXs(rlpxs)
    t.end()
  }
  util.twoPeerMsgExchange(t, capabilities, opts)
})

test('LES: send status message (NetworkId mismatch)', async (t) => {
  let opts = {}
  opts.status0 = Object.assign({}, status)
  let status1 = Object.assign({}, status)
  status1['networkId'] = 2
  opts.status1 = status1
  opts.onPeerError0 = function (err, rlpxs) {
    const msg = 'NetworkId mismatch: 01 / 02'
    t.equal(err.message, msg, `should emit error: ${msg}`)
    util.destroyRLPXs(rlpxs)
    t.end()
  }
  util.twoPeerMsgExchange(t, capabilities, opts)
})

test('ETH: send status message (Genesis block mismatch)', async (t) => {
  let opts = {}
  opts.status0 = Object.assign({}, status)
  let status1 = Object.assign({}, status)
  status1['genesisHash'] = Buffer.alloc(32)
  opts.status1 = status1
  opts.onPeerError0 = function (err, rlpxs) {
    const msg = 'Genesis block mismatch: d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3 / 0000000000000000000000000000000000000000000000000000000000000000'
    t.equal(err.message, msg, `should emit error: ${msg}`)
    util.destroyRLPXs(rlpxs)
    t.end()
  }
  util.twoPeerMsgExchange(t, capabilities, opts)
})

test('LES: send valid message', async (t) => {
  let opts = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function (rlpxs, les) {
    t.equal(les.getVersion(), 2, 'should use les2 as protocol version')
    les.sendMessage(devp2p.LES.MESSAGE_CODES.GET_BLOCK_HEADERS, 1, [ 437000, 1, 0, 0 ])
    t.pass('should send GET_BLOCK_HEADERS message')
  }
  opts.onOnMsg1 = function (rlpxs, eth, code, payload) {
    if (code === devp2p.LES.MESSAGE_CODES.GET_BLOCK_HEADERS) {
      t.pass('should receive GET_BLOCK_HEADERS message')
      util.destroyRLPXs(rlpxs)
      t.end()
    }
  }
  util.twoPeerMsgExchange(t, capabilities, opts)
})

test('LES: send unknown message code', async (t) => {
  let opts = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function (rlpxs, les) {
    try {
      les.sendMessage(0x55, 1, [])
    } catch (err) {
      const msg = 'Error: Unknown code 85'
      t.equal(err.toString(), msg, `should emit error: ${msg}`)
      util.destroyRLPXs(rlpxs)
      t.end()
    }
  }
  util.twoPeerMsgExchange(t, capabilities, opts)
})

test('LES: invalid status send', async (t) => {
  let opts = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function (rlpxs, les) {
    try {
      les.sendMessage(devp2p.ETH.MESSAGE_CODES.STATUS, 1, [])
    } catch (err) {
      const msg = 'Error: Please send status message through .sendStatus'
      t.equal(err.toString(), msg, `should emit error: ${msg}`)
      util.destroyRLPXs(rlpxs)
      t.end()
    }
  }
  util.twoPeerMsgExchange(t, capabilities, opts)
})
