import { Units } from '@ethereumjs/util'

console.log(`1 ether = ${Units.ether(1)} wei`)
console.log(`2 gwei = ${Units.gwei(2)} wei`)
console.log(`0.5 ether in wei would be: ${Units.ether(1) / 2n} (use bigint math on wei values)`)
