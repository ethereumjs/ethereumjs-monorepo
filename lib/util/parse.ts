
const Account = require('ethereumjs-account').default
const Block = require('ethereumjs-block')
const Trie = require('merkle-patricia-tree/secure')
const util = require('ethereumjs-util')
const url = require('url')
const path = require('path')

function toBuffer (string: string) {
  return Buffer.from(util.stripHexPrefix(string), 'hex')
}

function parseBootnodes (string: string) {
  if (!string) {
    return
  }
  try {
    return string.split(',').map(s => {
      const match = s.match(/^(\d+\.\d+\.\d+\.\d+):([0-9]+)$/)
      if (match) {
        return { ip: match[1], port: match[2] }
      }
      const { auth: id, hostname: ip, port } = url.parse(s)
      return { id, ip, port }
    })
  } catch (e) {
    throw new Error(`Invalid bootnode URLs: ${e.message}`)
  }
}

function parseTransports (transports: any[]) {
  return transports.map(t => {
    const options: any = {}
    const [ name, ...pairs ] = t.split(':')
    if (pairs.length) {
      pairs.join(':').split(',').forEach((p: any) => {
        const [ key, value ] = p.split('=')
        options[key] = value
      })
    }
    return { name, options }
  })
}

async function parseStorage (storage: any) {
  const trie = new Trie()
  const promises = []
  for (let [address, value] of Object.entries(storage)) {
    value = util.rlp.encode(util.unpadBuffer(toBuffer(value as string)))
    promises.push(new Promise((resolve, reject) => {
      trie.put(toBuffer(address), value, (err: Error) => {
        if (err) return reject(err)
        resolve()
      })
    }))
  }
  await Promise.all(promises)
  return trie
}

async function parseGethState (alloc: any) {
  const trie = new Trie()
  const promises = []
  for (let [key, value] of Object.entries(alloc)) {
    const address = toBuffer(key)
    const account = new Account()
    if ((value as any).balance) {
      account.balance = new util.BN((value as any).balance.slice(2), 16)
    }
    if ((value as any).code) {
      account.codeHash = util.keccak(util.toBuffer((value as any).code))
    }
    if ((value as any).storage) {
      account.stateRoot = (await parseStorage((value as any).storage)).root
    }
    promises.push(new Promise((resolve, reject) => {
      trie.put(address, account.serialize(), (err: Error) => {
        if (err) return reject(err)
        resolve()
      })
    }))
  }
  await Promise.all(promises)
  return trie
}

async function parseGethHeader (json: any) {
  const header = new Block.Header()
  header.gasLimit = json.gasLimit
  header.difficulty = json.difficulty
  header.extraData = json.extraData
  header.number = Buffer.from([])
  header.nonce = json.nonce
  header.timestamp = json.timestamp
  header.mixHash = json.mixHash
  header.stateRoot = (await parseGethState(json.alloc)).root
  return header
}

async function parseGethParams (json: any) {
  const header = await parseGethHeader(json)
  const params: any = {
    name: json.name,
    chainId: json.config.chainId,
    networkId: json.config.chainId,
    genesis: {
      hash: header.hash(),
      timestamp: json.timestamp,
      gasLimit: json.gasLimit,
      difficulty: json.difficulty,
      nonce: json.nonce,
      extraData: json.extraData,
      mixHash: json.mixHash,
      coinbase: json.coinbase,
      stateRoot: header.stateRoot
    },
    bootstrapNodes: []
  }
  const hardforks = [
    'chainstart',
    'homestead',
    'dao',
    'tangerineWhistle',
    'spuriousDragon',
    'byzantium',
    'constantinople',
    'hybridCasper'
  ]
  const forkMap: any = {
    homestead: 'homesteadBlock',
    dao: 'daoForkBlock',
    tangerineWhistle: 'eip150Block',
    spuriousDragon: 'eip155Block',
    byzantium: 'byzantiumBlock'
  }
  params.hardforks = hardforks.map(name => ({
    name: name,
    block: name === 'chainstart' ? 0 : json.config[forkMap[name]] || null
  }))
  return params
}

async function parseParams (jsonFilePath: string) {
  try {
    const json = require(jsonFilePath)
    if (json.config && json.difficulty && json.gasLimit && json.alloc) {
      json.name = json.name || path.parse(jsonFilePath).base
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

exports.bootnodes = parseBootnodes
exports.transports = parseTransports
exports.params = parseParams
