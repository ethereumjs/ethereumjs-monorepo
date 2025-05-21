import { LegacyTx } from '@ethereumjs/tx'
import { bigIntToUnpaddedBytes, ecrecover, equalsBytes, randomBytes } from '@ethereumjs/util'
import { SignatureWorkerPool } from '../../src/worker/signatureWorkerPool.ts'

async function runBenchmark() {
  // Create 10 test transactions
  const transactions = Array.from({ length: 2000 }, (_, i) => {
    return new LegacyTx({
      nonce: i,
      gasPrice: 1000000000n,
      gasLimit: 21000n,
      to: '0x0000000000000000000000000000000000000000',
      value: 1000000000000000000n,
      data: '0x',
    })
  })

  // Sign all transactions
  const signedTxs = transactions.map((tx) => tx.sign(randomBytes(32)))

  // Precompute all hashes and signature values
  const msgHashes = signedTxs.map((tx) => tx.getMessageToVerifySignature())
  const vs = signedTxs.map((tx) => tx.v!)
  const rs = signedTxs.map((tx) => bigIntToUnpaddedBytes(tx.r!))
  const ss = signedTxs.map((tx) => bigIntToUnpaddedBytes(tx.s!))
  const chainIds = signedTxs.map((tx) => tx.common.chainId())

  console.log('Running benchmark...\n')

  // Sequential verification
  console.log('Sequential verification:')
  const startSeq = performance.now()

  // Store sequential results
  const sequentialResults = new Map()
  for (let i = 0; i < signedTxs.length; i++) {
    const publicKey = ecrecover(msgHashes[i], vs[i], rs[i], ss[i], 1n)
    sequentialResults.set(i, publicKey)
  }

  const endSeq = performance.now()
  console.log(`Time taken: ${endSeq - startSeq}ms\n`)

  // Parallel verification using worker pool
  console.log('Parallel verification using worker pool:')
  const startPar = performance.now()

  const signatureTasks = msgHashes.map((msgHash, i) => {
    return {
      msgHash,
      v: vs[i],
      r: rs[i],
      s: ss[i],
      chainId: chainIds[i],
    }
  })

  const workerPool = new SignatureWorkerPool(4) // Use 4 workers
  const parallelResults = await workerPool.processBatch(signatureTasks)
  await workerPool.terminate()

  const endPar = performance.now()
  console.log(`Time taken: ${endPar - startPar}ms\n`)

  // Print speedup
  const speedup = (endSeq - startSeq) / (endPar - startPar)
  console.log(`Speedup: ${speedup.toFixed(2)}x`)

  // Print result counts
  console.log(
    `\nResults count - Sequential: ${sequentialResults.size}, Parallel: ${parallelResults.size}`,
  )

  // Verify results match by comparing the stored sequential results with parallel results
  console.log('\nVerifying results...')
  let allMatch = true
  let missingResults = 0
  let mismatchedResults = 0

  for (let i = 0; i < signedTxs.length; i++) {
    const parallelResult = parallelResults.get(i)
    const sequentialResult = sequentialResults.get(i)

    if (!parallelResult) {
      console.log(`Missing parallel result at index ${i}`)
      missingResults++
      allMatch = false
      continue
    }

    if (!equalsBytes(parallelResult.publicKey, sequentialResult)) {
      console.log(`Mismatch at index ${i}`)
      console.log(`Sequential: ${sequentialResult}`)
      console.log(`Parallel: ${parallelResult.publicKey}`)
      mismatchedResults++
      allMatch = false
    }
  }

  console.log(`\nVerification Summary:`)
  console.log(`- All results match: ${allMatch}`)
  console.log(`- Missing results: ${missingResults}`)
  console.log(`- Mismatched results: ${mismatchedResults}`)
}

runBenchmark().catch(console.error)
