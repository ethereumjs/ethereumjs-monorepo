import { Chain, Common, Hardfork } from '@ethereumjs/common'

export const getCommon = () => {
  return new Common({
    hardfork: Hardfork.Prague,
    eips: [663, 3540, 3670, 4200, 4750, 5450, 6206, 7069, 7480, 7620, 7692, 7698],
    chain: Chain.Mainnet,
  })
}
