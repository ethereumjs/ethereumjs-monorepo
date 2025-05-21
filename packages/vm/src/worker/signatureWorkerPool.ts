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
  private results: Map<number, SignatureResult> = new Map()
  private nextTaskId = 0
  private pendingResults = 0

  constructor(numWorkers: number = 4) {
    const workerCode = `
            import { parentPort } from 'worker_threads'
            import { ecrecover } from '@ethereumjs/util'

            parentPort.on('message', (data) => {
                const { tasks, taskId } = data
                const results = tasks.map(task => {
                    const publicKey = ecrecover(task.msgHash, task.v, task.r, task.s, task.chainId)
                    return { publicKey }
                })
                parentPort.postMessage({ results, taskId })
            })
        `

    // Initialize workers
    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(workerCode, { eval: true })

      worker.on('message', (data: { results: SignatureResult[]; taskId: number }) => {
        const { results, taskId } = data
        results.forEach((result, index) => {
          this.results.set(taskId + index, result)
        })
        this.pendingResults--
      })

      this.workers.push(worker)
    }
  }

  async processBatch(tasks: SignatureTask[]): Promise<Map<number, SignatureResult>> {
    // Clear previous results
    this.results.clear()
    this.nextTaskId = 0
    this.pendingResults = 0

    // Calculate batch size per worker
    const batchSize = Math.ceil(tasks.length / this.workers.length)

    // Process tasks in parallel
    for (let i = 0; i < this.workers.length; i++) {
      const start = i * batchSize
      const end = Math.min(start + batchSize, tasks.length)
      if (start >= tasks.length) break

      const batch = tasks.slice(start, end)
      this.pendingResults++
      this.workers[i].postMessage({ tasks: batch, taskId: this.nextTaskId })
      this.nextTaskId += batch.length
    }

    // Wait for all results
    while (this.pendingResults > 0) {
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    return this.results
  }

  terminate() {
    for (const worker of this.workers) {
      worker.terminate()
    }
  }
}
