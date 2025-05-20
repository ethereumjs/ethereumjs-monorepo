import { ecrecover } from '@ethereumjs/util'
import { parentPort } from 'worker_threads'

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

function processSignature(task: SignatureTask): SignatureResult {
  const publicKey = ecrecover(task.msgHash, task.v, task.r, task.s, task.chainId)
  return { publicKey }
}

// Listen for messages from the main thread
parentPort?.on('message', (tasks: SignatureTask[]) => {
  const results = tasks.map(processSignature)
  parentPort?.postMessage(results)
})
