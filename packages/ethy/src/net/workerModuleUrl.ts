/** Module URL for {@link resolveThreadedNetworkModuleUrl}. */
export function ethyCallerModuleUrl(): string {
  // Prod CJS compile uses `"module": "CommonJS"`, which rejects this syntax.
  // ESM, tsx, and vitest accept it. `@ts-ignore` is a no-op for those builds.
  // @ts-ignore TS1343
  return import.meta.url
}
