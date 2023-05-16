import * as https from 'https'

type rpcParams = {
  method: string
  params: (string | boolean | number)[]
}

const nodeFetch = async (url: string, data: string) =>
  new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    }

    const req = https
      .request(url, options, (resp) => {
        let data = ''
        resp.on('data', (chunk) => {
          data += chunk
        })
        resp.on('end', () => {
          const res = JSON.parse(data)
          resolve(res)
        })
      })
      .on('error', (err) => {
        reject(err.message)
      })
    req.end(data)
  })

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

  if (global.fetch !== undefined) {
    const res = await fetch(url, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      body: data,
    })
    const json = await res.json()
    return json.result
  } else {
    const res: any = await nodeFetch(url, data)
    return res.result
  }
}

/**
 *
 * @param provider a URL string or {@link EthersProvider}
 * @returns the extracted URL string for the JSON-RPC Provider
 */
export const getProvider = (provider: string | EthersProvider) => {
  if (typeof provider === 'string') {
    return provider
  } else if (typeof provider === 'object' && provider.connection.url !== undefined) {
    return provider.connection.url
  } else {
    throw new Error('Must provide valid provider URL or Web3Provider')
  }
}

/**
 * A partial interface for an `ethers` `JsonRpcProvider`
 * We only use the url string since we do raw `fetch` or `http` calls to
 * retrieve the necessary data
 */
export interface EthersProvider {
  connection: {
    url: string
  }
}
