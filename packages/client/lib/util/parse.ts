import { URL } from 'url'
import { Multiaddr, multiaddr } from 'multiaddr'
import { BlockHeader } from '@ethereumjs/block'
import Common, { Hardfork } from '@ethereumjs/common'
import { SecureTrie as Trie } from 'merkle-patricia-tree'
import {
  Account,
  BN,
  keccak,
  toBuffer,
  unpadBuffer,
  isHexPrefixed,
  stripHexPrefix,
  bnToHex,
  bufferToHex,
  addHexPrefix,
} from 'ethereumjs-util'
import RLP from 'rlp'
import type { MultiaddrLike } from '../types'
import type { GenesisState } from '@ethereumjs/common/dist/types'

/**
 * Parses multiaddrs and bootnodes to multiaddr format.
 * @param input comma separated string
 */
export function parseMultiaddrs(input: MultiaddrLike): Multiaddr[] {
  if (!input) {
    return []
  }
  if (!Array.isArray(input) && typeof input === 'object') {
    return [input] as Multiaddr[]
  }
  if (!Array.isArray(input)) {
    input = input.split(',')
  }
  try {
    return (input as string[]).map((s) => {
      if (Multiaddr.isMultiaddr(s)) {
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
  } catch (e: any) {
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

/**
 * Returns initialized storage trie
 * @param storage - Object containing storage trie entries from geth genesis state
 * @returns genesis storage trie
 */
async function createStorageTrie(storage: any) {
  const trie = new Trie()
  for (const [address, value] of Object.entries(storage) as unknown as [string, string]) {
    const key = isHexPrefixed(address) ? toBuffer(address) : Buffer.from(address, 'hex')
    const val = Buffer.from(
      RLP.encode(
        Uint8Array.from(
          unpadBuffer(isHexPrefixed(value) ? toBuffer(value) : Buffer.from(value, 'hex'))
        )
      )
    )
    await trie.put(key, val)
  }
  return trie
}

/**
 * Derives state trie of genesis block bases on genesis allocations
 * @param alloc - Object containing genesis allocations from geth genesis block
 * @returns genesis state trie
 */
async function createGethGenesisStateTrie(alloc: any) {
  const trie = new Trie()
  for (const [key, value] of Object.entries(alloc)) {
    const address = isHexPrefixed(key) ? toBuffer(key) : Buffer.from(key, 'hex')
    const { balance, code, storage } = value as any
    const account = new Account()
    if (balance) {
      account.balance = new BN(isHexPrefixed(balance) ? toBuffer(balance) : balance)
    }
    if (code) {
      account.codeHash = keccak(toBuffer(code))
    }
    if (storage) {
      const storageTrie = await createStorageTrie(storage)
      account.stateRoot = storageTrie.root
    }
    await trie.put(address, account.serialize())
  }
  return trie
}

async function createGethGenesisBlockHeader(json: any) {
  const {
    gasLimit,
    difficulty,
    extraData,
    number,
    nonce,
    timestamp,
    mixHash,
    alloc,
    baseFeePerGas,
  } = json
  const storageTrie = await createGethGenesisStateTrie(alloc)
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
    baseFeePerGas,
  }
  let common
  if (baseFeePerGas !== undefined && baseFeePerGas !== null) {
    // chainId is not important here, we just need London enabled to set baseFeePerGas
    common = new Common({ chain: 1, hardfork: Hardfork.London })
  }
  return BlockHeader.fromHeaderData(headerData, { common })
}

/**
 * Converts Geth genesis parameters to an EthereumJS compatible `CommonOpts` object
 * @param json object representing the Geth genesis file
 * @returns genesis parameters in a `CommonOpts` compliant object
 */
async function parseGethParams(json: any) {
  const { name, config, difficulty, nonce, mixHash, coinbase } = json

  let { gasLimit, extraData, baseFeePerGas, timestamp } = json

  // geth stores gasLimit as a hex string while our gasLimit is a `number`
  json['gasLimit'] = gasLimit = parseInt(gasLimit)
  // geth assumes an initial base fee value on londonBlock=0
  json['baseFeePerGas'] = baseFeePerGas =
    baseFeePerGas === undefined && config.londonBlock === 0 ? 1000000000 : undefined
  // geth is not strictly putting in empty fields with a 0x prefix
  json['extraData'] = extraData = extraData === '' ? '0x' : extraData
  // geth may use number for timestamp
  json['timestamp'] = timestamp = isHexPrefixed(timestamp) ? timestamp : bnToHex(new BN(timestamp))

  // EIP155 and EIP158 are both part of Spurious Dragon hardfork and must occur at the same time
  // but have different configuration parameters in geth genesis parameters
  if (config.eip155Block !== config.eip158Block) {
    throw new Error(
      'EIP155 block number must equal EIP 158 block number since both are part of SpuriousDragon hardfork and the client only supports activating the full hardfork'
    )
  }

  const { chainId } = config
  const header = await createGethGenesisBlockHeader(json)
  const { stateRoot } = header
  const hash = bufferToHex(header.hash())
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
      stateRoot: bufferToHex(stateRoot),
      baseFeePerGas,
    },
    bootstrapNodes: [],
    consensus: config.clique
      ? {
          type: 'poa',
          algorithm: 'clique',
          clique: {
            period: config.clique.period,
            epoch: config.clique.epoch,
          },
        }
      : {
          type: 'pow',
          algorithm: 'ethash',
          ethash: {},
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
  params.hardforks = hardforks
    .map((name) => ({
      name,
      block: name === 'chainstart' ? 0 : config[forkMap[name]] ?? null,
    }))
    .filter((fork) => fork.block !== null)
  if (config.terminalTotalDifficulty !== undefined) {
    params.hardforks.push({ name: 'merge', td: config.terminalTotalDifficulty, block: null })
  }
  return params
}

/**
 * Transforms Geth formatted nonce (i.e. hex string) to 8 byte hex prefixed string used internally
 * @param nonce as a string parsed from the Geth genesis file
 * @returns nonce as a hex-prefixed 8 byte string
 */
function formatNonce(nonce: string): string {
  if (nonce === undefined || nonce === '0x0') {
    return '0x0000000000000000'
  }
  if (isHexPrefixed(nonce)) {
    return '0x' + stripHexPrefix(nonce).padStart(16, '0')
  }
  return '0x' + nonce.padStart(16, '0')
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
  } catch (e: any) {
    throw new Error(`Error parsing parameters file: ${e.message}`)
  }
}

/**
 * Parses the geth genesis state into Common {@link GenesisState}
 * @param json representing the `alloc` key in a Geth genesis file
 */
export async function parseGenesisState(json: any) {
  const state: GenesisState = {}
  for (let address of Object.keys(json.alloc)) {
    let { balance, code, storage } = json.alloc[address]
    address = addHexPrefix(address)
    balance = isHexPrefixed(balance) ? balance : bnToHex(new BN(balance))
    code = code ? addHexPrefix(code) : undefined
    storage = storage ? Object.entries(storage) : undefined
    state[address] = [balance, code, storage] as any
  }
  return state
}

/**
 * Returns Buffer from input hexadeicmal string or Buffer
 * @param input hexadecimal string or Buffer
 */
export function parseKey(input: string | Buffer) {
  if (Buffer.isBuffer(input)) {
    return input
  }
  return Buffer.from(input, 'hex')
}
