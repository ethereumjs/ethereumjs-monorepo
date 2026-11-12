import { bytesToHex } from '@ethereumjs/util'

import { ethyKeccak256 } from '../crypto/keccak.ts'

export type CatalogParam = {
  name: string
  type: string
  unit?: 'wei'
}

export type FunctionCatalogEntry = {
  name: string
  signature: string
  selector: string
  params: CatalogParam[]
}

export type EventCatalogEntry = {
  name: string
  signature: string
  topic0: string
  indexedParams: CatalogParam[]
  dataParams: CatalogParam[]
}

const FUNCTION_SIGNATURES: Array<{ name: string; signature: string; params: CatalogParam[] }> = [
  {
    name: 'transfer',
    signature: 'transfer(address,uint256)',
    params: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
  },
  {
    name: 'transferFrom',
    signature: 'transferFrom(address,address,uint256)',
    params: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
  },
  {
    name: 'approve',
    signature: 'approve(address,uint256)',
    params: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
  },
  {
    name: 'balanceOf',
    signature: 'balanceOf(address)',
    params: [{ name: 'owner', type: 'address' }],
  },
  {
    name: 'allowance',
    signature: 'allowance(address,address)',
    params: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
  },
  { name: 'totalSupply', signature: 'totalSupply()', params: [] },
  { name: 'name', signature: 'name()', params: [] },
  { name: 'symbol', signature: 'symbol()', params: [] },
  { name: 'decimals', signature: 'decimals()', params: [] },
  {
    name: 'permit',
    signature: 'permit(address,address,uint256,uint256,uint8,bytes32,bytes32)',
    params: [],
  },
  {
    name: 'mint',
    signature: 'mint(address,uint256)',
    params: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
  },
  { name: 'burn', signature: 'burn(uint256)', params: [{ name: 'amount', type: 'uint256' }] },
  { name: 'deposit', signature: 'deposit()', params: [] },
  { name: 'withdraw', signature: 'withdraw(uint256)', params: [{ name: 'wad', type: 'uint256' }] },
  {
    name: 'ownerOf',
    signature: 'ownerOf(uint256)',
    params: [{ name: 'tokenId', type: 'uint256' }],
  },
  {
    name: 'safeTransferFrom',
    signature: 'safeTransferFrom(address,address,uint256)',
    params: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
  },
  {
    name: 'safeTransferFrom',
    signature: 'safeTransferFrom(address,address,uint256,bytes)',
    params: [],
  },
  { name: 'setApprovalForAll', signature: 'setApprovalForAll(address,bool)', params: [] },
  { name: 'balanceOfBatch', signature: 'balanceOfBatch(address[],uint256[])', params: [] },
  {
    name: 'safeBatchTransferFrom',
    signature: 'safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)',
    params: [],
  },
  { name: 'swap', signature: 'swap(uint256,uint256,address,bytes)', params: [] },
  { name: 'swap', signature: 'swap(address,bool,int256,uint160,bytes)', params: [] },
  { name: 'execute', signature: 'execute(bytes,bytes[])', params: [] },
  {
    name: 'exactInputSingle',
    signature: 'exactInputSingle((address,address,uint24,address,uint256,uint256,uint160))',
    params: [],
  },
  { name: 'exactInput', signature: 'exactInput((bytes,address,uint256,uint256))', params: [] },
  {
    name: 'swapExactTokensForTokens',
    signature: 'swapExactTokensForTokens(uint256,uint256,address[],address,uint256)',
    params: [],
  },
  {
    name: 'swapExactETHForTokens',
    signature: 'swapExactETHForTokens(uint256,address[],address,uint256)',
    params: [],
  },
  {
    name: 'swapExactTokensForETH',
    signature: 'swapExactTokensForETH(uint256,uint256,address[],address,uint256)',
    params: [],
  },
  { name: 'getReserves', signature: 'getReserves()', params: [] },
  { name: 'slot0', signature: 'slot0()', params: [] },
  { name: 'liquidity', signature: 'liquidity()', params: [] },
  {
    name: 'handleOps',
    signature:
      'handleOps((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes)[],address)',
    params: [],
  },
  {
    name: 'handleAggregatedOps',
    signature:
      'handleAggregatedOps((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes)[],address)',
    params: [],
  },
  {
    name: 'validateUserOp',
    signature:
      'validateUserOp((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes),bytes32,uint256)',
    params: [],
  },
  {
    name: 'execTransaction',
    signature:
      'execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)',
    params: [],
  },
  {
    name: 'upgradeTo',
    signature: 'upgradeTo(address)',
    params: [{ name: 'newImplementation', type: 'address' }],
  },
  { name: 'upgradeToAndCall', signature: 'upgradeToAndCall(address,bytes)', params: [] },
  { name: 'propose', signature: 'propose(address[],uint256[],bytes[],string)', params: [] },
  { name: 'castVote', signature: 'castVote(uint256,uint8)', params: [] },
  { name: 'supply', signature: 'supply(address,uint256,address,uint16)', params: [] },
  { name: 'borrow', signature: 'borrow(address,uint256,uint256,uint16,address)', params: [] },
  { name: 'repay', signature: 'repay(address,uint256,uint256,address)', params: [] },
  {
    name: 'liquidationCall',
    signature: 'liquidationCall(address,address,address,uint256,bool)',
    params: [],
  },
  { name: 'depositETH', signature: 'depositETH(uint32,address)', params: [] },
  {
    name: 'finalizeWithdrawalTransaction',
    signature:
      'finalizeWithdrawalTransaction((uint256,address,address,uint256,uint256,bytes,bytes))',
    params: [],
  },
  {
    name: 'proveWithdrawalTransaction',
    signature:
      'proveWithdrawalTransaction((uint256,address,address,uint256,uint256,bytes,bytes),uint256,(bytes32[],uint256,uint256,uint256))',
    params: [],
  },
  { name: 'multiCall', signature: 'multicall(bytes[])', params: [] },
  { name: 'aggregate', signature: 'aggregate((address,bytes)[])', params: [] },
  { name: 'flash', signature: 'flash(address,uint256,uint256,bytes)', params: [] },
  { name: 'mint', signature: 'mint(address,int24,int24,uint128,bytes)', params: [] },
  { name: 'burn', signature: 'burn(address,int24,int24,uint128)', params: [] },
  { name: 'exchange', signature: 'exchange(int128,int128,uint256,uint256)', params: [] },
  { name: 'addLiquidity', signature: 'addLiquidity(address,uint256,uint256,uint256)', params: [] },
  {
    name: 'removeLiquidity',
    signature: 'removeLiquidity(uint256,uint256,uint256,address,uint256)',
    params: [],
  },
  {
    name: 'swap',
    signature: 'swap((address,address,address,address,uint256,uint256,uint256,bytes))',
    params: [],
  },
]

