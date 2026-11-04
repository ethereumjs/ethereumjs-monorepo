import type { Common } from '@ethereumjs/common'
import { EthereumJSErrorWithoutCode, bytesToHex } from '@ethereumjs/util'
import { sha256 as nobleSha256 } from '@noble/hashes/sha2.js'

import { hashTreeRootBeaconBlockHeader } from './ssz.ts'
import type { Sha256Fn } from './ssz.ts'
import {
  parseLightClientBootstrapJson,
  parseLightClientFinalityUpdateJson,
  parseLightClientOptimisticUpdateJson,
  parseLightClientUpdateJson,
  parseLightClientUpdatesJson,
} from './wire.ts'

import type {
  LightClientBootstrap,
  LightClientFinalityUpdate,
  LightClientOptimisticUpdate,
  LightClientUpdate,
} from './types.ts'

export type FetchImpl = (input: string | URL, init?: RequestInit) => Promise<Response>

export type BeaconLightTransportOpts = {
  common: Common
  /** Tried before `defaultEndpoints`. */
  overrideEndpoint?: string
  fetchImpl?: FetchImpl
  timeoutMs?: number
  sha256?: Sha256Fn
}

function normalizeBase(url: string): string {
  return url.replace(/\/+$/, '')
}

export class BeaconLightTransport {
  public readonly common: Common
  private readonly endpoints: string[]
  private readonly fetchImpl: FetchImpl
  private readonly timeoutMs: number
  private readonly sha256: Sha256Fn
  private lastGoodEndpoint?: string

  constructor(opts: BeaconLightTransportOpts) {
    const cfg = opts.common.beaconLightClient()
    if (cfg === undefined) {
      throw EthereumJSErrorWithoutCode('beaconLightClient config not available for this chain')
    }
    this.common = opts.common
    const defaults = cfg.defaultEndpoints.map(normalizeBase)
    this.endpoints =
      opts.overrideEndpoint !== undefined
        ? [
            normalizeBase(opts.overrideEndpoint),
            ...defaults.filter((e) => e !== normalizeBase(opts.overrideEndpoint!)),
          ]
        : defaults
    this.fetchImpl = opts.fetchImpl ?? globalThis.fetch.bind(globalThis)
    this.timeoutMs = opts.timeoutMs ?? 12_000
    this.sha256 = opts.sha256 ?? nobleSha256
  }

  get activeEndpoint(): string | undefined {
    return this.lastGoodEndpoint
  }

  private async getJson(path: string): Promise<unknown> {
    const order = this.lastGoodEndpoint
      ? [this.lastGoodEndpoint, ...this.endpoints.filter((e) => e !== this.lastGoodEndpoint)]
      : this.endpoints
    let lastError: unknown
    for (const base of order) {
      const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
      try {
        const res = await this.fetchImpl(url, {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(this.timeoutMs),
        })
        if (!res.ok) {
          lastError = new Error(`HTTP ${res.status} from ${base}`)
          continue
        }
        const json = await res.json()
        this.lastGoodEndpoint = base
        return json
      } catch (e) {
        lastError = e
      }
    }
    throw EthereumJSErrorWithoutCode(
      `all beacon endpoints failed: ${(lastError as Error)?.message ?? 'unknown error'}`,
    )
  }

  async fetchBootstrap(blockRootHex: string): Promise<LightClientBootstrap> {
    const root = blockRootHex.startsWith('0x') ? blockRootHex.slice(2) : blockRootHex
    const json = await this.getJson(`/eth/v1/beacon/light_client/bootstrap/0x${root}`)
    return parseLightClientBootstrapJson(json)
  }

  async fetchUpdates(startPeriod: number, count: number): Promise<LightClientUpdate[]> {
    const json = await this.getJson(
      `/eth/v1/beacon/light_client/updates?start_period=${startPeriod}&count=${count}`,
    )
    return parseLightClientUpdatesJson(json)
  }

  async fetchFinalityUpdate(): Promise<LightClientFinalityUpdate> {
    const json = await this.getJson('/eth/v1/beacon/light_client/finality_update')
    return parseLightClientFinalityUpdateJson(json)
  }

  async fetchOptimisticUpdate(): Promise<LightClientOptimisticUpdate> {
    const json = await this.getJson('/eth/v1/beacon/light_client/optimistic_update')
    return parseLightClientOptimisticUpdateJson(json)
  }

  /** Zero-config bootstrap root from latest finality update. */
  async discoverBootstrapBlockRoot(): Promise<string> {
    const fin = await this.fetchFinalityUpdate()
    const root = hashTreeRootBeaconBlockHeader(fin.finalizedHeader.beacon, this.sha256)
    return bytesToHex(root)
  }
}
