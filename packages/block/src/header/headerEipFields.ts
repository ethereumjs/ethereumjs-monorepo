import { Hardfork } from '@ethereumjs/common'
import {
  BIGINT_0,
  BIGINT_7,
  EthereumJSErrorWithoutCode,
  KECCAK256_RLP,
  SHA256_NULL,
  bigIntToUnpaddedBytes,
} from '@ethereumjs/util'

import type { Common } from '@ethereumjs/common'
import type { HeaderData } from '../types.ts'
import type { BlockHeader } from './header.ts'

type HeaderEipFieldRow = {
  eip: number
  fields: (keyof HeaderData)[]
  default: (common: Common, blockNumber: bigint) => bigint | Uint8Array | undefined
  inactiveMessage: (field: keyof HeaderData) => string
}

const HEADER_EIP_FIELD_ROWS: HeaderEipFieldRow[] = [
  {
    eip: 1559,
    fields: ['baseFeePerGas'],
    default: (common, number) =>
      number === common.hardforkBlock(Hardfork.London) ? common.param('initialBaseFee') : BIGINT_7,
    inactiveMessage: () => 'A base fee for a block can only be set with EIP1559 being activated',
  },
  {
    eip: 4895,
    fields: ['withdrawalsRoot'],
    default: () => KECCAK256_RLP,
    inactiveMessage: () =>
      'A withdrawalsRoot for a header can only be provided with EIP4895 being activated',
  },
  {
    eip: 4844,
    fields: ['blobGasUsed', 'excessBlobGas'],
    default: () => BIGINT_0,
    inactiveMessage: (field) =>
      field === 'blobGasUsed'
        ? 'blob gas used can only be provided with EIP4844 activated'
        : 'excess blob gas can only be provided with EIP4844 activated',
  },
  {
    eip: 4788,
    fields: ['parentBeaconBlockRoot'],
    default: () => new Uint8Array(32),
    inactiveMessage: () =>
      'A parentBeaconBlockRoot for a header can only be provided with EIP4788 being activated',
  },
  {
    eip: 7685,
    fields: ['requestsHash'],
    default: () => SHA256_NULL,
    inactiveMessage: () => 'requestsHash can only be provided with EIP7685 being activated',
  },
  {
    eip: 7928,
    fields: ['blockAccessListHash'],
    default: () => new Uint8Array(32),
    inactiveMessage: () => 'blockAccessListHash can only be provided with EIP7928 being activated',
  },
  {
    eip: 7843,
    fields: ['slotNumber'],
    default: () => BIGINT_0,
    inactiveMessage: () => 'slotNumber can only be provided with EIP7843 being activated',
  },
]

export function headerEipHardforkDefaults(
  common: Common,
  blockNumber: bigint,
): Partial<Record<keyof HeaderData, bigint | Uint8Array>> {
  const out: Partial<Record<keyof HeaderData, bigint | Uint8Array>> = {}
  for (const row of HEADER_EIP_FIELD_ROWS) {
    if (!common.isActivatedEIP(row.eip)) {
      continue
    }
    const value = row.default(common, blockNumber)
    for (const field of row.fields) {
      ;(out as Record<string, bigint | Uint8Array>)[field] = value as bigint | Uint8Array
    }
  }
  return out
}

export function validateHeaderEipFieldsInactive(
  common: Common,
  values: Partial<Record<keyof HeaderData, unknown>>,
): void {
  for (const row of HEADER_EIP_FIELD_ROWS) {
    if (common.isActivatedEIP(row.eip)) {
      continue
    }
    for (const field of row.fields) {
      if (values[field] !== undefined) {
        throw EthereumJSErrorWithoutCode(row.inactiveMessage(field))
      }
    }
  }
}

export function appendHeaderEipRawFields(
  header: BlockHeader,
  rawItems: Array<Uint8Array | bigint>,
): void {
  for (const row of HEADER_EIP_FIELD_ROWS) {
    if (!header.common.isActivatedEIP(row.eip)) {
      continue
    }
    if (row.eip === 4844) {
      rawItems.push(bigIntToUnpaddedBytes(header.blobGasUsed!))
      rawItems.push(bigIntToUnpaddedBytes(header.excessBlobGas!))
      continue
    }
    for (const field of row.fields) {
      if (field === 'baseFeePerGas') {
        rawItems.push(bigIntToUnpaddedBytes(header.baseFeePerGas!))
      } else if (field === 'withdrawalsRoot') {
        rawItems.push(header.withdrawalsRoot!)
      } else if (field === 'parentBeaconBlockRoot') {
        rawItems.push(header.parentBeaconBlockRoot!)
      } else if (field === 'requestsHash') {
        rawItems.push(header.requestsHash!)
      } else if (field === 'blockAccessListHash') {
        rawItems.push(header.blockAccessListHash!)
      } else if (field === 'slotNumber') {
        rawItems.push(bigIntToUnpaddedBytes(header.slotNumber!))
      }
    }
  }
}
