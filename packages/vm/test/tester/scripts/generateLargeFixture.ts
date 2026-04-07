import { createWriteStream, mkdirSync, readFileSync } from 'node:fs'
import { once } from 'node:events'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, ConsensusType, Hardfork, Mainnet } from '@ethereumjs/common'
import { MerkleStateManager } from '@ethereumjs/statemanager'
import {
  createAccessList2930Tx,
  createBlob4844Tx,
  createEOACode7702Tx,
  createFeeMarket1559Tx,
  createLegacyTx,
  type AccessList,
} from '@ethereumjs/tx'
import {
  Account,
  Address,
  BIGINT_0,
  KECCAK256_RLP,
  KECCAK256_RLP_ARRAY,
  SHA256_NULL,
  bigIntToBytes,
  bigIntToHex,
  blobsToCommitments,
  blobsToProofs,
  bytesToHex,
  commitmentsToVersionedHashes,
  concatBytes,
  createAddressFromPrivateKey,
  createAddressFromString,
  createPartialAccount,
  eoaCode7702SignAuthorization,
  generateAddress,
  generateAddress2,
  getBlobs,
  hexToBytes,
  setLengthLeft,
  type PrefixedHexString,
} from '@ethereumjs/util'
import { buildBlock, createVM, runBlock } from '@ethereumjs/vm'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

type Signer = {
  readonly privateKey: Uint8Array
  readonly address: Address
  nonce: bigint
}

type GenesisAccount = {
  balance: bigint
  nonce: bigint
  code: Uint8Array
  storage: Map<string, Uint8Array>
}

type ContractSet = {
  store: Address
  returner: Address
  callTwice: Address
  delegateAndCall: Address
  staticAndPrecompile: Address
  callThree: Address
  createFactory: Address
  create2Factory: Address
  selfdestructA: Address
  selfdestructB: Address
  selfdestructBeneficiary: Address
  referenceDeposit: Address
  referenceWithdrawals: Address
  referenceConsolidations: Address
  referenceHistory: Address
  referenceBeaconRoots: Address
}

type ReferenceFixture = {
  network: string
  config: any
  sealEngine: string
  info: Record<string, string>
  codes: Map<string, Uint8Array>
}

const activatedFromGenesisHardforks = Mainnet.hardforks.map((hardfork) => ({
  ...hardfork,
  block: hardfork.block === null ? null : 0,
  timestamp: hardfork.timestamp === undefined || hardfork.timestamp === null ? 0 : 0,
}))

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../..')
const referenceFixturePath = path.join(
  repoRoot,
  'packages/execution-spec-tests/dev/blockchain_tests/amsterdam/v510_mixed_with_other_eips/blockchain_tests/eip7928_block_level_access_lists/test_bal_all_transaction_types.json',
)
const defaultOutputPath = path.join(
  repoRoot,
  'packages/execution-spec-tests/dev/blockchain_tests/amsterdam/v510_mixed_with_other_eips/blockchain_tests/eip7928_block_level_access_lists/test_bal_large_generated_fixture.json',
)

const gasLimit = 0x07270e00n
const blockSpacing = 12n
const defaultBlocks = 250
const defaultTxsPerBlock = 200
const defaultWithdrawalsPerBlock = 15
const authorityCount = 128
const baseSenderBalance = 10n ** 21n
const zeroSlotHex: PrefixedHexString = `0x${'00'.repeat(32)}`
const create2Salt = 0x42n
const zeroAddress = createAddressFromString('0x0000000000000000000000000000000000000000')

function hexEven(hex: string): `0x${string}` {
  const raw = hex.startsWith('0x') ? hex.slice(2) : hex
  if (raw.length === 0) {
    return '0x00'
  }
  return `0x${raw.length % 2 === 0 ? raw : `0${raw}`}` as `0x${string}`
}

function quantityHex(value: bigint): `0x${string}` {
  return hexEven(bigIntToHex(value))
}

function bytesHex(bytes: Uint8Array): `0x${string}` {
  const hex = bytesToHex(bytes)
  return (hex === '0x' ? '0x00' : hexEven(hex)) as `0x${string}`
}

function indent(level: number) {
  return '    '.repeat(level)
}

function formatJSON(value: unknown, nestedIndentLevel: number) {
  return JSON.stringify(value, null, 4)!.split('\n').join(`\n${indent(nestedIndentLevel)}`)
}

async function writeChunk(stream: ReturnType<typeof createWriteStream>, chunk: string) {
  if (stream.write(chunk) === false) {
    await once(stream, 'drain')
  }
}

async function writeKeyedObject(
  stream: ReturnType<typeof createWriteStream>,
  level: number,
  entries: Array<[string, unknown]>,
) {
  await writeChunk(stream, '{\n')
  for (const [index, [key, value]] of entries.entries()) {
    const suffix = index === entries.length - 1 ? '\n' : ',\n'
    await writeChunk(
      stream,
      `${indent(level + 1)}${JSON.stringify(key)}: ${formatJSON(value, level + 1)}${suffix}`,
    )
  }
  await writeChunk(stream, `${indent(level)}}`)
}

function wordHex(value: bigint): `0x${string}` {
  return bytesToHex(setLengthLeft(bigIntToBytes(value), 32)) as `0x${string}`
}

function blockHeaderJSONWithHash(block: { header: { toJSON(): any }; hash(): Uint8Array }) {
  return {
    ...block.header.toJSON(),
    hash: bytesToHex(block.hash()),
  }
}

function pushHex(rawHex: string): string {
  const clean = rawHex.startsWith('0x') ? rawHex.slice(2) : rawHex
  const length = clean.length / 2
  if (length < 1 || length > 32) {
    throw new Error(`unsupported PUSH length: ${length}`)
  }
  return `${(0x5f + length).toString(16).padStart(2, '0')}${clean}`
}

function pushAddress(address: Address): string {
  return pushHex(address.toString().slice(2))
}

function compile(hex: string): Uint8Array {
  return hexToBytes(`0x${hex}`)
}

function makeInitCode(runtime: Uint8Array): Uint8Array {
  const runtimeHex = bytesToHex(runtime).slice(2)
  const lengthHex = runtime.length.toString(16).padStart(2, '0')
  const offsetHex = '0a'
  return compile(`60${lengthHex}60${offsetHex}60003960${lengthHex}6000f3${runtimeHex}`)
}

