import { URL } from 'url'
import multiaddr from 'multiaddr'
import { BlockHeader } from '@ethereumjs/block'
import { SecureTrie as Trie } from 'merkle-patricia-tree'
import {
  Account,
  BN,
  keccak,
  rlp,
  toBuffer,
  unpadBuffer,
  isHexPrefixed,
  stripHexPrefix,
  intToBuffer,
} from 'ethereumjs-util'
import { MultiaddrLike } from '../types'
import { GenesisState, Hardfork } from '@ethereumjs/common/dist/types'
import { buf as crc32Buffer } from 'crc-32'

/**
 * Parses multiaddrs and bootnodes to multiaddr format.
 */
export function parseMultiaddrs(input: MultiaddrLike): multiaddr[] {
  if (!input) {
    return []
  }
  if (!Array.isArray(input) && typeof input === 'object') {
    return [input] as multiaddr[]
  }
  if (!Array.isArray(input)) {
    input = input.split(',')
  }
  try {
    return (input as string[]).map((s) => {
      if (multiaddr.isMultiaddr(s)) {
        return s
      }
      // parse as multiaddr
      if (s[0] === '/') {
        return multiaddr(s)
      }
      // parse as object
      if (typeof s === 'object') {
        const { ip, port } = s as any
        if (ip && port) {
          return multiaddr(`/ip4/${ip}/tcp/${port}`)
        }
      }
      // parse as ip:port
      const match = s.match(/^(\d+\.\d+\.\d+\.\d+):([0-9]+)$/)
      if (match) {
        const [_, ip, port] = match
        return multiaddr(`/ip4/${ip}/tcp/${port}`)
      }
      // parse using WHATWG URL API
      const { hostname: ip, port } = new URL(s)
      if (ip && port) {
        return multiaddr(`/ip4/${ip}/tcp/${port}`)
      }
      throw new Error(`Unable to parse bootnode URL: ${s}`)
    })
  } catch (e) {
    throw new Error(`Invalid bootnode URLs: ${e.message}`)
  }
}

export function parseTransports(transports: string[]) {
  return transports.map((t) => {
    const options: { [key: string]: string } = {}
    const [name, ...pairs] = t.split(':')
    if (pairs.length) {
      pairs
        .join(':')
        .split(',')
        .forEach((p: string) => {
          const [key, value] = p.split('=')
          options[key] = value
        })
    }
    return { name, options }
  })
}

async function parseStorage(storage: any) {
  const trie = new Trie()
  for (const [address, value] of Object.entries(storage)) {
    const key = Buffer.from(address, 'hex')
    const val = rlp.encode(unpadBuffer(Buffer.from(value as string, 'hex')))
    await trie.put(key, val)
  }
  return trie
}
/**
 * Derives storage trie of genesis block bases on genesis allocations
 * @param alloc - Object containing genesis allocations from geth genesis block
 *
 * @returns genesis block storage trie
 */
//
async function parseGethState(alloc: any) {
  const trie = new Trie()
  for (const [key, value] of Object.entries(alloc)) {
    const address = isHexPrefixed(key) ? toBuffer(key) : Buffer.from(key, 'hex')
    const { balance, code, storage } = value as any
    const account = new Account()
    if (balance) {
      // note: balance is a Buffer
      account.balance = new BN(toBuffer(balance))
    }
    if (code) {
      account.codeHash = keccak(toBuffer(code))
    }
    if (storage) {
      const storageTrie = await parseStorage(storage)
      account.stateRoot = storageTrie.root
    }
    await trie.put(address, account.serialize())
  }
  return trie
}

async function parseGethHeader(json: any) {
  const { gasLimit, difficulty, extraData, number, nonce, timestamp, mixHash, alloc } = json
  const storageTrie = await parseGethState(alloc)
  const stateRoot = storageTrie.root
  const headerData = {
    gasLimit,
    difficulty,
    extraData,
    number,
    nonce,
    timestamp,
    mixHash,
    stateRoot,
  }
  return BlockHeader.fromHeaderData(headerData) // TODO: Pass in common?
}

/**
 * Converts Geth genesis parameters to an EthereumJS compatible `CommonOpts` object
 * @param json object representing the Geth genesis file
 * @returns genesis parameters in a `CommonOpts` compliant object
 */
