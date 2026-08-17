import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { createEOACode7702Tx } from '@ethereumjs/tx'
import {
  Account,
  Address,
  BIGINT_1,
  bigIntToUnpaddedBytes,
  concatBytes,
  createAddressFromString,
  createZeroAddress,
  equalsBytes,
  hexToBytes,
  privateToAddress,
  setLengthRight,
  unpadBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { createVM, runTx } from '../../../src/index.ts'

import type { EOACode7702AuthorizationListBytesItem, PrefixedHexString } from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import type { VM } from '../../../src/index.ts'

// EIP-7702 code designator. If code starts with these bytes, it is a 7702-delegated address
const eip7702Designator = hexToBytes('0xef01')

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })

const defaultAuthPkey = hexToBytes(`0x${'20'.repeat(32)}`)
const defaultAuthAddr = new Address(privateToAddress(defaultAuthPkey))

const defaultSenderPkey = hexToBytes(`0x${'40'.repeat(32)}`)
const defaultSenderAddr = new Address(privateToAddress(defaultSenderPkey))

const code1Addr = createAddressFromString(`0x${'01'.repeat(20)}`)
const code2Addr = createAddressFromString(`0x${'02'.repeat(20)}`)

type GetAuthListOpts = {
  chainId?: number
  nonce?: number
  address: Address
  pkey?: Uint8Array
}

function getAuthorizationListItem(opts: GetAuthListOpts): EOACode7702AuthorizationListBytesItem {
  const actualOpts = {
    ...{ chainId: 0, pkey: defaultAuthPkey },
    ...opts,
  }

  const { chainId, nonce, address, pkey } = actualOpts

  const chainIdBytes = unpadBytes(hexToBytes(`0x${chainId.toString(16)}`))
  const nonceBytes =
    nonce !== undefined ? unpadBytes(hexToBytes(`0x${nonce.toString(16)}`)) : new Uint8Array()
  const addressBytes = address.toBytes()

  const rlpdMsg = RLP.encode([chainIdBytes, addressBytes, nonceBytes])
  const msgToSign = keccak_256(concatBytes(new Uint8Array([5]), rlpdMsg))
  const signatureBytes = secp256k1.sign(msgToSign, pkey, { format: 'recovered', prehash: false })

  const { recovery, r, s } = secp256k1.Signature.fromBytes(signatureBytes, 'recovered')

  if (recovery === undefined) {
    throw new Error('Recovery is undefined')
  }
  return [
    chainIdBytes,
    addressBytes,
    nonceBytes,
    bigIntToUnpaddedBytes(BigInt(recovery)),
    bigIntToUnpaddedBytes(r),
    bigIntToUnpaddedBytes(s),
  ]
}

async function runTest(authorizationListOpts: GetAuthListOpts[], expect: Uint8Array, vm?: VM) {
  vm = vm ?? (await createVM({ common }))
  const authList = authorizationListOpts.map((opt) => getAuthorizationListItem(opt))
  const tx = createEOACode7702Tx(
    {
      gasLimit: 100000,
      maxFeePerGas: 1000,
      authorizationList: authList,
      to: defaultAuthAddr,
      value: BIGINT_1,
    },
    { common },
  ).sign(defaultSenderPkey)

  const code1 = hexToBytes('0x600160015500')
  await vm.stateManager.putCode(code1Addr, code1)

  const code2 = hexToBytes('0x600260015500')
  await vm.stateManager.putCode(code2Addr, code2)

  const acc = (await vm.stateManager.getAccount(defaultSenderAddr)) ?? new Account()
  acc.balance = BigInt(1_000_000_000)
  await vm.stateManager.putAccount(defaultSenderAddr, acc)

  await runTx(vm, { tx })

  const slot = hexToBytes(`0x${'00'.repeat(31)}01`)
  const value = await vm.stateManager.getStorage(defaultAuthAddr, slot)
  assert.isTrue(equalsBytes(unpadBytes(expect), value))
}

