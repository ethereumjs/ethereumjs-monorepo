import fetch from 'cross-fetch'

export const fetchFromProvider = async (url: string, params: any) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      method: params.method,
      params: params.params,
      jsonrpc: '2.0',
      id: 1,
    }),
  })
  const data = (await res.json()).result
  return data
}

export const getProvider = (provider: string | any) => {
  if (typeof provider === 'string') {
    return provider
  } else if (provider.connection.url !== undefined) {
    return provider.connection.url
  } else {
    throw new Error('Must provide valid provider URL or Web3Provider')
  }
}