function makeStoreRuntime() {
  return compile('5f355f5500')
}

function makeReturnerRuntime() {
  return compile('5f5f5260205ff3')
}

function makeCallTwiceRuntime(store: Address, returner: Address) {
  const prefix = '60205f5f37'
  const callStore = `5f5f60205f5f${pushAddress(store)}5af1`
  const callReturner = `5f5f60205f5f${pushAddress(returner)}5af1`
  return compile(`${prefix}${callStore}${callReturner}00`)
}

function makeDelegateAndCallRuntime(store: Address) {
  const prefix = '60205f5f37'
  const delegateStore = `5f5f60205f${pushAddress(store)}5af4`
  const callStore = `5f5f60205f5f${pushAddress(store)}5af1`
  return compile(`${prefix}${delegateStore}${callStore}00`)
}

function makeStaticAndPrecompileRuntime(returner: Address) {
  const prefix = '60205f5f37'
  const staticCall = `5f5f60205f${pushAddress(returner)}5afa`
  const callIdentity = '5f5f60205f5f60045af1'
  return compile(`${prefix}${staticCall}${callIdentity}00`)
}

function makeCallThreeRuntime(store: Address, returner: Address) {
  const prefix = '60205f5f37'
  const callStore = `5f5f60205f5f${pushAddress(store)}5af1`
  const callReturner = `5f5f60205f5f${pushAddress(returner)}5af1`
  const callIdentity = '5f5f60205f5f60045af1'
  return compile(`${prefix}${callStore}${callReturner}${callIdentity}00`)
}

function makeCreateFactoryRuntime() {
  return compile('365f5f37365f5ff000')
}

function makeCreate2FactoryRuntime() {
  return compile(`365f5f37${pushHex(quantityHex(create2Salt))}365f5ff500`)
}

function makeSelfdestructRuntime(beneficiary: Address) {
  return compile(`${pushAddress(beneficiary)}ff`)
}

function makeDeterministicSigner(index: number): Signer {
  const privateKey = setLengthLeft(bigIntToBytes(BigInt(index + 1)), 32)
  const address = createAddressFromPrivateKey(privateKey)
  return { privateKey, address, nonce: BIGINT_0 }
}

function makeAddress(index: bigint): Address {
  return new Address(setLengthLeft(bigIntToBytes(index), 20))
}

function loadReferenceFixture(referencePath: string): ReferenceFixture {
  const raw = JSON.parse(readFileSync(referencePath, 'utf8'))
  const data = Object.values(raw)[0] as any
  const pre = data.pre as Record<string, { code: string }>
  const addresses = [
    '0x00000000219ab540356cbb839cbe05303d7705fa',
    '0x00000961ef480eb55e80d19ad83579a64c007002',
    '0x0000bbddc7ce488642fb579f8b00f3a590007251',
    '0x0000f90827f1c53a10cb7a02335b175320002935',
    '0x000f3df6d732807ef1319fb7b8bb8522d0beac02',
  ]

  const codes = new Map<string, Uint8Array>()
  for (const address of addresses) {
    const entry = pre[address.toLowerCase()]
    if (entry === undefined) {
      throw new Error(`missing reference contract code for ${address}`)
    }
    codes.set(address.toLowerCase(), hexToBytes(entry.code as `0x${string}`))
  }

  return {
    network: data.network,
    config: data.config,
    sealEngine: data.sealEngine,
    info: data._info,
    codes,
  }
}

function createGenesisAccount(
  balance: bigint = BIGINT_0,
  nonce: bigint = BIGINT_0,
  code: Uint8Array = new Uint8Array(),
  storage: Record<string, Uint8Array> = {},
): GenesisAccount {
  return {
    balance,
    nonce,
    code,
    storage: new Map(Object.entries(storage)),
  }
}

async function installGenesisAccounts(
  stateManager: MerkleStateManager,
  accounts: Map<string, GenesisAccount>,
) {
  await stateManager.checkpoint()

  for (const [addressString, accountData] of accounts.entries()) {
    const address = createAddressFromString(addressString)
    await stateManager.putAccount(address, new Account())

    for (const [slotHex, value] of accountData.storage.entries()) {
      if (value.length === 0 || bytesToHex(value) === '0x00') {
        continue
      }
      await stateManager.putStorage(address, hexToBytes(slotHex as `0x${string}`), value)
    }

    await stateManager.putCode(address, accountData.code)
    const stored = await stateManager.getAccount(address)
    const partial = createPartialAccount({
      nonce: accountData.nonce,
      balance: accountData.balance,
      codeHash: keccak_256(accountData.code),
      storageRoot: stored!.storageRoot,
      codeSize: accountData.code.length,
    })
    await stateManager.putAccount(address, partial)
  }

  await stateManager.commit()
}

function addTrackedAddress(tracked: Set<string>, address: Address | string) {
  tracked.add(typeof address === 'string' ? address.toLowerCase() : address.toString().toLowerCase())
}

function addTrackedSlot(trackedSlots: Map<string, Set<string>>, address: Address | string, slot: string) {
  const key = typeof address === 'string' ? address.toLowerCase() : address.toString().toLowerCase()
  if (trackedSlots.has(key) === false) {
    trackedSlots.set(key, new Set())
  }
  trackedSlots.get(key)!.add(slot.toLowerCase())
}

function accessListFor(address: Address, ...storageKeys: PrefixedHexString[]): AccessList {
  return [
    {
      address: address.toString(),
      storageKeys,
    },
  ]
}

function nextSender(senders: Signer[], counter: { value: number }) {
  const signer = senders[counter.value % senders.length]
  counter.value += 1
  const nonce = signer.nonce
  signer.nonce += 1n
  return { signer, nonce }
}

function nextAuthority(authorities: Signer[], counter: { value: number }) {
  const authority = authorities[counter.value % authorities.length]
  counter.value += 1
  const nonce = authority.nonce
  authority.nonce += 1n
  return { authority, nonce }
}

