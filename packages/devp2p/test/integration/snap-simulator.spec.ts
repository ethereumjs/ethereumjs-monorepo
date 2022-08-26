import * as test from 'tape'

import * as devp2p from '../../src'

import * as util from './util'

const capabilities = [devp2p.SNAP.snap]

// FIXME: Handle unhandled promises directly
process.on('unhandledRejection', () => {})

test('SNAP: send valid message', (t) => {
  const opts: any = {}
  opts.sendMessage = function (rlpxs: any, snap: any) {
    t.equal(snap.getVersion(), 1, 'should use snap1 as protocol version')
    snap.sendMessage(devp2p.SNAP.MESSAGE_CODES.GET_ACCOUNT_RANGE, [1, [437000, 1, 0, 0]])
    t.pass('should send GET_ACCOUNT_RANGE message')
  }
  opts.receiveMessage = function (rlpxs: any, snap: any, code: any) {
    if (code === devp2p.SNAP.MESSAGE_CODES.GET_ACCOUNT_RANGE) {
      t.pass('should receive GET_ACCOUNT_RANGE message')
      util.destroyRLPXs(rlpxs)
      t.end()
    }
  }
  util.twoPeerMsgExchange3(t, opts, capabilities)
})

test('SNAP: send unknown message code', (t) => {
  const opts: any = {}
  opts.sendMessage = function (rlpxs: any, snap: any) {
    try {
      snap.sendMessage(0x55, [1, []])
    } catch (err: any) {
      const msg = 'Error: Unknown code 85'
      t.equal(err.toString(), msg, `should emit error: ${msg}`)
      util.destroyRLPXs(rlpxs)
      t.end()
    }
  }
  util.twoPeerMsgExchange3(t, opts, capabilities)
})
