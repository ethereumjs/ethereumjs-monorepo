import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  BIGINT_0,
  bigIntToBytes,
  bytesToBigInt,
  concatBytes,
  hexToBytes,
  setLengthLeft,
  unpadBytes,
} from '@ethereumjs/util'
import * as cbor from 'cbor'
import { assert, describe, it } from 'vitest'
import { createEVM, getActivePrecompiles } from '../../src/index.ts'

import type { PrefixedHexString } from '@ethereumjs/util'
import { p256 } from '@noble/curves/p256'
import { base64urlnopad } from '@scure/base'
import { sha256 } from 'ethereum-cryptography/sha256'
import type { PrecompileInput } from '../../src/index.ts'
describe('Precompiles: p256 verify', () => {
  it('should work', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague, eips: [7212] })
    const evm = await createEVM({
      common,
    })
    const addressStr = '0000000000000000000000000000000000000012'
    const p256Verify = getActivePrecompiles(common).get(addressStr)!

    // Random inputs
    const testCase = {
      hash: '0xc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' as PrefixedHexString,
      r: '0x0000000000000000000000000000000000000000000000000000000000000002' as PrefixedHexString,
      s: '0x0000000000000000000000000000000000000000000000000000000000000001' as PrefixedHexString,
      x: '0x0000000000000000000000000000000000000000000000000000000000000002' as PrefixedHexString,
      y: '0x0000000000000000000000000000000000000000000000000000000000000003' as PrefixedHexString,
    }

    const opts: PrecompileInput = {
      data: concatBytes(
        hexToBytes(testCase.hash),
        hexToBytes(testCase.r),
        hexToBytes(testCase.s),
        hexToBytes(testCase.x),
        hexToBytes(testCase.y),
      ),
      gasLimit: 0xfffffffffn,
      _EVM: evm,
      common,
    }

    const res = await p256Verify(opts)
    assert.strictEqual(
      bytesToBigInt(unpadBytes(res.returnValue.slice(32))),
      BIGINT_0,
      'p256 verify precompile fails to verify nonsense inputs',
    )

    // webauthn generated inputs from https://opotonniee.github.io/webauthn-playground/

    // Registration output with public key
    // rpIdHash: t8DGRTBfls-BhOH2QC404lvdhe_t2_NkvM0nQWEEADc
    // Flags: 0b01011101 (User Present, User Verified, Backup Eligible, Backed-up, Attested data)
    // Counter: 0
    // Attested cred data:
    // AAGUID: ea9b8d66-4d01-1d21-3ce4-b6b48cb575d4
    // CredId: 5CfOKpISziPZT87xaQinBQ
    // Pub Key: pQECAyYgASFYIMqn0ISx7iJ1Bq_l2Ektnx8EP4vBunTtIwtBVJXx6I5hIlgg5ZeUA4PKKzIGeolx-8tXoP21R-eNURT22ezmUxQxshU

    // Authentication/signature output
    // {
    //   "clientExtensionResults": {},
    //   "rawId": "5CfOKpISziPZT87xaQinBQ",
    //   "response": {
    //     "authenticatorData": "t8DGRTBfls-BhOH2QC404lvdhe_t2_NkvM0nQWEEADcdAAAAAA",
    //     "signature": "MEUCIQCAq9bBDIlH3008aD_p1dnQEnAPFFoumuttjFO5B0txGgIgXgkv9h8OorysU8YK972hnNQLvjdob1dUSI7nTH4-yHI",
    //     "clientDataJSON": "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiRUdZdEFNZ2k4QjJFeTFGTlZmVkY5M201TEV6X0Nmd1R5MDBXMnpvUEVONCIsIm9yaWdpbiI6Imh0dHBzOi8vb3BvdG9ubmllZS5naXRodWIuaW8iLCJjcm9zc09yaWdpbiI6ZmFsc2V9"
    //   },
    //   "authenticatorAttachment": "cross-platform",
    //   "id": "5CfOKpISziPZT87xaQinBQ",
    //   "type": "public-key"
    // }

    const webAuthnInput = {
      publicKey:
        'pQECAyYgASFYINYCnLjxaitogSl7vSSVDixB6JojPCLveobOmmTgV8UMIlggznl2Cy2oqSwvWN5M17E_r2f82QM-sazcYaHj43IADcs',
      signature:
        'MEYCIQDW2X6Bg0BfZRCpWPsFUD1btTKjn25MZUGQczm8Q4-n9wIhALFxp95N-yuxRKOpBnQmOjneUjT9s-mkmEl_rtfaJSs4',
      authenticatorData: 't8DGRTBfls-BhOH2QC404lvdhe_t2_NkvM0nQWEEADcdAAAAAA',
      clientDataJson:
        'eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiRUdZdEFNZ2k4QjJFeTFGTlZmVkY5M201TEV6X0Nmd1R5MDBXMnpvUEVONCIsIm9yaWdpbiI6Imh0dHBzOi8vb3BvdG9ubmllZS5naXRodWIuaW8iLCJjcm9zc09yaWdpbiI6ZmFsc2V9',
    }

    const decoded = base64urlnopad.decode(webAuthnInput.publicKey)
    // Use cbor to decode the COSE key
    const coseKey = cbor.decodeFirstSync(decoded)
    // COSE keys for x and y are -2 and -3
    const x = Uint8Array.from(coseKey.get(-2))
    const y = Uint8Array.from(coseKey.get(-3))

    const hash = sha256(base64urlnopad.decode(webAuthnInput.clientDataJson))

    const sig = p256.Signature.fromDER(base64urlnopad.decode(webAuthnInput.signature))

    const webAuthnInputOpts: PrecompileInput = {
      data: concatBytes(
        hash,
        setLengthLeft(bigIntToBytes(sig.r, true), 32),
        setLengthLeft(bigIntToBytes(sig.s, true), 32),
        x,
        y,
      ),
      gasLimit: 0xfffffffffn,
      common,
      _EVM: evm,
    }

    const webAuthnInputRes = await p256Verify(webAuthnInputOpts)
    assert.strictEqual(
      webAuthnInputRes.returnValue[0],
      1,
      'p256-verify precompile verifies webauthn inputs',
    )
  })
})
