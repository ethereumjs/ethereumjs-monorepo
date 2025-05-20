import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { Worker } from 'worker_threads'

interface SignatureTask {
  msgHash: Uint8Array
  v: bigint
  r: Uint8Array
  s: Uint8Array
  chainId?: bigint
}

interface SignatureResult {
  publicKey: Uint8Array
}

export class SignatureWorkerPool {
  private workers: Worker[] = []
  private taskQueue: SignatureTask[] = []
  private results: Map<number, SignatureResult> = new Map()
  private nextTaskId = 0

  constructor(numWorkers: number = 4) {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const workerPath = join(__dirname, 'signatureWorker.ts')

    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(workerPath, {
        // Use tsx to run TypeScript files
        execArgv: ['-r', 'tsx/register'],
      })

      worker.on('message', (results: SignatureResult[]) => {
        results.forEach((result, index) => {
          this.results.set(this.nextTaskId - results.length + index, result)
        })
      })
      this.workers.push(worker)
    }
  }

  async processBatch(tasks: SignatureTask[]): Promise<Map<number, SignatureResult>> {
    const batchSize = Math.ceil(tasks.length / this.workers.length)
    const promises: Promise<void>[] = []

    for (let i = 0; i < this.workers.length; i++) {
      const start = i * batchSize
      const end = Math.min(start + batchSize, tasks.length)
      const batch = tasks.slice(start, end)

      if (batch.length > 0) {
        promises.push(
          new Promise((resolve) => {
            this.workers[i].postMessage(batch)
            resolve()
          }),
        )
      }
    }

    await Promise.all(promises)
    return this.results
  }

  terminate() {
    this.workers.forEach((worker) => worker.terminate())
  }
}
