import { Chain, Common } from '@ethereumjs/common'

const c = new Common({ chain: Chain.Mainnet })

const loops = 1e6

let tmr = 0
for (let i = 0; i < loops; i++) {
  const t = performance.now()
  c.isActivatedEIP(1)
  tmr += performance.now() - t
}
console.log(tmr / 1000)

tmr = 0
for (let i = 0; i < loops; i++) {
  const t = performance.now()
  c.isActivatedEIP(6780)
  tmr += performance.now() - t
}
console.log(tmr / 1000)
