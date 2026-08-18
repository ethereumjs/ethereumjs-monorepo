import { Wallet } from '@ethereumjs/wallet'

const main = async () => {
  const wallet = Wallet.generate()
  const password = 'test-password'

  const keystore = await wallet.toV3(password)
  const restored = await Wallet.fromV3(keystore, password)

  console.log(`Keystore version: ${keystore.version}`)
  console.log(`Address match: ${restored.getAddressString() === wallet.getAddressString()}`)
}

void main()
