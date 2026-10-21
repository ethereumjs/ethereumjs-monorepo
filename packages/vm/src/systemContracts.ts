import type { Common, StateManagerInterface } from '@ethereumjs/common'

import {
  Account,
  bigIntToBytes,
  bytesToHex,
  createAddressFromString,
  equalsBytes,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import type { VM } from './vm.ts'

/** Prague fork EIP-7002 withdrawal request runtime bytecode (mainnet / EST). */
export const WITHDRAWAL_REQUEST_SYSTEM_CONTRACT_CODE = hexToBytes(
  '0x3373fffffffffffffffffffffffffffffffffffffffe1460cb5760115f54807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff146101f457600182026001905f5b5f82111560685781019083028483029004916001019190604d565b909390049250505036603814608857366101f457346101f4575f5260205ff35b34106101f457600154600101600155600354806003026004013381556001015f35815560010160203590553360601b5f5260385f601437604c5fa0600101600355005b6003546002548082038060101160df575060105b5f5b8181146101835782810160030260040181604c02815460601b8152601401816001015481526020019060020154807fffffffffffffffffffffffffffffffff00000000000000000000000000000000168252906010019060401c908160381c81600701538160301c81600601538160281c81600501538160201c81600401538160181c81600301538160101c81600201538160081c81600101535360010160e1565b910180921461019557906002556101a0565b90505f6002555f6003555b5f54807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14156101cd57505f5b6001546002828201116101e25750505f6101e8565b01600290035b5f555f600155604c025ff35b5f5ffd',
)

/** Prague fork EIP-7251 consolidation request runtime bytecode (mainnet / EST). */
export const CONSOLIDATION_REQUEST_SYSTEM_CONTRACT_CODE = hexToBytes(
  '0x3373fffffffffffffffffffffffffffffffffffffffe1460d35760115f54807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1461019a57600182026001905f5b5f82111560685781019083028483029004916001019190604d565b9093900492505050366060146088573661019a573461019a575f5260205ff35b341061019a57600154600101600155600354806004026004013381556001015f358155600101602035815560010160403590553360601b5f5260605f60143760745fa0600101600355005b6003546002548082038060021160e7575060025b5f5b8181146101295782810160040260040181607402815460601b815260140181600101548152602001816002015481526020019060030154905260010160e9565b910180921461013b5790600255610146565b90505f6002555f6003555b5f54807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff141561017357505f5b6001546001828201116101885750505f61018e565b01600190035b5f555f6001556074025ff35b5f5ffd',
)

export function isCanonicalSystemContractCode(code: Uint8Array, expected: Uint8Array): boolean {
  return code.length > 0 && equalsBytes(code, expected)
}

function addressFromCommonParam(
  common: Common,
  param: 'withdrawalRequestPredeployAddress' | 'consolidationRequestPredeployAddress',
) {
  return createAddressFromString(bytesToHex(setLengthLeft(bigIntToBytes(common.param(param)), 20)))
}

async function putSystemContractCode(
  stateManager: StateManagerInterface,
  address: ReturnType<typeof createAddressFromString>,
  code: Uint8Array,
) {
  await stateManager.putAccount(address, new Account(1n, 0n))
  await stateManager.putCode(address, code)
}

async function installPragueRequestSystemContracts(
  stateManager: StateManagerInterface,
  common: Common,
): Promise<void> {
  if (common.isActivatedEIP(7002)) {
    await putSystemContractCode(
      stateManager,
      addressFromCommonParam(common, 'withdrawalRequestPredeployAddress'),
      WITHDRAWAL_REQUEST_SYSTEM_CONTRACT_CODE,
    )
  }
  if (common.isActivatedEIP(7251)) {
    await putSystemContractCode(
      stateManager,
      addressFromCommonParam(common, 'consolidationRequestPredeployAddress'),
      CONSOLIDATION_REQUEST_SYSTEM_CONTRACT_CODE,
    )
  }
}

async function installAmsterdamBuilderRequestStubs(
  stateManager: StateManagerInterface,
  common: Common,
): Promise<void> {
  const stop = hexToBytes('0x00')
  for (const param of ['builderDepositContractAddress', 'builderExitContractAddress'] as const) {
    const address = createAddressFromString(
      bytesToHex(setLengthLeft(bigIntToBytes(common.param(param)), 20)),
    )
    await stateManager.putAccount(address, new Account(1n, 0n))
    await stateManager.putCode(address, stop)
  }
}

async function installSystemContracts(
  stateManager: StateManagerInterface,
  common: Common,
): Promise<void> {
  await installPragueRequestSystemContracts(stateManager, common)
  await installAmsterdamBuilderRequestStubs(stateManager, common)
}

/** @internal First {@link runBlock} when {@link VMOpts.preinstallSystemContracts} is set. */
export async function ensureSystemContractsPreinstalled(vm: VM): Promise<void> {
  if (vm['_opts'].preinstallSystemContracts !== true || vm._systemContractsPreinstalled) {
    return
  }
  await installSystemContracts(vm.stateManager, vm.common)
  vm._systemContractsPreinstalled = true
}
