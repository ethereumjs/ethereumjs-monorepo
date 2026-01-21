import { assert, describe, it, vi } from 'vitest'

import { DNS } from '../src/dns/index.ts'

import { devp2pTestData } from '@ethereumjs/testdata'

describe('DNS', () => {
  const mockData = devp2pTestData.dns
  const mockDns = {
    resolve: vi.fn(),
  }

  let dns: DNS
  function initializeDns() {
    dns = new DNS()
    // Using __setNativeDNSModuleResolve to inject the mock dns module
    // This allows us to mock the native `dns` module for testing
    dns.__setNativeDNSModuleResolve(mockDns)
  }

  const host = 'nodes.example.org'
  // cspell:disable
  const rootDomain = 'JORXBYVVM7AEKETX5DGXW44EAY'
  const branchDomainA = 'D2SNLTAGWNQ34NTQTPHNZDECFU'
  const branchDomainB = 'D3SNLTAGWNQ34NTQTPHNZDECFU'
  const branchDomainC = 'D4SNLTAGWNQ34NTQTPHNZDECFU'
  const branchDomainD = 'D5SNLTAGWNQ34NTQTPHNZDECFU'
  const partialBranchA = 'AAAA'
  const partialBranchB = 'BBBB'
  // cspell:enable
  const singleBranch = `enrtree-branch:${branchDomainA}`
  const doubleBranch = `enrtree-branch:${branchDomainA},${branchDomainB}`
  const multiComponentBranch = [
    `enrtree-branch:${branchDomainA},${partialBranchA}`,
    `${partialBranchB},${branchDomainB}`,
  ]

  // Note: once a mock is asked to throw for an input it will always throw.
  // Input can't be re-used for a passing case.
  const errorBranchA = `enrtree-branch:${branchDomainC}`
  const errorBranchB = `enrtree-branch:${branchDomainD}`

  mockDns.resolve.mockReturnValue([[mockData.enrRoot]])

  it('retrieves a single peer', async () => {
    mockDns.resolve.mockImplementation((domain: string) => {
      if (domain === `${rootDomain}.${host}`) return Promise.resolve([[singleBranch]])
      if (domain === `${branchDomainA}.${host}`) return Promise.resolve([[mockData.enrA]])
      return Promise.resolve([[mockData.enrRoot]])
    })

    initializeDns()
    const peers = await dns.getPeers(1, [mockData.enrTree])

    assert.strictEqual(peers.length, 1, 'returns single peer')
    assert.strictEqual(peers[0].address, '45.77.40.127', 'peer has correct address')
    assert.strictEqual(peers[0].tcpPort, 30303, 'peer has correct port')
  })

  it('retrieves all peers (2) when maxQuantity larger than DNS tree size', async () => {
    mockDns.resolve.mockImplementation((domain: string) => {
      if (domain === `${rootDomain}.${host}`) return Promise.resolve([[doubleBranch]])
      if (domain === `${branchDomainA}.${host}`) return Promise.resolve([[mockData.enrA]])
      if (domain === `${branchDomainB}.${host}`) return Promise.resolve([[mockData.enrB]])
      return Promise.resolve([[mockData.enrRoot]])
    })

    initializeDns()
    const peers = await dns.getPeers(50, [mockData.enrTree])

    assert.strictEqual(peers.length, 2, 'returns two peers')
    assert.notEqual(peers[0].address, peers[1].address, 'peer addresses are different')
  })

  it('retrieves all peers (3) when branch entries are composed of multiple strings', async () => {
    mockDns.resolve.mockImplementation((domain: string) => {
      if (domain === `${rootDomain}.${host}`) return Promise.resolve([multiComponentBranch])
      if (domain === `${branchDomainA}.${host}`) return Promise.resolve([[mockData.enr]])
      if (domain === `${branchDomainB}.${host}`) return Promise.resolve([[mockData.enrA]])
      if (domain === `${partialBranchA}${partialBranchB}.${host}`)
        return Promise.resolve([[mockData.enrB]])
      return Promise.resolve([[mockData.enrRoot]])
    })

    initializeDns()
    const peers = await dns.getPeers(50, [mockData.enrTree])

    assert.strictEqual(peers.length, 3, 'returns three peers')
    assert.notEqual(peers[0].address, peers[1].address, 'peer 0 is not peer 1')
    assert.notEqual(peers[0].address, peers[2].address, 'peer 0 is not peer 2')
    assert.notEqual(peers[1].address, peers[2].address, 'peer 1 is not peer 2')
  })

  it('it tolerates circular branch references', async () => {
    // root --> branchA
    // branchA --> branchA
    mockDns.resolve.mockImplementation((domain: string) => {
      if (domain === `${rootDomain}.${host}`) return Promise.resolve([[singleBranch]])
      if (domain === `${branchDomainA}.${host}`) return Promise.resolve([[singleBranch]])
      return Promise.resolve([[mockData.enrRoot]])
    })

    initializeDns()
    const peers = await dns.getPeers(1, [mockData.enrTree])
    assert.strictEqual(peers.length, 0, 'method resolves (zero peers)')
  })

  it('recovers when dns.resolve returns empty', async () => {
    // Empty response case
    mockDns.resolve.mockImplementation((domain: string) => {
      if (domain === `${rootDomain}.${host}`) return Promise.resolve([[singleBranch]])
      if (domain === `${branchDomainA}.${host}`) return Promise.resolve([])
      return Promise.resolve([[mockData.enrRoot]])
    })

    initializeDns()
    let peers = await dns.getPeers(1, [mockData.enrTree])
    assert.strictEqual(peers.length, 0, 'method resolves when dns response is [] (zero peers)')

    // No TXT records case
    mockDns.resolve.mockImplementation((domain: string) => {
      if (domain === `${rootDomain}.${host}`) return Promise.resolve([[singleBranch]])
      if (domain === `${branchDomainA}.${host}`) return Promise.resolve([[]])
      return Promise.resolve([[mockData.enrRoot]])
    })

    peers = await dns.getPeers(1, [mockData.enrTree])
    assert.strictEqual(peers.length, 0, 'method resolves when dns response is [[]] (zero peers)')
  })

  it('ignores domain fetching errors', async () => {
    mockDns.resolve.mockImplementation((domain: string) => {
      if (domain === `${rootDomain}.${host}`) return Promise.resolve([[errorBranchA]])
      if (domain === `${branchDomainC}.${host}`) return Promise.reject(new Error('failure'))
      return Promise.resolve([[mockData.enrRoot]])
    })

    initializeDns()
    const peers = await dns.getPeers(1, [mockData.enrTree])
    assert.strictEqual(peers.length, 0, 'method resolves (zero peers)')
  })

  it('ignores unrecognized TXT record formats', async () => {
    mockDns.resolve.mockImplementation((domain: string) => {
      if (domain === `${rootDomain}.${host}`)
        return Promise.resolve([[mockData.enrBranchBadPrefix]])
      return Promise.resolve([[mockData.enrRoot]])
    })

    initializeDns()
    const peers = await dns.getPeers(1, [mockData.enrTree])
    assert.strictEqual(peers.length, 0, 'method resolves (zero peers)')
  })

  it('caches peers it previously fetched', async () => {
    mockDns.resolve.mockImplementation((domain: string) => {
      if (domain === `${rootDomain}.${host}`) return Promise.resolve([[errorBranchB]])
      if (domain === `${branchDomainD}.${host}`) return Promise.resolve([[mockData.enrA]])
      return Promise.resolve([[mockData.enrRoot]])
    })

    // Run initial fetch...
    initializeDns()
    const peersA = await dns.getPeers(1, [mockData.enrTree])
    assert.strictEqual(peersA.length, 1, 'returns a  network fetched peer')

    // Specify that a subsequent network call retrieving the same peer should throw.
    // This test passes only if the peer is fetched from cache
    mockDns.resolve.mockImplementation((domain: string) => {
      if (domain === `${rootDomain}.${host}`) return Promise.resolve([[errorBranchB]])
      if (domain === `${branchDomainD}.${host}`) return Promise.reject(new Error('failure'))
      return Promise.resolve([[mockData.enrRoot]])
    })

    const peersB = await dns.getPeers(1, [mockData.enrTree])
    assert.strictEqual(peersB.length, 1, 'returns a cached peer')
    assert.strictEqual(
      peersA[0].address,
      peersB[0].address,
      'network fetched and cached peers are same',
    )
  })

  it('should reset mocks', () => {
    vi.clearAllMocks()
  })
})

describe('DNS: (integration)', () => {
  const publicKey = 'AKA3AM6LPBYEUDMVNU3BSVQJ5AD45Y7YPOHJLEF6W26QOE4VTUDPE' // cspell:disable-line
  const goerliDNS = 'all.goerli.ethdisco.net'
  const enrTree = `enrtree://${publicKey}@${goerliDNS}`
  const ipTestRegex = /^\d+\.\d+\.\d+\.\d+$/ // e.g 123.44.55.77

  it('should retrieve 5 PeerInfos for goerli', { timeout: 10000 }, async () => {
    // Google's dns server address. Needs to be set explicitly to run in CI
    const dns = new DNS({ dnsServerAddress: '8.8.8.8' })
    const peers = await dns.getPeers(5, [enrTree])

    assert.strictEqual(peers.length, 5, 'returns 5 peers')

    const seen: string[] = []
    for (const peer of peers) {
      assert.isDefined(peer.address)
      assert.match(peer.address, ipTestRegex, 'address is a valid ip')
      assert.notInclude(seen, peer.address, 'peer is not duplicate')
      seen.push(peer.address)
    }
  })
})
