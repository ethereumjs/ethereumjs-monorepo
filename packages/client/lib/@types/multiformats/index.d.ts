// Temporary fix for issue:
// error TS7016: Could not find a declaration file for module 'multiformats/cid'
declare module 'multiformats/cid' {
  class CID {}
  export { CID }
}