function withdrawalRequestData(seed: bigint): Uint8Array {
  const pubkey = new Uint8Array(48).fill(Number(seed % 251n))
  const amount = setLengthLeft(bigIntToBytes((seed % 1_000_000n) + 1n), 8)
  return concatBytes(pubkey, amount)
}

function createAuthorization(authority: Signer, delegateTarget: Address, nonce: bigint) {
  return eoaCode7702SignAuthorization(
    {
      chainId: quantityHex(1n),
      address: delegateTarget.toString(),
      nonce: quantityHex(nonce),
    },
    authority.privateKey,
  )
}

function makeBlobCache(kzg: microEthKZG) {
  return Array.from({ length: 8 }, (_, index) => {
    const blobs = getBlobs(`bal-large-fixture-${index}`)
    const commitments = blobsToCommitments(kzg, blobs)
    return {
      blobs,
      blobVersionedHashes: commitmentsToVersionedHashes(commitments),
      kzgCommitments: commitments,
      kzgProofs: blobsToProofs(kzg, blobs, commitments),
    }
  })
}

function createContracts(reference: ReferenceFixture): { contracts: ContractSet; genesis: Map<string, GenesisAccount> } {
  const contracts: ContractSet = {
    store: makeAddress(0x1000000000000000000000000000000000000001n),
    returner: makeAddress(0x1000000000000000000000000000000000000002n),
    callTwice: makeAddress(0x1000000000000000000000000000000000000003n),
    delegateAndCall: makeAddress(0x1000000000000000000000000000000000000004n),
    staticAndPrecompile: makeAddress(0x1000000000000000000000000000000000000005n),
    callThree: makeAddress(0x1000000000000000000000000000000000000006n),
    createFactory: makeAddress(0x1000000000000000000000000000000000000007n),
    create2Factory: makeAddress(0x1000000000000000000000000000000000000008n),
    selfdestructA: makeAddress(0x1000000000000000000000000000000000000009n),
    selfdestructB: makeAddress(0x100000000000000000000000000000000000000an),
    selfdestructBeneficiary: makeAddress(0x100000000000000000000000000000000000000bn),
    referenceDeposit: createAddressFromString('0x00000000219ab540356cbb839cbe05303d7705fa'),
    referenceWithdrawals: createAddressFromString('0x00000961ef480eb55e80d19ad83579a64c007002'),
    referenceConsolidations: createAddressFromString('0x0000bbddc7ce488642fb579f8b00f3a590007251'),
    referenceHistory: createAddressFromString('0x0000f90827f1c53a10cb7a02335b175320002935'),
    referenceBeaconRoots: createAddressFromString('0x000f3df6d732807ef1319fb7b8bb8522d0beac02'),
  }

  const genesis = new Map<string, GenesisAccount>([
    [contracts.store.toString(), createGenesisAccount(0n, 1n, makeStoreRuntime())],
    [contracts.returner.toString(), createGenesisAccount(0n, 1n, makeReturnerRuntime())],
    [
      contracts.callTwice.toString(),
      createGenesisAccount(0n, 1n, makeCallTwiceRuntime(contracts.store, contracts.returner)),
    ],
    [
      contracts.delegateAndCall.toString(),
      createGenesisAccount(0n, 1n, makeDelegateAndCallRuntime(contracts.store)),
    ],
    [
      contracts.staticAndPrecompile.toString(),
      createGenesisAccount(0n, 1n, makeStaticAndPrecompileRuntime(contracts.returner)),
    ],
    [
      contracts.callThree.toString(),
      createGenesisAccount(0n, 1n, makeCallThreeRuntime(contracts.store, contracts.returner)),
    ],
    [contracts.createFactory.toString(), createGenesisAccount(0n, 1n, makeCreateFactoryRuntime())],
    [contracts.create2Factory.toString(), createGenesisAccount(0n, 1n, makeCreate2FactoryRuntime())],
    [
      contracts.selfdestructA.toString(),
      createGenesisAccount(3_000_000_000n, 1n, makeSelfdestructRuntime(contracts.selfdestructBeneficiary)),
    ],
    [
      contracts.selfdestructB.toString(),
      createGenesisAccount(5_000_000_000n, 1n, makeSelfdestructRuntime(contracts.selfdestructBeneficiary)),
    ],
    [contracts.selfdestructBeneficiary.toString(), createGenesisAccount()],
    [
      contracts.referenceDeposit.toString(),
      createGenesisAccount(
        0n,
        1n,
        reference.codes.get(contracts.referenceDeposit.toString()) ?? new Uint8Array(),
      ),
    ],
    [
      contracts.referenceWithdrawals.toString(),
      createGenesisAccount(
        0n,
        1n,
        reference.codes.get(contracts.referenceWithdrawals.toString()) ?? new Uint8Array(),
      ),
    ],
    [
      contracts.referenceConsolidations.toString(),
      createGenesisAccount(
        0n,
        1n,
        reference.codes.get(contracts.referenceConsolidations.toString()) ?? new Uint8Array(),
      ),
    ],
    [
      contracts.referenceHistory.toString(),
      createGenesisAccount(
        0n,
        1n,
        reference.codes.get(contracts.referenceHistory.toString()) ?? new Uint8Array(),
      ),
    ],
    [
      contracts.referenceBeaconRoots.toString(),
      createGenesisAccount(
        0n,
        1n,
        reference.codes.get(contracts.referenceBeaconRoots.toString()) ?? new Uint8Array(),
      ),
    ],
  ])

  return { contracts, genesis }
}

