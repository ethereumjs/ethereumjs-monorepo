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

export const getProvider = (provider: string | any) => {
  if (typeof provider === 'string') {
    return provider
  } else if (provider?.connection?.url !== undefined) {
    return provider.connection.url
  } else {
    throw new Error('Must provide valid provider URL or Web3Provider')
  }
}
