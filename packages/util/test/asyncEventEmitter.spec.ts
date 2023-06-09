import { assert, describe, it } from 'vitest'

import { AsyncEventEmitter } from '../src/index.js'

describe('async event emit/on test', async () => {
  it('should receive event', () => {
    const emitter = new AsyncEventEmitter()
    emitter.on('event', async (data, next) => {
      const startTime = Date.now()
      assert.equal(data, 'eventData', 'Received data from an event')
      setTimeout(() => {
        assert.ok(Date.now() > startTime, 'some time passed before event resolved')
        next?.()
      }, 1000)
    })
    emitter.emit('event', 'eventData')
  })
})

describe('async event emit/once test', async () => {
  it('should receive event', () => {
    const emitter = new AsyncEventEmitter()
    emitter.once('event', async (data, next) => {
      setTimeout(next!, 1000)
    })
    assert.equal(emitter.listenerCount('event'), 1, 'emitter has one event listener')
    emitter.emit('event', 'eventData', () => {
      assert.equal(emitter.listenerCount('event'), 0, 'listener removed after one event emitted')
    })
  })
})
