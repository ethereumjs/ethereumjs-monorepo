import EventEmitter from 'events'
import { EventEmitter as ee3 } from 'eventemitter3'
import { bench, describe } from 'vitest'

describe('event benchmarks', () => {
  const nodeJSevents = new EventEmitter()
  const event3 = new ee3()
  bench('NodeJS EventEmitter', async () => {
    await new Promise((resolve) => {
      nodeJSevents.on('msg', () => {
        nodeJSevents.removeAllListeners('msg')
        resolve(undefined)
      })
      nodeJSevents.emit('msg')
    })
  })
  bench('EventEmitter3', async () => {
    await new Promise((resolve) => {
      event3.on('msg', () => {
        event3.removeAllListeners('msg')
        resolve(undefined)
      })
      event3.emit('msg')
    })
  })
})
