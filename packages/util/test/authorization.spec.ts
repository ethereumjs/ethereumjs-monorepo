import { RLP } from '@ethereumjs/rlp'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { assert, describe, it } from 'vitest'
import { Address } from '../src/address.ts'
import {
  EOA_CODE_7702_AUTHORITY_SIGNING_MAGIC,
  eoaCode7702AuthorizationHashedMessageToSign,
  eoaCode7702AuthorizationListBytesItemToJSON,
  eoaCode7702AuthorizationListJSONItemToBytes,
  eoaCode7702AuthorizationMessageToSign,
  eoaCode7702RecoverAuthority,
  eoaCode7702SignAuthorization,
} from '../src/authorization.ts'
import { concatBytes, equalsBytes, hexToBytes } from '../src/bytes.ts'
import type {
  EOACode7702AuthorizationListBytesItemUnsigned,
  EOACode7702AuthorizationListItem,
  EOACode7702AuthorizationListItemUnsigned,
} from '../src/types.ts'

// Taken from execution-spec-tests (tests/prague/eip7702_set_code_tx/test_set_code_txs.py::test_address_from_set_code)
const SAMPLE_AUTH: EOACode7702AuthorizationListItem = {
  chainId: '0x',
  address: '0x0000000000000000000000000000000000001000',
  nonce: '0x',
  yParity: '0x',
  r: '0xdbcff17ff6c249f13b334fa86bcbaa1afd9f566ca9b06e4ea5fab9bdde9a9202',
  s: '0x5c34c9d8af5b20e4a425fc1daf2d9d484576857eaf1629145b4686bac733868e',
}
// RLP-encoded bytes of above sample
const EXPECTED_RLP_BYTES = hexToBytes(
  '0xf85a809400000000000000000000000000000000000010008080a0dbcff17ff6c249f13b334fa86bcbaa1afd9f566ca9b06e4ea5fab9bdde9a9202a05c34c9d8af5b20e4a425fc1daf2d9d484576857eaf1629145b4686bac733868e',
)

// Taken from execution-spec-tests (`TestAddress`)
const PRIVATE_KEY = hexToBytes('0x45A915E4D060149EB4365960E6A7A45F334393093061116B197E3240065FF2D8')
const EXPECTED_SIGNER = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))

describe('Authorization lists', () => {
  const item = eoaCode7702AuthorizationListJSONItemToBytes(SAMPLE_AUTH)
  const [chainId, address, nonce] = item
  const unsignedBytesItem: EOACode7702AuthorizationListBytesItemUnsigned = [chainId, address, nonce]
  const unsignedJSONItem: EOACode7702AuthorizationListItemUnsigned = {
    chainId: SAMPLE_AUTH.chainId,
    address: SAMPLE_AUTH.address,
    nonce: SAMPLE_AUTH.nonce,
  }

  it('authorizationMessageToSign() / authorizationHashedMessageToSign()', () => {
    const expected = concatBytes(
      EOA_CODE_7702_AUTHORITY_SIGNING_MAGIC,
      RLP.encode([chainId, address, nonce]),
    )

    assert.isTrue(
      equalsBytes(eoaCode7702AuthorizationMessageToSign(unsignedBytesItem), expected),
      'msg to sign ok: bytes',
    )
    assert.isTrue(
      equalsBytes(eoaCode7702AuthorizationMessageToSign(unsignedJSONItem), expected),
      'msg to sign ok: json',
    )

    const expectedHash = keccak256(expected)
    assert.isTrue(
      equalsBytes(eoaCode7702AuthorizationHashedMessageToSign(unsignedBytesItem), expectedHash),
      'hashed msg to sign ok: bytes',
    )
    assert.isTrue(
      equalsBytes(eoaCode7702AuthorizationHashedMessageToSign(unsignedJSONItem), expectedHash),
      'hashed msg to sign ok: json',
    )

    assert.throws(
      () => {
        eoaCode7702AuthorizationMessageToSign([
          new Uint8Array(),
          new Uint8Array(19),
          new Uint8Array(),
        ])
      },
      undefined,
      undefined,
      'throws on address not 20 bytes',
    )
  })

  it('sign() / recoverAuthority()', () => {
    const signedFromBytes = eoaCode7702SignAuthorization(unsignedBytesItem, PRIVATE_KEY)
    const signedFromJSON = eoaCode7702SignAuthorization(unsignedJSONItem, PRIVATE_KEY)

    const signedFromBytes_RLP = RLP.encode(signedFromBytes)
    const signedFromJSON_RLP = RLP.encode(signedFromJSON)

    assert.isTrue(equalsBytes(signedFromBytes_RLP, EXPECTED_RLP_BYTES), 'signed ok: bytes')
    assert.isTrue(equalsBytes(signedFromJSON_RLP, EXPECTED_RLP_BYTES), 'signed ok: json')

    assert.deepEqual(
      eoaCode7702AuthorizationListBytesItemToJSON(signedFromBytes),
      SAMPLE_AUTH,
      'json conversion matches expected json',
    )

    const recoveredBytesAddress = eoaCode7702RecoverAuthority(signedFromBytes)
    const recoveredJSONAddress = eoaCode7702RecoverAuthority(SAMPLE_AUTH)

    assert.isTrue(EXPECTED_SIGNER.equals(recoveredBytesAddress), 'bytes: recovered correct signer')
    assert.isTrue(EXPECTED_SIGNER.equals(recoveredJSONAddress), 'json: recovered correct signer')
  })
})
