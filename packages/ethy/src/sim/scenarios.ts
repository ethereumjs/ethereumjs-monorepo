import type { ScenarioId, ScenarioParams, ScenarioSpec } from './types.ts'

export const ALL_SCENARIO_IDS: ScenarioId[] = [
  'thundering-herd-age-cliff',
  'laptop-every-3-days',
  'flash-crowd-launch',
  'low-density-dht-bootstrap',
  'minter-crash-failover',
  'fake-minter-suppression',
  'cross-snapshot-churn',
  'total-swarm-hibernation',
  'seeder-bandwidth-cap',
  'long-horizon-soak',
]

export const SCENARIO_SPECS: Record<ScenarioId, ScenarioSpec> = {
  'thundering-herd-age-cliff': {
    id: 'thundering-herd-age-cliff',
    description: 'O(N) SNAP stampede past age cliff',
    ci: {
      nodes: 25,
      virtualDays: 0,
      seeders: 1,
      joiners: 24,
      snapCap: 4,
      stopBlocksPastPivot: 2200n,
    },
    demo: { nodes: 201, virtualDays: 7, seeders: 1, joiners: 200, snapCap: 4 },
  },
  'laptop-every-3-days': {
    id: 'laptop-every-3-days',
    description: 'Intermittent laptops + RAM BAL tail gaps',
    ci: { nodes: 20, virtualDays: 4, seeders: 4, joiners: 16 },
    demo: { nodes: 180, virtualDays: 14, seeders: 30, joiners: 150 },
  },
  'flash-crowd-launch': {
    id: 'flash-crowd-launch',
    description: 'Bucket striping amplification',
    ci: { nodes: 16, virtualDays: 0, seeders: 1, joiners: 15, seederMegabitsPerSec: 50 },
    demo: { nodes: 201, virtualDays: 0, seeders: 1, joiners: 200, seederMegabitsPerSec: 50 },
  },
  'low-density-dht-bootstrap': {
    id: 'low-density-dht-bootstrap',
    description: 'Sparse DHT vs SNAP grace lock',
    ci: { nodes: 16, virtualDays: 0, ethyInDht: 6, backboneDht: 600, joiners: 16 },
    demo: { nodes: 70, virtualDays: 0, ethyInDht: 20, backboneDht: 2000, joiners: 50 },
  },
  'minter-crash-failover': {
    id: 'minter-crash-failover',
    description: 'Partial minter crash stalls legacy swarm',
    ci: { nodes: 12, virtualDays: 1, seeders: 2, joiners: 10 },
    demo: { nodes: 40, virtualDays: 3, seeders: 4, joiners: 36 },
  },
  'fake-minter-suppression': {
    id: 'fake-minter-suppression',
    description: 'Byzantine mask-zero advertisers',
    ci: { nodes: 25, virtualDays: 1, joiners: 20 },
    demo: { nodes: 50, virtualDays: 2, joiners: 45 },
  },
  'cross-snapshot-churn': {
    id: 'cross-snapshot-churn',
    description: 'Mixed generation seeders',
    ci: { nodes: 24, virtualDays: 1, seeders: 6, joiners: 18 },
    demo: { nodes: 80, virtualDays: 3, seeders: 20, joiners: 60 },
  },
  'total-swarm-hibernation': {
    id: 'total-swarm-hibernation',
    description: 'Mass wake after long offline',
    ci: { nodes: 20, virtualDays: 0, stopBlocksPastPivot: 28_800n },
    demo: { nodes: 100, virtualDays: 0, stopBlocksPastPivot: 28_800n },
  },
  'seeder-bandwidth-cap': {
    id: 'seeder-bandwidth-cap',
    description: 'Slow uplink limits amplification',
    ci: { nodes: 13, virtualDays: 0, seeders: 1, joiners: 12, seederMegabitsPerSec: 20 },
    demo: { nodes: 51, virtualDays: 0, seeders: 1, joiners: 50, seederMegabitsPerSec: 20 },
  },
  'long-horizon-soak': {
    id: 'long-horizon-soak',
    description: 'Heterogeneous mix stability',
    ci: { nodes: 20, virtualDays: 2 },
    demo: { nodes: 200, virtualDays: 30 },
  },
}

export function resolveScenarioParams(id: ScenarioId, scale: 'ci' | 'demo'): ScenarioParams {
  return scale === 'ci' ? SCENARIO_SPECS[id].ci : SCENARIO_SPECS[id].demo
}
