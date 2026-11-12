import { isNodeAtChainHead } from '../spine/chainHead.ts'
import type { EthySpine, WidgetSpec } from '../spine/types.ts'
import { DIM, FG, RESET } from '../tui/ansi.ts'
import { isRpcReady } from '../tui/headerClock.ts'

type RpcGroupId =
  | 'chain_net'
  | 'head_state'
  | 'window_64'
  | 'fee_oracle'
  | 'evm_sandbox'
  | 'tx_broadcast'
  | 'ethy_native'

type RpcGroupDef = {
  id: RpcGroupId
  label: string
  methods: string[]
  methodSummary: string
}

const RPC_GROUPS: RpcGroupDef[] = [
  {
    id: 'chain_net',
    label: 'Chain & Net',
    methods: [
      'eth_chainId',
      'eth_syncing',
      'eth_blockNumber',
      'net_version',
      'net_listening',
      'net_peerCount',
      'web3_clientVersion',
      'web3_sha3',
    ],
    methodSummary: 'eth_chainId, eth_syncing, eth_blockNumber, net_*, web3_*',
  },
  {
    id: 'head_state',
    label: 'Head State',
    methods: ['eth_getBalance', 'eth_getCode', 'eth_getStorageAt', 'eth_getTransactionCount'],
    methodSummary: 'eth_getBalance, eth_getCode, eth_getStorageAt, eth_getTransactionCount',
  },
  {
    id: 'window_64',
    label: '64b Window',
    methods: [
      'eth_getBlockByNumber',
      'eth_getBlockByHash',
      'eth_getBlockTransactionCountByNumber',
      'eth_getBlockTransactionCountByHash',
      'eth_getTransactionByHash',
      'eth_getTransactionByBlockNumberAndIndex',
      'eth_getTransactionByBlockHashAndIndex',
      'eth_getTransactionReceipt',
      'eth_getBlockReceipts',
      'eth_getLogs',
    ],
    methodSummary: 'eth_getBlockBy*, eth_getTxBy*, eth_getTransactionReceipt, eth_getLogs',
  },
  {
    id: 'fee_oracle',
    label: 'Fee Oracle',
    methods: ['eth_gasPrice', 'eth_maxPriorityFeePerGas', 'eth_blobBaseFee', 'eth_feeHistory'],
    methodSummary: 'eth_gasPrice, eth_maxPriorityFeePerGas, eth_blobBaseFee, eth_feeHistory',
  },
  {
    id: 'evm_sandbox',
    label: 'EVM Sandbox',
    methods: ['eth_call', 'eth_estimateGas', 'eth_createAccessList'],
    methodSummary: 'eth_call, eth_estimateGas, eth_createAccessList',
  },
  {
    id: 'tx_broadcast',
    label: 'Tx Broadcast',
    methods: ['eth_sendRawTransaction'],
    methodSummary: 'eth_sendRawTransaction',
  },
  {
    id: 'ethy_native',
    label: 'Ethy Native',
    methods: [
      'eth_getBlockAccessListByNumber',
      'eth_getBlockAccessListByHash',
      'ethy_status',
      'ethy_economy',
    ],
    methodSummary: 'eth_getBlockAccessListBy*, ethy_status, ethy_economy',
  },
]

type GroupStatusKind = 'active' | 'warming' | 'awaiting' | 'no_peers' | 'off'

function formatGroupStatus(kind: GroupStatusKind): string {
  switch (kind) {
    case 'active':
      return `${FG.green}● active${RESET}`
    case 'warming':
      return `${FG.yellow}◐ warming${RESET}`
    case 'awaiting':
      return `${FG.yellow}◐ awaiting${RESET}`
    case 'no_peers':
      return `${FG.yellow}◐ no peers${RESET}`
  }
  return `${DIM}○ off${RESET}`
}

