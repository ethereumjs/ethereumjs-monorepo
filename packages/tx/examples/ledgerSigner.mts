import { Common, Sepolia } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import {
  type FeeMarketEIP1559TxData,
  type LegacyTxData,
  createFeeMarket1559Tx,
  createLegacyTx,
} from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import Eth from '@ledgerhq/hw-app-eth'
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'

const transport = await TransportNodeHid.default.open()
const eth = new Eth.default(transport)
const common = new Common({ chain: Sepolia })

// Signing with the first key of the derivation path
const bip32Path = "44'/60'/0'/0/0"

const legacyTxData: LegacyTxData = {
  nonce: '0x0',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000',
  value: '0x00',
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
}

const eip1559TxData: FeeMarketEIP1559TxData = {
  data: '0x1a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  gasLimit: '0x02625a00',
  maxPriorityFeePerGas: '0x01',
  maxFeePerGas: '0xff',
  nonce: '0x00',
  to: '0xcccccccccccccccccccccccccccccccccccccccc',
  value: '0x0186a0',
  accessList: [],
  type: '0x02',
}

const run = async () => {
  // Signing a legacy tx
  const tx1 = createLegacyTx(legacyTxData, { common })
  const unsignedTx1 = tx1.getMessageToSign()
  // Ledger signTransaction API expects it to be serialized
  // Ledger returns unprefixed hex strings without 0x for v, r, s values
  const { v, r, s } = await eth.signTransaction(
    bip32Path,
    bytesToHex(RLP.encode(unsignedTx1)).slice(2),
    null,
  )
  const signedTx1 = tx1.addSignature(BigInt(`0x${v}`), BigInt(`0x${r}`), BigInt(`0x${s}`))
  const from = signedTx1.getSenderAddress().toString()
  console.log(`signedTx: ${bytesToHex(tx1.serialize())}\nfrom: ${from}`)

  // Signing a 1559 tx
  const tx2 = createFeeMarket1559Tx(eip1559TxData, { common })
  // Ledger returns unprefixed hex strings without 0x for v, r, s values
  const unsignedTx2 = tx2.getMessageToSign()
  const { v2, r2, s2 } = await eth.signTransaction(
    bip32Path,
    bytesToHex(unsignedTx2).slice(2),
    null,
  )
  const signedTx2 = tx2.addSignature(BigInt(`0x${v2}`), BigInt(`0x${r2}`), BigInt(`0x${s2}`))
  const from2 = signedTx2.getSenderAddress().toString()
  console.log(`signedTx: ${bytesToHex(tx2.serialize())}\nfrom: ${from2}`)
}

run()
