import { Chain, Common, Sepolia } from '@ethereumjs/common'
import { createLegacyTx, createFeeMarket1559Tx, type LegacyTx, type FeeMarket1559Tx, type LegacyTxData, type FeeMarketEIP1559TxData } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import { RLP } from '@ethereumjs/rlp'
import Eth from '@ledgerhq/hw-app-eth'
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'

const transport = await TransportNodeHid.default.open()
const eth = new Eth.default(transport)
const common = new Common({ chain: Sepolia })

let tx: LegacyTx | FeeMarket1559Tx
let unsignedTx: Uint8Array[] | Uint8Array
let signedTx: typeof tx
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
    tx = createLegacyTx(legacyTxData, { common })
    unsignedTx = tx.getMessageToSign()
    // Ledger signTransaction API expects it to be serialized
    // Ledger returns unprefixed hex strings without 0x for v, r, s values
    let { v, r, s } = await eth.signTransaction(bip32Path, bytesToHex(RLP.encode(unsignedTx)).slice(2), null)
    let signedTx: LegacyTx | FeeMarket1559Tx = tx.addSignature(BigInt(`0x${v}`), BigInt(`0x${r}`), BigInt(`0x${s}`))
    let from = signedTx.getSenderAddress().toString()
    console.log(`signedTx: ${bytesToHex(tx.serialize())}\nfrom: ${from}`)

    // Signing a 1559 tx
    tx = createFeeMarket1559Tx(eip1559TxData, { common })
    // Ledger returns unprefixed hex strings without 0x for v, r, s values
    unsignedTx = tx.getMessageToSign()
        ; ({ v, r, s } = await eth.signTransaction(bip32Path, bytesToHex(unsignedTx).slice(2), null))
    signedTx = tx.addSignature(BigInt(`0x${v}`), BigInt(`0x${r}`), BigInt(`0x${s}`))
    from = signedTx.getSenderAddress().toString()
    console.log(`signedTx: ${bytesToHex(tx.serialize())}\nfrom: ${from}`)
}

run()