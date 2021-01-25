import test from 'tape'
import { DNS } from '../src/dns'

test.skip('DNS: (integration) : should retrieve 5 PeerInfos for goerli', async (t) => {
  const publicKey = 'AKA3AM6LPBYEUDMVNU3BSVQJ5AD45Y7YPOHJLEF6W26QOE4VTUDPE'
  const goerliDNS = 'all.goerli.ethdisco.net'
  const enrTree = `enrtree://${publicKey}@${goerliDNS}`
  const ipTestRegex = /^\d+\.\d+\.\d+\.\d+$/ // e.g 123.44.55.77

  const dns = new DNS({ verbose: true })
  const peers = await dns.getPeers(5, enrTree)

  t.equal(peers.length, 5)

  const seen: string[] = []
  for (const peer of peers) {
    t.ok(peer!.address!.match(ipTestRegex)) // Check valid ip addresses

    t.ok(!seen.includes(peer!.address as string)) // Check no duplicates
    seen.push(peer!.address as string)
  }
  t.end()
})
