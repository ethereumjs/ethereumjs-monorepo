import { SecureTrie as Trie } from 'merkle-patricia-tree'
import { BlockHeader } from '../../block/src/index'
import { Account, BN, keccak, rlp, toBuffer, unpadBuffer, isHexPrefixed, stripHexPrefix } from 'ethereumjs-util'
import fs from 'fs'

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
      stateRoot: stateRoot.toString('hex'),
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
    'petersburg',
    'istanbul',
    'muirGlacier',
    'berlin',
    'london'
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
    london: 'londonBlock'
  }
  params.hardforks = hardforks.map((name) => ({
    name: name,
    block: name === 'chainstart' ? 0 : config[forkMap[name]] ?? null,
  }))
  return params
}

function formatNonce(nonce: string): string {
  let formattedNonce = '0x0000000000000000'
  if (nonce === undefined || nonce === '0x0') {
    return formattedNonce
  }
  else if (isHexPrefixed(nonce)) {
    formattedNonce = stripHexPrefix(nonce)
    while (formattedNonce.length < 16) {
      formattedNonce = '0' + formattedNonce
    }
    formattedNonce = '0x' + formattedNonce 
  }
  return formattedNonce
}
async function parseParams(json: any, name?: string) {
  try {
    if (json.config && json.difficulty && json.gasLimit && json.alloc) {
      json.name = json.name || name
      json.nonce = formatNonce(json.nonce)
      return parseGethParams(json)
    } else {
      throw new Error('Invalid format')
    }
  } catch (e) {
    throw new Error(`Error parsing parameters file: ${e.message}`)
  }
}

const main = async () => {
  const genesisPath = process.argv[2]
  const genesisState: any = {}
  const genesisParams = JSON.parse(fs.readFileSync(genesisPath, 'utf8'))
  const params = await parseParams(genesisParams, 'custom-chain')
  if (genesisParams.alloc) {
    Object.keys(genesisParams.alloc).forEach((address: string) => {
      genesisState['0x' + address] = genesisParams.alloc[address].balance
    })
  }

  if (!genesisParams.name) {
    params.name = params.chainId
  }

  fs.writeFileSync('./genesis.json', JSON.stringify(params, null, 4))
  if (genesisState) {
    fs.writeFileSync('genesisState.json', JSON.stringify(genesisState, null, 4))
  }
}

main()