function createZeroScenario(
  templateIndex: number,
  absoluteIndex: number,
  common: Common,
  senders: Signer[],
  senderCounter: { value: number },
  authorities: Signer[],
  authorityCounter: { value: number },
  contracts: ContractSet,
  recipients: Address[],
  baseFee: bigint,
  blobCache: ReturnType<typeof makeBlobCache>,
  trackedAddresses: Set<string>,
  trackedSlots: Map<string, Set<string>>,
  currentBlock: bigint,
  timestamp: bigint,
) {
  const payload = wordHex((currentBlock << 32n) + BigInt(templateIndex + 1))
  const transferRecipient = recipients[absoluteIndex % recipients.length]
  const historyQuery = wordHex(currentBlock > 1n ? currentBlock - 2n : 0n)
  const beaconQuery = wordHex(timestamp)

  if (templateIndex < 10) {
    const { signer, nonce } = nextSender(senders, senderCounter)
    addTrackedAddress(trackedAddresses, signer.address)
    addTrackedAddress(trackedAddresses, transferRecipient)
    const to = templateIndex % 4 === 0 ? signer.address : transferRecipient
    const value = templateIndex % 3 === 0 ? BIGINT_0 : BigInt(absoluteIndex + 1)
    return createLegacyTx(
      {
        nonce,
        gasPrice: baseFee + 3n,
        gasLimit: 30_000n,
        to,
        value,
      },
      { common },
    ).sign(signer.privateKey)
  }

  if (templateIndex < 15) {
    const { signer, nonce } = nextSender(senders, senderCounter)
    addTrackedAddress(trackedAddresses, signer.address)
    addTrackedAddress(trackedAddresses, contracts.store)
    addTrackedSlot(trackedSlots, contracts.store, zeroSlotHex)
    return createLegacyTx(
      {
        nonce,
        gasPrice: baseFee + 3n,
        gasLimit: 100_000n,
        to: contracts.store,
        data: payload,
      },
      { common },
    ).sign(signer.privateKey)
  }

  if (templateIndex < 20) {
    const { signer, nonce } = nextSender(senders, senderCounter)
    addTrackedAddress(trackedAddresses, signer.address)
    const runtime =
      templateIndex % 2 === 0 ? makeStoreRuntime() : makeSelfdestructRuntime(contracts.selfdestructBeneficiary)
    const initCode = makeInitCode(runtime)
    const created = new Address(generateAddress(signer.address.bytes, bigIntToBytes(nonce)))
    addTrackedAddress(trackedAddresses, created)
    return createLegacyTx(
      {
        nonce,
        gasPrice: baseFee + 4n,
        gasLimit: 250_000n,
        data: initCode,
      },
      { common },
    ).sign(signer.privateKey)
  }

  if (templateIndex < 30) {
    const { signer, nonce } = nextSender(senders, senderCounter)
    addTrackedAddress(trackedAddresses, signer.address)
    addTrackedAddress(trackedAddresses, transferRecipient)
    return createAccessList2930Tx(
      {
        nonce,
        gasPrice: baseFee + 2n,
        gasLimit: 60_000n,
        to: transferRecipient,
        value: BigInt(templateIndex % 2),
        accessList: accessListFor(contracts.store, zeroSlotHex) as AccessList,
      },
      { common },
    ).sign(signer.privateKey)
  }

  if (templateIndex < 40) {
    const { signer, nonce } = nextSender(senders, senderCounter)
    addTrackedAddress(trackedAddresses, signer.address)
    const to = templateIndex % 2 === 0 ? contracts.store : contracts.referenceHistory
    addTrackedAddress(trackedAddresses, to)
    if (to.toString() === contracts.store.toString()) {
      addTrackedSlot(trackedSlots, contracts.store, zeroSlotHex)
    }
    return createAccessList2930Tx(
      {
        nonce,
        gasPrice: baseFee + 2n,
        gasLimit: 120_000n,
        to,
        data: to.toString() === contracts.store.toString() ? payload : historyQuery,
        accessList: accessListFor(to, zeroSlotHex),
      },
      { common },
    ).sign(signer.privateKey)
  }

  if (templateIndex < 55) {
    const { signer, nonce } = nextSender(senders, senderCounter)
    addTrackedAddress(trackedAddresses, signer.address)
    addTrackedAddress(trackedAddresses, contracts.store)
    addTrackedSlot(trackedSlots, contracts.store, zeroSlotHex)
    return createFeeMarket1559Tx(
      {
        nonce,
        maxPriorityFeePerGas: templateIndex % 5 === 0 ? 0n : 2n,
        maxFeePerGas: templateIndex % 5 === 0 ? baseFee : baseFee + 5n,
        gasLimit: 120_000n,
        to: contracts.store,
        data: payload,
      },
      { common },
    ).sign(signer.privateKey)
  }

  if (templateIndex < 65) {
    const { signer, nonce } = nextSender(senders, senderCounter)
    const to = templateIndex % 2 === 0 ? contracts.referenceHistory : contracts.referenceBeaconRoots
    addTrackedAddress(trackedAddresses, signer.address)
    addTrackedAddress(trackedAddresses, to)
    return createFeeMarket1559Tx(
      {
        nonce,
        maxPriorityFeePerGas: 1n,
        maxFeePerGas: baseFee + 4n,
        gasLimit: 150_000n,
        to,
        data: to.toString() === contracts.referenceHistory.toString() ? historyQuery : beaconQuery,
      },
      { common },
    ).sign(signer.privateKey)
  }

  if (templateIndex < 70) {
    const { signer, nonce } = nextSender(senders, senderCounter)
    addTrackedAddress(trackedAddresses, signer.address)
    addTrackedAddress(trackedAddresses, contracts.referenceWithdrawals)
    return createFeeMarket1559Tx(
      {
        nonce,
        maxPriorityFeePerGas: 1n,
        maxFeePerGas: baseFee + 5n,
        gasLimit: 250_000n,
        to: contracts.referenceWithdrawals,
        value: 1n,
        data: withdrawalRequestData(BigInt(absoluteIndex)),
      },
      { common },
    ).sign(signer.privateKey)
  }

  if (templateIndex < 74) {
    const { signer, nonce } = nextSender(senders, senderCounter)
    addTrackedAddress(trackedAddresses, signer.address)
    addTrackedAddress(trackedAddresses, contracts.store)
    addTrackedSlot(trackedSlots, contracts.store, zeroSlotHex)
    const blob = blobCache[absoluteIndex % blobCache.length]
    const to = templateIndex % 2 === 0 ? contracts.store : contracts.referenceHistory
    addTrackedAddress(trackedAddresses, to)
    return createBlob4844Tx(
      {
        nonce,
        maxPriorityFeePerGas: 2n,
        maxFeePerGas: baseFee + 6n,
        maxFeePerBlobGas: 1_000_000_000n,
        gasLimit: 250_000n,
        to,
        data: to.toString() === contracts.store.toString() ? payload : historyQuery,
        accessList: accessListFor(contracts.store, zeroSlotHex),
        blobs: blob.blobs,
        blobVersionedHashes: blob.blobVersionedHashes,
        kzgCommitments: blob.kzgCommitments,
        kzgProofs: blob.kzgProofs,
      },
      { common },
    ).sign(signer.privateKey)
  }

  if (templateIndex < 77) {
    const { signer, nonce } = nextSender(senders, senderCounter)
    const { authority, nonce: authorityNonce } = nextAuthority(authorities, authorityCounter)
    addTrackedAddress(trackedAddresses, signer.address)
    addTrackedAddress(trackedAddresses, authority.address)
    addTrackedSlot(trackedSlots, authority.address, zeroSlotHex)
    return createEOACode7702Tx(
      {
        nonce,
        maxPriorityFeePerGas: 2n,
        maxFeePerGas: baseFee + 5n,
        gasLimit: 220_000n,
        to: authority.address,
        data: payload,
        accessList: accessListFor(authority.address, zeroSlotHex),
        authorizationList: [createAuthorization(authority, contracts.store, authorityNonce)],
      },
      { common },
    ).sign(signer.privateKey)
  }

  if (templateIndex < 87) {
    const { signer, nonce } = nextSender(senders, senderCounter)
    addTrackedAddress(trackedAddresses, signer.address)
    const runtime = templateIndex % 2 === 0 ? makeReturnerRuntime() : makeStoreRuntime()
    const initCode = makeInitCode(runtime)
    const created = new Address(generateAddress(signer.address.bytes, bigIntToBytes(nonce)))
    addTrackedAddress(trackedAddresses, created)
    return createFeeMarket1559Tx(
      {
        nonce,
        maxPriorityFeePerGas: 2n,
        maxFeePerGas: baseFee + 5n,
        gasLimit: 260_000n,
        data: initCode,
      },
      { common },
    ).sign(signer.privateKey)
  }

  if (templateIndex < 94) {
    const { signer, nonce } = nextSender(senders, senderCounter)
    const to = templateIndex % 2 === 0 ? contracts.selfdestructA : contracts.selfdestructB
    addTrackedAddress(trackedAddresses, signer.address)
    addTrackedAddress(trackedAddresses, to)
    addTrackedAddress(trackedAddresses, contracts.selfdestructBeneficiary)
    return createLegacyTx(
      {
        nonce,
        gasPrice: baseFee + 2n,
        gasLimit: 50_000n,
        to,
      },
      { common },
    ).sign(signer.privateKey)
  }

  const { signer, nonce } = nextSender(senders, senderCounter)
  addTrackedAddress(trackedAddresses, signer.address)
  addTrackedAddress(trackedAddresses, transferRecipient)
  return createFeeMarket1559Tx(
    {
      nonce,
      maxPriorityFeePerGas: 0n,
      maxFeePerGas: baseFee,
      gasLimit: 35_000n,
      to: templateIndex % 2 === 0 ? transferRecipient : contracts.store,
      value: templateIndex % 2 === 0 ? BigInt(templateIndex - 93) : 0n,
      data: templateIndex % 2 === 0 ? undefined : payload,
    },
    { common },
  ).sign(signer.privateKey)
}

