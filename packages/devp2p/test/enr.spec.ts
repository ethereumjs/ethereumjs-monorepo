import { assert, describe, it } from 'vitest'

import { ENR } from '../src/dns/index.ts'

import { testData } from './testdata.ts'

const dns = testData.dns

describe('ENR tests', () => {
  // Root DNS entries
  it('ENR (root): should parse and verify and DNS root entry', () => {
    const subdomain = ENR.parseAndVerifyRoot(dns.enrRoot, dns.publicKey)
    assert.strictEqual(subdomain, 'JORXBYVVM7AEKETX5DGXW44EAY', 'returns correct subdomain') // cspell:disable-line
  })

  it('ENR (root): should error if DNS root entry is mis-prefixed', () => {
    try {
      ENR.parseAndVerifyRoot(dns.enrRootBadPrefix, dns.publicKey)
    } catch (e: any) {
      assert.isTrue(
        e.toString().includes("ENR root entry must start with 'enrtree-root:'"),
        'has correct error message',
      )
    }
  })

  it('ENR (root): should error if DNS root entry signature is invalid', () => {
    try {
      ENR.parseAndVerifyRoot(dns.enrRootBadSig, dns.publicKey)
    } catch (e: any) {
      assert.isTrue(
        e.toString().includes('Unable to verify ENR root signature'),
        'has correct error message',
      )
    }
  })

  it('ENR (root): should error if DNS root entry is malformed', () => {
    try {
      ENR.parseAndVerifyRoot(dns.enrRootMalformed, dns.publicKey)
    } catch (e: any) {
      assert.isTrue(
        e.toString().includes("Could not parse 'l' value from ENR root entry"),
        'has correct error message',
      )
    }
  })

  // Tree DNS entries
  it('ENR (tree): should parse a DNS tree entry', () => {
    const { publicKey, domain } = ENR.parseTree(dns.enrTree)

    assert.strictEqual(publicKey, dns.publicKey, 'returns correct public key')
    assert.strictEqual(domain, 'nodes.example.org', 'returns correct url')
  })

  it('ENR (tree): should error if DNS tree entry is mis-prefixed', () => {
    try {
      ENR.parseTree(dns.enrTreeBadPrefix)
    } catch (e: any) {
      assert.isTrue(
        e.toString().includes("ENR tree entry must start with 'enrtree:'"),
        'has correct error message',
      )
    }
  })

  it('ENR (tree): should error if DNS tree entry is misformatted', () => {
    try {
      ENR.parseTree(dns.enrTreeMalformed)
    } catch (e: any) {
      assert.isTrue(
        e.toString().includes('Could not parse domain from ENR tree entry'),
        'has correct error message',
      )
    }
  })

  // Branch entries
  it('ENR (branch): should parse and verify a single component DNS branch entry', () => {
    const expected = [
      // cspell:disable
      'D2SNLTAGWNQ34NTQTPHNZDECFU',
      '67BLTJEU5R2D5S3B4QKJSBRFCY',
      'A2HDMZBB4JIU53VTEGC4TG6P4A',
      // cspell:enable
    ]

    const branches = ENR.parseBranch(dns.enrBranch)
    assert.deepEqual(branches, expected, 'returns array of subdomains')
  })

  it('ENR (branch): should error if DNS branch entry is mis-prefixed', () => {
    try {
      ENR.parseBranch(dns.enrBranchBadPrefix)
    } catch (e: any) {
      assert.isTrue(
        e.toString().includes("ENR branch entry must start with 'enrtree-branch:'"),
        'has correct error message',
      )
    }
  })

  // ENR DNS entries
  it('ENR (enr): should convert an Ethereum Name Record string', () => {
    const { address, tcpPort, udpPort } = ENR.parseAndVerifyRecord(dns.enr)
    assert.strictEqual(address, '40.113.111.135', 'returns correct address')
    assert.strictEqual(tcpPort, 30303, 'returns correct tcpPort')
    assert.strictEqual(udpPort, 30303, 'returns correct udpPort')
  })

  it('ENR (enr): should convert non-padded Ethereum Name Record string', () => {
    const { address, tcpPort, udpPort } = ENR.parseAndVerifyRecord(dns.enrUnpadded)

    assert.strictEqual(address, '64.227.79.242', 'returns correct address')
    assert.strictEqual(tcpPort, 30303, 'returns correct tcpPort')
    assert.strictEqual(udpPort, 30303, 'returns correct udpPort')
  })

  it('ENR (enr): should error if record mis-prefixed', () => {
    try {
      ENR.parseAndVerifyRecord(dns.enrBadPrefix)
    } catch (e: any) {
      assert.isTrue(
        e.toString().includes("String encoded ENR must start with 'enr:'"),
        'has correct error message',
      )
    }
  })
})
