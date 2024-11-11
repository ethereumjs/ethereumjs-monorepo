/**
 * TxWorker.ts: helper methods to extract relevant data from
 */

import { BIGINT_0 } from '@ethereumjs/util'

import { Feature } from './dataContainerTypes.js'
import { AccessLists, AuthorizationLists } from './util.js'

import type {
  AccessListInterface,
  AuthorizationListInterface,
  CreateContractInterface,
  DefaultContainerInterface,
  TxContainerMethods,
} from './dataContainerTypes.js'
import type { Common } from '@ethereumjs/common'

/**
 * Gets the data gas part of the tx, this consists of calldata, access lists and authority lists
 * @param tx
 * @param common
 */
export function getDataGas(
  tx: TxContainerMethods & DefaultContainerInterface & CreateContractInterface,
  common: Common,
): bigint {
  // Side note: can also do this method without the entire tx container and just use `tx.data` instead as param?
  const txDataZero = common.param('txDataZeroGas')
  const txDataNonZero = common.param('txDataNonZeroGas')

  let cost = BIGINT_0
  for (let i = 0; i < tx.data.length; i++) {
    tx.data[i] === 0 ? (cost += txDataZero) : (cost += txDataNonZero)
  }

  if ((tx.to === undefined || tx.to === null) && common.isActivatedEIP(3860)) {
    const dataLength = BigInt(Math.ceil(tx.data.length / 32))
    const initCodeCost = common.param('initCodeWordGas') * dataLength
    cost += initCodeCost
  }

  if (tx.supports(Feature.AccessLists)) {
    // TODO: figure out how to get rid of the "unknown"
    // (Likely: mark a type with all tx interfaces and mark them all as "optional")
    const eip2930tx = tx as unknown as AccessListInterface
    cost += BigInt(AccessLists.getDataGasEIP2930(eip2930tx.accessList, common))
  }

  if (tx.supports(Feature.EOACode)) {
    const eip7702tx = tx as unknown as AuthorizationListInterface
    cost += BigInt(AuthorizationLists.getDataGasEIP7702(eip7702tx.authorizationList, common))
  }

  return cost
}

/**
 * Gets the intrinsic gas which is the minimal gas limit a tx should have to be valid
 * @param tx
 * @param common
 */
export function getIntrinsicGas(
  tx: TxContainerMethods & DefaultContainerInterface & CreateContractInterface,
  common: Common,
): bigint {
  // NOTE: TxDataContainer & DefaultContainerInterface
  // This is the tx data container class interface WITH the default tx params
  let intrincisGas = BIGINT_0
  const txFee = common.param('txGas')
  if (txFee) intrincisGas += txFee
  if (common.gteHardfork('homestead') && (tx.to === undefined || tx.to === null)) {
    const txCreationFee = common.param('txCreationGas')
    if (txCreationFee) intrincisGas += txCreationFee
  }
  return intrincisGas + getDataGas(tx, common)
}
