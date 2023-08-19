import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { EthersStateManager } from '@ethereumjs/statemanager'
import { VM } from '@ethereumjs/vm'

const blockTag = BigInt(4094286)
const stateManager = new EthersStateManager({
  provider: 'http://localhost:8545',
  blockTag,
})

const common = new Common({
  chain: Chain.Sepolia,
  hardfork: Hardfork.Shanghai,
})

async function go() {
  const blockchain = await Blockchain.create({
    common,
    validateBlocks: false,
  })

  const vm = await VM.create({
    common,
    stateManager,
    blockchain,
  })

  for (let n = blockTag - BigInt(256); n < blockTag; n++) {
    console.log(n)
    const block = await Block.fromJsonRpcProvider(stateManager._provider, n, {
      common,
      setHardfork: false,
    })
    await vm.blockchain.putBlock(block)
  }
  const rootBlock = await Block.fromJsonRpcProvider(stateManager._provider, blockTag, {
    common,
    setHardfork: false,
  })
  const block2 = await Block.fromJsonRpcProvider(stateManager._provider, blockTag + BigInt(1), {
    common,
    setHardfork: false,
  })

  await vm.blockchain.putBlock(rootBlock)
  await vm.blockchain.putBlock(block2)

  await vm.blockchain.getBlock(blockTag)

  // Setup phase
  const setupTime = Date.now()
  const setupBlock = await vm.runBlock({
    block: block2,
    skipHeaderValidation: true,
    generate: true,
  })
  console.log('Setup took', (Date.now() - setupTime) / 1000)
  console.log('Gas used: ' + setupBlock.gasUsed, 'expected gas used: ' + block2.header.gasUsed)

  const time = Date.now()

  ;(<EthersStateManager>vm.stateManager).clearCaches()
  ;(<EthersStateManager>vm.stateManager)._provider = <any>undefined
  const block = await vm.runBlock({
    root: rootBlock.header.stateRoot,
    block: block2,
    skipHeaderValidation: true,
    generate: true,
  })
  console.log('Running from cache took', (Date.now() - time) / 1000)
  console.log('Gas used: ' + block.gasUsed, 'expected gas used: ' + block2.header.gasUsed)
}

void go()