async function parseGethParams(json: any) {
  const { name, config, timestamp, gasLimit, difficulty, nonce, extraData, mixHash, coinbase } =
    json
  const { chainId } = config
  const header = await parseGethHeader(json)
  const { stateRoot } = header
  const hash = '0x' + header.hash().toString('hex')
  const params: any = {
    name,
    chainId,
    networkId: chainId,
    genesis: {
      hash,
      timestamp,
      gasLimit,
      difficulty,
      nonce,
      extraData,
      mixHash,
      coinbase,
      stateRoot: '0x' + stateRoot.toString('hex'),
    },
    bootstrapNodes: [],
    consensus: config.ethash
      ? {
          type: 'pow',
          algorithm: 'ethash',
          ethash: {},
        }
      : {
          type: 'poa',
          algorithm: 'clique',
          clique: {
            period: config.clique.period,
            epoch: config.clique.epoch,
          },
        },
  }
  const hardforks = [
    'chainstart',
    'homestead',
    'dao',
    'tangerineWhistle',
    'spuriousDragon',
    'byzantium',
    'constantinople',
    'petersburg',
    'istanbul',
    'muirGlacier',
    'berlin',
    'london',
  ]
  const forkMap: { [key: string]: string } = {
    homestead: 'homesteadBlock',
    dao: 'daoForkBlock',
    tangerineWhistle: 'eip150Block',
    spuriousDragon: 'eip155Block',
    byzantium: 'byzantiumBlock',
    constantinople: 'constantinopleBlock',
    petersburg: 'petersburgBlock',
    istanbul: 'istanbulBlock',
    muirGlacier: 'muirGlacierBlock',
    berlin: 'berlinBlock',
    london: 'londonBlock',
  }
  params.hardforks = hardforks.map((name) => ({
    name: name,
    block: name === 'chainstart' ? 0 : config[forkMap[name]] ?? null,
  }))

  for (const hf of params.hardforks) {
    hf.forkHash = calcForkHash(hf.name, hash, params.hardforks)
  }
  return params
}
/**
 * Transforms Geth formatted nonce (i.e. hex string) to 8 byte hex prefixed string used internally
 *
 * @param nonce as a string parsed from the Geth genesis file
 * @returns nonce as a hex-prefixed 8 byte string
 */

function formatNonce(nonce: string): string {
  let formattedNonce = '0x0000000000000000'
  if (nonce === undefined || nonce === '0x0') {
    return formattedNonce
  } else if (isHexPrefixed(nonce)) {
    formattedNonce = stripHexPrefix(nonce)
    while (formattedNonce.length < 16) {
      formattedNonce = '0' + formattedNonce
    }
    formattedNonce = '0x' + formattedNonce
  }
  return formattedNonce
}

/**
 * Parses a genesis.json exported from Geth into parameters for Common instance
 * @param json representing the Geth genesis file
 * @param name optional chain name
 * @returns
 */

export async function parseCustomParams(json: any, name?: string) {
  try {
    if (json.config && json.difficulty && json.gasLimit && json.alloc) {
      json.name = name
      json.nonce = formatNonce(json.nonce)
      return parseGethParams(json)
    } else {
      throw new Error('Invalid format')
    }
  } catch (e) {
    throw new Error(`Error parsing parameters file: ${e.message}`)
  }
}

/**
 * Parses the geth genesis state into a `Common.GenesisState`
 * @param json representing the `alloc` key in a Geth genesis file
 * @returns a `GenesisState` compatible object
 */
//
export async function parseGenesisState(json: any) {
  const genesisState: GenesisState = {}
  if (json.alloc) {
    Object.keys(json.alloc).forEach((address: string) => {
      const genesisAddress = isHexPrefixed(address) ? address : '0x' + address
      genesisState[genesisAddress] = json.alloc[address].balance
    })
  }
  return genesisState
}

export function parseKey(input: string | Buffer) {
  if (Buffer.isBuffer(input)) {
    return input
  }
  return Buffer.from(input, 'hex')
}

function calcForkHash(hardfork: string, hash: string, hardforks: Hardfork[]) {
  const genesis = Buffer.from(hash.substr(2), 'hex')

  let hfBuffer = Buffer.alloc(0)
  let prevBlock = 0
  for (const hf of hardforks) {
    const block = hf.block

    // Skip for chainstart (0), not applied HFs (null) and
    // when already applied on same block number HFs
    if (block !== 0 && block !== null && block !== prevBlock) {
      const hfBlockBuffer = Buffer.from(block.toString(16).padStart(16, '0'), 'hex')
      hfBuffer = Buffer.concat([hfBuffer, hfBlockBuffer])
    }

    if (hf.name === hardfork) break
    prevBlock = block ?? prevBlock
  }
  const inputBuffer = Buffer.concat([genesis, hfBuffer])

  // CRC32 delivers result as signed (negative) 32-bit integer,
  // convert to hex string
  const forkhash = intToBuffer(crc32Buffer(inputBuffer) >>> 0).toString('hex')
  return `0x${forkhash}`
}
