import * as fs from 'fs'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { keccak256 as keccak_256WASM } from '@polkadot/wasm-crypto'
import { assert, describe, it } from 'vitest'

import { generateClientConfig } from '../../bin/utils.ts'

import type { ClientOpts } from '../../src/types.ts'

describe('generateClientConfig', () => {
  it('should use chainId over networkId and network name', async () => {
    const opts: ClientOpts = {
      chainId: 11155111,
      networkId: 1,
      network: 'mainnet',
    }
    const { common } = await generateClientConfig(opts)
    assert.strictEqual(common.chainId(), 11155111n)
  })

  it('should fall back to networkId if chainId is not provided', async () => {
    const opts: ClientOpts = {
      networkId: 11155111,
      network: 'mainnet',
    }
    const { common } = await generateClientConfig(opts)
    assert.strictEqual(common.chainId(), 11155111n)
  })

  it('should fall back to network name if both chainId and networkId are missing', async () => {
    const opts: ClientOpts = {
      network: 'sepolia',
    }
    const { common } = await generateClientConfig(opts)
    assert.strictEqual(common.chainName(), 'sepolia')
  })

  it('should initialize WASM crypto when useJsCrypto is false', async () => {
    const opts: ClientOpts = {
      useJsCrypto: false,
    }
    const { common } = await generateClientConfig(opts)
    assert.deepEqual(
      common.customCrypto.keccak256,
      keccak_256WASM,
      'WASM keccak_256 should be initialized',
    )
  })

  it('should initialize JS crypto when useJsCrypto is true', async () => {
    const opts: ClientOpts = {
      useJsCrypto: true,
    }
    const { common } = await generateClientConfig(opts)
    assert.deepEqual(
      common.customCrypto.keccak256,
      keccak_256,
      'JS keccak_256 should be initialized',
    )
  })

  it('should set bootnodes correctly from a file', async () => {
    const dir = fs.mkdtempSync('test-bootnodes')
    const gethGenesis = `enode://97b85ed04d84f2298f61926eef7ec74a7fff3998f71da1d7eab8c136d8719829150edc2f605b6a741fe6c56af0aa957b0375c38553fd0d0f91c5fa752844c08f@172.16.0.10:30303\nenode://7b58fb9d4fd1bef6fe89b517c4443043294d2650af2bea4c3f7c7f7f1caa40e9c8b22d05d46a77b97867b8d2808c4db351c921a072366a7227ae59a620f6ae39@172.16.0.11:30303\nenode://0257b53da52fa0c141d558d0fc439ea4c338904a762802633daa89fd5770e0cbe306a9e82cc059c4e4293502d5d431e1fa7165f3611840c1bb948d48a7e70b5b@172.16.0.12:30303\nenode://d516e6b38bb8c656bf120fb49d66318952911dcb61e5e950360b7d3ea4ac575228e73cddb7a08a308c6e3f541e284553598f7f5ee3c6c5fe140af350d482aff7@172.16.0.13:30303\nenode://a95a3c8712ff2f09af6a08523164361784fd7ed89e5a68b4f064b3c48fde73646f63296bab822a2133f1cbc73d9aa9726b9374f03ca66b7cbb721779cc6f5a87@172.16.0.14:30303`
    fs.open(`${dir}/bootnodes.txt`, 'w', (err, fd) => {
      if (err !== null) throw err
      fs.write(fd, gethGenesis, (writeErr) => {
        if (writeErr !== null) {
          assert.fail(`Error writing the file: ${writeErr.message}`)
        } else {
          assert.isTrue(true, 'File created and data written successfully!')
        }

        fs.close(fd, (closeErr) => {
          if (closeErr) {
            assert.fail(`Error closing the file:, ${closeErr.message}`)
          }
        })
      })
    })
    const opts: ClientOpts = {
      bootnodes: [`./${dir}/bootnodes.txt`],
    }
    const { config } = await generateClientConfig(opts)
    assert.isArray(config.bootnodes, 'Bootnodes should be an array')
  })

  it('should require an unlocked account when mining', async () => {
    const opts: ClientOpts = {
      mine: true,
    }
    try {
      await generateClientConfig(opts)
      assert.fail('Expected generateClientConfig to throw error when mining without an account')
    } catch (err: any) {
      assert.match(err.message, /Please provide an account to mine blocks/)
    }
  })

  it('should enable mining when mine=true', async () => {
    const opts: ClientOpts = {
      mine: true,
      dev: true,
    }
    const { config } = await generateClientConfig(opts)
    assert.isTrue(config.mine, 'Mining should be enabled')
  })

  it('should properly configure Prometheus when enabled', async () => {
    const opts: ClientOpts = {
      prometheus: true,
      prometheusPort: 9090,
    }
    const { metricsServer } = await generateClientConfig(opts)
    assert.isDefined(
      metricsServer,
      'Prometheus should be enabled and metrics server should be started',
    )
  })

  it('should correctly handle dev mode initialization', async () => {
    const opts: ClientOpts = {
      dev: true,
      dataDir: './test-data',
    }
    const { config } = await generateClientConfig(opts)
    assert.isTrue(config.mine, 'Mining should be enabled in dev mode')
    assert.isTrue(config.isSingleNode, 'Single node mode should be enabled')
  })

  it('should properly set logging options', async () => {
    const opts: ClientOpts = {
      logLevel: 'debug',
    }
    const { config } = await generateClientConfig(opts)
    assert.strictEqual(config.logger?.level, 'debug', 'Log level should be set to debug')
  })
})
