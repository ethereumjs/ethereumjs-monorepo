type rpcParams = {
  method: string
  params: (string | boolean | number)[]
}

/**
 * Makes a simple RPC call to a remote Ethereum JSON-RPC provider and passes through the response.
 * No parameter or response validation is done.
 *
 * @param url the URL for the JSON RPC provider
 * @param params the parameters for the JSON-RPC method - refer to
 * https://ethereum.org/en/developers/docs/apis/json-rpc/ for details on RPC methods
 * @returns the `result` field from the JSON-RPC response
 */
export const fetchFromProvider = async (url: string, params: rpcParams) => {
  const data = JSON.stringify({
    method: params.method,
    params: params.params,
    jsonrpc: '2.0',
    id: 1,
  })

  const res = await fetch(url, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: data,
  })
  const json = await res.json()
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
    throw new Error('Must provide valid provider URL or Web3Provider')
  }
}

/**
 * A partial interface for an `ethers` `JsonRpcProvider`
 * We only use the url string since we do raw `fetch` calls to
 * retrieve the necessary data
 */
export interface EthersProvider {
  _getConnection: () => {
    url: string
  }
}