function createInternalScenario(
  templateIndex: number,
  absoluteIndex: number,
  common: Common,
  senders: Signer[],
  senderCounter: { value: number },
  authorities: Signer[],
  authorityCounter: { value: number },
  contracts: ContractSet,
  baseFee: bigint,
  trackedAddresses: Set<string>,
  trackedSlots: Map<string, Set<string>>,
) {
  const payload = wordHex(0xdeadn + BigInt(absoluteIndex))

  const makeCallTx = (
    kind: 'legacy' | '2930' | '1559',
    to: Address,
    accessList?: ReturnType<typeof accessListFor>,
  ) => {
    const { signer, nonce } = nextSender(senders, senderCounter)
    addTrackedAddress(trackedAddresses, signer.address)
    addTrackedAddress(trackedAddresses, to)

    if (kind === 'legacy') {
      return createLegacyTx(
        {
          nonce,
          gasPrice: baseFee + 3n,
          gasLimit: 180_000n,
          to,
          data: payload,
        },
        { common },
      ).sign(signer.privateKey)
    }

    if (kind === '2930') {
      return createAccessList2930Tx(
        {
          nonce,
          gasPrice: baseFee + 3n,
          gasLimit: 200_000n,
          to,
          data: payload,
          accessList: accessList ?? accessListFor(contracts.store, zeroSlotHex),
        },
        { common },
      ).sign(signer.privateKey)
    }

    return createFeeMarket1559Tx(
      {
        nonce,
        maxPriorityFeePerGas: 2n,
        maxFeePerGas: baseFee + 5n,
        gasLimit: 220_000n,
        to,
        data: payload,
        accessList,
      },
      { common },
    ).sign(signer.privateKey)
  }

  if (templateIndex < 15) {
    addTrackedAddress(trackedAddresses, contracts.store)
    addTrackedSlot(trackedSlots, contracts.store, zeroSlotHex)
    return makeCallTx('legacy', contracts.callTwice)
  }

  if (templateIndex < 25) {
    addTrackedAddress(trackedAddresses, contracts.delegateAndCall)
    addTrackedAddress(trackedAddresses, contracts.store)
    addTrackedSlot(trackedSlots, contracts.delegateAndCall, zeroSlotHex)
    addTrackedSlot(trackedSlots, contracts.store, zeroSlotHex)
    return makeCallTx('legacy', contracts.delegateAndCall)
  }

  if (templateIndex < 40) {
    addTrackedAddress(trackedAddresses, contracts.store)
    addTrackedSlot(trackedSlots, contracts.store, zeroSlotHex)
    return makeCallTx('2930', contracts.callTwice)
  }

  if (templateIndex < 50) {
    return makeCallTx('2930', contracts.staticAndPrecompile)
  }

  if (templateIndex < 70) {
    addTrackedAddress(trackedAddresses, contracts.store)
    addTrackedSlot(trackedSlots, contracts.store, zeroSlotHex)
    return makeCallTx('1559', contracts.callTwice)
  }

  if (templateIndex < 85) {
    const to = templateIndex % 2 === 0 ? contracts.delegateAndCall : contracts.staticAndPrecompile
    if (to.toString() === contracts.delegateAndCall.toString()) {
      addTrackedSlot(trackedSlots, contracts.delegateAndCall, zeroSlotHex)
      addTrackedSlot(trackedSlots, contracts.store, zeroSlotHex)
    }
    return makeCallTx('1559', to)
  }

  if (templateIndex < 90) {
    addTrackedAddress(trackedAddresses, contracts.store)
    addTrackedSlot(trackedSlots, contracts.store, zeroSlotHex)
    return makeCallTx('1559', contracts.callThree)
  }

  if (templateIndex < 95) {
    const { signer, nonce } = nextSender(senders, senderCounter)
    addTrackedAddress(trackedAddresses, signer.address)
    addTrackedAddress(trackedAddresses, contracts.create2Factory)
    const initCode = makeInitCode(makeReturnerRuntime())
    const created = new Address(
      generateAddress2(
        contracts.create2Factory.bytes,
        setLengthLeft(bigIntToBytes(create2Salt), 32),
        initCode,
      ),
    )
    addTrackedAddress(trackedAddresses, created)
    return createFeeMarket1559Tx(
      {
        nonce,
        maxPriorityFeePerGas: 2n,
        maxFeePerGas: baseFee + 5n,
        gasLimit: 300_000n,
        to: contracts.create2Factory,
        data: initCode,
      },
      { common },
    ).sign(signer.privateKey)
  }

  const { signer, nonce } = nextSender(senders, senderCounter)
  const { authority, nonce: authorityNonce } = nextAuthority(authorities, authorityCounter)
  addTrackedAddress(trackedAddresses, signer.address)
  addTrackedAddress(trackedAddresses, authority.address)
  return createEOACode7702Tx(
    {
      nonce,
      maxPriorityFeePerGas: 2n,
      maxFeePerGas: baseFee + 5n,
      gasLimit: 260_000n,
      to: authority.address,
      data: payload,
      authorizationList: [createAuthorization(authority, contracts.callTwice, authorityNonce)],
    },
    { common },
  ).sign(signer.privateKey)
}

