import { URL } from 'url'
import { Multiaddr, multiaddr } from 'multiaddr'
import { BlockHeader } from '@ethereumjs/block'
import Common, { Hardfork } from '@ethereumjs/common'
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
  bnToHex,
  bufferToHex,
  addHexPrefix,
  intToHex,
} from 'ethereumjs-util'
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
  if (Array.isArray(input)) {
    // Comma-separated bootnodes
    if (input.length === 1 && typeof input[0] === 'string' && input[0].includes(',')) {
      input = input[0].split(',')
    }
  } else {
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
    const val = rlp.encode(
      unpadBuffer(isHexPrefixed(value) ? toBuffer(value) : Buffer.from(value, 'hex'))
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
  const { gasLimit, difficulty, extraData, nonce, timestamp, mixHash, alloc, baseFeePerGas } = json
  const storageTrie = await createGethGenesisStateTrie(alloc)
  const stateRoot = storageTrie.root
  const headerData = {
    number: 0,
    gasLimit,
    difficulty,
    extraData,
    nonce,
    timestamp,
    mixHash,
    stateRoot,
    baseFeePerGas,
  }
  let common
  if (json.config.londonBlock === 0) {
    // chainId is not important here, we just want to set
    // hardfork to London for baseFeePerGas support
    const hardforks = new Common({ chain: 1 })
      .hardforks()
      .map((h) => (h.name === Hardfork.London ? { ...h, block: 0 } : h))
    common = Common.custom({ chainId: 1, hardforks })
    common.setHardforkByBlockNumber(0)
  }
  return BlockHeader.fromHeaderData(headerData, { common })
}

/**
 * Transforms Geth formatted nonce (i.e. hex string) to 8 byte 0x-prefixed string used internally
 * @param nonce string parsed from the Geth genesis file
 * @returns nonce as a 0x-prefixed 8 byte string
 */
function formatNonce(nonce: string): string {
  if (!nonce || nonce === '0x0') {
    return '0x0000000000000000'
  }
  if (isHexPrefixed(nonce)) {
    return '0x' + stripHexPrefix(nonce).padStart(16, '0')
  }
  return '0x' + nonce.padStart(16, '0')
}

/**
 * Converts Geth genesis parameters to an EthereumJS compatible `CommonOpts` object
 * @param json object representing the Geth genesis file
 * @returns genesis parameters in a `CommonOpts` compliant object
 */
async function parseGethParams(json: any) {
  const { name, config, difficulty, mixHash, gasLimit, coinbase, baseFeePerGas } = json
  let { extraData, timestamp, nonce } = json
  const { chainId } = config

  // geth is not strictly putting empty fields with a 0x prefix
  if (extraData === '') {
    extraData = '0x'
  }
  // geth may use number for timestamp
  if (!isHexPrefixed(timestamp)) {
    timestamp = intToHex(parseInt(timestamp))
  }
  // geth may not give us a nonce strictly formatted to an 8 byte hex string
  if (nonce.length !== 18) {
    nonce = formatNonce(nonce)
  }

  // EIP155 and EIP158 are both part of Spurious Dragon hardfork and must occur at the same time
  // but have different configuration parameters in geth genesis parameters
  if (config.eip155Block !== config.eip158Block) {
    throw new Error(
      'EIP155 block number must equal EIP 158 block number since both are part of SpuriousDragon hardfork and the client only supports activating the full hardfork'
    )
  }

  const header = await createGethGenesisBlockHeader({ ...json, extraData, timestamp, nonce })
  const params: any = {
    name,
    chainId,
    networkId: chainId,
    genesis: {
      hash: bufferToHex(header.hash()),
      timestamp,
      gasLimit: parseInt(gasLimit), // geth gasLimit and difficulty are hex strings while ours are `number`s
      difficulty: parseInt(difficulty),
      nonce,
      extraData,
      mixHash,
      coinbase,
      stateRoot: bufferToHex(header.stateRoot),
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

  const forkMap: { [key: string]: string } = {
    [Hardfork.Homestead]: 'homesteadBlock',
    [Hardfork.Dao]: 'daoForkBlock',
    [Hardfork.TangerineWhistle]: 'eip150Block',
    [Hardfork.SpuriousDragon]: 'eip155Block',
    [Hardfork.Byzantium]: 'byzantiumBlock',
    [Hardfork.Constantinople]: 'constantinopleBlock',
    [Hardfork.Petersburg]: 'petersburgBlock',
    [Hardfork.Istanbul]: 'istanbulBlock',
    [Hardfork.MuirGlacier]: 'muirGlacierBlock',
    [Hardfork.Berlin]: 'berlinBlock',
    [Hardfork.London]: 'londonBlock',
    [Hardfork.MergeForkIdTransition]: 'mergeForkBlock',
  }
  params.hardforks = Object.values(Hardfork)
    .map((name) => ({
      name,
      block: name === Hardfork.Chainstart ? 0 : config[forkMap[name]] ?? null,
    }))
    .filter((fork) => fork.block !== null)
  if (config.terminalTotalDifficulty !== undefined) {
    params.hardforks.push({
      name: Hardfork.Merge,
      td: config.terminalTotalDifficulty,
      block: null,
    })
  }
  return params
}

/**
 * Parses a genesis.json exported from Geth into parameters for Common instance
 * @param json representing the Geth genesis file
 * @param name optional chain name
 * @returns parsed params
 */
export async function parseCustomParams(json: any, name?: string) {
  try {
    if (['config', 'difficulty', 'gasLimit', 'alloc'].some((field) => !(field in json))) {
      throw new Error('Invalid format, expected geth genesis fields missing')
    }
    if (name) {
      json.name = name
    }
    return parseGethParams(json)
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