const EVENT_SIGNATURES: Array<{
  name: string
  signature: string
  indexedParams: CatalogParam[]
  dataParams: CatalogParam[]
}> = [
  {
    name: 'Transfer',
    signature: 'Transfer(address,address,uint256)',
    indexedParams: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
    ],
    dataParams: [{ name: 'value', type: 'uint256' }],
  },
  {
    name: 'Approval',
    signature: 'Approval(address,address,uint256)',
    indexedParams: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    dataParams: [{ name: 'value', type: 'uint256' }],
  },
  {
    name: 'Transfer',
    signature: 'Transfer(address,address,uint256,uint256)',
    indexedParams: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    dataParams: [],
  },
  {
    name: 'Swap',
    signature: 'Swap(address,uint256,uint256,uint256,uint256,address)',
    indexedParams: [{ name: 'sender', type: 'address' }],
    dataParams: [
      { name: 'amount0In', type: 'uint256' },
      { name: 'amount1In', type: 'uint256' },
      { name: 'amount0Out', type: 'uint256' },
      { name: 'amount1Out', type: 'uint256' },
      { name: 'to', type: 'address' },
    ],
  },
  {
    name: 'Swap',
    signature: 'Swap(address,address,int256,int256,uint160,uint128,int24)',
    indexedParams: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
    ],
    dataParams: [
      { name: 'amount0', type: 'int256' },
      { name: 'amount1', type: 'int256' },
    ],
  },
  {
    name: 'Sync',
    signature: 'Sync(uint112,uint112)',
    indexedParams: [],
    dataParams: [
      { name: 'reserve0', type: 'uint112' },
      { name: 'reserve1', type: 'uint112' },
    ],
  },
  {
    name: 'UserOperationEvent',
    signature: 'UserOperationEvent(bytes32,address,address,uint256,bool,uint256,uint256)',
    indexedParams: [
      { name: 'userOpHash', type: 'bytes32' },
      { name: 'sender', type: 'address' },
      { name: 'paymaster', type: 'address' },
    ],
    dataParams: [
      { name: 'nonce', type: 'uint256' },
      { name: 'success', type: 'bool' },
      { name: 'actualGasCost', type: 'uint256' },
      { name: 'actualGasUsed', type: 'uint256' },
    ],
  },
  {
    name: 'TransferSingle',
    signature: 'TransferSingle(address,address,address,uint256,uint256)',
    indexedParams: [
      { name: 'operator', type: 'address' },
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
    ],
    dataParams: [
      { name: 'id', type: 'uint256' },
      { name: 'value', type: 'uint256' },
    ],
  },
  {
    name: 'Upgraded',
    signature: 'Upgraded(address)',
    indexedParams: [{ name: 'implementation', type: 'address' }],
    dataParams: [],
  },
  {
    name: 'Deposit',
    signature: 'Deposit(address,uint256)',
    indexedParams: [{ name: 'sender', type: 'address' }],
    dataParams: [{ name: 'amount', type: 'uint256' }],
  },
  {
    name: 'Withdrawal',
    signature: 'Withdrawal(address,uint256)',
    indexedParams: [{ name: 'receiver', type: 'address' }],
    dataParams: [{ name: 'amount', type: 'uint256' }],
  },
]

function selectorFromSignature(signature: string): string {
  const hash = ethyKeccak256(new TextEncoder().encode(signature))
  return bytesToHex(hash.subarray(0, 4))
}

