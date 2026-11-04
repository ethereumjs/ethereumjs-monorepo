import { Common, Holesky, Hoodi, Mainnet, Sepolia } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'

import { createBeaconLightClient } from '../client.ts'
import { LightClientRunner } from '../runner.ts'
import { BeaconLightStore, defaultLightClientPath } from '../store.ts'
import { BeaconLightTransport } from '../transport.ts'

import { parseBeaconLightArgs, printBeaconLightUsage } from './args.ts'
import { buildDemoScenario } from './demo.ts'

function chainForNetwork(network: string) {
  switch (network) {
    case 'mainnet':
      return Mainnet
    case 'hoodi':
      return Hoodi
    case 'holesky':
      return Holesky
    default:
      return Sepolia
  }
}

function shortHash(bytes: Uint8Array): string {
  const hex = bytesToHex(bytes)
  return `${hex.slice(0, 8)}…${hex.slice(-6)}`
}

async function runDemo(network: string): Promise<void> {
  const chain = chainForNetwork(network)
  const common = new Common({ chain })
  const client = createBeaconLightClient({ common })
  const { bootstrap, optimisticUpdate } = buildDemoScenario(common)
  client.bootstrap(bootstrap)
  const t0 = performance.now()
  client.applyOptimisticUpdate(optimisticUpdate)
  const elapsedMs = (performance.now() - t0).toFixed(1)
  const head = client.getHeadExecution()
  const fin = client.getFinalizedExecution()
  const pct = (((head?.participantCount ?? 0) / 512) * 100).toFixed(1)
  const elLabel =
    head !== undefined && head.blockNumber > 0
      ? `EL #${head.blockNumber.toLocaleString('en-US')} ${shortHash(head.blockHash)}`
      : `EL ${shortHash(head?.blockHash ?? new Uint8Array(32))}`
  console.log(
    `[demo] ${network} · Slot ${(head?.slot ?? 0).toLocaleString('en-US')} · BLS ${head?.participantCount ?? 0}/512 (${pct}%) in ${elapsedMs}ms · ${elLabel} · finalized slot ${(fin?.slot ?? 0).toLocaleString('en-US')} · offline BLS path OK`,
  )
}

async function runOnce(cli: ReturnType<typeof parseBeaconLightArgs>): Promise<void> {
  const chain = chainForNetwork(cli.network)
  const common = new Common({ chain })
  const storePath = cli.storePath ?? defaultLightClientPath(cli.network)
  const client = createBeaconLightClient({ common })
  const transport = new BeaconLightTransport({
    common,
    overrideEndpoint: cli.beaconUrl,
  })
  const runner = new LightClientRunner({
    common,
    client,
    transport,
    store: new BeaconLightStore(storePath),
  })
  await runner.ensureBootstrapped(cli.checkpoint)
  await runner.catchUpUpdates(4)
  const poll = await runner.pollOnce()
  const head = client.getHeadExecution()
  const fin = client.getFinalizedExecution()
  const summary = {
    network: cli.network,
    endpoint: transport.activeEndpoint,
    poll,
    optimistic: head
      ? {
          slot: head.slot,
          blockNumber: head.blockNumber,
          blockHash: bytesToHex(head.blockHash),
          participantCount: head.participantCount,
        }
      : undefined,
    finalized: fin
      ? {
          slot: fin.slot,
          blockNumber: fin.blockNumber,
          blockHash: bytesToHex(fin.blockHash),
        }
      : undefined,
  }
  console.log(JSON.stringify(summary, null, 2))
}

async function runLive(cli: ReturnType<typeof parseBeaconLightArgs>): Promise<void> {
  const chain = chainForNetwork(cli.network)
  const common = new Common({ chain })
  const storePath = cli.storePath ?? defaultLightClientPath(cli.network)
  const client = createBeaconLightClient({ common })
  const transport = new BeaconLightTransport({
    common,
    overrideEndpoint: cli.beaconUrl,
  })
  const store = new BeaconLightStore(storePath)
  const runner = new LightClientRunner({ common, client, transport, store })
  await runner.ensureBootstrapped(cli.checkpoint)
  await runner.catchUpUpdates(8)

  const cfg = common.beaconLightClient()!
  const slotMs = cfg.secondsPerSlot * 1000
  console.log(
    `\x1b[1mBeacon light client\x1b[0m · ${cli.network} · period sync committee · ${cfg.defaultEndpoints.length} endpoints\n`,
  )

  const shutdown = () => {
    runner.persist()
    process.exit(0)
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  for (;;) {
    const poll = await runner.pollOnce()
    const head = client.getHeadExecution()
    const fin = client.getFinalizedExecution()
    const period = common.syncCommitteePeriodAtSlot(head?.slot ?? fin?.slot ?? 0)
    const endpoint = transport.activeEndpoint ?? '—'
    if (poll.error !== undefined) {
      console.log(`\x1b[33m! ${poll.error}\x1b[0m (${endpoint})`)
    } else if (head !== undefined) {
      const pct = ((poll.participantCount / 512) * 100).toFixed(1)
      if (head.blockNumber > 0) {
        const lag =
          fin !== undefined && head.blockNumber > fin.blockNumber
            ? head.blockNumber - fin.blockNumber
            : 0
        console.log(
          `Slot ${head.slot.toLocaleString('en-US')} · BLS ${poll.participantCount}/512 (${pct}%) · EL #${head.blockNumber.toLocaleString('en-US')} ${shortHash(head.blockHash)} · finalized #${fin?.blockNumber.toLocaleString('en-US') ?? '—'} (-${lag} blk) · period ${period} · ${endpoint}`,
        )
      } else {
        const slotLag = fin !== undefined && head.slot > fin.slot ? head.slot - fin.slot : 0
        console.log(
          `Slot ${head.slot.toLocaleString('en-US')} · BLS ${poll.participantCount}/512 (${pct}%) · EL ${shortHash(head.blockHash)} · finalized slot ${fin?.slot.toLocaleString('en-US') ?? '—'} (-${slotLag} slots) · period ${period} · ${endpoint}`,
        )
      }
    }
    await new Promise((r) => setTimeout(r, slotMs))
  }
}

async function main(): Promise<void> {
  let cli
  try {
    cli = parseBeaconLightArgs(process.argv)
  } catch (e: unknown) {
    const msg = (e as Error).message
    if (msg === 'HELP') {
      process.stdout.write(printBeaconLightUsage())
      process.exit(0)
    }
    process.stderr.write(`${msg}\n\n${printBeaconLightUsage()}`)
    process.exit(1)
  }

  if (cli.demo) {
    await runDemo(cli.network)
    return
  }
  if (cli.once) {
    await runOnce(cli)
    return
  }
  await runLive(cli)
}

main().catch((err: unknown) => {
  process.stderr.write(`${(err as Error).message}\n`)
  process.exit(1)
})
