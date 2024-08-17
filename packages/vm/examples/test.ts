import { StatelessVerkleStateManager } from '@ethereumjs/statemanager'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'

const verkleCrypto = await loadVerkleCrypto()
const sm = new StatelessVerkleStateManager({ verkleCrypto })
console.log(sm)
