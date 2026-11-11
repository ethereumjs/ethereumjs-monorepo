import type { EthySpine, WidgetSpec } from '../spine/types.ts'
import { isRpcReady } from '../tui/headerClock.ts'

export function rpcMicroscopeWidget(spine: EthySpine): WidgetSpec {
  const rpc = spine.rpc
  const endpoint = rpc?.url ?? '(not listening)'
  const readiness = isRpcReady(spine) ? 'ready' : rpc?.listening === true ? 'warming' : 'off'
  const rows: string[][] = []
  if (rpc !== undefined) {
    const methods = Object.entries(rpc.methodStats).sort((a, b) => b[1].calls - a[1].calls)
    for (const [method, stat] of methods) {
      rows.push([method, String(stat.calls), String(stat.errors), String(stat.lastLatencyMs)])
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
    headers: ['Method', 'Calls', 'Errors', 'Last ms'],
    rows,
    debugPage,
  }
}
