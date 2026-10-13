import { CLRequest, CLRequestType, hexToBytes } from '@ethereumjs/util'

// Payload layout is defined by the Prague EL request types (see @ethereumjs/block)
const depositPayload = hexToBytes(`0x${'ab'.repeat(48)}`)
const request = new CLRequest(CLRequestType.Deposit, depositPayload)

console.log(`CLRequest type=${request.type} (Deposit)`)
console.log(`Data length: ${request.data.length} bytes`)
