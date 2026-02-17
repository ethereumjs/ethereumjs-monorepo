import { EthereumJSErrorWithoutCode } from './errors.ts'

type rpcParams = {
  method: string
  params: (string | string[] | boolean | number)[]
}

export type FetchFromProviderOptions = {
  /** Request timeout in milliseconds (default: 60000) */
  timeout?: number
}

/**
 * Makes a simple RPC call to a remote Ethereum JSON-RPC provider and passes through the response.
 * No parameter or response validation is done.
 *
 * @param url the URL for the JSON RPC provider
 * @param params the parameters for the JSON-RPC method - refer to
 * https://ethereum.org/en/developers/docs/apis/json-rpc/ for details on RPC methods
 * @param options optional settings (e.g. timeout)
 * @returns the `result` field from the JSON-RPC response
 * @example
 * ```ts
 * const provider = 'https://mainnet.infura.io/v3/...'
 * const params = {
 *   method: 'eth_getBlockByNumber',
 *   params: ['latest', false],
 * }
 * const block = await fetchFromProvider(provider, params)
 * ```
 */
export const fetchFromProvider = async (
  url: string,
  params: rpcParams,
  options?: FetchFromProviderOptions,
) => {
  const timeout = options?.timeout ?? 60_000
  const data = JSON.stringify({
    method: params.method,
    params: params.params,
    jsonrpc: '2.0',
    id: 1,
  })

  let signal: AbortSignal
  let timer: ReturnType<typeof setTimeout> | undefined
  if (typeof AbortSignal.timeout === 'function') {
    signal = AbortSignal.timeout(timeout)
  } else {
    const controller = new AbortController()
    signal = controller.signal
    timer = setTimeout(() => controller.abort(), timeout)
  }

  const res = await fetch(url, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: data,
    signal,
  }).finally(() => {
    if (timer !== undefined) clearTimeout(timer)
  })
  if (!res.ok) {
    throw EthereumJSErrorWithoutCode(
      `JSONRPCError: ${JSON.stringify(
        {
          method: params.method,
          status: res.status,
          message: await res.text().catch(() => {
            return 'Could not parse error message likely because of a network error'
          }),
        },
        null,
        2,
      )}`,
    )
  }
  const json = await res.json()
  // TODO we should check json.error here
  return json.result
}

/**
 *
 * @param provider a URL string or {@link EthersProvider}
 * @returns the extracted URL string for the JSON-RPC Provider
 */
export const getProvider = (provider: string | EthersProvider) => {
  if (typeof provider === 'string') {
    return provider
  } else if (typeof provider === 'object' && provider._getConnection !== undefined) {
    return provider._getConnection().url
  } else {
    throw EthereumJSErrorWithoutCode('Must provide valid provider URL or Web3Provider')
  }
}

/**
 * A partial interface for an `ethers` `JSONRPCProvider`
 * We only use the url string since we do raw `fetch` calls to
 * retrieve the necessary data
 */
export interface EthersProvider {
  _getConnection: () => {
    url: string
  }
}