describe('EIP 7702: set code to EOA accounts', () => {
  it('should do basic functionality', async () => {
    // Basic test: store 1 in slot 1
    await runTest(
      [
        {
          address: code1Addr,
        },
      ],
      new Uint8Array([1]),
    )

    // Try to set code to two different addresses
    // Only the first is valid: the second tuple will have the nonce value 0, but the
    // nonce of the account is already set to 1 (by the first tuple)
    await runTest(
      [
        {
          address: code1Addr,
        },
        {
          address: code2Addr,
        },
      ],
      new Uint8Array([1]),
    )

    // Chain id check: is chain id 1 also valid?
    // Also checks that code2Addr has the correct code
    await runTest(
      [
        {
          address: code2Addr,
          chainId: 1,
        },
        {
          address: code2Addr,
        },
      ],
      new Uint8Array([2]),
    )

    // Check if chain id 2 is ignored
    await runTest(
      [
        {
          address: code1Addr,
          chainId: 2,
        },
        {
          address: code2Addr,
        },
      ],
      new Uint8Array([2]),
    )

    // Check if nonce is ignored in case the nonce is incorrect
    await runTest(
      [
        {
          address: code1Addr,
          nonce: 1,
        },
        {
          address: code2Addr,
        },
      ],
      new Uint8Array([2]),
    )
  })

  it('Code is already present in account', async () => {
    const vm = await createVM({ common })
    await vm.stateManager.putCode(defaultAuthAddr, new Uint8Array([1]))
    await runTest(
      [
        {
          address: code1Addr,
        },
      ],
      new Uint8Array(),
      vm,
    )
  })

  it('Auth address is added to warm addresses', async () => {
    const vm = await createVM({ common })
    const authList = [
      getAuthorizationListItem({
        address: code1Addr,
      }),
    ]

    // Call into the defaultAuthAddr
    // Gas cost:
    // 5 * PUSH0: 10
    // 1 * PUSH20: 3
    // 1 * GAS: 2
    // 1x warm call: 100 (to auth address)
    // --> This calls into the cold code1Addr, so add 2600 cold account gas cost
    // Total: 2715
    const checkAddressWarmCode = hexToBytes(
      `0x5F5F5F5F5F73${defaultAuthAddr.toString().slice(2)}5AF1`,
    )
    const checkAddressWarm = createAddressFromString(`0x${'FA'.repeat(20)}`)

    await vm.stateManager.putCode(checkAddressWarm, checkAddressWarmCode)

    const tx = createEOACode7702Tx(
      {
        gasLimit: 100000,
        maxFeePerGas: 1000,
        authorizationList: authList,
        to: checkAddressWarm,
        value: BIGINT_1,
      },
      { common },
    ).sign(defaultSenderPkey)

    const code1 = hexToBytes('0x')
    await vm.stateManager.putCode(code1Addr, code1)

    const acc = (await vm.stateManager.getAccount(defaultSenderAddr)) ?? new Account()
    acc.balance = BigInt(1_000_000_000)
    await vm.stateManager.putAccount(defaultSenderAddr, acc)

    const res = await runTx(vm, { tx })
    assert.isTrue(res.execResult.executionGasUsed === BigInt(2715))
  })
})

describe('test EIP-7702 opcodes', () => {
  it('should correctly report EXTCODESIZE/EXTCODEHASH/EXTCODECOPY opcodes', async () => {
    // extcodesize and extcodehash
    const deploymentAddress = createZeroAddress()
    const randomCode = hexToBytes('0x010203040506')
    const randomCodeAddress = createAddressFromString('0x' + 'aa'.repeat(20))

    const delegatedCode = concatBytes(
      eip7702Designator,
      hexToBytes('0x00'),
      randomCodeAddress.bytes,
    )

    const tests: {
      code: PrefixedHexString
      expectedStorage: Uint8Array
      name: string
    }[] = [
      // EXTCODESIZE
      {
        // PUSH20 <defaultAuthAddr> EXTCODESIZE PUSH0 SSTORE STOP
        code: `0x73${defaultAuthAddr.toString().slice(2)}3b5f5500`,
        expectedStorage: bigIntToUnpaddedBytes(BigInt(delegatedCode.length)),
        name: 'EXTCODESIZE',
      },
      // EXTCODEHASH
      {
        // PUSH20 <defaultAuthAddr> EXTCODEHASH PUSH0 SSTORE STOP
        code: `0x73${defaultAuthAddr.toString().slice(2)}3f5f5500`,
        expectedStorage: keccak_256(delegatedCode),
        name: 'EXTCODEHASH',
      },
      // EXTCODECOPY
      {
        // PUSH1 32 PUSH0 PUSH0 PUSH20 <defaultAuthAddr> EXTCODEHASH PUSH0 MLOAD PUSH0 SSTORE STOP
        code: `0x60205f5f73${defaultAuthAddr.toString().slice(2)}3c5f515f5500`,
        expectedStorage: setLengthRight(delegatedCode, 32),
        name: 'EXTCODECOPY',
      },
    ]

    const authTx = createEOACode7702Tx(
      {
        gasLimit: 100000,
        maxFeePerGas: 1000,
        authorizationList: [
          getAuthorizationListItem({
            address: randomCodeAddress,
          }),
        ],
        to: deploymentAddress,
        value: BIGINT_1,
      },
      { common },
    ).sign(defaultSenderPkey)

    async function runOpcodeTest(code: Uint8Array, expectedOutput: Uint8Array, name: string) {
      const vm = await createVM({ common })

      const acc = (await vm.stateManager.getAccount(defaultSenderAddr)) ?? new Account()
      acc.balance = BigInt(1_000_000_000)
      await vm.stateManager.putAccount(defaultSenderAddr, acc)

      // The code to either store extcodehash / extcodesize in slot 0
      await vm.stateManager.putCode(deploymentAddress, code)
      // The code the authority points to (and should thus be loaded by above script)
      await vm.stateManager.putCode(randomCodeAddress, randomCode)

      // Set authority and immediately call into the contract to get the extcodehash / extcodesize
      await runTx(vm, { tx: authTx })

      const result = await vm.stateManager.getStorage(deploymentAddress, new Uint8Array(32))
      assert.isTrue(equalsBytes(result, expectedOutput), `FAIL test: ${name}`)
    }

    for (const test of tests) {
      await runOpcodeTest(hexToBytes(test.code), test.expectedStorage, test.name)
    }
  })
})
