/** Module URL for {@link resolveThreadedNetworkModuleUrl} (Ethy is ESM-only). */
export function ethyCallerModuleUrl(): string {
  return import.meta.url
}
