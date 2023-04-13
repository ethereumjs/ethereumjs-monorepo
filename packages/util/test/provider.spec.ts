import * as tape from 'tape'

import { fetchFromProvider, getProvider } from '../src'

const providerUrl = 'https://myfakeprovider.com/rpc'
const fakeEthersProvider = {
  connection: {
    url: 'https://myfakeethersprovider.com/rpc',
  },
}
tape('getProvider', (t) => {
  t.equal(getProvider(providerUrl), providerUrl, 'returned correct provider url string')
  t.equal(
    getProvider(fakeEthersProvider),
    fakeEthersProvider.connection.url,
    'returned correct provider url string'
  )
  t.throws(
    () => getProvider(1),
    (err: any) => err.message.includes('Must provide valid provider URL or Web3Provider'),
    'throws correct error'
  )
  t.end()
})

tape('fetchFromProvider', async (t) => {
  // This test verifies that the fetch is made to the correct provider URL
  // since trying to stub out `cross-fetch` seems to be impossible without
  // introducing a new testing tool not used in the monorepo currently (e.g. jest)
  try {
    await fetchFromProvider(providerUrl, { method: 'eth_getBalance', params: ['0xabcd'] })
    t.fail('should throw')
  } catch (err: any) {
    t.ok(err.message.includes(providerUrl), 'tries to fetch from specified provider url')
  }
})
