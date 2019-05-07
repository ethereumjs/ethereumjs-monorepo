export = index
declare class index {
  static arbiter(incumbent: any, candidate: any): any
  static distance(firstId: any, secondId: any): any
  constructor(options: any)
  localNodeId: any
  numberOfNodesPerKBucket: any
  numberOfNodesToPing: any
  distance: any
  arbiter: any
  root: any
  metadata: any
  add(contact: any): any
  addListener(type: any, listener: any): any
  closest(id: any, n: any): any
  count(): any
  emit(type: any, args: any): any
  eventNames(): any
  get(id: any): any
  getMaxListeners(): any
  listenerCount(type: any): any
  listeners(type: any): any
  off(type: any, listener: any): any
  on(type: any, listener: any): any
  once(type: any, listener: any): any
  prependListener(type: any, listener: any): any
  prependOnceListener(type: any, listener: any): any
  rawListeners(type: any): any
  remove(id: any): any
  removeAllListeners(type: any, ...args: any[]): any
  removeListener(type: any, listener: any): any
  setMaxListeners(n: any): any
  toArray(): any
}