function groupStatus(
  spine: EthySpine,
  group: RpcGroupDef,
  listening: boolean,
): { kind: GroupStatusKind; display: string } {
  if (!listening) {
    return { kind: 'off', display: formatGroupStatus('off') }
  }
  const atHeadOrAccounts =
    spine.totalAccountsSynced > 0 || isNodeAtChainHead(spine) || spine.demoClock === true
  const hasBlocks = spine.economy?.hasBlocks === true
  const hasPeers = spine.peers.size > 0 || spine.demoClock === true

  switch (group.id) {
    case 'chain_net':
    case 'ethy_native':
      return { kind: 'active', display: formatGroupStatus('active') }
    case 'head_state':
    case 'evm_sandbox':
      return atHeadOrAccounts
        ? { kind: 'active', display: formatGroupStatus('active') }
        : { kind: 'warming', display: formatGroupStatus('warming') }
    case 'window_64':
    case 'fee_oracle':
      return hasBlocks
        ? { kind: 'active', display: formatGroupStatus('active') }
        : { kind: 'awaiting', display: formatGroupStatus('awaiting') }
    case 'tx_broadcast':
      return hasPeers
        ? { kind: 'active', display: formatGroupStatus('active') }
        : { kind: 'no_peers', display: formatGroupStatus('no_peers') }
    default:
      return { kind: 'off', display: formatGroupStatus('off') }
  }
}

function sumCalls(spine: EthySpine, methods: string[]): number {
  const stats = spine.rpc?.methodStats ?? {}
  let total = 0
  for (const m of methods) {
    total += stats[m]?.calls ?? 0
  }
  return total
}

export type RpcGroupRow = {
  label: string
  statusDisplay: string
  methodSummary: string
  calls: number
}

export function rpcGroupRows(spine: EthySpine): RpcGroupRow[] {
  const listening = spine.rpc?.listening === true
  return RPC_GROUPS.map((group) => {
    const { display } = groupStatus(spine, group, listening)
    return {
      label: group.label,
      statusDisplay: display,
      methodSummary: group.methodSummary,
      calls: listening ? sumCalls(spine, group.methods) : 0,
    }
  })
}

export function rpcMicroscopeWidget(spine: EthySpine): WidgetSpec {
  const rpc = spine.rpc
  const endpoint = rpc?.url ?? '(not listening)'
  const readiness = isRpcReady(spine) ? 'ready' : rpc?.listening === true ? 'warming' : 'off'
  const groups = rpcGroupRows(spine)
  const rows: string[][] = groups.map((g) => [
    g.label,
    g.statusDisplay,
    g.methodSummary,
    String(g.calls),
  ])
  const statRows: string[][] = []
  if (rpc !== undefined) {
    const methods = Object.entries(rpc.methodStats).sort((a, b) => b[1].calls - a[1].calls)
    for (const [method, stat] of methods) {
      statRows.push([method, String(stat.calls), String(stat.errors), String(stat.lastLatencyMs)])
    }
  }
  const debugPage =
    rpc !== undefined
      ? [
          {
            title: 'Recent calls',
            entries: rpc.recentCalls.slice(0, 16).map((c) => ({
              key: c.method,
              value: `${c.status} ${c.durationMs}ms`,
            })),
          },
          {
            title: 'Examples',
            entries: [
              {
                key: 'curl chainId',
                value: `curl -s ${endpoint} -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'`,
              },
              {
                key: 'cast block',
                value: `cast block-number --rpc-url ${endpoint}`,
              },
            ],
          },
        ]
      : undefined
  return {
    kind: 'table',
    title: 'JSON-RPC',
    preface: [
      { key: 'Endpoint', value: endpoint },
      { key: 'Readiness', value: readiness },
      {
        key: 'Total requests',
        value: rpc !== undefined ? String(rpc.totalRequests) : '0',
      },
    ],
    headers: ['Group', 'Status', 'Methods', 'Calls'],
    rows,
    secondaryTable:
      statRows.length > 0
        ? {
            title: 'Called methods',
            headers: ['Method', 'Calls', 'Errors', 'Last ms'],
            rows: statRows,
          }
        : undefined,
    debugPage,
  }
}
