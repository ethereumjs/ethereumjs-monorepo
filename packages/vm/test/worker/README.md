# Worker Thread Experiments

This folder holds various worker thread experiments exploring possible performance improvements that can be gained from paralleization of heavy computation or else multiple long-lived threads for related but interdependent workflows.

## `ecRecover` Worker Pool

The `ecrecover` directory contains an implementation of a worker pool for parallel ECDSA signature recovery operations.

- [`signatureWorkerPool.ts`](./ecrecover//signatureWorkerPool.ts): Implements a worker pool that distributes ECDSA signature recovery operations across multiple Node.js worker threads.
- [`signatureVerificationBenchmark.ts`](./ecrecover//signatureVerificationBenchmark.ts): Benchmark script that compares sequential vs. parallel signature verification performance.



