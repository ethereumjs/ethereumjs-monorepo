/**
 * This example shows how to initialize an EIP-7702 (Set EOA account code) transaction
 * WARNING: do NOT try this or sign this with any keys which have any value on any network
 * This is for educational purposes only.
 */

// This example will show how to self-delegate a fresh EOA account to the address `0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
// In the same transaction, it will also delegate another account to address `0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`
// It will self-delegate. Note that in a 7702-tx, you are free to include any authorization item.
// If the authorization item is valid (it has the correct nonce, and matches the chainId (or the chainId is 0))
// then it will delegate the code of the account **who signed that authorization item** to the address in that authority item
import { createEOACode7702Tx } from '@ethereumjs/tx'
import type { EOACode7702AuthorizationListItemUnsigned } from '@ethereumjs/util'
import {
  Address,
  eoaCode7702AuthorizationListBytesItemToJSON,
  eoaCode7702SignAuthorization,
  privateToAddress,
} from '@ethereumjs/util'

const privateKey = new Uint8Array(32).fill(0x20)
const privateKeyOther = new Uint8Array(32).fill(0x99)

const myAddress = new Address(privateToAddress(privateKey))

const unsignedAuthorizationListItemSelf: EOACode7702AuthorizationListItemUnsigned = {
  chainId: '0x1337', // This delegation will only work on the chain with chainId 0x1337
  address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  nonce: '0x01', // Since we are self-delegating we need account for the nonce being bumped of the account
}
const signedSelf = eoaCode7702SignAuthorization(unsignedAuthorizationListItemSelf, privateKey)
// To convert the bytes array to a human-readable form, use `eoaCode7702AuthorizationListBytesItemToJSON`
console.log(eoaCode7702AuthorizationListBytesItemToJSON(signedSelf))

const unsignedAuthorizationListItemOther: EOACode7702AuthorizationListItemUnsigned = {
  chainId: '0x', // The chainId 0 is special: this authorization will work on any chain which supports EIP-7702
  address: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  nonce: '0x',
}
const signedOther = eoaCode7702SignAuthorization(
  unsignedAuthorizationListItemOther,
  privateKeyOther,
)

const authorizationList = [signedSelf, signedOther]

const unsignedTx = createEOACode7702Tx({
  authorizationList,
  to: myAddress, // Call into self, so call as own address into `0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
})

const signed = unsignedTx.sign(privateKey)

console.log(signed.toJSON())
