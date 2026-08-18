import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

const blob4844Params = {
  targetBlobGasPerBlock: 393216,
  maxBlobGasPerBlock: 786432,
  blobGasPriceUpdateFraction: 3338477,
  blobGasPerBlob: 131072,
}

// Pre-BPO: EIP-4844 param names
const cancun = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun })
cancun.updateParams({ 4844: blob4844Params })
const cancunSchedule = cancun.getBlobGasSchedule()
console.log(
  `Cancun: target=${cancunSchedule.targetBlobGasPerBlock} max=${cancunSchedule.maxBlobGasPerBlock}`,
)

// BPO hardforks: target/max counts are on the HF; multiply by blobGasPerBlob
for (const hardfork of [Hardfork.Bpo1, Hardfork.Bpo2]) {
  const common = new Common({ chain: Mainnet, hardfork })
  common.updateParams({ 4844: { blobGasPerBlob: blob4844Params.blobGasPerBlob } })
  const schedule = common.getBlobGasSchedule()
  console.log(
    `${hardfork}: target=${schedule.targetBlobGasPerBlock} max=${schedule.maxBlobGasPerBlock} updateFraction=${schedule.blobGasPriceUpdateFraction}`,
  )
}