function createWithdrawals(
  withdrawalsPerBlock: number,
  blockNumber: bigint,
  coinbase: Address,
  recipients: Address[],
  trackedAddresses: Set<string>,
  nextWithdrawalIndex: { value: bigint },
) {
  const withdrawals = []
  for (let i = 0; i < withdrawalsPerBlock; i++) {
    const recipient =
      i % 5 === 0
        ? coinbase
        : recipients[Number((blockNumber * 17n + BigInt(i)) % BigInt(recipients.length))]
    addTrackedAddress(trackedAddresses, recipient)
    withdrawals.push({
      index: nextWithdrawalIndex.value,
      validatorIndex: nextWithdrawalIndex.value,
      address: recipient,
      amount: 1n + BigInt((i + Number(blockNumber % 7n)) % 9),
    })
    nextWithdrawalIndex.value += 1n
  }
  return withdrawals
}

async function serializeAccount(
  vm: Awaited<ReturnType<typeof createVM>>,
  addressString: string,
  trackedSlots: Set<string> | undefined,
) {
  const address = createAddressFromString(addressString)
  const account = await vm.stateManager.getAccount(address)
  if (account === undefined) {
    return undefined
  }
  const code = await vm.stateManager.getCode(address)
  const storage: Record<string, string> = {}

  for (const slot of [...(trackedSlots ?? [])].sort()) {
    const value = await vm.stateManager.getStorage(address, hexToBytes(slot as `0x${string}`))
    storage[slot] = value.length === 0 ? '0x' : bytesHex(value)
  }

  return {
    nonce: quantityHex(account.nonce),
    balance: quantityHex(account.balance),
    code: bytesToHex(code),
    storage,
  }
}

function serializeGenesisAccounts(accounts: Map<string, GenesisAccount>) {
  const entries = [...accounts.entries()].sort(([a], [b]) => a.localeCompare(b))
  const out: Record<string, any> = {}
  for (const [address, account] of entries) {
    const storage = Object.fromEntries(
      [...account.storage.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([slot, value]) => [slot, value.length === 0 ? '0x' : bytesHex(value)]),
    )
    out[address] = {
      nonce: quantityHex(account.nonce),
      balance: quantityHex(account.balance),
      code: bytesToHex(account.code),
      storage,
    }
  }
  return out
}

