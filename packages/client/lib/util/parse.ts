import { parse } from 'url'
import { BlockHeader } from '@ethereumjs/block'
import { SecureTrie as Trie } from 'merkle-patricia-tree'
import { Account, BN, keccak, rlp, toBuffer, unpadBuffer, isHexPrefixed } from 'ethereumjs-util'
import { Bootnode, BootnodeLike, Multiaddrs, MultiaddrsLike } from '../types'

export function parseBootnodes(input: BootnodeLike): Bootnode[] {
  if (!input) {
    return []
  }
  if (!Array.isArray(input) && typeof input === 'object') {
    return [input] as Bootnode[]
  }
  if (Array.isArray(input) && typeof input[0] === 'object') {
    return input as Bootnode[]
  }
  if (!Array.isArray(input)) {
    input = input.split(',')
  }
  try {
    return (input as string[]).map((s: string) => {
      const match = s.match(/^(\d+\.\d+\.\d+\.\d+):([0-9]+)$/)
      if (match) {
        return { ip: match[1], port: Number(match[2]) }
      }
      const { auth: id, hostname: ip, port } = parse(s)
      return { id, ip, port: Number(port) }
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

async function parseGethParams(json: any) {
  const {
    name,
    config,
    timestamp,
    gasLimit,
    difficulty,
    nonce,
    extraData,
    mixHash,
    coinbase,
  } = json
  const { chainId } = config
  const header = await parseGethHeader(json)
  const { stateRoot } = header
  const hash = header.hash()
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
      stateRoot,
    },
    bootstrapNodes: [],
  }
  const hardforks = [
    'chainstart',
    'homestead',
    'dao',
    'tangerineWhistle',
    'spuriousDragon',
    'byzantium',
    'constantinople',
    'hybridCasper',
  ]
  const forkMap: { [key: string]: string } = {
    homestead: 'homesteadBlock',
    dao: 'daoForkBlock',
    tangerineWhistle: 'eip150Block',
    spuriousDragon: 'eip155Block',
    byzantium: 'byzantiumBlock',
  }
  params.hardforks = hardforks.map((name) => ({
    name: name,
    block: name === 'chainstart' ? 0 : config[forkMap[name]] ?? null,
  }))
  return params
}

export async function parseParams(json: any, name?: string) {
  try {
    if (json.config && json.difficulty && json.gasLimit && json.alloc) {
      json.name = json.name || name
      if (json.nonce === undefined || json.nonce === '0x0') {
        json.nonce = '0x0000000000000000'
      }
      return parseGethParams(json)
    } else {
      throw new Error('Invalid format')
    }
  } catch (e) {
    throw new Error(`Error parsing parameters file: ${e.message}`)
  }
}

export function parseMultiaddrs(input: MultiaddrsLike): Multiaddrs {
  if (typeof input === 'string') {
    input = input.split(',')
  }
  return input
}

export function parseKey(input: string | Buffer) {
  if (Buffer.isBuffer(input)) {
    return input
  }
  return Buffer.from(input, 'hex')
}
