import { URL } from 'url'
import { Multiaddr, multiaddr } from 'multiaddr'
import { Hardfork } from '@ethereumjs/common'
import {
  addHexPrefix,
  bigIntToHex,
  intToHex,
  isHexPrefixed,
  stripHexPrefix,
} from '@ethereumjs/util'
import type { MultiaddrLike } from '../types'
import type { GenesisState } from '@ethereumjs/blockchain/dist/genesisStates'
import type Common from '@ethereumjs/common'

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

  const params: any = {
    name,
    chainId,
    networkId: chainId,
    genesis: {
      timestamp,
      gasLimit: parseInt(gasLimit), // geth gasLimit and difficulty are hex strings while ours are `number`s
      difficulty: parseInt(difficulty),
      nonce,
      extraData,
      mixHash,
      coinbase,
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
 * Parses the geth genesis state into Blockchain {@link GenesisState}
 * @param json representing the `alloc` key in a Geth genesis file
 */
export async function parseGenesisState(json: any) {
  const state: GenesisState = {}
  for (let address of Object.keys(json.alloc)) {
    let { balance, code, storage } = json.alloc[address]
    address = addHexPrefix(address)
    balance = isHexPrefixed(balance) ? balance : bigIntToHex(BigInt(balance))
    code = code ? addHexPrefix(code) : undefined
    storage = storage ? Object.entries(storage) : undefined
    state[address] = [balance, code, storage] as any
  }
  return state
}

/**
 * Returns Buffer from input hexadecimal string or Buffer
 * @param input hexadecimal string or Buffer
 */
export function parseKey(input: string | Buffer) {
  if (Buffer.isBuffer(input)) {
    return input
  }
  return Buffer.from(input, 'hex')
}

/**
 * Sets any missing forkHashes on the passed-in {@link Common} instance
 * @param common The {@link Common} to set the forkHashes for
 * @param genesisHash The genesis block hash
 */
export function setCommonForkHashes(common: Common, genesisHash: Buffer) {
  for (const hf of (common as any)._chainParams.hardforks) {
    if (!hf.forkHash && hf.block !== undefined && (hf.block !== null || hf.td !== undefined)) {
      hf.forkHash = common.forkHash(hf.name, genesisHash)
    }
  }
}
