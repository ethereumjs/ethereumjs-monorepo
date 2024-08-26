export type T8NOptions = {
  state: {
    fork: string
    reward: BigInt
    chainid: BigInt
  }
  input: {
    alloc: string
    txs: string
    env: string
  }
  output: {
    basedir: string
    result: string
    alloc: string
    body: string
  }
}

export type T8NAlloc = {}

export type T8NEnv = {}
