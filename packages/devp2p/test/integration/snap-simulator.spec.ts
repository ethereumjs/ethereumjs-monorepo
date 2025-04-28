import { assert, describe, it } from 'vitest'

import * as devp2p from '../../src/index.ts'

import * as util from './util.ts'

const capabilities = [devp2p.SNAP.snap]

// FIXME: Handle unhandled promises directly
process.on('unhandledRejection', () => {})

describe('Snap sync simulator tests', () => {
  it('SNAP: send valid message', () => {
    const opts: any = {}
    opts.sendMessage = function (rlpxs: any, snap: any) {
      assert.strictEqual(snap.getVersion(), 1, 'should use snap1 as protocol version')
      snap.sendMessage(devp2p.SnapMessageCodes.GET_ACCOUNT_RANGE, [1, [437000, 1, 0, 0]])
      assert.isTrue(true, 'should send GET_ACCOUNT_RANGE message')
    }
    opts.receiveMessage = function (rlpxs: any, snap: any, code: any) {
      if (code === devp2p.SnapMessageCodes.GET_ACCOUNT_RANGE) {
        assert.isTrue(true, 'should receive GET_ACCOUNT_RANGE message')
        util.destroyRLPXs(rlpxs)
      }
    }
    util.twoPeerMsgExchange3(it, opts, capabilities, undefined, 50901)
  })

  it('SNAP: send unknown message code', () => {
    const opts: any = {}
    opts.sendMessage = function (rlpxs: any, snap: any) {
      try {
        snap.sendMessage(0x55, [1, []])
      } catch (err: any) {
        const msg = 'Error: Unknown code 85'
        assert.strictEqual(err.toString(), msg, `should emit error: ${msg}`)
        util.destroyRLPXs(rlpxs)
      }
    }
    util.twoPeerMsgExchange3(it, opts, capabilities, undefined, 50991)
  })
})
