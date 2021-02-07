import test from 'tape'
import Common from '@ethereumjs/common'
import * as devp2p from '../../src'
import * as util from './util'

const GENESIS_TD = 17179869184
const GENESIS_HASH = Buffer.from(
  'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
  'hex'
)

const capabilities = [devp2p.LES.les2]

const status = {
  headTd: devp2p.int2buffer(GENESIS_TD), // total difficulty in genesis block
  headHash: GENESIS_HASH,
  headNum: devp2p.int2buffer(0),
  genesisHash: GENESIS_HASH,
}

// FIXME: Handle unhandled promises directly
process.on('unhandledRejection', () => {})

test('LES: send status message (successful)', async (t) => {
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

test('LES: send status message (modified announceType)', async (t) => {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status0['announceType'] = 0
  opts.status1 = Object.assign({}, status)
  opts.status1['announceType'] = 0
  opts.onOnceStatus0 = function (rlpxs: any) {
    t.pass('should receive echoing status message and welcome connection')
    util.destroyRLPXs(rlpxs)
    t.end()
  }
  util.twoPeerMsgExchange(t, opts, capabilities)
})

test('LES: send status message (NetworkId mismatch)', async (t) => {
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

test('LES: send valid message', async (t) => {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function (rlpxs: any, les: any) {
    t.equal(les.getVersion(), 2, 'should use les2 as protocol version')
    les.sendMessage(devp2p.LES.MESSAGE_CODES.GET_BLOCK_HEADERS, [1, [437000, 1, 0, 0]])
    t.pass('should send GET_BLOCK_HEADERS message')
  }
  opts.onOnMsg1 = function (rlpxs: any, eth: any, code: any) {
    if (code === devp2p.LES.MESSAGE_CODES.GET_BLOCK_HEADERS) {
      t.pass('should receive GET_BLOCK_HEADERS message')
      util.destroyRLPXs(rlpxs)
      t.end()
    }
  }
  util.twoPeerMsgExchange(t, opts, capabilities)
})

test('LES: send unknown message code', async (t) => {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function (rlpxs: any, les: any) {
    try {
      les.sendMessage(0x55, [1, []])
    } catch (err) {
      const msg = 'Error: Unknown code 85'
      t.equal(err.toString(), msg, `should emit error: ${msg}`)
      util.destroyRLPXs(rlpxs)
      t.end()
    }
  }
  util.twoPeerMsgExchange(t, opts, capabilities)
})

test('LES: invalid status send', async (t) => {
  const opts: any = {}
  opts.status0 = Object.assign({}, status)
  opts.status1 = Object.assign({}, status)
  opts.onOnceStatus0 = function (rlpxs: any, les: any) {
    try {
      les.sendMessage(devp2p.ETH.MESSAGE_CODES.STATUS, 1, [])
    } catch (err) {
      const msg = 'Error: Please send status message through .sendStatus'
      t.equal(err.toString(), msg, `should emit error: ${msg}`)
      util.destroyRLPXs(rlpxs)
      t.end()
    }
  }
  util.twoPeerMsgExchange(t, opts, capabilities)
})