async function main() {
  const { values } = parseArgs({
    options: {
      blocks: { type: 'string' },
      'txs-per-block': { type: 'string' },
      'withdrawals-per-block': { type: 'string' },
      signers: { type: 'string' },
      output: { type: 'string' },
      reference: { type: 'string' },
    },
  })

  const blocks = values.blocks ? Number(values.blocks) : defaultBlocks
  const txsPerBlock = values['txs-per-block'] ? Number(values['txs-per-block']) : defaultTxsPerBlock
  const withdrawalsPerBlock = values['withdrawals-per-block']
    ? Number(values['withdrawals-per-block'])
    : defaultWithdrawalsPerBlock
  const requiredSenders = Math.max(384, Math.ceil((blocks * txsPerBlock) / 128))
  const totalSigners = Math.max(
    requiredSenders + authorityCount,
    values.signers ? Number(values.signers) : 0,
  )
  const senderCount = totalSigners - authorityCount
  const outputPath = values.output ? path.resolve(values.output) : defaultOutputPath
  const reference = loadReferenceFixture(values.reference ? path.resolve(values.reference) : referenceFixturePath)

  const kzg = new microEthKZG(trustedSetup)
  const blobCache = makeBlobCache(kzg)
  const common = new Common({
    chain: {
      ...Mainnet,
      defaultHardfork: Hardfork.Amsterdam,
      consensus: {
        type: ConsensusType.ProofOfStake,
        algorithm: 'casper',
      },
      hardforks: activatedFromGenesisHardforks,
    },
    hardfork: Hardfork.Amsterdam,
    customCrypto: { kzg },
  })

  const builderStateManager = new MerkleStateManager({ common })
  const executionStateManager = new MerkleStateManager({ common })
  const senders = Array.from({ length: senderCount }, (_, index) => makeDeterministicSigner(index))
  const authorities = Array.from({ length: authorityCount }, (_, index) =>
    makeDeterministicSigner(senderCount + index),
  )
  const recipients = Array.from({ length: 128 }, (_, index) =>
    makeAddress(0x2000000000000000000000000000000000000000n + BigInt(index + 1)),
  )
  const coinbases = Array.from({ length: 32 }, (_, index) =>
    makeAddress(0x3000000000000000000000000000000000000000n + BigInt(index + 1)),
  )

  const { contracts, genesis: contractAccounts } = createContracts(reference)
  for (const signer of senders) {
    contractAccounts.set(signer.address.toString(), createGenesisAccount(baseSenderBalance))
  }

  await installGenesisAccounts(builderStateManager, contractAccounts)
  await installGenesisAccounts(executionStateManager, contractAccounts)
  const genesisStateRoot = await builderStateManager.getStateRoot()

  const genesisBlock = createBlock(
    {
      header: {
        parentHash: new Uint8Array(32),
        uncleHash: KECCAK256_RLP_ARRAY,
        coinbase: zeroAddress,
        stateRoot: genesisStateRoot,
        transactionsTrie: KECCAK256_RLP,
        receiptTrie: KECCAK256_RLP,
        logsBloom: new Uint8Array(256),
        difficulty: BIGINT_0,
        number: BIGINT_0,
        gasLimit,
        gasUsed: BIGINT_0,
        timestamp: BIGINT_0,
        extraData: Uint8Array.from([0]),
        mixHash: new Uint8Array(32),
        nonce: new Uint8Array(8),
        baseFeePerGas: 7n,
        withdrawalsRoot: KECCAK256_RLP,
        blobGasUsed: BIGINT_0,
        excessBlobGas: BIGINT_0,
        parentBeaconBlockRoot: new Uint8Array(32),
        requestsHash: SHA256_NULL,
        blockAccessListHash: KECCAK256_RLP_ARRAY,
        slotNumber: BIGINT_0,
      },
    },
    { common, freeze: false, setHardfork: true, skipConsensusFormatValidation: true },
  )

  const builderBlockchain = await createBlockchain({
    common,
    genesisBlock,
    validateBlocks: false,
    validateConsensus: false,
  })
  const executionBlockchain = await createBlockchain({
    common,
    genesisBlock,
    validateBlocks: false,
    validateConsensus: false,
  })
  const builderVM = await createVM({
    common,
    blockchain: builderBlockchain,
    stateManager: builderStateManager,
  })
  const executionVM = await createVM({
    common,
    blockchain: executionBlockchain,
    stateManager: executionStateManager,
  })

  const trackedAddresses = new Set<string>([
    ...contractAccounts.keys(),
    ...authorities.map((authority) => authority.address.toString()),
    ...recipients.map((recipient) => recipient.toString()),
    ...coinbases.map((coinbase) => coinbase.toString()),
  ])
  const trackedSlots = new Map<string, Set<string>>()
  addTrackedSlot(trackedSlots, contracts.store, zeroSlotHex)
  addTrackedSlot(trackedSlots, contracts.delegateAndCall, zeroSlotHex)
  for (const authority of authorities) {
    addTrackedSlot(trackedSlots, authority.address, zeroSlotHex)
  }

  const blocksOut: any[] = []
  let parentBlock = genesisBlock
  const senderCounter = { value: 0 }
  const authorityCounter = { value: 0 }
  const nextWithdrawalIndex = { value: 0n }

  for (let blockIndex = 0; blockIndex < blocks; blockIndex++) {
    const blockNumber = BigInt(blockIndex + 1)
    const timestamp = blockNumber * blockSpacing
    const coinbase = coinbases[blockIndex % coinbases.length]
    const baseFee = parentBlock.header.calcNextBaseFee()
    const parentBeaconBlockRoot = keccak_256(setLengthLeft(bigIntToBytes(blockNumber), 32))
    const withdrawals = createWithdrawals(
      withdrawalsPerBlock,
      blockNumber,
      coinbase,
      recipients,
      trackedAddresses,
      nextWithdrawalIndex,
    )

    const blockBuilder = await buildBlock(builderVM, {
      parentBlock,
      withdrawals,
      headerData: {
        coinbase,
        gasLimit,
        timestamp,
        parentBeaconBlockRoot,
        slotNumber: blockNumber - 1n,
      },
      blockOpts: {
        freeze: false,
        putBlockIntoBlockchain: false,
        setHardfork: true,
        skipConsensusFormatValidation: true,
      },
    })

    const half = Math.floor(txsPerBlock / 2)
    for (let i = 0; i < half; i++) {
      const absoluteIndex = blockIndex * txsPerBlock + i * 2
      await blockBuilder.addTransaction(
        createZeroScenario(
          i % 100,
          absoluteIndex,
          common,
          senders,
          senderCounter,
          authorities,
          authorityCounter,
          contracts,
          recipients,
          baseFee,
          blobCache,
          trackedAddresses,
          trackedSlots,
          blockNumber,
          timestamp,
        ),
      )
      await blockBuilder.addTransaction(
        createInternalScenario(
          i % 100,
          absoluteIndex + 1,
          common,
          senders,
          senderCounter,
          authorities,
          authorityCounter,
          contracts,
          baseFee,
          trackedAddresses,
          trackedSlots,
        ),
      )
    }

    if (txsPerBlock % 2 === 1) {
      await blockBuilder.addTransaction(
        createZeroScenario(
          half % 100,
          blockIndex * txsPerBlock + txsPerBlock - 1,
          common,
          senders,
          senderCounter,
          authorities,
          authorityCounter,
          contracts,
          recipients,
          baseFee,
          blobCache,
          trackedAddresses,
          trackedSlots,
          blockNumber,
          timestamp,
        ),
      )
    }

    const { block } = await blockBuilder.build()
    const executionResult = await runBlock(executionVM, {
      block,
      root: parentBlock.header.stateRoot,
      generate: true,
      setHardfork: true,
    })
    const bal = executionResult.blockLevelAccessList!
    const correctedBlock = createBlock(
      {
        header: {
          ...block.header.toJSON(),
          stateRoot: bytesToHex(executionResult.stateRoot),
          receiptTrie: bytesToHex(executionResult.receiptsRoot),
          gasUsed: quantityHex(executionResult.gasUsed),
          logsBloom: bytesToHex(executionResult.logsBloom),
          ...(executionResult.requestsHash !== undefined
            ? { requestsHash: bytesToHex(executionResult.requestsHash) }
            : {}),
          blockAccessListHash: bytesToHex(bal.hash()),
          slotNumber: quantityHex(blockNumber - 1n),
        },
        transactions: block.transactions,
        withdrawals: block.withdrawals,
      },
      { common, freeze: false, setHardfork: true, skipConsensusFormatValidation: true },
    )

    await builderVM.blockchain.putBlock(correctedBlock)
    await executionVM.blockchain.putBlock(correctedBlock)
    parentBlock = correctedBlock

    blocksOut.push({
      blockHeader: blockHeaderJSONWithHash(correctedBlock),
      transactions: correctedBlock.transactions.map((tx) => tx.toJSON()),
      withdrawals: correctedBlock.withdrawals?.map((withdrawal) => withdrawal.toJSON()) ?? [],
      blockAccessList: bal.toJSON(),
      rlp: bytesToHex(correctedBlock.serialize()),
      blocknumber: correctedBlock.header.number.toString(),
    })

    addTrackedAddress(trackedAddresses, coinbase)
    addTrackedSlot(trackedSlots, contracts.referenceHistory, wordHex(blockNumber - 1n))
    addTrackedSlot(trackedSlots, contracts.referenceBeaconRoots, wordHex(timestamp))
    addTrackedSlot(trackedSlots, contracts.referenceBeaconRoots, wordHex(timestamp + 8191n))

    if ((blockIndex + 1) % 10 === 0 || blockIndex === blocks - 1) {
      console.log(
        `built ${blockIndex + 1}/${blocks} blocks, ${correctedBlock.transactions.length} txs, withdrawals=${withdrawals.length}`,
      )
    }
  }

  const postState: Record<string, any> = {}
  for (const address of [...trackedAddresses].sort()) {
    const account = await serializeAccount(executionVM, address, trackedSlots.get(address))
    if (account !== undefined) {
      postState[address] = account
    }
  }

  const pre = serializeGenesisAccounts(contractAccounts)
  const fixtureId =
    'tests/amsterdam/eip7928_block_level_access_lists/test_block_access_lists_large_generated_fixture[fork_Amsterdam-blockchain_test]'
  const description = [
    `Synthetic Amsterdam BAL stress fixture with ${blocks} blocks.`,
    `Each block targets a mean of ${txsPerBlock} transactions, 200 internal contract calls, and ${withdrawalsPerBlock} withdrawals.`,
    'Scenarios include legacy, EIP-2930, EIP-1559, EIP-4844, and EIP-7702 transactions; access-list warming; contract storage writes; internal CALL/DELEGATECALL/STATICCALL/precompile fanout; CREATE/CREATE2; self-destruct calls; history/beacon-root queries; and EIP-7002 withdrawal requests.',
  ].join('\n')
  const fixtureInfoHash = bytesToHex(
    keccak_256(new TextEncoder().encode(`${fixtureId}:${blocks}:${txsPerBlock}:${withdrawalsPerBlock}`)),
  )
  const fixtureInfo = {
    hash: fixtureInfoHash,
    comment: 'ethereumjs generated stress fixture',
    'filling-transition-tool': '@ethereumjs/vm buildBlock',
    description,
    url: reference.info.url,
    'fixture-format': reference.info['fixture-format'],
    'reference-spec': reference.info['reference-spec'],
    'reference-spec-version': reference.info['reference-spec-version'],
  }

  mkdirSync(path.dirname(outputPath), { recursive: true })
  const stream = createWriteStream(outputPath, { encoding: 'utf8' })

  await writeChunk(stream, '{\n')
  await writeChunk(stream, `${indent(1)}${JSON.stringify(fixtureId)}: {\n`)
  await writeChunk(stream, `${indent(2)}"network": ${JSON.stringify(reference.network)},\n`)
  await writeChunk(
    stream,
    `${indent(2)}"genesisBlockHeader": ${formatJSON(blockHeaderJSONWithHash(genesisBlock), 2)},\n`,
  )
  await writeChunk(stream, `${indent(2)}"pre": `)
  await writeKeyedObject(stream, 2, Object.entries(pre))
  await writeChunk(stream, ',\n')
  await writeChunk(stream, `${indent(2)}"lastblockhash": ${JSON.stringify(bytesToHex(parentBlock.hash()))},\n`)
  await writeChunk(stream, `${indent(2)}"config": ${formatJSON(reference.config, 2)},\n`)
  await writeChunk(stream, `${indent(2)}"genesisRLP": ${JSON.stringify(bytesToHex(genesisBlock.serialize()))},\n`)

  await writeChunk(stream, `${indent(2)}"blocks": [\n`)
  for (const [index, blockOut] of blocksOut.entries()) {
    const suffix = index === blocksOut.length - 1 ? '\n' : ',\n'
    await writeChunk(stream, `${indent(3)}${formatJSON(blockOut, 3)}${suffix}`)
  }
  await writeChunk(stream, `${indent(2)}],\n`)

  await writeChunk(stream, `${indent(2)}"postState": `)
  await writeKeyedObject(
    stream,
    2,
    [...Object.entries(postState)].sort(([left], [right]) => left.localeCompare(right)),
  )
  await writeChunk(stream, ',\n')

  await writeChunk(stream, `${indent(2)}"sealEngine": ${JSON.stringify(reference.sealEngine)},\n`)
  await writeChunk(stream, `${indent(2)}"_info": ${formatJSON(fixtureInfo, 2)}\n`)
  await writeChunk(stream, `${indent(1)}}\n`)
  await writeChunk(stream, '}\n')

  await new Promise<void>((resolve, reject) => {
    stream.on('error', reject)
    stream.end(resolve)
  })

  console.log(`wrote ${outputPath}`)
  console.log(
    `senders=${senderCount}, authorities=${authorityCount}, trackedAccounts=${trackedAddresses.size}, lastBlock=${bytesToHex(parentBlock.hash())}`,
  )
}

void main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
