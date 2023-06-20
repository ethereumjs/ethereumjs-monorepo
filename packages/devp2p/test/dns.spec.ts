import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { DNS } from '../src/dns/index.js'

import * as testdata from './testdata.json'

describe('DNS', () => {
  const mockData = testdata.dns
  const mockDns = td.replace<any>('dns')

  let dns: DNS
  function initializeDns() {
    dns = new DNS()
    // td is not intercepting the native `dns` import in ../src/dns
    // even if it's imported after the td.replace statement above.
    // (td.replaceEsm can address this problem for Node >= 13)
    // This manually sets the fixture:
    dns.__setNativeDNSModuleResolve(mockDns)
  }

  const host = 'nodes.example.org'
  const rootDomain = 'JORXBYVVM7AEKETX5DGXW44EAY'
  const branchDomainA = 'D2SNLTAGWNQ34NTQTPHNZDECFU'
  const branchDomainB = 'D3SNLTAGWNQ34NTQTPHNZDECFU'
  const branchDomainC = 'D4SNLTAGWNQ34NTQTPHNZDECFU'
  const branchDomainD = 'D5SNLTAGWNQ34NTQTPHNZDECFU'
  const partialBranchA = 'AAAA'
  const partialBranchB = 'BBBB'
  const singleBranch = `enrtree-branch:${branchDomainA}`
  const doubleBranch = `enrtree-branch:${branchDomainA},${branchDomainB}`
  const multiComponentBranch = [
    `enrtree-branch:${branchDomainA},${partialBranchA}`,
    `${partialBranchB},${branchDomainB}`,
  ]

  // Note: once td.when is asked to throw for an input it will always throw.
  // Input can't be re-used for a passing case.
  const errorBranchA = `enrtree-branch:${branchDomainC}`
  const errorBranchB = `enrtree-branch:${branchDomainD}`

  td.when(mockDns.resolve(host, 'TXT')).thenReturn([[mockData.enrRoot]])

  it('retrieves a single peer', async () => {
    td.when(mockDns.resolve(`${rootDomain}.${host}`, 'TXT')).thenReturn([[singleBranch]])
    td.when(mockDns.resolve(`${branchDomainA}.${host}`, 'TXT')).thenReturn([[mockData.enrA]])

    initializeDns()
    const peers = await dns.getPeers(1, [mockData.enrTree])

    assert.equal(peers.length, 1, 'returns single peer')
    assert.equal(peers[0].address, '45.77.40.127', 'peer has correct address')
    assert.equal(peers[0].tcpPort, 30303, 'peer has correct port')
  })

  it('retrieves all peers (2) when maxQuantity larger than DNS tree size', async () => {
    td.when(mockDns.resolve(`${rootDomain}.${host}`, 'TXT')).thenReturn([[doubleBranch]])
    td.when(mockDns.resolve(`${branchDomainA}.${host}`, 'TXT')).thenReturn([[mockData.enrA]])
    td.when(mockDns.resolve(`${branchDomainB}.${host}`, 'TXT')).thenReturn([[mockData.enrB]])

    initializeDns()
    const peers = await dns.getPeers(50, [mockData.enrTree])

    assert.equal(peers.length, 2, 'returns two peers')
    assert.ok(peers[0].address !== peers[1].address, 'peer addresses are different')
  })

  it('retrieves all peers (3) when branch entries are composed of multiple strings', async () => {
    td.when(mockDns.resolve(`${rootDomain}.${host}`, 'TXT')).thenReturn([multiComponentBranch])
    td.when(mockDns.resolve(`${branchDomainA}.${host}`, 'TXT')).thenReturn([[mockData.enr]])
    td.when(mockDns.resolve(`${branchDomainB}.${host}`, 'TXT')).thenReturn([[mockData.enrA]])
    td.when(mockDns.resolve(`${partialBranchA}${partialBranchB}.${host}`, 'TXT')).thenReturn([
      [mockData.enrB],
    ])

    initializeDns()
    const peers = await dns.getPeers(50, [mockData.enrTree])

    assert.equal(peers.length, 3, 'returns three peers')
    assert.ok(peers[0].address !== peers[1].address, 'peer 0 is not peer 1')
    assert.ok(peers[0].address !== peers[2].address, 'peer 0 is not peer 2')
    assert.ok(peers[1].address !== peers[2].address, 'peer 1 is not peer 2')
  })

  it('it tolerates circular branch references', async () => {
    // root --> branchA
    // branchA --> branchA
    td.when(mockDns.resolve(`${rootDomain}.${host}`, 'TXT')).thenReturn([[singleBranch]])
    td.when(mockDns.resolve(`${branchDomainA}.${host}`, 'TXT')).thenReturn([[singleBranch]])

    initializeDns()
    const peers = await dns.getPeers(1, [mockData.enrTree])
    assert.equal(peers.length, 0, 'method resolves (zero peers)')
  })

  it('recovers when dns.resolve returns empty', async () => {
    td.when(mockDns.resolve(`${rootDomain}.${host}`, 'TXT')).thenReturn([[singleBranch]])

    // Empty response case
    td.when(mockDns.resolve(`${branchDomainA}.${host}`, 'TXT')).thenReturn([])

    initializeDns()
    let peers = await dns.getPeers(1, [mockData.enrTree])
    assert.equal(peers.length, 0, 'method resolves when dns response is [] (zero peers)')

    // No TXT records case
    td.when(mockDns.resolve(`${branchDomainA}.${host}`, 'TXT')).thenReturn([[]])

    peers = await dns.getPeers(1, [mockData.enrTree])
    assert.equal(peers.length, 0, 'method resolves when dns response is [[]] (zero peers)')
  })

  it('ignores domain fetching errors', async () => {
    td.when(mockDns.resolve(`${rootDomain}.${host}`, 'TXT')).thenReturn([[errorBranchA]])
    td.when(mockDns.resolve(`${branchDomainC}.${host}`, 'TXT')).thenThrow(new Error('failure'))

    initializeDns()
    const peers = await dns.getPeers(1, [mockData.enrTree])
    assert.equal(peers.length, 0, 'method resolves (zero peers)')
  })

  it('ignores unrecognized TXT record formats', async () => {
    td.when(mockDns.resolve(`${rootDomain}.${host}`, 'TXT')).thenReturn([
      [mockData.enrBranchBadPrefix],
    ])

    initializeDns()
    const peers = await dns.getPeers(1, [mockData.enrTree])
    assert.equal(peers.length, 0, 'method resolves (zero peers)')
  })

  it('caches peers it previously fetched', async () => {
    td.when(mockDns.resolve(`${rootDomain}.${host}`, 'TXT')).thenReturn([[errorBranchB]])
    td.when(mockDns.resolve(`${branchDomainD}.${host}`, 'TXT')).thenReturn([[mockData.enrA]])

    // Run initial fetch...
    initializeDns()
    const peersA = await dns.getPeers(1, [mockData.enrTree])
    assert.equal(peersA.length, 1, 'returns a  network fetched peer')

    // Specify that a subsequent network call retrieving the same peer should throw.
    // This test passes only if the peer is fetched from cache
    td.when(mockDns.resolve(`${branchDomainD}.${host}`, 'TXT')).thenThrow(new Error('failure'))

    const peersB = await dns.getPeers(1, [mockData.enrTree])
    assert.equal(peersB.length, 1, 'returns a cached peer')
    assert.equal(peersA[0].address, peersB[0].address, 'network fetched and cached peers are same')
  })

  it('should reset td', () => {
    td.reset()
  })
})

describe('DNS: (integration)', () => {
  const publicKey = 'AKA3AM6LPBYEUDMVNU3BSVQJ5AD45Y7YPOHJLEF6W26QOE4VTUDPE'
  const goerliDNS = 'all.goerli.ethdisco.net'
  const enrTree = `enrtree://${publicKey}@${goerliDNS}`
  const ipTestRegex = /^\d+\.\d+\.\d+\.\d+$/ // e.g 123.44.55.77

  it('should retrieve 5 PeerInfos for goerli', async () => {
    // Google's dns server address. Needs to be set explicitly to run in CI
    const dns = new DNS({ dnsServerAddress: '8.8.8.8' })
    const peers = await dns.getPeers(5, [enrTree])

    assert.equal(peers.length, 5, 'returns 5 peers')

    const seen: string[] = []
    for (const peer of peers) {
      assert.ok(peer!.address!.match(ipTestRegex), 'address is a valid ip')
      assert.ok(!seen.includes(peer!.address as string), 'peer is not duplicate')
      seen.push(peer!.address as string)
    }
  })
})
