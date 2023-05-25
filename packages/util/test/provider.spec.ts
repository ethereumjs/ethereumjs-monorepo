import * as tape from 'tape'

import { fetchFromProvider, getProvider } from '../src'

const providerUrl = 'https://myfakeprovider.com'
const fakeEthersProvider = {
  _getConnection(): any {
    const fakeConnection = {
      url: 'localhost:8545',
    }
    return fakeConnection
  },
}
tape('getProvider', (t) => {
  t.equal(getProvider(providerUrl), providerUrl, 'returned correct provider url string')
  t.equal(
    getProvider(fakeEthersProvider),
    fakeEthersProvider._getConnection().url,
    'returned correct provider url string'
  )
  t.throws(
    () => getProvider(<any>1),
    (err: any) => err.message.includes('Must provide valid provider URL or Web3Provider'),
    'throws correct error'
  )
  t.end()
})

tape('fetchFromProvider', async (t) => {
  try {
    await fetchFromProvider(providerUrl, {
      method: 'eth_getBalance',
      params: ['0xabcd'],
    })
    t.fail('should throw')
  } catch (err: any) {
    if (global.fetch !== undefined) {
      t.ok(err.message.includes('fetch'), 'tried to fetch and failed')
    } else {
      t.ok(
        err.toString().includes(providerUrl.split('//')[1]),
        'tries to fetch from specified provider url'
      )
    }
  }
})
