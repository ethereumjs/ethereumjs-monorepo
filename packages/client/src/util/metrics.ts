import * as promClient from 'prom-client'

export const setupMetrics = () => {
  return {
    legacyTxGauge: new promClient.Gauge({
      name: 'legacy_transactions_in_transaction_pool',
      help: 'Number of legacy transactions in the client transaction pool',
    }),
    accessListEIP2930TxGauge: new promClient.Gauge({
      name: 'access_list_eip2930_transactions_in_transaction_pool',
      help: 'Number of access list EIP 2930 transactions in the client transaction pool',
    }),
    feeMarketEIP1559TxGauge: new promClient.Gauge({
      name: 'fee_market_eip1559_transactions_in_transaction_pool',
      help: 'Number of fee market EIP 1559 transactions in the client transaction pool',
    }),
    blobEIP4844TxGauge: new promClient.Gauge({
      name: 'blob_eip_4844_transactions_in_transaction_pool',
      help: 'Number of blob EIP 4844 transactions in the client transaction pool',
    }),
    blobEIP7594TxGauge: new promClient.Gauge({
      name: 'blob_eip_7594_transactions_in_transaction_pool',
      help: 'Number of blob EIP 7594 transactions in the client transaction pool',
    }),
    blobEIP7594ReqTotalGauge: new promClient.Gauge({
      name: 'get_blobs_requests_blobs_total',
      help: 'Number of blobs requested via GetBlobsV2',
    }),
    blobEIP7594ReqTotalInPoolGauge: new promClient.Gauge({
      name: 'get_blobs_requests_blobs_in_blobpool_total',
      help: 'Number of blobs requested via GetBlobsV2 that are present in the blobpool',
    }),
    blobEIP7594PoolHitGauge: new promClient.Gauge({
      name: 'get_blobs_requests_success_total',
      help: 'Number of times GetBlobsV2 responded with a success/hit',
    }),
    blobEIP7594PoolMissGauge: new promClient.Gauge({
      name: 'get_blobs_requests_failure_total',
      help: 'Number of times GetBlobsV2 responded with a failure/miss',
    }),
  }
}
