/**
 * Step 2 migration: retitle describe() to `[Area]: group` per api-tests.mdc.
 * Usage: node scripts/retitle-describe.mjs [--write]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function walkSpecs(dir, out = []) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const name of entries) {
    const p = join(dir, name)
    let st
    try {
      st = statSync(p)
    } catch {
      continue
    }
    if (st.isDirectory()) walkSpecs(p, out)
    else if (name.endsWith('.spec.ts')) out.push(p)
  }
  return out
}

const write = process.argv.includes('--write')

const EXCLUDE = [
  'packages/vm/test/tester/',
  'packages/vm/test/t8n/',
  'packages/vm/test/retesteth/',
  'packages/wallet/',
]

function areaFromPath(file) {
  const pkg = file.match(/packages\/([^/]+)\//)?.[1] ?? 'unknown'
  const base = {
    block: 'Block',
    blockchain: 'Blockchain',
    common: 'Common',
    mpt: 'MPT',
    evm: 'EVM',
    vm: 'VM',
    statemanager: 'StateManager',
    tx: 'Tx',
    util: 'Util',
    rlp: 'RLP',
    binarytree: 'BinaryTree',
    ethash: 'Ethash',
    e2store: 'E2Store',
    genesis: 'Genesis',
  }[pkg] ?? pkg

  if (file.includes('packages/evm/test/precompiles/')) return 'EVM/Precompile'
  if (file.includes('packages/evm/test/eips/')) return 'EVM/EIP'
  if (file.includes('packages/mpt/test/trie/')) return 'MPT/Trie'
  if (file.includes('packages/mpt/test/proof/')) return 'MPT/Proof'
  if (file.includes('packages/mpt/test/util/')) return 'MPT/Util'
  if (file.includes('packages/util/test/bytes/')) return 'Util/Bytes'
  if (file.includes('packages/util/test/account/')) return 'Util/Account'
  if (file.includes('packages/vm/test/api/opcodes/')) return 'VM/Opcodes'
  if (file.includes('packages/vm/test/api/eips/') || file.includes('packages/vm/test/api/EIPs/'))
    return 'VM/EIP'
  if (file.includes('packages/vm/test/api/istanbul/')) return 'VM/Istanbul'
  if (file.includes('packages/block/test/')) return 'Block'
  return base
}

function eipArea(file, num) {
  if (file.includes('/block/')) return `Block/EIP-${num}`
  if (file.includes('/tx/')) return `Tx/EIP-${num}`
  if (file.includes('/evm/')) return `EVM/EIP-${num}`
  if (file.includes('/vm/')) return `VM/EIP-${num}`
  return `EIP-${num}`
}

function normalizeGroup(rest) {
  let g = rest.trim()
  if (g.startsWith(':')) g = g.slice(1).trim()
  if (g.toLowerCase() === 'tests') return 'behavior'
  if (g.toLowerCase().endsWith(' tests')) g = g.slice(0, -6)
  if (g.toLowerCase().endsWith(' test')) g = g.slice(0, -5)
  return g.charAt(0).toLowerCase() + g.slice(1)
}

function transformDescribe(title, file) {
  if (title.includes('[') && !title.startsWith('[RPCStateManager]') && !title.startsWith('[fromRPC]'))
    return { title, changed: false }

  const area = areaFromPath(file)

  const exact = {
    'POW tests': '[Ethash]: PoW vectors',
    'Verify POW for valid and invalid blocks': '[Ethash]: verify PoW on blocks',
    Miner: '[Ethash/Miner]: getMiner and mine',
    'blob gas tests': '[Block/EIP-4844]: blob gas',
    'transaction validation tests': '[Block/EIP-4844]: transaction validation',
    'fake exponential': '[Block/EIP-4844]: fake exponential',
    'EIP4788 header tests': '[Block/EIP-4788]: header',
    'official tests': '[MPT]: official vectors (insertion order)',
    'official tests any order': '[MPT]: official vectors (any order)',
    'encoding hex prefixes': '[MPT]: encoding hex prefixes',
    'support for Uint8Array': '[MPT]: Uint8Array value encoding',
    'simple merkle proofs generation and verification': '[MPT/Proof]: simple merkle proofs',
    'simple merkle range proofs generation and verification': '[MPT/Proof]: merkle range proofs',
    'geth tests': '[RLP]: official geth vectors',
    'invalid geth tests': '[RLP]: invalid geth vectors',
    Distribution: '[RLP]: distribution smoke',
    'VM events': '[VM]: events',
    genesis: '[VM]: genesis',
    'BlockBuilder': '[VM/BlockBuilder]: buildBlock API',
    'VM initialized with custom state': '[VM]: custom state at construction',
    'headerMismatchDiagnosis': '[VM/Tester]: header mismatch diagnosis',
    'test runner config tests': '[VM/T8nTool]: runner config',
    'trace tests': '[VM/T8nTool]: trace output',
    'Clique: Initialization': '[Blockchain/Clique]: initialization',
    'clique: reorgs': '[Blockchain/Clique]: reorgs',
    'reorg tests': '[Blockchain]: reorgs',
    'Optional consensus parameter in blockchain constructor':
      '[Blockchain/CustomConsensus]: optional consensus parameter',
    'Custom consensus validation rules': '[Blockchain/CustomConsensus]: validation rules',
    'consensus transition checks': '[Blockchain/CustomConsensus]: transition checks',
    ProofStateManager: '[StateManager/Proof]: RPC and local proofs',
    stateManager: '[StateManager]: VM integration',
    'Original storage cache': '[StateManager]: original storage cache',
    'Binary Tree API tests': '[StateManager/BinaryTree]: API',
    'caching functionality works': '[StateManager/BinaryTree]: caching',
    'RPC State Manager initialization tests': '[StateManager/RPC]: initialization',
    'RPC State Manager API tests': '[StateManager/RPC]: account API',
    'runTx custom transaction test': '[StateManager/RPC]: runTx transfer',
    'runTx test: replay mainnet transactions': '[StateManager/RPC]: replay mainnet tx',
    'runBlock test': '[StateManager/RPC]: runBlock',
    'custom chain setup with hardforks with undefined/null block numbers':
      '[Common/CustomChains]: null hardfork block numbers',
    InternalBinaryNode: '[BinaryTree/InternalNode]: layout',
    StemBinaryNode: '[BinaryTree/StemNode]: layout',
    'correctly apply new account gas fee on pre-Spurious Dragon hardforks':
      '[VM/AccountExists]: new-account gas before Spurious Dragon',
    'do not apply new account gas fee for empty account in DB on pre-Spurious Dragon hardforks':
      '[VM/AccountExists]: skip new-account gas for empty trie account',
    'runBlock() -> successful API parameter usage': '[VM/runBlock]: successful parameter usage',
    'runBlock() -> API parameter usage/data errors': '[VM/runBlock]: parameter and data errors',
    'runBlock() -> runtime behavior': '[VM/runBlock]: runtime behavior',
    'runBlock() -> API return values': '[VM/runBlock]: return values',
    'runBlock() -> tx types': '[VM/runBlock]: transaction types',
    'should run beaconroot precompile correctly': '[VM/EIP-4788]: beacon root precompile',
  }

  if (exact[title]) return { title: exact[title], changed: true }

  if (title.startsWith('[RPCStateManager]:')) {
    return {
      title: title.replace('[RPCStateManager]:', '[StateManager/RPC]:'),
      changed: true,
    }
  }

  if (title === '[fromJSONRPCProvider]') {
    return { title: '[Block/fromJSONRPCProvider]: load block', changed: true }
  }
  if (title.startsWith('[fromRPC]')) {
    return { title: title.replace('[fromRPC]', '[Block/fromRPC]'), changed: true }
  }
  if (title.startsWith('[Header]:')) {
    return { title: title.replace('[Header]:', '[Block/Header]:'), changed: true }
  }

  let m = title.match(/^StateManager -> (.+)$/)
  if (m) {
    const group = m[1].replace(/\//g, ' ').toLowerCase()
    return { title: `[StateManager]: ${group}`, changed: true }
  }

  m = title.match(/^(Account|Code|Storage) Cache: (.+)$/)
  if (m) {
    return {
      title: `[StateManager/${m[1]}Cache]: ${m[2].charAt(0).toLowerCase()}${m[2].slice(1)}`,
      changed: true,
    }
  }

  m = title.match(/^EIP[- ]?(\d+)(.*)$/i)
  if (m) {
    const group = normalizeGroup(m[2] || 'behavior')
    return { title: `[${eipArea(file, m[1])}]: ${group}`, changed: true }
  }

  m = title.match(/^EIP(\d+)(.*)$/i)
  if (m) {
    const group = normalizeGroup(m[2] || 'behavior')
    return { title: `[${eipArea(file, m[1])}]: ${group}`, changed: true }
  }

  m = title.match(/^Istanbul: EIP-(\d+)$/)
  if (m) return { title: `[VM/Istanbul/EIP-${m[1]}]: behavior`, changed: true }

  m = title.match(/^Constantinople: EIP-(\d+)$/)
  if (m) return { title: `[VM/Constantinople/EIP-${m[1]}]: behavior`, changed: true }

  m = title.match(/^TRIE( \(secure\))? > findPath$/)
  if (m) {
    const tag = m[1] ? 'secure findPath' : 'findPath'
    return { title: `[MPT/Trie]: ${tag}`, changed: true }
  }

  if (title.startsWith('SecureTrie')) {
    const rest = title.slice('SecureTrie'.length).trim() || 'behavior'
    return {
      title: `[MPT/SecureTrie]: ${rest.charAt(0).toLowerCase()}${rest.slice(1)}`,
      changed: true,
    }
  }

  if (title.startsWith('secure tests')) {
    return { title: `[MPT/SecureTrie]: ${title.slice('secure tests'.length).trim() || 'vectors'}`, changed: true }
  }

  if (title === 'keyHashingFunction' || title === 'getValueMap') {
    return { title: `[MPT/Trie]: ${title}`, changed: true }
  }

  if (title.startsWith('trie: ')) {
    return { title: `[MPT/Trie]: ${title.slice(6)}`, changed: true }
  }

  if (title.startsWith('walk ') || title.startsWith('branch node') || title.startsWith('trie walk') || title.startsWith('visited set')) {
    return { title: `[MPT/Util/asyncWalk]: ${title.charAt(0).toLowerCase()}${title.slice(1)}`, changed: true }
  }

  if (title.startsWith('Run MerklePatriciaTrie')) {
    return { title: '[MPT/Util/log]: debug script', changed: true }
  }

  if (title === 'encoding') return { title: '[MPT/Util]: encoding helpers', changed: true }

  if (title.startsWith('test EIP-')) {
    return { title: `[${area}]: ${title.slice(5).charAt(0).toLowerCase()}${title.slice(6)}`, changed: true }
  }

  if (title.includes('->')) {
    const parts = title.split('->').map((p) => p.trim())
    const group = parts.join(' — ').toLowerCase()
    return { title: `[${area}]: ${group}`, changed: true }
  }

  // Fallback: prefix with inferred area if title looks like a test group (not too long)
  if (title.length < 120 && !title.startsWith('[')) {
    const group = title.charAt(0).toLowerCase() + title.slice(1)
    return { title: `[${area}]: ${group}`, changed: true }
  }

  return { title, changed: false }
}

const DESCRIBE_RE = /^(\s*)describe\((['`])((?:\\.|(?!\2).)*)\2,\s*/

