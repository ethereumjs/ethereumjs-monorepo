import { Address } from '@ethereumjs/util'
import { RPCStateManager } from '@ethereumjs/statemanager'

const main = async () => {
  try {
    const provider = 'https://path.to.my.provider.com'
    const stateManager = new RPCStateManager({ provider, blockTag: 500000n })
    const vitalikDotEth = Address.fromString('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
    const account = await stateManager.getAccount(vitalikDotEth)
    console.log('Vitalik has a current ETH balance of ', account?.balance)
  } catch (e) {
    console.log(e.message) // fetch fails because provider url is not real. please replace provider with a valid rpc url string.
  }
}
main()
