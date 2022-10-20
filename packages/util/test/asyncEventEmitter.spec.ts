import * as tape from 'tape'

import { AsyncEventEmitter } from '../src/asyncEventEmitter'

tape('async event test', (t) => {
  const emitter = new AsyncEventEmitter()
  emitter.on('event', async (data, next) => {
    const startTime = Date.now()
    t.equal(data, 'eventData', 'Received data from an event')
    setTimeout(() => {
      t.ok(Date.now() > startTime, 'some time passed before event resolved')
      next()
    }, 1000)
  })
  emitter.emit('event', 'eventData', t.end)
})
