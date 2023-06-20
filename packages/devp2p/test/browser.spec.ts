import { assert, describe, it } from 'vitest'

import { dns } from '../src/browser/dns.js'

describe('dns browser polyfill stub', () => {
  const expectedError = 'EIP-1459 DNS Discovery is not supported for browser environments'

  it('dns.promises.resolve throws an error', async () => {
    try {
      await dns.promises.resolve('www.hello.com', 'TXT')
    } catch (e: any) {
      assert.ok(e.toString().includes(expectedError), 'throws expected error')
    }
  })

  it('dns.setServers throws and error', () => {
    try {
      dns.setServers(['8.8.8.8'])
    } catch (e: any) {
      assert.ok(e.toString().includes(expectedError), 'throws expected error')
    }
  })
})
