import { assert, describe, it } from 'vitest'

import type { EventMap } from '../src/asyncEventEmitter.js'

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')

describe.skipIf(isBrowser)('async event emit/on test', async () => {
  const { AsyncEventEmitter } = await import('../src/index.js')
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

describe.skipIf(isBrowser)('async event emit/once test', async () => {
  const { AsyncEventEmitter } = await import('../src/index.js')

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

describe.skipIf(isBrowser)('AsyncEventEmitter', async () => {
  const { AsyncEventEmitter } = await import('../src/index.js')

  it('should add listener using addListener()', () => {
    const emitter = new AsyncEventEmitter<EventMap>()
    const listener = () => {}
    const event = 'event1'

    emitter.addListener(event, listener)

    assert.deepStrictEqual(emitter.listeners(event), [listener])
  })

  it('should prepend listener using prependListener()', () => {
    const emitter = new AsyncEventEmitter<EventMap>()
    const listener1 = () => {}
    const listener2 = () => {}
    const event = 'event1'

    emitter.prependListener(event, listener1)
    emitter.prependListener(event, listener2)

    assert.deepStrictEqual(emitter.listeners(event), [listener2, listener1])
  })

  it('should prepend once listener using prependOnceListener()', () => {
    const emitter = new AsyncEventEmitter<EventMap>()
    const listener1 = () => {}
    const listener2 = () => {}
    const event = 'event1'

    emitter.prependOnceListener(event, listener1)
    emitter.prependOnceListener(event, listener2)

    assert.deepStrictEqual(emitter.listeners(event), [listener2, listener1])
  })

  it('should return event names when using eventNames()', () => {
    const emitter = new AsyncEventEmitter<EventMap>()
    const event1 = 'event1'
    const event2 = 'event2'

    emitter.addListener(event1, () => {})
    emitter.addListener(event2, () => {})

    assert.deepStrictEqual(emitter.eventNames(), [event1, event2])
  })

  it('should return listeners for an event when using listeners()', () => {
    const emitter = new AsyncEventEmitter<EventMap>()
    const listener1 = () => {}
    const listener2 = () => {}
    const event = 'event1'

    emitter.addListener(event, listener1)
    emitter.addListener(event, listener2)

    assert.deepStrictEqual(emitter.listeners(event), [listener1, listener2])
  })

  it('should return the maximum number of listeners when using getMaxListeners()', () => {
    const emitter = new AsyncEventEmitter<EventMap>()

    const maxListeners = emitter.getMaxListeners()

    assert.strictEqual(maxListeners, 10)
  })

  it('should set the maximum number of listeners when using setMaxListeners()', () => {
    const emitter = new AsyncEventEmitter<EventMap>()

    const newMaxListeners = 10
    emitter.setMaxListeners(newMaxListeners)

    const maxListeners = emitter.getMaxListeners()

    assert.strictEqual(maxListeners, newMaxListeners)
  })
})