function topic0FromSignature(signature: string): string {
  const hash = ethyKeccak256(new TextEncoder().encode(signature))
  return bytesToHex(hash)
}

function buildFunctionCatalog(): FunctionCatalogEntry[] {
  const seen = new Set<string>()
  const out: FunctionCatalogEntry[] = []
  for (const row of FUNCTION_SIGNATURES) {
    const selector = selectorFromSignature(row.signature)
    if (seen.has(selector)) continue
    seen.add(selector)
    out.push({
      name: row.name,
      signature: row.signature,
      selector,
      params: row.params,
    })
  }
  return out
}

function buildEventCatalog(): EventCatalogEntry[] {
  const seen = new Set<string>()
  const out: EventCatalogEntry[] = []
  for (const row of EVENT_SIGNATURES) {
    const topic0 = topic0FromSignature(row.signature)
    if (seen.has(topic0)) continue
    seen.add(topic0)
    out.push({
      name: row.name,
      signature: row.signature,
      topic0,
      indexedParams: row.indexedParams,
      dataParams: row.dataParams,
    })
  }
  return out
}

export const FUNCTION_CATALOG = buildFunctionCatalog()
export const EVENT_CATALOG = buildEventCatalog()

const SELECTOR_MAP = new Map<string, FunctionCatalogEntry>()
for (const row of FUNCTION_CATALOG) {
  SELECTOR_MAP.set(row.selector.toLowerCase(), row)
}

const TOPIC_MAP = new Map<string, EventCatalogEntry>()
for (const row of EVENT_CATALOG) {
  TOPIC_MAP.set(row.topic0.toLowerCase(), row)
}

export function lookupFunctionSelector(selectorHex: string): FunctionCatalogEntry | undefined {
  const key = selectorHex.startsWith('0x')
    ? selectorHex.toLowerCase()
    : `0x${selectorHex}`.toLowerCase()
  return SELECTOR_MAP.get(key)
}

export function lookupEventTopic0(topicHex: string): EventCatalogEntry | undefined {
  const key = topicHex.startsWith('0x') ? topicHex.toLowerCase() : `0x${topicHex}`.toLowerCase()
  return TOPIC_MAP.get(key)
}

/** Keccak selector for tests and external checks. */
export function catalogSelectorForSignature(signature: string): string {
  return selectorFromSignature(signature)
}

export function catalogTopic0ForSignature(signature: string): string {
  return topic0FromSignature(signature)
}

/** Well-known selectors used in interface rules. */
export const SELECTOR = {
  transfer: catalogSelectorForSignature('transfer(address,uint256)'),
  transferFrom: catalogSelectorForSignature('transferFrom(address,address,uint256)'),
  approve: catalogSelectorForSignature('approve(address,uint256)'),
  balanceOf: catalogSelectorForSignature('balanceOf(address)'),
  ownerOf: catalogSelectorForSignature('ownerOf(uint256)'),
  deposit: catalogSelectorForSignature('deposit()'),
  withdraw: catalogSelectorForSignature('withdraw(uint256)'),
  swapV2: catalogSelectorForSignature('swap(uint256,uint256,address,bytes)'),
  swapV3: catalogSelectorForSignature('swap(address,bool,int256,uint160,bytes)'),
  execute: catalogSelectorForSignature('execute(bytes,bytes[])'),
  getReserves: catalogSelectorForSignature('getReserves()'),
  slot0: catalogSelectorForSignature('slot0()'),
  liquidity: catalogSelectorForSignature('liquidity()'),
  handleOps: catalogSelectorForSignature(
    'handleOps((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes)[],address)',
  ),
  validateUserOp: catalogSelectorForSignature(
    'validateUserOp((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes),bytes32,uint256)',
  ),
  balanceOfBatch: catalogSelectorForSignature('balanceOfBatch(address[],uint256[])'),
  exactInputSingle: catalogSelectorForSignature(
    'exactInputSingle((address,address,uint24,address,uint256,uint256,uint160))',
  ),
  swapExactTokensForTokens: catalogSelectorForSignature(
    'swapExactTokensForTokens(uint256,uint256,address[],address,uint256)',
  ),
}

export const TOPIC = {
  transferErc20: catalogTopic0ForSignature('Transfer(address,address,uint256)'),
  transferErc721: catalogTopic0ForSignature('Transfer(address,address,uint256,uint256)'),
  swapV2: catalogTopic0ForSignature('Swap(address,uint256,uint256,uint256,uint256,address)'),
  swapV3: catalogTopic0ForSignature('Swap(address,address,int256,int256,uint160,uint128,int24)'),
  sync: catalogTopic0ForSignature('Sync(uint112,uint112)'),
  userOperationEvent: catalogTopic0ForSignature(
    'UserOperationEvent(bytes32,address,address,uint256,bool,uint256,uint256)',
  ),
  transferSingle: catalogTopic0ForSignature(
    'TransferSingle(address,address,address,uint256,uint256)',
  ),
  upgradedEip1967: catalogTopic0ForSignature('Upgraded(address)'),
}

export const EIP1967_IMPLEMENTATION_SLOT =
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
export const EIP1967_BEACON_SLOT =
  '0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50'
