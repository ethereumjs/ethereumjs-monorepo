import { bytesToHex, fetchFromProvider } from '@ethereumjs/util'

import type { Address } from '@ethereumjs/util'
import type { Proof, RPCStateManager } from '../index.ts'

/**
 * Fetch an EIP-1186 proof from the RPC provider backing a {@link RPCStateManager}.
 *
 * @param address Account to prove
 * @param storageSlots Storage keys to include (defaults to none)
 */
export async function getRPCStateProof(
  sm: RPCStateManager,
  address: Address,
  storageSlots: Uint8Array[] = [],
): Promise<Proof> {
  if (sm['DEBUG']) sm['_debug'](`retrieving proof from provider for ${address.toString()}`)
  const proof = await fetchFromProvider(sm['_provider'], {
    method: 'eth_getProof',
    params: [address.toString(), storageSlots.map(bytesToHex), sm['_blockTag']],
  })

  return proof
}
