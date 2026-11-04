import type { BeaconLightClientConfig } from './types.ts'

const BEACON_TIMING = {
  secondsPerSlot: 12,
  slotsPerEpoch: 32,
  epochsPerSyncCommitteePeriod: 256,
} as const

/** @internal shared beacon light-client block for Mainnet */
export const mainnetBeaconLightClient: BeaconLightClientConfig = {
  genesisTime: 1606824023,
  genesisValidatorsRoot: '0x4b363db94e286120d76eb905340fdd4e54bfe9f06bf33ff6cf5ad27f511bfe95',
  ...BEACON_TIMING,
  forks: [
    { name: 'phase0', epoch: 0, version: '0x00000000' },
    { name: 'altair', epoch: 74240, version: '0x01000000' },
    { name: 'bellatrix', epoch: 144896, version: '0x02000000' },
    { name: 'capella', epoch: 194048, version: '0x03000000' },
    { name: 'deneb', epoch: 269568, version: '0x04000000' },
    { name: 'electra', epoch: 364032, version: '0x05000000' },
    { name: 'osaka', epoch: 411392, version: '0x06000000' },
  ],
  defaultEndpoints: [
    'https://lodestar-mainnet.chainsafe.io',
    'https://ethereum-beacon-api.publicnode.com',
  ],
}

/** @internal shared beacon light-client block for Sepolia */
export const sepoliaBeaconLightClient: BeaconLightClientConfig = {
  genesisTime: 1655733600,
  genesisValidatorsRoot: '0xd8ea171f3c94aea21ebc42a1ed61052acf3f9209c00e4efbaaddac09ed9b8078',
  ...BEACON_TIMING,
  forks: [
    { name: 'phase0', epoch: 0, version: '0x90000069' },
    { name: 'altair', epoch: 50, version: '0x90000070' },
    { name: 'bellatrix', epoch: 100, version: '0x90000071' },
    { name: 'capella', epoch: 56832, version: '0x90000072' },
    { name: 'deneb', epoch: 132608, version: '0x90000073' },
    { name: 'electra', epoch: 222464, version: '0x90000074' },
    { name: 'osaka', epoch: 272640, version: '0x90000075' },
    { name: 'amsterdam', epoch: 353024, version: '0x90000076' },
  ],
  defaultEndpoints: [
    'https://lodestar-sepolia.chainsafe.io',
    'https://ethereum-sepolia-beacon-api.publicnode.com',
  ],
}

/** @internal shared beacon light-client block for Holesky */
export const holeskyBeaconLightClient: BeaconLightClientConfig = {
  genesisTime: 1695902400,
  genesisValidatorsRoot: '0x9143aa7c615a7f7115e2b6aac319c03529df8242ae705fba9df39b79c59fa8b1',
  ...BEACON_TIMING,
  forks: [
    { name: 'phase0', epoch: 0, version: '0x01017000' },
    { name: 'altair', epoch: 0, version: '0x02017000' },
    { name: 'bellatrix', epoch: 0, version: '0x03017000' },
    { name: 'capella', epoch: 256, version: '0x04017000' },
    { name: 'deneb', epoch: 29696, version: '0x05017000' },
    { name: 'electra', epoch: 115968, version: '0x06017000' },
    { name: 'osaka', epoch: 165120, version: '0x07017000' },
  ],
  defaultEndpoints: [
    'https://lodestar-holesky.chainsafe.io',
    'https://ethereum-holesky-beacon-api.publicnode.com',
  ],
}

/** @internal shared beacon light-client block for Hoodi */
export const hoodiBeaconLightClient: BeaconLightClientConfig = {
  genesisTime: 1742213400,
  genesisValidatorsRoot: '0x212f13fc4df078b6cb7db228f1c8307566dcecf900867401a92023d7ba99cb5f',
  ...BEACON_TIMING,
  forks: [
    { name: 'phase0', epoch: 0, version: '0x10000910' },
    { name: 'altair', epoch: 0, version: '0x20000910' },
    { name: 'bellatrix', epoch: 0, version: '0x30000910' },
    { name: 'capella', epoch: 0, version: '0x40000910' },
    { name: 'deneb', epoch: 0, version: '0x50000910' },
    { name: 'electra', epoch: 2048, version: '0x60000910' },
    { name: 'osaka', epoch: 50688, version: '0x70000910' },
  ],
  defaultEndpoints: [
    'https://lodestar-hoodi.chainsafe.io',
    'https://ethereum-hoodi-beacon-api.publicnode.com',
  ],
}
