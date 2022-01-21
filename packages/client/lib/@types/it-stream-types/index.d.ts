// Temporary fix for issue:
// node_modules/it-pipe/dist/src/index.d.ts:1:26 - error TS2307:
// Cannot find module 'it-stream-types' or its corresponding type declarations.
declare module 'it-stream-types' {
  type Duplex<T, A, B> = T | A | B
  type Source<T> = T
  type Transform<A, B> = A | B
  type Sink<A, B> = A | B
  export { Duplex, Source, Transform, Sink }
}
