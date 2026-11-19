import type { BlockEconomyRecord, MacroBaselineSnapshot } from './types.ts'
import { MACRO_BLOCKS_PER_BUCKET, MACRO_ROLLUP_BUCKETS } from './types.ts'

export type MacroRollupBucket = {
  fromBlock: bigint
  toBlock: bigint
  avgBaseFeeWei: bigint
  avgBlobBaseFeeWei?: bigint
  avgPriorityTipWei?: bigint
  avgGasFullPct: number
  txCount: number
  revertCount: number
  blobCount: number
  setCodeCount: number
  deployments: number
  ethVolumeWei: bigint
  topContractGas: Array<[string, bigint]>
}

export class MacroRollupRing {
  private readonly buckets: MacroRollupBucket[] = []
  private pending: BlockEconomyRecord[] = []

  noteBlock(record: BlockEconomyRecord): void {
    this.pending.push(record)
    if (this.pending.length >= MACRO_BLOCKS_PER_BUCKET) {
      this.flushBucket()
    }
  }

  removeBlock(blockNumber: bigint): void {
    const n = blockNumber.toString()
    const idxPending = this.pending.findIndex((b) => b.blockNumber === blockNumber)
    if (idxPending >= 0) this.pending.splice(idxPending, 1)
    for (const bucket of this.buckets) {
      if (bucket.fromBlock <= blockNumber && bucket.toBlock >= blockNumber) {
        bucket.fromBlock = bucket.fromBlock
        // coarse: drop bucket on replace — rare on live head
        const bIdx = this.buckets.indexOf(bucket)
        if (bIdx >= 0) this.buckets.splice(bIdx, 1)
        break
      }
    }
    void n
  }

  flushBucket(): void {
    if (this.pending.length === 0) return
    const chunk = this.pending.splice(0, MACRO_BLOCKS_PER_BUCKET)
    const fromBlock = chunk[0]!.blockNumber
    const toBlock = chunk[chunk.length - 1]!.blockNumber
    let baseSum = 0n
    let baseN = 0
    let blobFeeSum = 0n
    let blobFeeN = 0
    let tipSum = 0n
    let tipN = 0
    let gasSum = 0
    let txCount = 0
    let revertCount = 0
    let blobCount = 0
    let setCodeCount = 0
    let deployments = 0
    let ethVolumeWei = 0n
    const gasMap = new Map<string, bigint>()
    for (const b of chunk) {
      gasSum += b.gasFullPct
      ethVolumeWei += b.ethTransferredWei
      if (b.hasTxBody) txCount += b.txCount
      if (b.receiptReverts !== undefined) revertCount += b.receiptReverts
      if (b.totalBlobCount !== undefined) blobCount += b.totalBlobCount
      if (b.txTypeSplit.setCode > 0) setCodeCount += b.txTypeSplit.setCode
      if (b.newDeployments !== undefined) deployments += b.newDeployments
      if (b.baseFeeWei !== undefined) {
        baseSum += b.baseFeeWei
        baseN += 1
      }
      if (b.blobBaseFeeWei !== undefined) {
        blobFeeSum += b.blobBaseFeeWei
        blobFeeN += 1
      }
      if (b.medianPriorityTipWei !== undefined) {
        tipSum += b.medianPriorityTipWei
        tipN += 1
      }
      if (b.gasUsedByContract !== undefined) {
        for (const row of b.gasUsedByContract) {
          gasMap.set(row.address, (gasMap.get(row.address) ?? 0n) + row.gasUsed)
        }
      }
    }
    const topContractGas = [...gasMap.entries()]
      .sort((a, b) => (b[1] > a[1] ? 1 : b[1] < a[1] ? -1 : 0))
      .slice(0, 5)
    const bucket: MacroRollupBucket = {
      fromBlock,
      toBlock,
      avgBaseFeeWei: baseN > 0 ? baseSum / BigInt(baseN) : 0n,
      avgBlobBaseFeeWei: blobFeeN > 0 ? blobFeeSum / BigInt(blobFeeN) : undefined,
      avgPriorityTipWei: tipN > 0 ? tipSum / BigInt(tipN) : undefined,
      avgGasFullPct: chunk.length > 0 ? Math.round(gasSum / chunk.length) : 0,
      txCount,
      revertCount,
      blobCount,
      setCodeCount,
      deployments,
      ethVolumeWei,
      topContractGas,
    }
    this.buckets.unshift(bucket)
    while (this.buckets.length > MACRO_ROLLUP_BUCKETS) {
      this.buckets.pop()
    }
  }

  getBuckets(): readonly MacroRollupBucket[] {
    return this.buckets
  }

  baseline(): MacroBaselineSnapshot {
    const buckets = this.buckets
    if (buckets.length === 0) return { bucketCount: 0 }
    let baseSum = 0n
    let baseN = 0
    let blobSum = 0n
    let blobN = 0
    let tipSum = 0n
    let tipN = 0
    let gasSum = 0
    let revertTx = 0
    let successTx = 0
    let setCode = 0
    for (const b of buckets) {
      if (b.avgBaseFeeWei > 0n) {
        baseSum += b.avgBaseFeeWei
        baseN += 1
      }
      if (b.avgBlobBaseFeeWei !== undefined) {
        blobSum += b.avgBlobBaseFeeWei
        blobN += 1
      }
      if (b.avgPriorityTipWei !== undefined) {
        tipSum += b.avgPriorityTipWei
        tipN += 1
      }
      gasSum += b.avgGasFullPct
      revertTx += b.revertCount
      successTx += b.txCount > b.revertCount ? b.txCount - b.revertCount : 0
      setCode += b.setCodeCount
    }
    const denom = revertTx + successTx
    return {
      bucketCount: buckets.length,
      avgBaseFeeWei: baseN > 0 ? baseSum / BigInt(baseN) : undefined,
      avgBlobBaseFeeWei: blobN > 0 ? blobSum / BigInt(blobN) : undefined,
      avgPriorityTipWei: tipN > 0 ? tipSum / BigInt(tipN) : undefined,
      avgGasFullPct: buckets.length > 0 ? Math.round(gasSum / buckets.length) : undefined,
      avgRevertPct: denom > 0 ? Math.round((revertTx * 1000) / denom) / 10 : undefined,
      avgSetCodeTxCount: buckets.length > 0 ? Math.round(setCode / buckets.length) : undefined,
    }
  }
}