let totalChanges = 0
const filesChanged = []

for (const root of ['packages']) {
  for (const file of walkSpecs(root)) {
    if (EXCLUDE.some((ex) => file.includes(ex))) continue
    const src = readFileSync(file, 'utf8')
    const lines = src.split('\n')
    let fileChanges = 0
    const out = lines.map((line) => {
      const m = line.match(DESCRIBE_RE)
      if (!m) return line
      const { title: newTitle, changed } = transformDescribe(m[3], file)
      if (!changed || newTitle === m[3]) return line
      fileChanges++
      const open = `${m[1]}describe(${m[2]}${m[3]}${m[2]}`
      return open.length <= line.length
        ? `${m[1]}describe(${m[2]}${newTitle}${m[2]}${line.slice(open.length)}`
        : line
    })
    if (fileChanges > 0) {
      totalChanges += fileChanges
      filesChanged.push({ file, fileChanges })
      if (write) writeFileSync(file, out.join('\n'))
    }
  }
}

console.log(`${write ? 'Wrote' : 'Would change'} ${totalChanges} describe titles in ${filesChanged.length} files`)
if (!write && filesChanged.length > 0) {
  filesChanged.slice(0, 40).forEach(({ file, fileChanges }) => console.log(`  ${fileChanges}\t${file}`))
  if (filesChanged.length > 40) console.log(`  ... and ${filesChanged.length - 40} more files`)
}
