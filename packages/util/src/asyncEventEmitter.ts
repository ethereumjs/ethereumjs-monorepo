import { eachSeries } from 'async'
import { EventEmitter } from 'events'
type AsyncListener<T, R> =
  | ((data: T, callback: (result?: R) => void) => Promise<R>)
  | ((data: T, callback: (result?: R) => void) => void)
export interface EventMap {
  [event: string]: AsyncListener<any, any>
}

export class AsyncEventEmitter<T extends EventMap> extends EventEmitter {
  emit<E extends keyof T>(event: E & string, ...args: Parameters<T[E]>) {
    let [data, callback] = args
    const self = this
    //@ts-ignore
    let listeners = self._events[event] ?? []

    // Optional data argument
    if (callback === undefined && typeof data === 'function') {
      callback = data
      data = undefined
    }

    // Special treatment of internal newListener and removeListener events
    if (event === 'newListener' || event === 'removeListener') {
      data = {
        event: data,
        fn: callback,
      }

      callback = undefined as any
    }

    // A single listener is just a function not an array...
    listeners = Array.isArray(listeners) ? listeners : [listeners]

    eachSeries(
      listeners.slice(),
      function (fn: any, next) {
        let err

        // Support synchronous functions
        if (fn.length < 2) {
          try {
            fn.call(self, data)
          } catch (e: any) {
            err = e
          }

          return next(err)
        }

        // Async
        fn.call(self, data, next)
      },
      callback
    )

    return self.listenerCount(event) > 0
  }
}
