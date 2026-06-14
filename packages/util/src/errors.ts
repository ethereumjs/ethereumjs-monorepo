import {
  DEFAULT_ERROR_CODE,
  EthereumJSError,
  type EthereumJSErrorLike,
  type EthereumJSErrorMetaData,
  type EthereumJSErrorObject,
  EthereumJSErrorWithoutCode,
} from '@ethereumjs/rlp'

// The EthereumJS error machinery is defined in the lowest-level package (`@ethereumjs/rlp`) and
// re-exported here so that consumers import it from `@ethereumjs/util`. The shared taxonomy — every
// EthereumJS error exposes a stable string `code` ({@link EthereumJSErrorLike}) — is documented in
// the repository `DEVELOPER.md` ("Error handling").
export {
  DEFAULT_ERROR_CODE,
  EthereumJSError,
  type EthereumJSErrorLike,
  EthereumJSErrorWithoutCode,
  type EthereumJSErrorMetaData,
  type EthereumJSErrorObject,
}
