import { parentPort } from 'node:worker_threads'

import { Devp2pWorkerHost } from './host.ts'

if (parentPort === null) {
  throw new Error('devp2p workerEntry must run inside a Worker')
}

new Devp2pWorkerHost(parentPort)
