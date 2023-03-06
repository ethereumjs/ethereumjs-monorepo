import * as tape from 'tape'

import { AsyncEventEmitter } from '../src/asyncEventEmitter'

tape('async event emit/on test', (t) => {
  const emitter = new AsyncEventEmitter()
  emitter.on('event', async (data, next) => {
    const startTime = Date.now()
    t.equal(data, 'eventData', 'Received data from an event')
    setTimeout(() => {
      t.ok(Date.now() > startTime, 'some time passed before event resolved')
      next?.()
    }, 1000)
  })
  emitter.emit('event', 'eventData', t.end)
})

tape('async event emit/once test', (t) => {
  const emitter = new AsyncEventEmitter()
  emitter.once('event', async (data, next) => {
    setTimeout(next!, 1000)
  })
  t.equal(emitter.listenerCount('event'), 1, 'emitter has one event listener')
  emitter.emit('event', 'eventData', () => {
    t.equal(emitter.listenerCount('event'), 0, 'listener removed after one event emitted')
    t.end()
  })
})
