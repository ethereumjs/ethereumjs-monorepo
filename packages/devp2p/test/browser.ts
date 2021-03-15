import tape from 'tape'
import dns from '../src/browser/dns'

tape('dns browser polyfill stub', async (t) => {
  const expectedError = 'EIP-1459 DNS Discovery is not supported for browser environments'

  t.test('dns.promises.resolve throws an error', async (t) => {
    try {
      await dns.promises.resolve('www.hello.com', 'TXT')
    } catch (e) {
      t.ok(e.toString().includes(expectedError), 'throws expected error')
      t.end()
    }
  })

  t.test('dns.setServers throws and error', (t) => {
    try {
      dns.setServers(['8.8.8.8'])
    } catch (e) {
      t.ok(e.toString().includes(expectedError), 'throws expected error')
      t.end()
    }
  })
})
